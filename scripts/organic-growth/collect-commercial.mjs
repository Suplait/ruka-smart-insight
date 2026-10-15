import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { writePrivateJson } from './lib.mjs';

const project = 'rmxzryueysmzksmvpwpv';
const origin = `https://${project}.supabase.co`;

async function serviceKey() {
  if (process.env.ORGANIC_LEADS_READ_KEY) return process.env.ORGANIC_LEADS_READ_KEY;
  // Existing authenticated CLI; key stays in process memory, never stdout/files.
  const keys = JSON.parse(execFileSync('npx', ['--yes', 'supabase@2.102.0', 'projects', 'api-keys', '--project-ref', project, '--output', 'json'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 60_000 }));
  const key = keys.find(item => item.name === 'service_role')?.api_key;
  if (!key) throw new Error('Authenticated read credential unavailable');
  return key;
}

export async function readAll(table, parameters, key, fetcher = fetch) {
  if (!['lead_submissions', 'lead_meetings', 'leads', 'leads_one'].includes(table)) throw new Error('Source not allowed');
  const rows = [];
  for (let offset = 0; offset < 100_000; offset += 500) {
    const query = new URLSearchParams({ ...parameters, limit: '500', offset: String(offset) });
    const response = await fetcher(`${origin}/rest/v1/${table}?${query}`, {
      method: 'GET', headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact' }, signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) throw new Error(`${table}: read failed (${response.status})`);
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('Invalid source response');
    rows.push(...batch);
    if (batch.length < 500) return rows;
  }
  throw new Error('Source exceeded safety limit; refusing a truncated report');
}

export async function collectCommercial() {
  const capturedAt = new Date().toISOString();
  const start = new Date(Date.now() - 90 * 86400_000).toISOString();
  try {
    const key = await serviceKey();
    const touch = prefix => ['page', 'referrer_origin', 'utm_source', 'utm_medium'].map(field => `${prefix}_${field}:attribution->${prefix}->>${field}`);
    const submissions = await readAll('lead_submissions', {
      select: ['id', 'funnel', 'created_at', 'clickup_task_id', 'conversion_page:attribution->>conversion_page', ...touch('first_touch'), ...touch('last_non_direct_touch'), 'qa_email:contact_snapshot->>email'].join(','),
      status: 'eq.persisted', created_at: `gte.${start}`, and: `(created_at.lt.${capturedAt})`, order: 'created_at.asc,id.asc',
    }, key);
    // Email is read only to exclude explicit test domains, then discarded before persistence.
    let excludedTests = 0;
    const clean = submissions.filter(row => {
      const excluded = /(?:@example\.(?:invalid|com)|@rukatest\.ia|@test\.com)$/i.test(row.qa_email || '');
      if (excluded) excludedTests++;
      return !excluded;
    }).map(({ qa_email: _discard, ...row }) => row);
    const meetings = await readAll('lead_meetings', {
      select: 'submission_id,status,booked_at,source,association_method,invitee_uri',
      booked_at: `gte.${start}`, and: `(booked_at.lt.${capturedAt})`, order: 'booked_at.asc,invitee_uri.asc',
    }, key);
    const coverage = {};
    for (const [funnel, table] of [['classic', 'leads'], ['one', 'leads_one']]) {
      const records = await readAll(table, { select: 'id,submission_id', created_at: `gte.${start}`, and: `(created_at.lt.${capturedAt})`, order: 'id.asc' }, key);
      coverage[funnel] = { capturedIncludingTests: records.length, withoutSubmissionReference: records.filter(row => !row.submission_id).length };
    }
    const result = { schemaVersion: 1, state: 'ok', source: `supabase:${project}`, capturedAt, windowStart: start, windowEnd: capturedAt, excludedTests, coverage, submissions: clean, meetings, calendarCoverage: { classic: 'verified_reader', one: 'not_connected' } };
    await writePrivateJson('commercial-source.json', result);
    console.log(JSON.stringify({ state: 'ok', submissions: clean.length, meetings: meetings.length, excludedTests }));
    return result;
  } catch {
    // Never emit remote body, credentials or old numbers as a fresh success.
    const result = { schemaVersion: 1, state: 'unavailable', capturedAt, reason: 'Lead source unavailable; reconnect Supabase CLI or configure ORGANIC_LEADS_READ_KEY. No funnel was modified.' };
    await writePrivateJson('commercial-source.json', result);
    console.log(JSON.stringify(result));
    return result;
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await collectCommercial();
