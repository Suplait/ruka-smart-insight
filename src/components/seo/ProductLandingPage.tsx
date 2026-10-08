import type { ReactNode } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { organizationId } from "@/utils/structuredData";

export type ProductPageContent = {
  path: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  promise: string;
  outcomes: readonly { title: string; description: string }[];
  flowTitle: string;
  flowLead: string;
  flow: readonly { number: string; title: string; description: string }[];
  faqs: readonly { question: string; answer: string }[];
  image?: string;
  imageAlt?: string;
};

type ProductLandingPageProps = {
  content: ProductPageContent;
  visual: ReactNode;
  demo?: ReactNode;
};

export function ProductLandingPage({ content, visual, demo }: ProductLandingPageProps) {
  const canonical = `https://www.ruka.ai${content.path}`;
  const serviceId = `${canonical}#service`;

  return (
    <div className="min-h-screen bg-[#fbfcff] text-[#171827]">
      <MarketingSeo
        path={content.path}
        title={content.title}
        description={content.description}
        name={content.name}
        image={content.image}
        imageAlt={content.imageAlt}
        faqs={content.faqs}
        primaryEntity={{
          "@type": "Service",
          "@id": serviceId,
          name: content.name,
          url: canonical,
          description: content.description,
          serviceType: content.name,
          category: "Automatización de procesos operativos con agentes IA",
          provider: { "@id": organizationId },
          areaServed: { "@type": "Country", name: "Chile", identifier: "CL" },
        }}
      />
      <Navbar />

      <main>
        <section className="relative overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[42rem] overflow-hidden" aria-hidden="true">
            <span className="absolute -right-24 top-24 h-[30rem] w-[30rem] rounded-full bg-primary/[0.075] blur-3xl" />
            <span className="absolute left-[42%] top-28 h-px w-[38rem] rotate-[-18deg] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          </div>
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
            <div className="relative z-10">
              <Link
                to="/#trabajo"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
              >
                <span className="h-px w-6 bg-primary transition-[width] duration-300 group-hover:w-9" aria-hidden="true" />
                {content.name}
              </Link>
              <h1 className="mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl xl:text-[4.75rem]">
                {content.h1}
              </h1>
              <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-[#586176] sm:text-xl sm:leading-9">
                {content.lead}
              </p>
              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/register"
                  className="group inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-white shadow-[0_10px_30px_rgba(80,101,233,0.2)] transition-[background-color,transform] duration-200 hover:bg-[#4358d8] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                >
                  Agendar 30 min
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
                <a href="#como-funciona" className="text-sm font-semibold text-[#4d5669] underline decoration-[#c8cedb] underline-offset-4 hover:text-[#171827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  Ver cómo funciona
                </a>
              </div>
              <p className="mt-4 text-sm text-[#70788a]">30 min · Sin compromiso</p>
            </div>

            <div className="group relative min-w-0 lg:-mr-6">
              <div className="absolute -inset-10 -z-10 rounded-full bg-primary/[0.08] blur-3xl transition-opacity duration-500 group-hover:opacity-70" aria-hidden="true" />
              {visual}
            </div>
          </div>
        </section>

        <section className="bg-[#171a29] px-5 text-white sm:px-8" aria-label={`Resultados de ${content.name}`}>
          <div className="mx-auto grid max-w-7xl divide-y divide-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
            {content.outcomes.map((outcome, index) => (
              <article key={outcome.title} className="group relative py-8 md:px-8 md:py-9 md:first:pl-0 md:last:pr-0">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs font-semibold text-[#8998ff]">0{index + 1}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-white">{outcome.title}</h2>
                      <Check className="h-3.5 w-3.5 text-[#74d4aa] opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none" strokeWidth={2.5} aria-hidden="true" />
                    </div>
                    <p className="mt-1.5 max-w-sm text-sm leading-6 text-[#b4b9c8]">{outcome.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {demo}

        <section id="como-funciona" className="scroll-mt-28 px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
              <div className="lg:sticky lg:top-32 lg:self-start">
                <p className="text-sm font-semibold text-primary">Cómo funciona</p>
                <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.04] tracking-[-0.04em] sm:text-5xl">
                  {content.flowTitle}
                </h2>
                <p className="mt-5 text-lg leading-8 text-[#5d6577]">{content.flowLead}</p>
              </div>
              <ol className="border-t border-[#dfe4ef]">
                {content.flow.map((step) => (
                  <li key={step.number} className="group grid gap-3 border-b border-[#dfe4ef] py-8 transition-colors duration-200 hover:border-primary/35 sm:grid-cols-[5rem_1fr] sm:gap-6">
                    <span className="flex items-center gap-3 font-mono text-sm font-semibold text-primary"><span className="h-px w-5 bg-primary/45 transition-[width] duration-300 group-hover:w-8" aria-hidden="true" />{step.number}</span>
                    <div className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none">
                      <h3 className="text-2xl font-semibold tracking-[-0.025em] text-[#202231]">{step.title}</h3>
                      <p className="mt-3 max-w-2xl text-base leading-7 text-[#626a7d]">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="bg-[#171a29] px-5 py-20 text-white sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-[#aeb8ff]">En la práctica</p>
              <h2 className="mt-4 max-w-4xl text-balance text-4xl font-semibold leading-[1.03] tracking-[-0.04em] sm:text-5xl">{content.promise}</h2>
            </div>
            <Link to="/register" className="group inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-base font-semibold text-[#202231] transition-[background-color,transform] duration-200 hover:bg-[#eef1ff] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#171a29]">
              Conversemos <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="product-faq-title">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold text-primary">Preguntas frecuentes</p>
              <h2 id="product-faq-title" className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em]">Lo que suele preguntarnos el equipo.</h2>
            </div>
            <div className="border-t border-[#dfe4ef]">
              {content.faqs.map((faq) => (
                <details key={faq.question} className="group border-b border-[#dfe4ef] py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-lg font-semibold text-[#252838] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    {faq.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-[#747d90] transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="max-w-3xl pb-1 pt-4 text-base leading-7 text-[#626a7d]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8 sm:pb-28">
          <div className="mx-auto flex max-w-7xl flex-col gap-7 rounded-2xl bg-[#eef1ff] px-7 py-9 sm:px-10 sm:py-11 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-[-0.035em]">¿Todavía hacen esto a mano?</h2>
              <p className="mt-2 text-base text-[#5d6578]">Muéstranos el proceso. En 30 minutos vemos contigo qué parte podría tomar Ruka.</p>
            </div>
            <Link to="/register" className="group inline-flex min-h-12 shrink-0 items-center justify-center rounded-full bg-primary px-6 text-base font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#4358d8] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
              Agendar 30 min <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

const productImageAspects = {
  standard: "aspect-[4/3]",
  wide: "aspect-[16/10]",
  cinema: "aspect-video",
  banner: "aspect-[1.9/1]",
  portrait: "aspect-[3/4]",
};

export function ProductImage({
  src,
  alt,
  position = "center",
  aspect = "wide",
  label,
}: {
  src: string;
  alt: string;
  position?: string;
  aspect?: keyof typeof productImageAspects;
  label?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-2xl bg-white p-2 shadow-[0_26px_70px_rgba(29,38,72,0.14)] transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transition-none">
      <div className="flex h-9 items-center gap-1.5 border-b border-[#e6e9f0] px-3" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-[#d7dce7]" /><span className="h-2 w-2 rounded-full bg-[#d7dce7]" /><span className="h-2 w-2 rounded-full bg-[#d7dce7]" />
        {label && <span className="ml-auto truncate text-[10px] font-medium text-[#7a8498]">{label}</span>}
      </div>
      <div className={`${productImageAspects[aspect]} overflow-hidden rounded-b-xl bg-[#f2f4f8]`}>
        <img src={src} alt={alt} className="h-full w-full object-contain" style={{ objectPosition: position }} loading="eager" decoding="async" />
      </div>
    </figure>
  );
}
