import { requiredEnv } from "./lib.mjs";

const origin = process.env.ORGANIC_GROWTH_PRODUCTION_ORIGIN || "https://www.ruka.ai";
const expectedSha = process.env.ORGANIC_GROWTH_EXPECTED_SHA || "";
const paths = (process.env.ORGANIC_GROWTH_VERIFY_PATHS || "/,/robots.txt,/sitemap.xml,/llms.txt,/integraciones,/blog")
  .split(",").map((value) => value.trim()).filter(Boolean);

const failures = [];
for (const path of paths) {
  const url = new URL(path, origin).toString();
  const response = await fetch(url, { redirect: "manual", headers: { "User-Agent": "RukaOrganicGrowthVerifier/1.0" } });
  const body = await response.text();
  if (response.status !== 200) failures.push(`${path}: expected 200, received ${response.status}`);
  if (path.endsWith(".xml") && !response.headers.get("content-type")?.includes("xml")) failures.push(`${path}: invalid XML content type`);
  if (path === "/" || (!path.includes(".") && path !== "/")) {
    if (!body.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i)) failures.push(`${path}: missing server-rendered canonical`);
    if (!body.match(/<h1\b/i)) failures.push(`${path}: missing server-rendered H1`);
    if (body.includes('<div id="root"></div>')) failures.push(`${path}: empty prerender root`);
  }
  console.log(`${response.status} ${url} (${body.length} bytes)`);
}

if (expectedSha) {
  const apiUrl = requiredEnv("GITHUB_API_URL");
  const repository = requiredEnv("GITHUB_REPOSITORY");
  const headers = { Authorization: `Bearer ${requiredEnv("GITHUB_TOKEN")}`, Accept: "application/vnd.github+json" };
  const deploymentContext = process.env.ORGANIC_GROWTH_DEPLOYMENT_CONTEXT || "Vercel";

  const statusResponse = await fetch(`${apiUrl}/repos/${repository}/commits/${expectedSha}/status`, { headers });
  if (!statusResponse.ok) {
    failures.push(`Unable to read commit deployment status (${statusResponse.status})`);
  } else {
    const combined = await statusResponse.json();
    const deploymentStatus = combined.statuses?.find((status) => status.context === deploymentContext);
    if (!deploymentStatus) failures.push(`${expectedSha}: missing ${deploymentContext} commit status`);
    else if (deploymentStatus.state !== "success") failures.push(`${expectedSha}: ${deploymentContext} status is ${deploymentStatus.state}`);
  }

  const deploymentsResponse = await fetch(
    `${apiUrl}/repos/${repository}/deployments?sha=${encodeURIComponent(expectedSha)}&environment=Production&per_page=10`,
    { headers },
  );
  if (!deploymentsResponse.ok) {
    failures.push(`Unable to read production deployments (${deploymentsResponse.status})`);
  } else {
    const deployments = await deploymentsResponse.json();
    if (!deployments.length) {
      failures.push(`${expectedSha}: no GitHub Production deployment found`);
    } else {
      const deploymentStatusesResponse = await fetch(`${apiUrl}/repos/${repository}/deployments/${deployments[0].id}/statuses`, { headers });
      if (!deploymentStatusesResponse.ok) {
        failures.push(`Unable to read Production deployment statuses (${deploymentStatusesResponse.status})`);
      } else {
        const deploymentStatuses = await deploymentStatusesResponse.json();
        if (!deploymentStatuses.some((status) => status.state === "success")) {
          failures.push(`${expectedSha}: Production deployment has not succeeded`);
        }
      }
    }
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Production verification passed for ${paths.length} path(s).`);
