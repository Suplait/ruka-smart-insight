import { engineRequest, writePrivateJson } from "./lib.mjs";

const status = await engineRequest("status");
const file = await writePrivateJson("engine-context.json", {
  capturedAt: new Date().toISOString(),
  opportunities: status.opportunities || [],
  experiments: status.experiments || [],
  recentRuns: status.runs || [],
});

console.log(JSON.stringify({ file, opportunities: status.opportunities?.length || 0, experiments: status.experiments?.length || 0 }, null, 2));
