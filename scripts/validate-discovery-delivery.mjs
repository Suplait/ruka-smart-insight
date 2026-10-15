// Read-only, raw HTTP verification. Does not execute React or submit any form.
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
import { bodyText, normalizeText } from "./seo-body-text.mjs";

const origin = process.argv[2] ?? "https://www.ruka.ai";
const guides = JSON.parse(await readFile("src/content/integrationGuides.json", "utf8"));
const posts = await Promise.all((await readdir("src/content/blog/posts")).filter((file) => file.endsWith(".json")).map(async (file) => JSON.parse(await readFile(`src/content/blog/posts/${file}`, "utf8"))));
const discovery = [...guides.map((guide) => `/integraciones/${guide.slug}`), "/herramientas/conciliar-factura-orden-recepcion"];
const routes = ["/", "/register", "/restaurantes", "/hoteles", "/retail", "/blog", "/integraciones", ...posts.map((post) => `/blog/${post.slug}`), ...discovery];
const failures = [];
let assertions = 0;
const check = (condition, message) => { assertions++; if (!condition) failures.push(message); };
const text = (element) => element?.textContent?.replace(/\s+/g, " ").trim();
const get = (route) => fetch(new URL(route, origin), { redirect: "manual", signal: AbortSignal.timeout(30000), headers: { "User-Agent": "RukaDiscoveryQA/1.0" } });
const schema = (document) => [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((element) => { const value = JSON.parse(element.textContent); return value["@graph"] ?? [value]; });

for (const route of routes) {
  const response = await get(route);
  const html = await response.text();
  const local = new JSDOM(await readFile(`dist${route === "/" ? "" : route}/index.html`, "utf8")).window.document;
  const remote = new JSDOM(html).window.document;
  check(response.status === 200, `${route}: HTTP ${response.status}`);
  check(response.headers.get("content-type")?.includes("text/html"), `${route}: incorrect content type`);
  check(!response.headers.get("location"), `${route}: unexpected redirect`);
  check(!response.headers.get("x-robots-tag")?.includes("noindex"), `${route}: blocked by header`);
  for (const selector of ["title", "h1", 'link[rel="canonical"]', 'meta[name="description"]', 'meta[property="og:url"]', 'meta[name="robots"]']) {
    const value = (document) => { const el = document.querySelector(selector); return el?.getAttribute("content") ?? el?.getAttribute("href") ?? text(el); };
    check(Boolean(value(local)) && value(remote) === value(local), `${route}: different ${selector}`);
  }
  check(Boolean(text(local.querySelector("main"))) && text(remote.querySelector("main")) === text(local.querySelector("main")), `${route}: server HTML content differs from tested build`);
  try {
    const expected = schema(local);
    const actual = schema(remote);
    check(JSON.stringify(actual) === JSON.stringify(expected), `${route}: JSON-LD differs`);
    for (const faq of actual.filter((entry) => entry["@type"] === "FAQPage")) {
      for (const item of faq.mainEntity) check(bodyText(html).includes(normalizeText(item.acceptedAnswer.text)), `${route}: FAQ answer absent from source`);
    }
  } catch (error) { check(false, `${route}: invalid JSON-LD (${error.message})`); }
  console.log(`${response.status} ${route} · raw server HTML checked`);
}

for (const [route, type] of [["/sitemap.xml", "xml"], ["/llms.txt", "text/plain"], ["/robots.txt", "text/plain"]]) {
  const response = await get(route);
  const body = await response.text();
  check(response.status === 200 && response.headers.get("content-type")?.includes(type), `${route}: invalid delivery`);
  if (route !== "/robots.txt") for (const target of discovery) check(body.includes(`https://www.ruka.ai${target}`), `${route}: missing ${target}`);
  if (route === "/sitemap.xml") {
    const xml = new JSDOM(body, { contentType: "text/xml" }).window.document;
    const urls = [...xml.querySelectorAll("loc")].map((element) => element.textContent);
    check(urls.length === new Set(urls).size, "sitemap has duplicate URLs");
  }
}
for (const post of posts) {
  const response = await get(post.heroImage.src);
  const delivered = Buffer.from(await response.arrayBuffer());
  const expected = await readFile(`public${post.heroImage.src}`);
  const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
  check(response.status === 200 && response.headers.get("content-type")?.startsWith("image/"), `${post.slug}: image not served`);
  check(hash(delivered) === hash(expected), `${post.slug}: different screenshot delivered`);
}
for (const [route, target] of [["/v2", "/"], ["/precios", "/#precios"]]) {
  const response = await get(route);
  check([301, 308].includes(response.status), `${route}: not a permanent redirect`);
  const destination = new URL(response.headers.get("location") ?? route, origin);
  check(`${destination.pathname}${destination.hash}` === target, `${route}: wrong redirect destination`);
}
const missing = await get("/integraciones/no-existe-qa");
check(missing.status === 404, `unknown integration should return 404, received ${missing.status}`);

if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`Delivery verified: ${assertions} assertions, ${routes.length} pages, ${posts.length} article images, sitemap, llms, robots, redirects and 404. No browser JS was executed.`);
