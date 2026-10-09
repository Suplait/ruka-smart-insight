import { engineRequest, readPrivateJson, writePrivateJson } from "./lib.mjs";

const origin = process.env.ORGANIC_GROWTH_PRODUCTION_ORIGIN || "https://www.ruka.ai";
const paths = ["/", "/robots.txt", "/sitemap.xml", "/llms.txt"];
const checkedAt = new Date();

const [status, integrity, snapshot] = await Promise.all([
  engineRequest("status"),
  engineRequest("integrity"),
  readPrivateJson("gsc-snapshot.json").catch(() => null),
]);

const endpoints = await Promise.all(paths.map(async (pathname) => {
  const url = new URL(pathname, origin).toString();
  try {
    const response = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": "RukaOrganicGrowthWatchdog/1.0" },
    });
    const body = await response.text();
    return {
      pathname,
      status: response.status,
      contentType: response.headers.get("content-type") || "",
      bytes: Buffer.byteLength(body),
      hasCanonical: pathname === "/" ? /<link\b[^>]*\brel=["']canonical["'][^>]*>/i.test(body) : null,
      hasServerH1: pathname === "/" ? /<h1\b/i.test(body) : null,
      emptyRoot: pathname === "/" ? body.includes('<div id="root"></div>') : null,
    };
  } catch (error) {
    return { pathname, status: 0, error: error instanceof Error ? error.message : String(error) };
  }
}));

const issues = [];
for (const endpoint of endpoints) {
  if (endpoint.status !== 200) issues.push({ severity: "critical", code: "http_status", detail: `${endpoint.pathname}: ${endpoint.status}` });
  if (endpoint.pathname === "/sitemap.xml" && !endpoint.contentType?.includes("xml")) {
    issues.push({ severity: "critical", code: "sitemap_content_type", detail: endpoint.contentType || "missing" });
  }
  if (endpoint.pathname === "/" && (!endpoint.hasCanonical || !endpoint.hasServerH1 || endpoint.emptyRoot)) {
    issues.push({ severity: "critical", code: "prerender_regression", detail: "Homepage server HTML is incomplete" });
  }
}
if (!integrity.ok) issues.push({ severity: "critical", code: "sqlite_integrity", detail: "SQLite integrity check failed" });

let dataLagDays = null;
if (snapshot?.dataThroughDate) {
  dataLagDays = Math.floor((checkedAt.getTime() - Date.parse(`${snapshot.dataThroughDate}T23:59:59Z`)) / 86400000);
  if (dataLagDays > 5) issues.push({ severity: "warning", code: "gsc_freshness", detail: `${dataLagDays} days behind` });
} else {
  issues.push({ severity: "warning", code: "gsc_snapshot_missing", detail: "No finalized Search Console snapshot" });
}

const experimentsDue = (status.experiments || []).filter((experiment) => (
  ["deployed", "measuring"].includes(experiment.status)
  && experiment.evaluate_after
  && Date.parse(experiment.evaluate_after) <= checkedAt.getTime()
));

const opportunityHints = (snapshot?.breakdowns?.queries || [])
  .filter((query) => query.segment === "non_branded" && query.intent === "commercial" && Number(query.impressions || 0) >= 3)
  .sort((left, right) => {
    const leftPotential = Number(left.impressions || 0) * Math.max(1, Number(left.position || 1));
    const rightPotential = Number(right.impressions || 0) * Math.max(1, Number(right.position || 1));
    return rightPotential - leftPotential;
  })
  .slice(0, 5)
  .map((query) => ({
    query: query.query,
    clicks: Number(query.clicks || 0),
    impressions: Number(query.impressions || 0),
    ctr: Number(query.ctr || 0),
    position: Number(query.position || 0),
  }));

const payload = {
  schemaVersion: 1,
  checkedAt: checkedAt.toISOString(),
  health: issues.some((issue) => issue.severity === "critical") ? "critical" : issues.length ? "warning" : "healthy",
  endpoints,
  dataThroughDate: snapshot?.dataThroughDate || null,
  dataLagDays,
  experimentsDue: experimentsDue.map((experiment) => ({ id: experiment.id, title: experiment.title, evaluateAfter: experiment.evaluate_after })),
  opportunityHints,
  issues,
  storage: { type: status.storage?.type, integrity: integrity.ok },
};

const file = await writePrivateJson("watchdog.json", payload);
console.log(JSON.stringify({ file, ...payload }, null, 2));

if (payload.health === "critical") process.exitCode = 1;
