import { appendFile } from "node:fs/promises";
import { engineRequest } from "./lib.mjs";

const [command, kind = "execution"] = process.argv.slice(2);
const outputFile = process.env.GITHUB_OUTPUT;

async function output(values) {
  const lines = Object.entries(values).map(([key, value]) => `${key}=${String(value)}`).join("\n") + "\n";
  if (outputFile) await appendFile(outputFile, lines);
  else process.stdout.write(lines);
}

if (command === "claim") {
  const result = await engineRequest("claim", {
    kind,
    triggerSource: process.env.ORGANIC_GROWTH_TRIGGER_SOURCE || "codex_automation",
    force: process.env.ORGANIC_GROWTH_FORCE === "true",
  });
  await output({ claimed: Boolean(result.claimed), run_id: result.run_id || "", reason: result.reason || "", next_due_at: result.next_due_at || "" });
} else if (command === "complete") {
  await engineRequest("complete", {
    runId: process.env.ORGANIC_GROWTH_RUN_ID,
    success: true,
    dataThroughDate: process.env.ORGANIC_GROWTH_DATA_THROUGH_DATE || null,
    gitSha: process.env.ORGANIC_GROWTH_GIT_SHA || null,
    pullRequestUrl: process.env.ORGANIC_GROWTH_PR_URL || null,
    deploymentUrl: process.env.ORGANIC_GROWTH_DEPLOYMENT_URL || null,
    summary: process.env.ORGANIC_GROWTH_SUMMARY ? JSON.parse(process.env.ORGANIC_GROWTH_SUMMARY) : {},
  });
} else if (command === "fail") {
  await engineRequest("complete", {
    runId: process.env.ORGANIC_GROWTH_RUN_ID,
    success: false,
    errorMessage: process.env.ORGANIC_GROWTH_ERROR || "Codex automation job failed",
  });
} else if (command === "status") {
  console.log(JSON.stringify(await engineRequest("status"), null, 2));
} else if (command === "report-delivered") {
  console.log(JSON.stringify(await engineRequest("report_delivery", {
    reportId: process.env.ORGANIC_GROWTH_REPORT_ID,
    status: process.env.ORGANIC_GROWTH_DELIVERY_STATUS || "sent",
    reference: process.env.ORGANIC_GROWTH_DELIVERY_REFERENCE || null,
  }), null, 2));
} else if (command === "incident") {
  console.log(JSON.stringify(await engineRequest("incident", {
    severity: process.env.ORGANIC_GROWTH_INCIDENT_SEVERITY || "warning",
    title: process.env.ORGANIC_GROWTH_INCIDENT_TITLE || "Incidente del Organic Growth Engine",
    details: process.env.ORGANIC_GROWTH_INCIDENT_DETAILS || "Sin detalles",
  }), null, 2));
} else if (command === "incident-delivered") {
  console.log(JSON.stringify(await engineRequest("incident_delivery", {
    incidentId: process.env.ORGANIC_GROWTH_INCIDENT_ID,
    status: process.env.ORGANIC_GROWTH_DELIVERY_STATUS || "sent",
    reference: process.env.ORGANIC_GROWTH_DELIVERY_REFERENCE || null,
  }), null, 2));
} else if (command === "integrity") {
  console.log(JSON.stringify(await engineRequest("integrity"), null, 2));
} else if (command === "backup") {
  console.log(JSON.stringify(await engineRequest("backup"), null, 2));
} else {
  throw new Error(`Unknown job-control command: ${command}`);
}
