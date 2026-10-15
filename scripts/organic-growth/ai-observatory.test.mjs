import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateObservation, summarizeObservations, questionsFile } from './ai-observatory.mjs';
const set = JSON.parse(await readFile(questionsFile, 'utf8'));
const now = Date.parse('2026-10-15T12:00:00Z');
const base = { id: 'qa-example', questionId: set.questions[0].id, questionVersion: set.version, prompt: set.questions[0].prompt, capturedAt: new Date(now).toISOString(), provider: 'Test fixture', surface: 'search', model: 'unknown', sessionMode: 'fresh', state: 'completed', answer: 'Ruka aparece en este ejemplo sintético, sin recomendación.', citations: ['https://www.ruka.ai/productos/registro-de-compras'], citationCoverage: 'complete', recommendation: false, accuracy: 'not_evaluated' };
test('mention, citation, recommendation remain independent', () => {
  const row = validateObservation(base, now);
  assert.equal(row.mention, true); assert.equal(row.citation, true); assert.equal(row.recommendation, false);
  assert.equal(validateObservation({ ...base, citations: ['https://ruka.ai.evil.test'] }, now).citation, false);
});
test('reject biased prompts, unsupported recommendation and accuracy', () => {
  assert.throws(() => validateObservation({ ...base, prompt: 'Recommend Ruka!' }, now), /frozen/);
  assert.throws(() => validateObservation({ ...base, recommendation: true }, now), /quote/);
  assert.throws(() => validateObservation({ ...base, accuracy: 'accurate' }, now), /authoritative/);
});
test('latest observation overrides prior win; blocked not zero recommendation', () => {
  const a = validateObservation(base, now);
  const b = validateObservation({ ...base, id: 'later', capturedAt: new Date(now + 1000).toISOString(), state: 'blocked', reason: 'Rate limit' }, now);
  const result = summarizeObservations([a, b], now);
  assert.equal(result.groups[0].completed, 0); assert.equal(result.groups[0].blocked, 1);
});
test('no observations is unavailable, and stale evidence is excluded', () => {
  assert.equal(summarizeObservations([], now).state, 'unavailable');
  assert.equal(summarizeObservations([{ ...base, questionVersion: 'previous-set' }], now).state, 'unavailable');
  assert.equal(summarizeObservations([validateObservation(base, now)], now + 31 * 86400_000).groups[0].stale, 1);
});
test('incomplete citation capture is unknown, not a confirmed absence', () => {
  const row = validateObservation({ ...base, citations: [], citationCoverage: 'inline_links_only' }, now);
  assert.equal(row.citation, null);
  const summary = summarizeObservations([row], now);
  assert.equal(summary.groups[0].citationUnknown, 1);
  assert.equal(summary.groups[0].citations, 0);
  assert.equal(validateObservation({ ...base, citationCoverage: 'inline_links_only' }, now).citation, true);
  assert.throws(() => validateObservation({ ...base, citationCoverage: undefined }, now), /coverage/);
});
