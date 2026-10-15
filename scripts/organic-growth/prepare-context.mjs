import { engineRequest, writePrivateJson } from "./lib.mjs";
import { collectCommercial } from './collect-commercial.mjs';
import { readCommercialEvidence } from './commercial-evidence.mjs';
import { readObservatory } from './ai-observatory.mjs';

const status = await engineRequest("status");
await collectCommercial();
const commercial = await readCommercialEvidence();
const aiObservatory = await readObservatory();
await writePrivateJson('commercial-evidence.json', commercial);
await writePrivateJson('ai-observatory.json', aiObservatory);
const file = await writePrivateJson("engine-context.json", {
  capturedAt: new Date().toISOString(),
  opportunities: status.opportunities || [],
  experiments: status.experiments || [],
  buyerEvidence: status.buyerEvidence || [],
  recentRuns: status.runs || [],
  commercial,
  aiObservatory,
});

console.log(JSON.stringify({ file, opportunities: status.opportunities?.length || 0, experiments: status.experiments?.length || 0 }, null, 2));
