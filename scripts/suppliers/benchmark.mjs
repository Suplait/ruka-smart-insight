import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { directoryArtifacts } from "./generate-directory.mjs";

if (!process.argv[2]) throw new Error("Pass the isolated, Vite-built benchmark entry. Never use public/ or dist/ for synthetic output.");
process.env.NODE_ENV = "production";
const { renderSupplier } = await import(pathToFileURL(path.resolve(process.argv[2])));
const seed = JSON.parse(await readFile("config/supplier-profiles.json", "utf8"));
function rutFor(number) { let sum = 0, factor = 2; for (const digit of String(number).split("").reverse()) { sum += Number(digit) * factor; factor = factor === 7 ? 2 : factor + 1; } const dv = 11 - sum % 11; return `${number}-${dv === 11 ? "0" : dv === 10 ? "K" : dv}`; }

for (const count of [1000, 10000, 32000]) {
  const records = Array.from({ length: count }, (_, i) => ({ ...seed[i % seed.length], slug: `qa-synthetic-${i}`, name: `Synthetic business ${i}`, legalName: `Synthetic business ${i} SpA`, rut: rutFor(70000000 + i) }));
  const t0 = performance.now();
  const artifacts = directoryArtifacts(records);
  const compactText = JSON.stringify(artifacts.shards.flatMap(shard => shard.entries));
  const indexMs = performance.now() - t0;
  const searchTimes = [];
  const searchable = artifacts.shards.flatMap(shard => shard.entries).map(row => `${row.name} ${row.legalName} ${row.rut}`.toLowerCase().replace(/[^a-z0-9]/g, ""));
  for (let i = 0; i < 100; i++) { const start = performance.now(); searchable.filter(row => row.includes(String(70000000 + i))); searchTimes.push(performance.now() - start); }
  const startSSR = performance.now(); let htmlBytes = 0; const hash = createHash("sha256");
  for (const profile of records) { const html = renderSupplier(profile); htmlBytes += Buffer.byteLength(html); hash.update(html); }
  console.log(JSON.stringify({ synthetic: true, count, indexMs: Math.round(indexMs), shards: artifacts.shards.length, initialEntries: artifacts.manifest.initial.length, manifestBytes: Buffer.byteLength(JSON.stringify(artifacts.manifest)), compactBytes: Buffer.byteLength(compactText), compactGzipBytes: gzipSync(compactText).length, searchP95Ms: +searchTimes.sort((a,b) => a-b)[94].toFixed(3), fullSsrMs: Math.round(performance.now() - startSSR), htmlBytes, outputDigest: hash.digest("hex"), rssMb: Math.round(process.memoryUsage().rss / 1048576), caveat: "Local CPU/render benchmark; no filesystem writes, deployment upload, mobile CPU or network timings included. Synthetic profiles are never published." }));
}
