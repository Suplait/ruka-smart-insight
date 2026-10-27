import { useState } from "react";
import { ArrowUpRight, Check, ClipboardCheck, Download, RotateCcw } from "lucide-react";
import { apiCatalog, apiErrorHelp } from "@/content/developerExperience";
import { downloadDeveloperFile } from "@/utils/developerWorkbench";
import { resourceLinkClass } from "./ResourceLayout";

const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";
const checks = [
  { title: "Acceso y empresas confirmados", text: "Probé la clave y los permisos de la operación sobre una cuenta autorizada.", anchor: "primer-request" },
  { title: "Clave fuera del frontend", text: "La credencial está en el servidor; no aparece en código público ni logs.", anchor: "primer-request" },
  { title: "Identidades y unidades resueltas", text: "Definí equivalencias de IDs, precisión decimal y tratamiento de valores null.", anchor: "contrato" },
  { title: "Todas las páginas recorridas", text: "Uso el mecanismo correcto de continuación y guardo el avance después de persistir.", anchor: "contrato" },
  { title: "Errores con una salida definida", text: "Distingo permisos, parámetros, conflictos y fallos transitorios; limito los reintentos.", anchor: "errores" },
  { title: "Webhooks protegidos, si los uso", text: "Verifico firma, persisto antes del 2xx y proceso sin duplicar efectos. Si no uso webhooks, lo marco como revisado sin aplicación.", anchor: "webhooks" },
  { title: "Reconciliación y recuperación probadas", text: "Comprobé qué ocurre con datos atrasados, repetidos y una ejecución interrumpida.", anchor: "contrato" },
  { title: "Resultado contrastado con Ruka", text: "Revisé el resultado en destino contra los documentos de la cuenta autorizada.", anchor: "guias-api" },
];

export function ApiReadiness() {
  const [checked, setChecked] = useState<number[]>([]);
  const [status, setStatus] = useState("");
  const text = () => `# Revisión de integración con Ruka\n\nPauta personal, no validación automática ni certificación de Ruka.\nReferencia: https://www.ruka.ai/desarrolladores\n\n${checks.map((item, i) => `- [${checked.includes(i) ? "x" : " "}] ${item.title}\n  ${item.text}`).join("\n")}\n\n${checked.length} de ${checks.length} puntos marcados por la persona que revisa.\n`;
  async function copy() { try { await navigator.clipboard.writeText(text()); setStatus("Pauta copiada con tus selecciones."); } catch { setStatus("No pudimos copiar. Puedes descargar la pauta."); } }
  function download() { try { downloadDeveloperFile(text(), "ruka-api-pauta-integracion.md", "text/markdown"); setStatus("Pauta descargada con tus selecciones."); } catch { setStatus("No pudimos descargar. Puedes copiar la pauta."); } }
  return <section id="antes-de-produccion" aria-labelledby="readiness-title" className="mt-20 scroll-mt-28 border-y border-[#dce2ed] py-10 lg:grid lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
    <div><ClipboardCheck size={26} strokeWidth={1.6} className="mb-5 text-[#424ec0]" aria-hidden="true" /><h2 id="readiness-title" className="max-w-sm text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Antes de ponerlo a trabajar.</h2><p className="mt-4 max-w-sm text-sm leading-7 text-[#505b70]">Una pauta para llevar a tu equipo. Marca lo que ya revisaste y descarga los pendientes.</p>
      <p className="mt-6 text-3xl font-semibold tabular-nums">{checked.length}<span className="text-base font-normal text-[#60687a]"> / {checks.length} revisados</span></p>
      <progress aria-label="Puntos revisados por ti" value={checked.length} max={checks.length} className="mt-3 block h-1.5 w-full max-w-sm appearance-none overflow-hidden rounded-full border-0 bg-[#e4e8f1] [&::-webkit-progress-bar]:bg-[#e4e8f1] [&::-webkit-progress-value]:bg-[#4f5beb] [&::-moz-progress-bar]:bg-[#4f5beb]" />
      <p className="mt-3 max-w-sm text-xs leading-6 text-[#60687a]">Se conserva solo mientras estás en esta página. Marcar todo no verifica tu implementación ni habilita la API.</p>
      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1"><button type="button" onClick={copy} className={`${resourceLinkClass} text-sm`}>Copiar pauta</button><button type="button" onClick={download} className={`${resourceLinkClass} text-sm`}><Download size={15} aria-hidden="true" />Descargar</button></div><p role="status" className="mt-2 text-xs leading-5 text-[#505b70]">{status}</p>
    </div>
    <div className="mt-6 lg:mt-0"><div className="divide-y divide-[#dce2ed]">{checks.map((item, i) => <div key={item.title} className="flex gap-3 py-4 first:pt-0">
      <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3"><input type="checkbox" checked={checked.includes(i)} onChange={event => { setChecked(old => event.target.checked ? [...old, i] : old.filter(value => value !== i)); setStatus(""); }} className="mt-1 h-5 w-5 shrink-0 accent-[#4f5beb]" /><span><span className="block text-sm font-semibold">{item.title}</span><span className="mt-1 block text-xs leading-6 text-[#60687a]">{item.text}</span></span></label>
      <a href={`#${item.anchor}`} aria-label={`Revisar documentación: ${item.title}`} className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-[#343fad] hover:bg-[#eef0ff] ${focus}`}><ArrowUpRight size={16} aria-hidden="true" /></a>
    </div>)}</div><button type="button" disabled={!checked.length} onClick={() => { setChecked([]); setStatus("Selecciones restablecidas."); }} className={`mt-3 inline-flex min-h-11 items-center gap-2 rounded text-xs font-semibold text-[#343fad] disabled:opacity-50 ${focus}`}><RotateCcw size={14} aria-hidden="true" />Restablecer la pauta</button></div>
  </section>;
}

export function ApiErrorGuide() {
  const [selected, setSelected] = useState("401");
  return <section id="errores" className="mt-20 scroll-mt-28" aria-labelledby="errors-title">
    <h2 id="errors-title" className="text-balance text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Un error. Un siguiente paso claro.</h2><p className="mt-4 max-w-2xl leading-7 text-[#505b70]">El estado HTTP es el comienzo, no el diagnóstico completo. Consulta también el código del cuerpo y la operación que llamaste.</p>
    <div className="mt-7 grid overflow-hidden rounded-2xl border border-[#dce2ed] md:grid-cols-[220px_minmax(0,1fr)]">
      <div className="flex flex-wrap gap-2 bg-[#f7f8fc] p-4 md:flex-col" aria-label="Elegir estado HTTP">{apiErrorHelp.map(([status]) => <button type="button" key={status} aria-pressed={selected === status} aria-controls={`http-help-${status}`} onClick={() => setSelected(status)} className={`flex min-h-11 items-center justify-between gap-4 rounded-lg px-4 font-mono text-sm ${focus} ${selected === status ? "bg-[#171827] text-white" : "text-[#505b70] hover:bg-[#e9edf6]"}`}>HTTP {status}{selected === status && <Check size={14} aria-hidden="true" />}</button>)}</div>
      <div className="min-w-0 p-5 sm:p-8">{apiErrorHelp.map(([status, title, help]) => {
        const examples = apiCatalog.entries.flatMap(op => op.responses.filter(response => String(response.status) === status).map(response => ({ op, response }))).filter(item => typeof item.response.body === "object" && item.response.body && "error" in item.response.body);
        const unique = examples.filter((item, i) => examples.findIndex(other => JSON.stringify(other.response.body) === JSON.stringify(item.response.body)) === i);
        return <article key={status} id={`http-help-${status}`} hidden={selected !== status}><h3 className="text-2xl font-semibold tracking-tight">{title}</h3><p className="mt-3 max-w-2xl text-sm leading-7 text-[#505b70]">{help}</p><h4 className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#60687a]">Códigos del contrato · ejemplos</h4><ul className="mt-3 divide-y divide-[#dce2ed]">{unique.map(({ op, response }, i) => <li key={i} className="flex flex-wrap items-center justify-between gap-2 py-3"><code className="break-all text-xs text-[#343fad]">{String((response.body as { error: string }).error)}</code><a href={`${apiCatalog.reference}#${op.id}`} className={`${resourceLinkClass} text-xs`}>{op.summary}<ArrowUpRight size={14} aria-hidden="true" /></a></li>)}</ul><p className="mt-4 text-xs leading-6 text-[#60687a]">No todos estos códigos corresponden a todas las operaciones. El enlace lleva al contrato de un endpoint que lo documenta.</p></article>;
      })}</div>
    </div>
  </section>;
}
