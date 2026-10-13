import { calendlyRequestUrl, reconcileCalendlyPage, type ReconcileState } from "../functions/_shared/calendlyReconciliation.ts";
import { handleCalendlyReconciliation } from "../functions/lead-calendly-reconcile/handler.ts";

const assert = (v: unknown, message = "Assertion failed") => { if (!v) throw new Error(message); };
const user = "https://api.calendly.com/users/local-user";
const event = { uri: "https://api.calendly.com/scheduled_events/local-event", status: "active" as const, start_time: "2026-10-14T15:00:00Z", updated_at: "2026-10-13T15:00:00Z" };
const invitee = { uri: event.uri + "/invitees/local-person", event: event.uri, email: "qa@example.invalid", status: "active", created_at: "2026-10-12T15:00:00Z", updated_at: "2026-10-13T15:00:00Z", questions_and_answers: [{answer:"must-not-persist"}], cancel_url: "must-not-persist" };
const initial = (): ReconcileState => ({ user_uri: user, min_start_time: "2026-07-15T15:00:00Z", event_status: "active", event_page_token: null, event_pages_done: false, events: [], invitee_status: "active", invitee_page_token: null, complete: false });
const page = (collection: unknown[], cursor: string | null = null) => ({ collection, pagination: { next_page_token: cursor, next_page: "https://untrusted.example/never-follow" } });
const json = (v: unknown, status = 200, extra = {}) => new Response(JSON.stringify(v), {status, headers: {"Content-Type":"application/json", ...extra}});

Deno.test("calendar pagination stays on Calendly and preserves scope across cursors", async () => {
  const s = initial(); s.event_page_token = "cursor&user=foreign";
  const url = new URL(calendlyRequestUrl(s)!);
  assert(url.hostname === "api.calendly.com" && url.searchParams.get("user") === user && url.searchParams.get("page_token") === s.event_page_token);
  const result = await reconcileCalendlyPage(initial(), page([event], "next-events"));
  assert(new URL(calendlyRequestUrl(result.state)!).pathname.endsWith("/local-event/invitees"));
  assert(!JSON.stringify(result.state).includes("untrusted.example"));
  let rejected = false;
  try { await reconcileCalendlyPage(s, page([], s.event_page_token)); } catch { rejected = true; }
  assert(rejected, "Repeated cursor must fail rather than loop forever");
});

Deno.test("invitee pages retain rebooking evidence and exclude contact and secret data", async () => {
  const s = (await reconcileCalendlyPage(initial(), page([event]))).state;
  const old = event.uri + "/invitees/old-person";
  const result = await reconcileCalendlyPage(s, page([{...invitee, old_invitee:old}], "next-invitees"));
  assert(result.meetings[0].old_invitee_uri === old);
  assert(result.meetings[0].invitee_email_hash.length === 64);
  assert(!/must-not-persist|qa@example.invalid/.test(JSON.stringify(result)));
  assert(result.state.invitee_page_token === "next-invitees" && result.state.events.length === 1);
  let rejected = false;
  try { await reconcileCalendlyPage(s, page([{...invitee,event:event.uri+'other'}])); } catch { rejected = true; }
  assert(rejected, "Invitees from another event must fail");
});

Deno.test("both active and canceled event/invitee collections are traversed", async () => {
  let s = (await reconcileCalendlyPage(initial(), page([event]))).state;
  s = (await reconcileCalendlyPage(s, page([invitee]))).state;
  assert(s.invitee_status === "canceled" && !s.complete);
  s = (await reconcileCalendlyPage(s, page([]))).state;
  assert(s.event_status === "canceled" && !s.complete);
  s = (await reconcileCalendlyPage(s, page([{...event,status:'canceled'}]))).state;
  const canceled = await reconcileCalendlyPage(s,page([invitee]));
  assert(canceled.meetings[0].status === "canceled", "Canceled event overrides an outdated active invitee");
  s = (await reconcileCalendlyPage(canceled.state,page([]))).state;
  assert(s.complete && calendlyRequestUrl(s) === null);
});

async function fixture(options: { commitFails?: boolean; rateLimited?: boolean; enabled?: boolean; wrongAccount?: boolean }, run: (calls: {url:string;body:Record<string,unknown>}[])=>Promise<void>) {
  const env = {SUPABASE_URL:"https://database.example.invalid",SUPABASE_SERVICE_ROLE_KEY:"local-service",LEAD_TRACEABILITY_WORKER_TOKEN:"local-worker",CALENDLY_ACCESS_TOKEN:"local-calendly",LEAD_CALENDLY_USER_URI:user,CALENDLY_ONE_ACCESS_TOKEN:"",LEAD_CALENDLY_ONE_USER_URI:"",LEAD_CALENDLY_RECONCILE_ENABLED:options.enabled===false?"false":"true"};
  const before = Object.fromEntries(Object.keys(env).map(k=>[k,Deno.env.get(k)]));
  const original = globalThis.fetch;
  const calls: {url:string;body:Record<string,unknown>}[] = [];
  let state = initial(), revision = 0;
  Object.entries(env).forEach(([k,v])=>Deno.env.set(k,v));
  globalThis.fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const body = typeof init?.body === 'string' ? JSON.parse(init.body) : {};
    calls.push({url:url.toString(),body});
    if(url.origin === 'https://api.calendly.com') {
      assert(init?.method === 'GET', 'Reconciliation only reads Calendly');
      if(url.pathname === '/users/me') return json({resource:{uri:options.wrongAccount?'other-user':user}});
      if(options.rateLimited) return json({},429,{'retry-after':'180'});
      if(url.pathname === '/scheduled_events') return json(page(url.searchParams.get('status') === 'active' ? [event] : []));
      return json(page(url.searchParams.get('status') === 'active' ? [invitee] : []));
    }
    assert(url.origin === 'https://database.example.invalid', 'No commercial destination');
    if(url.pathname === '/rest/v1/lead_traceability_health') return new Response(null,{status:204});
    if(url.pathname.endsWith('/trace_claim_calendar_reconciliation')) return json({user_uri:user,state,revision,lease_id:'fixture-lease'});
    if(url.pathname.endsWith('/trace_commit_calendar_reconciliation')) {
      if(options.commitFails) return json(false);
      assert(body.p_revision === revision); state=body.p_state; revision++; return json(true);
    }
    if(url.pathname.endsWith('/trace_release_calendar_reconciliation')) return json(true);
    throw new Error('Unexpected fixture route');
  };
  try { await run(calls); } finally { globalThis.fetch=original; Object.entries(before).forEach(([k,v])=>v===undefined?Deno.env.delete(k):Deno.env.set(k,v)); }
}
const request = (key = 'local-worker') => new Request('https://edge.example.invalid',{method:'POST',headers:{Authorization:`Bearer ${key}`}});

Deno.test("reconciliation commits four bounded pages and never dispatches commercial actions", async () => {
  await fixture({},async calls=>{
    const response=await handleCalendlyReconciliation(request()); const result=await response.json();
    assert(response.status===200 && result.pages===4 && result.cycle_completed===true);
    const writes=calls.filter(c=>c.url.endsWith('/trace_commit_calendar_reconciliation'));
    assert(writes.length===4 && !JSON.stringify(writes).includes('qa@example.invalid'));
  });
});
Deno.test("failed commit and rate limiting preserve the checkpoint for a retry", async () => {
  for(const options of [{commitFails:true},{rateLimited:true}]) await fixture(options,async calls=>{
    assert((await handleCalendlyReconciliation(request())).status===503);
    const releases=calls.filter(c=>c.url.endsWith('/trace_release_calendar_reconciliation'));
    assert(releases.length===1 && releases[0].body.p_error);
    if(options.rateLimited) assert(releases[0].body.p_retry_after===180);
    assert(calls.filter(c=>c.url.endsWith('/trace_commit_calendar_reconciliation')).length <= 1);
  });
});
Deno.test("authorization, rollout flag and account guard prevent unintended reads", async () => {
  await fixture({},async calls=>{assert((await handleCalendlyReconciliation(request('wrong'))).status===401);assert(!calls.length);});
  await fixture({enabled:false},async calls=>{assert((await (await handleCalendlyReconciliation(request())).json()).enabled===false);assert(!calls.length);});
  await fixture({wrongAccount:true},async calls=>{assert((await handleCalendlyReconciliation(request())).status===409);assert(calls.filter(c=>c.url.startsWith('https://api.calendly.com')).length===1);assert(calls.some(c=>(c.body.result as Record<string,unknown>)?.error==='calendar_account_mismatch'));});
  await fixture({},async calls=>{
    const one = new Request('https://edge.example.invalid',{method:'POST',headers:{Authorization:'Bearer local-worker'},body:JSON.stringify({account:'one'})});
    assert((await (await handleCalendlyReconciliation(one)).json()).enabled===false);
    assert(!calls.length, 'Missing One credential must not reuse the classic account');
  });
});
