import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distIndexPath = path.join(projectRoot, "dist", "index.html");
const ssrDirectory = path.join(projectRoot, ".prerender-ssr");
const ssrEntryPath = path.join(ssrDirectory, "entry-prerender-ssr.js");
const baseHtml = await readFile(distIndexPath, "utf8");
const {
  prerenderPaths,
  renderPrerenderedPage,
  blogSitemapEntries = [],
  blogLlmsEntries = [],
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
  const html = renderDocument(pathName);
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
let sitemap = await readFile(sitemapPath, "utf8");
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
await writeFile(llmsPath, llms, "utf8");

await rm(ssrDirectory, { recursive: true, force: true });
console.log(`Generated route-specific server HTML for ${prerenderPaths.length} routes.`);
