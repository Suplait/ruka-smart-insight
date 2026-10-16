import { engineRequest, readPrivateJson, writePrivateJson } from "./lib.mjs";
import { readCommercialEvidence } from './commercial-evidence.mjs';
import { readObservatory } from './ai-observatory.mjs';
import { collectCommercial } from './collect-commercial.mjs';
import { summarizeBuyerEvidence } from './buyer-evidence.mjs';

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
const recentCutoff = Date.now() - 15 * 86400000;
const recentRuns = status.runs.filter((run) => run.kind === "execution" && run.status === "succeeded" && Date.parse(run.finished_at) >= recentCutoff);
const recentExperiments = status.experiments.filter((experiment) => ["deployed", "measuring"].includes(experiment.status));
const measuredExperiments = status.experiments.filter((experiment) => ["validated", "inconclusive", "reverted"].includes(experiment.status) && Date.parse(experiment.updated_at) >= recentCutoff);
const approvalRequired = status.opportunities.filter((opportunity) => opportunity.status === "approval_required");
// Reporting starts in its own clean worktree and doesn't run organic:prepare.
// Refresh the optional source here instead of relying on another run's files.
await collectCommercial();
const commercial = await readCommercialEvidence();
const aiObservatory = await readObservatory();

let payload = {
  dataThroughDate: snapshot.dataThroughDate,
  executiveSummary: [
    `En los últimos 30 días, los clics orgánicos ${direction} ${percentChange(days30.metrics.clicks)} frente al período anterior.`,
    "El dato de Search Console incluye el dominio completo; el reporte separa páginas públicas de subdominios operativos cuando corresponde.",
    `${recentRuns.length} ciclo(s) de ejecución completado(s) y ${recentExperiments.length} experimento(s) desplegado(s) o en medición.`,
    commercialQueries.length ? `La principal oportunidad sigue siendo capturar demanda non-branded comercial, hoy todavía pequeña frente al tráfico de marca.` : "Search Console aún no entrega suficiente consulta non-branded visible para atribuir una tendencia robusta.",
  ],
  performance: { days15: { metrics: days15.metrics }, days30: { metrics: days30.metrics } },
  commercial,
  aiObservatory,
  buyerEvidence: summarizeBuyerEvidence(status.buyerEvidence || [], { since: new Date(Date.now() - 15 * 86400000).toISOString(), until: new Date().toISOString() }),
  winners: topPages.map((row) => `${new URL(row.page).pathname}: ${row.clicks} clics y ${row.impressions} impresiones (90 días)`),
  losers: commercialQueries.map((row) => `“${row.query}”: ${row.impressions} impresiones, posición ${row.position.toFixed(1)}, CTR ${(row.ctr * 100).toFixed(1)}%`),
  changes: recentExperiments.slice(0, 6).map((experiment) => `${experiment.title} · ${experiment.status} · ${(experiment.affected_urls || []).join(", ")}`),
  measurements: measuredExperiments.slice(0, 4).map((experiment) => `${experiment.title}: ${experiment.conclusion}`),
  pipelineSummary: `${status.opportunities.filter((item) => item.status === "prioritized").length} priorizadas · ${recentExperiments.length} en medición · ${approvalRequired.length} requieren aprobación.`,
  nextBets: status.opportunities.filter((item) => ["prioritized", "discovered"].includes(item.status)).slice(0, 3).map((item) => `${item.title} (score ${item.priority_score})`),
  blockers: approvalRequired.slice(0, 3).map((item) => `${item.title}: afecta una superficie protegida.`),
  caveats: snapshot.caveats,
};

const result = await engineRequest("report", {
  runId: process.env.ORGANIC_GROWTH_RUN_ID || null,
  periodEnd: snapshot.dataThroughDate,
  payload,
});
// The persisted outbox wins on retries, even if newer GSC data is available.
payload = result.payload;
await writePrivateJson("report.json", payload);
const savedCommercial = payload.commercial;
const savedObservatory = payload.aiObservatory;
const slackMessage = [
  "*RUKA ORGANIC GROWTH | Reporte quincenal*",
  `:mag: Datos finalizados hasta *${payload.dataThroughDate}* · Search Console`,
  result.scheduledFor ? `Entrega correspondiente al ${new Intl.DateTimeFormat("es-CL", { timeZone: "America/Santiago", dateStyle: "long" }).format(new Date(result.scheduledFor))}.` : "",
  "",
  "*Resumen ejecutivo*",
  ...payload.executiveSummary.map((item) => `• ${item}`),
  "",
  "*Performance orgánica*",
  `• 15 días · clics ${percentChange(payload.performance.days15.metrics.clicks)} · impresiones ${percentChange(payload.performance.days15.metrics.impressions)}`,
  `• 30 días · clics ${percentChange(payload.performance.days30.metrics.clicks)} · impresiones ${percentChange(payload.performance.days30.metrics.impressions)}`,
  "",
  "*Experimentos abiertos*",
  ...(payload.changes.length ? payload.changes.map((item) => `• ${item}`) : ["• No quedan experimentos abiertos en medición; los resultados cerrados se detallan debajo."]),
  ...((payload.measurements || []).length ? ["", "*Experimentos medidos*", ...payload.measurements.map((item) => `• ${item}`)] : []),
  "",
  `*Pipeline SEO*\n${payload.pipelineSummary}`,
  '',
  '*Dudas del comprador · últimos 15 días de trabajo*',
  `• ${payload.buyerEvidence.updatedQuestions} preguntas con registro actualizado; ${payload.buyerEvidence.supported} sustentadas con evidencia vigente; ${payload.buyerEvidence.needsOwner} pendientes de responsable; ${payload.buyerEvidence.reviewNeeded} requieren revisar vigencia.`,
  `• ${payload.buyerEvidence.note}`,
  '',
  '*Evidencia comercial · cohorte de captura de 90 días*',
  savedCommercial.state === 'ok'
    ? `• ${savedCommercial.submissions} envíos persistidos con trazabilidad; ${savedCommercial.attributionKnown} con primera página conocida. ${savedCommercial.excludedExplicitTests} pruebas explícitas excluidas. No equivale a personas ni clientes.`
    : '• Fuente comercial no disponible o vencida; no se informa cero.',
  savedCommercial.state === 'ok' ? `• CRM: ${savedCommercial.crm.observedTasks}/${savedCommercial.crm.linkedTasks} tareas vinculadas observadas. Estado comercial actual, no conversiones históricas. MRR: sin fuente verificada.` : '• Reuniones calificadas e ingresos: sin evidencia suficiente.',
  savedCommercial.state === 'ok' ? '• Cobertura parcial: los leads históricos sin referencia al nuevo registro de envíos no entran en esta cohorte. Estas cifras NO son el total de leads del sitio ni significan cero conversiones.' : '',
  '*Observatorio IA*',
  ...(savedObservatory.groups.length ? savedObservatory.groups.map(group => `• ${group.provider} / ${group.model} / ${group.branded ? 'marca' : 'sin marca'}: ${group.completed} respuestas completas, ${group.citations} con cita confirmada, ${group.citationUnknown} sin captura completa de citas, ${group.recommendations} recomendaciones de Ruka o sus recursos; ${group.blocked} bloqueadas, ${group.stale} vencidas. Recomendar una guía no implica recomendar el producto. No es cuota de mercado.`) : ['• Aún no hay observaciones verificadas.']),
  ...(payload.nextBets.length ? ["", "*Próximas apuestas*", ...payload.nextBets.map((item) => `• ${item}`)] : []),
  ...(payload.blockers.length ? ["", "*Decisiones requeridas*", ...payload.blockers.map((item) => `• ${item}`)] : []),
  "",
  "_Las variaciones describen movimiento observado; no atribuyen causalidad sin evidencia suficiente._",
  `Referencia de entrega: ${result.reportId}`,
].join("\n");
const slackFile = await writePrivateJson("report-delivery.json", {
  reportId: result.reportId,
  deliveryRequired: result.deliveryRequired,
  reference: result.reference || null,
  scheduledFor: result.scheduledFor,
  channelId: "C073N8S9TB4",
  message: slackMessage,
});
console.log(JSON.stringify({ ...result, slackFile }, null, 2));
