import type { ApiOperation } from "@/content/developerExperience";
import { editableParameters } from "@/utils/developerWorkbench";
import { RotateCcw } from "lucide-react";

export function ApiRequestEditor({ operation, values, issues, onChange, onReset }: {
  operation: ApiOperation; values: Record<string, string>; issues: Record<string, string>;
  onChange: (name: string, value: string) => void; onReset: () => void;
}) {
  const fields = editableParameters(operation);
  if (!fields.length) return null;
  return <details className="group mb-5 rounded-lg border border-[#dce2ed] bg-[#fafbfe] px-4">
    <summary className="min-h-12 cursor-pointer py-3 text-sm font-semibold text-[#343fad] focus-visible:outline-primary">Ajustar parámetros del ejemplo <span className="ml-1 font-normal text-[#60687a]">· solo local</span></summary>
    <p className="mb-4 max-w-xl text-xs leading-6 text-[#60687a]">Usa datos de ejemplo. No introduzcas claves ni información de clientes. El código se actualiza aquí; ninguna petición se envía.</p>
    <div className="grid gap-4 sm:grid-cols-2">{fields.map(field => <div key={field.name} className="min-w-0">
      <label htmlFor={`request-${field.name}`} className="block break-all font-mono text-xs font-semibold">{field.name} <span className="font-sans font-normal text-[#60687a]">{field.required ? "· obligatorio" : "· opcional"}</span></label>
      <input id={`request-${field.name}`} type={field.type === "date" ? "date" : "text"} inputMode={field.type === "integer" ? "numeric" : undefined} value={values[field.name] ?? String(field.example)} maxLength={100} aria-invalid={!!issues[field.name]} aria-describedby={`help-${field.name}`} onChange={event => onChange(field.name, event.target.value)} className="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-[#b9c3d6] bg-white px-3 text-base outline-none focus:border-[#4f5beb] focus:ring-2 focus:ring-[#4f5beb]/20 aria-[invalid=true]:border-red-700 sm:text-sm" />
      <p id={`help-${field.name}`} className={`mt-1 text-xs leading-5 ${issues[field.name] ? "text-red-800" : "text-[#60687a]"}`}>{issues[field.name] || field.description}</p>
    </div>)}</div>
    <button type="button" onClick={onReset} className="my-3 inline-flex min-h-11 items-center gap-2 rounded text-xs font-semibold text-[#343fad] hover:underline focus-visible:outline-primary"><RotateCcw size={14} aria-hidden="true" />Restablecer valores de ejemplo</button>
  </details>;
}

export function ApiSampleFields({ body }: { body: unknown }) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return null;
  const data = "data" in body ? (body as { data: unknown }).data : body;
  const record = Array.isArray(data) ? data[0] : data;
  if (!record || typeof record !== "object") return null;
  return <details className="mt-4 border-t border-[#dce2ed] pt-2">
    <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-[#343fad] focus-visible:outline-primary">Leer los campos de este ejemplo</summary>
    <p className="mb-3 text-xs leading-6 text-[#60687a]">{Array.isArray(data) ? "Primer registro de data." : "Objeto del ejemplo."} Tipos observados en esta respuesta sintética; no reemplazan el esquema del contrato.</p>
    <dl className="max-h-80 divide-y divide-[#e4e8f1] overflow-y-auto rounded-lg border border-[#dce2ed] px-3">{Object.entries(record).map(([name, value]) => <div key={name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-3 text-xs">
      <dt className="break-all font-mono font-semibold">{name}</dt><dd className="text-[#505b70]">{value === null ? "null · sin valor" : Array.isArray(value) ? `array · ${value.length} elementos` : typeof value === "object" ? "objeto" : typeof value === "string" ? "string · texto" : typeof value === "number" ? "number" : "boolean"}</dd>
    </div>)}</dl>
  </details>;
}
