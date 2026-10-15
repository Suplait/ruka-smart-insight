import { mkdir, readFile, writeFile, rename, unlink, link, readdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import os from 'node:os';
import path from 'node:path';

// Evidence belongs to the local engine, not a disposable Git worktree.
export function evidenceRoot(env = process.env) {
  const database = env.ORGANIC_GROWTH_DB_PATH || path.join(os.homedir(), '.codex', 'ruka-organic-growth', 'state.sqlite');
  return path.resolve(env.ORGANIC_EVIDENCE_PATH || path.join(path.dirname(database), 'evidence'));
}

function destination(root, name) {
  if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*\.json$/.test(name)) throw new Error('Invalid evidence path');
  return path.join(root, name);
}

export async function readEvidence(name, root = evidenceRoot()) {
  return JSON.parse(await readFile(destination(root, name), 'utf8'));
}

export async function writeEvidence(name, value, { root = evidenceRoot(), immutable = false } = {}) {
  const file = destination(root, name);
  await mkdir(root, { recursive: true, mode: 0o700 });
  await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await writeFile(temporary, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    // Hard-link publication is atomic and rejects an existing immutable ID.
    if (immutable) await link(temporary, file);
    else await rename(temporary, file);
  } finally {
    await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
  return file;
}

export async function listEvidence(folder, root = evidenceRoot()) {
  if (!/^[a-z0-9-]+$/.test(folder)) throw new Error('Invalid evidence folder');
  const files = await readdir(path.join(root, folder)).catch(error => {
    if (error.code === 'ENOENT') return [];
    throw error;
  });
  return Promise.all(files.filter(file => /^[a-z0-9-]+\.json$/.test(file)).sort().map(file => readEvidence(`${folder}/${file}`, root)));
}
