import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteOrigin = "https://www.ruka.ai";
const oneDescription = "Con Ruka One llevamos procesos propios de tu empresa a operar sobre tus sistemas, reglas y datos actuales, sin reemplazar el software que ya usas.";
const oneServiceDescription = "Ruka One es la forma de trabajar con Ruka sobre procesos específicos de una empresa, llevándolos a operar sobre sus sistemas, reglas y datos actuales.";

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
    path: "/one",
    title: "Automatización de procesos empresariales | Ruka One",
    canonical: `${siteOrigin}/one`,
    h1: "Hay procesos que no viven en ningún sistema. Viven en tu equipo.",
    schema: ["Organization", "WebSite", "Service", "WebPage", "BreadcrumbList", "FAQPage"],
    ogImage: `${siteOrigin}/ruka-one-og.png`,
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
    path: "/one/contacto",
    title: "Cuéntanos tu proceso | Ruka One",
    canonical: `${siteOrigin}/one/contacto`,
    h1: "¿Qué parte de tu operación sigue siendo manual?",
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
  const ogImage = getTagAttribute(html, "property", "og:image", "content");
  const ogImageAlt = getTagAttribute(html, "property", "og:image:alt", "content");
  const twitterImage = getTagAttribute(html, "name", "twitter:image", "content");
  const twitterImageAlt = getTagAttribute(html, "name", "twitter:image:alt", "content");
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
    assert(robots.includes("noindex"), `${route.path}: la ruta debe ser noindex`);
  } else {
    assert(Boolean(description), `${route.path}: falta meta description`);
    assert(ogUrl === route.canonical, `${route.path}: og:url no coincide con canonical (${ogUrl})`);
    assert(!robots.includes("noindex"), `${route.path}: ruta pública marcada noindex`);
  }

  if (route.ogImage) {
    assert(ogImage === route.ogImage, `${route.path}: og:image inesperada (${ogImage})`);
    assert(twitterImage === route.ogImage, `${route.path}: twitter:image inesperada (${twitterImage})`);
    assert(ogImageAlt?.includes("Ruka One"), `${route.path}: og:image:alt no identifica Ruka One`);
    assert(twitterImageAlt?.includes("Ruka One"), `${route.path}: twitter:image:alt no identifica Ruka One`);
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
assert(homeHtml.includes('href="/one"'), "/: falta enlace HTML crawleable hacia /one");
assert(homeHtml.includes("Ver Ruka One"), "/: falta copy contextual del enlace hacia Ruka One");
assert(
  homeHtml.includes("Con Ruka One partimos desde un proceso propio de tu empresa y trabajamos contigo para llevarlo a operar sobre tus sistemas y reglas."),
  "/: falta el posicionamiento contextual actualizado de Ruka One",
);

const oneHtml = await readFile(routeFile("/one"), "utf8");
const oneVisibleText = textContent(oneHtml);
assert(!oneHtml.includes("Ruka Works"), "/one: todavía contiene la marca pública Ruka Works");
assert(!oneHtml.includes(`${siteOrigin}/works`), "/one: todavía referencia la URL legacy /works");
assert(/<html\b[^>]*lang="es-CL"/i.test(oneHtml), "/one: html lang debe ser es-CL");
assert(getTagAttribute(oneHtml, "property", "og:title", "content") === "Automatización de procesos empresariales | Ruka One", "/one: og:title inesperado");
assert(getTagAttribute(oneHtml, "property", "og:description", "content") === oneDescription, "/one: og:description inesperada");
assert(getTagAttribute(oneHtml, "property", "og:locale", "content") === "es_CL", "/one: og:locale debe ser es_CL");
assert(getTagAttribute(oneHtml, "property", "og:site_name", "content") === "Ruka.ai", "/one: og:site_name debe ser Ruka.ai");
assert(getTagAttribute(oneHtml, "name", "googlebot", "content")?.includes("max-image-preview:large"), "/one: falta directiva Googlebot de preview grande");
for (const requiredText of [
  "Hay procesos que no viven en ningún sistema. Viven en tu equipo.",
  "Ruka parte de procesos que ya estandarizamos. Ruka One parte del tuyo.",
  "Ruka One usa la misma base tecnológica que hoy procesa millones de registros operativos para cientos de empresas.",
  "¿Qué es Ruka One?",
  "¿Cuál es la diferencia entre Ruka y Ruka One?",
  "¿Qué tipo de procesos trabajamos con Ruka One?",
]) {
  assert(oneVisibleText.includes(requiredText), `/one: falta contenido esencial prerenderizado (${requiredText})`);
}
for (const forbiddenText of [
  "Vemos contigo si Ruka puede ayudar.",
  "vemos si Ruka puede ayudar",
  "si tiene sentido que Ruka",
  "Ruka los convierte",
  "Ruka One convierte",
]) {
  assert(!oneVisibleText.includes(forbiddenText), `/one: conserva copy de posicionamiento débil (${forbiddenText})`);
}
assert(
  getTagAttribute(oneHtml, "name", "description", "content") ===
    oneDescription,
  "/one: meta description inesperada",
);
const oneSchemaValues = parseSchema(oneHtml, "/one").values.flatMap((schema) => schema["@graph"] ?? [schema]);
const oneService = oneSchemaValues.find((schema) => schema?.["@type"] === "Service");
assert(
  oneService?.serviceType === "Automatización de procesos empresariales",
  "/one: serviceType no representa automatización de procesos empresariales",
);
assert(oneService?.name === "Ruka One", "/one: Service schema no usa el nombre Ruka One");
assert(oneService?.url === `${siteOrigin}/one`, "/one: Service schema tiene URL incorrecta");
assert(oneService?.description === oneServiceDescription, "/one: Service schema no explica correctamente el enfoque de Ruka One");
assert(oneService?.provider?.["@id"] === `${siteOrigin}/#organization`, "/one: Service schema no referencia a Ruka.ai como provider");
assert(oneService?.areaServed?.identifier === "CL", "/one: Service schema no declara Chile/CL");

const oneFaqSchema = oneSchemaValues.find((schema) => schema?.["@type"] === "FAQPage");
assert(oneFaqSchema?.mainEntity?.length === 7, `/one: FAQPage debe contener 7 preguntas y contiene ${oneFaqSchema?.mainEntity?.length ?? 0}`);
for (const question of oneFaqSchema?.mainEntity ?? []) {
  assert(oneVisibleText.includes(question.name), `/one: pregunta FAQ ausente del HTML visible: ${question.name}`);
  assert(oneVisibleText.includes(question.acceptedAnswer?.text), `/one: respuesta FAQ ausente del HTML visible: ${question.name}`);
}

const oneBreadcrumb = oneSchemaValues.find((schema) => schema?.["@type"] === "BreadcrumbList");
assert(oneBreadcrumb?.itemListElement?.length === 2, "/one: BreadcrumbList debe tener Ruka y Ruka One");
assert(oneBreadcrumb?.itemListElement?.[0]?.item === `${siteOrigin}/`, "/one: primer breadcrumb debe apuntar al home");
assert(oneBreadcrumb?.itemListElement?.[1]?.name === "Ruka One", "/one: segundo breadcrumb debe llamarse Ruka One");
assert(oneBreadcrumb?.itemListElement?.[1]?.item === `${siteOrigin}/one`, "/one: segundo breadcrumb debe apuntar a /one");

const oneContactHtml = await readFile(routeFile("/one/contacto"), "utf8");
const oneContactVisibleText = textContent(oneContactHtml);
assert(
  oneContactVisibleText.includes("Elige una hora y cuéntanos cómo funciona hoy. Vemos contigo cómo llevar ese proceso a operar sobre Ruka."),
  "/one/contacto: falta el posicionamiento final del formulario",
);
for (const forbiddenText of ["si Ruka puede ayudar", "si podemos ayudarte", "si tiene sentido", "evaluamos si"]) {
  assert(!oneContactVisibleText.toLowerCase().includes(forbiddenText.toLowerCase()), `/one/contacto: conserva lenguaje condicional débil (${forbiddenText})`);
}

const oneContentSource = await readFile(path.join(projectRoot, "src", "content", "oneContent.ts"), "utf8");
for (const requiredText of [
  "Nos cuentas cómo funciona hoy y vemos juntos cómo llevarlo a operar sobre Ruka.",
  "Partimos por tu proceso tal como funciona hoy.",
]) {
  assert(oneContentSource.includes(requiredText), `oneContent.ts: falta copy final del funnel (${requiredText})`);
}

const oneOgSvg = await readFile(path.join(projectRoot, "public", "ruka-one-og.svg"), "utf8");
assert(oneOgSvg.includes("RUKA ONE"), "ruka-one-og.svg: falta branding RUKA ONE");
assert(!oneOgSvg.includes("RUKA WORKS"), "ruka-one-og.svg: todavía contiene RUKA WORKS");
assert(oneOgSvg.includes("Partimos de tu proceso y trabajamos contigo"), "ruka-one-og.svg: conserva el posicionamiento anterior");
const oneOgPng = await readFile(path.join(projectRoot, "public", "ruka-one-og.png"));
assert(oneOgPng.subarray(1, 4).toString("ascii") === "PNG", "ruka-one-og.png: no es un PNG válido");
assert(oneOgPng.readUInt32BE(16) === 1200, `ruka-one-og.png: ancho inesperado (${oneOgPng.readUInt32BE(16)})`);
assert(oneOgPng.readUInt32BE(20) === 630, `ruka-one-og.png: alto inesperado (${oneOgPng.readUInt32BE(20)})`);

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
assert(sitemap.includes(`<loc>${siteOrigin}/one</loc>`), "sitemap.xml: falta la URL canónica de Ruka One");
assert(!sitemap.includes(`${siteOrigin}/works`), "sitemap.xml: todavía contiene la ruta legacy /works");
assert(!sitemap.includes(`${siteOrigin}/one/contacto`), "sitemap.xml: incluye el funnel noindex /one/contacto");
assert(sitemap.includes("<lastmod>2026-08-20</lastmod>"), "sitemap.xml: /one no tiene lastmod de esta iteración");

const llms = await readFile(path.join(projectRoot, "dist", "llms.txt"), "utf8");
assert(llms.startsWith("# Ruka.ai"), "llms.txt: encabezado canónico ausente");
assert(llms.includes("## Páginas principales"), "llms.txt: falta guía de páginas principales");
assert(llms.includes("## Citas y atribución"), "llms.txt: falta guía de citas y atribución");
assert(llms.includes(`[Ruka One](${siteOrigin}/one)`), "llms.txt: falta entrada canónica de Ruka One");
assert(llms.includes("la forma de trabajar con Ruka cuando el punto de partida es un proceso específico de una empresa"), "llms.txt: la entrada de Ruka One no explica su punto de partida");
assert(!llms.includes("Ruka Works"), "llms.txt: todavía contiene la marca Ruka Works");
assert(!llms.toLowerCase().includes("high-ticket"), "llms.txt: contiene lenguaje interno high-ticket");

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
assert(
  (vercel.redirects ?? []).some(
    (redirect) => redirect.source === "/works" && redirect.destination === "/one" && redirect.permanent === true,
  ),
  "vercel.json: falta redirect permanente /works → /one",
);
assert(
  (vercel.redirects ?? []).some(
    (redirect) => redirect.source === "/works/:path*" && redirect.destination === "/one/:path*" && redirect.permanent === true,
  ),
  "vercel.json: falta redirect permanente de rutas descendientes /works/* → /one/*",
);
assert(
  !(vercel.rewrites ?? []).some((rewrite) => rewrite.source.startsWith("/works")),
  "vercel.json: las rutas legacy /works no deben servirse como páginas 200",
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
assert(
  headerValue("/one/contacto", "X-Robots-Tag") === "noindex, follow",
  "vercel.json: /one/contacto debe enviar X-Robots-Tag noindex, follow",
);

const appSource = await readFile(path.join(projectRoot, "src", "App.tsx"), "utf8");
assert(appSource.includes('path="/works/*"'), "App.tsx: falta compatibilidad client-side para /works/*");
assert(appSource.includes("search: location.search"), "App.tsx: redirect legacy no preserva query string");
assert(appSource.includes("hash: location.hash"), "App.tsx: redirect legacy no preserva hash");

if (failures.length) {
  console.error(`SEO/AEO validation failed: ${failures.length} of ${assertions} assertions failed.`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`SEO/AEO validation passed: ${assertions} assertions across ${routes.length + noIndexRoutes.length} prerendered routes.`);
console.log("Verified: route-specific HTML, metadata, H1s, JSON-LD, FAQ visibility, robots, sitemap, llms.txt and static 404.");
