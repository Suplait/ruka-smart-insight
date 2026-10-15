import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { mkdtempSync, mkdirSync, writeFileSync, symlinkSync, rmSync, statSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { migrateBuyerEvidence, saveBuyerEvidence, readBuyerEvidence, validateBuyerEvidence, verifyBuyerArtifact, summarizeBuyerEvidence } from './buyer-evidence.mjs';

const fixture = () => ({
  key: 'purchase-unit-mismatch',
  question: '¿Qué ocurre si la unidad no coincide?',
  outcome: 'acceptance_test',
  state: 'supported',
  finding: 'El servicio rechaza el envío cuando recibe una resolución incompatible.',
  nextStep: 'Confirmar la detección en una cuenta de prueba autorizada.',
  artifact: '.organic-growth/evidence/unit-mismatch.json',
  privacyReviewed: true,
  evidence: [{ level: 'isolated_test', reference: 'local-test:unit-mismatch', observedAt: '2026-10-15T12:00:00Z', fact: 'Cero solicitudes salientes.', limitation: 'Resolución y respuesta de red controladas; no prueba el ERP externo.' }],
});

test('iteration 5: old observations remain historical, not newly validated by rereading or editing a summary', () => {
  const db = new DatabaseSync(':memory:');
  try {
    migrateBuyerEvidence(db);
    saveBuyerEvidence(db, fixture(), new Date('2026-12-15T13:00:00Z'));
    const records = readBuyerEvidence(db, new Date('2026-12-15T14:00:00Z'));
    assert.equal(records[0].reviewNeeded, true);
    const summary = summarizeBuyerEvidence(records, { since: '2026-12-01T00:00:00Z', until: '2026-12-16T00:00:00Z' });
    assert.equal(summary.updatedQuestions, 1);
    assert.equal(summary.supported, 0);
    assert.equal(summary.reviewNeeded, 1);
    assert.equal(summarizeBuyerEvidence(records, { since: '2027-01-01T00:00:00Z', until: '2027-01-16T00:00:00Z' }).updatedQuestions, 0);
  } finally { db.close(); }
});

test('iteration 4: the real cycle CLI validates without writes and records private progress without a deployment', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'ruka-buyer-cycle-'));
  const script = fileURLToPath(new URL('./register-cycle.mjs', import.meta.url));
  const database = path.join(directory, 'state.sqlite');
  const options = { cwd: directory, encoding: 'utf8', env: { ...process.env, ORGANIC_GROWTH_DB_PATH: database, ORGANIC_GROWTH_PUBLISHED_CHANGED: 'false' }, stdio: ['ignore', 'pipe', 'pipe'] };
  try {
    mkdirSync(path.join(directory, '.organic-growth/evidence'), { recursive: true });
    const progress = fixture();
    progress.evidence[0].observedAt = '2020-01-01T00:00:00Z';
    writeFileSync(path.join(directory, progress.artifact), '{"result":"blocked_before_network","synthetic":true}');
    writeFileSync(path.join(directory, '.organic-growth/engine-context.json'), JSON.stringify({ opportunities: [], experiments: [] }));
    const manifest = { changed: false, affectedUrls: [], evidence: [], experimentUpdates: [], buyerProgress: progress };
    const manifestPath = path.join(directory, '.organic-growth/change-manifest.json');
    writeFileSync(manifestPath, JSON.stringify(manifest));
    const validated = JSON.parse(execFileSync(process.execPath, [script, '--validate'], options));
    assert.equal(validated.buyerProgress, progress.key);
    assert.throws(() => statSync(database), /ENOENT/);
    const recorded = JSON.parse(execFileSync(process.execPath, [script], options));
    assert.equal(recorded.changed, false);
    assert.equal(recorded.experimentId, null);
    assert.equal(recorded.buyerProgress.recorded, true);
    const stored = new DatabaseSync(database);
    const storedRecord = JSON.parse(stored.prepare('SELECT payload_json FROM buyer_evidence').get().payload_json);
    stored.close();
    const archive = path.join(directory, 'buyer-artifacts', storedRecord.artifactSha256);
    assert.equal(readFileSync(archive, 'utf8'), readFileSync(path.join(directory, progress.artifact), 'utf8'));
    assert.equal(statSync(archive).mode & 0o777, 0o600);
    const control = fileURLToPath(new URL('./job-control.mjs', import.meta.url));
    const backup = JSON.parse(execFileSync(process.execPath, [control, 'backup'], options));
    assert.equal(backup.artifacts.count, 1);
    assert.equal(readFileSync(path.join(backup.artifacts.directory, storedRecord.artifactSha256), 'utf8'), readFileSync(archive, 'utf8'));
    const restored = new DatabaseSync(backup.path, { readOnly: true });
    assert.equal(restored.prepare('SELECT count(*) AS n FROM buyer_evidence_history').get().n, 1);
    restored.close();
    const replay = JSON.parse(execFileSync(process.execPath, [script], options));
    assert.equal(replay.buyerProgress.recorded, false);
    const db = new DatabaseSync(database);
    assert.equal(db.prepare('SELECT count(*) AS n FROM experiments').get().n, 0);
    db.close();
    writeFileSync(manifestPath, JSON.stringify({ ...manifest, affectedUrls: ['https://www.ruka.ai/'] }));
    assert.throws(() => execFileSync(process.execPath, [script, '--validate'], options), /choose one initiative/);
    writeFileSync(manifestPath, JSON.stringify({ ...manifest, evidence: [{ fabricatedPublicChange: true }] }));
    assert.throws(() => execFileSync(process.execPath, [script, '--validate'], options), /choose one initiative/);
    rmSync(path.join(directory, '.organic-growth'), { recursive: true });
    assert.equal(readFileSync(archive, 'utf8'), '{"result":"blocked_before_network","synthetic":true}');
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('iteration 3: artifacts must exist, stay private and match their validated content', () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), 'ruka-buyer-artifact-'));
  try {
    mkdirSync(path.join(directory, '.organic-growth/evidence'), { recursive: true });
    const record = fixture();
    assert.throws(() => verifyBuyerArtifact(record, directory), /ENOENT/);
    writeFileSync(path.join(directory, record.artifact), 'Observed result with synthetic inputs.');
    const verified = verifyBuyerArtifact(record, directory);
    assert.match(verified.artifactSha256, /^[a-f0-9]{64}$/);
    writeFileSync(path.join(directory, record.artifact), 'Changed result.');
    assert.throws(() => verifyBuyerArtifact(verified, directory), /changed/);
    writeFileSync(path.join(directory, 'outside.md'), 'Not allowed');
    symlinkSync(path.join(directory, 'outside.md'), path.join(directory, '.organic-growth/evidence/link.md'));
    assert.throws(() => verifyBuyerArtifact({ ...record, artifact: '.organic-growth/evidence/link.md' }, directory), /escapes/);
    assert.throws(() => verifyBuyerArtifact({ ...record, artifact: 'https://example.com/fake.md' }, directory), /local/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});

test('iteration 1: unsupported completion, future evidence and unapproved human research are rejected', () => {
  const now = new Date('2026-10-15T13:00:00Z');
  assert.throws(() => validateBuyerEvidence({ ...fixture(), privacyReviewed: false }, now), /privacy review/);
  assert.throws(() => validateBuyerEvidence({ ...fixture(), outcome: 'owner_question' }, now), /pending/);
  const future = fixture();
  future.evidence[0].observedAt = '2027-01-01T00:00:00Z';
  assert.throws(() => validateBuyerEvidence(future, now), /future/);
  const human = fixture();
  human.evidence[0].level = 'participant_feedback';
  assert.throws(() => validateBuyerEvidence(human, now), /authorizationRef/);
  human.evidence[0].authorizationRef = 'private-consent:pilot-01';
  assert.equal(validateBuyerEvidence(human, now).evidence[0].authorizationRef, 'private-consent:pilot-01');
});

test('a reproducible private result is preserved without creating a deployed experiment', () => {
  const db = new DatabaseSync(':memory:');
  try {
    migrateBuyerEvidence(db);
    saveBuyerEvidence(db, fixture(), new Date('2026-10-15T13:00:00Z'));
    assert.equal(readBuyerEvidence(db)[0].evidence[0].level, 'isolated_test');
    assert.equal(readBuyerEvidence(db)[0].state, 'supported');
    assert.equal(db.prepare("SELECT count(*) AS n FROM sqlite_master WHERE name = 'experiments'").get().n, 0);
  } finally { db.close(); }
});

test('a conclusion without evidence and its limitation is rejected', () => {
  assert.throws(() => validateBuyerEvidence({ ...fixture(), evidence: [] }));
  const record = fixture();
  delete record.evidence[0].limitation;
  assert.throws(() => validateBuyerEvidence(record), /limitation/);
});

test('iteration 2: replay is idempotent and a changed conclusion preserves its earlier revision', () => {
  const db = new DatabaseSync(':memory:');
  try {
    migrateBuyerEvidence(db);
    const now = new Date('2026-10-15T13:00:00Z');
    assert.equal(saveBuyerEvidence(db, fixture(), now).revision, 1);
    assert.equal(saveBuyerEvidence(db, fixture(), now).recorded, false);
    assert.equal(saveBuyerEvidence(db, { ...fixture(), state: 'contradicted', finding: 'Una prueba posterior contradice el alcance inicial.' }, now).revision, 2);
    const history = db.prepare('SELECT payload_json FROM buyer_evidence_history ORDER BY revision').all();
    assert.equal(history.length, 2);
    assert.equal(JSON.parse(history[0].payload_json).state, 'supported');
    assert.equal(readBuyerEvidence(db)[0].state, 'contradicted');
    assert.equal(db.isTransaction, false);
  } finally { db.close(); }
});
