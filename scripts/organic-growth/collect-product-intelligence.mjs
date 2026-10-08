import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import path from "node:path";
import { engineRequest, writePrivateJson } from "./lib.mjs";

const repositories = [
  { name: "ruka", path: process.env.RUKA_REPO_PATH || path.resolve(process.cwd(), "../ruka-ai") },
  { name: "ruka_v3", path: process.env.RUKA_V3_REPO_PATH || path.resolve(process.cwd(), "../ruka_v3") },
];

function git(repoPath, args) {
  return execFileSync("git", ["-C", repoPath, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

const signals = [];
for (const repository of repositories) {
  if (!existsSync(repository.path)) throw new Error(`Product repository unavailable: ${repository.path}`);
  try { git(repository.path, ["fetch", "--prune", "origin"]); } catch { /* read-only analysis can continue from the existing remote ref */ }
  const ref = "origin/main";
  const head = git(repository.path, ["rev-parse", ref]);
  const log = git(repository.path, ["log", ref, "--since=45 days ago", "--no-merges", "--pretty=format:%H%x09%cs%x09%s"]);
  const commits = log.split("\n").filter(Boolean).map((line) => {
    const [sha, date, ...subjectParts] = line.split("\t");
    return { sha, date, subject: subjectParts.join("\t") };
  });
  signals.push({ repository: repository.name, ref, head, commits });
}

const payload = { capturedAt: new Date().toISOString(), repositories: signals };
const file = await writePrivateJson("product-intelligence.json", payload);

const rows = signals.flatMap((repository) => repository.commits.slice(0, 80).map((commit) => ({
  fingerprint: createHash("sha256").update(`${repository.repository}:${commit.sha}`).digest("hex"),
  repository: repository.repository,
  source_ref: commit.sha,
  capability: commit.subject.slice(0, 240),
  maturity: "unknown",
  public_safe_summary: "Requires product and commercial validation before public use.",
  supporting_evidence: [{ type: "git_commit", repository: repository.repository, sha: commit.sha, date: commit.date }],
})));
await engineRequest("sync_product_signals", { rows });

console.log(JSON.stringify({ file, repositories: signals.map(({ repository, head, commits }) => ({ repository, head, recentCommits: commits.length })) }, null, 2));
