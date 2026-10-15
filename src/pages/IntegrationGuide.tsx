import { ArrowLeft, ArrowRight, Check, Info } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import guides from "@/content/integrationGuides.json";
import NotFound from "@/pages/NotFound";

export default function IntegrationGuide({ guide: supplied }: { guide?: typeof guides[number] }) {
  const { slug } = useParams();
  const guide = supplied ?? guides.find((item) => item.slug === slug);
  if (!guide) return <NotFound />;
  return (
    <div className="min-h-screen bg-white text-[#171827]">
      <MarketingSeo path={`/integraciones/${guide.slug}`} name={`Ruka y ${guide.name}`} title={guide.title} description={guide.description} faqs={guide.faq} />
      <Navbar />
      <main>
        <header className="bg-[#f7f8fc] px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
          <div className="mx-auto max-w-6xl">
            <Link to="/integraciones" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#505b70] hover:text-primary focus-visible:ring-2 focus-visible:ring-primary"><ArrowLeft size={16} /> Todas las integraciones</Link>
            <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end lg:gap-16">
              <div>
                <div className="mb-7 flex items-center gap-5"><img src={guide.logo} alt={guide.name} className={`h-10 max-w-36 object-contain${guide.slug === "idtecloud" ? " rounded-md bg-[#171827] px-3 py-2" : ""}`} /><span className="border-l border-[#cbd2e2] pl-5 text-sm font-medium text-[#505b70]">Ruka + {guide.name}</span></div>
                <h1 className="max-w-3xl text-balance text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">{guide.headline}</h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#505b70]">{guide.lead}</p>
              </div>
              <div className="rounded-xl bg-[#171827] p-7 text-white sm:p-8">
                <p className="text-sm font-semibold text-[#c4cbff]">Alcance de esta conexión</p>
                <p className="mt-4 text-2xl font-semibold">{guide.direction}</p>
                <p className="mt-4 text-base leading-7 text-[#e0e3ee]">{guide.scope}</p>
                <p className="mt-6 border-t border-white/20 pt-5 text-sm leading-6 text-[#c4cadb]">Confirmamos los accesos y el alcance para tu empresa antes de implementarlo.</p>
              </div>
            </div>
          </div>
        </header>

        <section className="px-5 py-16 sm:px-8 sm:py-24" aria-labelledby="flow-heading">
          <div className="mx-auto max-w-6xl">
            <h2 id="flow-heading" className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Qué pasa con la información.</h2>
            <div className="mt-8 grid gap-6 border-y border-[#dce2ed] py-7 sm:grid-cols-2 sm:gap-16">
              <div><h3 className="text-sm font-semibold text-primary">Qué entra</h3><p className="mt-2 text-lg leading-8 text-[#505b70]">{guide.input}</p></div>
              <div><h3 className="text-sm font-semibold text-primary">Qué queda al final</h3><p className="mt-2 text-lg leading-8 text-[#505b70]">{guide.output}</p></div>
            </div>
            <ol className="mt-12 grid gap-9 md:grid-cols-3">
              {guide.steps.map((step, index) => <li key={step.title}><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eef0ff] text-sm font-semibold text-primary">{index + 1}</span><h3 className="mt-4 text-xl font-semibold">{step.title}</h3><p className="mt-3 text-base leading-7 text-[#505b70]">{step.text}</p></li>)}
            </ol>
          </div>
        </section>

        <section className="bg-[#eef0ff] px-5 py-14 sm:px-8 sm:py-20" aria-labelledby="example-heading">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:gap-16">
            <div><p className="text-sm font-semibold text-[#424ec0]">Un ejemplo de uso</p><h2 id="example-heading" className="mt-4 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{guide.example.title}</h2><p className="mt-5 text-base leading-8 text-[#505b70]">{guide.example.text}</p></div>
            <div className="flex flex-col justify-center gap-5" aria-label="Flujo del ejemplo">
              {[guide.example.input, guide.example.action, guide.example.output].map((text, index) => <div key={text} className="flex items-center gap-4 border-b border-[#c9cfee] pb-5"><span aria-hidden="true" className="text-[#424ec0]">{index === 2 ? <Check size={24} /> : <ArrowRight size={24} />}</span><p className="text-lg font-medium">{text}</p></div>)}
              <Link to={guide.guide.href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#424ec0] underline underline-offset-4">{guide.guide.label}<ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>

        <section className="px-5 py-16 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
            <div><h2 className="text-2xl font-semibold">Lo que necesitamos para partir.</h2><ul className="mt-6 space-y-5">{guide.requirements.map((text) => <li key={text} className="flex gap-3 text-base leading-7 text-[#505b70]"><Check className="mt-1 shrink-0 text-primary" size={19} />{text}</li>)}</ul></div>
            <div><h2 className="text-2xl font-semibold">Lo que esta conexión no implica.</h2><ul className="mt-6 space-y-5">{guide.limits.map((text) => <li key={text} className="flex gap-3 text-base leading-7 text-[#505b70]"><Info className="mt-1 shrink-0 text-[#68738a]" size={19} />{text}</li>)}</ul></div>
          </div>
        </section>

        <section className="border-t border-[#dce2ed] px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl"><h2 className="text-3xl font-semibold tracking-[-0.03em]">Antes de conectarlo.</h2><div className="mt-7 divide-y divide-[#dce2ed]">{guide.faq.map((faq) => <details key={faq.question} className="py-5"><summary className="cursor-pointer text-lg font-semibold focus-visible:ring-2 focus-visible:ring-primary">{faq.question}</summary><p className="max-w-3xl pt-4 text-base leading-7 text-[#505b70]">{faq.answer}</p></details>)}</div>
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-[#505b70]">{guide.sources.map((source) => <a key={source.url} href={source.url} className="underline underline-offset-4 hover:text-primary">{source.label}</a>)}</div>
          </div>
        </section>
        <section className="px-5 pb-20 pt-5 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col justify-between gap-7 rounded-xl bg-[#171827] p-7 text-white sm:p-10 md:flex-row md:items-center"><div><h2 className="text-2xl font-semibold">¿Cómo sería con tu operación?</h2><p className="mt-3 max-w-xl text-base leading-7 text-[#c4cadb]">Revisamos el proceso, los accesos y qué trabajo puede hacer Ruka.</p></div><div className="flex shrink-0 flex-col gap-4"><Link to="/register" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 font-semibold focus-visible:ring-2 focus-visible:ring-white">Agendar 30 min <ArrowRight size={18} /></Link><Link to={guide.product.href} className="text-center text-sm text-[#d1d6ed] underline underline-offset-4">{guide.product.label}</Link></div></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
