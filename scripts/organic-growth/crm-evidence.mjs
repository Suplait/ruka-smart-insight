import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CRM_LIST } from './commercial-evidence.mjs';
import { readPrivateJson } from './lib.mjs';
import { writeEvidence } from './evidence-store.mjs';

const fresh = (time, now, ttl) => Number.isFinite(Date.parse(time)) && now - Date.parse(time) >= -300_000 && now - Date.parse(time) <= ttl;
const validId = value => typeof value === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(value);

export function crmRequests(source, now = Date.now()) {
  if (source?.state !== 'ok' || !fresh(source.capturedAt, now, 36 * 3600_000) || !Array.isArray(source.submissions)) throw new Error('A fresh successful commercial source is required');
  const taskIds = [...new Set(source.submissions.map(row => row.clickup_task_id).filter(Boolean))].sort();
  if (taskIds.some(id => !validId(id))) throw new Error('Invalid linked task ID');
  return { listId: CRM_LIST, sourceCapturedAt: source.capturedAt, taskIds };
}

/** Import only bounded, directly observed CRM metadata; never names, emails or amounts. */
export function validateCrmSnapshot(input, source, now = Date.now()) {
  const request = crmRequests(source, now);
  if (input?.schemaVersion !== 1 || input.source !== 'clickup-read-only' || input.listId !== CRM_LIST || input.sourceCapturedAt !== request.sourceCapturedAt) throw new Error('CRM source/list/snapshot mismatch');
  if (!fresh(input.capturedAt, now, 7 * 86400_000)) throw new Error('CRM capture is stale or in the future');
  if (!Array.isArray(input.tasks) || !Array.isArray(input.unavailableTaskIds)) throw new Error('Tasks and explicit unavailable IDs are required');
  const requested = new Set(request.taskIds);
  const accounted = new Set();
  const tasks = input.tasks.map(task => {
    if (!requested.has(task.id) || accounted.has(task.id)) throw new Error('Unrequested or duplicate CRM task');
    if (task.listId !== CRM_LIST || typeof task.status !== 'string' || !task.status.trim() || task.status.length > 100) throw new Error('Invalid CRM task list/status');
    if (!fresh(task.observedAt, now, 7 * 86400_000)) throw new Error('Task observation is stale or in the future');
    const url = new URL(task.sourceUrl);
    if (url.origin !== 'https://app.clickup.com' || url.pathname !== `/t/${task.id}` || url.search || url.hash || url.username || url.password) throw new Error('Task source URL must identify the observed task');
    accounted.add(task.id);
    return { id: task.id, listId: CRM_LIST, status: task.status.trim().toLowerCase(), observedAt: task.observedAt, sourceUrl: url.href };
  });
  for (const id of input.unavailableTaskIds) {
    if (!requested.has(id) || accounted.has(id)) throw new Error('Unrequested or duplicate unavailable task');
    accounted.add(id);
  }
  if (accounted.size !== requested.size) throw new Error('Every linked task must be observed or explicitly unavailable');
  return { schemaVersion: 1, source: 'clickup-read-only', listId: CRM_LIST, capturedAt: input.capturedAt, sourceCapturedAt: request.sourceCapturedAt, tasks, unavailableTaskIds: [...input.unavailableTaskIds], requestedTasks: request.taskIds.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const source = await readPrivateJson('commercial-source.json');
  if (process.argv[2] === 'requests') console.log(JSON.stringify(crmRequests(source), null, 2));
  else if (process.argv[2] === 'import' && process.argv[3]) {
    const snapshot = validateCrmSnapshot(JSON.parse(await readFile(process.argv[3], 'utf8')), source);
    const file = await writeEvidence('commercial-crm.json', snapshot);
    console.log(JSON.stringify({ file, observedTasks: snapshot.tasks.length, unavailableTasks: snapshot.unavailableTaskIds.length }));
  } else throw new Error('Usage: crm-evidence.mjs requests | import /private/snapshot.json');
}
