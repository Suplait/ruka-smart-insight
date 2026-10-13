import { z } from "zod";

// This is an independent acquisition record. It never writes to dataLayer,
// changes the legacy UTM store, or sends an analytics/advertising event.
const STORAGE_KEY = "ruka_lead_attribution_v1";
const SESSION_KEY = "ruka_lead_session_v1";
const RETENTION_MS = 90 * 24 * 60 * 60 * 1000;
const SESSION_IDLE_MS = 30 * 60 * 1000;
const MAX_PAGES = 20;
const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
const clickKeys = ["gclid", "gbraid", "wbraid", "fbclid"] as const;
const boundedValue = z.string().max(500).nullable();
const touchSchema = z.object({
  observed_at: z.string().datetime(),
  page: z.string().max(1000),
  referrer_origin: z.string().max(500).nullable(),
  utm_source: boundedValue,
  utm_medium: boundedValue,
  utm_campaign: boundedValue,
  utm_content: boundedValue,
  utm_term: boundedValue,
  gclid: boundedValue,
  gbraid: boundedValue,
  wbraid: boundedValue,
  fbclid: boundedValue,
});
const historySchema = z.array(z.object({ page: z.string().max(1000), observed_at: z.string().datetime() })).max(MAX_PAGES);
const sessionSchema = z.object({
  session_id: z.string().uuid().nullable(),
  last_seen_at: z.number().finite(),
  entry: touchSchema,
  pages: historySchema,
});
const storedSchema = z.object({
  expires_at: z.number().finite(),
  anonymous_id: z.string().uuid().nullable(),
  first_touch: touchSchema,
  last_non_direct_touch: touchSchema.nullable(),
});

export type LeadTouch = z.infer<typeof touchSchema>;
export type LeadAttribution = {
  version: 1;
  anonymous_id: string | null;
  session_id: string | null;
  first_touch: LeadTouch;
  session_entry: LeadTouch;
  last_non_direct_touch: LeadTouch | null;
  conversion_page: string;
  captured_at: string;
  observed_pages: z.infer<typeof historySchema>;
  history_is_partial: true;
  analytics_consent: "unknown" | "granted" | "denied";
  ga_client_id: string | null;
  ga_session_id: string | null;
};

let memory: z.infer<typeof storedSchema> | null = null;
let session: z.infer<typeof sessionSchema> | null = null;

function readStorage<T>(kind: "localStorage" | "sessionStorage", key: string, schema: z.ZodType<T>): T | null {
  try {
    const parsed = schema.safeParse(JSON.parse(window[kind].getItem(key) || "null"));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

function saveStorage(kind: "localStorage" | "sessionStorage", key: string, value: unknown) {
  try {
    window[kind].setItem(key, JSON.stringify(value));
  } catch {
    // Private browsing, quota errors, and denied storage cannot block a lead.
  }
}

function ownId(): string | null {
  try {
    return window.crypto.randomUUID();
  } catch {
    return null;
  }
}

function pageUrl(url: URL): string {
  return `${url.origin}${url.pathname}`.slice(0, 1000);
}

function readTouch(now: number): LeadTouch {
  const url = new URL(window.location.href);
  let referrerOrigin: string | null = null;
  try {
    const referrer = new URL(document.referrer);
    const sameSite = referrer.hostname.replace(/^www\./, "") === url.hostname.replace(/^www\./, "");
    if (!sameSite && ["http:", "https:"].includes(referrer.protocol)) referrerOrigin = referrer.origin;
  } catch {
    // An absent referrer is unknown, not proof of direct or organic traffic.
  }
  const values = Object.fromEntries([...campaignKeys, ...clickKeys].map(key => [key, url.searchParams.get(key)?.trim().slice(0, 500) || null]));
  return touchSchema.parse({ observed_at: new Date(now).toISOString(), page: pageUrl(url), referrer_origin: referrerOrigin, ...values });
}

/** Call on observed route changes and at form submission; all failures are isolated. */
export function captureLeadAttribution(): LeadAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const now = Date.now();
    const touch = readTouch(now);
    memory ??= readStorage("localStorage", STORAGE_KEY, storedSchema);
    session ??= readStorage("sessionStorage", SESSION_KEY, sessionSchema);
    if (!memory || memory.expires_at <= now || memory.expires_at > now + RETENTION_MS) {
      memory = { expires_at: now + RETENTION_MS, anonymous_id: ownId(), first_touch: touch, last_non_direct_touch: null };
      session = null;
    }
    const newSession = !session || now - session.last_seen_at >= SESSION_IDLE_MS || session.last_seen_at > now;
    if (newSession) session = { session_id: ownId(), last_seen_at: now, entry: touch, pages: [] };
    // An external document referrer applies to the session entry only. SPA route
    // changes retain document.referrer and must not manufacture additional visits.
    const hasCampaign = [...campaignKeys, ...clickKeys].some(key => touch[key]);
    const changedCampaign = !memory.last_non_direct_touch || [...campaignKeys, ...clickKeys].some(key => touch[key] !== memory.last_non_direct_touch[key]);
    if ((hasCampaign && (newSession || changedCampaign)) || (newSession && touch.referrer_origin)) {
      memory.last_non_direct_touch = touch;
    }
    session.last_seen_at = now;
    if (session.pages[session.pages.length - 1]?.page !== touch.page) {
      session.pages.push({ page: touch.page, observed_at: touch.observed_at });
      session.pages = session.pages.slice(-MAX_PAGES);
    }
    saveStorage("localStorage", STORAGE_KEY, memory);
    saveStorage("sessionStorage", SESSION_KEY, session);
    return {
      version: 1,
      anonymous_id: memory.anonymous_id,
      session_id: session.session_id,
      first_touch: structuredClone(memory.first_touch),
      session_entry: structuredClone(session.entry),
      last_non_direct_touch: memory.last_non_direct_touch ? structuredClone(memory.last_non_direct_touch) : null,
      conversion_page: touch.page,
      captured_at: touch.observed_at,
      observed_pages: structuredClone(session.pages),
      history_is_partial: true,
      // No CMP integration is configured yet. Never infer consent or invent GA IDs.
      analytics_consent: "unknown",
      ga_client_id: null,
      ga_session_id: null,
    };
  } catch {
    return null;
  }
}
