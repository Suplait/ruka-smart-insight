import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Search, X, Maximize2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { resourceLinkClass } from "@/components/resources/ResourceLayout";
import NotFound from "@/pages/NotFound";
import comparisons from "@/content/comparisons.json";
import { comparisonExperience } from "@/content/comparisonExperience";
import { ComparisonTasks } from "@/components/resources/ComparisonTasks";
import { ComparisonFit, ComparisonInspect, ComparisonSnapshot } from "@/components/resources/ComparisonDecision";
import { ComparisonReadiness } from "@/components/resources/ComparisonReadiness";
import { ComparisonQuestions } from "@/components/resources/ComparisonQuestions";

type Guide = typeof comparisons[number];
const focus = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4";
const primary = `inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#4f5beb] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3e48bc] ${focus}`;
const muted = "text-[#505b70]";
const logos: Record<string, string> = { Nubox: "/integrations/nubox.svg", Defontana: "/integrations/defontana.svg", Chipax: "/integrations/chipax.png", KAME: "/integrations/kame.png", Bsale: "/integrations/bsale.png" };
const topics = ["Todas", "Facturación y cobranza", "ERP y contabilidad", "Finanzas y tesorería", "Ventas e inventario", "API y automatización"];

function Frame({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-white text-[#171827]">
    <a href="#contenido" className="sr-only z-50 rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a>
    <Navbar />
    <main id="contenido" className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">{children}</main>
    <Footer />
  </div>;
}

function NextStep() {
  return <aside data-resource-next-step className="mt-20 grid gap-8 rounded-2xl bg-[#eef0ff] p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
    <div><h2 className="max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">Tu equipo no necesita otra tarea. Necesita terminar la que ya tiene.</h2>
      <p className={`mt-5 max-w-2xl leading-7 ${muted}`}>Cuéntanos qué siguen haciendo a mano. Revisamos contigo cómo podría operarlo Ruka sobre los sistemas que ya usan.</p>
    </div>
    <div className="flex flex-col items-start gap-3"><Link to="/register" className={primary}>Agendar 30 min <ArrowRight size={18} aria-hidden="true" /></Link><Link data-resource-product to="/one" className={`${resourceLinkClass} text-sm`}>Conocer Ruka One <ArrowRight size={16} aria-hidden="true" /></Link><p className={`text-sm ${muted}`}>Sin compromiso.</p></div>
  </aside>;
}

function PurchaseExample() {
  const [pack, setPack] = useState<"box" | "sack">("box");
  const item = pack === "box" ? { name: "Caja de 6 kg", total: 18000, quantity: 6 } : { name: "Saco de 25 kg", total: 80000, quantity: 25 };
  const currency = (value: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);
  return <div className="overflow-hidden rounded-2xl border border-[#dce2ed] bg-[#f8f9fc]">
    <div className="p-6 sm:p-8"><h2 className="text-xl font-semibold tracking-tight">Mismo insumo. Otra presentación.</h2><p className="mt-2 text-sm leading-6 text-[#505b70]">Cambia el envase y compara sobre la misma unidad.</p>
      <div className="mt-5 flex gap-2" aria-label="Presentación de compra">{([['box', 'Caja de 6 kg'], ['sack', 'Saco de 25 kg']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={pack === value} onClick={() => setPack(value)} className={`min-h-11 flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${focus} ${pack === value ? "border-[#4f5beb] bg-white text-[#424ec0]" : "border-[#dce2ed] text-[#505b70] hover:bg-white"}`}>{label}</button>)}</div>
      <div className="mt-6 flex items-end justify-between gap-4"><div><p className="text-sm text-[#60687a]">En la factura</p><p className="mt-1 text-3xl font-semibold tabular-nums tracking-tight">{currency(item.total)}</p></div><p className="pb-1 text-sm text-[#505b70]">por {item.name.toLowerCase()}</p></div>
    </div>
    <div className="border-t border-[#d8ddfa] bg-[#eef0ff] p-6 sm:p-8" aria-live="polite" aria-atomic="true"><p className="text-sm font-semibold text-[#424ec0]">La unidad con que decides</p><p className="mt-2 text-[clamp(2.8rem,4vw,3.5rem)] font-semibold tabular-nums tracking-[-0.04em] text-[#303aa5]">{currency(item.total / item.quantity)}<span className="ml-2 text-lg font-medium tracking-normal">/ kg</span></p><p className="mt-2 text-sm leading-6 text-[#505b70]">{pack === "box" ? "El total de la factura no basta para comparar costos." : "Esta presentación cuesta 6,67% más por kilo que la caja."}</p><p className="mt-4 text-xs leading-5 text-[#60687a]">Ejemplo interactivo en CLP, con importes netos y equivalencias conocidas. No son datos de un cliente.</p></div>
  </div>;
}

export function CompareIndex() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("Todas");
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const results = comparisons.filter(item => (topic === "Todas" || item.category === topic) && normalize(`${item.brand} ${item.category} ${item.headline}`).includes(normalize(query.trim())));
  return <Frame>
    <MarketingSeo path="/comparar" title="Ruka vs. otras soluciones: compara por proceso | Ruka" description="Compara Ruka con Emisso, Tupana, Wasabil, Nubox, Defontana, Chipax, KAME, Bsale y Clay. Diferencias concretas para elegir por el trabajo que necesitas resolver." name="Elige por el trabajo que necesitas resolver." />
    <Link to="/recursos" className={`${resourceLinkClass} mb-8 text-sm`}><ArrowLeft size={16} aria-hidden="true" /> Recursos</Link>
    <header className="max-w-4xl"><p className="mb-4 text-sm font-semibold text-[#424ec0]">Comparativas de software</p><h1 className="text-balance text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-[1.06] tracking-[-0.04em]">Elige por el trabajo que necesitas resolver.</h1><p className={`mt-6 max-w-2xl text-lg leading-8 ${muted}`}>ERP, facturador, finanzas o automatización. Entiende dónde aporta Ruka, qué puedes conservar y qué cambia en tu operación.</p></header>
    <section className="mt-12 border-t border-[#dce2ed] pt-7" aria-label="Buscar comparativas">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><h2 className="text-2xl font-semibold tracking-tight">¿Qué alternativa estás mirando?</h2><p className={`mt-2 text-sm ${muted}`}>Nueve guías, escritas desde problemas distintos.</p></div>
        <div className="relative w-full lg:w-80"><label htmlFor="comparison-search" className="sr-only">Buscar una alternativa</label><Search size={18} aria-hidden="true" className="pointer-events-none absolute left-4 top-4 text-[#60687a]" /><input id="comparison-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar empresa o proceso" className={`min-h-12 w-full rounded-lg border border-[#cbd2df] py-3 pl-11 pr-4 text-base placeholder:text-[#60687a] ${focus}`} /></div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2" aria-label="Filtrar por necesidad">{topics.map(item => <button key={item} type="button" aria-pressed={topic === item} onClick={() => setTopic(item)} className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${focus} ${topic === item ? "border-[#171827] bg-[#171827] text-white" : "border-[#dce2ed] text-[#505b70] hover:border-[#717b91]"}`}>{item}</button>)}</div>
      <p role="status" className={`mb-4 mt-6 text-sm ${muted}`}>{results.length} {results.length === 1 ? "comparativa" : "comparativas"}</p>
      <div className="grid gap-5 md:grid-cols-2">{results.map(item => <Link key={item.slug} to={`/comparar/${item.slug}`} className={`group flex flex-col rounded-xl border border-[#dce2ed] p-6 transition-colors hover:border-[#626cef] hover:bg-[#fafaff] sm:p-8 ${focus}`}>
        <div className="flex min-h-10 items-center justify-between gap-6"><span className="text-sm font-medium text-[#60687a]">{item.category}</span>{logos[item.brand] && <img src={logos[item.brand]} alt="" width="100" height="32" loading="lazy" className="h-8 w-24 object-contain" />}</div>
        <h3 className="mt-5 text-3xl font-semibold tracking-[-0.03em]">Ruka vs. {item.brand}</h3><p className="mt-4 max-w-lg text-lg font-medium leading-7">{item.headline}</p><p className={`mb-8 mt-3 max-w-lg text-sm leading-7 ${muted}`}>{item.intro}</p><span className="mt-auto flex items-center justify-between text-sm font-semibold text-[#424ec0]">Explorar comparación <ArrowRight size={20} aria-hidden="true" /></span>
      </Link>)}</div>
      {!results.length && <div className="rounded-xl bg-[#f7f8fc] p-8"><p className="text-lg font-semibold">No encontramos esa alternativa.</p><p className={`mt-2 ${muted}`}>Prueba con el nombre de la empresa o vuelve a ver todas las guías.</p><button type="button" onClick={() => { setQuery(""); setTopic("Todas"); }} className={`${resourceLinkClass} mt-4`}>Limpiar filtros <X size={16} aria-hidden="true" /></button></div>}
    </section>
    <section className="mt-16 grid gap-8 border-t border-[#dce2ed] pt-10 md:grid-cols-2"><div><h2 className="text-2xl font-semibold tracking-tight">A veces no necesitas cambiar de software.</h2><p className={`mt-4 leading-8 ${muted}`}>Si tu ERP, POS o contabilidad ya funciona, el siguiente paso puede ser automatizar el trabajo que ocurre entre ellos. Una integración útil tiene un alcance concreto, no solo una lista de logos.</p><Link to="/integraciones" className={`${resourceLinkClass} mt-4`}>Cómo trabaja Ruka con tus sistemas <ArrowRight size={18} aria-hidden="true" /></Link></div><div><h2 className="text-2xl font-semibold tracking-tight">¿Todavía trabajas con planillas?</h2><div className="mt-4 flex flex-col items-start gap-2"><Link to="/blog/registro-compras-excel-vs-automatizacion" className={resourceLinkClass}>Excel o registro automático <ArrowRight size={18} aria-hidden="true" /></Link><Link to="/blog/ocr-facturas-vs-registro-automatico" className={resourceLinkClass}>Leer una factura o completar el proceso <ArrowRight size={18} aria-hidden="true" /></Link></div></div></section>
    <NextStep />
  </Frame>;
}

function ProductProof({ guide }: { guide: Guide }) {
  const experience = comparisonExperience[guide.brand];
  const receipt = experience.proof === "receipt";
  const image = receipt
    ? { src: "/blog/2026-10/recepcion-cantidades-demo.jpg", width: 850, height: 558, alt: "Recepción en Ruka: 14 kg recibidos de 16 kg esperados, con una incidencia marcada." }
    : { src: "/blog/2026-10/registro-lineas-demo.jpg", width: 1015, height: 397, alt: "Detalle de una compra en Ruka: productos del proveedor, cantidades, unidades, costo e insumo maestro relacionado." };
  return <section id="ruka-en-operacion" className="mt-20 scroll-mt-28">
    <div className="grid gap-8">
      <div className="max-w-3xl"><h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">{experience.proofTitle}</h2><p className={`mt-5 text-lg leading-8 ${muted}`}>{experience.proofLead}</p></div>
      <figure className={`min-w-0 overflow-hidden rounded-xl border border-[#dce2ed] ${receipt ? "max-w-4xl" : ""}`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dce2ed] bg-[#fafbfe] px-4 py-3 text-xs text-[#505b70]"><span>Ruka / {receipt ? "Recepción de compras" : "Detalle de compra"}</span><span>Demo · Datos de ejemplo</span></div>
        <Dialog><DialogTrigger asChild><button type="button" aria-label={receipt ? "Ampliar recepción en Ruka" : "Ampliar detalle de compra en Ruka"} className={`block w-full bg-white text-left ${focus}`}><img {...image} loading="lazy" className="h-auto w-full" /><span className="flex min-h-12 items-center justify-between gap-3 border-t border-[#dce2ed] px-4 text-sm font-semibold text-[#424ec0]"><span>Explorar el detalle</span><span className="flex items-center gap-2"><Maximize2 size={16} aria-hidden="true" /> Ampliar captura</span></span></button></DialogTrigger><DialogContent className="motion-reduce:!animate-none max-h-[90dvh] w-[96vw] max-w-6xl overflow-auto [&>button]:right-1 [&>button]:top-1 [&>button]:flex [&>button]:min-h-11 [&>button]:min-w-11 [&>button]:items-center [&>button]:justify-center"><DialogTitle className="pr-8">{receipt ? "Recepción en Ruka" : "Detalle de compra en Ruka"}</DialogTitle><DialogDescription>Captura de la demo con datos de ejemplo. Desliza horizontalmente para revisar el detalle en un teléfono.</DialogDescription><div tabIndex={0} role="region" aria-label="Captura ampliada, desplazable horizontalmente" className={`overflow-x-auto rounded ${focus}`}><img {...image} className="h-auto min-w-[850px] max-w-none" /></div></DialogContent></Dialog>
        <figcaption className={`border-t border-[#dce2ed] px-4 py-3 text-xs leading-5 ${muted}`}>Captura real de la demo de Ruka. Datos de ejemplo, no resultados de un cliente.</figcaption>
      </figure>
    </div>
    <ComparisonInspect guide={guide} />
    <Link to="/productos/registro-de-compras" className={`${resourceLinkClass} mt-6`}>Ver el registro de compras de Ruka <ArrowRight size={18} aria-hidden="true" /></Link>
  </section>;
}

export default function Comparison({ comparison: supplied }: { comparison?: Guide }) {
  const { slug } = useParams();
  const guide = supplied ?? comparisons.find(item => item.slug === slug);
  if (!guide) return <NotFound />;
  return <ComparisonDetail key={guide.slug} guide={guide} />;
}

function ComparisonDetail({ guide }: { guide: Guide }) {
  const [priorities, setPriorities] = useState<string[]>([]);
  const experience = comparisonExperience[guide.brand];
  const path = `/comparar/${guide.slug}`;
  const date = new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${guide.reviewedAt}T12:00:00Z`));
  const related = [...comparisons.filter(item => item.category === guide.category && item.slug !== guide.slug), ...comparisons.filter(item => item.category !== guide.category)].slice(0, 3);
  return <Frame>
    <MarketingSeo path={path} title={guide.title} description={guide.description} name={`Ruka vs. ${guide.brand}`} faqs={guide.faqs} primaryEntity={{ "@type": "Article", "@id": `https://www.ruka.ai${path}#guide`, headline: `Ruka vs. ${guide.brand}`, description: guide.description, datePublished: guide.reviewedAt, dateModified: guide.reviewedAt, inLanguage: "es-CL", isAccessibleForFree: true, articleSection: guide.category, citation: guide.sources.map(source => ({ "@type": "CreativeWork", name: source.label, url: source.url })), author: { "@type": "Person", name: "Camilo Silva", jobTitle: "CEO y Founder de Ruka", url: "https://www.ruka.ai/about" }, publisher: { "@id": "https://www.ruka.ai/#organization" }, mainEntityOfPage: { "@id": `https://www.ruka.ai${path}#webpage` } }} />
    <Link to="/comparar" className={`${resourceLinkClass} mb-7 text-sm`}><ArrowLeft size={16} aria-hidden="true" /> Todas las comparativas</Link>
    <header className="grid gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
      <div>
        <p className="mb-5 text-sm font-semibold text-[#424ec0]">{guide.category}</p>
        <h1 className="text-balance text-[clamp(2.5rem,5.3vw,4.4rem)] font-semibold leading-[1.07] tracking-[-0.04em]"><span className="text-[#4f5beb]">Ruka</span>{" "}<span className="text-[0.6em] font-normal text-[#747c8c]">vs.</span>{" "}{guide.brand}</h1>
        <p className="mt-6 max-w-2xl text-balance text-2xl font-medium leading-[1.3] tracking-[-0.025em] sm:text-3xl">{guide.headline}</p>
        <p className={`mt-5 max-w-xl text-base leading-7 ${muted}`}>{guide.intro}</p>
        <div className="mt-7 flex flex-wrap gap-3"><a href="#comparacion" className={primary}>Comparar por tarea <ArrowRight size={18} aria-hidden="true" /></a><a href="#antes-de-cambiar" className={`${resourceLinkClass} px-2 text-sm`}>Preparar mi decisión</a></div>
        <p className="mt-4 text-xs leading-6 text-[#60687a]">6 tareas · Fuentes oficiales · Una pauta para tu equipo</p>
      </div>
      <ComparisonSnapshot guide={guide} />
    </header>
    <div className={`mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs leading-6 ${muted}`}><Link to="/about" className={`rounded underline underline-offset-4 ${focus}`}>Camilo Silva, CEO y Founder de Ruka</Link><span>Revisado el <time dateTime={guide.reviewedAt}>{date}</time></span><a href="#fuentes" className={`rounded underline underline-offset-4 ${focus}`}>Fuentes y criterio editorial</a></div>
    <nav aria-label="En esta comparativa" className="mt-7 grid grid-cols-2 gap-x-5 gap-y-1 border-y border-[#dce2ed] py-3 text-sm font-medium sm:flex sm:flex-wrap sm:gap-x-7">{[["#encaje", "Dónde encaja"], ["#ruka-en-operacion", "Ruka en acción"], ["#comparacion", "Tarea por tarea"], ["#caso", "Un caso concreto"], ["#antes-de-cambiar", "Mi pauta"], ["#preguntas", "Preguntas"], ["#fuentes", "Fuentes"]].map(([href, label], i) => <a key={href} href={href} className={`inline-flex min-h-11 items-center gap-2 rounded text-[#505b70] hover:text-[#424ec0] ${focus}`}><span className="font-mono text-xs text-[#747c8c]">0{i + 1}</span>{label}</a>)}</nav>
    <ComparisonFit key={`fit-${guide.slug}`} guide={guide} />
    <ProductProof guide={guide} />
    <ComparisonTasks key={`tasks-${guide.slug}`} guide={guide} priorities={priorities} onPrioritiesChange={setPriorities} />
    <section id="caso" className="mt-20 scroll-mt-28 rounded-2xl bg-[#f5f6fb] p-6 sm:p-10">
      <div className={experience.costExample ? "grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12" : "grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"}>
        <div>
          <p className="text-sm font-semibold text-[#424ec0]">Un caso para llevar a tu operación</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.03em]">{guide.scenario.title}</h2>
          <p className="mt-5 leading-8 text-[#505b70]">{guide.scenario.text}</p>
          <p className="mt-5 text-sm leading-7 text-[#505b70]">{experience.practice}</p>
          {experience.costExample && <p className="mt-5 text-xs leading-6 text-[#60687a]">El ejemplo editable ilustra el cálculo, no el comportamiento de {guide.brand}.</p>}
        </div>
        {experience.costExample ? <PurchaseExample key={guide.slug} /> : <div className="rounded-xl bg-white p-6 sm:p-8"><h3 className="text-lg font-semibold">Qué debería quedar claro</h3><ul className="mt-5 space-y-5">{guide.scenario.evidence.map(text => <li key={text} className="flex gap-3"><Check size={19} className="mt-1 shrink-0 text-[#424ec0]" aria-hidden="true" /><span className="leading-7 text-[#505b70]">{text}</span></li>)}</ul></div>}
      </div>
      {experience.costExample && <div className="mt-8 border-t border-[#dce2ed] pt-7"><h3 className="text-lg font-semibold">Qué debería quedar claro</h3><ul className="mt-4 grid gap-5 md:grid-cols-3">{guide.scenario.evidence.map(text => <li key={text} className="flex gap-3"><Check size={18} className="mt-1 shrink-0 text-[#424ec0]" aria-hidden="true" /><span className="text-sm leading-7 text-[#505b70]">{text}</span></li>)}</ul></div>}
    </section>
    <ComparisonReadiness key={`readiness-${guide.slug}`} guide={guide} priorities={priorities} />
    <ComparisonQuestions key={`questions-${guide.slug}`} guide={guide} />
    <section id="fuentes" className="mt-14 scroll-mt-28 rounded-xl bg-[#f8f9fc] p-6 sm:p-8"><h2 className="text-xl font-semibold">Fuentes y criterio editorial</h2><p className={`mt-4 max-w-3xl text-sm leading-7 ${muted}`}>Esta comparación está escrita por Ruka. Describimos {guide.brand} a partir de sus fuentes oficiales, no de una prueba de su servicio. Las recomendaciones son nuestro criterio editorial. Una función no documentada no se considera inexistente; disponibilidad e implementación se confirman con cada proveedor.</p><ol className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-2">{guide.sources.map((source, i) => <li id={`fuente-${i + 1}`} key={source.url} className="scroll-mt-28"><a href={source.url} target="_blank" rel="noopener noreferrer" className={`${resourceLinkClass} text-sm`}><span className="text-[#60687a]">[{i + 1}]</span>{source.label}<ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /><span className="sr-only"> (abre en otra pestaña)</span></a></li>)}</ol><div className="mt-5 border-t border-[#dce2ed] pt-4"><p className={`text-sm ${muted}`}>Alcance de Ruka:</p><div className="mt-1 flex flex-wrap gap-x-5"><Link to="/productos/registro-de-compras" className={`${resourceLinkClass} text-sm`}>Registro de compras</Link><Link to="/productos/facturacion-electronica" className={`${resourceLinkClass} text-sm`}>RukaFactura</Link><Link to="/desarrolladores" className={`${resourceLinkClass} text-sm`}>API de compras</Link></div></div></section>
    <NextStep />
    <section className="mt-16"><h2 className="text-2xl font-semibold tracking-tight">¿Estás mirando otra alternativa?</h2><p className="mt-3 text-sm leading-7 text-[#505b70]">Sigue comparando por el trabajo que necesitas resolver.</p><div className="mt-5 divide-y divide-[#dce2ed] border-y border-[#dce2ed]">{related.map(item => <Link key={item.slug} to={`/comparar/${item.slug}`} className={`group grid min-h-20 items-center gap-3 rounded py-5 transition-colors hover:bg-[#fafbfe] motion-reduce:transition-none sm:grid-cols-[1fr_2fr_auto] ${focus}`}><span className="text-lg font-semibold">Ruka vs. {item.brand}</span><span className="max-w-2xl text-sm leading-6 text-[#505b70]">{item.headline}</span><ArrowRight size={18} aria-hidden="true" className="text-[#424ec0]" /></Link>)}</div></section>
  </Frame>;
}
