import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import ts from "typescript";

// A static complement to the runtime guardrail tests. No browser/network activity.
const base = process.argv[2] || "a054453";
const files = execFileSync("git", ["ls-tree", "-r", "--name-only", base, "src"], { encoding: "utf8" }).trim().split("\n").filter(file => /\.[jt]sx?$/.test(file));
const printer = ts.createPrinter({ removeComments: true });
function contracts(text, path) {
  const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
  const calls = [];
  function visit(node) {
    if (ts.isCallExpression(node)) {
      const name = node.expression.getText(source);
      if (/^(pushToDataLayer|track[A-Z]\w*)$/.test(name) || /(?:^|\.)dataLayer\.push$/.test(name)) {
        calls.push(printer.printNode(ts.EmitHint.Expression, node, source));
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return calls;
}
let total = 0;
let failed = false;
for (const file of files) {
  const old = contracts(execFileSync("git", ["show", `${base}:${file}`], { encoding: "utf8" }), file);
  const current = contracts(readFileSync(file, "utf8"), file);
  total += old.length;
  if (JSON.stringify(old) !== JSON.stringify(current)) { console.error(`Tracking call contract changed: ${file}`); failed = true; }
}
if (failed) process.exitCode = 1;
else console.log(`${total} existing tracking calls retain their names, arguments, and source order versus ${base}. Runtime tests cover dispatch conditions and persistence timing.`);
