import { useState } from "react";
import { ChevronDown, ArrowUp } from "lucide-react";
import comparisons from "@/content/comparisons.json";

type Guide = typeof comparisons[number];
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";

export function ComparisonQuestions({ guide }: { guide: Guide }) {
  const [open, setOpen] = useState<number[]>([]);
  return <section id="preguntas" className="mt-16 scroll-mt-28" aria-labelledby="comparison-questions-title">
    <div className="mb-6 flex flex-wrap items-end justify-between gap-5"><div><h2 id="comparison-questions-title" className="max-w-2xl text-balance text-3xl font-semibold tracking-[-0.03em]">Preguntas sobre Ruka y {guide.brand}</h2><p className="mt-3 text-sm leading-7 text-[#505b70]">Alcance, convivencia y decisión de compra.</p></div><button type="button" onClick={() => setOpen(open.length === guide.faqs.length ? [] : guide.faqs.map((_, i) => i))} className={`min-h-11 rounded text-sm font-semibold text-[#424ec0] ${focus}`}>{open.length === guide.faqs.length ? "Cerrar respuestas" : "Ver todas las respuestas"}</button></div>
    <div className="border-t border-[#dce2ed]">{guide.faqs.map((faq, i) => <details key={faq.question} id={`pregunta-${i + 1}`} open={open.includes(i)} onToggle={event => { const expanded = event.currentTarget.open; setOpen(current => expanded ? current.includes(i) ? current : [...current, i] : current.includes(i) ? current.filter(value => value !== i) : current); }} className="group scroll-mt-28 border-b border-[#dce2ed]"><summary className={`flex min-h-16 cursor-pointer list-none items-center gap-4 rounded py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden ${focus}`}><span className="font-mono text-xs font-normal text-[#60687a]">0{i + 1}</span><span className="flex-1">{faq.question}</span><ChevronDown size={20} aria-hidden="true" className="shrink-0 transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none" /></summary><div className="max-w-3xl pb-6 sm:pl-8"><p className="leading-8 text-[#505b70]">{faq.answer}</p><a href="#fuentes" className={`mt-2 inline-flex min-h-11 items-center rounded text-sm font-semibold text-[#424ec0] ${focus}`}>Fuentes y alcance de la comparación</a></div></details>)}</div>
    <a href="#contenido" className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded text-sm text-[#505b70] ${focus}`}><ArrowUp size={16} aria-hidden="true" />Volver al resumen</a>
  </section>;
}
