import { handleLeadWatchdog } from "../functions/lead-external-watchdog/handler.ts";
const assert = (ok: unknown) => { if (!ok) throw new Error("Assertion failed"); };
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status });
type Options = { healthy?: boolean; rejection?: boolean; timeout?: boolean; finishFails?: boolean };
async function fixture(options: Options, run: (calls: { path: string; body: Record<string, unknown> }[]) => Promise<void>) {
  const env = { SUPABASE_URL: "https://database.example.invalid", SUPABASE_SERVICE_ROLE_KEY: "test-service-key", SLACK_BOT_TOKEN: "test-slack-token", LEAD_WATCHDOG_TOKEN: "test-watchdog-token", LEAD_WATCHDOG_ENABLED: "true" };
  const previous = Object.fromEntries(Object.keys(env).map(key => [key,Deno.env.get(key)]));
  const original = globalThis.fetch;
  const calls: { path: string; body: Record<string, unknown> }[] = [];
  Object.entries(env).forEach(([key,value]) => Deno.env.set(key,value));
  globalThis.fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const body = JSON.parse(String(init?.body || "{}"));
    calls.push({ path: url.pathname, body });
    if (url.pathname.endsWith("trace_claim_watchdog_notice")) return json(options.healthy ? null : { id: body.p_probe ? "probe" : "heartbeat", attempt_id: "11111111-1111-4111-8111-111111111111", state: body.p_probe ? "probe" : "stale" });
    if (url.pathname.endsWith("trace_finish_watchdog_notice")) return options.finishFails ? json({ error: "failure" },500) : json(true);
    if (url.href === "https://slack.com/api/chat.postMessage") {
      if (options.timeout) throw new Error("timeout after send");
      return json(options.rejection ? { ok: false, error: "ratelimited" } : { ok: true, channel: "C08DUJ6V2G6", ts: "1234.5678" }, options.rejection ? 429 : 200);
    }
    throw new Error("Unexpected transport");
  };
  try { await run(calls); } finally {
    globalThis.fetch=original;
    Object.entries(previous).forEach(([key,value]) => value === undefined ? Deno.env.delete(key) : Deno.env.set(key,value));
  }
}
async function request(body = "{}", token = "test-watchdog-token", time = Math.floor(Date.now()/1000)) {
  const key = await crypto.subtle.importKey("raw",new TextEncoder().encode(token),{ name: "HMAC",hash: "SHA-256" },false,["sign"]);
  const signature = Array.from(new Uint8Array(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(`${time}.${body}`))),n=>n.toString(16).padStart(2,"0")).join("");
  return new Request("https://edge.example.invalid", { method: "POST", headers: { "X-Lead-Watchdog-Signature": `t=${time},v1=${signature}` }, body });
}
Deno.test("watchdog rejects unauthenticated calls and arbitrary message input", () => fixture({}, async calls => {
  assert((await handleLeadWatchdog(await request("{}","wrong"))).status===401);
  assert((await handleLeadWatchdog(await request('{"text":"injected"}'))).status===400);
  assert(calls.length===0);
}));
Deno.test("healthy watchdog checks do not send Slack", () => fixture({ healthy: true }, async calls => {
  assert((await handleLeadWatchdog(await request())).status===200);
  assert(calls.length===1 && calls[0].path.endsWith("trace_claim_watchdog_notice"));
}));
Deno.test("watchdog confirms one fixed notice with no mentions or commercial requests", () => fixture({}, async calls => {
  assert((await handleLeadWatchdog(await request())).status===200);
  assert(calls.length===3 && calls[1].body.channel==="C08DUJ6V2G6");
  assert(!JSON.stringify(calls[1].body).includes("<!"));
  assert(calls[2].body.p_outcome==="confirmed");
}));
Deno.test("timeout is recorded as uncertain without resending", () => fixture({ timeout: true }, async calls => {
  assert((await handleLeadWatchdog(await request())).status===503);
  assert(calls.length===3 && calls[2].body.p_outcome==="uncertain");
}));
Deno.test("explicit Slack rejection is distinct from uncertain delivery", () => fixture({ rejection: true }, async calls => {
  assert((await handleLeadWatchdog(await request())).status===503);
  assert(calls[2].body.p_outcome==="rejected");
}));
Deno.test("lost database acknowledgement cannot claim success", () => fixture({ finishFails: true }, async calls => {
  assert((await handleLeadWatchdog(await request())).status===503);
  assert(calls.filter(c=>c.path.includes("chat.postMessage")).length===1);
}));
Deno.test("authenticated probe is explicitly labelled and isolated", () => fixture({}, async calls => {
  assert((await handleLeadWatchdog(await request('{"probe":true}'))).status===200);
  assert(calls[0].body.p_probe===true && calls[2].body.p_id==="probe");
  assert(String(calls[1].body.text).includes("No es una incidencia"));
}));

Deno.test("signature binds the exact body and expires after three minutes", () => fixture({}, async calls => {
  const signed = await request();
  const tampered = new Request(signed.url,{ method: "POST",headers: signed.headers,body: '{"probe":true}' });
  assert((await handleLeadWatchdog(tampered)).status===401);
  assert((await handleLeadWatchdog(await request("{}","test-watchdog-token",Math.floor(Date.now()/1000)-181))).status===401);
  assert(calls.length===0);
}));
