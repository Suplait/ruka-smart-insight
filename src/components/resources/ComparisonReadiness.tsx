import { useState } from "react";
import { Check, Copy, Download, RotateCcw } from "lucide-react";
import comparisons from "@/content/comparisons.json";
import { comparisonDecisions } from "@/content/comparisonDecisions";

type Guide = typeof comparisons[number];
const control = "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#cbd2df] bg-white px-4 py-2 text-sm font-semibold text-[#424ec0] transition-colors hover:border-[#4f5beb] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";

export function ComparisonReadiness({ guide, priorities }: { guide: Guide; priorities: string[] }) {
  const [checked, setChecked] = useState<number[]>([]);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const brief = comparisonDecisions[guide.brand];
  const text = () => `# Ruka vs. ${guide.brand}: antes de decidir\n\n${brief.question}\n\n## Puntos por revisar\n${guide.migration.map((item, i) => `- [${checked.includes(i) ? "x" : " "}] ${item}`).join("\n")}\n\n## Mis prioridades\n${guide.rows.filter(row => priorities.includes(row.task)).map(row => `### ${row.task}\nRuka: ${row.ruka}\n${guide.brand}: ${row.alternative}\nFuente: ${guide.sources[row.source].url}`).join("\n\n") || "Sin prioridades marcadas."}\n\n## Compra de referencia\n${brief.inspect.map(item => `- ${item}`).join("\n")}\n\n## Notas de mi equipo\n${note.trim() || "Sin notas todavía."}\n\n## Alcance\nRuka: ${guide.rukaFit}\n\n${guide.brand}: ${guide.otherFit}\n\nConservar y conectar: ${guide.coexist}\n\n## Fuentes oficiales de ${guide.brand}\n${guide.sources.map(source => `- ${source.label}: ${source.url}`).join("\n")}\n\nGuía escrita por Ruka; no es una prueba del servicio de ${guide.brand}. Revisión de fuentes: ${guide.reviewedAt}. Marcar un punto solo registra tu revisión; no certifica capacidades.\n\nhttps://www.ruka.ai/comparar/${guide.slug}\n`;
  async function copy() {
    try { await navigator.clipboard.writeText(text()); setStatus("Puedes pegarla y compartirla con tu equipo."); }
    catch { setStatus("No se pudo copiar. Puedes seleccionar el texto en «Ver mi pauta» o descargarla."); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([text()], { type: "text/markdown;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `${guide.slug}-mi-pauta.md`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Pauta preparada para descargar. Incluye tus notas y las fuentes.");
  }
  return <section id="antes-de-cambiar" aria-labelledby="comparison-readiness-title" className="mt-20 scroll-mt-28 border-y border-[#dce2ed] py-10 sm:py-12">
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
      <div><p className="text-sm font-semibold text-[#424ec0]">De la comparación a tu decisión</p><h2 id="comparison-readiness-title" className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Llévate una pauta.<br />No otra lista de dudas.</h2><p className="mt-5 max-w-md leading-7 text-[#505b70]">Marca lo que ya revisaste y anota lo que importa para tu equipo. Puedes copiar o descargar la pauta sin registrarte.</p><p className="mt-5 max-w-md text-sm leading-6 text-[#60687a]">Las marcas y notas se usan solo en esta página: no se envían a Ruka y se borran al salir o recargar. Descárgalas si quieres conservarlas. No incluyas credenciales ni datos de clientes.</p></div>
      <div className="min-w-0"><div className="flex items-center justify-between gap-4"><h3 className="font-semibold">Antes de cambiar o sumar una herramienta</h3><span aria-live="polite" className="shrink-0 text-sm tabular-nums text-[#505b70]">{checked.length} / {guide.migration.length}</span></div><div role="progressbar" aria-label="Puntos que has revisado" aria-valuenow={checked.length} aria-valuemin={0} aria-valuemax={guide.migration.length} className="mt-3 h-1 overflow-hidden rounded bg-[#e5e8f1]"><div className="h-full bg-[#4f5beb] transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${checked.length / guide.migration.length * 100}%` }} /></div>
        <ul className="mt-3 divide-y divide-[#dce2ed]">{guide.migration.map((item, i) => <li key={item}><label className="flex min-h-12 cursor-pointer items-start gap-3 py-4"><input type="checkbox" checked={checked.includes(i)} onChange={() => { setChecked(current => current.includes(i) ? current.filter(value => value !== i) : [...current, i]); setStatus(""); setConfirmReset(false); }} className="mt-1 h-5 w-5 shrink-0 accent-[#4f5beb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary" /><span className="text-sm leading-7 text-[#30394b]">{item}</span></label></li>)}</ul>
        {checked.length === guide.migration.length && <p className="flex items-start gap-2 rounded-lg bg-[#eef0ff] p-3 text-sm leading-6 text-[#424ec0]"><Check size={18} className="mt-0.5 shrink-0" aria-hidden="true" />Pauta revisada. Confirma el alcance con cada proveedor antes de contratar.</p>}
        <label htmlFor="comparison-note" className="mt-6 block text-sm font-semibold">Qué necesitas resolver tú <span className="font-normal text-[#60687a]">(opcional)</span></label><textarea id="comparison-note" value={note} maxLength={600} onChange={event => { setNote(event.target.value); setStatus(""); setConfirmReset(false); }} aria-describedby="comparison-note-help" rows={3} placeholder="Por ejemplo: conservar el ERP y dejar de ingresar compras a mano." className="mt-2 w-full resize-y rounded-lg border border-[#cbd2df] p-3 text-base leading-7 placeholder:text-[#697386] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2" /><p id="comparison-note-help" className="mt-1 text-right text-xs tabular-nums text-[#60687a]">{note.length} / 600 caracteres</p>
        <div className="mt-4 rounded-lg bg-[#f5f6fb] px-4 py-3"><p className="text-sm leading-6 text-[#505b70]">{priorities.length ? `La pauta incluye ${priorities.length} ${priorities.length === 1 ? "prioridad" : "prioridades"} de la comparación: ${priorities.join(", ")}.` : "También puedes incluir las tareas que más te importan."}</p><a href="#comparacion" className="inline-flex min-h-11 items-center rounded text-sm font-semibold text-[#424ec0] focus-visible:outline-2 focus-visible:outline-primary">{priorities.length ? "Revisar mis prioridades" : "Marcar prioridades"}</a></div>
        <div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={copy} className={control}><Copy size={16} aria-hidden="true" />Copiar lista</button><button type="button" onClick={download} className={control}><Download size={16} aria-hidden="true" />Descargar pauta (.md)</button>{(checked.length > 0 || note) && <button type="button" onClick={() => setConfirmReset(true)} className={control}><RotateCcw size={16} aria-hidden="true" />Limpiar revisión y notas</button>}</div>
        {confirmReset && <div className="mt-4 rounded-lg border border-[#dce2ed] p-4"><p className="text-sm leading-6">¿Borrar tu revisión de los tres puntos y tus notas? Las prioridades se conservan.</p><div className="mt-3 flex gap-3"><button type="button" className={control} onClick={() => { setChecked([]); setNote(""); setConfirmReset(false); setStatus("Revisión y notas borradas. Tus prioridades se conservan."); }}>Sí, limpiar</button><button type="button" className={control} onClick={() => setConfirmReset(false)}>Conservar notas</button></div></div>}
        <p role="status" className="mt-3 min-h-6 text-sm leading-6 text-[#505b70]">{status}</p>
        <details className="mt-3"><summary className="cursor-pointer rounded py-3 text-sm font-semibold text-[#424ec0] focus-visible:outline-2 focus-visible:outline-primary">Ver mi pauta antes de compartir</summary><pre className="max-h-80 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#f5f6fb] p-4 font-sans text-sm leading-7 text-[#505b70]">{text()}</pre></details>
      </div>
    </div>
  </section>;
}
