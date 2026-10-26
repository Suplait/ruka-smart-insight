import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { generateOpenApi } from "./generate-openapi.mjs";

const catalog = JSON.parse(await readFile(new URL("../../config/api-public-catalog.json", import.meta.url), "utf8"));
const spec = generateOpenApi(catalog);

test("every public operation and parameter is represented, no legacy or internal routes", () => {
  const operations = Object.values(spec.paths).flatMap(path => Object.values(path));
  assert.equal(operations.length, 10);
  assert.deepEqual(operations.map(op => op.operationId).sort(), catalog.entries.map(op => op.id).sort());
  for (const entry of catalog.entries) {
    const operation = spec.paths[entry.path.replace(/:([a-z_]+)/g, "{$1}")][entry.method.toLowerCase()];
    const names = [...operation.parameters.map(p => p.name), ...Object.keys(operation.requestBody?.content["application/json"].schema.properties ?? {})];
    assert.deepEqual(names.sort(), entry.parameters.map(p => p.name).sort());
    for (const response of entry.responses) assert.ok(operation.responses[response.status]);
  }
  assert.ok(Object.keys(spec.paths).every(route => route.startsWith("/api/v1/")));
  assert.equal(spec.servers[0].url, "https://api.rukafactura.cl");
});

test("body types, query aliases, path parameters and media types stay truthful", () => {
  const patch = spec.paths["/api/v1/webhooks/{id}"].patch;
  assert.deepEqual(patch.requestBody.content["application/json"].schema.properties.authentication.type, ["object", "null"]);
  assert.equal(patch.parameters[0].required, true);
  const report = spec.paths["/api/v1/reports/purchase_lines"].get;
  assert.equal(report.parameters.find(p => p.name === "include_credit_notes").schema.enum, undefined);
  assert.equal(report.parameters.find(p => p.name === "company_ids").explode, false);
  assert.ok(spec.paths["/api/v1/purchase_documents"].get.responses["200"].content["application/pdf"]);
  assert.equal(spec.paths["/api/v1/webhooks/{id}"].delete.responses["204"].content, undefined);
});

test("generation is deterministic, rejects duplicates and excludes internal metadata", () => {
  assert.deepEqual(generateOpenApi(catalog), spec);
  assert.throws(() => generateOpenApi({ ...catalog, entries: [...catalog.entries, catalog.entries[0]] }));
  assert.throws(() => generateOpenApi({ ...catalog, entries: [{ ...catalog.entries[0], path: "/internal/example" }] }));
  assert.doesNotMatch(JSON.stringify(spec), /Suplait\/ruka_v3|controller|sourceRevision|localhost|tenant_selector/);
});
