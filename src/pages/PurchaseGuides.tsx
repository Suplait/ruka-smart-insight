import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { ResourceLayout, resourceLinkClass } from "@/components/resources/ResourceLayout";
import guides from "@/content/purchaseGuides.json";
import { blogAuthor } from "@/content/blog/author";

export const purchaseGuidesPath = "/guias/compras";
export const purchaseGuidesTitle = "Guías de compras, documentos y revisión SII | Ruka";
export const purchaseGuidesHeading = "Una compra. Varias decisiones que conviene separar.";
export const purchaseGuidesDescription = "Guías prácticas para distinguir recepción, revisión interna, documentos y estados del SII. Con ejemplos y fuentes oficiales para seguir revisando.";
type Guide = typeof guides[number];
const dateLabel = (date: string) => new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));

export function PurchaseGuidesIndex() {
  return <ResourceLayout path={purchaseGuidesPath} title={purchaseGuidesTitle} heading={purchaseGuidesHeading} description={purchaseGuidesDescription} eyebrow="Guías de compras">
    <div className="grid gap-x-14 sm:grid-cols-2">{guides.map(guide => <article key={guide.slug} className="border-t border-[#dce2ed] py-8">
      <p className="text-sm font-medium text-[#505b70]">{guide.category}</p>
      <h2 className="mt-3 max-w-lg text-2xl font-semibold leading-tight tracking-tight"><Link to={`${purchaseGuidesPath}/${guide.slug}`} className="rounded hover:text-[#424ec0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{guide.title}</Link></h2>
      <p className="mt-4 max-w-lg leading-7 text-[#505b70]">{guide.description}</p>
      <Link to={`${purchaseGuidesPath}/${guide.slug}`} className={`${resourceLinkClass} mt-4`}>Leer guía <ArrowRight size={17} aria-hidden="true" /><span className="sr-only">: {guide.title}</span></Link>
    </article>)}</div>
  </ResourceLayout>;
}

export default function PurchaseGuide({ guide: supplied }: { guide?: Guide }) {
  const { slug } = useParams();
  const guide = supplied ?? guides.find(item => item.slug === slug);
  if (!guide) return <NotFound />;
  const path = `${purchaseGuidesPath}/${guide.slug}`;
  const url = `https://www.ruka.ai${path}`;
  const article = {
    "@type": "Article", "@id": `${url}#article`, headline: guide.title, description: guide.description,
    inLanguage: "es-CL", datePublished: guide.reviewedAt, dateModified: guide.reviewedAt,
    author: { "@type": "Person", name: blogAuthor.name, url: blogAuthor.url, jobTitle: "CEO y Founder de Ruka" },
    publisher: { "@id": "https://www.ruka.ai/#organization" }, mainEntityOfPage: { "@id": `${url}#webpage` },
    citation: guide.sources.map(source => source.url),
  };
  const navigation = <>{guide.sections.map(section => <a key={section.id} href={`#${section.id}`} className="block rounded py-3 text-sm leading-6 text-[#505b70] hover:text-[#424ec0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{section.title}</a>)}<a href="#fuentes" className="block rounded py-3 text-sm font-semibold text-[#424ec0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Fuentes y alcance</a></>;

  return <div className="min-h-screen bg-white text-[#171827]">
    <MarketingSeo path={path} title={guide.metaTitle} description={guide.description} name={guide.title} primaryEntity={article} />
    <a href="#contenido" className="sr-only z-50 rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a>
    <Navbar />
    <main id="contenido" className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <Link to={purchaseGuidesPath} className={`${resourceLinkClass} mb-8 text-sm`}>Guías de compras <span aria-hidden="true">/</span> {guide.category}</Link>
      <header className="max-w-4xl">
        <h1 className="text-balance text-[clamp(2.2rem,4.6vw,3.9rem)] font-semibold leading-[1.1] tracking-[-0.04em]">{guide.title}</h1>
        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm leading-6 text-[#505b70]"><a href={blogAuthor.url} rel="author" className="font-semibold underline underline-offset-4">Camilo Silva · CEO y Founder de Ruka</a><span>Revisado el <time dateTime={guide.reviewedAt}>{dateLabel(guide.reviewedAt)}</time></span></div>
        <p className="mt-8 border-l-4 border-primary bg-[#f4f5ff] p-6 text-lg leading-8 sm:text-xl sm:leading-9">{guide.answer}</p>
      </header>
      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,720px)] lg:gap-16">
        <aside><nav aria-label="En esta guía" className="sticky top-28 hidden border-t border-[#dce2ed] pt-4 lg:block"><p className="mb-3 text-sm font-semibold">En esta guía</p>{navigation}</nav><details className="rounded-lg border border-[#dce2ed] px-5 lg:hidden"><summary className="cursor-pointer py-4 font-semibold">En esta guía</summary><nav aria-label="Contenido de la guía" className="border-t border-[#dce2ed] py-2">{navigation}</nav></details></aside>
        <article className="min-w-0">
          {guide.sections.map((section, index) => <section key={section.id} id={section.id} className="scroll-mt-28 border-t border-[#dce2ed] pb-10 pt-7">
            <p aria-hidden="true" className="mb-3 text-sm font-semibold text-[#424ec0]">0{index + 1}</p>
            <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">{section.title}</h2>
            <div className="mt-5 space-y-5 text-base leading-8 text-[#444e61] sm:text-lg">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>)}
          <section id="fuentes" className="scroll-mt-28 border-t border-[#dce2ed] pt-8">
            <h2 className="text-2xl font-semibold tracking-tight">Fuentes y alcance</h2>
            <p className="mt-4 leading-7 text-[#505b70]">Contrastado con las fuentes enlazadas el {dateLabel(guide.reviewedAt)}. Los ejemplos son ilustrativos. Esta guía orienta la revisión del proceso; no determina el tratamiento tributario de una operación particular ni ejecuta trámites ante el SII.</p>
            <ul className="mt-5 divide-y divide-[#e3e7ef]">{guide.sources.map(source => <li key={source.url} className="py-3"><a href={source.url} target="_blank" rel="noopener noreferrer" className={`${resourceLinkClass} text-sm`}>{source.title}<ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a>{"updatedAt" in source && source.updatedAt && <p className="text-xs leading-6 text-[#505b70]">Fecha de la fuente: {dateLabel(source.updatedAt)}</p>}</li>)}</ul>
          </section>
          <aside className="mt-10 rounded-xl bg-[#f4f5ff] p-6 sm:p-8"><h2 className="text-xl font-semibold">De la revisión al trabajo resuelto.</h2><p className="mt-3 leading-7 text-[#505b70]">Conoce cómo Ruka conecta los documentos con tu operación y conserva el contexto que tu equipo necesita para revisar.</p><Link to={guide.related.href} className={`${resourceLinkClass} mt-4`}>{guide.related.label}<ArrowRight size={17} aria-hidden="true" /></Link></aside>
          <Link to={purchaseGuidesPath} className={`${resourceLinkClass} mt-8`}>Ver las demás guías <ArrowRight size={17} aria-hidden="true" /></Link>
        </article>
      </div>
    </main>
    <Footer />
  </div>;
}
