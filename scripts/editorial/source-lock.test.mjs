import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { sourceHash, validateSourceLock } from "./validate-source-lock.mjs";

test("exact review rejects a changed source and unsafe paths", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ruka-editorial-lock-"));
  try {
    await mkdir(path.join(root, "config"));
    const entry = { path: "config/example.json", sha256: sourceHash('{"claim":"approved"}') };
    const writeLock = () => writeFile(path.join(root, "config/editorial-source-lock.json"), JSON.stringify({ version: 1, reviewedAt: "2026-10-26", files: [entry] }));
    await writeLock();
    await writeFile(path.join(root, entry.path), '{"claim":"approved"}');
    await validateSourceLock(root);
    await writeFile(path.join(root, entry.path), '{"claim":"unreviewed"}');
    await assert.rejects(validateSourceLock(root), /changed since the source review/);
    entry.path = "config/../../private.json";
    await writeLock();
    await assert.rejects(validateSourceLock(root), /Unsafe source review path/);
  } finally { await rm(root, { recursive: true, force: true }); }
});
