import { handleLeadIntake } from "../functions/lead-intake/handler.ts";
import { handleLeadEnrichment } from "../functions/lead-enrichment-worker/handler.ts";

const id = "f220f4b5-81be-4bde-8e73-21dd42a61000";
const token = "a".repeat(64);
const lead = { name: "QA Local", company_name: "Example", email: "qa@example.invalid", ccity: "Santiago", page_path: "/restaurantes", utm_term: "restaurant" };
const assert = (condition: unknown, message: string) => { if (!condition) throw new Error(message); };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
type Options = { claim?: boolean; slackThrows?: boolean; unauthorized?: boolean; submitError?: boolean; worker?: boolean };

async function fixture(options: Options, test: (calls: { path: string; body: Record<string, unknown> }[]) => Promise<void>) {
  const env = { SUPABASE_URL: "https://database.example.invalid", SUPABASE_SERVICE_ROLE_KEY: "local-test-key", SLACK_BOT_TOKEN: "local-test-slack", LEAD_INTAKE_ENABLED: "true", LEAD_TRACEABILITY_WORKER_TOKEN: "local-worker-token", LEAD_SLACK_ENRICHMENT_ENABLED: options.worker ? "true" : "false" };
  const oldEnv = Object.fromEntries(Object.keys(env).map(key => [key, Deno.env.get(key)]));
  const originalFetch = globalThis.fetch;
  const calls: { path: string; body: Record<string, unknown> }[] = [];
  for (const [key, value] of Object.entries(env)) Deno.env.set(key, value);
  globalThis.fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const body = typeof init?.body === "string" ? JSON.parse(init.body) : {};
    calls.push({ path: url.pathname, body });
    if (url.origin === "https://slack.com" && ["/api/chat.postMessage", "/api/chat.update"].includes(url.pathname)) {
      if (options.slackThrows) throw new Error("ambiguous timeout");
      return json({ ok: true, channel: "C08DUJ6V2G6", ts: "1234.5678" });
    }
    assert(url.origin === "https://database.example.invalid", "No unexpected external destination");
    if (url.pathname.endsWith("/trace_claim_slack_deliveries")) return json([{ id: 9, submission_id: id, destination: "slack_enrichment", lease_id: "fixture-lease", revision: 3 }]);
    if (url.pathname.endsWith("/trace_finish_delivery")) return json(true);
    if (url.pathname === "/rest/v1/lead_traceability_health") return new Response(null, { status: 204 });
    if (url.pathname === "/rest/v1/lead_submissions" && init?.method === "GET") return json({ id, lead_id: 42, status: "persisted", slack_channel_id: "C08DUJ6V2G6", slack_message_ts: "1234.5678", slack_initial_message: { text: "Initial notice", blocks: [{ type: "section", text: { type: "mrkdwn", text: "<!channel> Contact" } }] } });
    if (url.pathname === "/rest/v1/leads") return json({ facturas_compra_mes: 225 });
    if (url.pathname === "/rest/v1/lead_meetings") return json([]);
    if (url.pathname.endsWith("/trace_prepare_submission")) return json({ id, status: "pending", attribution: null });
    if (url.pathname.endsWith("/trace_claim_initial_slack")) return json(options.claim !== false);
    if (url.pathname.endsWith("/trace_submit_lead")) return options.submitError ? json({ code: "XX000", message: "fixture failure" }, 500) : json(42);
    if (url.pathname.endsWith("/trace_authorize_submission")) return options.unauthorized ? json({ code: "28000", message: "fixture unauthorized" }, 401) : json({ id, lead_id: 42, status: "persisted" });
    if (url.pathname.endsWith("/trace_confirm_initial_slack") || url.pathname.endsWith("/trace_qualify_lead") || url.pathname.endsWith("/trace_queue_enrichment")) return json(null);
    if (url.pathname === "/rest/v1/lead_submissions" && init?.method === "PATCH") return new Response(null, { status: 204 });
    throw new Error(`Unexpected transport in fixture: ${url.pathname}`);
  };
  try { await test(calls); } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(oldEnv)) { if (value === undefined) Deno.env.delete(key); else Deno.env.set(key, value); }
  }
}
function request(action: string, extra: Record<string, unknown> = {}) {
  return new Request("https://local.example/lead-intake", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, submission_id: id, continuation_token: token, funnel: "classic", lead, ...extra }) });
}

Deno.test("classic prepare sends one enriched Slack notice before any lead insert", () => fixture({}, async calls => {
  const response = await handleLeadIntake(request("prepare"));
  assert(response.status === 200 && (await response.json()).ts === "1234.5678", "Slack reference returned");
  assert(!calls.some(call => call.path.endsWith("trace_submit_lead")), "Classic prepare must not move persistence earlier");
  const slack = calls.find(call => call.path === "/api/chat.postMessage");
  assert(JSON.stringify(slack?.body).includes("utm_term"), "First notice includes the fifth UTM");
  assert(!JSON.stringify(calls).includes(token), "Raw continuation never goes to database or Slack");
}));

Deno.test("One prepare persists before Slack without adding another public conversion", () => fixture({}, async calls => {
  const response = await handleLeadIntake(request("prepare", { funnel: "one", lead: { name: "QA One", company: "Example", email: "qa@example.invalid", whatsapp: "+56900000000" } }));
  assert(response.status === 200, "One preparation succeeded");
  assert(calls.findIndex(call => call.path.endsWith("trace_submit_lead")) < calls.findIndex(call => call.path === "/api/chat.postMessage"), "One persistence precedes Slack");
}));

Deno.test("classic submit returns persistence and never posts to Slack", () => fixture({}, async calls => {
  const response = await handleLeadIntake(request("submit"));
  const result = await response.json();
  assert(result.stored === true && result.id === 42, "Confirmed stored response");
  assert(!calls.some(call => call.path.startsWith("/api/")), "No notification during submit");
}));

Deno.test("failed persistence cannot return success", () => fixture({ submitError: true }, async () => {
  const response = await handleLeadIntake(request("submit"));
  assert(response.status === 503 && !(await response.json()).stored, "Failure remains visible");
}));

Deno.test("an unclaimed or ambiguous Slack delivery cannot create a second root", async () => {
  await fixture({ claim: false }, async calls => {
    await handleLeadIntake(request("prepare"));
    assert(!calls.some(call => call.path === "/api/chat.postMessage"), "No send without exclusive claim");
  });
  await fixture({ slackThrows: true }, async calls => {
    await handleLeadIntake(request("prepare"));
    assert(calls.filter(call => call.path === "/api/chat.postMessage").length === 1, "No immediate retry after ambiguity");
    assert(calls.some(call => call.body.slack_initial_state === "uncertain"), "Ambiguity is durable");
  });
});

Deno.test("authorization and qualification checks reject arbitrary updates", () => fixture({ unauthorized: true }, async calls => {
  const response = await handleLeadIntake(request("update", { update: { facturas_compra_mes: 75, requires_calendly: false } }));
  assert(response.status === 401, "Owner token required");
  assert(!calls.some(call => call.path.endsWith("trace_qualify_lead")), "No write with foreign token");
}));

Deno.test("server rollout and worker gates do not dispatch integrations", () => fixture({}, async calls => {
  Deno.env.set("LEAD_INTAKE_ENABLED", "false");
  assert((await handleLeadIntake(request("prepare"))).status === 503, "Intake starts disabled");
  assert((await handleLeadEnrichment(new Request("https://local.example/worker", { method: "POST" }))).status === 401, "Worker requires secret");
  const response = await handleLeadEnrichment(new Request("https://local.example/worker", { method: "POST", headers: { Authorization: "Bearer local-worker-token" } }));
  assert((await response.json()).enabled === false, "Worker starts disabled");
  assert(calls.length === 0, "No outgoing calls through disabled gates");
}));

Deno.test("worker updates only the original message and acknowledges its leased revision", () => fixture({ worker: true }, async calls => {
  const response = await handleLeadEnrichment(new Request("https://local.example/worker", { method: "POST", headers: { Authorization: "Bearer local-worker-token" } }));
  assert((await response.json()).delivered === 1, "Delivery was confirmed");
  const updates = calls.filter(call => call.path === "/api/chat.update");
  assert(updates.length === 1 && updates[0].body.ts === "1234.5678", "Only update the saved root");
  assert(!JSON.stringify(updates).includes("<!channel>"), "No repeated mention");
  assert(!calls.some(call => call.path === "/api/chat.postMessage"), "Enrichment cannot create a message");
  assert(calls.some(call => call.path.endsWith("trace_finish_delivery") && call.body.p_lease === "fixture-lease" && call.body.p_revision === 3 && call.body.p_error === null), "Finish exact leased revision");
}));
