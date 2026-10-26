import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { auditDirectory, supplierDigest } from "./validate-directory.mjs";

const root = process.cwd();
const records = JSON.parse(await readFile(path.join(root, "config/supplier-profiles.json"), "utf8"));
const approvals = JSON.parse(await readFile(path.join(root, "config/supplier-approvals.json"), "utf8"));
assert.equal(auditDirectory(records, approvals).quarantine.length, 0);
const sitemap = await readFile(path.join(root, "dist/sitemap.xml"), "utf8");
for (const row of records) {
  const url = `https://www.ruka.ai/proveedores/${row.slug}`;
  const html = await readFile(path.join(root, "dist/proveedores", row.slug, "index.html"), "utf8");
  const doc = new JSDOM(html).window.document;
  assert.equal(doc.querySelector("h1")?.textContent, row.name);
  assert.ok(doc.querySelector("main")?.textContent.includes(row.legalName));
  assert.ok(doc.querySelector("main")?.textContent.includes(row.rut));
  assert.equal(doc.querySelector('link[rel="canonical"]')?.href, url);
  assert.ok(sitemap.includes(`<loc>${url}</loc>`));
  for (const source of row.sources) assert.ok([...doc.querySelectorAll("main a")].some(a => a.href === source.url));
  const embedded = JSON.parse(doc.querySelector("#supplier-profile-data")?.textContent ?? "null");
  const served = JSON.parse(await readFile(path.join(root, "dist/supplier-data", `${row.slug}.json`), "utf8"));
  assert.equal(supplierDigest(embedded), supplierDigest(row));
  assert.equal(supplierDigest(served), supplierDigest(row));
  const graph = [...doc.querySelectorAll('script[type="application/ld+json"]')].flatMap(node => JSON.parse(node.textContent)["@graph"] ?? []);
  const supplier = graph.find(node => node["@id"] === `${url}#supplier`);
  assert.equal(supplier?.taxID, row.rut);
  assert.equal(supplier?.legalName, row.legalName);
  assert.ok(!supplier?.aggregateRating);
}
const manifest = JSON.parse(await readFile(path.join(root, "src/content/supplierManifest.json"), "utf8"));
const expected = new Set([...records.map(row => `${row.slug}.json`), ...manifest.shards.map(file => path.basename(file))]);
assert.deepEqual(new Set(await readdir(path.join(root, "dist/supplier-data"))), expected, "Retired data must not remain public");
const xml = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
const batches = [];
for (let start = 0; start < records.length; start += 2000) {
  const filename = `sitemap-proveedores-${batches.length + 1}.xml`;
  const content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${records.slice(start, start + 2000).map(row => `<url><loc>${xml(`https://www.ruka.ai/proveedores/${row.slug}`)}</loc><lastmod>${row.reviewedAt}</lastmod></url>`).join("")}</urlset>`;
  assert.ok(Buffer.byteLength(content) < 50 * 1024 * 1024);
  await writeFile(path.join(root, "dist", filename), content);
  batches.push(filename);
}
await writeFile(path.join(root, "dist/sitemap-proveedores.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${batches.map(file => `<sitemap><loc>https://www.ruka.ai/${file}</loc></sitemap>`).join("")}</sitemapindex>`);
console.log(`Supplier server HTML, canonical, provenance, structured identity and data checked for all ${records.length} profiles. Family sitemap: ${batches.length} batches.`);
