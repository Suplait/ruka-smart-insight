import { useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronDown, Copy, FileCheck2, SlidersHorizontal, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { createPartnerBrief, partnerFaqs, partnerProcesses, partnerSources, partnersDescription, partnersPath, partnersTitle } from "@/content/partnersContent";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";
const action = `inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 font-semibold motion-safe:transition-transform motion-safe:active:scale-[0.98] ${focus}`;
const section = "mx-auto max-w-6xl px-5 sm:px-8";
const heading = "text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem]";

export default function Partners() {
  const [process, setProcess] = useState<string>(partnerProcesses[0].label);
  const [source, setSource] = useState<string>(partnerSources[0]);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "fallback">("idle");
  const brief = createPartnerBrief(process, source);

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopyState("copied");
    } catch {
      setCopyState("fallback");
    }
  }

  return (
    <div className="bg-white text-[#171827]">
      <MarketingSeo path={partnersPath} title={partnersTitle} description={partnersDescription} name="Para consultoras de restaurantes" image="/partners-og.png" imageAlt="Ruka para consultoras de restaurantes: más asesoría, menos carga manual. Tu consultora define; Ruka ejecuta." faqs={partnerFaqs} />
      <Navbar primaryAction={{ label: "Conversemos", path: "/one/contacto" }} />
      <main id="partners-main">
        <header className="overflow-hidden border-b border-[#dce2ed] bg-[#f7f8fc] pb-14 pt-32 sm:pb-20 sm:pt-40">
          <div className={`${section} grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-12`}>
            <div>
              <p className="text-sm font-semibold text-[#424ec0]">Para consultoras de restaurantes</p>
              <h1 className="mt-5 text-[clamp(2.6rem,4vw,3.5rem)] font-semibold leading-[1.06] tracking-[-0.045em]">Más asesoría.<br />Menos carga manual.</h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-[#505b70]">Tú defines cómo debe operar el restaurante. Ruka ejecuta el trabajo repetitivo entre los sistemas que tu cliente ya usa.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/one/contacto" className={`${action} bg-primary text-white`}>Conversemos <ArrowRight size={18} aria-hidden="true" /></Link>
                <a href="#colaboracion" className={`${action} border border-[#cbd2e2] bg-white text-[#171827]`}>Cómo colaborar <ArrowDown size={17} aria-hidden="true" /></a>
              </div>
              <p className="mt-4 text-sm text-[#505b70]">Partamos por un cliente y un proceso.</p>
            </div>
            <div className="rounded-2xl border border-[#dce2ed] bg-white p-6 shadow-[0_20px_60px_-40px_#24305755] sm:p-8" aria-label="Roles propuestos en la colaboración">
              <p className="text-lg font-semibold">Tu criterio, llevado a la operación.</p>
              <ol className="mt-6">
                <li className="flex gap-4 pb-6"><span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0f2f7] text-[#505b70]"><SlidersHorizontal size={20} aria-hidden="true" /></span><div><h2 className="font-semibold">Tu consultora define</h2><p className="mt-1 text-sm leading-6 text-[#505b70]">El proceso, las reglas y qué resultado necesita el cliente.</p></div></li>
                <li className="flex gap-4 border-y border-[#dce2ed] py-6"><span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#eef0ff] text-[#424ec0]"><FileCheck2 size={20} aria-hidden="true" /></span><div><h2 className="font-semibold text-[#424ec0]">Ruka ejecuta</h2><p className="mt-1 text-sm leading-6 text-[#505b70]">Los pasos acordados. Las diferencias quedan para quien debe resolverlas.</p></div></li>
                <li className="flex gap-4 pt-6"><span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0f2f7] text-[#505b70]"><UsersRound size={20} aria-hidden="true" /></span><div><h2 className="font-semibold">El restaurante mantiene el control</h2><p className="mt-1 text-sm leading-6 text-[#505b70]">Autoriza el acceso y las decisiones que afectan su operación.</p></div></li>
              </ol>
            </div>
          </div>
        </header>

        <section className={`${section} py-16 sm:py-24`} aria-labelledby="partner-work">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <h2 id="partner-work" className={heading}>De la recomendación<br />al trabajo hecho.</h2>
            <p className="self-end text-lg leading-8 text-[#505b70]">Si para entregar tu asesoría primero tienes que reunir archivos, cruzar documentos o actualizar planillas, ahí hay trabajo que podemos revisar juntos.</p>
          </div>
          <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-8">
            {partnerProcesses.map((item) => <article key={item.label} className="flex flex-col border-t-2 border-[#c7cdf7] pt-6">
              <p className="text-sm font-semibold text-[#424ec0]">{item.label}</p>
              <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em]">{item.outcome}</h3>
              <p className="mt-3 text-sm leading-6 text-[#505b70]">Hoy: {item.manual}</p>
              <dl className="mt-6 space-y-5 text-sm leading-6">
                <div><dt className="font-semibold">Tu criterio</dt><dd className="mt-1 text-[#505b70]">{item.consultant}</dd></div>
                <div><dt className="font-semibold">El trabajo de Ruka</dt><dd className="mt-1 text-[#505b70]">{item.ruka}</dd></div>
                <div><dt className="font-semibold">Lo que sigue en manos del equipo</dt><dd className="mt-1 text-[#505b70]">{item.review}</dd></div>
              </dl>
              <Link to={item.path} className={`mt-auto inline-flex min-h-12 items-center gap-2 pt-6 text-sm font-semibold text-[#424ec0] underline-offset-4 hover:underline ${focus}`}>Ver {item.label.toLowerCase()} <ArrowRight size={16} aria-hidden="true" /></Link>
            </article>)}
          </div>
        </section>

        <section className="border-y border-[#dce2ed] bg-[#f7f8fc] py-16 sm:py-20" aria-labelledby="partner-example">
          <div className={`${section} grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12`}>
            <div>
              <p className="text-sm font-semibold text-[#424ec0]">Un ejemplo: una entrega incompleta</p>
              <h2 id="partner-example" className={`${heading} mt-4`}>La regla es tuya.<br />La diferencia no se pierde.</h2>
              <p className="mt-5 text-base leading-7 text-[#505b70]">Definiste que una factura debe contrastarse con lo recibido. El equipo registra la cantidad y marca la incidencia en Ruka, para resolverla antes de continuar con el proceso.</p>
              <Link to="/productos/cuentas-por-pagar" className={`mt-5 inline-flex min-h-12 items-center gap-2 font-semibold text-[#424ec0] underline-offset-4 hover:underline ${focus}`}>Ver recepción y pagos <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
            <figure className="min-w-0">
              <a href="/assets/process-evidence/recepcion-demo.jpg" className={`block rounded-xl ${focus}`} aria-label="Abrir captura completa de recepción en Ruka"><img src="/assets/process-evidence/recepcion-demo.jpg" width="840" height="315" loading="lazy" alt="Recepción en Ruka con cantidad recibida y opción para marcar una incidencia por producto." className="h-auto w-full rounded-xl border border-[#dce2ed] bg-white shadow-[0_16px_45px_-30px_#24305755]" /></a>
              <figcaption className="mt-4 text-sm leading-6 text-[#505b70]">Captura de la demo de Ruka con datos de ejemplo. Abre la imagen para ver el detalle.</figcaption>
            </figure>
          </div>
        </section>

        <section id="colaboracion" className={`${section} scroll-mt-28 py-16 sm:py-24`} aria-labelledby="partner-collaboration">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div><h2 id="partner-collaboration" className={heading}>Empezamos acotado.<br />Crecemos con lo que funciona.</h2><p className="mt-6 text-base leading-8 text-[#505b70]">No necesitas traer toda tu cartera ni cambiar el POS de tus clientes. Elijamos un trabajo concreto que hoy se repita a mano.</p><Link to="/integraciones" className={`mt-5 inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-[#424ec0] underline-offset-4 hover:underline ${focus}`}>Explorar sistemas e integraciones <ArrowRight size={16} aria-hidden="true" /></Link></div>
            <ol className="divide-y divide-[#dce2ed] border-y border-[#dce2ed]">
              {[
                ["Elegimos un caso", "Nos cuentas qué se repite, con qué frecuencia y dónde debería quedar el resultado. Sin compartir datos sensibles del cliente."],
                ["Confirmamos cómo conectarlo", "Revisamos sistemas, accesos y reglas. Te decimos qué podemos hacer, qué falta y qué no conviene automatizar."],
                ["Acordamos el trabajo", "Definimos alcance, responsables, costos y cómo comprobaremos el resultado antes de presentar la propuesta al cliente."],
                ["Lo ponemos a trabajar", "Con la autorización del cliente, probamos el recorrido y revisamos juntos el resultado antes de ampliar la operación."],
              ].map(([title, text], index) => <li key={title} className="flex gap-5 py-6"><span className="pt-1 text-sm font-semibold tabular-nums text-[#424ec0]" aria-hidden="true">0{index + 1}</span><div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-7 text-[#505b70]">{text}</p></div></li>)}
            </ol>
          </div>
        </section>

        <section className="bg-[#eef0ff] py-16 sm:py-20" aria-labelledby="partner-brief">
          <div className={`${section} grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16`}>
            <div><h2 id="partner-brief" className={heading}>¿Ya tienes un proceso en mente?</h2><p className="mt-5 text-base leading-8 text-[#505b70]">Lleva un punto de partida a la conversación. Puedes copiar este resumen para trabajarlo con tu equipo.</p><p className="mt-5 text-sm leading-6 text-[#505b70]">Estas opciones solo arman un resumen en tu navegador. No se guardan ni se envían a Ruka.</p></div>
            <div className="min-w-0 rounded-2xl border border-[#d1d6ef] bg-white p-5 sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm font-semibold" htmlFor="partner-process">Trabajo a revisar<select id="partner-process" value={process} onChange={(event) => { setProcess(event.target.value); setCopyState("idle"); }} className={`mt-2 min-h-12 w-full rounded-lg border border-[#b6bfd3] bg-white px-3 text-base font-normal ${focus}`}>{partnerProcesses.map((item) => <option key={item.label}>{item.label}</option>)}<option>Otro proceso recurrente</option></select></label>
                <label className="block text-sm font-semibold" htmlFor="partner-source">Fuentes o sistemas<select id="partner-source" value={source} onChange={(event) => { setSource(event.target.value); setCopyState("idle"); }} className={`mt-2 min-h-12 w-full rounded-lg border border-[#b6bfd3] bg-white px-3 text-base font-normal ${focus}`}>{partnerSources.map((item) => <option key={item}>{item}</option>)}</select></label>
              </div>
              <div className="mt-6 border-y border-[#dce2ed] py-6" aria-label="Vista previa del resumen">
                <p className="text-sm text-[#505b70]">Tu punto de partida</p>
                <p className="mt-2 text-xl font-semibold">{process}</p>
                <p className="mt-1 text-sm text-[#505b70]">Fuentes: {source}.</p>
                <p className="mt-5 text-sm font-semibold">Lo que conversaremos</p>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[#505b70]">{["Qué se repite hoy y con qué frecuencia.", "Dónde debería quedar el resultado.", "Qué reglas aplican y quién resuelve las diferencias.", "Cómo comprobaremos que funciona."].map((item) => <li key={item} className="flex gap-2"><Check size={15} className="mt-1 shrink-0 text-[#424ec0]" aria-hidden="true" />{item}</li>)}</ul>
              </div>
              <button type="button" onClick={copyBrief} className={`${action} mt-4 border border-[#b6bfd3] text-sm`}>{copyState === "copied" ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{copyState === "copied" ? "Resumen copiado" : "Copiar resumen"}</button>
              <p role="status" className="mt-3 min-h-6 text-sm leading-6 text-[#505b70]">{copyState === "copied" ? "Listo para compartir con tu equipo. No se envió a Ruka." : copyState === "fallback" ? "No pudimos copiarlo. Selecciona el texto del resumen y cópialo manualmente." : "No incluyas contraseñas ni datos de tus clientes."}</p>
              {copyState === "fallback" && <textarea aria-label="Resumen para copiar manualmente" readOnly value={brief} rows={10} className={`mt-3 w-full resize-y rounded-lg border border-[#b6bfd3] p-4 text-sm leading-6 ${focus}`} />}
            </div>
          </div>
        </section>

        <section className={`${section} py-16 sm:py-24`} aria-labelledby="partner-questions">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16"><h2 id="partner-questions" className={heading}>Antes de trabajar juntos.</h2><div className="divide-y divide-[#dce2ed] border-y border-[#dce2ed]">{partnerFaqs.map((faq) => <details key={faq.question} className="group py-1"><summary className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-base font-semibold [&::-webkit-details-marker]:hidden ${focus}`}>{faq.question}<ChevronDown size={18} className="shrink-0 group-open:rotate-180 motion-safe:transition-transform" aria-hidden="true" /></summary><p className="pb-6 pr-6 text-base leading-8 text-[#505b70]">{faq.answer}</p></details>)}</div></div>
        </section>

        <section className={`${section} pb-20 sm:pb-24`} aria-labelledby="partner-invitation"><div className="flex flex-col gap-8 rounded-2xl bg-[#171827] p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-xl"><h2 id="partner-invitation" className={heading}>Trae el proceso.<br />Pensemos cómo sacarlo de las manos de tu equipo.</h2><p className="mt-5 text-base leading-7 text-[#d5d9e8]">Cuéntanos cómo trabajas hoy con tus clientes. Revisamos juntos si Ruka puede complementar tu asesoría.</p></div><div className="shrink-0"><Link to="/one/contacto" className={`${action} bg-white text-[#171827]`}>Conversemos <ArrowRight size={18} aria-hidden="true" /></Link><p className="mt-4 text-sm text-[#d5d9e8]">30 minutos · Sin compromiso</p></div></div></section>
      </main>
      <Footer />
    </div>
  );
}
