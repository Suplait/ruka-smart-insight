import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distIndexPath = path.join(projectRoot, "dist", "index.html");
const seoPath = path.join(projectRoot, "src", "content", "acquisitionSeo.json");
const faqPath = path.join(projectRoot, "src", "content", "acquisitionFaq.json");
const ssrDirectory = path.join(projectRoot, ".acquisition-ssr");
const ssrEntryPath = path.join(ssrDirectory, "entry-acquisition-ssr.js");

const [homeHtml, seoSource, faqSource] = await Promise.all([
  readFile(distIndexPath, "utf8"),
  readFile(seoPath, "utf8"),
  readFile(faqPath, "utf8"),
]);

const seoByRoute = JSON.parse(seoSource);
const acquisitionFaq = JSON.parse(faqSource);
const { renderAcquisitionPage } = await import(`${ssrEntryPath}?build=${Date.now()}`);

const escapeAttribute = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const removeHomeMetadata = (html) =>
  html
    .replace(/\s*<!-- Landing V2 SEO: generated at build time -->\s*/, "\n")
    .replace(/\s*<title>[^<]*<\/title>\s*/, "\n")
    .replace(
      /\s*<(?:meta|link)\b[^>]*data-react-helmet="true"[^>]*\/?>(?:\s*)/g,
      "\n",
    )
    .replace(
      /\s*<script\b[^>]*data-react-helmet="true"[^>]*>[\s\S]*?<\/script>\s*/g,
      "\n",
    );

const createStructuredData = (seo) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.ruka.ai/#organization",
      name: "Ruka.ai",
      url: "https://www.ruka.ai/",
      logo: { "@type": "ImageObject", url: "https://www.ruka.ai/logo.png" },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.ruka.ai/#website",
      url: "https://www.ruka.ai/",
      name: "Ruka.ai",
      inLanguage: "es-CL",
      publisher: { "@id": "https://www.ruka.ai/#organization" },
    },
    {
      "@type": "WebPage",
      "@id": `${seo.canonicalUrl}#webpage`,
      url: seo.canonicalUrl,
      name: seo.pageName,
      description: seo.description,
      inLanguage: "es-CL",
      isPartOf: { "@id": "https://www.ruka.ai/#website" },
      about: { "@id": "https://www.ruka.ai/#software" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://www.ruka.ai/#software",
      name: "Ruka",
      url: "https://www.ruka.ai/",
      description: "Agentes IA que ejecutan trabajo operativo sobre los sistemas que ya usa una empresa.",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "es-CL",
      publisher: { "@id": "https://www.ruka.ai/#organization" },
      featureList: seo.features,
    },
    {
      "@type": "FAQPage",
      "@id": `${seo.canonicalUrl}#faq`,
      mainEntity: acquisitionFaq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
});

const createMetadata = (seo) => {
  const imageUrl = "https://www.ruka.ai/ruka-agentes-ia-og.png";
  return `
    <!-- Acquisition SEO: generated at build time -->
    <title>${escapeAttribute(seo.title)}</title>
    <meta data-react-helmet="true" name="title" content="${escapeAttribute(seo.title)}" />
    <meta data-react-helmet="true" name="description" content="${escapeAttribute(seo.description)}" />
    <meta data-react-helmet="true" name="robots" content="index, follow, max-image-preview:large" />
    <link data-react-helmet="true" rel="canonical" href="${escapeAttribute(seo.canonicalUrl)}" />

    <meta data-react-helmet="true" property="og:type" content="website" />
    <meta data-react-helmet="true" property="og:site_name" content="Ruka.ai" />
    <meta data-react-helmet="true" property="og:locale" content="es_CL" />
    <meta data-react-helmet="true" property="og:url" content="${escapeAttribute(seo.canonicalUrl)}" />
    <meta data-react-helmet="true" property="og:title" content="${escapeAttribute(seo.title)}" />
    <meta data-react-helmet="true" property="og:description" content="${escapeAttribute(seo.description)}" />
    <meta data-react-helmet="true" property="og:image" content="${imageUrl}" />
    <meta data-react-helmet="true" property="og:image:secure_url" content="${imageUrl}" />
    <meta data-react-helmet="true" property="og:image:type" content="image/png" />
    <meta data-react-helmet="true" property="og:image:width" content="1200" />
    <meta data-react-helmet="true" property="og:image:height" content="630" />
    <meta data-react-helmet="true" property="og:image:alt" content="Ruka, agentes IA para trabajo operativo" />

    <meta data-react-helmet="true" name="twitter:card" content="summary_large_image" />
    <meta data-react-helmet="true" name="twitter:title" content="${escapeAttribute(seo.title)}" />
    <meta data-react-helmet="true" name="twitter:description" content="${escapeAttribute(seo.description)}" />
    <meta data-react-helmet="true" name="twitter:image" content="${imageUrl}" />
    <meta data-react-helmet="true" name="twitter:image:alt" content="Ruka, agentes IA para trabajo operativo" />
    <script data-react-helmet="true" type="application/ld+json">${JSON.stringify(createStructuredData(seo)).replaceAll("<", "\\u003c")}</script>
  `;
};

const htmlWithoutHomeMetadata = removeHomeMetadata(homeHtml);

for (const [route, seo] of Object.entries(seoByRoute)) {
  const pathname = `/${route}`;
  const prerenderedApp = renderAcquisitionPage(pathname);
  const routeHtml = htmlWithoutHomeMetadata
    .replace(
      /<div id="root">[\s\S]*?<\/div>\s*<script src="https:\/\/cdn\.gpteng\.co\/gptengineer\.js"/,
      `<div id="root">${prerenderedApp}</div>\n    <script src="https://cdn.gpteng.co/gptengineer.js"`,
    )
    .replace("</head>", `${createMetadata(seo)}  </head>`);

  const routeDirectory = path.join(projectRoot, "dist", route);
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(path.join(routeDirectory, "index.html"), routeHtml, "utf8");
}

await rm(ssrDirectory, { recursive: true, force: true });
console.log("Generated route-specific HTML for acquisition pages.");
