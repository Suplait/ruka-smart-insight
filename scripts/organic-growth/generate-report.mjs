import { engineRequest, readPrivateJson, writePrivateJson } from "./lib.mjs";

const snapshot = await readPrivateJson("gsc-snapshot.json");
const status = await engineRequest("status");

function percentChange(metric) {
  return metric?.changePercent == null ? "sin base comparable" : `${metric.changePercent > 0 ? "+" : ""}${metric.changePercent.toFixed(1)}%`;
}

const days15 = snapshot.windows.days15;
const days30 = snapshot.windows.days30;
const direction = days30.metrics.clicks.changeAbsolute > 0 ? "crecieron" : days30.metrics.clicks.changeAbsolute < 0 ? "cayeron" : "se mantuvieron";
const topPages = snapshot.breakdowns.pages
  .filter((row) => row.page?.startsWith("https://www.ruka.ai/"))
  .sort((a, b) => b.clicks - a.clicks)
  .slice(0, 4);
const commercialQueries = snapshot.breakdowns.queries
  .filter((row) => row.segment === "non_branded" && row.intent === "commercial" && row.impressions >= 3)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 4);
const recentRuns = status.runs.filter((run) => run.kind === "execution" && run.status === "succeeded");
const recentExperiments = status.experiments.filter((experiment) => ["deployed", "measuring"].includes(experiment.status));
const approvalRequired = status.opportunities.filter((opportunity) => opportunity.status === "approval_required");

const payload = {
  dataThroughDate: snapshot.dataThroughDate,
  executiveSummary: [
    `En los últimos 30 días, los clics orgánicos ${direction} ${percentChange(days30.metrics.clicks)} frente al período anterior.`,
    "El dato de Search Console incluye el dominio completo; el reporte separa páginas públicas de subdominios operativos cuando corresponde.",
    `${recentRuns.length} ciclo(s) de ejecución completado(s) y ${recentExperiments.length} experimento(s) desplegado(s) o en medición.`,
    commercialQueries.length ? `La principal oportunidad sigue siendo capturar demanda non-branded comercial, hoy todavía pequeña frente al tráfico de marca.` : "Search Console aún no entrega suficiente consulta non-branded visible para atribuir una tendencia robusta.",
  ],
  performance: { days15: { metrics: days15.metrics }, days30: { metrics: days30.metrics } },
  winners: topPages.map((row) => `${new URL(row.page).pathname}: ${row.clicks} clics y ${row.impressions} impresiones (90 días)`),
  losers: commercialQueries.map((row) => `“${row.query}”: ${row.impressions} impresiones, posición ${row.position.toFixed(1)}, CTR ${(row.ctr * 100).toFixed(1)}%`),
  changes: recentExperiments.slice(0, 6).map((experiment) => `${experiment.title} · ${experiment.status} · ${(experiment.affected_urls || []).join(", ")}`),
  pipelineSummary: `${status.opportunities.filter((item) => item.status === "prioritized").length} priorizadas · ${recentExperiments.length} en medición · ${approvalRequired.length} requieren aprobación.`,
  nextBets: status.opportunities.filter((item) => ["prioritized", "discovered"].includes(item.status)).slice(0, 3).map((item) => `${item.title} (score ${item.priority_score})`),
  blockers: approvalRequired.slice(0, 3).map((item) => `${item.title}: afecta una superficie protegida.`),
  caveats: snapshot.caveats,
};

await writePrivateJson("report.json", payload);
const result = await engineRequest("report", {
  runId: process.env.ORGANIC_GROWTH_RUN_ID || null,
  periodEnd: snapshot.dataThroughDate,
  payload,
});
console.log(JSON.stringify(result, null, 2));
