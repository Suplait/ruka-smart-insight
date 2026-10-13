import { LeadRequestError, record, tokenDigest } from "./leadValidation.ts";

const eventPattern = /^https:\/\/api.calendly.com\/scheduled_events\/[a-zA-Z0-9-]+$/;
const inviteePattern = /^https:\/\/api.calendly.com\/scheduled_events\/[a-zA-Z0-9-]+\/invitees\/[a-zA-Z0-9-]+$/;

/** Calendly signs timestamp + '.' + the unmodified request body with HMAC-SHA256. */
export async function verifyCalendlySignature(raw: string, header: string | null, secret: string, now = Date.now()) {
  if (!header || !secret) return false;
  const parts = header.split(",").map(part => part.trim().split("="));
  const timestamps = parts.filter(([name]) => name === "t");
  if (timestamps.length !== 1 || !/^\d{10,}$/.test(timestamps[0][1] || "")) return false;
  const time = timestamps[0][1];
  if (Math.abs(now / 1000 - Number(time)) > 180) return false;
  const signatures = parts.filter(([name, value]) => name === "v1" && /^[a-f0-9]{64}$/i.test(value || ""));
  if (!signatures.length) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
  const payload = new TextEncoder().encode(`${time}.${raw}`);
  for (const [, signature] of signatures) {
    const bytes = Uint8Array.from(signature.match(/.{2}/g)!, byte => parseInt(byte, 16));
    if (await crypto.subtle.verify("HMAC", key, bytes, payload)) return true;
  }
  return false;
}

function date(value: unknown, required = true): string | null {
  if (typeof value === "string" && Number.isFinite(Date.parse(value))) return new Date(value).toISOString();
  if (required) throw new LeadRequestError("Invalid Calendly date");
  return null;
}

export async function projectCalendlyEvidence(input: unknown) {
  const body = record(input);
  if (!["invitee.created", "invitee.canceled"].includes(String(body.event))) return null;
  const invitee = record(body.payload);
  if (typeof invitee.uri !== "string" || !inviteePattern.test(invitee.uri) || typeof invitee.event !== "string" || !eventPattern.test(invitee.event) || invitee.uri.split("/invitees/")[0] !== invitee.event) throw new LeadRequestError("Invalid Calendly reference");
  const scheduled = invitee.scheduled_event && typeof invitee.scheduled_event === "object" && !Array.isArray(invitee.scheduled_event) ? record(invitee.scheduled_event) : {};
  const email = typeof invitee.email === "string" ? invitee.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new LeadRequestError("Invalid Calendly contact");
  const oldInvitee = typeof invitee.old_invitee === "string" && inviteePattern.test(invitee.old_invitee) ? invitee.old_invitee : null;
  const newInvitee = typeof invitee.new_invitee === "string" && inviteePattern.test(invitee.new_invitee) ? invitee.new_invitee : null;
  return {
    invitee_uri: invitee.uri, event_uri: invitee.event,
    status: body.event === "invitee.canceled" || invitee.status === "canceled" ? "canceled" : "active",
    booked_at: date(invitee.created_at), starts_at: date(scheduled.start_time, false),
    source_updated_at: date(invitee.updated_at || body.created_at),
    old_invitee_uri: oldInvitee, new_invitee_uri: newInvitee,
    invitee_email_hash: await tokenDigest(email),
  };
}
