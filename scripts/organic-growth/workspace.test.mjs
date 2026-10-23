import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';

const cli = new URL('./job-control.mjs', import.meta.url).pathname;
const lib = new URL('./lib.mjs', import.meta.url).href;

function fixture() {
  const cwd = mkdtempSync(path.join(os.tmpdir(), 'organic-workspace-test-'));
  return {
    cwd,
    database: path.join(cwd, 'state.sqlite'),
    options: { cwd, encoding: 'utf8', env: { ...process.env, ORGANIC_GROWTH_DB_PATH: path.join(cwd, 'state.sqlite'), GITHUB_OUTPUT: '', ORGANIC_GROWTH_FORCE: 'false' } },
    close() { rmSync(cwd, { recursive: true, force: true }); },
  };
}

test('claim prepares a private directory before auxiliary checks, without a GSC collector', () => {
  const f = fixture();
  try {
    assert.equal(existsSync(path.join(f.cwd, '.organic-growth')), false);
    const output = execFileSync(process.execPath, [cli, 'claim', 'monitoring'], f.options);
    assert.match(output, /claimed=true/);
    const directory = path.join(f.cwd, '.organic-growth');
    assert.equal(statSync(directory).mode & 0o777, 0o700);
    // Reproduce the failed ad-hoc write from Oct 23, before npm ci / organic:gsc.
    execFileSync(process.execPath, ['--input-type=module', '-e', "import {writeFile} from 'node:fs/promises'; await writeFile('.organic-growth/endpoints-extra.json', JSON.stringify({checked:true}), {mode:0o600});"], f.options);
    assert.deepEqual(JSON.parse(readFileSync(path.join(directory, 'endpoints-extra.json'), 'utf8')), { checked: true });
    assert.match(execFileSync(process.execPath, [cli, 'claim', 'monitoring'], f.options), /reason=active_lease/);
    assert.equal(existsSync(path.join(f.cwd, 'node_modules')), false);
  } finally { f.close(); }
});

test('a blocked workspace fails before acquiring a lease or initializing state', () => {
  const f = fixture();
  try {
    writeFileSync(path.join(f.cwd, '.organic-growth'), 'not a directory');
    assert.throws(() => execFileSync(process.execPath, [cli, 'claim', 'monitoring'], { ...f.options, stdio: 'pipe' }), /EEXIST/);
    assert.equal(existsSync(f.database), false);
  } finally { f.close(); }
});

test('private helper supports parallel evidence writes and completion retains recovery evidence', () => {
  const f = fixture();
  try {
    execFileSync(process.execPath, ['--input-type=module', '-e', `import {writePrivateJson} from ${JSON.stringify(lib)}; await Promise.all([writePrivateJson('a.json',{ok:true}), writePrivateJson('b.json',{ok:true})]);`], f.options);
    for (const name of ['a.json', 'b.json']) assert.equal(statSync(path.join(f.cwd, '.organic-growth', name)).mode & 0o777, 0o600);
    const output = execFileSync(process.execPath, [cli, 'claim', 'monitoring'], f.options);
    const runId = output.match(/^run_id=(.+)$/m)[1];
    const summary = { health: 'healthy', recoveredErrors: [{ code: 'ENOENT', verification: 'Auxiliary step rerun successfully; evidence read back.' }] };
    execFileSync(process.execPath, [cli, 'complete'], { ...f.options, env: { ...f.options.env, ORGANIC_GROWTH_RUN_ID: runId, ORGANIC_GROWTH_SUMMARY: JSON.stringify(summary) } });
    const db = new DatabaseSync(f.database, { readOnly: true });
    const row = db.prepare('SELECT status, summary_json FROM runs WHERE id=?').get(runId);
    assert.equal(row.status, 'succeeded');
    assert.deepEqual(JSON.parse(row.summary_json), summary);
    assert.equal(db.prepare('SELECT COUNT(*) n FROM incidents').get().n, 0);
    db.close();
  } finally { f.close(); }
});
