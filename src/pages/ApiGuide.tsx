import { ArrowLeft, ArrowUpRight, Download } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { resourceLinkClass } from "@/components/resources/ResourceLayout";
import guides from "@/content/apiGuides.json";
import { blogAuthor } from "@/content/blog/author";

type Guide = typeof guides[number];
export const apiGuidePath = "/desarrolladores/guias";
export const apiReviewDate = "2026-10-26";

export default function ApiGuide({ guide: supplied }: { guide?: Guide }) {
  const { slug } = useParams();
  const guide = supplied ?? guides.find(item => item.slug === slug);
  if (!guide) return <NotFound />;
  const path = `${apiGuidePath}/${guide.slug}`;
  const url = `https://www.ruka.ai${path}`;
  const reference = `https://api.rukafactura.cl/api_docs#${guide.reference}`;
  const navigation = <>{guide.sections.map((section, index) => <a key={section.title} href={`#paso-${index + 1}`} className="block rounded py-3 text-sm leading-6 text-[#505b70] hover:text-[#424ec0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{section.title}</a>)}<a href="#comprobar" className="block rounded py-3 text-sm font-semibold text-[#424ec0] focus-visible:ring-2 focus-visible:ring-primary">Antes de conectar producción</a></>;
  return <div className="min-h-screen bg-white text-[#171827]">
    <MarketingSeo path={path} title={guide.metaTitle} description={guide.description} name={guide.title} primaryEntity={{ "@type": "TechArticle", "@id": `${url}#article`, headline: guide.title, description: guide.description, inLanguage: "es-CL", datePublished: apiReviewDate, dateModified: apiReviewDate, author: { "@type": "Person", name: blogAuthor.name, url: blogAuthor.url, jobTitle: "CEO y Founder de Ruka" }, publisher: { "@id": "https://www.ruka.ai/#organization" }, mainEntityOfPage: { "@id": `${url}#webpage` }, citation: reference }} />
    <a href="#contenido" className="sr-only z-50 rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a>
    <Navbar />
    <main id="contenido" className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <Link to="/desarrolladores" className={`${resourceLinkClass} mb-8 text-sm`}><ArrowLeft size={16} aria-hidden="true" /> API de Ruka</Link>
      <header className="max-w-4xl">
        <p className="mb-4 text-sm font-semibold text-[#424ec0]">Guía de integración</p>
        <h1 className="text-balance text-[clamp(2.2rem,4.6vw,3.9rem)] font-semibold leading-[1.1] tracking-[-0.04em]">{guide.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#505b70]">{guide.description}</p>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-6 text-[#505b70]"><a href={blogAuthor.url} rel="author" className="font-semibold underline underline-offset-4">Camilo Silva · CEO y Founder de Ruka</a><span>Revisado el <time dateTime={apiReviewDate}>26 de octubre de 2026</time></span></div>
      </header>
      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,720px)] lg:gap-16">
        <aside><nav aria-label="En esta guía" className="sticky top-28 hidden border-t border-[#dce2ed] pt-4 lg:block"><p className="mb-3 text-sm font-semibold">En esta guía</p>{navigation}</nav><details className="rounded-lg border border-[#dce2ed] px-5 lg:hidden"><summary className="cursor-pointer py-4 font-semibold">En esta guía</summary><nav aria-label="Contenido de la guía" className="border-t border-[#dce2ed] py-2">{navigation}</nav></details></aside>
        <article className="min-w-0">
          <section className="border-l-4 border-primary bg-[#f4f5ff] p-6 sm:p-8"><h2 className="text-xl font-semibold">Qué vas a construir</h2><p className="mt-3 leading-8 text-[#444e61]">{guide.result}</p></section>
          <section className="py-10"><h2 className="text-2xl font-semibold tracking-tight">Antes de empezar</h2><ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-[#444e61]">{guide.prerequisites.map(item => <li key={item}>{item}</li>)}</ul></section>
          {guide.sections.map((section, index) => <section id={`paso-${index + 1}`} key={section.title} className="scroll-mt-28 border-t border-[#dce2ed] pb-10 pt-7">
            <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{section.title}</h2>
            <div className="mt-5 space-y-5 text-base leading-8 text-[#444e61] sm:text-lg">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
            {section.code && <div className="mt-6 min-w-0 overflow-hidden rounded-xl bg-[#171827] text-[#f7f8fc]"><pre tabIndex={0} aria-label={`Código: ${section.title}`} className="overflow-x-auto p-5 text-[13px] leading-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a7afff] sm:p-6"><code>{section.code}</code></pre></div>}
          </section>)}
          <section id="comprobar" className="scroll-mt-28 border-t border-[#dce2ed] pt-8"><h2 className="text-2xl font-semibold tracking-tight">Antes de conectar producción</h2><ul className="mt-5 list-disc space-y-3 pl-5 leading-7 text-[#444e61]">{guide.checks.map(item => <li key={item}>{item}</li>)}</ul></section>
          <section className="mt-10 rounded-xl bg-[#f4f5ff] p-6 sm:p-8"><h2 className="text-xl font-semibold">Ejemplo para tu servidor</h2><p className="mt-3 leading-7 text-[#505b70]">Archivo JavaScript legible, para Node.js 22 o superior. No incluye claves, no se ejecuta al descargarlo y no reemplaza la persistencia ni los controles de tu integración.</p><a href={`/api/examples/${guide.download}`} download className={`${resourceLinkClass} mt-4`}><Download size={18} aria-hidden="true" /> Descargar ejemplo .mjs</a></section>
          <section className="mt-10 border-t border-[#dce2ed] pt-8"><h2 className="text-xl font-semibold">Contrato y mantenimiento</h2><p className="mt-3 leading-7 text-[#505b70]">La guía acompaña el contrato publicado en la fecha indicada. Antes de integrar, revisa permisos, filtros y respuestas vigentes en la referencia. Trabaja primero con datos de prueba autorizados.</p><a href={reference} className={`${resourceLinkClass} mt-4`}>Ver referencia de esta operación <ArrowUpRight size={17} aria-hidden="true" /></a></section>
          <nav aria-label="Otras guías de API" className="mt-10 border-t border-[#dce2ed] pt-8"><h2 className="mb-3 font-semibold">Sigue construyendo</h2>{guides.filter(item => item.slug !== guide.slug).map(item => <Link key={item.slug} to={`${apiGuidePath}/${item.slug}`} className={`${resourceLinkClass} mr-4 text-sm`}>{item.title}</Link>)}</nav>
        </article>
      </div>
    </main>
    <Footer />
  </div>;
}
