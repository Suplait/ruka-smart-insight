import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteOrigin = "https://www.ruka.ai";

const routes = [
  {
    path: "/",
    title: "Agentes IA para automatizar procesos operativos | Ruka",
    canonical: `${siteOrigin}/`,
    h1: "Tu empresa ya tiene los sistemas. Ruka hace el trabajo que queda entre medio.",
    schema: ["Organization", "WebSite", "SoftwareApplication", "FAQPage", "WebPage"],
  },
  {
    path: "/about",
    title: "Quiénes somos | Ruka.ai",
    canonical: `${siteOrigin}/about`,
    h1: "No empezamos con Ruka.",
    schema: ["Organization", "WebSite", "AboutPage", "Person"],
  },
  {
    path: "/register",
    title: "Agentes IA para automatizar trabajo operativo | Ruka",
    canonical: `${siteOrigin}/register`,
    h1: "Cuéntanos qué trabajo manual quieres dejar de hacer.",
    schema: ["Organization", "WebSite", "WebPage", "SoftwareApplication", "FAQPage"],
  },
  {
    path: "/restaurantes",
    title: "Agentes IA para automatizar operaciones de restaurantes | Ruka",
    canonical: `${siteOrigin}/restaurantes`,
    h1: "El trabajo administrativo entre tu SII, POS y planillas, hecho por Ruka.",
    schema: ["Organization", "WebSite", "WebPage", "SoftwareApplication", "FAQPage"],
  },
  {
    path: "/hoteles",
    title: "Agentes IA para automatizar procesos en hoteles | Ruka",
    canonical: `${siteOrigin}/hoteles`,
    h1: "Menos trabajo manual entre compras, contabilidad y operación.",
    schema: ["Organization", "WebSite", "WebPage", "SoftwareApplication", "FAQPage"],
  },
  {
    path: "/retail",
    title: "Agentes IA para automatizar compras y operaciones de retail | Ruka",
    canonical: `${siteOrigin}/retail`,
    h1: "Tus compras no deberían terminar en otra planilla.",
    schema: ["Organization", "WebSite", "WebPage", "SoftwareApplication", "FAQPage"],
  },
  {
    path: "/productos/panel-control",
    title: "Panel de Control Empresarial - Decisiones en Tiempo Real | Ruka",
    canonical: `${siteOrigin}/productos/panel-control`,
    h1: "Convierte Tus Datos en Decisiones",
    schema: ["SoftwareApplication"],
  },
  {
    path: "/productos/cuentas-por-pagar",
    title: "Cuentas por Pagar - Automatiza Pagos a Proveedores | Ruka",
    canonical: `${siteOrigin}/productos/cuentas-por-pagar`,
    h1: "Cuentas por Pagar - Automatiza Pagos a Proveedores",
    schema: ["SoftwareApplication"],
  },
  {
    path: "/productos/stock",
    title: "Gestión de Stock e Inventario Automatizada - Ahorra 15+ horas/semana | Ruka",
    canonical: `${siteOrigin}/productos/stock`,
    h1: "Gestión de Stock e Inventario Automatizada",
    schema: ["SoftwareApplication"],
  },
  {
    path: "/privacy",
    title: "Política de Privacidad | Ruka.ai",
    canonical: `${siteOrigin}/privacy`,
    h1: "Política de Privacidad",
  },
  {
    path: "/terms",
    title: "Términos y Condiciones | Ruka.ai",
    canonical: `${siteOrigin}/terms`,
    h1: "Términos y Condiciones",
  },
  {
    path: "/works",
    title: "Automatización de procesos empresariales | Ruka.ai",
    canonical: `${siteOrigin}/works`,
    h1: "Hay procesos que no viven en ningún sistema. Viven en tu equipo.",
    schema: ["Organization", "WebSite", "Service", "WebPage"],
  },
];

const noIndexRoutes = [
  {
    path: "/productos/ejemplo",
    title: "Página de producto de ejemplo | Ruka.ai",
    canonical: `${siteOrigin}/productos/ejemplo`,
    h1: "Lorem Ipsum Dolor Sit Amet",
  },
  {
    path: "/works/contacto",
    title: "Cuéntanos tu proceso | Ruka Works",
    canonical: `${siteOrigin}/works/contacto`,
    h1: "Veamos si Ruka puede hacerse cargo.",
  },
];

const failures = [];
let assertions = 0;

function assert(condition, message) {
  assertions += 1;
  if (!condition) failures.push(message);
}

function routeFile(routePath) {
  return routePath === "/"
    ? path.join(projectRoot, "dist", "index.html")
    : path.join(projectRoot, "dist", routePath.slice(1), "index.html");
}

function getTagAttribute(html, selectorAttribute, selectorValue, targetAttribute) {
  const tags = html.match(/<(?:meta|link)\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const attributes = Object.fromEntries(
      [...tag.matchAll(/([:\w-]+)=(?:"([^"]*)"|'([^']*)')/g)].map((match) => [
        match[1].toLowerCase(),
        match[2] ?? match[3] ?? "",
      ]),
    );
    if (attributes[selectorAttribute] === selectorValue) return attributes[targetAttribute];
  }
  return undefined;
}

function textContent(markup) {
  return markup
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function collectSchemaTypes(value, output = []) {
  if (!value || typeof value !== "object") return output;
  if (Array.isArray(value)) {
    value.forEach((item) => collectSchemaTypes(item, output));
    return output;
  }
  if (typeof value["@type"] === "string") output.push(value["@type"]);
  Object.values(value).forEach((item) => collectSchemaTypes(item, output));
  return output;
}

function countSchemaType(value, expectedType) {
  if (!value || typeof value !== "object") return 0;
  if (Array.isArray(value)) {
    return value.reduce((total, item) => total + countSchemaType(item, expectedType), 0);
  }
  return (
    (value["@type"] === expectedType ? 1 : 0) +
    Object.values(value).reduce((total, item) => total + countSchemaType(item, expectedType), 0)
  );
}

function parseSchema(html, routePath) {
  const blocks = [
    ...html.matchAll(
      /<script[^>]*type=(?:"application\/ld\+json"|'application\/ld\+json')[^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  const values = [];
  for (const block of blocks) {
    try {
      values.push(JSON.parse(block[1]));
    } catch (error) {
      assert(false, `${routePath}: JSON-LD inválido (${error.message})`);
    }
  }
  return {
    values,
    types: [...new Set(values.flatMap((value) => collectSchemaTypes(value)))],
  };
}

async function validateRoute(route, { noIndex = false } = {}) {
  const html = await readFile(routeFile(route.path), "utf8");
  const title = textContent(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description = getTagAttribute(html, "name", "description", "content");
  const canonical = getTagAttribute(html, "rel", "canonical", "href");
  const ogUrl = getTagAttribute(html, "property", "og:url", "content");
  const robots = getTagAttribute(html, "name", "robots", "content") ?? "";
  const h1Matches = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  const h1 = h1Matches.map((match) => textContent(match[1]));
  const schema = parseSchema(html, route.path);

  assert(title === route.title, `${route.path}: title inesperado (${title})`);
  assert(canonical === route.canonical, `${route.path}: canonical inesperado (${canonical})`);
  assert(h1Matches.length === 1, `${route.path}: esperaba exactamente un H1 y encontré ${h1Matches.length}`);
  assert(h1[0] === route.h1, `${route.path}: H1 inesperado (${h1[0]})`);
  assert(!html.includes('name="keywords"'), `${route.path}: todavía contiene meta keywords`);
  assert(!html.includes('"aggregateRating"'), `${route.path}: contiene aggregateRating no verificable`);
  assert(!/<div id="root"><\/div>/.test(html), `${route.path}: root SSR está vacío`);

  if (noIndex) {
    assert(robots.includes("noindex"), `${route.path}: la ruta de ejemplo debe ser noindex`);
  } else {
    assert(Boolean(description), `${route.path}: falta meta description`);
    assert(ogUrl === route.canonical, `${route.path}: og:url no coincide con canonical (${ogUrl})`);
    assert(!robots.includes("noindex"), `${route.path}: ruta pública marcada noindex`);
  }

  for (const expectedType of route.schema ?? []) {
    assert(schema.types.includes(expectedType), `${route.path}: falta schema ${expectedType}`);
  }

  return { html, title, canonical, h1: h1[0], schema };
}

for (const route of routes) await validateRoute(route);
for (const route of noIndexRoutes) await validateRoute(route, { noIndex: true });

const homeHtml = await readFile(routeFile("/"), "utf8");
const homeSchemas = parseSchema(homeHtml, "/").values;
const faqSchema = homeSchemas
  .flatMap((schema) => schema["@graph"] ?? [schema])
  .find((schema) => schema?.["@type"] === "FAQPage");
assert(faqSchema?.mainEntity?.length === 9, `/: FAQPage debe contener 9 preguntas y contiene ${faqSchema?.mainEntity?.length ?? 0}`);
for (const question of faqSchema?.mainEntity ?? []) {
  assert(homeHtml.includes(question.name), `/: pregunta FAQ ausente del HTML visible: ${question.name}`);
  assert(homeHtml.includes(question.acceptedAnswer?.text), `/: respuesta FAQ ausente del HTML visible: ${question.name}`);
}
assert(homeHtml.includes('href="/works"'), "/: falta enlace HTML crawleable hacia /works");
assert(homeHtml.includes("Ver Ruka Works"), "/: falta copy contextual del enlace hacia Ruka Works");

const worksHtml = await readFile(routeFile("/works"), "utf8");
const worksVisibleText = textContent(worksHtml);
for (const requiredText of [
  "Hay procesos que no viven en ningún sistema. Viven en tu equipo.",
  "Ruka ya procesa millones de registros operativos para cientos de empresas.",
  "¿Qué procesos puede operar Ruka?",
  "Ruka funciona mejor en procesos repetitivos que cruzan sistemas, documentos, reglas y decisiones.",
]) {
  assert(worksVisibleText.includes(requiredText), `/works: falta contenido esencial prerenderizado (${requiredText})`);
}
assert(
  getTagAttribute(worksHtml, "name", "description", "content") ===
    "Automatiza procesos que cruzan ERP, SII, correo, planillas y sistemas internos. Ruka ejecuta reglas, maneja excepciones y actualiza tus sistemas sin reemplazarlos.",
  "/works: meta description inesperada",
);
const worksSchemaValues = parseSchema(worksHtml, "/works").values.flatMap((schema) => schema["@graph"] ?? [schema]);
const worksService = worksSchemaValues.find((schema) => schema?.["@type"] === "Service");
assert(
  worksService?.serviceType === "Automatización de procesos empresariales",
  "/works: serviceType no representa automatización de procesos empresariales",
);

const aboutHtml = await readFile(routeFile("/about"), "utf8");
const aboutVisibleText = textContent(aboutHtml);
for (const requiredText of [
  "Los productos cambiaron. Nosotros seguimos juntos.",
  "Antes de saber construir una startup, ya estábamos construyendo una.",
  "En cuatro días, las ventas de Etiner llegaron a cero.",
  "Ruka apareció cuando dejamos de defender la idea que teníamos.",
  "Camilo Silva",
  "Enzo Zerega",
  "Lorenzo Verdugo",
  "Benjamín Vega",
]) {
  assert(aboutVisibleText.includes(requiredText), `/about: falta contenido esencial prerenderizado (${requiredText})`);
}
const aboutSchema = parseSchema(aboutHtml, "/about");
assert(
  aboutSchema.values.reduce((total, value) => total + countSchemaType(value, "Person"), 0) === 4,
  "/about: esperaba 4 entidades Person para fundadores",
);
assert(!aboutHtml.includes('style="opacity:0'), "/about: el contenido editorial SSR no debe quedar oculto sin JavaScript");

const robots = await readFile(path.join(projectRoot, "dist", "robots.txt"), "utf8");
for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot"]) {
  assert(robots.includes(`User-agent: ${bot}`), `robots.txt: falta regla explícita para ${bot}`);
}
assert(robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`), "robots.txt: falta directiva Sitemap canónica");

const sitemap = await readFile(path.join(projectRoot, "dist", "sitemap.xml"), "utf8");
assert(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), "sitemap.xml: cabecera XML inválida");
for (const route of routes) {
  assert(sitemap.includes(`<loc>${route.canonical}</loc>`), `sitemap.xml: falta ${route.canonical}`);
}
for (const route of noIndexRoutes) {
  assert(!sitemap.includes(`<loc>${route.canonical}</loc>`), `sitemap.xml: incluye ruta noindex ${route.canonical}`);
}

const llms = await readFile(path.join(projectRoot, "dist", "llms.txt"), "utf8");
assert(llms.startsWith("# Ruka.ai"), "llms.txt: encabezado canónico ausente");
assert(llms.includes("## Páginas principales"), "llms.txt: falta guía de páginas principales");
assert(llms.includes("## Citas y atribución"), "llms.txt: falta guía de citas y atribución");

await access(path.join(projectRoot, "dist", "404.html"));
const notFound = await readFile(path.join(projectRoot, "dist", "404.html"), "utf8");
assert(notFound.includes("Página no encontrada"), "404.html: falta contenido de error real");
assert(!notFound.includes('<div id="root"></div>'), "404.html: no debe depender de un root SPA vacío");

const indexSource = await readFile(path.join(projectRoot, "index.html"), "utf8");
assert(!indexSource.includes("cdn.gpteng.co"), "index.html: todavía carga cdn.gpteng.co");
assert(indexSource.includes("https://www.googletagmanager.com"), "index.html: falta preconnect de Google Tag Manager");

const vercel = JSON.parse(await readFile(path.join(projectRoot, "vercel.json"), "utf8"));
const rewriteSources = new Set((vercel.rewrites ?? []).map((rewrite) => rewrite.source));
for (const route of [...routes, ...noIndexRoutes].filter((route) => route.path !== "/")) {
  assert(rewriteSources.has(route.path), `vercel.json: falta rewrite explícito para ${route.path}`);
}
assert(
  !(vercel.rewrites ?? []).some((rewrite) => rewrite.source === "/(.*)" || rewrite.source === "/:path*"),
  "vercel.json: un catch-all SPA impediría devolver un 404 HTTP real",
);
assert(
  (vercel.redirects ?? []).some(
    (redirect) => redirect.source === "/v2/:path*" && redirect.destination === "/" && redirect.permanent === true,
  ),
  "vercel.json: falta redirect permanente /v2 → /",
);
const headerBySource = new Map((vercel.headers ?? []).map((entry) => [entry.source, entry.headers]));
const headerValue = (source, key) =>
  headerBySource.get(source)?.find((header) => header.key.toLowerCase() === key.toLowerCase())?.value;
assert(
  headerValue("/sitemap.xml", "Content-Type")?.startsWith("application/xml"),
  "vercel.json: sitemap.xml debe servirse como application/xml",
);
assert(
  headerValue("/robots.txt", "Content-Type")?.startsWith("text/plain"),
  "vercel.json: robots.txt debe servirse como text/plain",
);
assert(
  headerValue("/llms.txt", "Content-Type")?.startsWith("text/plain"),
  "vercel.json: llms.txt debe servirse como text/plain",
);

if (failures.length) {
  console.error(`SEO/AEO validation failed: ${failures.length} of ${assertions} assertions failed.`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`SEO/AEO validation passed: ${assertions} assertions across ${routes.length + noIndexRoutes.length} prerendered routes.`);
console.log("Verified: route-specific HTML, metadata, H1s, JSON-LD, FAQ visibility, robots, sitemap, llms.txt and static 404.");
