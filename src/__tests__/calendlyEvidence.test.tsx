import { describe, expect, it } from "vitest";
import { projectCalendlyEvidence, verifyCalendlySignature } from "../../supabase/functions/_shared/calendlyEvidence";

const now = Date.parse("2026-10-13T15:00:00Z");
const timestamp = String(now / 1000);
const secret = "local-test-only-signing-key";
async function signature(raw: string, time = timestamp) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${time}.${raw}`));
  return `t=${time},v1=${Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("")}`;
}
const payload = {
  event: "invitee.created", created_at: "2026-10-13T15:00:00Z",
  payload: { uri: "https://api.calendly.com/scheduled_events/event-1/invitees/person-1", event: "https://api.calendly.com/scheduled_events/event-1", email: " Calendar@Example.Invalid ", created_at: "2026-10-13T15:00:00Z", updated_at: "2026-10-13T15:00:00Z", status: "active", cancel_url: "SECRET", questions_and_answers: [{ answer: "PRIVATE" }], scheduled_event: { start_time: "2026-10-14T15:00:00Z" } },
};

describe("authoritative Calendly evidence", () => {
  it("verifies the unmodified signed body and rejects altered, stale, future, missing or malformed signatures", async () => {
    const raw = JSON.stringify(payload);
    const header = await signature(raw);
    expect(await verifyCalendlySignature(raw, header, secret, now)).toBe(true);
    expect(await verifyCalendlySignature(`${raw} `, header, secret, now)).toBe(false);
    expect(await verifyCalendlySignature(raw, header, secret, now + 181000)).toBe(false);
    expect(await verifyCalendlySignature(raw, header, secret, now - 181000)).toBe(false);
    expect(await verifyCalendlySignature(raw, null, secret, now)).toBe(false);
    expect(await verifyCalendlySignature(raw, `${header},t=${timestamp}`, secret, now)).toBe(false);
    expect(await verifyCalendlySignature(raw, `t=${timestamp},v1=invalid`, secret, now)).toBe(false);
    expect(await verifyCalendlySignature(raw, header, "other-secret", now)).toBe(false);
  });

  it("retains only identifiers, meeting state and a normalized email hash", async () => {
    const evidence = await projectCalendlyEvidence(payload);
    expect(evidence).toMatchObject({ status: "active", starts_at: "2026-10-14T15:00:00.000Z" });
    expect(evidence.invitee_email_hash).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(evidence)).not.toMatch(/SECRET|PRIVATE|@Example/);
    expect((await projectCalendlyEvidence({ ...payload, event: "invitee.canceled" })).status).toBe("canceled");
  });

  it("rejects mismatched event/invitee references and ignores unrelated event types", async () => {
    expect(await projectCalendlyEvidence({ event: "unrelated" })).toBeNull();
    await expect(projectCalendlyEvidence({ ...payload, payload: { ...payload.payload, event: "https://api.calendly.com/scheduled_events/another" } })).rejects.toThrow();
    await expect(projectCalendlyEvidence({ ...payload, payload: { ...payload.payload, email: "invalid" } })).rejects.toThrow();
  });
});
