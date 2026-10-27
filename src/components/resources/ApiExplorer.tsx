import { useState } from "react";
import { ArrowUpRight, ChevronDown, Download, LockKeyhole, Search } from "lucide-react";
import { apiCatalog, requestExample, type ApiLanguage, type ApiOperation } from "@/content/developerExperience";
import { downloadDeveloperFile, operationGroup, requestIssues } from "@/utils/developerWorkbench";
import { ApiRequestEditor, ApiSampleFields } from "./ApiRequestEditor";
import { CodeExample } from "./CodeExample";
import { resourceLinkClass } from "./ResourceLayout";

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";
const inputClass = `min-h-12 w-full min-w-0 rounded-lg border border-[#b9c3d6] bg-white px-3 text-base sm:text-sm ${focus}`;
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function ParameterRows({ fields }: { fields: ApiOperation["parameters"] }) {
  return <dl className="mt-3 divide-y divide-[#dce2ed]">{fields.map(field => <div key={field.name} className="py-4">
    <dt className="flex flex-wrap items-center gap-2"><code className="break-all text-sm font-semibold text-[#343fad]">{field.name}</code><span className="rounded bg-[#f1f3f8] px-2 py-1 font-mono text-[11px] text-[#505b70]">{field.type}</span><span className="text-xs text-[#60687a]">{field.location} · {field.required ? "obligatorio" : "opcional"}</span></dt>
    <dd className="mt-2 text-sm leading-6 text-[#505b70]">{field.description}
      {field.default !== null && <p className="mt-2 text-xs">Por defecto: <code className="break-all">{JSON.stringify(field.default)}</code></p>}
      {field.values && <p className="mt-2 text-xs">Admite: <code className="break-all">{field.values.join(" · ")}</code></p>}
      <p className="mt-2 text-xs">Ejemplo: <code className="break-all">{JSON.stringify(field.example)}</code></p>
    </dd>
  </div>)}</dl>;
}

function OperationDetail({ operation }: { operation: ApiOperation }) {
  const [language, setLanguage] = useState<ApiLanguage>("curl");
  const [responseIndex, setResponseIndex] = useState(0);
  const [panel, setPanel] = useState<"request" | "parameters" | "responses">("request");
  const [values, setValues] = useState<Record<string, string>>({});
  const [parameterSearch, setParameterSearch] = useState("");
  const [downloadStatus, setDownloadStatus] = useState("");
  const response = operation.responses[responseIndex];
  const issues = requestIssues(operation, values);
  const invalid = Object.keys(issues).length > 0;
  const code = requestExample(operation, language, values);
  const required = operation.parameters.filter(field => field.required);
  const optional = operation.parameters.filter(field => !field.required);
  const matching = operation.parameters.filter(field => normalize(`${field.name} ${field.description}`).includes(normalize(parameterSearch.trim())));
  const mutation = operation.method !== "GET";
  function download() {
    try { downloadDeveloperFile(code, `ruka-${operation.id}.${language === "curl" ? "sh" : "mjs"}`); setDownloadStatus("Ejemplo descargado. Revísalo antes de ejecutarlo en tu servidor."); }
    catch { setDownloadStatus("No pudimos descargar. Puedes copiar el código."); }
  }
  return <div id="operation-detail" className="min-w-0 p-5 sm:p-8" aria-labelledby="operation-title">
    <div className="flex flex-wrap items-center gap-3 text-xs"><span className={`rounded px-2 py-1 font-mono font-semibold ${mutation ? "bg-[#fff1e1] text-[#864918]" : "bg-[#e9f5ef] text-[#236047]"}`}>{operation.method}</span><span className="text-[#60687a]">{mutation ? "Modifica configuración" : "Solo lectura"}</span></div>
    <h3 id="operation-title" className="mt-4 text-2xl font-semibold tracking-tight">{operation.summary}</h3>
    <code className="mt-3 block break-all text-sm text-[#343fad]">{operation.path}</code>
    <p className="mt-4 max-w-2xl text-sm leading-7 text-[#505b70]">{operation.description}</p>
    <p className="mt-3 flex items-start gap-2 text-xs leading-6 text-[#505b70]"><LockKeyhole size={14} className="mt-1 shrink-0" aria-hidden="true" /><span><strong className="font-semibold text-[#30394b]">Permiso:</strong> {operation.permission}.</span></p>
    {mutation && <p className="mt-4 rounded-lg border-l-2 border-[#bb7634] bg-[#fff8ef] p-4 text-sm leading-6 text-[#71441d]">Esta operación cambia la configuración de webhooks. Aquí solo se muestra el ejemplo. {operation.method === "DELETE" ? "Ejecutarlo da de baja el webhook y cancela pendientes; la baja no se puede deshacer." : "Ejecútalo únicamente sobre una cuenta y un destino autorizados."}</p>}
    <div className="my-5 grid grid-cols-3 gap-2 border-b border-[#dce2ed] sm:flex sm:gap-x-5" aria-label="Detalle de la operación">{([['request', 'Petición'], ['parameters', `Parámetros (${operation.parameters.length})`], ['responses', `Respuestas (${operation.responses.length})`]] as const).map(([value, label]) => <button key={value} type="button" aria-label={label} aria-pressed={panel === value} aria-controls={`api-panel-${value}`} onClick={() => setPanel(value)} className={`min-h-14 min-w-0 rounded px-1 text-xs sm:min-h-12 sm:text-sm ${focus} ${panel === value ? "font-semibold text-[#343fad] underline decoration-2 underline-offset-4 sm:underline-offset-8" : "text-[#505b70] hover:text-[#343fad]"}`}>{label.split(" (")[0]}{value !== "request" && <span className="mt-1 block text-[11px] no-underline sm:ml-1 sm:mt-0 sm:inline sm:text-sm">({value === "parameters" ? operation.parameters.length : operation.responses.length})</span>}</button>)}</div>
    <div id="api-panel-request" hidden={panel !== "request"}>
      <ApiRequestEditor operation={operation} values={values} issues={issues} onChange={(name, value) => { setValues(old => ({ ...old, [name]: value })); setDownloadStatus(""); }} onReset={() => { setValues({}); setDownloadStatus(""); }} />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h4 className="text-sm font-semibold">{Object.keys(values).length ? "Tu petición de ejemplo" : "Petición de ejemplo"}</h4><div className="flex gap-1" aria-label="Lenguaje del ejemplo">{([['curl', 'cURL'], ['node', 'Node.js']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={language === value} onClick={() => { setLanguage(value); setDownloadStatus(""); }} className={`min-h-11 rounded-lg px-4 text-sm font-medium ${focus} ${language === value ? "bg-[#e9ecff] text-[#343fad]" : "text-[#505b70] hover:bg-[#f5f6fb]"}`}>{label}</button>)}</div></div>
      {invalid ? <p role="status" className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm leading-6 text-red-800">Revisa los campos marcados arriba. El ejemplo y su descarga estarán disponibles cuando los valores sean válidos.</p> : <div className="[&_pre]:max-h-96"><CodeExample label={`${operation.method} ${operation.path} · ${language === "curl" ? "cURL" : "Node.js"}`} code={code} /></div>}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2"><p className="max-w-md text-xs leading-6 text-[#60687a]">No se ejecuta desde esta página. RUKA_API_KEY es una variable de tu servidor, nunca del navegador.</p><button type="button" disabled={invalid} onClick={download} className={`inline-flex min-h-11 items-center gap-2 rounded text-xs font-semibold text-[#343fad] hover:underline disabled:cursor-not-allowed disabled:opacity-50 ${focus}`}><Download size={15} aria-hidden="true" />Descargar ejemplo</button></div>
      <p role="status" className="text-xs leading-6 text-[#505b70]">{downloadStatus}</p>
    </div>
    <div id="api-panel-parameters" hidden={panel !== "parameters"}>
      {!!operation.parameters.length && <div className="mb-4"><label htmlFor="api-parameter-search" className="mb-2 block text-sm font-semibold">Buscar un parámetro</label><input id="api-parameter-search" value={parameterSearch} onChange={event => setParameterSearch(event.target.value)} placeholder="Ej. fecha, company_id, reviewed" type="search" className={inputClass} /></div>}
      {parameterSearch.trim() ? <><p role="status" className="text-xs text-[#60687a]">{matching.length} parámetros encontrados</p><ParameterRows fields={matching} />{!matching.length && <button type="button" onClick={() => setParameterSearch("")} className={`${resourceLinkClass} text-sm`}>Limpiar búsqueda de parámetros</button>}</> : <>
        <h4 className="font-semibold">Parámetros obligatorios</h4>
        {operation.method === "PATCH" && <p className="mt-2 text-sm leading-6 text-[#505b70]">Además del ID, envía al menos un campo modificable. El ejemplo reemplaza la lista de eventos por invoice.reviewed.</p>}
        {required.length ? <ParameterRows fields={required} /> : <p className="mt-2 text-sm leading-6 text-[#505b70]">No requiere parámetros adicionales a la autenticación.</p>}
        {optional.length > 0 && <details className="group mt-4 border-t border-[#dce2ed]"><summary className={`flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded text-sm font-semibold text-[#343fad] [&::-webkit-details-marker]:hidden ${focus}`}>Ver {optional.length} parámetros opcionales<ChevronDown size={17} aria-hidden="true" /></summary><ParameterRows fields={optional} /></details>}
      </>}
    </div>
    <div id="api-panel-responses" hidden={panel !== "responses"}>
      <label htmlFor="api-response-example" className="block font-semibold">Respuesta de ejemplo</label>
      <select id="api-response-example" value={responseIndex} onChange={event => setResponseIndex(Number(event.target.value))} className={`${inputClass} mb-4 mt-3`}>{operation.responses.map((item, index) => <option key={index} value={index}>HTTP {item.status} · {item.label}</option>)}</select>
      <p className={`mb-3 border-l-2 pl-3 text-xs leading-6 ${response.status < 300 ? "border-[#438366] text-[#236047]" : "border-[#bb7634] text-[#71441d]"}`}>{response.status === 204 ? "Sin contenido. No intentes leer JSON en una respuesta 204." : response.status < 300 ? "Respuesta de éxito del ejemplo. No acredita una conexión real." : "Respuesta de error del ejemplo. Lee el código del cuerpo, además del estado HTTP."}</p>
      <div className="[&_pre]:max-h-80"><CodeExample code={response.status === 204 ? "// HTTP 204: sin contenido." : typeof response.body === "string" ? response.body : JSON.stringify(response.body, null, 2)} label={`Respuesta sintética · HTTP ${response.status}`} /></div>
      <ApiSampleFields body={response.body} />
      <p className="mt-3 text-xs leading-6 text-[#60687a]">Variantes del contrato, no respuestas en vivo ni un esquema exhaustivo. Elegir una respuesta aquí no cambia los parámetros de la petición.</p>
    </div>
    <details className="mt-5 border-t border-[#dce2ed] pt-2"><summary className={`min-h-11 cursor-pointer rounded py-3 text-sm font-semibold text-[#343fad] ${focus}`}>Lo importante de esta operación</summary><ul className="list-disc space-y-3 pl-5 text-sm leading-7 text-[#505b70]">{operation.notes.map(note => <li key={note}>{note}</li>)}</ul></details>
    <a href={`${apiCatalog.reference}#${operation.id}`} className={`${resourceLinkClass} mt-4 text-sm`}>Contrato completo de esta operación <ArrowUpRight size={16} aria-hidden="true" /></a>
  </div>;
}

export function ApiExplorer({ selectedId, onSelect }: { selectedId?: string; onSelect?: (id: string) => void } = {}) {
  const [localId, setLocalId] = useState("v1-purchase-lines");
  const [search, setSearch] = useState("");
  const [group, setGroup] = useState("Todas");
  const operationId = selectedId ?? localId;
  const operation = apiCatalog.entries.find(item => item.id === operationId) ?? apiCatalog.entries[2];
  const filtered = apiCatalog.entries.filter(item => (group === "Todas" || operationGroup(item) === group) && normalize(`${item.method} ${item.summary} ${item.path}`).includes(normalize(search.trim())));
  const select = (id: string) => { setLocalId(id); onSelect?.(id); };
  return <section id="explorar-api" className="mt-20 scroll-mt-28" aria-labelledby="api-explorer-title">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 id="api-explorer-title" className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Del contrato al código.</h2><p className="mt-4 max-w-2xl leading-7 text-[#505b70]">Diez operaciones. Sus permisos, parámetros y respuestas en un solo lugar. Explora sin conectar una cuenta.</p></div><a href="/api/openapi.json" download className={`${resourceLinkClass} text-sm`}><Download size={16} aria-hidden="true" />OpenAPI 3.1</a></div>
    <noscript><p className="mt-4 text-sm leading-7 text-[#505b70]">Activa JavaScript para cambiar de operación. El índice completo de endpoints también enlaza a la referencia de cada uno.</p></noscript>
    <div className="mt-7 overflow-hidden rounded-2xl border border-[#ccd4e4] lg:grid lg:grid-cols-[270px_minmax(0,1fr)]">
      <div className="min-w-0 border-b border-[#dce2ed] bg-[#f7f8fc] p-4 lg:border-b-0 lg:border-r">
        <label htmlFor="api-search" className="mb-2 flex items-center gap-2 text-xs font-semibold text-[#505b70]"><Search size={14} aria-hidden="true" />Buscar operación</label><input id="api-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Nombre, ruta o método" className={inputClass} />
        <label htmlFor="api-group" className="mb-2 mt-4 block text-xs font-semibold text-[#505b70]">Familia</label><select id="api-group" value={group} onChange={event => setGroup(event.target.value)} className={inputClass}>{["Todas", "Acceso", "Compras", "Webhooks"].map(item => <option key={item}>{item}</option>)}</select>
        <p role="status" className="my-4 text-xs text-[#60687a]">{filtered.length} de {apiCatalog.entries.length} operaciones</p>
        {!filtered.length && <div className="py-3"><p className="text-sm leading-6 text-[#505b70]">No hay coincidencias. La operación abierta sigue disponible.</p><button type="button" onClick={() => { setSearch(""); setGroup("Todas"); }} className={`${resourceLinkClass} mt-3 text-sm`}>Limpiar filtros</button></div>}
        <label htmlFor="api-operation" className="mb-2 block text-sm font-semibold lg:hidden">Operación</label>
        <select id="api-operation" value={operationId} onChange={event => select(event.target.value)} className={`${inputClass} lg:hidden`}>{!filtered.some(item => item.id === operationId) && <option value={operationId}>{operation.method} · {operation.summary} (abierta)</option>}{filtered.map(item => <option key={item.id} value={item.id}>{item.method} · {item.summary}</option>)}</select>
        <div className="hidden space-y-1 lg:block" aria-label="Operaciones de la API">{filtered.map(item => <button type="button" key={item.id} onClick={() => select(item.id)} aria-pressed={operationId === item.id} aria-controls="operation-detail" className={`flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors duration-150 motion-reduce:transition-none ${focus} ${operationId === item.id ? "bg-[#171827] text-white" : "text-[#505b70] hover:bg-[#e9edf6]"}`}><span className="mt-0.5 w-10 shrink-0 font-mono text-[10px] font-semibold">{item.method}</span><span className="text-sm font-medium leading-5">{item.summary}</span></button>)}</div>
        <p className="mt-5 border-t border-[#dce2ed] pt-4 text-xs leading-6 text-[#60687a]">{operationGroup(operation)} · {operation.summary}<br />Operación abierta; los filtros no la modifican.</p>
      </div>
      <OperationDetail key={operationId} operation={operation} />
    </div>
    <details className="group mt-4"><summary className={`flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded text-sm font-semibold text-[#343fad] [&::-webkit-details-marker]:hidden ${focus}`}>Índice completo de endpoints<ChevronDown size={18} aria-hidden="true" /></summary><div className="mt-3 grid gap-x-8 gap-y-5 sm:grid-cols-2">{apiCatalog.entries.map(item => <div key={item.id}><a href={`${apiCatalog.reference}#${item.id}`} className={`${resourceLinkClass} max-w-full text-sm`}><code className="break-all">{item.method} {item.path}</code><ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /></a><p className="mt-1 text-sm leading-6 text-[#505b70]">{item.description}</p></div>)}</div></details>
  </section>;
}
