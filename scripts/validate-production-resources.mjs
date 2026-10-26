import { readFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { supplierDigest } from "./suppliers/validate-directory.mjs";

// Read-only public requests: no form submission, credentials, SII or product API calls.
const origin = process.argv[2] ?? "https://www.ruka.ai";
if (!/^https:\/\/[a-z0-9.-]+$/.test(origin)) throw new Error("An HTTPS origin without path is required");
const registry = JSON.parse(await readFile("config/editorial-publications.json", "utf8"));
const suppliers = JSON.parse(await readFile("config/supplier-profiles.json", "utf8"));
const routes = [...new Set(["/", "/register", "/restaurantes", "/hoteles", "/retail", "/one", "/partners", ...registry.publications.filter(p => p.status === "approved").map(p => p.path)])];
let checked = 0;
const failures = [];
const normalize = text => text?.replace(/\s+/g, " ").trim();
async function get(route) { return fetch(`${origin}${route}`, { redirect: "manual", signal: AbortSignal.timeout(25000) }); }
async function checkRoute(route) {
  const res = await get(route); assert.equal(res.status, 200, `${route}: HTTP`);
  assert.match(res.headers.get("content-type") ?? "", /text\/html/);
  assert.doesNotMatch(res.headers.get("x-robots-tag") ?? "", /noindex/);
  const html = await res.text();
  const local = new JSDOM(await readFile(path.join("dist", route, "index.html"), "utf8")).window.document;
  const remote = new JSDOM(html).window.document;
  assert.equal(remote.title, local.title, `${route}: title`);
  for (const selector of ['link[rel="canonical"]', 'meta[name="description"]', 'meta[property="og:url"]', 'meta[property="og:image"]', 'meta[name="robots"]']) {
    const a = local.querySelector(selector), b = remote.querySelector(selector);
    assert.equal(b?.getAttribute("content") ?? b?.getAttribute("href"), a?.getAttribute("content") ?? a?.getAttribute("href"), `${route}: ${selector}`);
  }
  assert.equal(normalize(remote.querySelector("h1")?.textContent), normalize(local.querySelector("h1")?.textContent), `${route}: server H1`);
  assert.ok((remote.querySelector("#root")?.textContent.length ?? 0) > 200, `${route}: not empty SPA`);
  const schemas = doc => [...doc.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent));
  assert.deepEqual(schemas(remote), schemas(local), `${route}: JSON-LD`);
  if (registry.publications.some(p => p.path === route)) assert.equal(normalize(remote.querySelector("main")?.textContent), normalize(local.querySelector("main")?.textContent), `${route}: complete reviewed server content`);
  assert.doesNotMatch(html, /caso-cliente-borrador|DECISIONES-Y-OPERACION|supplier-approvals|v3-api-verification/);
  checked++;
}
for (let start = 0; start < routes.length; start += 4) await Promise.all(routes.slice(start, start + 4).map(route => checkRoute(route).catch(error => failures.push(error.message))));
for (const row of suppliers) {
  try {
    const res = await get(`/supplier-data/${row.slug}.json`);
    assert.equal(res.status, 200); assert.match(res.headers.get("x-robots-tag") ?? "", /noindex/);
    assert.match(res.headers.get("content-type") ?? "", /application\/json/);
    assert.equal(supplierDigest(await res.json()), supplierDigest(row));
  } catch (error) { failures.push(`${row.slug} public JSON: ${error.message}`); }
}
for (const route of ["/proveedores/qa-no-existe-20261026", "/config/supplier-approvals.json", "/caso-cliente-borrador.html", "/evidencia/compra-toteat-2026-10-15.txt"]) {
  try { const res = await get(route); assert.ok([404, 410].includes(res.status), `${route}: expected 404/410, got ${res.status}`); } catch (error) { failures.push(error.message); }
}
for (const [route, target] of [["/v2", "/"], ["/precios", "/#precios"]]) {
  try { const res = await get(route); assert.ok([301, 308].includes(res.status), `${route}: permanent redirect`); assert.equal(new URL(res.headers.get("location"), origin).href, `${origin}${target}`); } catch (error) { failures.push(error.message); }
}
for (const route of ["/robots.txt", "/llms.txt", "/sitemap.xml", "/sitemap-proveedores.xml", "/sitemap-proveedores-1.xml", "/api/openapi.json"]) {
  try { const res = await get(route); assert.equal(res.status, 200, route); const body = await res.text(); assert.ok(!body.includes('<div id="root"'), `${route}: SPA fallback`); if (route.endsWith(".xml")) new JSDOM(body, { contentType: "application/xml" }); if (route.endsWith(".json")) JSON.parse(body); } catch (error) { failures.push(error.message); }
}
console.log(JSON.stringify({ origin, checkedServerPages: checked, expectedPages: routes.length, supplierJson: suppliers.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
