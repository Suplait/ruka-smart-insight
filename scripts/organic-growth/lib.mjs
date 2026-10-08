import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export const workspace = path.resolve(process.cwd(), ".organic-growth");

export async function ensureWorkspace() {
  await mkdir(workspace, { recursive: true });
  return workspace;
}

export async function writePrivateJson(name, value) {
  await ensureWorkspace();
  const file = path.join(workspace, name);
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, { mode: 0o600 });
  return file;
}

export async function readPrivateJson(name) {
  return JSON.parse(await readFile(path.join(workspace, name), "utf8"));
}

export function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

export function shiftDays(dateString, days) {
  const date = new Date(`${dateString}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return isoDate(date);
}

export function sumRows(rows = []) {
  if (!rows.length) return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  const clicks = rows.reduce((sum, row) => sum + Number(row.clicks || 0), 0);
  const impressions = rows.reduce((sum, row) => sum + Number(row.impressions || 0), 0);
  const weightedPosition = rows.reduce((sum, row) => sum + Number(row.position || 0) * Number(row.impressions || 0), 0);
  return {
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : 0,
    position: impressions ? weightedPosition / impressions : 0,
  };
}

export function compare(current, previous) {
  const metric = (key) => ({
    current: Number(current[key] || 0),
    previous: Number(previous[key] || 0),
    changeAbsolute: Number(current[key] || 0) - Number(previous[key] || 0),
    changePercent: Number(previous[key] || 0)
      ? ((Number(current[key] || 0) - Number(previous[key] || 0)) / Number(previous[key] || 0)) * 100
      : null,
  });
  return { metrics: { clicks: metric("clicks"), impressions: metric("impressions"), ctr: metric("ctr"), position: metric("position") } };
}

export async function engineRequest(action, body = {}) {
  const endpoint = requiredEnv("ORGANIC_GROWTH_API_URL");
  const secret = requiredEnv("ORGANIC_GROWTH_SHARED_SECRET");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-organic-growth-secret": secret },
    body: JSON.stringify({ action, ...body }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Organic Growth API ${action} failed (${response.status}): ${payload.error || "unknown"}`);
  return payload;
}
