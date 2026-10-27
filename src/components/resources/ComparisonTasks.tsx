import { useState } from "react";
import { ArrowDown, ArrowUpRight, Bookmark, Copy, RotateCcw, X } from "lucide-react";
import comparisons from "@/content/comparisons.json";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type Guide = typeof comparisons[number];
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";

export function ComparisonTasks({ guide, priorities, onPrioritiesChange }: { guide: Guide; priorities: string[]; onPrioritiesChange: (priorities: string[]) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const setPriorities = (next: string[] | ((current: string[]) => string[])) => onPrioritiesChange(typeof next === "function" ? next(priorities) : next);
  const [onlyPriorities, setOnlyPriorities] = useState(false);
  const [message, setMessage] = useState("");
  async function copyPriorities() {
    try {
      await navigator.clipboard.writeText(`Mis prioridades: Ruka vs. ${guide.brand}\n\n${guide.rows.filter(row => priorities.includes(row.task)).map(row => `${row.task}\nRuka: ${row.ruka}\n${guide.brand}: ${row.alternative}\nFuente: ${guide.sources[row.source].url}`).join("\n\n")}\n\nComparativa editorial de Ruka, no prueba del servicio del competidor.\nhttps://www.ruka.ai/comparar/${guide.slug}`);
      setMessage("Prioridades copiadas con el alcance de ambos y sus fuentes.");
    } catch { setMessage("No se pudo copiar. Puedes seleccionar los textos de tus prioridades aquí mismo."); }
  }
  return (
    <section id="comparacion" className="mt-20 scroll-mt-28 sm:mt-24" aria-labelledby="comparison-tasks-title">
      <div className="max-w-3xl">
        <div>
          <h2 id="comparison-tasks-title" className="text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">¿Qué necesitas resolver?</h2>
        </div>
        <p className="mt-4 max-w-2xl leading-7 text-[#505b70]">El mismo nombre puede esconder trabajos distintos. Compara el alcance, marca lo que te importa y llévate esas prioridades con sus fuentes.</p>
      </div>
      <div className="mt-7 sm:hidden"><label htmlFor="comparison-task-mobile" className="mb-2 block text-sm font-semibold">Mostrar una tarea</label><select id="comparison-task-mobile" value={selected ?? ""} onChange={event => { setSelected(event.target.value || null); setOnlyPriorities(false); setMessage(""); }} aria-controls="comparison-task-results" className={`min-h-12 w-full rounded-lg border border-[#cbd2df] bg-white px-3 text-base ${focus}`}><option value="">Todas las tareas</option>{guide.rows.map(row => <option key={row.task} value={row.task}>{row.task}</option>)}</select></div>
      <div className="mt-7 hidden flex-wrap gap-2 sm:flex" aria-label="Elegir una tarea para comparar">
        {[null, ...guide.rows.map(row => row.task)].map(task => (
          <button key={task ?? "all"} type="button" aria-pressed={selected === task && !onlyPriorities} aria-controls="comparison-task-results" onClick={() => { setSelected(task); setOnlyPriorities(false); setMessage(""); }} className={`min-h-11 rounded-full border px-4 py-2 text-left text-sm font-medium transition-colors motion-reduce:transition-none ${focus} ${selected === task && !onlyPriorities ? "border-[#171827] bg-[#171827] text-white" : "border-[#dce2ed] bg-white text-[#505b70] hover:border-[#717b91]"}`}>
            {task ?? "Todas las tareas"}
          </button>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[#dce2ed] py-3"><button type="button" onClick={() => { setOnlyPriorities(value => !value); setSelected(null); }} aria-pressed={onlyPriorities} aria-controls="comparison-task-results" className={`inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-[#424ec0] ${focus}`}><Bookmark size={16} aria-hidden="true" />Mis prioridades ({priorities.length})</button>{priorities.length > 0 && <><button type="button" onClick={copyPriorities} className={`inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-[#424ec0] ${focus}`}><Copy size={16} aria-hidden="true" />Copiar prioridades</button><button type="button" onClick={() => { setPriorities([]); setOnlyPriorities(false); setMessage(""); }} className={`inline-flex min-h-11 items-center gap-2 rounded text-sm text-[#505b70] ${focus}`}><X size={16} aria-hidden="true" />Quitar marcas</button></>}<p className="text-xs leading-5 text-[#60687a]">Marcas temporales, solo en esta página.</p></div>
      <p aria-live="polite" aria-atomic="true" className="mt-4 text-sm text-[#60687a]">{message || (onlyPriorities ? `${priorities.length} tareas marcadas como prioridad.` : selected ? `Mostrando: ${selected}.` : `Las ${guide.rows.length} tareas, con su alcance y respaldo.`)}</p>
      {onlyPriorities && !priorities.length && <div className="mt-5 rounded-xl bg-[#f5f6fb] p-6"><h3 className="font-semibold">Todavía no marcaste una prioridad.</h3><p className="mt-2 text-sm leading-6 text-[#505b70]">Vuelve a las tareas y marca las que tu equipo necesita resolver.</p><button type="button" onClick={() => setOnlyPriorities(false)} className={`mt-3 min-h-11 rounded text-sm font-semibold text-[#424ec0] ${focus}`}>Ver las seis tareas</button></div>}
      <div className="mt-8 overflow-hidden rounded-xl border border-[#dce2ed]" id="comparison-task-results">
        <div className="hidden grid-cols-[0.7fr_1.3fr_1.3fr] gap-6 bg-[#f6f7fb] px-6 py-5 md:grid">
          <span className="text-sm font-medium text-[#60687a]">Alcance por tarea</span>
          <span className="text-xl font-semibold text-[#424ec0]">Ruka</span>
          <span className="text-xl font-semibold">{guide.brand}</span>
        </div>
        {guide.rows.map((row, index) => (
          <div key={row.task} hidden={onlyPriorities ? !priorities.includes(row.task) : selected !== null && selected !== row.task}>
            <article className="grid gap-5 border-t border-[#dce2ed] p-5 sm:p-6 md:grid-cols-[0.7fr_1.3fr_1.3fr] md:gap-6">
              <div><span className="text-xs font-medium tabular-nums text-[#60687a]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-2 text-lg font-semibold leading-7">{row.task}</h3><button type="button" aria-label={`Priorizar ${row.task}`} aria-pressed={priorities.includes(row.task)} onClick={() => { setPriorities(current => current.includes(row.task) ? current.filter(task => task !== row.task) : [...current, row.task]); setMessage(""); }} className={`mt-2 inline-flex min-h-11 items-center gap-2 rounded text-xs font-semibold ${focus} ${priorities.includes(row.task) ? "text-[#424ec0]" : "text-[#60687a]"}`}><Bookmark size={16} fill={priorities.includes(row.task) ? "currentColor" : "none"} aria-hidden="true" />{priorities.includes(row.task) ? "Mi prioridad" : "Priorizar"}</button></div>
              <div className="rounded-lg bg-[#f4f5ff] p-4 md:bg-transparent md:p-0">
                <p className="mb-2 text-sm font-semibold text-[#424ec0] md:hidden">Ruka</p>
                <p className="text-base leading-7 text-[#30394b]">{row.ruka}</p>
              </div>
              <div className="px-4 md:px-0">
                <p className="mb-2 text-sm font-semibold md:hidden">{guide.brand}</p>
                <p className="text-base leading-7 text-[#505b70]">{row.alternative}</p>
                <Dialog><DialogTrigger asChild><button type="button" aria-label={`Fuente sobre ${row.task}: ${guide.sources[row.source].label}`} className={`mt-2 inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-[#424ec0] underline underline-offset-4 ${focus}`}>Ver respaldo <span className="text-xs">[{row.source + 1}]</span><ArrowUpRight size={14} aria-hidden="true" /></button></DialogTrigger><DialogContent className="max-h-[85dvh] w-[calc(100vw_-_2rem)] overflow-y-auto rounded-xl motion-reduce:!animate-none [&>button]:right-1 [&>button]:top-1 [&>button]:flex [&>button]:min-h-11 [&>button]:min-w-11 [&>button]:items-center [&>button]:justify-center"><DialogTitle className="pr-8 leading-7">{guide.sources[row.source].label}</DialogTitle><DialogDescription className="leading-7">Fuente oficial utilizada para comparar «{row.task}». No equivale a una prueba de este servicio ni confirma el alcance de una integración con Ruka.</DialogDescription><p className="text-sm leading-7 text-[#505b70]">{row.alternative}</p><a href={guide.sources[row.source].url} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-12 items-center gap-2 rounded-lg bg-[#eef0ff] px-4 py-3 text-sm font-semibold text-[#424ec0] ${focus}`}>Abrir fuente oficial <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">(abre en otra pestaña)</span></a><p className="break-words text-xs text-[#60687a]">{new URL(guide.sources[row.source].url).hostname}</p></DialogContent></Dialog>
                <a href={`#fuente-${row.source + 1}`} className={`ml-4 inline-flex min-h-11 items-center gap-1 rounded text-xs text-[#505b70] underline underline-offset-4 ${focus}`}>Bibliografía<ArrowDown size={12} aria-hidden="true" /></a>
              </div>
            </article>
          </div>
        ))}
      </div>
      {(selected || onlyPriorities) && <button type="button" onClick={() => { setSelected(null); setOnlyPriorities(false); setMessage(""); }} className={`mt-3 inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-[#424ec0] ${focus}`}><RotateCcw size={16} aria-hidden="true" /> Volver a la comparación completa</button>}
    </section>
  );
}
