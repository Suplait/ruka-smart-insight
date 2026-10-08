import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { compare, isoDate, shiftDays, sumRows, writePrivateJson, engineRequest } from "./lib.mjs";

const siteUrl = process.env.GSC_SITE_URL || "sc-domain:ruka.ai";
async function accessToken() {
  if (process.env.GSC_ACCESS_TOKEN) return process.env.GSC_ACCESS_TOKEN;

  const credentialsPath = process.env.GSC_CREDENTIALS_FILE || path.join(os.homedir(), ".search-console-mcp", "credentials.json");
  try {
    const credentials = JSON.parse(await readFile(credentialsPath, "utf8"));
    if (credentials.access_token && Number(credentials.expires_at || 0) > Date.now() + 60_000) return credentials.access_token;
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  const clientId = process.env.GSC_CLIENT_ID;
  const clientSecret = process.env.GSC_CLIENT_SECRET;
  const refreshToken = process.env.GSC_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Search Console credentials are expired. Refresh the connected Google Search Console account in Codex and retry.");
  }
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: refreshToken, grant_type: "refresh_token" }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.access_token) throw new Error(`Google token refresh failed: ${payload.error || response.status}`);
  return payload.access_token;
}

const token = await accessToken();

async function query({ startDate, endDate, dimensions = [], rowLimit = 25000, startRow = 0 }) {
  const response = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ startDate, endDate, dimensions, rowLimit, startRow, dataState: "final" }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(`Search Console query failed: ${payload.error?.message || response.status}`);
  return payload.rows || [];
}

const today = new Date();
const provisionalEnd = isoDate(new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 2)));
const recentDates = await query({ startDate: shiftDays(provisionalEnd, -9), endDate: provisionalEnd, dimensions: ["date"], rowLimit: 20 });
const dataThroughDate = recentDates.map((row) => row.keys?.[0]).filter(Boolean).sort().at(-1);
if (!dataThroughDate) throw new Error("Search Console did not return a finalized data date");

async function totals(days, offset = 0) {
  const endDate = shiftDays(dataThroughDate, -offset);
  const startDate = shiftDays(endDate, -(days - 1));
  const rows = await query({ startDate, endDate });
  return { startDate, endDate, ...sumRows(rows) };
}

const windowSizes = [7, 15, 28, 30, 90];
const windows = {};
for (const days of windowSizes) {
  const current = await totals(days);
  const previous = await totals(days, days);
  windows[`days${days}`] = { current, previous, ...compare(current, previous) };
}

const ninetyStart = shiftDays(dataThroughDate, -89);
const [queries, pages, countries, devices, daily] = await Promise.all([
  query({ startDate: ninetyStart, endDate: dataThroughDate, dimensions: ["query"] }),
  query({ startDate: ninetyStart, endDate: dataThroughDate, dimensions: ["page"] }),
  query({ startDate: ninetyStart, endDate: dataThroughDate, dimensions: ["country"] }),
  query({ startDate: ninetyStart, endDate: dataThroughDate, dimensions: ["device"] }),
  query({ startDate: ninetyStart, endDate: dataThroughDate, dimensions: ["date"], rowLimit: 100 }),
]);

const brandedPattern = /(?:^|\s)(?:ruka(?:\.ai)?|ruca|ruka one|ruka works)(?:\s|$)/i;
const commercialPattern = /(software|automatiza|automatización|sistema|plataforma|integración|conciliación|pago proveedores|registro compras|cuentas por pagar|inventario|stock|erp|pos)/i;
const normalizedQueries = queries.map((row) => ({
  query: row.keys?.[0] || "",
  clicks: row.clicks || 0,
  impressions: row.impressions || 0,
  ctr: row.ctr || 0,
  position: row.position || 0,
  segment: brandedPattern.test(row.keys?.[0] || "") ? "branded" : "non_branded",
  intent: commercialPattern.test(row.keys?.[0] || "") ? "commercial" : "informational_or_unknown",
}));

const snapshot = {
  schemaVersion: 1,
  property: siteUrl,
  capturedAt: new Date().toISOString(),
  dataThroughDate,
  caveats: [
    "Search Console omits anonymized queries; query rows must not be summed as property totals.",
    "Average position is impression-weighted and is not a rank tracker.",
    "Clicks are not sessions, leads, qualified opportunities or customers.",
    "The domain property includes tenant subdomains; public marketing URLs must be segmented explicitly.",
  ],
  windows,
  breakdowns: {
    queries: normalizedQueries.slice(0, 1000),
    pages: pages.slice(0, 1000).map((row) => ({ page: row.keys?.[0], clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position })),
    countries: countries.slice(0, 100),
    devices,
    daily,
  },
};

const file = await writePrivateJson("gsc-snapshot.json", snapshot);
if (process.env.ORGANIC_GROWTH_RUN_ID) {
  await engineRequest("snapshot", { runId: process.env.ORGANIC_GROWTH_RUN_ID, dataThroughDate, property: siteUrl, payload: snapshot });
}
console.log(JSON.stringify({ file, dataThroughDate, windows: Object.fromEntries(Object.entries(windows).map(([key, value]) => [key, value.metrics])) }, null, 2));
