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
    schema: ["Organization", "WebSite", "SoftwareApplication", "FAQPage", "WebPage", "BreadcrumbList"],
  },
  {
    path: "/about",
    title: "Quiénes somos | Ruka.ai",
    canonical: `${siteOrigin}/about`,
    h1: "No empezamos con Ruka.",
    schema: ["Organization", "WebSite", "AboutPage", "Person", "BreadcrumbList"],
  },
  {
    path: "/register",
    title: "Agentes IA para automatizar trabajo operativo | Ruka",
    canonical: `${siteOrigin}/register`,
    h1: "Cuéntanos qué trabajo manual quieres dejar de hacer.",
    schema: ["Organization", "WebSite", "WebPage", "SoftwareApplication", "FAQPage", "BreadcrumbList"],
  },
  {
    path: "/restaurantes",
    title: "Agentes IA para operaciones de restaurantes | Ruka",
    canonical: `${siteOrigin}/restaurantes`,
    h1: "El trabajo administrativo entre tu SII, POS y planillas, hecho por Ruka.",
    schema: ["Organization", "WebSite", "WebPage", "SoftwareApplication", "FAQPage", "BreadcrumbList"],
  },
  {
    path: "/hoteles",
    title: "Agentes IA para automatizar procesos en hoteles | Ruka",
    canonical: `${siteOrigin}/hoteles`,
    h1: "Menos trabajo manual entre compras, contabilidad y operación.",
    schema: ["Organization", "WebSite", "WebPage", "SoftwareApplication", "FAQPage", "BreadcrumbList"],
  },
  {
    path: "/retail",
    title: "Agentes IA para compras y operaciones retail | Ruka",
    canonical: `${siteOrigin}/retail`,
    h1: "Tus compras no deberían terminar en otra planilla.",
    schema: ["Organization", "WebSite", "WebPage", "SoftwareApplication", "FAQPage", "BreadcrumbList"],
  },
  {
    path: "/productos/panel-control",
    title: "Panel de control de costos y margen | Ruka",
    canonical: `${siteOrigin}/productos/panel-control`,
    h1: "El margen cambia. Tu visión también debería.",
    schema: ["Organization", "WebSite", "Service", "WebPage", "BreadcrumbList", "FAQPage"],
  },
  {
    path: "/productos/cuentas-por-pagar",
    title: "Automatiza cuentas por pagar y pagos a proveedores | Ruka",
    canonical: `${siteOrigin}/productos/cuentas-por-pagar`,
    h1: "Tus cuentas por pagar, listas para ejecutar.",
    schema: ["Organization", "WebSite", "Service", "WebPage", "BreadcrumbList", "FAQPage"],
  },
  {
    path: "/productos/registro-de-compras",
    title: "Automatiza el registro de compras | Ruka",
    canonical: `${siteOrigin}/productos/registro-de-compras`,
    h1: "Las compras llegan. Ruka hace el registro.",
    schema: ["Organization", "WebSite", "Service", "WebPage", "BreadcrumbList", "FAQPage"],
  },
  {
    path: "/productos/conciliacion-automatica",
    title: "Conciliación automática de facturas, órdenes y pagos | Ruka",
    canonical: `${siteOrigin}/productos/conciliacion-automatica`,
    h1: "Ruka concilia el volumen. Tu equipo decide las diferencias.",
    schema: ["Organization", "WebSite", "Service", "WebPage", "BreadcrumbList", "FAQPage"],
  },
  {
    path: "/productos/stock",
    title: "Gestión de stock e inventario conectada | Ruka",
    canonical: `${siteOrigin}/productos/stock`,
    h1: "El stock se actualiza mientras la operación ocurre.",
    schema: ["Organization", "WebSite", "Service", "WebPage", "BreadcrumbList", "FAQPage"],
  },
  {
    path: "/integraciones",
    title: "Integraciones de Ruka | ERP, POS, SII y más",
    canonical: `${siteOrigin}/integraciones`,
    h1: "Trabajamos donde ya vive tu operación.",
    schema: ["Organization", "WebSite", "WebPage", "BreadcrumbList", "FAQPage", "ItemList"],
  },
  {
    path: "/privacy",
    title: "Política de Privacidad | Ruka.ai",
    canonical: `${siteOrigin}/privacy`,
    h1: "Política de Privacidad",
    schema: ["Organization", "WebSite", "WebPage", "BreadcrumbList"],
  },
  {
    path: "/terms",
    title: "Términos y Condiciones | Ruka.ai",
    canonical: `${siteOrigin}/terms`,
    h1: "Términos y Condiciones",
    schema: ["Organization", "WebSite", "WebPage", "BreadcrumbList"],
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

function getTagAttributes(html, selectorAttribute, selectorValue) {
  const tags = html.match(/<(?:meta|link)\b[^>]*>/gi) ?? [];
  return tags.flatMap((tag) => {
    const attributes = Object.fromEntries(
      [...tag.matchAll(/([:\w-]+)=(?:"([^"]*)"|'([^']*)')/g)].map((match) => [
        match[1].toLowerCase(),
        match[2] ?? match[3] ?? "",
      ]),
    );
    return attributes[selectorAttribute] === selectorValue ? [attributes] : [];
  });
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
  const titleCount = (html.match(/<title\b[^>]*>/gi) ?? []).length;
  const descriptionTags = getTagAttributes(html, "name", "description");
  const canonicalTags = getTagAttributes(html, "rel", "canonical");
  const ogImageWidth = getTagAttribute(html, "property", "og:image:width", "content");
  const ogImageHeight = getTagAttribute(html, "property", "og:image:height", "content");
  const googlebot = getTagAttribute(html, "name", "googlebot", "content") ?? "";

  assert(title === route.title, `${route.path}: title inesperado (${title})`);
  assert(titleCount === 1, `${route.path}: esperaba exactamente un title y encontré ${titleCount}`);
  assert(canonicalTags.length === 1, `${route.path}: esperaba exactamente un canonical y encontré ${canonicalTags.length}`);
  assert(canonical === route.canonical, `${route.path}: canonical inesperado (${canonical})`);
  assert(h1Matches.length === 1, `${route.path}: esperaba exactamente un H1 y encontré ${h1Matches.length}`);
  assert(h1[0] === route.h1, `${route.path}: H1 inesperado (${h1[0]})`);
  assert(!html.includes('name="keywords"'), `${route.path}: todavía contiene meta keywords`);
  assert(!html.includes('"aggregateRating"'), `${route.path}: contiene aggregateRating no verificable`);
  assert(!/<div id="root"><\/div>/.test(html), `${route.path}: root SSR está vacío`);

  if (noIndex) {
    assert(robots.includes("noindex"), `${route.path}: la ruta debe ser noindex`);
  } else {
    assert(descriptionTags.length === 1, `${route.path}: esperaba exactamente una description y encontré ${descriptionTags.length}`);
    assert(Boolean(description), `${route.path}: falta meta description`);
    assert(title.length >= 20 && title.length <= 65, `${route.path}: title fuera del rango útil de 20-65 caracteres (${title.length})`);
    assert(description.length >= 90 && description.length <= 170, `${route.path}: description fuera del rango útil de 90-170 caracteres (${description.length})`);
    assert(ogUrl === route.canonical, `${route.path}: og:url no coincide con canonical (${ogUrl})`);
    assert(robots.includes("max-image-preview:large"), `${route.path}: robots no habilita previews grandes`);
    assert(googlebot.includes("max-image-preview:large"), `${route.path}: googlebot no habilita previews grandes`);
    assert(Boolean(ogImage), `${route.path}: falta og:image`);
    assert(twitterImage === ogImage, `${route.path}: twitter:image no coincide con og:image`);
    assert(Boolean(ogImageAlt), `${route.path}: falta og:image:alt`);
    assert(Boolean(twitterImageAlt), `${route.path}: falta twitter:image:alt`);
    assert(ogImageWidth === "1200", `${route.path}: og:image:width debe ser 1200 (${ogImageWidth})`);
    assert(ogImageHeight === "630", `${route.path}: og:image:height debe ser 630 (${ogImageHeight})`);
    assert(!robots.includes("noindex"), `${route.path}: ruta pública marcada noindex`);

    if (ogImage?.startsWith(siteOrigin)) {
      const imagePath = path.join(projectRoot, "dist", new URL(ogImage).pathname.slice(1));
      try {
        const image = await readFile(imagePath);
        assert(image.subarray(1, 4).toString("ascii") === "PNG", `${route.path}: og:image no es un PNG válido`);
        assert(image.readUInt32BE(16) === 1200, `${route.path}: ancho real de og:image no es 1200`);
        assert(image.readUInt32BE(20) === 630, `${route.path}: alto real de og:image no es 630`);
      } catch (error) {
        assert(false, `${route.path}: og:image no existe en el build (${error.message})`);
      }
    }
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

  if (!noIndex) {
    const graph = schema.values.flatMap((value) => value["@graph"] ?? [value]);
    const page = graph.find((value) => value?.["@type"] === "WebPage" || value?.["@type"] === "AboutPage");
    assert(Boolean(page?.primaryImageOfPage), `${route.path}: la página no enlaza primaryImageOfPage en schema`);
    assert(Boolean(page?.breadcrumb), `${route.path}: la página no enlaza BreadcrumbList en schema`);
  }

  if (route.schema?.includes("FAQPage")) {
    const visibleText = textContent(html);
    const graph = schema.values.flatMap((value) => value["@graph"] ?? [value]);
    const faqPage = graph
      .find((value) => value?.["@type"] === "FAQPage");
    const page = graph.find((value) => value?.["@type"] === "WebPage" || value?.["@type"] === "AboutPage");
    assert(Boolean(faqPage?.mainEntity?.length), `${route.path}: FAQPage no contiene preguntas`);
    assert(page?.hasPart?.["@id"] === faqPage?.["@id"], `${route.path}: WebPage no enlaza su FAQPage`);
    for (const question of faqPage?.mainEntity ?? []) {
      assert(visibleText.includes(question.name), `${route.path}: pregunta FAQ ausente del HTML inicial (${question.name})`);
      assert(visibleText.includes(question.acceptedAnswer?.text), `${route.path}: respuesta FAQ ausente del HTML inicial (${question.name})`);
    }
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
for (const href of [
  "/productos/registro-de-compras",
  "/productos/conciliacion-automatica",
  "/productos/cuentas-por-pagar",
  "/productos/panel-control",
  "/productos/stock",
  "/integraciones",
  "/#precios",
  "/register",
]) {
  assert(homeHtml.includes(`href="${href}"`), `/: falta enlace HTML crawleable hacia ${href}`);
}
assert(
  homeHtml.includes("Con Ruka One partimos desde un proceso propio de tu empresa y trabajamos contigo para llevarlo a operar sobre tus sistemas y reglas."),
  "/: falta el posicionamiento contextual actualizado de Ruka One",
);

for (const routePath of [
  "/productos/registro-de-compras",
  "/productos/conciliacion-automatica",
  "/productos/cuentas-por-pagar",
  "/productos/panel-control",
  "/productos/stock",
]) {
  const html = await readFile(routeFile(routePath), "utf8");
  const graph = parseSchema(html, routePath).values.flatMap((schema) => schema["@graph"] ?? [schema]);
  const service = graph.find((entity) => entity?.["@type"] === "Service");
  const webpage = graph.find((entity) => entity?.["@type"] === "WebPage");
  assert(service?.provider?.["@id"] === `${siteOrigin}/#organization`, `${routePath}: Service no referencia a Ruka como provider`);
  assert(service?.areaServed?.identifier === "CL", `${routePath}: Service no declara Chile como área de servicio`);
  assert(webpage?.mainEntity?.["@id"] === service?.["@id"], `${routePath}: WebPage no enlaza el Service como entidad principal`);
}

const integrationsHtml = await readFile(routeFile("/integraciones"), "utf8");
const integrationsGraph = parseSchema(integrationsHtml, "/integraciones").values.flatMap((schema) => schema["@graph"] ?? [schema]);
const integrationsList = integrationsGraph.find((entity) => entity?.["@type"] === "ItemList");
assert(integrationsList?.numberOfItems === 23, `/integraciones: ItemList declara ${integrationsList?.numberOfItems ?? 0} sistemas y fuentes, esperaba 23`);
assert(integrationsList?.itemListElement?.length === 23, "/integraciones: ItemList no contiene todo el catálogo visible");

const purchaseRegistrationHtml = await readFile(routeFile("/productos/registro-de-compras"), "utf8");
for (const requiredText of [
  "Producto en acción",
  "De factura recibida a pago protegido.",
  "Las compras llegan a una sola bandeja.",
  "Recepción pendiente",
  "Decisión de recepción",
  "Evidencia y cantidades",
  "Pago protegido",
]) {
  assert(
    purchaseRegistrationHtml.includes(requiredText),
    `/productos/registro-de-compras: falta contenido del recorrido de producto (${requiredText})`,
  );
}
for (const imagePath of [
  "/assets/registro-compras/facturas-en-bandeja.png",
  "/assets/registro-compras/factura-pendiente-recepcion.png",
  "/assets/registro-compras/seleccion-recepcion.png",
  "/assets/registro-compras/registro-diferencias.png",
  "/assets/registro-compras/bloqueo-pago.png",
]) {
  await access(path.join(projectRoot, "dist", imagePath.slice(1)));
}
assert(
  purchaseRegistrationHtml.includes('src="/assets/registro-compras/facturas-en-bandeja.png"'),
  "/productos/registro-de-compras: la primera captura debe estar en el HTML inicial",
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
for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "CCBot", "Applebot-Extended", "Amazonbot", "meta-externalagent"]) {
  assert(robots.includes(`User-agent: ${bot}`), `robots.txt: falta regla explícita para ${bot}`);
}
assert(robots.includes(`Sitemap: ${siteOrigin}/sitemap.xml`), "robots.txt: falta directiva Sitemap canónica");

const sitemap = await readFile(path.join(projectRoot, "dist", "sitemap.xml"), "utf8");
assert(sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), "sitemap.xml: cabecera XML inválida");
for (const route of routes) {
  assert(sitemap.includes(`<loc>${route.canonical}</loc>`), `sitemap.xml: falta ${route.canonical}`);
  assert(
    sitemap.includes(`<loc>${route.canonical}</loc>\n    <lastmod>2026-10-08</lastmod>`),
    `sitemap.xml: ${route.path} no refleja la fecha de esta iteración SEO`,
  );
}
for (const route of noIndexRoutes) {
  assert(!sitemap.includes(`<loc>${route.canonical}</loc>`), `sitemap.xml: incluye ruta noindex ${route.canonical}`);
}
assert(sitemap.includes(`<loc>${siteOrigin}/one</loc>`), "sitemap.xml: falta la URL canónica de Ruka One");
assert(!sitemap.includes(`${siteOrigin}/works`), "sitemap.xml: todavía contiene la ruta legacy /works");
assert(!sitemap.includes(`${siteOrigin}/one/contacto`), "sitemap.xml: incluye el funnel noindex /one/contacto");

const llms = await readFile(path.join(projectRoot, "dist", "llms.txt"), "utf8");
assert(llms.startsWith("# Ruka.ai"), "llms.txt: encabezado canónico ausente");
assert(llms.includes("## Páginas principales"), "llms.txt: falta guía de páginas principales");
assert(llms.includes("## Citas y atribución"), "llms.txt: falta guía de citas y atribución");
assert(llms.includes(`[Ruka One](${siteOrigin}/one)`), "llms.txt: falta entrada canónica de Ruka One");
for (const routePath of [
  "/productos/registro-de-compras",
  "/productos/conciliacion-automatica",
  "/#precios",
  "/integraciones",
]) {
  assert(llms.includes(`${siteOrigin}${routePath}`), `llms.txt: falta guía de ${routePath}`);
}
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
    (redirect) => redirect.source === "/precios" && redirect.destination === "/#precios" && redirect.permanent === true,
  ),
  "vercel.json: falta redirect permanente /precios → /#precios",
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
for (const routePath of [
  "/productos/registro-de-compras",
  "/productos/conciliacion-automatica",
  "/integraciones",
]) {
  assert(appSource.includes(`path="${routePath}"`), `App.tsx: falta ruta ${routePath}`);
}

if (failures.length) {
  console.error(`SEO/AEO validation failed: ${failures.length} of ${assertions} assertions failed.`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`SEO/AEO validation passed: ${assertions} assertions across ${routes.length + noIndexRoutes.length} prerendered routes.`);
console.log("Verified: route-specific HTML, unique metadata, social image integrity, H1s, linked JSON-LD entities, FAQ visibility, robots, sitemap, llms.txt and static 404.");
