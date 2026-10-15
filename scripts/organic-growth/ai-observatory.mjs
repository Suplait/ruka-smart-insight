import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { writePrivateJson } from './lib.mjs';
import { listEvidence, writeEvidence } from './evidence-store.mjs';

export const digest = value => createHash('sha256').update(value).digest('hex');
export const questionsFile = new URL('../../docs/organic-growth/ai-questions.json', import.meta.url);
const set = JSON.parse(await readFile(questionsFile, 'utf8'));
const isRuka = value => { try { return ['www.ruka.ai', 'ruka.ai'].includes(new URL(value).hostname); } catch { return false; } };

export function validateObservation(input, now = Date.now()) {
  const question = set.questions.find(row => row.id === input.questionId);
  if (!question || input.questionVersion !== set.version || input.prompt !== question.prompt) throw new Error('Question/version must match the frozen question set exactly');
  if (!/^[a-z0-9-]{5,100}$/.test(input.id || '')) throw new Error('Invalid observation ID');
  const at = Date.parse(input.capturedAt);
  if (!Number.isFinite(at) || at > now + 300_000) throw new Error('Invalid capture time');
  for (const key of ['provider', 'surface', 'model', 'sessionMode']) if (typeof input[key] !== 'string' || !input[key].trim()) throw new Error(`Missing ${key}`);
  if (!['completed', 'blocked', 'no_answer'].includes(input.state)) throw new Error('Invalid observation state');
  if (input.state !== 'completed') {
    if (!input.reason) throw new Error('Missing blocker reason');
    return { ...input, mention: null, citation: null, recommendation: null, accuracy: 'not_evaluated', promptHash: digest(input.prompt), questionBranded: question.branded };
  }
  if (typeof input.answer !== 'string' || input.answer.length < 40 || input.answer.length > 100_000) throw new Error('Missing complete response evidence');
  if (!Array.isArray(input.citations) || input.citations.some(url => { try { return !['http:', 'https:'].includes(new URL(url).protocol); } catch { return true; } })) throw new Error('Invalid citation URLs');
  if (!['complete', 'inline_links_only'].includes(input.citationCoverage)) throw new Error('Citation capture coverage must be explicit');
  if (!['accurate', 'inaccurate', 'mixed', 'not_evaluated'].includes(input.accuracy)) throw new Error('Invalid accuracy review');
  if (input.accuracy !== 'not_evaluated' && (!input.accuracyNotes || !input.verifiedAgainst?.length)) throw new Error('Accuracy requires a review against cited authoritative sources');
  if (typeof input.recommendation !== 'boolean') throw new Error('Recommendation requires an explicit review');
  if (input.recommendation && (!input.recommendationQuote || !input.answer.includes(input.recommendationQuote) || !/ruka/i.test(input.recommendationQuote))) throw new Error('Recommendation requires an exact Ruka recommendation quote in the response');
  const citation = input.citations.some(isRuka) ? true : input.citationCoverage === 'complete' ? false : null;
  return { ...input, mention: /\bruka(?:\.ai)?\b/i.test(input.answer), citation, promptHash: digest(input.prompt), answerHash: digest(input.answer), questionBranded: question.branded };
}

export function summarizeObservations(observations, now = Date.now()) {
  // One latest run per question/provider/surface/model/mode; never cherry-pick wins.
  const latest = new Map();
  for (const row of observations.filter(item => item.questionVersion === set.version).sort((a, b) => a.capturedAt.localeCompare(b.capturedAt))) {
    latest.set(JSON.stringify([row.questionId, row.provider, row.surface, row.model, row.sessionMode]), row);
  }
  const groups = new Map();
  for (const row of latest.values()) {
    const key = JSON.stringify([row.provider, row.surface, row.model, row.sessionMode, row.questionBranded]);
    if (!groups.has(key)) groups.set(key, { provider: row.provider, surface: row.surface, model: row.model, sessionMode: row.sessionMode, branded: row.questionBranded, completed: 0, blocked: 0, stale: 0, mentions: 0, citations: 0, citationUnknown: 0, recommendations: 0, inaccurate: 0, notEvaluated: 0, questionIds: [] });
    const group = groups.get(key); group.questionIds.push(row.questionId);
    if (now - Date.parse(row.capturedAt) > 30 * 86400_000) { group.stale++; continue; }
    if (row.state !== 'completed') { group.blocked++; continue; }
    group.completed++;
    if (row.citation === null) group.citationUnknown++;
    for (const [field, flag] of [['mentions', 'mention'], ['citations', 'citation'], ['recommendations', 'recommendation']]) group[field] += Number(row[flag]);
    if (['mixed', 'inaccurate'].includes(row.accuracy)) group.inaccurate++;
    if (row.accuracy === 'not_evaluated') group.notEvaluated++;
  }
  return { schemaVersion: 1, questionVersion: set.version, expectedQuestions: set.questions.length, state: latest.size ? 'observed' : 'unavailable', groups: [...groups.values()], caveat: 'Fixed-query observations, not market share. Branded/non-branded, models and browsing surfaces stay separate. Blocked answers are missing, not failures to recommend. No causal claim from a before/after pair.' };
}

export async function readObservatory(root) {
  // Historical versions remain immutable but do not contaminate a new cohort.
  const observations = (await listEvidence('ai-observations', root)).filter(row => row.questionVersion === set.version).map(row => validateObservation(row));
  return summarizeObservations(observations);
}

async function main() {
  if (process.argv[2] === 'questions') { console.log(JSON.stringify(set, null, 2)); return; }
  if (process.argv[2] === 'import') {
    const input = JSON.parse(await readFile(process.argv[3], 'utf8'));
    const observation = validateObservation(input);
    await writeEvidence(`ai-observations/${observation.id}.json`, observation, { immutable: true });
  }
  const result = await readObservatory(); await writePrivateJson('ai-observatory.json', result); console.log(JSON.stringify(result, null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
