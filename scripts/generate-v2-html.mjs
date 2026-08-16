import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distIndexPath = path.join(projectRoot, "dist", "index.html");
const seoPath = path.join(projectRoot, "src", "content", "landingV2Seo.json");
const ssrDirectory = path.join(projectRoot, ".seo-ssr");
const ssrEntryPath = path.join(ssrDirectory, "entry-v2-ssr.js");

const [baseHtml, seoSource] = await Promise.all([
  readFile(distIndexPath, "utf8"),
  readFile(seoPath, "utf8"),
]);

const seo = JSON.parse(seoSource);
const { renderLandingV2 } = await import(`${ssrEntryPath}?build=${Date.now()}`);
const prerenderedApp = renderLandingV2();
const escapeAttribute = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${seo.canonicalUrl}#organization`,
      name: "Ruka.ai",
      url: seo.canonicalUrl,
      logo: { "@type": "ImageObject", url: "https://www.ruka.ai/logo.png" },
      sameAs: [
        "https://www.linkedin.com/company/rukaai/",
        "https://www.instagram.com/ruka__ai/",
        "https://x.com/ruka__ai",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${seo.canonicalUrl}#website`,
      url: seo.canonicalUrl,
      name: seo.siteName,
      inLanguage: "es-CL",
      publisher: { "@id": `${seo.canonicalUrl}#organization` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${seo.canonicalUrl}#software`,
      name: "Ruka",
      url: seo.canonicalUrl,
      description: seo.description,
      image: seo.imageUrl,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      inLanguage: "es-CL",
      publisher: { "@id": `${seo.canonicalUrl}#organization` },
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "CLP",
        lowPrice: "99990",
        highPrice: "449990",
        offerCount: "3",
      },
      featureList: [
        "Registro automático de compras",
        "Conciliaciones",
        "Actualización de costos e inventario",
        "Integración con sistemas empresariales",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${seo.canonicalUrl}#faq`,
      mainEntity: seo.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    },
  ],
};

const metadata = `
    <!-- Landing V2 SEO: generated at build time -->
    <title>${escapeAttribute(seo.title)}</title>
    <meta data-react-helmet="true" name="description" content="${escapeAttribute(seo.description)}" />
    <meta data-react-helmet="true" name="robots" content="${escapeAttribute(seo.robots)}" />
    <meta data-react-helmet="true" name="googlebot" content="${escapeAttribute(seo.robots)}" />
    <link data-react-helmet="true" rel="canonical" href="${escapeAttribute(seo.canonicalUrl)}" />

    <meta data-react-helmet="true" property="og:type" content="website" />
    <meta data-react-helmet="true" property="og:site_name" content="${escapeAttribute(seo.siteName)}" />
    <meta data-react-helmet="true" property="og:locale" content="${escapeAttribute(seo.locale)}" />
    <meta data-react-helmet="true" property="og:url" content="${escapeAttribute(seo.canonicalUrl)}" />
    <meta data-react-helmet="true" property="og:title" content="${escapeAttribute(seo.title)}" />
    <meta data-react-helmet="true" property="og:description" content="${escapeAttribute(seo.description)}" />
    <meta data-react-helmet="true" property="og:image" content="${escapeAttribute(seo.imageUrl)}" />
    <meta data-react-helmet="true" property="og:image:secure_url" content="${escapeAttribute(seo.imageUrl)}" />
    <meta data-react-helmet="true" property="og:image:type" content="image/png" />
    <meta data-react-helmet="true" property="og:image:width" content="1200" />
    <meta data-react-helmet="true" property="og:image:height" content="630" />
    <meta data-react-helmet="true" property="og:image:alt" content="${escapeAttribute(seo.imageAlt)}" />

    <meta data-react-helmet="true" name="twitter:card" content="summary_large_image" />
    <meta data-react-helmet="true" name="twitter:title" content="${escapeAttribute(seo.title)}" />
    <meta data-react-helmet="true" name="twitter:description" content="${escapeAttribute(seo.description)}" />
    <meta data-react-helmet="true" name="twitter:image" content="${escapeAttribute(seo.imageUrl)}" />
    <meta data-react-helmet="true" name="twitter:image:alt" content="${escapeAttribute(seo.imageAlt)}" />
    <script data-react-helmet="true" type="application/ld+json">${JSON.stringify(structuredData).replaceAll("<", "\\u003c")}</script>
`;

const withoutDefaultSeo = baseHtml.replace(
  /\s*<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->\s*/,
  "\n",
);
const v2Html = withoutDefaultSeo
  .replace('<html lang="es">', '<html lang="es-CL">')
  .replace('<div id="root"></div>', `<div id="root">${prerenderedApp}</div>`)
  .replace("</head>", `${metadata}  </head>`);

await writeFile(distIndexPath, v2Html, "utf8");
await rm(ssrDirectory, { recursive: true, force: true });

console.log("Generated dist/index.html with the prerendered Landing V2 home and crawler metadata.");
