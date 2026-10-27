import { useState } from "react";
import { ArrowDown, RotateCcw } from "lucide-react";
import comparisons from "@/content/comparisons.json";

type Guide = typeof comparisons[number];
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";

export function ComparisonTasks({ guide }: { guide: Guide }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <section id="comparacion" className="mt-20 scroll-mt-28 sm:mt-24" aria-labelledby="comparison-tasks-title">
      <div className="grid gap-5 lg:grid-cols-[1fr_0.75fr] lg:items-end lg:gap-16">
        <div>
          <p className="text-sm font-semibold text-[#424ec0]">Compara el trabajo, no solo el nombre de la función</p>
          <h2 id="comparison-tasks-title" className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">¿Qué necesitas resolver?</h2>
        </div>
        <p className="max-w-xl leading-7 text-[#505b70]">Lee la comparación completa o elige una tarea. En cada una distinguimos el alcance de Ruka y lo que {guide.brand} publica sobre su solución.</p>
      </div>
      <div className="mt-7 flex flex-wrap gap-2" aria-label="Elegir una tarea para comparar">
        {[null, ...guide.rows.map(row => row.task)].map(task => (
          <button key={task ?? "all"} type="button" aria-pressed={selected === task} aria-controls="comparison-task-results" onClick={() => setSelected(task)} className={`min-h-11 rounded-full border px-4 py-2 text-left text-sm font-medium transition-colors motion-reduce:transition-none ${focus} ${selected === task ? "border-[#171827] bg-[#171827] text-white" : "border-[#dce2ed] bg-white text-[#505b70] hover:border-[#717b91]"}`}>
            {task ?? "Todas las tareas"}
          </button>
        ))}
      </div>
      <p aria-live="polite" aria-atomic="true" className="mt-4 text-sm text-[#60687a]">{selected ? `Mostrando: ${selected}.` : `Las ${guide.rows.length} tareas, con su alcance y respaldo.`}</p>
      <div className="mt-8 overflow-hidden rounded-xl border border-[#dce2ed]" id="comparison-task-results">
        <div className="hidden grid-cols-[0.7fr_1.3fr_1.3fr] gap-6 bg-[#f6f7fb] px-6 py-5 md:grid">
          <span className="text-sm font-medium text-[#60687a]">Alcance por tarea</span>
          <span className="text-xl font-semibold text-[#424ec0]">Ruka</span>
          <span className="text-xl font-semibold">{guide.brand}</span>
        </div>
        {guide.rows.map((row, index) => (
          <div key={row.task} hidden={selected !== null && selected !== row.task}>
            <article className="grid gap-5 border-t border-[#dce2ed] p-5 sm:p-6 md:grid-cols-[0.7fr_1.3fr_1.3fr] md:gap-6">
              <div><span className="text-xs font-medium tabular-nums text-[#60687a]">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-2 text-lg font-semibold leading-7">{row.task}</h3></div>
              <div className="rounded-lg bg-[#f4f5ff] p-4 md:bg-transparent md:p-0">
                <p className="mb-2 text-sm font-semibold text-[#424ec0] md:hidden">Ruka</p>
                <p className="text-base leading-7 text-[#30394b]">{row.ruka}</p>
              </div>
              <div className="px-4 md:px-0">
                <p className="mb-2 text-sm font-semibold md:hidden">{guide.brand}</p>
                <p className="text-base leading-7 text-[#505b70]">{row.alternative}</p>
                <a href={`#fuente-${row.source + 1}`} aria-label={`Fuente sobre ${row.task}: ${guide.sources[row.source].label}`} className={`mt-2 inline-flex min-h-11 items-center gap-2 rounded text-sm font-medium text-[#424ec0] underline underline-offset-4 ${focus}`}>Ver respaldo <span className="text-xs">[{row.source + 1}]</span><ArrowDown size={14} aria-hidden="true" /></a>
              </div>
            </article>
          </div>
        ))}
      </div>
      {selected && <button type="button" onClick={() => setSelected(null)} className={`mt-3 inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-[#424ec0] ${focus}`}><RotateCcw size={16} aria-hidden="true" /> Volver a la comparación completa</button>}
    </section>
  );
}
