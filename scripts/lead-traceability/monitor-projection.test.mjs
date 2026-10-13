import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { labels, monitorObservation, monitorDecision, monitorAcknowledge } from './monitor-projection.mjs';
const now = Date.parse('2026-10-13T22:00:00Z');
const healthy = { statusCode: 200, body: { version: 1, observed_at: new Date(now).toISOString(),
  counts: Object.fromEntries(Object.keys(labels).filter(key => key !== 'source_unavailable').map(key => [key, 0])) } };
const incident = key => ({ ...healthy, body: { ...healthy.body, counts: { ...healthy.body.counts, [key]: 1 } } });
test('healthy startup stays silent; outage cannot masquerade as an empty snapshot', () => {
  assert.equal(monitorDecision(healthy, {}, now), null);
  for (const response of [{}, { statusCode: 503 }, { statusCode: 200, body: {} },
    { ...healthy, body: { ...healthy.body, observed_at: '2020-01-01' } }]) {
    assert.equal(monitorObservation(response, now).fingerprint, 'source_unavailable');
  }
});
test('new failure and recovery notify, identical problems and changing counts stay silent', () => {
  const state = {};
  const alert = monitorDecision(incident('slack_overdue'), state, now);
  assert.match(alert.text, /Slack/);
  monitorAcknowledge({ ok: true, message_timestamp: '1.2' }, alert, state, now);
  const more = incident('slack_overdue'); more.body.counts.slack_overdue = 99;
  assert.equal(monitorDecision(more, state, now + 1000), null);
  const recovered = monitorDecision(healthy, state, now + 2000);
  assert.equal(recovered.recovery, true);
  monitorAcknowledge({ ok: true, message_timestamp: '1.3' }, recovered, state, now + 2000);
  assert.equal(monitorDecision(incident('slack_overdue'), state, now + 3000), null);
});
test('an unconfirmed Slack send does not acknowledge the incident and backs off', () => {
  const state = {}; const alert = monitorDecision(incident('clickup_overdue'), state, now);
  assert.equal(monitorAcknowledge({ ok: false }, alert, state, now).delivered, false);
  assert.equal(state.notifiedFingerprint, undefined);
  assert.equal(state.nextAttemptAt, now + 1800000);
  assert.equal(monitorDecision(incident('clickup_overdue'), state, now + 60000), null);
});
test('unknown response fields and raw transport errors cannot enter Slack', () => {
  const malicious = { ...incident('slack_overdue'), contact: 'SECRET', error: '<!channel>' };
  malicious.body.counts['<!channel>'] = 1;
  const text = monitorDecision(malicious, {}, now).text;
  assert.equal(text.includes('SECRET'), false);
  assert.equal(text.includes('<!channel>'), false);
});

test('generated n8n code handles the HTTP envelope, Slack receipt and shared cooldown', () => {
  const workflow = JSON.parse(readFileSync(new URL('../../integrations/n8n/lead-monitor.json', import.meta.url), 'utf8'));
  const state = {};
  const run = (name, input, notification) => {
    const code = workflow.nodes.find(node => node.name === name).parameters.jsCode;
    return runInNewContext(`(() => { ${code} })()`, {
      Date: class extends Date { static now() { return now; } },
      $input: { first: () => ({ json: input }) },
      $getWorkflowStaticData: () => state,
      $: () => ({ first: () => ({ json: notification }) }),
    }, { timeout: 1000 });
  };
  assert.equal(run('Decidir aviso', healthy).length, 0);
  const alert = run('Decidir aviso', incident('slack_overdue'))[0].json;
  assert.match(alert.text, /Actualizaciones Slack/);
  assert.equal(run('Confirmar aviso', { ok: true, message_timestamp: '1791923871.267209' }, alert)[0].json.delivered, true);
  assert.equal(run('Decidir aviso', incident('slack_overdue')).length, 0);
  const recovery = run('Decidir aviso', healthy)[0].json;
  assert.equal(recovery.recovery, true);
  assert.equal(run('Confirmar aviso', { error: 'timeout' }, recovery)[0].json.delivered, false);
  assert.equal(state.notifiedFingerprint, 'slack_overdue');
  assert.equal(state.nextAttemptAt, now + 1800000);
});
