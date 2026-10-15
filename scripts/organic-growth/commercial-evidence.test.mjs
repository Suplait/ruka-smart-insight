import test from 'node:test';
import assert from 'node:assert/strict';
import { channel, commercialEvidence, publicPage, CRM_LIST } from './commercial-evidence.mjs';
import { readAll } from './collect-commercial.mjs';
const now = Date.parse('2026-10-15T12:00:00Z');
const row = { id: 'one', funnel: 'classic', first_touch_page: 'https://www.ruka.ai/blog/test?private=x', first_touch_referrer_origin: 'https://www.google.cl', clickup_task_id: 'task' };
const source = { state: 'ok', capturedAt: new Date(now).toISOString(), submissions: [row, row], meetings: [{ invitee_uri: 'm', submission_id: 'one', status: 'active', source: 'calendly' }], calendarCoverage: { classic: 'verified_reader', one: 'not_connected' } };
test('unknown/stale source never becomes zero', () => {
  assert.equal(commercialEvidence(null, null, now).state, 'unavailable');
  assert.equal(commercialEvidence({ ...source, capturedAt: '2026-01-01' }, null, now).submissions, undefined);
});
test('dedupe, safe page, verified booking and unknown CRM/revenue', () => {
  const result = commercialEvidence(source, null, now);
  assert.equal(result.submissions, 1); assert.equal(result.groups[0].firstTouchPage, '/blog/test');
  assert.equal(result.groups[0].submissionsWithActiveVerifiedMeeting, 1);
  assert.equal(result.closedMrr, null); assert.equal(result.crm.currentStates, null);
});
test('One missing calendar never presented as zero bookings; canceled is not active', () => {
  const result = commercialEvidence({ ...source, submissions: [{ ...row, funnel: 'one' }], meetings: [] }, null, now);
  assert.equal(result.groups[0].submissionsWithActiveVerifiedMeeting, null);
  assert.equal(commercialEvidence({ ...source, meetings: [{ ...source.meetings[0], status: 'canceled' }] }, null, now).groups[0].submissionsWithActiveVerifiedMeeting, 0);
});
test('CRM tasks deduped across submissions; no fabricated historical stages', () => {
  const crm = { listId: CRM_LIST, capturedAt: new Date(now).toISOString(), tasks: [{ id: 'task', listId: CRM_LIST, status: 'clientes', observedAt: new Date(now).toISOString() }] };
  const result = commercialEvidence({ ...source, submissions: [row, { ...row, id: 'two' }] }, crm, now);
  assert.deepEqual(result.crm.currentStates, { qualified: 0, proposal: 0, customer: 1 });
  assert.equal(result.crm.observedTasks, 1);
  assert.equal(result.crm.coverageComplete, true);
  assert.equal(result.groups[0].observedCrmStates.customer, 1);
  const stale = commercialEvidence(source, { ...crm, tasks: [{ ...crm.tasks[0], observedAt: '2020-01-01' }] }, now);
  assert.equal(stale.crm.coverageComplete, false);
  assert.equal(stale.crm.observedTasks, 0);
});
test('paid medium beats referrer; missing/referral spoofing never organic', () => {
  assert.equal(channel({ ...row, first_touch_utm_medium: 'cpc' }), 'paid');
  assert.equal(channel({}), 'unknown');
  assert.equal(channel({ first_touch_referrer_origin: 'https://google.com.attacker.test' }), 'other_referral');
  assert.equal(publicPage('https://tenant.ruka.ai/a'), null);
});
test('paginated reader is GET-only and rejects incomplete/unavailable sources', async () => {
  let calls = 0;
  const rows = await readAll('lead_submissions', {}, 'secret', async (url, options) => {
    calls++; assert.equal(options.method, 'GET'); assert.match(url, /^https:\/\/rmxzryueysmzksmvpwpv.supabase.co\/rest\/v1\//);
    return { ok: true, json: async () => calls === 1 ? Array(500).fill({}) : [{}] };
  });
  assert.equal(rows.length, 501); assert.equal(calls, 2);
  await assert.rejects(readAll('other', {}, 'key'), /not allowed/);
  await assert.rejects(readAll('leads', {}, 'key', async () => ({ ok: false, status: 401 })), /401/);
});
