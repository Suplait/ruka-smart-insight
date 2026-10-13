export type LeadInput = Record<string, string | null>;
export type Funnel = "classic" | "one";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class LeadRequestError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

export function record(input: unknown): Record<string, unknown> {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw new LeadRequestError("Expected an object");
  return input as Record<string, unknown>;
}

export function continuation(input: Record<string, unknown>) {
  if (typeof input.submission_id !== "string" || !uuid.test(input.submission_id)) throw new LeadRequestError("Invalid submission ID");
  if (typeof input.continuation_token !== "string" || !/^[a-f0-9]{64}$/.test(input.continuation_token)) throw new LeadRequestError("Invalid continuation token", 401);
  return { submissionId: input.submission_id, token: input.continuation_token };
}

function text(input: unknown, max: number, required: true): string;
function text(input: unknown, max: number, required?: false): string | null;
function text(input: unknown, max: number, required?: boolean): string | null;
function text(input: unknown, max: number, required = false): string | null {
  if (input === undefined || input === null || input === "") {
    if (required) throw new LeadRequestError("Missing lead field");
    return null;
  }
  if (typeof input !== "string" || input.length > max) throw new LeadRequestError("Invalid lead field");
  const result = input.trim();
  if (required && !result) throw new LeadRequestError("Missing lead field");
  return result || null;
}

function path(input: unknown, fallback: string) {
  const candidate = text(input, 1000) || fallback;
  if (!candidate.startsWith("/") || candidate.startsWith("//")) throw new LeadRequestError("Invalid landing path");
  return candidate.split(/[?#]/, 1)[0];
}

export function validateLead(input: unknown, funnel: Funnel): LeadInput {
  const data = record(input);
  const lead: LeadInput = {
    name: text(data.name, 120, true),
    email: text(data.email, 254, true),
    whatsapp: text(data.whatsapp, 32, funnel === "one"),
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email || "")) throw new LeadRequestError("Invalid email");
  if (funnel === "classic") {
    Object.assign(lead, {
      company_name: text(data.company_name, 160, true), ccity: text(data.ccity, 120, true),
      first_name: text(data.first_name, 120), last_name: text(data.last_name, 120),
      codigo_promocional: text(data.codigo_promocional, 100), page_path: path(data.page_path, "/register"),
    });
  } else {
    Object.assign(lead, { company: text(data.company, 160, true), landing_path: path(data.landing_path, "/one/contacto") });
    if ((lead.name || "").length < 2 || (lead.company || "").length < 2 || (lead.whatsapp || "").length < 8) throw new LeadRequestError("Invalid One lead");
  }
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) lead[key] = text(data[key], 500);
  return lead;
}

function safeUrl(input: unknown, originOnly = false) {
  if (typeof input !== "string") return null;
  try {
    const url = new URL(input);
    if (!["https:", "http:"].includes(url.protocol)) return null;
    return (originOnly ? url.origin : `${url.origin}${url.pathname}`).slice(0, 1000);
  } catch { return null; }
}

function timestamp(input: unknown) {
  if (typeof input !== "string" || !Number.isFinite(Date.parse(input))) return null;
  return new Date(input).toISOString();
}

export function projectAttribution(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const data = record(input);
  if (data.version !== 1) return null;
  const limited = (input: unknown, max = 500) => typeof input === "string" ? input.slice(0, max) : null;
  const touch = (input: unknown) => {
    if (!input || typeof input !== "object" || Array.isArray(input)) return null;
    const data = record(input);
    const result: Record<string, unknown> = { page: safeUrl(data.page), observed_at: timestamp(data.observed_at), referrer_origin: safeUrl(data.referrer_origin, true) };
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "gbraid", "wbraid", "fbclid"]) result[key] = limited(data[key]);
    return result;
  };
  const ownId = (input: unknown) => typeof input === "string" && uuid.test(input) ? input : null;
  const consent = data.analytics_consent === "granted" || data.analytics_consent === "denied" ? data.analytics_consent : "unknown";
  return {
    version: 1, anonymous_id: ownId(data.anonymous_id), session_id: ownId(data.session_id),
    first_touch: touch(data.first_touch), session_entry: touch(data.session_entry), last_non_direct_touch: touch(data.last_non_direct_touch),
    captured_at: timestamp(data.captured_at), conversion_page: safeUrl(data.conversion_page),
    history_is_partial: true,
    observed_pages: Array.isArray(data.observed_pages) ? data.observed_pages.slice(-20).map(item => {
      const page = item && typeof item === "object" && !Array.isArray(item) ? record(item) : {};
      return { page: safeUrl(page.page), observed_at: timestamp(page.observed_at) };
    }) : [],
    analytics_consent: consent,
    ga_client_id: consent === "granted" ? limited(data.ga_client_id, 100) : null,
    ga_session_id: consent === "granted" ? limited(data.ga_session_id, 100) : null,
  };
}

export async function tokenDigest(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}
