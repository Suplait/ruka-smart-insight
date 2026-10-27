import catalog from "../../config/api-public-catalog.json";

export const apiCatalog = catalog;
export type ApiOperation = typeof catalog.entries[number];
export type ApiLanguage = "curl" | "node";

// Examples are built from the same reviewed catalog as OpenAPI. No API is called.
export function requestExample(operation: ApiOperation, language: ApiLanguage, overrides: Record<string, string> = {}) {
  let path = operation.path;
  for (const field of operation.parameters.filter(field => field.location === "path")) {
    path = path.replace(`:${field.name}`, encodeURIComponent(overrides[field.name] ?? String(field.example)));
  }
  const query = operation.parameters.filter(field => field.location === "query" && (field.required || ["page", "per_page"].includes(field.name))).map(field => ({ ...field, example: overrides[field.name] ?? field.example }));
  const body = Object.fromEntries(operation.parameters.filter(field => field.location === "body" && field.required).map(field => [field.name, field.example]));
  const hasBody = Object.keys(body).length > 0;
  // PATCH has no required individual field, but requires at least one change.
  if (operation.method === "PATCH") body.events = ["invoice.reviewed"];
  const sendsBody = hasBody || operation.method === "PATCH";
  const url = `https://api.rukafactura.cl${path}`;
  if (language === "node") {
    const fullUrl = new URL(url);
    query.forEach(field => fullUrl.searchParams.set(field.name, String(field.example)));
    return `// Node.js: ejecuta en tu servidor, no en el navegador.\nconst token = process.env.RUKA_API_KEY;\nif (!token) throw new Error('Falta RUKA_API_KEY');\n\nconst response = await fetch(\n  ${JSON.stringify(fullUrl.href)},\n  {\n    method: '${operation.method}',\n    redirect: 'error',\n    signal: AbortSignal.timeout(15000),\n    headers: {\n      Authorization: \`Bearer \${token}\`,${sendsBody ? "\n      'Content-Type': 'application/json'," : ""}\n    },${sendsBody ? `\n    body: JSON.stringify(${JSON.stringify(body, null, 2).replace(/\n/g, "\n    ")}),` : ""}\n  },\n);\n\nif (!response.ok) {\n  throw new Error(\`Ruka respondió HTTP \${response.status}\`);\n}\n${operation.method === "DELETE" ? "// HTTP 204: no hay cuerpo JSON que leer." : "const data = await response.json();\n// Procesa data en tu servidor; evita registrar datos sensibles."}`;
  }
  const quote = (value: string) => `'${value.replace(/'/g, "'\\''")}'`;
  const lines = ["curl --fail-with-body --max-time 15", ...(operation.method === "GET" && query.length ? ["  --get"] : operation.method !== "GET" ? [`  --request ${operation.method}`] : []), `  ${quote(url)}`, '  --header "Authorization: Bearer $RUKA_API_KEY"', ...query.map(field => `  --data-urlencode ${quote(`${field.name}=${String(field.example)}`)}`)];
  if (sendsBody) lines.push("  --header 'Content-Type: application/json'", `  --data ${quote(JSON.stringify(body, null, 2))}`);
  return lines.join(" \\\n");
}

export const developerFaqs = [
  { question: "¿Qué puedo consultar con la API de Ruka?", answer: "El contrato público incluye facturas y líneas de compra, clasificaciones de productos, un libro de compras con revisión interna, documentos en JSON, XML o PDF y administración de webhooks. El acceso depende de la cuenta, sus permisos y las empresas autorizadas." },
  { question: "¿Dónde obtengo la clave y dónde debo guardarla?", answer: "Accede a la documentación con tu cuenta para revisar la habilitación y las credenciales disponibles. Usa Authorization: Bearer y guarda la clave en el servidor, fuera del código público y del navegador. Comprobar /api/v1/ping valida la clave, no concede permisos de reportes." },
  { question: "¿Puedo probar aquí con una clave real?", answer: "No. Este explorador muestra ejemplos del contrato y no envía peticiones. No solicita credenciales ni es una sandbox. Los ejemplos de respuesta son sintéticos; la validación con datos autorizados se hace desde tu entorno." },
  { question: "¿La API registra automáticamente compras en mi ERP?", answer: "La API permite consultar datos. Tu integración debe mapear identidades, decidir cómo persistir cada documento y reconciliar el resultado. No escribe automáticamente en un ERP externo. Si necesitas implementar el proceso, puedes evaluar su alcance con Ruka One." },
  { question: "¿Los webhooks reemplazan una carga histórica?", answer: "No. Los eventos pueden repetirse o llegar fuera de orden y agregar una suscripción no recupera el pasado. Combina un receptor con firma verificada, persistencia y deduplicación con consultas de reconciliación del histórico." },
  { question: "¿Esta documentación incluye emisión de DTE?", answer: "Esta referencia pública documenta compras y webhooks, no una API de emisión. RukaFactura es otra capacidad de Ruka; no asumas que compartir el dominio de la API habilita emisión de documentos en estos endpoints." },
];

export const apiErrorHelp = [
  ["401", "Revisa la clave", "Puede estar inválida, revocada o fuera del acceso habilitado. En administración de webhooks también importa que sea permanente. No repitas la misma petición indefinidamente."],
  ["403", "Revisa los permisos", "Validar la clave no basta. Los reportes requieren su permiso y los webhooks requieren administración y reportes."],
  ["404", "Revisa identidad y disponibilidad", "El recurso puede no existir en tu alcance. xml_not_available indica que falta el XML; no es una compra con importe cero."],
  ["409", "Resuelve el conflicto", "ambiguous_document requiere identificar la empresa receptora con company_id. webhook_exists indica una URL ya registrada. Lee el código de error de la operación."],
  ["422", "Corrige los parámetros", "Comprueba nombres, fechas, rangos y valores permitidos. Los filtros de purchase_lines y purchase_book no son intercambiables."],
  ["429", "Espacia las solicitudes", "Respeta Retry-After cuando esté presente. Usa espera progresiva y un límite de reintentos; conserva el último lote persistido."],
  ["503", "Conserva el trabajo pendiente", "pdf_unavailable puede indicar un fallo al generar la representación PDF. No adelantes el checkpoint ni des por completo el documento por este fallo."],
] as const;
