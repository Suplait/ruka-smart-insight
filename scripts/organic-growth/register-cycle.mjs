import { readPrivateJson, engineRequest } from "./lib.mjs";

const manifest = await readPrivateJson("change-manifest.json");
const context = await readPrivateJson("engine-context.json");
const validateOnly = process.argv.includes("--validate");

if (typeof manifest.changed !== "boolean") throw new Error("change-manifest.json requires boolean changed");
if (!Array.isArray(manifest.affectedUrls) || !Array.isArray(manifest.evidence) || !Array.isArray(manifest.experimentUpdates)) {
  throw new Error("change-manifest.json requires affectedUrls, evidence and experimentUpdates arrays");
}
if (process.env.ORGANIC_GROWTH_PUBLISHED_CHANGED && manifest.changed !== (process.env.ORGANIC_GROWTH_PUBLISHED_CHANGED === "true")) {
  throw new Error("Manifest changed flag does not match the branch published by the workflow");
}

const knownOpportunityIds = new Set((context.opportunities || []).map((item) => item.id));
const knownExperimentIds = new Set((context.experiments || []).map((item) => item.id));
if (manifest.selectedOpportunityId && !knownOpportunityIds.has(manifest.selectedOpportunityId)) {
  throw new Error("Manifest selectedOpportunityId is not present in persistent engine context");
}
for (const update of manifest.experimentUpdates) {
  if (!knownExperimentIds.has(update.id)) throw new Error(`Unknown experiment update id: ${update.id}`);
  if (!["measuring", "validated", "inconclusive", "reverted"].includes(update.status)) {
    throw new Error(`Invalid experiment update status: ${update.status}`);
  }
}

if (manifest.changed) {
  for (const field of ["title", "hypothesis", "exactChanges", "targetCluster"]) {
    if (!manifest[field] || typeof manifest[field] !== "string") throw new Error(`Manifest requires ${field} when changed=true`);
  }
  if (!manifest.affectedUrls.length || !manifest.evidence.length) throw new Error("Changed cycle requires affectedUrls and evidence");
}

if (validateOnly) {
  console.log(JSON.stringify({ valid: true, changed: manifest.changed, updatedExperiments: manifest.experimentUpdates.length }, null, 2));
  process.exit(0);
}

if (manifest.experimentUpdates.length) {
  await engineRequest("update_experiments", { updates: manifest.experimentUpdates });
}

let experimentId = null;
if (manifest.changed) {
  const evaluateAfterDays = Math.min(45, Math.max(5, Number(manifest.evaluateAfterDays || 14)));
  const result = await engineRequest("create_experiment", {
    opportunityId: manifest.selectedOpportunityId || null,
    experiment: {
      opportunity_id: manifest.selectedOpportunityId || null,
      run_id: process.env.ORGANIC_GROWTH_RUN_ID || null,
      title: manifest.title,
      status: "deployed",
      affected_urls: manifest.affectedUrls,
      hypothesis: manifest.hypothesis,
      evidence: manifest.evidence,
      baseline: manifest.baseline || {},
      success_metrics: manifest.successMetrics || {},
      exact_changes: manifest.exactChanges,
      target_cluster: manifest.targetCluster,
      implemented_at: new Date().toISOString(),
      deployed_at: new Date().toISOString(),
      evaluate_after: new Date(Date.now() + evaluateAfterDays * 86400000).toISOString(),
      git_sha: process.env.ORGANIC_GROWTH_GIT_SHA || null,
      deployment_url: process.env.ORGANIC_GROWTH_DEPLOYMENT_URL || null,
    },
  });
  experimentId = result.experimentId;
}

console.log(JSON.stringify({ changed: manifest.changed, experimentId, updatedExperiments: manifest.experimentUpdates.length }, null, 2));
