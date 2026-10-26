import { readFile, readdir, access } from "node:fs/promises";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

// Read-only: validate generated HTML or the actual HTTP response, never the hydrated DOM.
const origin = process.argv[2];
const canonicalOrigin = "https://www.ruka.ai";
async function pages(dir, prefix = "") {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) result.push(...await pages(`${dir}/${entry.name}`, `${prefix}/${entry.name}`));
    else if (entry.name === "index.html") result.push(prefix || "/");
  }
  return result;
}
const routes = (await pages("dist")).filter(path => /^\/(herramientas|ayuda|guias\/compras|proveedores|desarrolladores|comparar|recursos)(\/|$)/.test(path));
assert(routes.length >= 25, "Missing resource routes in build");
for (const path of routes) {
  let html;
  if (origin) {
    const response = await fetch(`${origin}${path}`, { redirect: "manual" });
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /text\/html/, path);
    html = await response.text();
  } else html = await readFile(`dist${path}/index.html`, "utf8");
  const document = new JSDOM(html).window.document;
  const nextSteps = document.querySelectorAll("main [data-resource-next-step]");
  assert.equal(nextSteps.length, 1, `${path}: exactly one contextual next step`);
  const next = nextSteps[0];
  assert(next.querySelector('a[href="/register"]'), `${path}: optional conversation`);
  const product = next.querySelector("a[data-resource-product]");
  assert(product?.textContent?.includes("Ruka") || /costos|compras|recepción/.test(product?.textContent ?? ""), path);
  const href = product.getAttribute("href");
  assert(href.startsWith("/") && !href.startsWith("//"), path);
  await access(`dist${href === "/" ? "" : href}/index.html`);
  assert(!next.querySelector("form,input,button"), `${path}: no lead gate`);
  assert.equal(document.querySelectorAll("h1").length, 1, path);
  assert.equal(document.querySelector('link[rel="canonical"]')?.getAttribute("href"), `${canonicalOrigin}${path}`, path);
  assert(!document.querySelector('meta[name="robots"]')?.content.includes("noindex"), path);
  const graph = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(script => JSON.parse(script.textContent)["@graph"] ?? []);
  const breadcrumb = graph.find(entity => entity["@type"] === "BreadcrumbList");
  assert(breadcrumb, path);
  for (const item of breadcrumb.itemListElement) {
    const parent = new URL(item.item).pathname;
    await access(`dist${parent === "/" ? "" : parent}/index.html`);
  }
  if (path.startsWith("/herramientas/")) {
    assert(breadcrumb.itemListElement.some(item => item.item === `${canonicalOrigin}/recursos`), path);
    const app = graph.find(entity => entity["@type"] === "WebApplication");
    assert.equal(app?.isAccessibleForFree, true, path);
    assert.equal(app?.publisher?.["@id"], `${canonicalOrigin}/#organization`, path);
  }
  console.log(`PASS ${path}`);
}
console.log(`${routes.length} resource pages: contextual links, server HTML, schema and destinations verified${origin ? ` on ${origin}` : " in production build"}.`);
