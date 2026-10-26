import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { JSDOM } from "jsdom";
import { createHash } from "node:crypto";

const statuses = new Set(["draft", "approved", "retired"]);
const kinds = new Set(["navigation", "calculator", "api", "tax", "comparison", "guide", "product", "supplier", "security"]);
const day = 86_400_000;
const isoDate = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

// Deliberately excludes file whitespace, but includes every value, source and link.
export const contentDigest = content => createHash("sha256").update(JSON.stringify(content)).digest("hex");

export function reviewedContentIssues(record, content) {
  if (!content) return ["reviewed content is missing"];
  const issues = [];
  if (record.reviewedContentSha256 !== contentDigest(content)) issues.push("content changed since its review");
  if (record.reviewedAt !== content.reviewedAt) issues.push("content and approval review dates differ");
  if (JSON.stringify(record.sources) !== JSON.stringify(content.sources.map(source => source.url))) issues.push("content and approval sources differ");
  const paragraphs = [content.answer, ...content.sections.flatMap(section => section.paragraphs)];
  for (const fact of record.taxReview?.verifiedFacts ?? []) if (!paragraphs.includes(fact)) issues.push("verified fact is not present in reviewed content");
  return issues;
}

/** Build-time metadata only. Never imported into client bundles or public exports. */
export function publicationIssues(record, { now = new Date(), indexed = false } = {}) {
  const issues = [];
  if (!/^\/[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(record.path ?? "")) issues.push("invalid route");
  if (!statuses.has(record.status)) issues.push("invalid status");
  if (!kinds.has(record.kind)) issues.push("invalid kind");
  if (indexed && record.status !== "approved") issues.push("unapproved content is indexed");
  for (const field of ["intent", "owner", "author", "reviewer"]) if (typeof record[field] !== "string" || !record[field].trim()) issues.push(`missing ${field}`);
  if (!Array.isArray(record.capabilities) || record.capabilities.length === 0 || record.capabilities.some(value => !/^[a-z0-9-]+$/.test(value))) issues.push("missing or invalid capabilities");
  if (!Array.isArray(record.sources) || record.sources.length === 0 || record.sources.some(url => { try { const parsed = new URL(url); return parsed.protocol !== "https:" || !!parsed.username || !!parsed.password || parsed.hostname === "localhost"; } catch { return true; } })) issues.push("missing or unsafe sources");
  if (record.status === "approved") {
    if (!isoDate(record.reviewedAt)) issues.push("invalid review date");
    else {
      const age = (Date.parse(now.toISOString().slice(0, 10)) - Date.parse(record.reviewedAt)) / day;
      if (age < 0) issues.push("review date is in the future");
      if (!Number.isInteger(record.reviewWithinDays) || record.reviewWithinDays < 1 || record.reviewWithinDays > 365) issues.push("invalid review window");
      else if (age > record.reviewWithinDays) issues.push("review has expired");
    }
    if (record.kind === "comparison" && record.reviewWithinDays > 30) issues.push("comparison review window exceeds 30 days");
    if (record.kind === "tax") {
      const review = record.taxReview;
      const official = (record.sources ?? []).some(url => { try { const host = new URL(url).hostname; return host === "sii.cl" || host.endsWith(".sii.cl") || host === "bcn.cl" || host.endsWith(".bcn.cl"); } catch { return false; } });
      if (review?.method !== "official-source-verification" || !isoDate(review.checkedAt) || review.checkedAt !== record.reviewedAt || !review.scope?.trim() || !Array.isArray(review.verifiedFacts) || !review.verifiedFacts.length || review.verifiedFacts.some(fact => typeof fact !== "string" || fact.trim().length < 20) || !official) issues.push("tax content requires dated official-source verification and exact facts");
    }
    if (record.kind === "supplier" && (!record.legalEntityVerified || !record.publicationBasis)) issues.push("supplier identity and publication basis required");
  }
  return issues;
}

export async function validatePublications(root = process.cwd()) {
  const registry = JSON.parse(await readFile(path.join(root, "config/editorial-publications.json"), "utf8"));
  const capabilities = JSON.parse(await readFile(path.join(root, "config/capabilities.json"), "utf8"));
  const purchaseGuides = JSON.parse(await readFile(path.join(root, "src/content/purchaseGuides.json"), "utf8"));
  if (registry.version !== 1 || !Array.isArray(registry.publications)) throw new Error("Invalid editorial registry");
  const sitemap = await readFile(path.join(root, "dist/sitemap.xml"), "utf8");
  const sitemapDom = new JSDOM(sitemap, { contentType: "application/xml" });
  const indexedPaths = [...sitemapDom.window.document.querySelectorAll("loc")].map(node => new URL(node.textContent).pathname);
  const legacy = JSON.parse(await readFile(path.join(root, "config/editorial-legacy-routes.json"), "utf8"));
  const failures = [];
  const seen = new Set();
  for (const record of registry.publications) {
    if (seen.has(record.path)) failures.push(`${record.path}: duplicate publication`);
    seen.add(record.path);
    const indexed = sitemap.includes(`<loc>https://www.ruka.ai${record.path}</loc>`);
    for (const id of record.capabilities ?? []) if (!capabilities.capabilities.some(item => item.id === id && item.allowedClaims.length > 0)) failures.push(`${record.path}: capability ${id} has no permitted claim`);
    for (const issue of publicationIssues(record, { indexed })) failures.push(`${record.path}: ${issue}`);
    if (record.status === "approved" && !indexed) failures.push(`${record.path}: approved route missing from sitemap`);
    if (!/^\/[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(record.path ?? "")) continue;
    if (record.status !== "approved") {
      try { await readFile(path.join(root, "dist", record.path, "index.html")); failures.push(`${record.path}: draft/retired HTML must not be generated`); } catch (error) { if (error.code !== "ENOENT") throw error; }
    } else {
      const html = await readFile(path.join(root, "dist", record.path, "index.html"), "utf8");
      const document = new JSDOM(html).window.document;
      const main = document.querySelector("main");
      if (!main || main.textContent.trim().length < 200) failures.push(`${record.path}: substantive server-rendered content missing`);
      if (record.kind === "tax") {
        const guide = purchaseGuides.find(item => record.path === `/guias/compras/${item.slug}`);
        for (const issue of reviewedContentIssues(record, guide)) failures.push(`${record.path}: ${issue}`);
        for (const source of record.sources) if (![...main.querySelectorAll("a[href]")].some(a => a.getAttribute("href") === source)) failures.push(`${record.path}: source absent from visible server HTML: ${source}`);
        if (!main.textContent.includes(record.author) || !main.querySelector(`time[datetime="${record.reviewedAt}"]`)) failures.push(`${record.path}: public author/review date missing`);
      }
    }
  }
  for (const route of indexedPaths) if (!seen.has(route) && !legacy.routes.includes(route)) failures.push(`${route}: new indexable route has no editorial approval`);
  if (failures.length) throw new Error(`Editorial publication gate failed:\n${failures.join("\n")}`);
  console.log(`Editorial gate passed for ${seen.size} governed routes. No draft content published.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await validatePublications();
