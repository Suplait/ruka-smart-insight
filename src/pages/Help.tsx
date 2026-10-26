import { useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Search, X, ZoomIn } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { ResourceLayout, resourceLinkClass } from "@/components/resources/ResourceLayout";
import { blogAuthor } from "@/content/blog/author";
import guides from "@/content/helpGuides.json";
import { searchHelp } from "@/utils/helpSearch";

export const helpPath = "/ayuda";
export const helpTitle = "Ayuda de Ruka: compras, recepción, pagos y facturación | Ruka";
export const helpDescription = "Guías paso a paso para revisar compras, homologar insumos, registrar recepción, preparar nóminas y comenzar con RukaFactura. Con requisitos y soluciones a errores.";
export const helpReviewedAt = "2026-10-26";
type Guide = typeof guides[number];

export function HelpIndex() {
  const [query, setQuery] = useState("");
  const results = searchHelp(query);
  const categories = [...new Set(results.map(guide => guide.category))];
  return <ResourceLayout path={helpPath} title={helpTitle} description={helpDescription} eyebrow="Centro de ayuda" heading="Encuentra el paso que te falta." lead="De la primera conexión al cierre del período. Elige una tarea y revisa qué necesitas, cómo hacerla y cómo comprobar el resultado." showContact={false}>
    <div className="max-w-2xl"><label htmlFor="help-search" className="text-sm font-semibold">Buscar una tarea</label><div className="relative mt-2"><Search size={19} className="pointer-events-none absolute left-4 top-4 text-[#60687a]" aria-hidden="true" /><input id="help-search" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Por ejemplo: recepción, unidad o nómina" className="min-h-14 w-full rounded-xl border border-[#cbd2df] bg-white pl-12 pr-14 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />{query && <button onClick={() => setQuery("")} aria-label="Limpiar búsqueda" className="absolute right-1 top-1 grid h-12 w-12 place-items-center rounded-lg text-[#505b70] focus-visible:ring-2 focus-visible:ring-primary"><X size={18} aria-hidden="true" /></button>}</div><p role="status" className="mt-3 text-sm text-[#505b70]">{results.length} {results.length === 1 ? "guía" : "guías"}{query ? " para esta búsqueda" : " de uso de Ruka"}</p></div>
    {results.length === 0 ? <div className="my-14 max-w-xl border-y border-[#dce2ed] py-8"><h2 className="text-2xl font-semibold">No encontramos esa tarea.</h2><p className="mt-3 leading-7 text-[#505b70]">Prueba con una palabra como compras, costos o facturación. Si necesitas ayuda con tu cuenta, utiliza el canal de soporte acordado con tu equipo.</p><button onClick={() => setQuery("")} className={`${resourceLinkClass} mt-4`}>Ver todas las guías <ArrowRight size={17} aria-hidden="true" /></button></div> : <div className="mt-12 space-y-12">{categories.map(category => <section key={category} className="grid gap-5 border-t border-[#dce2ed] pt-7 md:grid-cols-[.6fr_1.4fr] md:gap-14"><h2 className="text-xl font-semibold tracking-tight">{category}</h2><div className="divide-y divide-[#e2e6ef]">{results.filter(guide => guide.category === category).map(guide => <article key={guide.slug} className="pb-7 pt-6 first:pt-0 last:pb-0"><Link to={`${helpPath}/${guide.slug}`} className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"><h3 className="flex items-start justify-between gap-4 text-xl font-semibold leading-7 group-hover:text-[#424ec0]">{guide.title}<ArrowUpRight size={20} className="mt-1 shrink-0" aria-hidden="true" /></h3><p className="mt-3 max-w-2xl leading-7 text-[#505b70]">{guide.description}</p></Link></article>)}</div></section>)}</div>}
    <section className="mt-16 grid gap-8 rounded-2xl bg-[#f4f5ff] p-6 sm:p-8 md:grid-cols-2"><div><h2 className="text-xl font-semibold">¿Estás integrando por API?</h2><p className="mt-3 leading-7 text-[#505b70]">Consulta el contrato y los ejemplos de compras, ERP y webhooks. Las credenciales se administran fuera de estas guías.</p><Link to="/desarrolladores" className={`${resourceLinkClass} mt-4`}>Ayuda para desarrolladores <ArrowRight size={17} aria-hidden="true" /></Link></div><div><h2 className="text-xl font-semibold">¿Tu duda es tributaria?</h2><p className="mt-3 leading-7 text-[#505b70]">Separa el uso del producto de las reglas del SII. Revisa las fuentes oficiales y los límites de cada explicación.</p><Link to="/guias/compras" className={`${resourceLinkClass} mt-4`}>Guías de compras y SII <ArrowRight size={17} aria-hidden="true" /></Link></div></section>
  </ResourceLayout>;
}

function GuideLink({ href, label }: { href: string; label: string }) {
  return href.startsWith("https://") ? <a href={href} className={resourceLinkClass} target="_blank" rel="noopener noreferrer">{label}<ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a> : <Link to={href} className={resourceLinkClass}>{label}<ArrowRight size={17} aria-hidden="true" /></Link>;
}

export default function HelpGuide({ guide: supplied }: { guide?: Guide }) {
  const { slug } = useParams();
  const guide = supplied ?? guides.find(item => item.slug === slug);
  if (!guide) return <NotFound />;
  const path = `${helpPath}/${guide.slug}`;
  const url = `https://www.ruka.ai${path}`;
  const toc = <>{guide.steps.map((step, index) => <a key={step.title} href={`#paso-${index + 1}`} className="block rounded py-3 text-sm leading-6 text-[#505b70] hover:text-[#424ec0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{index + 1}. {step.title}</a>)}<a href="#si-algo-no-cuadra" className="block rounded py-3 text-sm font-semibold text-[#424ec0] focus-visible:ring-2 focus-visible:ring-primary">Si algo no cuadra</a></>;
  return <div className="min-h-screen bg-white text-[#171827]">
    <MarketingSeo path={path} title={`${guide.title} | Ayuda Ruka`} description={guide.description} name={guide.title} primaryEntity={{ "@type": "TechArticle", "@id": `${url}#article`, headline: guide.title, description: guide.description, inLanguage: "es-CL", datePublished: helpReviewedAt, dateModified: helpReviewedAt, author: { "@type": "Person", name: blogAuthor.name, url: blogAuthor.url, jobTitle: "CEO y Founder de Ruka" }, publisher: { "@id": "https://www.ruka.ai/#organization" }, mainEntityOfPage: { "@id": `${url}#webpage` } }} />
    <a href="#contenido" className="sr-only z-50 rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a><Navbar />
    <main id="contenido" className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <Link to={helpPath} className={`${resourceLinkClass} mb-7 text-sm`}><ArrowLeft size={16} aria-hidden="true" /> Centro de ayuda</Link>
      <header className="max-w-4xl"><p className="mb-4 text-sm font-semibold text-[#424ec0]">{guide.category}</p><h1 className="text-balance text-[clamp(2.2rem,4.5vw,3.8rem)] font-semibold leading-[1.1] tracking-[-0.04em]">{guide.title}</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#505b70]">{guide.outcome}</p><div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#60687a]"><a href={blogAuthor.url} rel="author" className="underline underline-offset-4">Camilo Silva · CEO y Founder de Ruka</a><span>Revisado el <time dateTime={helpReviewedAt}>26 de octubre de 2026</time></span></div></header>
      <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,720px)] lg:gap-16"><aside><nav aria-label="Pasos de esta guía" className="sticky top-28 hidden border-t border-[#dce2ed] pt-3 lg:block">{toc}</nav><details className="rounded-lg border border-[#dce2ed] px-5 lg:hidden"><summary className="cursor-pointer py-4 font-semibold">Ver los pasos</summary><nav aria-label="Contenido de ayuda" className="border-t border-[#dce2ed] py-2">{toc}</nav></details></aside>
        <article className="min-w-0"><section className="mb-10 rounded-xl bg-[#f4f5ff] p-6"><h2 className="text-xl font-semibold">Antes de empezar</h2><p className="mt-3 text-sm font-medium text-[#424ec0]">Para {guide.audience.toLowerCase()}</p><p className="mt-3 leading-7 text-[#444e61]">{guide.permission}</p><p className="mt-4 border-t border-[#d4d9f4] pt-4 text-sm leading-7 text-[#505b70]">{guide.context}</p></section>
          <ol>{guide.steps.map((step, index) => <li key={step.title} id={`paso-${index + 1}`} className="scroll-mt-28 border-t border-[#dce2ed] py-8"><p className="mb-3 text-sm font-semibold text-[#424ec0]">Paso {index + 1}</p><h2 className="text-2xl font-semibold leading-tight tracking-tight">{step.title}</h2><p className="mt-5 text-base leading-8 text-[#444e61] sm:text-lg">{step.text}</p></li>)}</ol>
          {guide.image && <figure className="mb-10 overflow-hidden rounded-xl border border-[#dce2ed]"><a href={guide.image.src} target="_blank" rel="noopener noreferrer" className="block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"><img src={guide.image.src} alt={guide.image.alt} width={guide.image.width} height={guide.image.height} loading="lazy" decoding="async" className="h-auto w-full" /><span className="flex min-h-11 items-center justify-center gap-2 border-t border-[#dce2ed] bg-[#f8f9fc] px-4 py-3 text-sm font-semibold text-[#424ec0]"><ZoomIn size={16} aria-hidden="true" /> Ampliar captura<span className="sr-only"> (abre otra pestaña)</span></span></a><figcaption className="border-t border-[#dce2ed] p-5 text-sm leading-6 text-[#505b70]">{guide.image.caption}</figcaption></figure>}
          <section className="border-y border-[#dce2ed] py-7"><h2 className="flex items-center gap-3 text-xl font-semibold"><Check size={20} className="shrink-0 text-[#424ec0]" aria-hidden="true" /> Cómo comprobar el resultado</h2><p className="mt-4 leading-8 text-[#444e61]">{guide.check}</p></section>
          <section id="si-algo-no-cuadra" className="scroll-mt-28 pt-10"><h2 className="mb-5 text-2xl font-semibold tracking-tight">Si algo no cuadra</h2>{guide.problems.map(problem => <details key={problem.title} className="border-t border-[#dce2ed] last:border-b"><summary className="cursor-pointer rounded py-5 pr-3 font-semibold leading-7 focus-visible:ring-2 focus-visible:ring-primary">{problem.title}</summary><p className="pb-6 leading-8 text-[#444e61]">{problem.text}</p></details>)}</section>
          <nav aria-label="Continuar con otra tarea" className="mt-10 space-y-3"><h2 className="mb-4 text-xl font-semibold">Para seguir</h2>{guide.related.map(link => <div key={link.href}><GuideLink {...link} /></div>)}</nav>
          <p className="mt-9 border-t border-[#dce2ed] pt-5 text-sm leading-7 text-[#60687a]">Las capturas son ejemplos de una demo autorizada. Tu interfaz puede variar por versión, permisos o módulos. Para un problema de tu cuenta, utiliza tu canal de soporte; no publiques contraseñas, certificados ni datos de terceros.</p>
        </article>
      </div>
    </main><Footer />
  </div>;
}
