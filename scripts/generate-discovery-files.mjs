import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";
import sharp from "sharp";

const origin = "https://www.ruka.ai";
const escapeXml = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const plain = value => value.replace(/\s+/g, " ").trim();
const escapeInline = value => value.replace(/[\\`*_[\]<>]/g, "\\$&");

/** Uses only public indexed server HTML: one authoring source, no shadow copy. */
export function htmlToMarkdown(html, canonical) {
  const document = new JSDOM(html).window.document;
  if (document.querySelector('meta[name="robots"]')?.content.includes("noindex")) throw new Error(`Refusing noindex content: ${canonical}`);
  const main = document.querySelector("main");
  if (!main) throw new Error(`Missing main landmark: ${canonical}`);
  main.querySelectorAll("script,style,svg,noscript,nav,button,input,select,textarea,[hidden],[aria-hidden='true']").forEach(node => node.remove());
  function convert(node) {
    if (node.nodeType === 3) return escapeInline(node.textContent || "");
    if (node.nodeType !== 1) return "";
    const tag = node.tagName.toLowerCase();
    const children = [...node.childNodes].map(convert).join("");
    if (/^h[1-6]$/.test(tag)) return `\n\n${"#".repeat(Number(tag[1]))} ${plain(children)}\n\n`;
    if (tag === "a") {
      const raw = node.getAttribute("href") || "";
      const url = new URL(raw, canonical);
      return ["https:", "http:"].includes(url.protocol) && plain(children) ? `[${plain(children)}](${url.href.replaceAll("(", "%28").replaceAll(")", "%29")})` : children;
    }
    if (tag === "img") {
      const src = node.getAttribute("src");
      if (!src) return "";
      const url = new URL(src, canonical);
      return ["https:", "http:"].includes(url.protocol) ? `\n\n![${escapeInline(node.getAttribute("alt") || "")}](<${url.href}>)\n\n` : "";
    }
    if (tag === "li") {
      const list = node.parentElement;
      const marker = list?.tagName === "OL"
        ? `${Number(list.getAttribute("start") || 1) + [...list.children].indexOf(node)}.`
        : "-";
      return `\n${marker} ${children.trim()}\n`;
    }
    if (tag === "summary") return `\n\n### ${plain(children)}\n\n`;
    // CSS gaps between badges/metadata disappear in text exports. Preserve
    // those semantic boundaries so dates, labels and values don't run together.
    if (["span", "time", "dt", "dd"].includes(tag)) return ` ${children.trim()} `;
    if (tag === "table") {
      const rows = [...node.rows].map(row => [...row.cells].map(cell => plain(convert(cell)).replaceAll("|", "\\|")));
      if (!rows.length) return "";
      // GFM requires a header separator. Keep headerless tables as readable
      // rows rather than inventing column names or promoting data to headers.
      const hasHeader = [...node.rows[0].cells].every(cell => cell.tagName === "TH");
      const caption = node.caption ? `${plain(convert(node.caption))}\n\n` : "";
      if (!hasHeader) return `\n\n${caption}${rows.map(row => row.join(" | ")).join("\n")}\n\n`;
      const width = Math.max(...rows.map(row => row.length));
      const render = row => `| ${Array.from({ length: width }, (_, i) => row[i] || "").join(" | ")} |`;
      return `\n\n${caption}${render(rows[0])}\n${render(Array(width).fill("---"))}\n${rows.slice(1).map(render).join("\n")}\n\n`;
    }
    if (tag === "tr") return `\n${[...node.children].map(child => plain(convert(child))).join(" | ")}\n`;
    if (["p", "div", "section", "article", "ul", "ol", "dl", "figure", "details", "header", "table"].includes(tag)) return `\n\n${children.trim()}\n\n`;
    if (tag === "br") return "\n";
    return children;
  }
  const title = document.querySelector("title")?.textContent || "Ruka";
  const body = convert(main).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return `<!-- Public source: ${canonical} -->\n<!-- Title: ${escapeInline(title)} -->\n\n${body}\n\nFuente original: ${canonical}\n`;
}

export function createRss(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Blog de Ruka</title><link>${origin}/blog</link><description>Guías prácticas para automatizar trabajo operativo.</description><language>es-CL</language><atom:link href="${origin}/rss.xml" rel="self" type="application/rss+xml"/>${[...posts].sort((a, b) => b.datePublished.localeCompare(a.datePublished)).map(post => `<item><title>${escapeXml(post.title)}</title><link>${origin}/blog/${post.slug}</link><guid isPermaLink="true">${origin}/blog/${post.slug}</guid><pubDate>${new Date(`${post.datePublished}T12:00:00Z`).toUTCString()}</pubDate><description>${escapeXml(post.excerpt)}</description></item>`).join("")}</channel></rss>\n`;
}

export async function wrapPreviewTitle(title, maxWidth = 520) {
  if (!title.trim()) throw new Error("Preview title needs editorial review: empty title");
  const words = title.trim().split(/\s+/);
  // Measure with the same renderer/font as the final image. Character counts
  // cannot predict whether wide letters or accents will cross the art panel.
  for (const size of [44, 38]) {
    const widths = new Map();
    async function measure(text) {
      if (!widths.has(text)) {
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="90"><text x="8" y="65" fill="black" font-family="Arial,sans-serif" font-size="${size}" font-weight="700">${escapeXml(text)}</text></svg>`;
        const { info } = await sharp(Buffer.from(svg)).trim().png().toBuffer({ resolveWithObject: true });
        widths.set(text, info.width);
      }
      return widths.get(text);
    }
    const lines = [];
    let line = "";
    let oversizedWord = false;
    for (const word of words) {
      if (await measure(word) > maxWidth) { oversizedWord = true; break; }
      const candidate = line ? `${line} ${word}` : word;
      if (await measure(candidate) > maxWidth) { lines.push(line); line = word; }
      else line = candidate;
    }
    if (line) lines.push(line);
    if (!oversizedWord && lines.length <= (size === 44 ? 5 : 7)) return { lines, size };
  }
  throw new Error(`Preview title needs editorial review: ${title}`);
}

export async function generateArticlePreview(post, root, dist) {
  // Reuse only this article's own verified illustration/screenshot, never another post's.
  const art = await sharp(path.join(root, "public", post.heroImage.src.slice(1))).resize(520, 430, { fit: "contain", background: "#ffffff" }).png().toBuffer();
  const logo = await sharp(path.join(root, "public/logo.png")).resize({ width: 190 }).png().toBuffer();
  const { lines, size } = await wrapPreviewTitle(post.title);
  const start = 242 - Math.max(0, lines.length - 4) * 15;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f7f8fc"/><rect x="632" y="0" width="568" height="630" fill="white"/><image x="54" y="48" width="190" height="48" href="data:image/png;base64,${logo.toString("base64")}"/><text x="54" y="155" fill="#424ec0" font-family="Arial,sans-serif" font-size="20" font-weight="600">${escapeXml(post.category)}</text>${lines.map((line, index) => `<text x="54" y="${start + index * (size + 9)}" fill="#171827" font-family="Arial,sans-serif" font-size="${size}" font-weight="700">${escapeXml(line)}</text>`).join("")}<text x="54" y="573" fill="#505b70" font-family="Arial,sans-serif" font-size="19">Guías de Ruka · www.ruka.ai/blog</text><image x="656" y="100" width="520" height="430" href="data:image/png;base64,${art.toString("base64")}"/></svg>`;
  await mkdir(path.join(dist, "blog/og"), { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(path.join(dist, "blog/og", `${post.slug}.png`));
}

export async function generateDiscoveryFiles(root = process.cwd()) {
  const dist = path.join(root, "dist");
  const sitemap = new JSDOM(await readFile(path.join(dist, "sitemap.xml"), "utf8"), { contentType: "application/xml" });
  const urls = [...sitemap.window.document.querySelectorAll("loc")].map(node => node.textContent);
  const documents = [];
  for (const canonical of urls) {
    const url = new URL(canonical);
    if (url.origin !== origin) throw new Error(`Unexpected sitemap host: ${canonical}`);
    const route = url.pathname === "/" ? "/index" : url.pathname;
    const html = await readFile(path.join(dist, url.pathname, "index.html"), "utf8");
    const markdown = htmlToMarkdown(html, canonical);
    const target = path.join(dist, "readable", `${route}.md`);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, markdown);
    documents.push({ path: `${route}.md`, canonical, markdown });
  }
  await writeFile(path.join(dist, "llms-full.txt"), `# Ruka · Contenido público\n\nVersiones de lectura del sitio. No documentan una API ni autorizan operaciones. Cada sección enlaza su fuente canónica.\n\n${documents.map(doc => doc.markdown).join("\n\n---\n\n")}`);
  const llmsPath = path.join(dist, "llms.txt");
  const llms = await readFile(llmsPath, "utf8");
  await writeFile(llmsPath, `${llms}\n\n## Versiones de lectura\n\n- [Contenido público completo](${origin}/llms-full.txt): texto derivado del HTML publicado, con enlaces a las fuentes.\n- [RSS del blog](${origin}/rss.xml): nuevos artículos por fecha de publicación.\n${documents.map(doc => `- [${new URL(doc.canonical).pathname}](${origin}${doc.path}): versión Markdown de ${doc.canonical}`).join("\n")}\n`);
  const folder = path.join(root, "src/content/blog/posts");
  const posts = await Promise.all((await readdir(folder)).filter(file => file.endsWith(".json")).map(async file => JSON.parse(await readFile(path.join(folder, file), "utf8"))));
  await writeFile(path.join(dist, "rss.xml"), createRss(posts.filter(post => post.status === "published")));
  for (const post of posts.filter(post => post.status === "published")) await generateArticlePreview(post, root, dist);
  const examples = JSON.parse(await readFile(path.join(root, "src/content/reconciliationSample.json"), "utf8"));
  const examplesDirectory = path.join(dist, "ejemplos/conciliacion");
  await mkdir(examplesDirectory, { recursive: true });
  for (const [kind, contents] of Object.entries(examples)) await writeFile(path.join(examplesDirectory, `${kind}.csv`), "\uFEFF" + contents);
  console.log(`Generated ${documents.length} public Markdown documents, llms-full.txt and RSS.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await generateDiscoveryFiles();
