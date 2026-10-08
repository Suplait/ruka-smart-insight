import { execFileSync, spawnSync } from "node:child_process";

const base = process.env.ORGANIC_GROWTH_BASE_REF || "origin/main";
const commands = [
  ["diff", "--name-only", `${base}...HEAD`],
  ["diff", "--name-only"],
  ["diff", "--cached", "--name-only"],
];
const untracked = execFileSync("git", ["ls-files", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split("\n").map((item) => item.trim()).filter(Boolean);
const files = [...new Set([...commands.flatMap((args) =>
  execFileSync("git", args, { encoding: "utf8" }).split("\n").map((item) => item.trim()).filter(Boolean),
), ...untracked])].filter((file) => /\.(?:[cm]?[jt]sx?)$/.test(file) && !file.startsWith("supabase/functions/"));

if (!files.length) {
  console.log("No changed JavaScript or TypeScript files require linting.");
  process.exit(0);
}

const result = spawnSync("npx", ["eslint", ...files], { stdio: "inherit" });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
