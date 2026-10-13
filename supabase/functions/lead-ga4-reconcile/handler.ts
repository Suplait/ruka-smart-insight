import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';
import { tokenDigest } from '../_shared/leadValidation.ts';
import { ga4Property, ga4Timezone, ga4Window, ga4ReportRequest, parseGa4Reports, assessGa4Volume } from '../_shared/ga4Reconciliation.ts';

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});
const boundedFetch: typeof fetch = (input, init) => fetch(input, { ...init, redirect: 'error', signal: AbortSignal.timeout(15000) });
const encode = (value: unknown) => btoa(JSON.stringify(value)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');

async function analyticsToken() {
  const account = JSON.parse(Deno.env.get('LEAD_GA4_SERVICE_ACCOUNT') ?? '{}');
  if (account.type !== 'service_account' || account.client_email !== 'ga-mcp-ruka@gen-lang-client-0272314543.iam.gserviceaccount.com' ||
      typeof account.private_key !== 'string') throw new Error('ga4_credential_unavailable');
  const now = Math.floor(Date.now() / 1000);
  const unsigned = encode({ alg: 'RS256', typ: 'JWT', kid: account.private_key_id }) + '.' + encode({
    iss: account.client_email, scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600,
  });
  const pkcs8 = Uint8Array.from(atob(account.private_key.replace(/-----[^-]+-----|\s/g, '')), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey('pkcs8', pkcs8, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const signature = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned)));
  const signed = btoa(String.fromCharCode(...signature)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
  const response = await boundedFetch('https://oauth2.googleapis.com/token', { method: 'POST',
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: unsigned + '.' + signed }) });
  if (!response.ok) throw new Error('ga4_auth_failed');
  const body = await response.json();
  if (typeof body.access_token !== 'string') throw new Error('ga4_auth_failed');
  return body.access_token as string;
}

export async function handleGa4Reconciliation(request: Request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  const supplied = request.headers.get('Authorization')?.replace(/^Bearer /, '');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const workerKey = Deno.env.get('LEAD_TRACEABILITY_WORKER_TOKEN');
  if (!supplied || !(await Promise.all([serviceKey, workerKey].map(async key => !!key && await tokenDigest(key) === await tokenDigest(supplied)))).some(Boolean)) return json({ error: 'Unauthorized' }, 401);
  if (Deno.env.get('LEAD_GA4_RECONCILE_ENABLED') !== 'true') return json({ enabled: false });
  // No client-selected property, dates, endpoints, events or request payloads.
  if ((await request.text()).trim() !== '{}') return json({ error: 'Invalid request' }, 400);
  const db = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey!, { auth: { persistSession: false }, global: { fetch: boundedFetch } });
  const window = ga4Window();
  try {
    const token = await analyticsToken();
    const report = async (traffic: boolean) => {
      const response = await boundedFetch(`https://analyticsdata.googleapis.com/v1beta/properties/${ga4Property}:runReport`, {
        method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(ga4ReportRequest(window, traffic)),
      });
      if (!response.ok) throw new Error(response.status === 429 ? 'ga4_rate_limited' : 'ga4_read_failed');
      const text = await response.text();
      if (text.length > 262144) throw new Error('ga4_response_too_large');
      return JSON.parse(text);
    };
    const [events, traffic, database] = await Promise.all([report(false), report(true),
      db.rpc('trace_ga4_database_counts', { p_start: window.start, p_end: window.end })]);
    if (database.error || !Array.isArray(database.data) || database.data.length !== 29) throw new Error('database_counts_unavailable');
    const days = parseGa4Reports(window, events, traffic);
    const assessment = assessGa4Volume(days);
    const result = { property: ga4Property, timezone: ga4Timezone, days, database: database.data, assessment,
      limitations: ['aggregate_not_individual_receipts', 'consent_unknown_is_not_eligible', 'events_are_not_unique_leads', 'meetings_are_known_receipts_only'] };
    const saved = await db.from('lead_ga4_reconciliations').upsert({ report_date: window.end, window_start: window.start,
      observed_at: new Date().toISOString(), result }, { onConflict: 'report_date' });
    if (saved.error) throw new Error('ga4_snapshot_not_saved');
    const health = await db.from('lead_traceability_health').upsert({ job: 'ga4_reconciliation',
      last_started_at: new Date().toISOString(), last_completed_at: new Date().toISOString(),
      result: { state: 'ok', report_date: window.end, drop_signals: assessment.filter(x => x.state === 'drop').map(x => x.signal) } }, { onConflict: 'job' });
    if (health.error) throw new Error('ga4_health_not_saved');
    return json({ report_date: window.end, days: days.length, assessment });
  } catch (error) {
    const allowed = /^(ga4_(credential_unavailable|auth_failed|rate_limited|read_failed|response_too_large|timezone_mismatch|data_limited|incomplete_report|schema_mismatch|invalid_row|snapshot_not_saved|health_not_saved)|database_counts_unavailable)$/;
    const code = error instanceof Error && allowed.test(error.message) ? error.message : 'ga4_reconciliation_failed';
    await db.from('lead_traceability_health').upsert({ job: 'ga4_reconciliation', last_started_at: new Date().toISOString(), result: { state: 'error', code } }, { onConflict: 'job' });
    // Never return/log Google responses, tokens, JWT assertions, or keys.
    return json({ error: code }, 503);
  }
}
