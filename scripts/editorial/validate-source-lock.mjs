import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

export const sourceHash = text => createHash("sha256").update(text).digest("hex");
export async function validateSourceLock(root = process.cwd()) {
  const lock = JSON.parse(await readFile(path.join(root, "config/editorial-source-lock.json"), "utf8"));
  if (lock.version !== 1 || !lock.reviewedAt || !lock.files?.length) throw new Error("Missing editorial source review");
  const failures = [];
  for (const entry of lock.files) {
    if (!/^(src\/(content|pages|utils|components\/(acquisition|resources|suppliers))|config|public\/api\/examples)\/[a-zA-Z0-9_./-]+$/.test(entry.path) || entry.path.includes("..")) throw new Error("Unsafe source review path");
    const text = await readFile(path.join(root, entry.path), "utf8");
    if (sourceHash(text) !== entry.sha256) failures.push(entry.path);
  }
  if (failures.length) throw new Error(`Public content changed since the source review: ${failures.join(", ")}. Review claims, links and source versions, then explicitly update the lock. Build must never approve content automatically.`);
  console.log(`Exact-source review passed for ${lock.files.length} files. No automatic reapproval.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await validateSourceLock();
