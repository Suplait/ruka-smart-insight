import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NotFound from "@/pages/NotFound";
import { ResourceNextStep } from "@/components/resources/ResourceNextStep";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { ResourceLayout, resourceLinkClass } from "@/components/resources/ResourceLayout";
import { GuideNavigation } from "@/components/resources/GuideNavigation";
import guides from "@/content/purchaseGuides.json";
import { blogAuthor } from "@/content/blog/author";

export const purchaseGuidesPath = "/guias/compras";
export const purchaseGuidesTitle = "Guías de compras, documentos y revisión SII | Ruka";
export const purchaseGuidesHeading = "Una compra. Varias decisiones que conviene separar.";
export const purchaseGuidesDescription = "Guías prácticas para distinguir recepción, revisión interna, documentos y estados del SII. Con ejemplos y fuentes oficiales para seguir revisando.";
type Guide = typeof guides[number];
const dateLabel = (date: string) => new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));

export function PurchaseGuidesIndex() {
  return <ResourceLayout catalog path={purchaseGuidesPath} title={purchaseGuidesTitle} heading={purchaseGuidesHeading} description={purchaseGuidesDescription} eyebrow="Guías de compras">
    <nav aria-label="Temas de compras" className="mb-10 flex flex-wrap gap-x-6 gap-y-1 border-y border-[#dce2ed] py-3">{[...new Set(guides.map(guide => guide.category))].map((category, index) => <a key={category} href={`#tema-${index}`} className={`${resourceLinkClass} text-sm`}>{category}</a>)}</nav>
    <div className="space-y-12">{[...new Set(guides.map(guide => guide.category))].map((category, index) => <section key={category} id={`tema-${index}`} className="scroll-mt-28"><h2 className="mb-5 text-xl font-semibold">{category}</h2><div className="grid gap-5 sm:grid-cols-2">{guides.filter(guide => guide.category === category).map(guide => <article key={guide.slug} className="flex flex-col rounded-xl border border-[#dce2ed] p-6">
      <h3 className="max-w-lg text-xl font-semibold leading-7 tracking-tight"><Link to={`${purchaseGuidesPath}/${guide.slug}`} className="rounded hover:text-[#424ec0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{guide.title}</Link></h3>
      <p className="mb-4 mt-3 max-w-lg text-sm leading-7 text-[#505b70]">{guide.description}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3"><Link to={`${purchaseGuidesPath}/${guide.slug}`} className={`${resourceLinkClass} text-sm`}>Leer guía <ArrowRight size={17} aria-hidden="true" /><span className="sr-only">: {guide.title}</span></Link><span className="text-xs text-[#60687a]">{guide.sources.length} fuentes para consultar</span></div>
    </article>)}</div></section>)}</div>
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
  const navigation = [...guide.sections.map(section => ({ id: section.id, title: section.title })), { id: "fuentes", title: "Fuentes y alcance" }];

  return <div className="min-h-screen bg-white text-[#171827]">
    <MarketingSeo path={path} title={guide.metaTitle} description={guide.description} name={guide.title} primaryEntity={article} />
    <a href="#contenido" className="sr-only z-50 rounded bg-white p-4 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">Saltar al contenido</a>
    <Navbar />
    <main id="contenido" className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
      <Link to={purchaseGuidesPath} className={`${resourceLinkClass} mb-8 text-sm`}>Guías de compras <span aria-hidden="true">/</span> {guide.category}</Link>
      <header className="max-w-[720px] lg:ml-[280px]">
        <h1 className="text-balance text-[clamp(2rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.035em]">{guide.title}</h1>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs leading-6 text-[#505b70]"><a href={blogAuthor.url} rel="author" className="font-semibold underline underline-offset-4">Camilo Silva · CEO y Founder de Ruka</a><span>Revisado el <time dateTime={guide.reviewedAt}>{dateLabel(guide.reviewedAt)}</time></span></div>
        <div className="mt-6 rounded-xl border border-[#dce2ed] bg-[#f8f9fc] p-5 sm:p-6"><p className="mb-3 text-sm font-semibold text-[#424ec0]">La respuesta corta</p><p className="text-base leading-8 text-[#444e61]">{guide.answer}</p><a href="#fuentes" className={`${resourceLinkClass} mt-3 text-sm`}>Consultar fuentes y alcance <ArrowRight size={16} aria-hidden="true" /></a></div>
      </header>
      <div className="mt-9 grid gap-7 lg:grid-cols-[232px_minmax(0,720px)] lg:gap-12">
        <GuideNavigation items={navigation} />
        <article className="min-w-0">
          {guide.sections.map(section => <section key={section.id} id={section.id} className="scroll-mt-28 pb-10">
            <h2 className="text-balance text-2xl font-semibold leading-tight tracking-tight">{section.title}</h2>
            <div className="mt-5 space-y-5 text-base leading-8 text-[#444e61]">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          </section>)}
          <section id="fuentes" className="scroll-mt-28 border-t border-[#dce2ed] pt-8">
            <h2 className="text-2xl font-semibold tracking-tight">Fuentes y alcance</h2>
            <p className="mt-4 leading-7 text-[#505b70]">Contrastado con las fuentes enlazadas el {dateLabel(guide.reviewedAt)}. Los ejemplos son ilustrativos. Esta guía orienta la revisión del proceso; no determina el tratamiento tributario de una operación particular ni ejecuta trámites ante el SII.</p>
            <ul className="mt-5 divide-y divide-[#e3e7ef]">{guide.sources.map(source => <li key={source.url} className="py-3"><a href={source.url} target="_blank" rel="noopener noreferrer" className={`${resourceLinkClass} text-sm`}>{source.title}<ArrowUpRight size={15} className="shrink-0" aria-hidden="true" /><span className="sr-only"> (abre otra pestaña)</span></a>{"updatedAt" in source && source.updatedAt && <p className="text-xs leading-6 text-[#505b70]">Fecha de la fuente: {dateLabel(source.updatedAt)}</p>}</li>)}</ul>
          </section>
          <Link to={guide.related.href} className={`${resourceLinkClass} mt-6`}>{guide.related.label}<ArrowRight size={17} aria-hidden="true" /></Link>
          <ResourceNextStep path={path} />
          <Link to={purchaseGuidesPath} className={`${resourceLinkClass} mt-8`}>Ver las demás guías <ArrowRight size={17} aria-hidden="true" /></Link>
        </article>
      </div>
    </main>
    <Footer />
  </div>;
}
