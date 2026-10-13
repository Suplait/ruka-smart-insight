export type SlackBlock = {
  type: string;
  block_id?: string;
  text?: { type: string; text: string; emoji?: boolean };
  fields?: { type: string; text: string }[];
  elements?: ({ type: string; text: string } | { type: "button"; text: { type: "plain_text"; text: string; emoji?: boolean }; style?: "primary"; url: string; action_id: string })[];
  accessory?: { type: "image"; image_url: string; alt_text: string };
};

type JsonObject = Record<string, unknown>;
const object = (value: unknown): JsonObject => value && typeof value === "object" && !Array.isArray(value) ? value as JsonObject : {};
const value = (input: unknown, limit = 500): string => typeof input === "string" ? input.trim().slice(0, limit) : "";

export const escapeSlack = (input: unknown, limit = 500): string => value(input, limit)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").slice(0, limit);

const utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

function safePage(input: unknown): string {
  const text = value(input, 2000);
  if (text.startsWith("/") && !text.startsWith("//")) return text.split(/[?#]/, 1)[0].slice(0, 300);
  try {
    const url = new URL(text);
    if (!["https:", "http:"].includes(url.protocol)) return "";
    return `${url.origin}${url.pathname}`.slice(0, 300);
  } catch {
    return "";
  }
}

function chileTime(input: unknown): string {
  const date = new Date(value(input));
  return Number.isNaN(date.getTime()) ? "Fecha no disponible" : new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(date) + " (Chile)";
}

function touchSummary(touch: JsonObject): string {
  const source = [touch.utm_source, touch.utm_medium].map(v => escapeSlack(v, 150)).filter(Boolean).join(" / ");
  const campaign = escapeSlack(touch.utm_campaign, 150);
  const referrer = safePage(touch.referrer_origin);
  return `${source || (referrer ? `Referencia: ${escapeSlack(referrer)}` : "Origen no determinado")}${campaign ? ` · ${campaign}` : ""}`;
}

export type LeadVisibility = {
  attribution?: unknown;
  legacyUtms?: unknown;
  conversionPage?: string;
  submissionId?: string;
  leadId?: number | null;
  persisted?: boolean;
  failed?: boolean;
  clickupTaskId?: string | null;
  invoiceCount?: number | null;
  confirmedMeetings?: { status: "active" | "canceled"; starts_at: string | null }[];
};

/** Pure, bounded Slack projection; no tokens, raw click IDs, contact data or arbitrary URLs. */
export function buildLeadVisibilityBlocks(context: LeadVisibility): SlackBlock[] {
  const attribution = object(context.attribution);
  const captured = attribution.version === 1;
  const first = object(attribution.first_touch);
  const current = object(attribution.session_entry);
  const last = object(attribution.last_non_direct_touch);
  const campaign = captured ? (Object.keys(last).length ? last : current) : object(context.legacyUtms);
  const utms = utmKeys.filter(key => value(campaign[key])).map(key => `*${key}:* ${escapeSlack(campaign[key], 250)}`);
  const blocks: SlackBlock[] = [
    { type: "divider" },
    { type: "section", text: { type: "mrkdwn", text:
      `*Origen observado*\n${captured ? touchSummary(campaign) : "Atribución pendiente"}\n${utms.length ? utms.join("\n") : "UTMs no capturadas"}` } },
  ];
  if (captured) {
    const firstPage = safePage(first.page);
    const conversionPage = safePage(attribution.conversion_page || context.conversionPage);
    const pages = Array.isArray(attribution.observed_pages) ? attribution.observed_pages.slice(-5).map(item => safePage(object(item).page)).filter(Boolean) : [];
    blocks.push({ type: "section", text: { type: "mrkdwn", text:
      `*Entrada:* ${escapeSlack(firstPage) || "No disponible"}\n*Conversión:* ${escapeSlack(conversionPage) || "No disponible"}\n*Capturado:* ${chileTime(attribution.captured_at)}${pages.length ? `\n*Recorrido observado (parcial):* ${pages.map(p => escapeSlack(p, 180)).join(" → ")}` : ""}` } });
    if (value(first.observed_at) !== value(last.observed_at) && Object.keys(last).length) {
      const firstUtms = utmKeys.filter(key => value(first[key])).map(key => `${key}: ${escapeSlack(first[key], 150)}`).join(" · ");
      blocks.push({ type: "section", text: { type: "mrkdwn", text:
        `*Primera entrada:* ${touchSummary(first)} · ${chileTime(first.observed_at)}${firstUtms ? `\n${firstUtms}` : ""}\n*Último contacto no directo:* ${touchSummary(last)} · ${chileTime(last.observed_at)}` } });
    }
    const googleClick = [first, current, last].some(t => ["gclid", "gbraid", "wbraid"].some(key => value(t[key])));
    const metaClick = [first, current, last].some(t => value(t.fbclid));
    const consent = ["granted", "denied"].includes(value(attribution.analytics_consent)) ? value(attribution.analytics_consent) : "unknown";
    blocks.push({ type: "context", elements: [{ type: "mrkdwn", text:
      attribution.detail_expired === true
        ? `Identificadores y recorrido: detalle eliminado tras 90 días · Consentimiento analytics: ${consent}`
        : `Clic Google: ${googleClick ? "identificador presente" : "no capturado"} · Meta: ${metaClick ? "identificador presente" : "no capturado"} · IDs GA4: ${value(attribution.ga_client_id) && value(attribution.ga_session_id) ? "disponibles" : "no disponibles"} · Consentimiento analytics: ${consent}` }] });
  }
  const state = context.failed ? "Persistencia fallida; requiere revisión" : context.persisted ? "Lead guardado" : "Persistencia pendiente";
  const identifiers = [Number.isSafeInteger(context.leadId) ? `Lead ID: ${context.leadId}` : "", context.submissionId ? `Submission: ${escapeSlack(context.submissionId, 36)}` : ""].filter(Boolean);
  const taskId = value(context.clickupTaskId, 50);
  if (/^[a-zA-Z0-9]+$/.test(taskId)) identifiers.push(`<https://app.clickup.com/t/${taskId}|Ver tarea en ClickUp>`);
  blocks.push({ type: "section", text: { type: "mrkdwn", text: `*Trazabilidad:* ${state}${identifiers.length ? `\n${identifiers.join(" · ")}` : ""}` } });
  const meetings = context.confirmedMeetings || [];
  const active = meetings.filter(meeting => meeting.status === "active");
  const schedule = active.length ? active.slice(0, 3).map(meeting => `Confirmada por Calendly: ${chileTime(meeting.starts_at)}`).join("\n")
    : meetings.length ? "Agenda cancelada; sin otra reunión confirmada" : "Sin agenda confirmada hasta ahora";
  blocks.push({ type: "section", text: { type: "mrkdwn", text:
    `${Number.isFinite(context.invoiceCount) ? `*Volumen registrado:* ${context.invoiceCount} facturas/mes\n` : ""}*Agenda:* ${schedule}` } });
  return blocks.map((block, index) => ({ ...block, block_id: `ruka_visibility_${index}` }));
}
