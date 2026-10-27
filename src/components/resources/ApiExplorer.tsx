import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { apiCatalog, requestExample, type ApiLanguage, type ApiOperation } from "@/content/developerExperience";
import { CodeExample } from "./CodeExample";
import { resourceLinkClass } from "./ResourceLayout";

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";

function OperationDetail({ operation }: { operation: ApiOperation }) {
  const [language, setLanguage] = useState<ApiLanguage>("curl");
  const [responseIndex, setResponseIndex] = useState(0);
  const [panel, setPanel] = useState<"request" | "parameters" | "responses">("request");
  const response = operation.responses[responseIndex];
  const required = operation.parameters.filter(field => field.required);
  const optional = operation.parameters.filter(field => !field.required);
  return <div id="operation-detail" className="min-w-0 p-5 sm:p-8" aria-labelledby="operation-title">
    <div className="flex flex-wrap items-center gap-3 text-sm"><span className="rounded bg-[#e9ecff] px-2 py-1 font-mono font-semibold text-[#424ec0]">{operation.method}</span><code className="break-all text-[#505b70]">{operation.path}</code></div>
    <h3 id="operation-title" className="mt-5 text-2xl font-semibold tracking-tight">{operation.summary}</h3>
    <p className="mt-3 max-w-2xl leading-7 text-[#505b70]">{operation.description}</p>
    <p className="mt-3 text-sm leading-6 text-[#505b70]"><strong className="font-semibold text-[#30394b]">Permiso:</strong> {operation.permission}.</p>
    {operation.method !== "GET" && <p className="mt-4 rounded-lg bg-[#f0f2fc] p-4 text-sm leading-6 text-[#30394b]">Esta operación cambia la configuración de webhooks. Aquí solo se muestra el ejemplo. {operation.method === "DELETE" ? "Ejecutarlo da de baja el webhook y cancela pendientes; la baja no se puede deshacer." : "Ejecútalo únicamente sobre una cuenta y un destino autorizados."}</p>}
    <div className="my-5 flex flex-wrap gap-x-5 border-y border-[#dce2ed] py-1" aria-label="Detalle de la operación">{([['request', 'Petición'], ['parameters', `Parámetros (${operation.parameters.length})`], ['responses', `Respuestas (${operation.responses.length})`]] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={panel === value} aria-controls={`api-panel-${value}`} onClick={() => setPanel(value)} className={`min-h-11 rounded px-1 text-sm ${focus} ${panel === value ? "font-semibold text-[#424ec0] underline decoration-2 underline-offset-8" : "text-[#505b70] hover:text-[#424ec0]"}`}>{label}</button>)}</div>
    <div id="api-panel-request" hidden={panel !== "request"}>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h4 className="font-semibold">Petición de ejemplo</h4><div className="flex gap-1" aria-label="Lenguaje del ejemplo">{([['curl', 'cURL'], ['node', 'Node.js']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={language === value} onClick={() => setLanguage(value)} className={`min-h-11 rounded-lg px-4 text-sm font-medium ${focus} ${language === value ? "bg-[#e9ecff] text-[#424ec0]" : "text-[#505b70] hover:bg-[#f5f6fb]"}`}>{label}</button>)}</div></div>
    <div className="[&_pre]:max-h-80"><CodeExample label={`${operation.method} ${operation.path} · ${language === "curl" ? "cURL" : "Node.js"}`} code={requestExample(operation, language)} /></div>
    <p className="mt-3 text-xs leading-6 text-[#60687a]">No se ejecuta desde esta página. Sustituye las fechas e identidades de ejemplo en tu entorno. RUKA_API_KEY es una variable del servidor.</p>
    </div>
    <div id="api-panel-parameters" hidden={panel !== "parameters"}>
      <h4 className="font-semibold">Parámetros obligatorios</h4>
      {operation.method === "PATCH" && <p className="mt-2 text-sm leading-6 text-[#505b70]">Además del ID, envía al menos un campo modificable. El ejemplo reemplaza la lista de eventos por invoice.reviewed.</p>}
      {required.length ? <dl className="mt-3 grid gap-4 sm:grid-cols-2">{required.map(field => <div key={field.name} className="min-w-0"><dt className="break-all font-mono text-sm font-medium text-[#424ec0]">{field.name} <span className="font-sans font-normal text-[#60687a]">({field.location})</span></dt><dd className="mt-1 text-sm leading-6 text-[#505b70]">{field.description}</dd></div>)}</dl> : <p className="mt-2 text-sm leading-6 text-[#505b70]">{operation.method === "PATCH" ? "Envía al menos un campo modificable, además del ID de la ruta." : "No requiere parámetros adicionales a la autenticación."}</p>}
      {optional.length > 0 && <details className="group mt-4"><summary className={`flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded text-sm font-semibold text-[#424ec0] [&::-webkit-details-marker]:hidden ${focus}`}>Ver {optional.length} parámetros opcionales<ChevronDown size={17} aria-hidden="true" /></summary><dl className="mt-4 grid gap-5 sm:grid-cols-2">{optional.map(field => <div key={field.name} className="min-w-0"><dt className="break-all font-mono text-sm font-medium">{field.name}</dt><dd className="mt-1 text-sm leading-6 text-[#505b70]">{field.description}</dd></div>)}</dl></details>}
    </div>
    <div id="api-panel-responses" hidden={panel !== "responses"}>
      <label htmlFor="api-response-example" className="block font-semibold">Respuesta de ejemplo</label>
      <select id="api-response-example" value={responseIndex} onChange={event => setResponseIndex(Number(event.target.value))} className={`mb-4 mt-3 min-h-12 w-full min-w-0 rounded-lg border border-[#cbd2df] bg-white px-3 text-sm ${focus}`}>{operation.responses.map((item, index) => <option key={index} value={index}>HTTP {item.status} · {item.label}</option>)}</select>
      <div className="[&_pre]:max-h-80"><CodeExample code={response.status === 204 ? "// HTTP 204: sin contenido." : typeof response.body === "string" ? response.body : JSON.stringify(response.body, null, 2)} label={`Respuesta sintética · HTTP ${response.status}`} /></div>
      <p className="mt-3 text-xs leading-6 text-[#60687a]">Variantes del contrato, no respuestas en vivo ni un esquema exhaustivo. Elegir una respuesta aquí no cambia los parámetros de la petición de arriba.</p>
    </div>
    <a href={`${apiCatalog.reference}#${operation.id}`} className={`${resourceLinkClass} mt-5 text-sm`}>Contrato completo de esta operación <ArrowUpRight size={16} aria-hidden="true" /></a>
  </div>;
}

export function ApiExplorer() {
  const [operationId, setOperationId] = useState("v1-purchase-lines");
  const operation = apiCatalog.entries.find(item => item.id === operationId)!;
  return <section id="explorar-api" className="mt-16 scroll-mt-28" aria-labelledby="api-explorer-title">
    <h2 id="api-explorer-title" className="text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Encuentra la operación que necesitas.</h2>
    <p className="mt-4 max-w-2xl leading-7 text-[#505b70]">Explora las diez operaciones del contrato público. Cambia de lenguaje, revisa parámetros y compara respuestas sin conectar una cuenta.</p>
    <noscript><p className="mt-4 text-sm leading-7 text-[#505b70]">Activa JavaScript para cambiar de operación. También puedes abrir el índice completo de endpoints al final de este explorador y consultar la referencia de cada uno.</p></noscript>
    <div className="mt-7 overflow-hidden rounded-xl border border-[#dce2ed] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <div className="border-b border-[#dce2ed] bg-[#f7f8fc] p-4 lg:border-b-0 lg:border-r">
        <label htmlFor="api-operation" className="mb-2 block text-sm font-semibold lg:hidden">Operación</label>
        <select id="api-operation" value={operationId} onChange={event => setOperationId(event.target.value)} className={`min-h-12 w-full rounded-lg border border-[#cbd2df] bg-white px-3 text-sm lg:hidden ${focus}`}>{apiCatalog.entries.map(item => <option key={item.id} value={item.id}>{item.method} · {item.summary}</option>)}</select>
        <div className="hidden space-y-1 lg:block" aria-label="Operaciones de la API">{apiCatalog.entries.map(item => <button type="button" key={item.id} onClick={() => setOperationId(item.id)} aria-pressed={operationId === item.id} aria-controls="operation-detail" className={`w-full rounded-lg px-3 py-3 text-left ${focus} ${operationId === item.id ? "bg-[#e8ebff] text-[#303a9d]" : "text-[#505b70] hover:bg-[#eef0f7]"}`}><span className="text-[11px] font-semibold">{item.method}</span><span className="mt-1 block text-sm font-semibold leading-5">{item.summary}</span></button>)}</div>
      </div>
      <OperationDetail key={operationId} operation={operation} />
    </div>
    <details className="group mt-4"><summary className={`flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded text-sm font-semibold text-[#424ec0] [&::-webkit-details-marker]:hidden ${focus}`}>Índice completo de endpoints<ChevronDown size={18} aria-hidden="true" /></summary><div className="mt-3 grid gap-x-8 gap-y-5 sm:grid-cols-2">{apiCatalog.entries.map(item => <div key={item.id}><a href={`${apiCatalog.reference}#${item.id}`} className={`${resourceLinkClass} max-w-full text-sm`}><code className="break-all">{item.method} {item.path}</code><ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /></a><p className="mt-1 text-sm leading-6 text-[#505b70]">{item.description}</p></div>)}</div></details>
  </section>;
}
