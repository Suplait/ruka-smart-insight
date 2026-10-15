import test from 'node:test';
import assert from 'node:assert/strict';
import { crmRequests, validateCrmSnapshot } from './crm-evidence.mjs';
import { CRM_LIST, commercialEvidence } from './commercial-evidence.mjs';

const now = Date.parse('2026-10-15T12:00:00Z');
const capturedAt = new Date(now).toISOString();
const source = { state: 'ok', capturedAt, submissions: [{ id: 'a', clickup_task_id: 'task-a' }, { id: 'b', clickup_task_id: 'task-a' }, { id: 'c', clickup_task_id: 'task-b' }], meetings: [] };
const task = { id: 'task-a', listId: CRM_LIST, status: 'Clientes', observedAt: capturedAt, sourceUrl: 'https://app.clickup.com/t/task-a', email: 'must-not-persist@example.invalid', name: 'Private company' };
const input = { schemaVersion: 1, source: 'clickup-read-only', listId: CRM_LIST, capturedAt, sourceCapturedAt: capturedAt, tasks: [task], unavailableTaskIds: ['task-b'] };

test('requests are deduplicated exact linked IDs, not name matches', () => {
  assert.deepEqual(crmRequests(source, now).taskIds, ['task-a', 'task-b']);
  assert.throws(() => crmRequests({ ...source, state: 'unavailable' }, now), /fresh/);
  assert.throws(() => crmRequests({ ...source, capturedAt: '2026-09-01' }, now), /fresh/);
});
test('import strips personal fields and preserves explicit partial coverage', () => {
  const result = validateCrmSnapshot(input, source, now);
  assert.equal(result.tasks[0].email, undefined);
  assert.equal(result.tasks[0].name, undefined);
  assert.equal(result.tasks[0].status, 'clientes');
  const evidence = commercialEvidence(source, result, now);
  assert.equal(evidence.crm.coverageComplete, false);
  assert.equal(evidence.crm.currentStates.customer, 1);
  assert.equal(evidence.closedMrr, null);
});
test('reject source mismatch, stale observations, unrelated list and unobserved IDs', () => {
  for (const change of [
    { source: 'guessed' }, { listId: 'wrong' }, { sourceCapturedAt: '2026-10-01' },
    { unavailableTaskIds: [] }, { tasks: [task, task] }, { unavailableTaskIds: ['unrelated'] },
    { tasks: [{ ...task, listId: 'another-list' }] },
    { tasks: [{ ...task, observedAt: '2026-09-01' }] },
    { tasks: [{ ...task, sourceUrl: 'https://app.clickup.com/t/wrong' }] },
    { tasks: [{ ...task, sourceUrl: 'https://app.clickup.com.attacker.test/t/task-a' }] },
  ]) assert.throws(() => validateCrmSnapshot({ ...input, ...change }, source, now));
});
test('empty real cohort is explicitly empty, not fabricated CRM observations', () => {
  const empty = { ...source, submissions: [] };
  const result = validateCrmSnapshot({ ...input, tasks: [], unavailableTaskIds: [] }, empty, now);
  assert.equal(result.requestedTasks, 0);
  assert.deepEqual(result.tasks, []);
});
