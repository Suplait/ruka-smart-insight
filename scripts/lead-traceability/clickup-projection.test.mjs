import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { CLICKUP_FIELD, CLICKUP_LIST, clickupText, prepareClickupUpdate, finishClickupWrite } from './clickup-projection.mjs';

const job = () => ({ task_id: 'testtask', list_id: CLICKUP_LIST, field_id: CLICKUP_FIELD,
  delivery: { id: 12, lease_id: 'test-lease', revision: 7, lease_until: new Date(Date.now() + 90000).toISOString() },
  submission_count: 2, submissions: [{ submission_id: 'example', lead_id: 42, created_at: '2026-10-13T15:00:00Z',
    attribution: { version: 1, first_touch: { utm_source: 'facebook', utm_medium: 'paid', utm_campaign: 'october', utm_content: 'ad', utm_term: 'restaurant', gclid: 'do-not-copy', fbclid: 'do-not-copy', page: 'https://www.ruka.ai/restaurantes?email=secret' },
      continuation_token: 'do-not-copy', contact: 'do-not-copy', observed_pages: [{ page: '/register?token=secret' }] } }], meetings: [] });
const response = () => ({ statusCode: 200, body: { id: 'testtask', list: { id: CLICKUP_LIST }, custom_fields: [{ id: CLICKUP_FIELD, type: 'text' }] } });

test('projects five UTMs without raw IDs, contacts or URL queries', () => {
  const output = clickupText(job());
  for (const k of ['source','medium','campaign','content','term']) assert.match(output, new RegExp(`utm_${k}:`));
  assert.doesNotMatch(output, /do-not-copy|secret|continuation_token/);
  assert.match(output, /Sin agenda confirmada/);
  assert.match(output, /2 envíos asociados/);
});
test('writes only the dedicated field and suppresses an already applied retry', () => {
  const j = job(); const r = response(); const p = prepareClickupUpdate(j, r);
  assert.equal(p.action, 'write'); assert.equal(p.field_id, CLICKUP_FIELD);
  assert.equal('status' in p, false); assert.equal('description' in p, false);
  r.body.custom_fields[0].value = p.value;
  assert.deepEqual(prepareClickupUpdate(j, r), { action: 'finish', ack: p.ack });
});
test('refuses unrelated tasks, subtasks, wrong lists, removed fields and expiring leases', () => {
  for (const mutate of [r => { r.body.id = 'other'; }, r => { r.body.parent = 'parent'; }, r => { r.body.list.id = 'foreign'; }, r => { r.body.custom_fields = []; }]) {
    const r = response(); mutate(r); const p = prepareClickupUpdate(job(), r); assert.equal(p.action, 'finish'); assert.ok(p.ack.p_error);
  }
  const j = job(); j.delivery.lease_until = new Date().toISOString();
  assert.equal(prepareClickupUpdate(j, response()).ack.p_error, 'clickup_lease_expiring');
});
test('does not acknowledge rejected, failed or rate-limited requests', () => {
  const p = prepareClickupUpdate(job(), response());
  assert.equal(finishClickupWrite(p, { statusCode: 200, body: {} }).ack.p_error, null);
  for (const r of [{ statusCode: 200, body: { err: 'denied' } }, { error: 'timeout' }, { statusCode: 500 }]) assert.ok(finishClickupWrite(p, r).ack.p_error);
  assert.equal(finishClickupWrite(p, { statusCode: 429, headers: { 'retry-after': '120' } }).ack.p_retry_after, 120);
  assert.equal(prepareClickupUpdate(job(), { statusCode: 429 }).ack.p_error, 'clickup_rate_limited');
});
test('uses authoritative cancellation and keeps the history bounded', () => {
  const j = job(); j.meetings = [{ status: 'canceled', starts_at: '2026-10-14T15:00:00Z' }];
  assert.match(clickupText(j), /Agenda cancelada/);
  j.meetings.push({ status: 'active', starts_at: '2026-10-15T15:00:00Z' });
  assert.match(clickupText(j), /Confirmada:.*Chile/);
  j.submissions = Array.from({length: 100}, () => ({...j.submissions[0], legacy_utms: {utm_source: 'x'.repeat(100000)}}));
  assert.ok(clickupText(j).length <= 24000);
  assert.match(clickupText(j), /Confirmada:.*Chile/);
});

test('the actual n8n artifact validates destinations and schedules only enrichment', () => {
  const workflow = JSON.parse(readFileSync(new URL('../../integrations/n8n/lead-clickup-enrichment.json', import.meta.url)));
  assert.equal(workflow.active, false);
  assert.equal(workflow.settings.saveManualExecutions, false);
  assert.equal(workflow.settings.executionTimeout, 120);
  assert.equal(workflow.nodes.filter(n => /Trigger|webhook|cron/i.test(n.type)).length, 2);
  assert.deepEqual(workflow.nodes.find(n => n.type.endsWith('scheduleTrigger')).parameters.rule.interval, [{field:'minutes',minutesInterval:1}]);
  assert.deepEqual(workflow.connections['Schedule Trigger'].main[0].map(n=>n.node), ['Reservar entrega existente','Enriquecer Slack confirmado']);
  assert.ok(workflow.nodes.some(n => n.type.endsWith('manualTrigger')));
  const writes = workflow.nodes.filter(n => n.parameters.method === 'POST' && n.parameters.url?.includes('clickup.com'));
  assert.equal(writes.length, 1);
  assert.match(writes[0].parameters.url, /\/task\/.*\/field\//);
  assert.deepEqual(JSON.parse(writes[0].parameters.jsonBody.replace('={{ JSON.stringify({value:$json.value}) }}', '{"value":"fixture"}')), {value:'fixture'});
  const j = job(); const r = response();
  const source = workflow.nodes.find(n => n.name === 'Validar y proyectar').parameters.jsCode;
  const execute = input => runInNewContext(`(function(){${source}})()`, {
    $: () => ({first: () => ({json: j})}), $input: {first: () => ({json: input})},
  });
  assert.equal(execute(r)[0].json.action, 'write');
  assert.match(execute(r)[0].json.value, /Página: https:\/\/www.ruka.ai\/restaurantes/);
  assert.doesNotMatch(execute(r)[0].json.value, /secret/);
  r.body.list.id = 'other-list';
  assert.equal(execute(r)[0].json.ack.p_error, 'clickup_task_mismatch');
});
