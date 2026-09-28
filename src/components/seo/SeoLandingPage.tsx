import { ArrowRight, Check, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { SeoLandingPageContent } from "@/content/seoLandingPages";
import { seoLandingCanonical } from "@/content/seoLandingPages";
import {
  createOrganizationSchema,
  createWebsiteSchema,
  organizationId,
  websiteId,
} from "@/utils/structuredData";

export function SeoLandingPage({
  content,
  children,
}: {
  content: SeoLandingPageContent;
  children?: ReactNode;
}) {
  const canonicalUrl = seoLandingCanonical(content.path);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      createOrganizationSchema(),
      createWebsiteSchema(),
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: content.name,
        description: content.description,
        inLanguage: "es-CL",
        isPartOf: { "@id": websiteId },
        publisher: { "@id": organizationId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Ruka",
            item: "https://www.ruka.ai/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: content.name,
            item: canonicalUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fbfcff] text-[#171827]">
      <Helmet htmlAttributes={{ lang: "es-CL" }}>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ruka.ai" />
        <meta property="og:locale" content="es_CL" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description} />
        <meta property="og:image" content="https://www.ruka.ai/ruka-agentes-ia-operaciones-og.png" />
        <meta property="og:image:secure_url" content="https://www.ruka.ai/ruka-agentes-ia-operaciones-og.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Ruka conecta los sistemas de una empresa y ejecuta trabajo operativo" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.title} />
        <meta name="twitter:description" content={content.description} />
        <meta name="twitter:image" content="https://www.ruka.ai/ruka-agentes-ia-operaciones-og.png" />
        <meta name="twitter:image:alt" content="Ruka conecta los sistemas de una empresa y ejecuta trabajo operativo" />

        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Navbar />
      <main>
        <article className="px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-32">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-medium text-[#687080]">
              <Link to="/" className="transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Inicio
              </Link>
              <ChevronRight className="h-4 w-4 text-[#a3aabd]" aria-hidden="true" />
              <span aria-current="page" className="text-[#202231]">{content.name}</span>
            </nav>

            <header className="max-w-4xl pb-14 pt-10 sm:pb-20 sm:pt-14">
              <p className="text-sm font-semibold text-primary">{content.eyebrow}</p>
              <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.045em] text-[#171827] sm:text-5xl lg:text-6xl">
                {content.h1}
              </h1>
              <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-[#555b6e] sm:text-xl sm:leading-9">{content.lead}</p>
              <Button asChild className="group mt-8 h-12 rounded-full px-6 text-base font-semibold shadow-none transition-transform hover:-translate-y-0.5 sm:mt-9">
                <Link to="/register">
                  Agendar 30 min
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              </Button>
              <p className="mt-3 text-sm font-medium text-[#687080]">Cuéntanos tu proceso · Sin compromiso</p>
            </header>

            {children}

            <section aria-label={`Beneficios de ${content.name}`} className="grid gap-4 border-y border-[#dce1eb] py-5 md:grid-cols-3">
              {content.highlights.map((item) => (
                <article key={item.title} className="rounded-2xl bg-white p-6 ring-1 ring-[#e1e5ee]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/[0.08] text-primary">
                    <Check className="h-4 w-4" strokeWidth={2.4} aria-hidden="true" />
                  </span>
                  <h2 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-[#202231]">{item.title}</h2>
                  <p className="mt-3 text-[15px] leading-7 text-[#62697a]">{item.description}</p>
                </article>
              ))}
            </section>

            {content.sections.map((section) => (
              <section key={section.title} className="border-b border-[#dce1eb] py-16 sm:py-20">
                <div className="max-w-3xl">
                  {section.eyebrow && <p className="text-sm font-semibold text-primary">{section.eyebrow}</p>}
                  <h2 className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-[#171827] sm:text-4xl">{section.title}</h2>
                  {section.description && <p className="mt-5 text-lg leading-8 text-[#555b6e]">{section.description}</p>}
                </div>
                <div className="mt-10 grid gap-4 lg:grid-cols-3">
                  {section.items.map((item) => (
                    <article key={item.title} className="rounded-2xl border border-[#dce1eb] bg-[#f7f8fc] p-6 sm:p-7">
                      <h3 className="text-xl font-semibold tracking-[-0.025em] text-[#202231]">{item.title}</h3>
                      <p className="mt-3 text-[15px] leading-7 text-[#62697a]">{item.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            ))}

            <section className="grid gap-10 py-16 lg:grid-cols-[0.72fr_1.28fr] lg:py-20" aria-labelledby="faq-title">
              <div>
                <p className="text-sm font-semibold text-primary">Preguntas frecuentes</p>
                <h2 id="faq-title" className="mt-3 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.035em] text-[#171827] sm:text-4xl">
                  Lo importante antes de empezar.
                </h2>
              </div>
              <Accordion type="single" collapsible className="grid gap-3">
                {content.faqs.map((faq, index) => (
                  <AccordionItem key={faq.question} value={`faq-${index}`} className="rounded-2xl border border-[#dce1eb] bg-white px-5">
                    <AccordionTrigger className="text-left text-base font-semibold text-[#202231] hover:text-primary hover:no-underline sm:text-lg">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base leading-7 text-[#62697a]">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <aside className="rounded-2xl border border-[#dce3f2] bg-[#eef1ff] p-6 sm:p-8" aria-label="Páginas relacionadas">
              <p className="text-sm font-semibold text-primary">También te puede servir</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {content.relatedLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d5dbeb] bg-white px-4 py-2.5 text-sm font-semibold text-[#202231] transition-colors hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {link.label}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
