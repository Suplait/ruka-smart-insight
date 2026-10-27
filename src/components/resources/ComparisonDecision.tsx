import { useState } from "react";
import { ArrowDown, ArrowRight, Check, Layers3 } from "lucide-react";
import { Link } from "react-router-dom";
import comparisons from "@/content/comparisons.json";
import { comparisonDecisions } from "@/content/comparisonDecisions";
import { comparisonExperience } from "@/content/comparisonExperience";

type Guide = typeof comparisons[number];
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";

export function ComparisonSnapshot({ guide }: { guide: Guide }) {
  const brief = comparisonDecisions[guide.brand];
  return <aside aria-label="La diferencia principal" className="overflow-hidden rounded-2xl border border-[#dce2ed] bg-[#fafbfe]">
    <div className="flex items-center justify-between border-b border-[#dce2ed] px-6 py-4 text-sm text-[#505b70]"><span>El trabajo que queda por resolver</span><Layers3 size={18} aria-hidden="true" /></div>
    <ol className="space-y-5 p-6 sm:p-8">
      <li><span className="text-xs font-semibold uppercase tracking-wider text-[#60687a]">Lo que puedes conservar</span><p className="mt-2 text-lg font-medium leading-7">{brief.keep}</p></li>
      <li><ArrowDown size={18} className="mb-4 text-[#747c8c]" aria-hidden="true" /><span className="text-xs font-semibold uppercase tracking-wider text-[#60687a]">El trabajo pendiente</span><p className="mt-2 text-lg font-medium leading-7">{brief.manual}</p></li>
    </ol>
    <div className="bg-[#eef0ff] p-6 sm:px-8"><p className="text-sm font-semibold text-[#424ec0]">Dónde entra Ruka</p><p className="mt-2 text-xl font-semibold leading-7 tracking-tight">{brief.outcome}</p><a href="#ruka-en-operacion" className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-[#424ec0] ${focus}`}>Verlo en el producto <ArrowRight size={16} aria-hidden="true" /></a></div>
  </aside>;
}

export function ComparisonFit({ guide }: { guide: Guide }) {
  const [view, setView] = useState("ruka");
  const experience = comparisonExperience[guide.brand];
  const options = [
    { id: "ruka", label: "Automatizar con Ruka", heading: "Cuando el trabajo sigue siendo manual", copy: guide.rukaFit, summary: experience.ruka, href: "#ruka-en-operacion", action: "Ver el valor de Ruka" },
    { id: "alternative", label: `Evaluar ${guide.brand}`, heading: `Dónde mirar ${guide.brand}`, copy: guide.otherFit, summary: experience.alternative, href: "#fuentes", action: "Revisar sus fuentes oficiales" },
    { id: "together", label: "Conservar y conectar", heading: "No todo se resuelve cambiando de sistema", copy: guide.coexist, summary: "Primero identifica el trabajo pendiente. Después acuerda qué sistema lo recibe, con qué permisos y quién revisa las excepciones.", href: "/one", action: "Conocer Ruka One" },
  ];
  return <section id="encaje" className="mt-16 scroll-mt-28 sm:mt-24" aria-labelledby="comparison-fit-title">
    <div className="max-w-3xl"><h2 id="comparison-fit-title" className="text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">{experience.distinction.title}</h2><p className="mt-5 text-lg leading-8 text-[#505b70]">{experience.distinction.text}</p></div>
    <fieldset className="mt-8"><legend className="mb-3 text-sm font-semibold">Explora la decisión que estás tomando</legend><div className="flex flex-wrap gap-2">{options.map(option => <label key={option.id} className={`relative flex min-h-12 cursor-pointer items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition-colors motion-reduce:transition-none ${view === option.id ? "border-[#171827] bg-[#171827] text-white" : "border-[#dce2ed] bg-white text-[#505b70] hover:border-[#747c8c]"}`}><input className="peer sr-only" type="radio" name="comparison-fit" value={option.id} checked={view === option.id} onChange={() => setView(option.id)} aria-controls={`fit-${option.id}`} /><span className="pointer-events-none absolute inset-0 rounded-full peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-4" />{option.label}{view === option.id && <Check size={16} aria-hidden="true" />}</label>)}</div></fieldset>
    {options.map(option => <div key={option.id} id={`fit-${option.id}`} hidden={view !== option.id} className="mt-5 rounded-2xl bg-[#f5f6fb] p-6 sm:p-9"><div className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14"><div><h3 className="text-2xl font-semibold tracking-tight">{option.heading}</h3><p className="mt-4 max-w-2xl leading-8 text-[#505b70]">{option.copy}</p></div><div className="border-t border-[#dce2ed] pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><p className="text-xs font-semibold uppercase tracking-wider text-[#60687a]">En una frase</p><p className="mt-3 text-lg font-medium leading-7">{option.summary}</p>{option.href.startsWith("/") ? <Link to={option.href} className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-[#424ec0] ${focus}`}>{option.action}<ArrowRight size={16} aria-hidden="true" /></Link> : <a href={option.href} className={`mt-4 inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-[#424ec0] ${focus}`}>{option.action}<ArrowRight size={16} aria-hidden="true" /></a>}</div></div></div>)}
  </section>;
}

export function ComparisonInspect({ guide }: { guide: Guide }) {
  const brief = comparisonDecisions[guide.brand];
  return <div className="mt-8 border-t border-[#dce2ed] pt-6"><h3 className="text-lg font-semibold">Sigue una compra de principio a fin</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-[#505b70]">Tres puntos para revisar con un documento de tu operación. No es una prueba de {guide.brand} ni una integración confirmada.</p><ol className="mt-5 grid gap-6 md:grid-cols-3">{brief.inspect.map((text, i) => <li key={text} className="flex gap-3"><span className="mt-0.5 font-mono text-sm tabular-nums text-[#424ec0]">0{i + 1}</span><p className="max-w-sm text-sm font-medium leading-6">{text}</p></li>)}</ol></div>;
}
