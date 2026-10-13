import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { verifyCalendlySignature as verifyTimestampedSignature } from "../_shared/calendlyEvidence.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
});
const channel = "C08DUJ6V2G6";
const notices: Record<string, string> = {
  stale: "⚠️ Trazabilidad: comprobación externa\nEl worker de Slack/ClickUp lleva al menos 30 minutos sin confirmar actividad. Este aviso sale desde Supabase, independiente de n8n. Responsable: equipo Ruka / Camilo. Revisar disponibilidad de n8n y el workflow de enriquecimiento; no reejecutar captación ni crear leads para recuperarlo.\nhttps://ruka.app.n8n.cloud/workflow/lCtphAXKkdzgMa5h",
  healthy: "✅ Trazabilidad: actividad del worker recuperada\nSupabase vuelve a observar actividad reciente del worker de Slack/ClickUp. Esto confirma el heartbeat; no asegura que todas las entregas pendientes estén resueltas.",
  probe: "🧪 Prueba de trazabilidad — comprobador externo\nEnvío desde Supabase a Slack para validar el aviso independiente de n8n. No es una incidencia, no es un lead y no requiere acción comercial.",
};

export async function handleLeadWatchdog(request: Request) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const token = Deno.env.get("LEAD_WATCHDOG_TOKEN");
  const supplied = request.headers.get("X-Lead-Watchdog-Signature");
  if (!token || !supplied || supplied.length > 200) return json({ error: "Unauthorized" }, 401);
  const raw = await request.text();
  if (raw.length > 100) return json({ error: "Invalid request" }, 400);
  if (!await verifyTimestampedSignature(raw,supplied,token)) return json({ error: "Unauthorized" }, 401);
  if (Deno.env.get("LEAD_WATCHDOG_ENABLED") !== "true") return json({ enabled: false });
  const slackToken = Deno.env.get("SLACK_BOT_TOKEN");
  if (!slackToken) return json({ error: "Notification unavailable" }, 503);
  let probe = false;
  try {
    const input = JSON.parse(raw || "{}");
    if (!input || Array.isArray(input) || typeof input !== "object" || Object.keys(input).some(key => key !== "probe") || (input.probe !== undefined && typeof input.probe !== "boolean")) return json({ error: "Invalid request" }, 400);
    probe = input.probe === true;
  } catch { return json({ error: "Invalid request" }, 400); }
  const boundedFetch: typeof fetch = (input, init) => fetch(input, { ...init, redirect: "error", signal: AbortSignal.timeout(10000) });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false }, global: { fetch: boundedFetch } });
  try {
    const { data: notice, error } = await db.rpc("trace_claim_watchdog_notice", { p_probe: probe });
    if (error) return json({ error: "Health check unavailable" }, 503);
    if (!notice) return json({ notified: false });
    if (!notices[notice.state]) return json({ error: "Invalid notice" }, 503);
    let outcome = "uncertain";
    try {
      const response = await boundedFetch("https://slack.com/api/chat.postMessage", {
        method: "POST", headers: { Authorization: `Bearer ${slackToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ channel, text: notices[notice.state], unfurl_links: false, unfurl_media: false }),
      });
      const body = await response.json();
      if (response.ok && body.ok === true && body.channel === channel && /^\d+\.\d+$/.test(body.ts)) outcome = "confirmed";
      else if (body.ok === false) outcome = "rejected";
    } catch { /* Ambiguous transport: keep the reservation; never blindly repost. */ }
    const { data: finished, error: finishError } = await db.rpc("trace_finish_watchdog_notice", { p_id: notice.id, p_attempt: notice.attempt_id, p_outcome: outcome });
    if (finishError || !finished) return json({ error: "Confirmation unavailable" }, 503);
    return json({ notified: outcome === "confirmed", delivery: outcome }, outcome === "confirmed" ? 200 : 503);
  } catch { return json({ error: "Health check unavailable" }, 503); }
}
