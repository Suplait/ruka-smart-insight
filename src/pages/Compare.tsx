import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Copy, Search, X, Maximize2 } from "lucide-react";
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
    <div className={`grid gap-8 ${receipt ? "lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-12" : ""}`}>
      <div className="max-w-3xl"><p className="text-sm font-semibold text-[#424ec0]">Así se trabaja en Ruka</p><h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">{experience.proofTitle}</h2><p className={`mt-5 text-lg leading-8 ${muted}`}>{experience.proofLead}</p></div>
      <figure className="min-w-0 rounded-xl border border-[#dce2ed] bg-[#f8f9fc] p-3 sm:p-5">
        <Dialog><DialogTrigger asChild><button type="button" aria-label={receipt ? "Ampliar recepción en Ruka" : "Ampliar detalle de compra en Ruka"} className={`block w-full rounded-lg bg-white text-left ${focus}`}><img {...image} loading="lazy" className="h-auto w-full rounded-lg" /><span className="flex min-h-11 items-center justify-end gap-2 px-4 text-sm font-semibold text-[#424ec0]"><Maximize2 size={16} aria-hidden="true" /> Ampliar captura</span></button></DialogTrigger><DialogContent className="motion-reduce:!animate-none max-h-[90dvh] w-[96vw] max-w-6xl overflow-auto [&>button]:right-1 [&>button]:top-1 [&>button]:flex [&>button]:min-h-11 [&>button]:min-w-11 [&>button]:items-center [&>button]:justify-center"><DialogTitle className="pr-8">{receipt ? "Recepción en Ruka" : "Detalle de compra en Ruka"}</DialogTitle><DialogDescription>Captura de la demo con datos de ejemplo. Desliza horizontalmente para revisar el detalle en un teléfono.</DialogDescription><div className="overflow-x-auto"><img {...image} className="min-w-[850px]" /></div></DialogContent></Dialog>
        <figcaption className={`mt-3 text-xs leading-5 ${muted}`}>Captura real de la demo de Ruka. Datos de ejemplo, no resultados de un cliente.</figcaption>
      </figure>
    </div>
    <Link to="/productos/registro-de-compras" className={`${resourceLinkClass} mt-6`}>Ver el registro de compras de Ruka <ArrowRight size={18} aria-hidden="true" /></Link>
  </section>;
}

function Readiness({ guide }: { guide: Guide }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  async function copy() {
    try { await navigator.clipboard.writeText(`Ruka vs. ${guide.brand}: antes de decidir\n\n${guide.migration.map((text, index) => `${index + 1}. ${text}`).join("\n")}\n\nhttps://www.ruka.ai/comparar/${guide.slug}`); setCopied(true); setError(false); }
    catch { setCopied(false); setError(true); }
  }
  return <section id="antes-de-cambiar" className="mt-16 scroll-mt-28 rounded-xl border border-[#dce2ed] p-6 sm:p-9"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><h2 className="text-2xl font-semibold tracking-tight">Antes de cambiar o sumar una herramienta</h2><button type="button" onClick={copy} className={`${resourceLinkClass} shrink-0 text-sm`}>{copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copied ? "Lista copiada" : "Copiar lista"}</button></div><ol className="mt-5 grid gap-4">{guide.migration.map((text, i) => <li key={text} className="flex gap-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-sm font-semibold text-[#424ec0]">{i + 1}</span><p className={`leading-7 ${muted}`}>{text}</p></li>)}</ol><p role="status" className="mt-3 text-sm text-[#505b70]">{error ? "No se pudo copiar. Puedes seleccionar el texto de la lista directamente." : copied ? "Puedes pegarla y compartirla con tu equipo." : ""}</p></section>;
}

export default function Comparison({ comparison: supplied }: { comparison?: Guide }) {
  const { slug } = useParams();
  const guide = supplied ?? comparisons.find(item => item.slug === slug);
  if (!guide) return <NotFound />;
  const experience = comparisonExperience[guide.brand];
  const path = `/comparar/${guide.slug}`;
  const date = new Intl.DateTimeFormat("es-CL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${guide.reviewedAt}T12:00:00Z`));
  const related = [...comparisons.filter(item => item.category === guide.category && item.slug !== guide.slug), ...comparisons.filter(item => item.category !== guide.category)].slice(0, 3);
  return <Frame>
    <MarketingSeo path={path} title={guide.title} description={guide.description} name={`Ruka vs. ${guide.brand}`} faqs={guide.faqs} primaryEntity={{ "@type": "Article", "@id": `https://www.ruka.ai${path}#guide`, headline: `Ruka vs. ${guide.brand}`, description: guide.description, datePublished: guide.reviewedAt, dateModified: guide.reviewedAt, inLanguage: "es-CL", isAccessibleForFree: true, articleSection: guide.category, citation: guide.sources.map(source => ({ "@type": "CreativeWork", name: source.label, url: source.url })), author: { "@type": "Person", name: "Camilo Silva", jobTitle: "CEO y Founder de Ruka", url: "https://www.ruka.ai/about" }, publisher: { "@id": "https://www.ruka.ai/#organization" }, mainEntityOfPage: { "@id": `https://www.ruka.ai${path}#webpage` } }} />
    <Link to="/comparar" className={`${resourceLinkClass} mb-7 text-sm`}><ArrowLeft size={16} aria-hidden="true" /> Todas las comparativas</Link>
    <header className="grid gap-9 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16">
      <div>
        <p className="mb-5 text-sm font-semibold text-[#424ec0]">{guide.category} · Guía para decidir</p>
        <h1 className="text-[clamp(2.5rem,5.3vw,4.4rem)] font-semibold leading-[1.07] tracking-[-0.045em]"><span className="text-[#4f5beb]">Ruka</span>{" "}<span className="text-[0.6em] font-normal text-[#747c8c]">vs.</span>{" "}{guide.brand}</h1>
        <p className="mt-6 max-w-2xl text-balance text-2xl font-medium leading-[1.3] tracking-[-0.025em] sm:text-3xl">{guide.headline}</p>
        <p className={`mt-5 max-w-xl text-base leading-7 ${muted}`}>{guide.intro}</p>
        <a href="#comparacion" className={`${resourceLinkClass} mt-5`}>Comparar por tarea <ArrowRight size={18} aria-hidden="true" /></a>
      </div>
      <aside aria-label="La diferencia principal" className="rounded-2xl bg-[#171b32] p-7 text-white sm:p-9">
        <h2 className="max-w-md text-balance text-2xl font-medium leading-[1.35] tracking-tight">{experience.question}</h2>
        <dl className="mt-7 divide-y divide-white/20">
          <div className="pb-5"><dt className="flex items-center justify-between gap-4 text-base font-semibold text-[#bcc2ff]">Ruka <span className="text-xs font-normal text-[#c2c7d9]">Trabajo operativo</span></dt><dd className="mt-2 text-base leading-7 text-[#eceef6]">{experience.ruka}</dd></div>
          <div className="pt-5"><dt className="text-base font-semibold text-white">{guide.brand}</dt><dd className="mt-2 text-base leading-7 text-[#d1d6e4]">{experience.alternative}</dd></div>
        </dl>
        <a href="#encaje" className={`mt-6 inline-flex min-h-11 items-center gap-3 rounded text-sm font-medium text-white underline underline-offset-4 ${focus}`}>Ver cuál encaja con tu operación <ArrowRight size={16} aria-hidden="true" /></a>
      </aside>
    </header>
    <div className={`mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs leading-6 ${muted}`}><Link to="/about" className={`rounded underline underline-offset-4 ${focus}`}>Camilo Silva, CEO y Founder de Ruka</Link><span>Revisado el <time dateTime={guide.reviewedAt}>{date}</time></span><a href="#fuentes" className={`rounded underline underline-offset-4 ${focus}`}>Fuentes y criterio editorial</a></div>
    <nav aria-label="En esta comparativa" className="mt-7 flex flex-wrap gap-x-7 gap-y-1 border-y border-[#dce2ed] py-3 text-sm font-medium">{[["#encaje", "Cuándo elegir"], ["#ruka-en-operacion", "El valor de Ruka"], ["#comparacion", "Tarea por tarea"], ["#caso", "Un caso concreto"], ["#preguntas", "Preguntas frecuentes"]].map(([href, label]) => <a key={href} href={href} className={`inline-flex min-h-11 items-center rounded text-[#505b70] hover:text-[#424ec0] ${focus}`}>{label}</a>)}</nav>
    <section id="encaje" className="mt-16 scroll-mt-28 sm:mt-20">
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div><p className="text-sm font-semibold text-[#424ec0]">La decisión de fondo</p><h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">{experience.distinction.title}</h2></div>
        <p className="max-w-2xl text-lg leading-8 text-[#30394b]">{experience.distinction.text}</p>
      </div>
      <div className="mt-9 grid overflow-hidden rounded-xl border border-[#dce2ed] md:grid-cols-2">
        <article className="bg-[#f3f4ff] p-6 sm:p-8"><h3 className="text-xl font-semibold text-[#424ec0]">Cuándo aporta Ruka</h3><p className={`mt-4 leading-8 ${muted}`}>{guide.rukaFit}</p><a href="#ruka-en-operacion" className={`${resourceLinkClass} mt-3 text-sm`}>Verlo en Ruka <ArrowRight size={16} aria-hidden="true" /></a></article>
        <article className="border-t border-[#dce2ed] p-6 sm:p-8 md:border-l md:border-t-0"><h3 className="text-xl font-semibold">Cuándo evaluar {guide.brand}</h3><p className={`mt-4 leading-8 ${muted}`}>{guide.otherFit}</p><a href="#fuentes" className={`${resourceLinkClass} mt-3 text-sm`}>Consultar sus fuentes oficiales <ArrowRight size={16} aria-hidden="true" /></a></article>
      </div>
    </section>
    <ProductProof guide={guide} />
    <ComparisonTasks key={`tasks-${guide.slug}`} guide={guide} />
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
    <section className="mt-16 max-w-3xl"><h2 className="text-3xl font-semibold tracking-[-0.03em]">Qué conservar. Qué conectar. Qué cambiar.</h2><p className={`mt-5 leading-8 ${muted}`}>{guide.coexist}</p><Link to="/one" className={`${resourceLinkClass} mt-4`}>Conocer los procesos a medida de Ruka One <ArrowRight size={18} aria-hidden="true" /></Link></section>
    <Readiness key={`readiness-${guide.slug}`} guide={guide} />
    <section id="preguntas" className="mt-16 scroll-mt-28"><h2 className="mb-7 text-3xl font-semibold tracking-tight">Preguntas sobre Ruka y {guide.brand}</h2><div className="border-t border-[#dce2ed]">{guide.faqs.map(faq => <details key={faq.question} className="group border-b border-[#dce2ed]"><summary className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 rounded py-5 text-lg font-semibold [&::-webkit-details-marker]:hidden ${focus}`}>{faq.question}<ChevronDown size={20} aria-hidden="true" className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" /></summary><p className={`max-w-3xl pb-6 leading-8 ${muted}`}>{faq.answer}</p></details>)}</div></section>
    <section id="fuentes" className="mt-14 scroll-mt-28 rounded-xl bg-[#f8f9fc] p-6 sm:p-8"><h2 className="text-xl font-semibold">Fuentes y criterio editorial</h2><p className={`mt-4 max-w-3xl text-sm leading-7 ${muted}`}>Esta comparación está escrita por Ruka. Describimos {guide.brand} a partir de sus fuentes oficiales, no de una prueba de su servicio. Las recomendaciones son nuestro criterio editorial. Una función no documentada no se considera inexistente; disponibilidad e implementación se confirman con cada proveedor.</p><ol className="mt-5 grid gap-x-10 gap-y-3 md:grid-cols-2">{guide.sources.map((source, i) => <li id={`fuente-${i + 1}`} key={source.url} className="scroll-mt-28"><a href={source.url} target="_blank" rel="noopener noreferrer" className={`${resourceLinkClass} text-sm`}><span className="text-[#60687a]">[{i + 1}]</span>{source.label}<ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /><span className="sr-only"> (abre en otra pestaña)</span></a></li>)}</ol><div className="mt-5 border-t border-[#dce2ed] pt-4"><p className={`text-sm ${muted}`}>Alcance de Ruka:</p><div className="mt-1 flex flex-wrap gap-x-5"><Link to="/productos/registro-de-compras" className={`${resourceLinkClass} text-sm`}>Registro de compras</Link><Link to="/productos/facturacion-electronica" className={`${resourceLinkClass} text-sm`}>RukaFactura</Link><Link to="/desarrolladores" className={`${resourceLinkClass} text-sm`}>API de compras</Link></div></div></section>
    <NextStep />
    <section className="mt-14"><h2 className="text-xl font-semibold">Otras comparativas que pueden servirte</h2><div className="mt-4 flex flex-wrap gap-x-7 gap-y-2">{related.map(item => <Link key={item.slug} to={`/comparar/${item.slug}`} className={resourceLinkClass}>Ruka vs. {item.brand}<ArrowRight size={16} aria-hidden="true" /></Link>)}</div></section>
  </Frame>;
}
