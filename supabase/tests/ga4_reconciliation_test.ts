const assertEquals = (actual: unknown, expected: unknown) => {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};
const assertThrows = (run: () => unknown) => {
  try { run(); } catch { return; }
  throw new Error('Expected an exception');
};
import { ga4Window, ga4ReportRequest, parseGa4Reports, assessGa4Volume, shiftDate, ga4Events } from '../functions/_shared/ga4Reconciliation.ts';
import { handleGa4Reconciliation } from '../functions/lead-ga4-reconcile/handler.ts';

const window = { start: '2026-10-14', end: '2026-11-11' };
const report = (traffic = false) => ({ metadata: { timeZone: 'America/Santiago' }, rowCount: 0, rows: [],
  dimensionHeaders: (traffic ? ['date'] : ['date', 'eventName']).map(name => ({ name })),
  metricHeaders: [{ name: traffic ? 'sessions' : 'eventCount' }],
});
const row = (date: string, count: string, event?: string) => ({ dimensionValues: [{ value: date }, ...(event ? [{ value: event }] : [])], metricValues: [{ value: count }] });
const days = () => Array.from({ length: 29 }, (_, i) => ({ date: shiftDate(window.start, i), sessions: 200,
  events: Object.fromEntries(ga4Events.map(event => [event, 20])) }));

Deno.test('mature daily windows use Chile dates including DST and UTC midnight', () => {
  assertEquals(ga4Window(new Date('2026-10-14T01:00:00Z')), { start: '2026-09-12', end: '2026-10-10' });
  assertEquals(ga4Window(new Date('2026-09-07T12:00:00Z')).end, '2026-09-04');
  assertEquals(ga4Window(new Date('2026-04-06T13:00:00Z')).end, '2026-04-03');
});
Deno.test('request separates traffic and event counts and restricts stream/events', () => {
  assertEquals(ga4ReportRequest(window, true).metrics, [{ name: 'sessions' }]);
  const request = JSON.stringify(ga4ReportRequest(window, false));
  assertEquals(request.includes('10287402959'), true);
  assertEquals(request.includes('userId'), false);
  assertEquals(request.includes('pageLocation'), false);
});
Deno.test('complete zero reports retain 29 explicit zero days; observed rows stay separate', () => {
  const events = { ...report(), rowCount: 2, rows: [row('20261111', '2', 'lead_created'), row('20261111', '3', 'registration_success')] };
  const traffic = { ...report(true), rowCount: 1, rows: [row('20261111', '9')] };
  const parsed = parseGa4Reports(window, events, traffic);
  assertEquals(parsed.length, 29);
  assertEquals(parsed[0].sessions, 0);
  assertEquals(parsed[28].sessions, 9);
  assertEquals(parsed[28].events.lead_created, 2);
  assertEquals(parsed[28].events.registration_success, 3);
});
Deno.test('limited, truncated, wrong-zone and changed-schema reports cannot produce zeros', () => {
  for (const bad of [
    { ...report(), metadata: { timeZone: 'UTC' } },
    { ...report(), metadata: { timeZone: 'America/Santiago', subjectToThresholding: true } },
    { ...report(), metadata: { timeZone: 'America/Santiago', samplingMetadatas: [{}] } },
    { ...report(), metadata: { timeZone: 'America/Santiago', dataLossFromOtherRow: true } },
    { ...report(), rowCount: 1 }, { ...report(), metricHeaders: [{ name: 'activeUsers' }] },
  ]) assertThrows(() => parseGa4Reports(window, bad, report(true)));
});
Deno.test('invalid counts, duplicate rows, unexpected events and dates fail closed', () => {
  for (const rows of [[row('20261111', '-1', 'lead_created')], [row('20261111', '1.5', 'lead_created')],
    [row('20261111', '9007199254740992', 'lead_created')], [row('20260101', '1', 'lead_created')],
    [row('20261111', '1', 'unrequested')], [row('20261111', '1', 'lead_created'), row('20261111', '1', 'lead_created')]]) {
    assertThrows(() => parseGa4Reports(window, { ...report(), rowCount: rows.length, rows }, report(true)));
  }
});
Deno.test('low volume and pre-launch One history do not cause alerts', () => {
  const low = days().map(d => ({ ...d, sessions: 5 }));
  low[28].sessions = 0;
  assertEquals(assessGa4Volume(low).some(x => x.state === 'drop'), false);
  const early = days().map((d, i) => ({ ...d, date: shiftDate('2026-10-13', i) }));
  assertEquals(assessGa4Volume(early).find(x => x.signal === 'one_lead_created')?.state, 'insufficient_history');
});
Deno.test('compares same weekdays and distinguishes traffic loss from conversion rate loss', () => {
  const sample = days();
  // Non-matching weekdays cannot inflate the seasonal comparison.
  sample[27].events.lead_created = 100000;
  assertEquals(assessGa4Volume(sample).some(x => x.state === 'drop'), false);
  sample[28].sessions = 150; sample[28].events.lead_created = 0;
  assertEquals(assessGa4Volume(sample).find(x => x.signal === 'lead_created')?.state, 'drop');
  sample[28].sessions = 20;
  assertEquals(assessGa4Volume(sample).find(x => x.signal === 'lead_created')?.state, 'insufficient_volume');
  assertEquals(assessGa4Volume(sample).find(x => x.signal === 'sessions')?.state, 'drop');
});
Deno.test('endpoint rejects unauthorized access before making any network request', async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('must not fetch'); };
  try {
    assertEquals((await handleGa4Reconciliation(new Request('https://local/', { method: 'POST', body: '{}' }))).status, 401);
    assertEquals((await handleGa4Reconciliation(new Request('https://local/'))).status, 405);
  } finally { globalThis.fetch = previous; }
});

async function handlerFixture(failAuth: boolean, run: (writes: { path: string; body: Record<string, unknown> }[]) => Promise<void>) {
  const key = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const pem = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.exportKey('pkcs8', key.privateKey))));
  const env = { SUPABASE_URL: 'https://database.example.invalid', SUPABASE_SERVICE_ROLE_KEY: 'test-service',
    LEAD_GA4_RECONCILE_ENABLED: 'true', LEAD_GA4_SERVICE_ACCOUNT: JSON.stringify({ type: 'service_account',
      client_email: 'ga-mcp-ruka@gen-lang-client-0272314543.iam.gserviceaccount.com', private_key: pem }) };
  const oldEnv = Object.fromEntries(Object.keys(env).map(k => [k, Deno.env.get(k)]));
  const previous = globalThis.fetch;
  const writes: { path: string; body: Record<string, unknown> }[] = [];
  Object.entries(env).forEach(([k, v]) => Deno.env.set(k, v));
  globalThis.fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    const respond = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
    if (url.href === 'https://oauth2.googleapis.com/token') return respond(failAuth ? { error_description: 'DO_NOT_EXPOSE' } : { access_token: 'PRIVATE_TEST_TOKEN' }, failAuth ? 403 : 200);
    const body = JSON.parse(String(init?.body));
    if (url.href === 'https://analyticsdata.googleapis.com/v1beta/properties/478868017:runReport') {
      assertEquals(new Headers(init?.headers).get('authorization'), 'Bearer PRIVATE_TEST_TOKEN');
      return respond(report(body.metrics[0].name === 'sessions'));
    }
    assertEquals(url.origin, 'https://database.example.invalid');
    if (url.pathname === '/rest/v1/rpc/trace_ga4_database_counts') return respond(Array.from({ length: 29 }, (_, i) => ({ date: shiftDate(body.p_start, i), classic_leads: 0 })));
    if (!['/rest/v1/lead_ga4_reconciliations', '/rest/v1/lead_traceability_health'].includes(url.pathname)) throw new Error('Unexpected destination');
    writes.push({ path: url.pathname, body });
    return respond(null);
  };
  try { await run(writes); }
  finally {
    globalThis.fetch = previous;
    Object.entries(oldEnv).forEach(([k, v]) => v === undefined ? Deno.env.delete(k) : Deno.env.set(k, v));
  }
}
Deno.test('collector stores aggregate evidence before successful health; never touches capture tables', async () => {
  await handlerFixture(false, async writes => {
    const response = await handleGa4Reconciliation(new Request('https://local/', { method: 'POST', headers: { Authorization: 'Bearer test-service' }, body: '{}' }));
    assertEquals(response.status, 200);
    assertEquals(writes.map(w => w.path), ['/rest/v1/lead_ga4_reconciliations', '/rest/v1/lead_traceability_health']);
    assertEquals(JSON.stringify(writes).includes('PRIVATE_TEST_TOKEN'), false);
    assertEquals((writes[1].body.result as Record<string, unknown>).state, 'ok');
  });
});
Deno.test('auth failure records sanitized unavailability without an empty data snapshot', async () => {
  await handlerFixture(true, async writes => {
    const response = await handleGa4Reconciliation(new Request('https://local/', { method: 'POST', headers: { Authorization: 'Bearer test-service' }, body: '{}' }));
    assertEquals(response.status, 503);
    assertEquals(await response.json(), { error: 'ga4_auth_failed' });
    assertEquals(writes.map(w => w.path), ['/rest/v1/lead_traceability_health']);
    assertEquals(JSON.stringify(writes).includes('DO_NOT_EXPOSE'), false);
    assertEquals(Object.hasOwn(writes[0].body, 'last_completed_at'), false);
  });
});
