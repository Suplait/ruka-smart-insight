import { readFile, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { supplierDigest } from "./validate-directory.mjs";

const origin = "https://www.ruka.ai";
const records = JSON.parse(await readFile("config/supplier-profiles.json", "utf8"));
const manifest = JSON.parse(await readFile("src/content/supplierManifest.json", "utf8"));
const report = { checkedAt: new Date().toISOString(), origin, profiles: 0, pages: 0, assets: 0, failures: [] };
async function request(route) {
  let error;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(`${origin}${route}`, { redirect: "manual", signal: AbortSignal.timeout(20000) });
      assert.equal(response.status, 200, `${route}: HTTP ${response.status}`);
      return { response, text: await response.text() };
    } catch (caught) { error = caught; }
  }
  throw error;
}
const queue = [...records];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const row = queue.shift();
    const route = `/proveedores/${row.slug}`;
    let dom;
    try {
      const { response, text } = await request(route);
      assert.match(response.headers.get("content-type"), /text\/html/);
      dom = new JSDOM(text);
      const doc = dom.window.document;
      assert.equal(doc.querySelector("h1")?.textContent, row.name);
      assert.equal(doc.querySelector('link[rel="canonical"]')?.href, `${origin}${route}`);
      assert.equal(doc.querySelector('meta[property="og:url"]')?.content, `${origin}${route}`);
      assert.equal(doc.querySelector('meta[name="description"]')?.content, row.summary);
      const embedded = JSON.parse(doc.querySelector("#supplier-profile-data")?.textContent ?? "null");
      assert.equal(supplierDigest(embedded), supplierDigest(row));
      assert.ok(doc.querySelector("main").textContent.includes(row.legalName));
      const graph = [...doc.querySelectorAll('script[type="application/ld+json"]')].flatMap(node => JSON.parse(node.textContent)["@graph"] ?? []);
      assert.equal(graph.find(node => node["@id"] === `${origin}${route}#supplier`)?.taxID, row.rut);
      assert.ok(graph.find(node => node["@type"] === "FAQPage")?.mainEntity.length >= 3);
      report.profiles++;
      if (report.profiles % 100 === 0) console.log(`Verified ${report.profiles}/${records.length} production profiles`);
    } catch (error) { report.failures.push({ route, error: error.message }); }
    finally { dom?.window.close(); }
  }
}));
const sitemap = (await request("/sitemap.xml")).text;
for (const row of records) assert.ok(sitemap.includes(`<loc>${origin}/proveedores/${row.slug}</loc>`));
const slugs = new Set();
for (let page = 1; page <= Math.ceil(records.length / manifest.pageSize); page++) {
  const route = page === 1 ? "/proveedores" : `/proveedores/pagina/${page}`;
  const dom = new JSDOM((await request(route)).text);
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelector('link[rel="canonical"]')?.href, `${origin}${route}`);
    const data = JSON.parse(doc.querySelector("#supplier-index-data").textContent);
    assert.equal(data.page, page);
    for (const row of data.entries) {
      assert.ok(!slugs.has(row.slug));
      slugs.add(row.slug);
      assert.ok(doc.querySelector(`main a[href="/proveedores/${row.slug}"]`));
    }
    const served = await request(`/supplier-data/page-${page}.json`);
    assert.deepEqual(JSON.parse(served.text), data.entries);
    assert.match(served.response.headers.get("x-robots-tag"), /noindex/);
    report.pages++;
  } finally { dom.window.close(); }
}
assert.equal(slugs.size, records.length);
for (const route of [...manifest.shards, `/supplier-data/${records[0].slug}.json`, "/sitemap-proveedores.xml", "/sitemap-proveedores-1.xml"]) {
  await request(route); report.assets++;
}
const home = new JSDOM((await request("/")).text);
assert.equal(home.window.document.querySelector('link[rel="canonical"]')?.href, `${origin}/`);
assert.match(home.window.document.querySelector("h1").textContent, /Tu empresa ya tiene los sistemas/);
home.window.close();
const missing = await fetch(`${origin}/proveedores/qa-inexistente-20261026`, { redirect: "manual" });
assert.equal(missing.status, 404);
const reportPath = process.argv[2];
if (reportPath) await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
assert.equal(report.failures.length, 0);
assert.equal(report.profiles, records.length);
