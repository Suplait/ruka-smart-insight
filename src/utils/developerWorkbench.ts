import type { ApiOperation } from "@/content/developerExperience";

export function editableParameters(operation: ApiOperation) {
  return operation.method === "GET" ? operation.parameters.filter(field => field.location !== "body" && (field.required || ["page", "per_page"].includes(field.name))) : [];
}

/** Local documentation checks, not a replacement for API authorization or validation. */
export function requestIssues(operation: ApiOperation, values: Record<string, string>) {
  const issues: Record<string, string> = {};
  const fields = editableParameters(operation);
  for (const field of fields) {
    const value = values[field.name] ?? String(field.example);
    if (!value.trim()) issues[field.name] = "Completa este valor para generar el ejemplo.";
    else if (field.type === "integer" && (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1)) issues[field.name] = "Usa un entero positivo.";
    else if (field.name === "per_page" && Number(value) > 100) issues[field.name] = "En este ejemplo, elige de 1 a 100 registros.";
    else if (field.type === "date" && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) issues[field.name] = "Usa una fecha válida (AAAA-MM-DD).";
  }
  const startField = fields.find(field => ["issued_from", "start_date"].includes(field.name));
  const endField = fields.find(field => ["issued_to", "end_date"].includes(field.name));
  if (startField && endField && !issues[startField.name] && !issues[endField.name]) {
    const start = values[startField.name] ?? String(startField.example);
    const end = values[endField.name] ?? String(endField.example);
    if (end < start) issues[endField.name] = "La fecha final no puede ser anterior al inicio.";
    else if (startField.name === "issued_from" && (Date.parse(end) - Date.parse(start)) / 86400000 > 31) issues[endField.name] = "La diferencia entre fechas no puede superar 31 días.";
    else if (startField.name === "start_date") {
      const date = new Date(start);
      const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1));
      const lastDay = new Date(Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0)).getUTCDate();
      next.setUTCDate(Math.min(date.getUTCDate(), lastDay));
      if (Date.parse(end) >= next.getTime()) issues[endField.name] = "El final debe ser anterior al mismo día del mes siguiente (ajustado al último día si no existe).";
    }
  }
  return issues;
}

export function operationGroup(operation: ApiOperation) {
  return operation.id.includes("webhooks") ? "Webhooks" : operation.id === "v1-ping" ? "Acceso" : "Compras";
}

export function downloadDeveloperFile(text: string, name: string, type = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type: `${type};charset=utf-8` }));
  const link = document.createElement("a");
  link.href = url; link.download = name; link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
