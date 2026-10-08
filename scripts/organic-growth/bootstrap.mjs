import { createHash } from "node:crypto";
import { engineRequest } from "./lib.mjs";

const opportunity = (title, cluster, targetUrl, intent, scores, evidence, status = "discovered", approvalReason = null) => ({
  fingerprint: createHash("sha256").update(`${cluster}:${targetUrl || title}`).digest("hex"),
  title,
  cluster,
  target_url: targetUrl,
  intent,
  evidence,
  commercial_intent: scores[0],
  demand_confidence: scores[1],
  ruka_advantage: scores[2],
  effort: scores[3],
  risk: scores[4],
  status,
  approval_reason: approvalReason,
});

const rows = [
  opportunity("Enviar y monitorear sitemap oficial", "technical-indexation", "https://www.ruka.ai/sitemap.xml", "technical", [2, 5, 5, 1, 0], [{ type: "gsc", fact: "zero submitted sitemaps at baseline" }], "deployed"),
  opportunity("Acelerar descubrimiento de páginas de producto e integraciones", "technical-indexation", "https://www.ruka.ai/productos/registro-de-compras", "technical", [4, 5, 5, 2, 1], [{ type: "gsc_inspection", fact: "seven recent public routes unknown to Google at baseline" }], "prioritized"),
  opportunity("Capturar intención de nómina de pago a proveedores", "supplier-payments", "https://www.ruka.ai/productos/cuentas-por-pagar", "commercial", [5, 4, 5, 2, 1], [{ type: "product", fact: "verified bank-file workflow" }, { type: "serp", fact: "banks and finance tools document explicit supplier payment file demand" }], "prioritized"),
  opportunity("Mejorar captura de registro de compras automático", "purchase-registration", "https://www.ruka.ai/productos/registro-de-compras", "commercial", [5, 4, 5, 2, 1], [{ type: "product", fact: "verified purchase invoice workflow" }, { type: "serp", fact: "active commercial results in Chile" }], "prioritized"),
  opportunity("Fortalecer intención de conciliación factura-OC-recepción", "purchase-reconciliation", "https://www.ruka.ai/productos/conciliacion-automatica", "commercial", [5, 4, 5, 2, 1], [{ type: "product", fact: "verified reconciliation workflow" }], "prioritized"),
  opportunity("Evaluar landing SII a ERP para compras", "sii-erp", null, "commercial", [5, 3, 4, 3, 2], [{ type: "serp", fact: "recurring SII-to-ERP buyer problem" }]),
  opportunity("Construir cluster interno non-branded de páginas de producto", "internal-linking", null, "technical", [4, 4, 5, 3, 1], [{ type: "gsc", fact: "marketing clicks are concentrated on the homepage" }]),
  opportunity("Evaluar mejoras de intención en restaurantes", "restaurant-operations", "https://www.ruka.ai/restaurantes", "commercial", [4, 4, 4, 2, 2], [{ type: "gsc", fact: "existing impressions with low observed CTR" }]),
  opportunity("Separar reporting público de subdominios tenant", "measurement", null, "technical", [3, 5, 5, 2, 0], [{ type: "gsc", fact: "domain property mixes marketing and tenant URLs" }], "in_progress"),
  opportunity("Conectar orgánico con reuniones calificadas", "attribution", null, "technical", [5, 4, 5, 4, 3], [{ type: "measurement_gap", fact: "Search Console clicks are not connected to qualified meetings" }], "approval_required", "Requires changes to protected tracking/form surfaces."),
];

const synced = await engineRequest("sync_opportunities", { rows });
const experiment = await engineRequest("create_experiment", {
  experiment: {
    title: "Search Console sitemap submission",
    status: "deployed",
    affected_urls: ["https://www.ruka.ai/sitemap.xml"],
    hypothesis: "Submitting the public sitemap through Search Console will improve discovery and recrawl of the recent public route inventory.",
    evidence: [{ type: "gsc", fact: "zero submitted sitemaps and seven unknown public routes at baseline" }],
    baseline: { submittedSitemaps: 0, unknownPublicRoutes: 7 },
    success_metrics: { sitemapStatus: "success", unknownPublicRoutes: "decreasing" },
    exact_changes: "Submitted https://www.ruka.ai/sitemap.xml in Google Search Console.",
    target_cluster: "technical-indexation",
    implemented_at: new Date().toISOString(),
    deployed_at: new Date().toISOString(),
    evaluate_after: new Date(Date.now() + 5 * 86400000).toISOString(),
    deployment_url: "https://www.ruka.ai/sitemap.xml",
  },
});

console.log(JSON.stringify({ opportunities: synced.count, experimentId: experiment.experimentId }, null, 2));
