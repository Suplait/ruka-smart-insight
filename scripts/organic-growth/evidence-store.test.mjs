import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, stat, readdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { evidenceRoot, writeEvidence, readEvidence, listEvidence } from './evidence-store.mjs';

async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ruka-evidence-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test('persistent location follows local database, not checkout', () => {
  assert.equal(evidenceRoot({ ORGANIC_GROWTH_DB_PATH: '/private/engine/state.sqlite' }), '/private/engine/evidence');
  assert.equal(evidenceRoot({ ORGANIC_EVIDENCE_PATH: '/private/isolated-evidence' }), '/private/isolated-evidence');
});
test('immutable IDs cannot be overwritten and files are private', async t => {
  const root = await fixture(t);
  const file = await writeEvidence('ai-observations/test-one.json', { answer: 'original' }, { root, immutable: true });
  await assert.rejects(writeEvidence('ai-observations/test-one.json', { answer: 'replacement' }, { root, immutable: true }), { code: 'EEXIST' });
  assert.deepEqual(await readEvidence('ai-observations/test-one.json', root), { answer: 'original' });
  assert.equal((await stat(file)).mode & 0o777, 0o600);
  assert.equal((await stat(path.dirname(file))).mode & 0o777, 0o700);
  assert.deepEqual(await readdir(path.dirname(file)), ['test-one.json']);
});
test('mutable receipts replace atomically; independent readers see same history', async t => {
  const root = await fixture(t);
  await writeEvidence('indexnow-receipt.json', { status: 'pending' }, { root });
  await writeEvidence('indexnow-receipt.json', { status: 'accepted' }, { root });
  assert.deepEqual(await readEvidence('indexnow-receipt.json', root), { status: 'accepted' });
  await writeEvidence('ai-observations/observed.json', { answer: 'captured' }, { root, immutable: true });
  assert.deepEqual(await listEvidence('ai-observations', root), [{ answer: 'captured' }]);
  assert.deepEqual(await listEvidence('not-yet-collected', root), []);
});
test('reject traversal and surface corrupt evidence instead of silently losing it', async t => {
  const root = await fixture(t);
  await assert.rejects(writeEvidence('../leak.json', {}, { root }), /Invalid/);
  await assert.rejects(listEvidence('../outside', root), /Invalid/);
  await writeEvidence('ai-observations/broken.json', {}, { root });
  await writeFile(path.join(root, 'ai-observations/broken.json'), '{');
  await assert.rejects(listEvidence('ai-observations', root), SyntaxError);
});
