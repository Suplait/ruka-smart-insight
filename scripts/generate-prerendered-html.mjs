import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { preservePublicEmails } from "./public-email-html.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pageModified = JSON.parse(await readFile(path.join(projectRoot, "src/content/pageModified.json"), "utf8"));
const distIndexPath = path.join(projectRoot, "dist", "index.html");
const ssrDirectory = path.join(projectRoot, ".prerender-ssr");
const ssrEntryPath = path.join(ssrDirectory, "entry-prerender-ssr.js");
const baseHtml = await readFile(distIndexPath, "utf8");
// React's development Suspense diagnostics contain local filesystem paths.
// Load the server renderer in production mode before importing the SSR bundle.
process.env.NODE_ENV = "production";
const {
  prerenderPaths,
  renderPrerenderedPage,
  blogSitemapEntries = [],
  blogLlmsEntries = [],
  discoveryEntries = [],
} = await import(`${ssrEntryPath}?build=${Date.now()}`);

const removeDefaultSeo = (html) =>
  html.replace(/\s*<!-- SEO:START -->[\s\S]*?<!-- SEO:END -->\s*/, "\n");

const renderDocument = (pathName) => {
  const rendered = renderPrerenderedPage(pathName);
  const languageAttributes = rendered.htmlAttributes || 'lang="es-CL"';
  const app = `<!-- APP:START --><div id="root">${rendered.html}</div><!-- APP:END -->`;
  const head = `\n    <!-- PRERENDER:HEAD:START -->\n    ${rendered.head}\n    <!-- PRERENDER:HEAD:END -->\n`;

  return removeDefaultSeo(baseHtml)
    .replace(/<html\b[^>]*>/, `<html ${languageAttributes}>`)
    .replace(/<!-- APP:START -->[\s\S]*?<!-- APP:END -->/, app)
    .replace("</head>", `${head}  </head>`);
};

for (const pathName of prerenderPaths) {
  const html = preservePublicEmails(renderDocument(pathName), pathName);
  if (pathName === "/") {
    await writeFile(distIndexPath, html, "utf8");
    continue;
  }

  const routeDirectory = path.join(projectRoot, "dist", pathName.slice(1));
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(path.join(routeDirectory, "index.html"), html, "utf8");
}

const escapeXml = (value) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

const sitemapPath = path.join(projectRoot, "dist", "sitemap.xml");
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.entries({ ...Object.fromEntries(discoveryEntries.map(entry => [entry.path, entry.lastmod])), ...pageModified }).map(([routePath, lastmod]) => {
  if (!prerenderPaths.includes(routePath)) throw new Error(`Unrendered sitemap route: ${routePath}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastmod)) throw new Error(`Invalid lastmod: ${routePath}`);
  return `  <url>\n    <loc>https://www.ruka.ai${escapeXml(routePath)}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}).join("\n")}
</urlset>`;
sitemap = sitemap.replace(/\s*<!-- BLOG:START -->[\s\S]*?<!-- BLOG:END -->\s*/, "\n");
const sitemapBlog = blogSitemapEntries
  .map(({ path: routePath, lastmod }) => [
    "  <url>",
    `    <loc>https://www.ruka.ai${escapeXml(routePath)}</loc>`,
    `    <lastmod>${escapeXml(lastmod)}</lastmod>`,
    "  </url>",
  ].join("\n"))
  .join("\n");
sitemap = sitemap.replace(
  "</urlset>",
  `  <!-- BLOG:START -->\n${sitemapBlog}\n  <!-- BLOG:END -->\n</urlset>`,
);
await writeFile(sitemapPath, sitemap, "utf8");

const llmsPath = path.join(projectRoot, "dist", "llms.txt");
let llms = await readFile(llmsPath, "utf8");
const llmsBlog = [
  "## Guías del blog",
  "",
  "- [Blog de Ruka](https://www.ruka.ai/blog): guías prácticas para automatizar trabajo operativo sobre los sistemas existentes.",
  ...blogLlmsEntries.map(({ title, path: routePath, description }) =>
    `- [${title}](https://www.ruka.ai${routePath}): ${description}`),
].join("\n");
llms = llms.replace(
  /<!-- BLOG:START -->[\s\S]*?<!-- BLOG:END -->/,
  `<!-- BLOG:START -->\n${llmsBlog}\n<!-- BLOG:END -->`,
);
await writeFile(llmsPath, `${llms}\n\n## Conexiones y ejemplos prácticos\n\n${discoveryEntries.map((entry) => `- [${entry.title}](https://www.ruka.ai${entry.path}): ${entry.description}`).join("\n")}\n`, "utf8");

await rm(ssrDirectory, { recursive: true, force: true });
console.log(`Generated route-specific server HTML for ${prerenderPaths.length} routes.`);
