import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { engineRequest, workspace } from "./lib.mjs";

const legacyApiUrl = process.env.ORGANIC_GROWTH_LEGACY_API_URL
  || "https://rmxzryueysmzksmvpwpv.supabase.co/functions/v1/organic-growth-api";

async function optionalJson(name) {
  try { return JSON.parse(await readFile(path.join(workspace, name), "utf8")); }
  catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

async function remoteStatus() {
  const secret = process.env.ORGANIC_GROWTH_SHARED_SECRET
    || (await readFile(path.join(workspace, "shared-secret"), "utf8")).trim();
  const response = await fetch(legacyApiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-organic-growth-secret": secret },
    body: JSON.stringify({ action: "status" }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Legacy Organic Growth export failed (${response.status}): ${payload.error || "unknown"}`);
  return payload;
}

const [status, snapshot, report, productIntelligence] = await Promise.all([
  remoteStatus(),
  optionalJson("gsc-snapshot.json"),
  optionalJson("report.json"),
  optionalJson("product-intelligence.json"),
]);

const migration = await engineRequest("import_legacy", { status, snapshot, report });

let productSignals = 0;
if (productIntelligence?.repositories) {
  const rows = productIntelligence.repositories.flatMap((repository) => (repository.commits || []).slice(0, 80).map((commit) => ({
    fingerprint: createHash("sha256").update(`${repository.repository}:${commit.sha}`).digest("hex"),
    repository: repository.repository,
    source_ref: commit.sha,
    observed_at: commit.date ? `${commit.date}T12:00:00.000Z` : productIntelligence.capturedAt,
    capability: commit.subject.slice(0, 240),
    maturity: "unknown",
    public_safe_summary: "Requires product and commercial validation before public use.",
    supporting_evidence: [{ type: "git_commit", repository: repository.repository, sha: commit.sha, date: commit.date }],
  })));
  productSignals = (await engineRequest("sync_product_signals", { rows })).count;
}

const integrity = await engineRequest("integrity");
console.log(JSON.stringify({ migration, productSignals, integrity }, null, 2));
