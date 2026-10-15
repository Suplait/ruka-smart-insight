import { createHash } from 'node:crypto';
import { readFileSync, realpathSync, statSync, mkdirSync, writeFileSync, chmodSync } from 'node:fs';
import path from 'node:path';

// Private decision records. These are not leads, testimonials or deployed experiments.
const outcomes = new Set(['answer', 'evaluation_material', 'acceptance_test', 'owner_question', 'correction']);
const states = new Set(['open', 'supported', 'contradicted', 'needs_owner']);
const levels = new Set(['source_review', 'isolated_test', 'demo_observation', 'external_test', 'participant_feedback']);

function text(value, field, max = 2000) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) {
    throw new Error(`Buyer evidence requires ${field} (1–${max} characters)`);
  }
  return value.trim();
}

export function validateBuyerEvidence(input, now = new Date()) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Buyer evidence must be an object');
  const key = text(input.key, 'key', 100);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(key)) throw new Error('Buyer evidence key must be a stable slug');
  if (!outcomes.has(input.outcome)) throw new Error('Invalid buyer evidence outcome');
  if (!states.has(input.state)) throw new Error('Invalid buyer evidence state');
  if (input.privacyReviewed !== true) throw new Error('Buyer evidence requires a privacy review; do not store contact details or raw customer records');
  if (input.artifactSha256 != null && !/^[a-f0-9]{64}$/.test(input.artifactSha256)) throw new Error('Invalid buyer artifact SHA-256');
  if (input.outcome === 'owner_question' && input.state !== 'needs_owner') throw new Error('An owner question is pending, not a resolved uncertainty');
  if (!Array.isArray(input.evidence) || !input.evidence.length || input.evidence.length > 20) throw new Error('Buyer evidence requires 1–20 sources');
  return {
    key,
    question: text(input.question, 'question', 400),
    outcome: input.outcome,
    state: input.state,
    finding: text(input.finding, 'finding'),
    nextStep: text(input.nextStep, 'nextStep'),
    artifact: text(input.artifact, 'artifact', 600),
    privacyReviewed: true,
    ...(input.artifactSha256 ? { artifactSha256: text(input.artifactSha256, 'artifactSha256', 64) } : {}),
    evidence: input.evidence.map((source) => {
      if (!source || typeof source !== 'object') throw new Error('Evidence source must be an object');
      if (!levels.has(source.level)) throw new Error('Invalid evidence level');
      if (typeof source.observedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}T/.test(source.observedAt) || !Number.isFinite(Date.parse(source.observedAt))) throw new Error('Evidence requires an ISO observedAt');
      if (Date.parse(source.observedAt) > now.getTime()) throw new Error('Evidence cannot be observed in the future');
      const requiresPermission = ['external_test', 'participant_feedback'].includes(source.level);
      return {
        level: source.level,
        reference: text(source.reference, 'reference', 600),
        observedAt: new Date(source.observedAt).toISOString(),
        fact: text(source.fact, 'fact'),
        limitation: text(source.limitation, 'limitation'),
        ...(requiresPermission ? { authorizationRef: text(source.authorizationRef, 'authorizationRef', 600) } : {}),
      };
    }),
  };
}

export function verifyBuyerArtifact(input, cwd = process.cwd()) {
  const relative = input?.artifact;
  if (typeof relative !== 'string' || !/^\.organic-growth\/evidence\/[a-zA-Z0-9][a-zA-Z0-9/_.-]*\.(json|md|txt|pdf)$/.test(relative)) {
    throw new Error('Buyer artifact must be a local .organic-growth/evidence document');
  }
  const root = realpathSync(path.resolve(cwd, '.organic-growth/evidence'));
  if (!root.startsWith(`${realpathSync(cwd)}${path.sep}`)) throw new Error('Private evidence directory must stay inside the worktree');
  const target = realpathSync(path.resolve(cwd, relative));
  if (!target.startsWith(`${root}${path.sep}`)) throw new Error('Buyer artifact escapes the private evidence directory');
  const stat = statSync(target);
  if (!stat.isFile() || stat.size === 0 || stat.size > 10 * 1024 * 1024) throw new Error('Buyer artifact must be a nonempty file up to 10 MB');
  const hash = createHash('sha256').update(readFileSync(target)).digest('hex');
  if (input.artifactSha256 && input.artifactSha256 !== hash) throw new Error('Buyer artifact changed since validation');
  return { ...input, artifactSha256: hash };
}

export function archiveBuyerArtifact(input, databasePath, cwd = process.cwd()) {
  const verified = verifyBuyerArtifact(input, cwd);
  const buffer = readFileSync(path.resolve(cwd, verified.artifact));
  if (createHash('sha256').update(buffer).digest('hex') !== verified.artifactSha256) throw new Error('Buyer artifact changed while being archived');
  const directory = path.join(path.dirname(databasePath), 'buyer-artifacts');
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const target = path.join(directory, verified.artifactSha256);
  try { writeFileSync(target, buffer, { flag: 'wx', mode: 0o600 }); }
  catch (error) {
    if (error.code !== 'EEXIST') throw error;
    if (createHash('sha256').update(readFileSync(target)).digest('hex') !== verified.artifactSha256) throw new Error('Existing evidence archive failed its integrity check');
  }
  chmodSync(target, 0o600);
  return verified;
}

export function migrateBuyerEvidence(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS buyer_evidence (
    key TEXT PRIMARY KEY,
    payload_json TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`);
  db.exec(`CREATE TABLE IF NOT EXISTS buyer_evidence_history (
    key TEXT NOT NULL,
    revision INTEGER NOT NULL,
    content_hash TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    recorded_at TEXT NOT NULL,
    PRIMARY KEY(key, revision)
  )`);
}

export function backupBuyerArtifacts(snapshotDb, databasePath, backupDirectory) {
  const hashes = new Set(snapshotDb.prepare('SELECT payload_json FROM buyer_evidence_history').all()
    .map((row) => JSON.parse(row.payload_json).artifactSha256).filter(Boolean));
  const destination = path.join(backupDirectory, 'buyer-artifacts');
  if (hashes.size) mkdirSync(destination, { recursive: true, mode: 0o700 });
  for (const hash of hashes) {
    if (!/^[a-f0-9]{64}$/.test(hash)) throw new Error('Invalid archived artifact hash in backup');
    const bytes = readFileSync(path.join(path.dirname(databasePath), 'buyer-artifacts', hash));
    if (createHash('sha256').update(bytes).digest('hex') !== hash) throw new Error('Cannot back up corrupt buyer artifact');
    const target = path.join(destination, hash);
    try { writeFileSync(target, bytes, { flag: 'wx', mode: 0o600 }); }
    catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (createHash('sha256').update(readFileSync(target)).digest('hex') !== hash) throw new Error('Buyer artifact backup failed integrity check');
    }
    chmodSync(target, 0o600);
  }
  return { directory: destination, count: hashes.size };
}

export function saveBuyerEvidence(db, input, now) {
  const record = validateBuyerEvidence(input, now);
  const timestamp = now.toISOString();
  const payload = JSON.stringify(record);
  const hash = createHash('sha256').update(payload).digest('hex');
  db.exec('BEGIN IMMEDIATE');
  try {
    const previous = db.prepare('SELECT * FROM buyer_evidence_history WHERE key = ? ORDER BY revision DESC LIMIT 1').get(record.key);
    if (previous?.content_hash === hash) {
      db.exec('COMMIT');
      return { key: record.key, state: record.state, outcome: record.outcome, revision: previous.revision, recorded: false };
    }
    const revision = (previous?.revision || 0) + 1;
    db.prepare('INSERT INTO buyer_evidence_history(key, revision, content_hash, payload_json, recorded_at) VALUES (?, ?, ?, ?, ?)')
      .run(record.key, revision, hash, payload, timestamp);
    db.prepare(`INSERT INTO buyer_evidence(key, payload_json, created_at, updated_at) VALUES (?, ?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET payload_json = excluded.payload_json, updated_at = excluded.updated_at`)
      .run(record.key, payload, timestamp, timestamp);
    db.exec('COMMIT');
    return { key: record.key, state: record.state, outcome: record.outcome, revision, recorded: true };
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

export function readBuyerEvidence(db, now = new Date()) {
  return db.prepare('SELECT * FROM buyer_evidence ORDER BY updated_at DESC, key LIMIT 50').all()
    .map((row) => {
      const record = JSON.parse(row.payload_json);
      // Conservative review reminder, not automatic invalidation of a historical observation.
      const oldest = Math.min(...record.evidence.map((source) => Date.parse(source.observedAt)));
      return { ...record, createdAt: row.created_at, updatedAt: row.updated_at, reviewNeeded: now.getTime() - oldest > 30 * 86400000 };
    });
}

export function summarizeBuyerEvidence(records, { since, until }) {
  const rows = records.filter((record) => Date.parse(record.updatedAt) >= Date.parse(since) && Date.parse(record.updatedAt) <= Date.parse(until));
  return {
    updatedQuestions: rows.length,
    supported: rows.filter((record) => record.state === 'supported' && !record.reviewNeeded).length,
    contradicted: rows.filter((record) => record.state === 'contradicted').length,
    needsOwner: rows.filter((record) => record.state === 'needs_owner').length,
    reviewNeeded: rows.filter((record) => record.reviewNeeded).length,
    note: 'Preguntas y materiales internos; no son ventas, validaciones de clientes ni experimentos desplegados.',
  };
}
