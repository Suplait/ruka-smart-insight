import { readFile, writeFile, mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

function schemaFor(field) {
  const types = { date: { type: "string", format: "date" }, "integer[]": { type: "array", items: { type: "integer" } }, "array[string]": { type: "array", items: { type: "string" } } };
  const schema = { ...(types[field.type] ?? { type: field.type }) };
  if (field.name === "authentication") schema.type = ["object", "null"];
  // Boolean aliases are accepted in the query, not JSON string enums.
  if (field.values && field.type !== "boolean") schema.enum = field.values;
  if (field.default !== null && field.default !== undefined) schema.default = field.default;
  return schema;
}

export function generateOpenApi(catalog) {
  const paths = {};
  const ids = new Set();
  for (const entry of catalog.entries) {
    if (!entry.path.startsWith("/api/v1/") || ids.has(entry.id)) throw new Error("Invalid public API catalog");
    ids.add(entry.id);
    const route = entry.path.replace(/:([a-z_]+)/g, "{$1}");
    const parameters = entry.parameters.filter(field => field.location !== "body").map(field => ({
      name: field.name, in: field.location, required: field.required, description: field.description,
      schema: schemaFor(field), example: field.example,
      ...(field.type === "integer[]" ? { style: "form", explode: false } : {}),
    }));
    const bodyFields = entry.parameters.filter(field => field.location === "body");
    const responses = {};
    for (const response of entry.responses) {
      const status = String(response.status);
      responses[status] ??= { description: response.label, ...(status === "204" ? {} : { content: { "application/json": { examples: {} } } }) };
      if (status !== "204") {
        const examples = responses[status].content["application/json"].examples;
        examples[`example${Object.keys(examples).length + 1}`] = { summary: response.label, value: response.body };
      }
    }
    if (entry.id === "v1-purchase-document") {
      responses["200"].content["application/xml"] = { schema: { type: "string" } };
      responses["200"].content["application/pdf"] = { schema: { type: "string", format: "binary" } };
    }
    const operation = {
      operationId: entry.id, summary: entry.summary,
      description: [entry.description, `Permisos: ${entry.permission}.`, ...entry.notes].join("\n\n"),
      externalDocs: { url: `${catalog.reference}#${entry.id}` }, parameters, responses,
      ...(bodyFields.length ? { requestBody: { required: true, content: { "application/json": { schema: {
        type: "object", properties: Object.fromEntries(bodyFields.map(field => [field.name, { ...schemaFor(field), description: field.description, examples: [field.example] }])),
        ...(bodyFields.some(field => field.required) ? { required: bodyFields.filter(field => field.required).map(field => field.name) } : {}),
      } } } } } : {}),
    };
    paths[route] ??= {};
    paths[route][entry.method.toLowerCase()] = operation;
  }
  return {
    openapi: "3.1.0",
    info: { title: "Ruka · API de compras", version: catalog.reviewedAt,
      description: "Referencia de los contratos públicos de la API V1. Ejemplos sintéticos: no son datos de clientes. Las respuestas incluyen ejemplos, no un esquema exhaustivo de todos sus campos. Los webhooks se administran con una clave permanente autorizada; esta referencia no incluye una API de emisión de DTE." },
    servers: [{ url: "https://api.rukafactura.cl" }],
    security: [{ bearerAuth: [] }],
    components: { securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", description: "Clave de la cuenta, conservada en el servidor. No introducirla en un sitio de terceros." } } },
    externalDocs: { url: catalog.reference, description: "Referencia vigente, credenciales y ejemplos" }, paths,
  };
}

export async function buildOpenApi(root = process.cwd()) {
  const catalog = JSON.parse(await readFile(path.join(root, "config/api-public-catalog.json"), "utf8"));
  const target = path.join(root, "public/api");
  await mkdir(target, { recursive: true });
  await writeFile(path.join(target, "openapi.json"), `${JSON.stringify(generateOpenApi(catalog), null, 2)}\n`);
  console.log(`OpenAPI generated from ${catalog.entries.length} public contracts.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await buildOpenApi();
