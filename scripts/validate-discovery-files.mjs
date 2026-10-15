import { readFile } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const root = process.cwd(), dist = path.join(root, "dist");
const xml = new JSDOM(await readFile(path.join(dist, "sitemap.xml"), "utf8"), { contentType: "application/xml" });
const urls = [...xml.window.document.querySelectorAll("loc")].map(node => node.textContent);
const full = await readFile(path.join(dist, "llms-full.txt"), "utf8");
const llms = await readFile(path.join(dist, "llms.txt"), "utf8");
let checks = 0;
for (const url of urls) {
  const pathname = new URL(url).pathname;
  const markdownPath = `${pathname === "/" ? "/index" : pathname}.md`;
  const markdown = await readFile(path.join(dist, "readable", markdownPath), "utf8");
  assert.ok(markdown.includes(`Fuente original: ${url}`));
  assert.ok(llms.includes(markdownPath)); assert.ok(full.includes(markdown));
  assert.ok(!markdown.includes("<script")); checks += 4;
  const doc = new JSDOM(await readFile(path.join(dist, pathname, "index.html"), "utf8")).window.document;
  if (pathname.startsWith("/productos/")) {
    const links = [...doc.querySelectorAll('main a[href]')].filter(link => /\/(blog|herramientas|integraciones)\//.test(link.getAttribute("href")));
    assert.ok(links.length >= 2, `${pathname}: missing contextual resources`); checks++;
    for (const link of links) { assert.ok(urls.includes(new URL(link.getAttribute("href"), url).href)); checks++; }
  }
  if (pathname.startsWith("/blog/")) {
    const image = doc.querySelector('meta[property="og:image"]').content;
    assert.equal(image, `https://www.ruka.ai/blog/og/${pathname.split("/").at(-1)}.png`);
    const bytes = await readFile(path.join(dist, new URL(image).pathname));
    assert.equal(bytes.readUInt32BE(16), 1200); assert.equal(bytes.readUInt32BE(20), 630); checks += 3;
  }
}
const rss = new JSDOM(await readFile(path.join(dist, "rss.xml"), "utf8"), { contentType: "application/xml" });
const items = [...rss.window.document.querySelectorAll("item")];
assert.equal(items.length, urls.filter(url => new URL(url).pathname.startsWith("/blog/")).length); checks++;
for (const item of items) { assert.ok(urls.includes(item.querySelector("link").textContent)); checks++; }
const robots = await readFile(path.join(dist, "robots.txt"), "utf8");
assert.equal((robots.match(/^Allow:/gm) || []).length, 1, "Use one shared policy for explicit and generic bots"); checks++;
assert.ok(!full.includes("/onboarding-success#")); checks++;
console.log(`Discovery validation passed: ${checks} checks, ${urls.length} Markdown pages, ${items.length} article previews and RSS entries.`);
