import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { auditDirectory, directoryDiff, supplierDigest, rutValid } from "./validate-directory.mjs";
import { directoryArtifacts } from "./generate-directory.mjs";

const records = JSON.parse(await readFile(new URL("../../config/supplier-profiles.json", import.meta.url), "utf8"));
const approvals = JSON.parse(await readFile(new URL("../../config/supplier-approvals.json", import.meta.url), "utf8"));
const now = new Date("2026-10-26T12:00:00Z");
test("all public profiles meet identity, provenance and exact-review gates", () => {
  const result = auditDirectory(records, approvals, now);
  assert.equal(result.accepted.length, 20);
  assert.deepEqual(result.quarantine, []);
});
test("a valid check digit does not override a natural-person classification", () => {
  const rows = [records[0]], a = [{ ...approvals[0], entityType: "natural" }];
  assert.ok(rutValid(rows[0].rut));
  assert.equal(auditDirectory(rows, a, now).accepted.length, 0);
});
test("invalid RUT, changed evidence, conflict and unknown fields cannot publish", () => {
  for (const change of [{ rut: "93.178.000-1" }, { legalName: "Otra empresa" }, { sources: [] }, { tenant_id: 2 }, { email: "persona@ejemplo.cl" }, { channel: { label: "Portal", url: "javascript:alert(1)", note: "Esta dirección nunca debe publicarse." } }]) {
    const row = { ...records[0], ...change };
    assert.equal(auditDirectory([row], approvals, now).accepted.length, 0);
  }
});
test("duplicates quarantine BOTH records, even with different slugs", () => {
  const a = records[0], b = { ...a, slug: "otro-slug" };
  assert.equal(auditDirectory([a, b], approvals, now).accepted.length, 0);
  assert.equal(auditDirectory([a], [approvals[0], approvals[0]], now).accepted.length, 0);
});
test("expired or impossible review dates fail closed", () => {
  assert.equal(auditDirectory(records, approvals, new Date("2027-06-01")).accepted.length, 0);
  const row = { ...records[0], reviewedAt: "2026-02-30" };
  assert.equal(auditDirectory([row], [{ ...approvals[0], sha256: supplierDigest(row) }], now).accepted.length, 0);
});
test("malformed rows and nested content are quarantined, not silently accepted", () => {
  for (const value of [null, [], "row", { ...records[0], sources: [null, null] }, { ...records[0], checks: [null, null, null] }, { ...records[0], channel: null }]) assert.equal(auditDirectory([value], approvals, now).accepted.length, 0);
});
test("release diff distinguishes changes, additions and removals; reversible", () => {
  const next = [{ ...records[0], name: "Nuevo nombre" }, { ...records[1], slug: "nuevo" }];
  assert.deepEqual(directoryDiff(records.slice(0, 2), next), { added: ["nuevo"], changed: [records[0].slug], removed: [records[1].slug] });
  assert.deepEqual(directoryDiff(next, records.slice(0, 2)).added, [records[1].slug]);
});
test("search is compact, initial load capped and shard names stable", () => {
  const fixtures = Array.from({ length: 10000 }, (_, index) => ({ ...records[index % records.length], slug: `synthetic-${index}`, name: `Empresa sintética ${index}` }));
  const artifacts = directoryArtifacts(fixtures);
  assert.equal(artifacts.manifest.initial.length, 20);
  assert.equal(artifacts.shards.length, 40);
  assert.equal(artifacts.profiles.length, 10000);
  assert.ok(artifacts.shards.every(s => s.entries.length <= 250 && s.entries.every(row => !("checks" in row))));
  assert.deepEqual(directoryArtifacts(records), directoryArtifacts([...records].reverse()));
});
