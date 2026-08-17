import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distIndexPath = path.join(projectRoot, "dist", "index.html");
const ssrDirectory = path.join(projectRoot, ".prerender-ssr");
const ssrEntryPath = path.join(ssrDirectory, "entry-prerender-ssr.js");
const baseHtml = await readFile(distIndexPath, "utf8");
const { prerenderPaths, renderPrerenderedPage } = await import(`${ssrEntryPath}?build=${Date.now()}`);

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

await rm(ssrDirectory, { recursive: true, force: true });
console.log(`Generated route-specific server HTML for ${prerenderPaths.length} routes.`);
