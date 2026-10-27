import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";
import path from "node:path";

export const supplierDigest = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const fields = ["slug", "name", "legalName", "rut", "aliases", "category", "summary", "identityNote", "website", "channel", "checks", "sources", "reviewedAt"];
const isoDate = value => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
export function registryIssues(registry) {
  if (!registry || typeof registry !== "object" || Array.isArray(registry)) return ["invalid public registry"];
  const issues = [];
  const keys = ["sourceDate", "legalType", "legalSubtype", "startedAt", "activities", "annual"];
  if (Object.keys(registry).some(key => !keys.includes(key)) || keys.some(key => !(key in registry))) issues.push("registry field allowlist");
  if (registry.sourceDate !== "2026-08" || !(registry.legalType?.includes("PERSONA JURIDICA") || (registry.legalType === "ORG. SIN FINES DE LUCRO" && registry.legalSubtype?.toLowerCase() === "cooperativa")) || !registry.legalSubtype?.trim() || (registry.startedAt !== null && !isoDate(registry.startedAt))) issues.push("registry identity and date");
  const activities = registry.activities;
  if (!Array.isArray(activities) || !activities.length || new Set(activities.map(a => a?.code)).size !== activities.length || activities.some(a => !a || Object.keys(a).some(key => !["code", "description", "registeredAt"].includes(key)) || !/^\d{6}$/.test(a.code) || typeof a.description !== "string" || a.description.length < 5 || (a.registeredAt !== null && !isoDate(a.registeredAt)))) issues.push("registry activities");
  if (registry.annual !== null) {
    const annual = registry.annual;
    const annualKeys = ["year", "region", "province", "commune", "sector", "subsector", "mainActivity", "employees"];
    if (!annual || typeof annual !== "object" || Object.keys(annual).some(key => !annualKeys.includes(key)) || annualKeys.some(key => !(key in annual)) || annual.year !== 2024 || annualKeys.filter(key => !["year", "employees"].includes(key)).some(key => typeof annual[key] !== "string" || !annual[key].trim()) || (annual.employees !== null && (!Number.isSafeInteger(annual.employees) || annual.employees < 0))) issues.push("historical registry values");
  }
  return issues;
}
const safeUrl = value => { try { const url = new URL(value); return url.protocol === "https:" && !url.username && !url.password && !url.hash && !/localhost|127\.0\.0\.1/.test(url.hostname); } catch { return false; } };
export function rutValid(value) {
  if (typeof value !== "string" || !/^\d{1,3}(?:\.\d{3}){2}-[0-9K]$/.test(value)) return false;
  const [body, dv] = value.replaceAll(".", "").split("-");
  let sum = 0;
  [...body].reverse().forEach((digit, i) => { sum += Number(digit) * (i % 6 + 2); });
  const n = 11 - sum % 11;
  return !/^0+$/.test(body) && dv === (n === 11 ? "0" : n === 10 ? "K" : String(n));
}

/** Fail closed. Private supplier tables are not an input to a public build. */
export function auditDirectory(records, approvals, now = new Date()) {
  if (!Array.isArray(records) || !Array.isArray(approvals)) throw new Error("Directory and approvals must be arrays");
  const accepted = [], quarantine = [];
  const slugs = new Map(), ruts = new Map();
  for (const record of records) {
    if (!record || typeof record !== "object" || Array.isArray(record)) continue;
    slugs.set(record.slug, (slugs.get(record.slug) ?? 0) + 1);
    ruts.set(record.rut, (ruts.get(record.rut) ?? 0) + 1);
  }
  const approvalMap = new Map();
  const duplicateApprovals = new Set();
  for (const item of approvals) {
    if (!item || typeof item !== "object") continue;
    if (approvalMap.has(item.slug)) duplicateApprovals.add(item.slug);
    approvalMap.set(item.slug, item);
  }
  for (const record of records) {
    if (!record || typeof record !== "object" || Array.isArray(record)) { quarantine.push({ slug: null, issues: ["invalid record"] }); continue; }
    const issues = [], approval = approvalMap.get(record.slug);
    if (duplicateApprovals.has(record.slug)) issues.push("duplicate approval");
    if (["name", "legalName", "category"].some(key => typeof record[key] !== "string" || record[key].trim().length < 3)) issues.push("identity labels");
    if (Object.keys(record).some(key => ![...fields, "registry"].includes(key)) || fields.some(key => !(key in record))) issues.push("field allowlist");
    if (record.registry) issues.push(...registryIssues(record.registry));
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug ?? "")) issues.push("slug");
    if (!rutValid(record.rut)) issues.push("RUT checksum");
    if (slugs.get(record.slug) > 1 || ruts.get(record.rut) > 1) issues.push("duplicate identity");
    if (!approval || approval.status !== "approved" || approval.entityType !== "legal" || approval.basis !== "public-primary-sources" || !approval.reviewedBy?.trim()) issues.push("publication basis");
    if (approval?.sha256 !== supplierDigest(record)) issues.push("review invalidated by content change");
    const age = (Date.parse(now.toISOString().slice(0, 10)) - Date.parse(record.reviewedAt)) / 86400000;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(record.reviewedAt ?? "") || !Number.isFinite(age) || new Date(record.reviewedAt).toISOString().slice(0, 10) !== record.reviewedAt || age < 0 || age > 180) issues.push("stale review");
    if ((record.website !== null && !safeUrl(record.website)) || (record.channel !== null && !safeUrl(record.channel?.url)) || (!record.registry && (!record.website || !record.channel))) issues.push("unsafe destination");
    if (!Array.isArray(record.sources) || record.sources.length < 2 || record.sources.some(s => !s || typeof s.label !== "string" || s.label.trim().length < 3 || Object.keys(s).some(k => !["label", "url", "supports"].includes(k)) || !safeUrl(s.url) || !["identity", "activity", "channel"].includes(s.supports))) issues.push("source provenance");
    else if (!record.sources.some(s => s.supports === "identity") || !record.sources.some(s => s.supports === "activity" || s.supports === "channel")) issues.push("source coverage");
    if (!Array.isArray(record.checks) || record.checks.length !== 3 || record.checks.some(c => !c || Object.keys(c).some(k => !["title", "text"].includes(k)) || typeof c.title !== "string" || c.title.length < 5 || typeof c.text !== "string" || c.text.length < 65)) issues.push("useful checks");
    if (typeof record.summary !== "string" || record.summary.length < 70 || typeof record.identityNote !== "string" || record.identityNote.length < 60 || !Array.isArray(record.aliases) || record.aliases.some(a => typeof a !== "string")) issues.push("useful identity context");
    if (record.channel !== null && (typeof record.channel.label !== "string" || record.channel.label.length < 3 || Object.keys(record.channel).some(k => !["label", "url", "note"].includes(k)) || typeof record.channel.note !== "string" || record.channel.note.length < 30)) issues.push("channel scope");
    const content = JSON.stringify(record);
    if (/<\/?(?:script|iframe)|javascript:|tenant_id|account_number|slackTimestamp|api[_-]?key|@/.test(content)) issues.push("unsafe/private content");
    if (issues.length) quarantine.push({ slug: record.slug, issues }); else accepted.push(record);
  }
  return { accepted, quarantine };
}

export function directoryDiff(previous, next) {
  const before = new Map(previous.map(row => [row.slug, supplierDigest(row)]));
  const after = new Map(next.map(row => [row.slug, supplierDigest(row)]));
  return { added: [...after.keys()].filter(k => !before.has(k)), changed: [...after.keys()].filter(k => before.has(k) && before.get(k) !== after.get(k)), removed: [...before.keys()].filter(k => !after.has(k)) };
}

export async function validateDirectory(root = process.cwd()) {
  const records = JSON.parse(await readFile(path.join(root, "config/supplier-profiles.json"), "utf8"));
  const approvals = JSON.parse(await readFile(path.join(root, "config/supplier-approvals.json"), "utf8"));
  const audit = auditDirectory(records, approvals);
  if (audit.quarantine.length) throw new Error(`Supplier publication blocked: ${JSON.stringify(audit.quarantine)}`);
  console.log(`Supplier gate passed: ${audit.accepted.length} legal entities, primary sources, allowlist, freshness and exact review hashes.`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await validateDirectory();
