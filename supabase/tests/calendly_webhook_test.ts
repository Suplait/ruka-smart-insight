import { handleCalendlyWebhook } from "../functions/lead-calendly-webhook/handler.ts";
const assert = (value: unknown, label: string) => { if (!value) throw new Error(label); };
const secret = "local-fixture-signature-secret";
const eventUri = "https://api.calendly.com/scheduled_events/local-event";
const payload = { event: "invitee.created", payload: { uri: eventUri + "/invitees/local-invitee", event: eventUri, email: "qa@example.invalid", created_at: "2026-10-13T17:00:00Z", updated_at: "2026-10-13T17:00:00Z", scheduled_event: { start_time: "2026-10-14T17:00:00Z" }, cancel_url: "private-link", questions_and_answers: [{ answer: "private-answer" }] } };
async function request(body: unknown, valid = true) {
  const raw = JSON.stringify(body), timestamp = Math.floor(Date.now() / 1000);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const hash = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${raw}`)));
  const signature = Array.from(hash, n => n.toString(16).padStart(2, "0")).join("");
  return new Request("https://edge.example.invalid", { method: "POST", headers: { "Content-Type": "application/json", "Calendly-Webhook-Signature": `t=${timestamp},v1=${valid ? signature : "0".repeat(64)}` }, body: raw });
}
async function fixture(failedCommit: boolean, run: (calls: Record<string, unknown>[]) => Promise<void>) {
  const env = { SUPABASE_URL: "https://database.example.invalid", SUPABASE_SERVICE_ROLE_KEY: "local-service", LEAD_CALENDLY_SIGNING_KEY: secret, LEAD_CALENDLY_ENABLED: "true" };
  const before = Object.fromEntries(Object.keys(env).map(k => [k, Deno.env.get(k)]));
  const original = globalThis.fetch, calls: Record<string, unknown>[] = [];
  for (const [k, v] of Object.entries(env)) Deno.env.set(k, v);
  globalThis.fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    assert(url.origin === "https://database.example.invalid" && url.pathname === "/rest/v1/rpc/trace_record_calendly", "Only the evidence transaction can be called");
    assert(typeof init?.body === "string", "RPC body required");
    calls.push(JSON.parse(init!.body as string));
    return new Response(JSON.stringify(failedCommit ? { message: "fixture failure" } : null), { status: failedCommit ? 500 : 200, headers: { "Content-Type": "application/json" } });
  };
  try { await run(calls); } finally {
    globalThis.fetch = original;
    for (const [k, v] of Object.entries(before)) { if (v === undefined) Deno.env.delete(k); else Deno.env.set(k, v); }
  }
}
Deno.test("signed Calendly webhook commits a minimal projection before acknowledging", () => fixture(false, async calls => {
  const response = await handleCalendlyWebhook(await request(payload));
  assert(response.status === 200 && (await response.json()).received && calls.length === 1, "Acknowledgement follows transaction");
  assert(calls[0].p_source === "calendly", "Record provider source");
  assert(!/qa@example.invalid|private-answer|private-link/.test(JSON.stringify(calls)), "No raw contact, questions or cancellation link persisted");
}));
Deno.test("failed calendar persistence requests a provider retry", () => fixture(true, async calls => {
  assert((await handleCalendlyWebhook(await request(payload))).status === 503 && calls.length === 1, "No false acknowledgement");
}));
Deno.test("invalid signatures and disabled webhook cannot write evidence", () => fixture(false, async calls => {
  assert((await handleCalendlyWebhook(await request(payload, false))).status === 401, "Invalid signature rejected");
  Deno.env.set("LEAD_CALENDLY_ENABLED", "false");
  assert((await handleCalendlyWebhook(await request(payload))).status === 503 && calls.length === 0, "Disabled receiver performs no writes");
}));
Deno.test("signed unsupported event is a write-free connectivity check", () => fixture(false, async calls => {
  const response = await handleCalendlyWebhook(await request({ event: "ruka.connectivity_probe" }));
  assert(response.status === 200 && (await response.json()).ignored && calls.length === 0, "No synthetic meeting or integration dispatch");
}));
