import { readFile, writeFile, mkdir, readdir, unlink } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { auditDirectory, supplierDigest } from "./validate-directory.mjs";
import { supplierListing } from "../../src/utils/supplierListing.mjs";

export function directoryArtifacts(records, size = 250) {
  const pageSize = 25;
  const { rows, compact, pages } = supplierListing(records, pageSize);
  const shards = [];
  for (let start = 0; start < compact.length; start += size) {
    const entries = compact.slice(start, start + size);
    shards.push({ file: `search-${supplierDigest(entries).slice(0, 16)}.json`, entries });
  }
  return {
    manifest: { total: rows.length, pageSize, regions: [...new Set(compact.map(row => row.region).filter(Boolean))].sort(), categories: [...new Set(rows.map(row => row.category))].sort(), initial: compact.slice(0, pageSize), shards: shards.map(shard => `/supplier-data/${shard.file}`) },
    pages,
    shards,
    profiles: rows.map(row => ({ file: `${row.slug}.json`, content: row })),
  };
}

// Generated artifacts are public allowlisted data only. Approval metadata stays in config.
// Content-addressed shards allow cache reuse; each clean Vite build drops retired assets.
export async function generateDirectory(root = process.cwd()) {
  const records = JSON.parse(await readFile(path.join(root, "config/supplier-profiles.json"), "utf8"));
  const approvals = JSON.parse(await readFile(path.join(root, "config/supplier-approvals.json"), "utf8"));
  const release = JSON.parse(await readFile(path.join(root, "config/supplier-release.json"), "utf8"));
  const audit = auditDirectory(records, approvals);
  if (audit.quarantine.length) throw new Error(JSON.stringify(audit.quarantine));
  if (records.length > 1000) throw new Error("Expansion beyond 1000 profiles requires the documented search, deployment and editorial scale review.");
  const datasetHash = supplierDigest([...records].sort((a, b) => a.slug.localeCompare(b.slug)));
  if (release.version !== 1 || release.count !== records.length || release.datasetSha256 !== datasetHash) throw new Error("Supplier release differs from reviewed manifest. Review additions, changes and removals before explicitly approving a release.");
  const artifacts = directoryArtifacts(audit.accepted);
  const directory = path.join(root, "public/supplier-data");
  await mkdir(directory, { recursive: true });
  const expectedFiles = new Set([...artifacts.shards, ...artifacts.pages, ...artifacts.profiles].map(item => item.file));
  for (const name of await readdir(directory)) {
    if (/^[a-z0-9-]+\.json$/.test(name) && !expectedFiles.has(name)) await unlink(path.join(directory, name));
  }
  const writeChanged = async (file, data) => {
    const content = `${JSON.stringify(data)}\n`;
    try { if (await readFile(file, "utf8") === content) return; } catch (error) { if (error.code !== "ENOENT") throw error; }
    await writeFile(file, content);
  };
  for (const shard of artifacts.shards) await writeChanged(path.join(directory, shard.file), shard.entries);
  for (const page of artifacts.pages) await writeChanged(path.join(directory, page.file), page.entries);
  for (const profile of artifacts.profiles) await writeChanged(path.join(directory, profile.file), profile.content);
  await writeChanged(path.join(root, "src/content/supplierManifest.json"), artifacts.manifest);
  console.log(`Generated ${records.length} supplier profiles, ${artifacts.pages.length} pages and ${artifacts.shards.length} search shards; initial index capped at 25.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await generateDirectory();
