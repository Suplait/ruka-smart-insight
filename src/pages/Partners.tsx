import { useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronDown, Copy, Maximize2, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { organizationId } from "@/utils/structuredData";
import { createPartnerBrief, partnerFaqs, partnerProcesses, partnerSources, partnersDescription, partnersPath, partnersTitle } from "@/content/partnersContent";

const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#424ec0]";
const action = `inline-flex min-h-12 items-center justify-center gap-3 whitespace-nowrap rounded-full px-6 font-semibold motion-safe:transition-transform motion-safe:duration-150 motion-safe:active:scale-[0.98] ${focus}`;
const section = "mx-auto max-w-7xl px-5 sm:px-8 lg:px-12";
const heading = "text-balance text-3xl font-semibold leading-[1.12] tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem]";
const link = `inline-flex min-h-12 items-center gap-2 font-semibold text-[#424ec0] underline-offset-4 hover:underline ${focus}`;

function ProductImage({ src, alt, caption, eager = false, detail = false }: { src: string; alt: string; caption: string; eager?: boolean; detail?: boolean }) {
  return (
    <figure className="min-w-0">
      <Dialog.Root>
        <Dialog.Trigger asChild>
          <button type="button" className={`group relative block w-full overflow-hidden rounded-xl bg-white text-left ${focus}`} aria-label={`Ampliar imagen: ${alt}`}>
            <img src={src} alt={alt} width={detail ? 840 : 1200} height={detail ? 315 : 900} loading={eager ? "eager" : "lazy"} {...(eager ? { fetchpriority: "high" } : {})} className={`${detail ? "aspect-[8/3]" : "aspect-[4/3]"} w-full object-contain`} />
            <span className="flex min-h-11 items-center justify-center gap-2 border-t border-[#e8ebf2] px-3 text-xs font-semibold text-[#424ec0] motion-safe:transition-colors group-hover:bg-[#eef0ff]"><Maximize2 size={14} aria-hidden="true" />Ampliar captura</span>
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-[#111320]/75" />
          <Dialog.Content className={`fixed left-1/2 top-1/2 z-[91] max-h-[calc(100dvh_-_2rem)] w-[calc(100%_-_2rem)] max-w-6xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-4 text-[#171827] sm:p-6 ${focus}`}>
            <Dialog.Title className="pr-14 text-base font-semibold">Detalle de la plataforma</Dialog.Title>
            <Dialog.Description className="mt-2 pr-10 text-sm leading-6 text-[#505b70]">{caption}</Dialog.Description>
            <div className="mt-4 max-h-[70dvh] overflow-auto rounded-lg border border-[#dce2ed]" tabIndex={0} aria-label="Imagen ampliada; puedes desplazarte para ver el detalle">
              <img src={src} alt={alt} className="h-auto min-w-[720px] w-full" />
            </div>
            <Dialog.Close className={`absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f0f2f7] ${focus}`} aria-label="Cerrar imagen"><X size={20} aria-hidden="true" /></Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <figcaption className="mt-3 text-xs leading-5 text-[#505b70]">{caption}</figcaption>
    </figure>
  );
}

function ProcessExplorer() {
  return (
    <Tabs.Root defaultValue="compras" activationMode="automatic" className="mt-9">
      <Tabs.List className="grid grid-cols-3 gap-1.5 border-b border-[#dce2ed] pb-5 sm:flex sm:flex-wrap sm:gap-2" aria-label="Explora el trabajo que puedes automatizar">
        {partnerProcesses.map((item, index) => <Tabs.Trigger key={item.id} value={item.id} aria-label={item.label} className={`flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#dce2ed] bg-white px-1 text-xs font-semibold text-[#505b70] data-[state=active]:border-[#171827] data-[state=active]:bg-[#171827] data-[state=active]:text-white motion-safe:transition-colors motion-safe:duration-150 sm:px-5 sm:text-sm ${focus}`}><span className="hidden text-xs tabular-nums sm:inline" aria-hidden="true">0{index + 1}</span><span className="sm:hidden">{item.shortLabel}</span><span className="hidden sm:inline">{item.label}</span></Tabs.Trigger>)}
      </Tabs.List>
      {partnerProcesses.map((item) => <Tabs.Content key={item.id} value={item.id} forceMount className={`pt-8 data-[state=inactive]:hidden ${focus}`}>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <div className="flex flex-col py-2">
            <h3 className="max-w-md text-balance text-[1.75rem] font-semibold leading-[1.18] tracking-[-0.025em] sm:text-3xl">{item.title}</h3>
            <p className="mt-4 max-w-md text-base leading-7 text-[#505b70]">{item.benefit}</p>
            <dl className="my-7 space-y-5 text-sm leading-6">
              <div><dt className="font-semibold text-[#424ec0]">Ruka se ocupa de</dt><dd className="mt-1 text-[#505b70]">{item.ruka}</dd></div>
              <div><dt className="font-semibold">Tu consultora aporta</dt><dd className="mt-1 text-[#505b70]">{item.consultant}</dd></div>
              <div><dt className="font-semibold">El equipo decide cuando hay</dt><dd className="mt-1 text-[#505b70]">{item.review}</dd></div>
            </dl>
            <Link to={item.path} className={`${link} mt-auto text-sm`}>Ver {item.label.toLowerCase()} <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="min-w-0 rounded-2xl bg-[#eef0f7] p-3 sm:p-5"><ProductImage src={item.image} alt={item.imageAlt} caption={item.caption} /></div>
        </div>
      </Tabs.Content>)}
    </Tabs.Root>
  );
}

function BriefBuilder() {
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
    <details className="group mt-8 rounded-xl border border-[#ccd2e7] bg-white">
      <summary className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden sm:px-6 ${focus}`}>
        ¿Quieres ordenar la idea con tu equipo?<ChevronDown size={19} className="shrink-0 group-open:rotate-180 motion-safe:transition-transform" aria-hidden="true" />
      </summary>
      <div className="border-t border-[#dce2ed] p-5 sm:p-6">
        <p className="mb-6 text-sm leading-6 text-[#505b70]">Arma un resumen para copiar. Es opcional: no necesitas completarlo para conversar. No se guarda ni se envía a Ruka.</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold" htmlFor="partner-process">Trabajo a revisar<select id="partner-process" value={process} onChange={(event) => { setProcess(event.target.value); setCopyState("idle"); }} className={`mt-2 min-h-12 w-full rounded-lg border border-[#b6bfd3] bg-white px-3 text-base font-normal ${focus}`}>{partnerProcesses.map((item) => <option key={item.label}>{item.label}</option>)}<option>Otro proceso recurrente</option></select></label>
          <label className="block text-sm font-semibold" htmlFor="partner-source">Fuentes o sistemas<select id="partner-source" value={source} onChange={(event) => { setSource(event.target.value); setCopyState("idle"); }} className={`mt-2 min-h-12 w-full rounded-lg border border-[#b6bfd3] bg-white px-3 text-base font-normal ${focus}`}>{partnerSources.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        <div className="mt-6 border-l-2 border-[#c7cdf7] pl-5" aria-label="Vista previa del resumen"><p className="font-semibold">{process}</p><p className="mt-1 text-sm leading-6 text-[#505b70]">Fuentes: {source}. Revisaremos qué se repite, dónde debe quedar el resultado, las reglas y cómo comprobar que funciona.</p></div>
        <button type="button" onClick={copyBrief} className={`${action} mt-6 border border-[#b6bfd3] text-sm`}>{copyState === "copied" ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}{copyState === "copied" ? "Resumen copiado" : "Copiar resumen"}</button>
        <p role="status" className="mt-3 min-h-6 text-sm leading-6 text-[#505b70]">{copyState === "copied" ? "Listo para compartir con tu equipo. No se envió a Ruka." : copyState === "fallback" ? "No pudimos copiarlo. Selecciona el texto del resumen y cópialo manualmente." : "No incluyas contraseñas ni datos de tus clientes."}</p>
        {copyState === "fallback" && <textarea aria-label="Resumen para copiar manualmente" readOnly value={brief} rows={10} className={`mt-3 w-full resize-y rounded-lg border border-[#b6bfd3] p-4 text-sm leading-6 ${focus}`} />}
      </div>
    </details>
  );
}

export default function Partners() {
  return (
    <div className="bg-white text-[#171827]">
      <MarketingSeo path={partnersPath} title={partnersTitle} description={partnersDescription} name="Automatización para consultoras de restaurantes" image="/partners-og.png" imageAlt="Ruka para consultoras de restaurantes: tu asesoría, en la operación." faqs={partnerFaqs} primaryEntity={{ "@type": "Service", "@id": "https://www.ruka.ai/partners#service", name: "Automatización operativa para consultoras de restaurantes", description: partnersDescription, serviceType: "Automatización de procesos operativos", provider: { "@id": organizationId }, audience: { "@type": "Audience", audienceType: "Consultoras de restaurantes y asesorías gastronómicas" }, url: "https://www.ruka.ai/partners" }} />
      <Navbar primaryAction={{ label: "Conversemos", path: "/one/contacto" }} />
      <main id="partners-main">
        {/* Clearance for the existing fixed navbar, not additional decorative whitespace. */}
        <header className="border-b border-[#dce2ed] pt-28 sm:pt-32">
          <div className={`${section} grid items-center gap-9 pb-12 pt-5 sm:pb-16 lg:grid-cols-[1fr_1.08fr] lg:gap-12 lg:pt-8`}>
            <div>
              <p className="text-sm font-semibold text-[#424ec0]">Para consultoras de restaurantes</p>
              <h1 className="mt-5 text-[clamp(2.35rem,11vw,3.2rem)] font-semibold leading-[1.06] tracking-[-0.04em] sm:text-[clamp(2.75rem,4.5vw,4.1rem)]">Tu asesoría,<br />en la operación.</h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-[#505b70]">Ruka automatiza compras, conciliaciones y costos para que tu consultora se enfoque en mejorar el negocio del cliente.</p>
              <div className="mt-8 flex flex-wrap gap-3"><Link to="/one/contacto" className={`${action} bg-[#4b59df] text-white hover:bg-[#3e4bc4]`}>Conversemos <ArrowRight size={18} aria-hidden="true" /></Link><a href="#colaboracion" className={`${action} border border-[#cbd2e2] bg-white`}>Cómo colaborar <ArrowDown size={17} aria-hidden="true" /></a></div>
            </div>
            <div className="min-w-0 rounded-2xl bg-[#eef0ff] p-4 sm:p-6">
              <p className="text-sm font-semibold text-[#424ec0]">Así se ve un control en la operación</p>
              <p className="mb-6 mt-3 max-w-md text-2xl font-semibold leading-tight tracking-[-0.02em]">Lo recibido, junto a la factura.<br />No en una conversación perdida.</p>
              <ProductImage src="/assets/partners/recepcion-detalle.webp" alt="El equipo registra lo recibido y sus diferencias directamente en Ruka." caption="Detalle de recepción en la demo de Ruka. Datos de ejemplo." eager detail />
            </div>
          </div>
        </header>

        <section className={`${section} py-16 sm:py-24`} aria-labelledby="partner-value">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <div><h2 id="partner-value" className={heading}>Que tu trabajo no termine en una recomendación.</h2><p className="mt-5 text-lg leading-8 text-[#505b70]">Ayudas al restaurante a trabajar mejor. Ruka pone a trabajar los procesos que hoy dependen de copiar, cruzar y perseguir información.</p></div>
            <div className="divide-y divide-[#dce2ed] border-y border-[#dce2ed]">
              {[
                ["Menos preparación", "Compras y costos organizados para analizar el negocio, en vez de reconstruir la información antes de cada reunión."],
                ["Seguimiento entre visitas", "Las reglas que defines se aplican en el flujo acordado. El control no depende solo de tu próxima revisión."],
                ["Más tiempo para decidir", "Las diferencias llegan con contexto. Tu experiencia se concentra en resolverlas y acompañar al cliente."],
              ].map(([title, copy], index) => <div key={title} className="flex gap-5 py-6"><span className="pt-1 text-xs font-semibold tabular-nums text-[#424ec0]" aria-hidden="true">0{index + 1}</span><div><h3 className="text-xl font-semibold tracking-[-0.015em]">{title}</h3><p className="mt-2 text-base leading-7 text-[#505b70]">{copy}</p></div></div>)}
            </div>
          </div>
        </section>

        <section className="bg-[#f7f8fc] py-16 sm:py-24" aria-labelledby="partner-work">
          <div className={section}>
            <h2 id="partner-work" className={`${heading} max-w-2xl`}>¿Qué trabajo le quitarías de encima a tu cliente?</h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#505b70]">Explora tres puntos de partida. En cada uno, tu criterio sigue siendo clave; cambia quién hace el trabajo repetitivo.</p>
            <ProcessExplorer />
          </div>
        </section>

        <section className={`${section} py-16 sm:py-24`} aria-labelledby="partner-roles">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <div className="rounded-2xl bg-[#171827] p-7 text-white sm:p-10">
              <h2 id="partner-roles" className={`${heading} max-w-lg`}>Tu metodología.<br />Nuestra ejecución.</h2>
              <p className="mt-6 text-base leading-8 text-[#d5d9e8]">No se trata de entregar una licencia y dejarte la implementación. Diseñamos contigo qué trabajo toma Ruka y cómo se conecta con tu servicio.</p>
              <Link to="/one" className={`mt-6 inline-flex min-h-12 items-center gap-2 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white focus-visible:!outline-white ${focus}`}>Conoce Ruka One <ArrowRight size={17} aria-hidden="true" /></Link>
            </div>
            <dl className="divide-y divide-[#dce2ed] text-base leading-7">
              <div className="pb-6"><dt className="text-lg font-semibold">La relación con el cliente no se improvisa.</dt><dd className="mt-2 text-[#505b70]">Acordamos quién lo acompaña, quién implementa y quién responde cuando hay una incidencia. Tu asesoría conserva un rol claro.</dd></div>
              <div className="py-6"><dt className="text-lg font-semibold">No depende de un solo POS.</dt><dd className="mt-2 text-[#505b70]">Partimos por los sistemas que usa cada restaurante. Confirmamos qué se puede leer y actualizar antes de ofrecer una solución.</dd><dd><Link to="/integraciones" className={`${link} mt-2 text-sm`}>Ver sistemas e integraciones <ArrowRight size={16} aria-hidden="true" /></Link></dd></div>
              <div className="pt-6"><dt className="text-lg font-semibold">El restaurante mantiene el control.</dt><dd className="mt-2 text-[#505b70]">Autoriza los accesos y las acciones. Las decisiones de negocio y las excepciones quedan en manos de las personas que definamos.</dd></div>
            </dl>
          </div>
        </section>

        <section id="colaboracion" className="scroll-mt-24 border-y border-[#dce2ed] bg-[#eef0ff] py-16 sm:py-24" aria-labelledby="partner-collaboration">
          <div className={section}>
            <div className="max-w-2xl"><p className="text-sm font-semibold text-[#424ec0]">El primer paso, sin complicarlo</p><h2 id="partner-collaboration" className={`${heading} mt-4`}>Un restaurante.<br />Un proceso. Un resultado claro.</h2><p className="mt-5 text-lg leading-8 text-[#505b70]">No necesitas traer toda tu cartera. Elijamos un cliente y un trabajo que hoy se repita a mano.</p></div>
            <ol className="mt-10 grid gap-8 border-t border-[#c8cfee] pt-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Nos cuentas el caso", "Qué se hace a mano, quién lo hace y qué sistemas toca."],
                ["Revisamos la viabilidad", "Conexiones, reglas y resultado esperado. Sin prometer lo que no podemos ejecutar."],
                ["Acordamos el alcance", "Implementación, operación, costos y responsables. Antes de proponérselo al cliente."],
                ["Probamos y decidimos", "Con su autorización, comprobamos el recorrido. Solo ampliamos lo que funciona."],
              ].map(([title, copy], index) => <li key={title}><span className="text-sm font-semibold tabular-nums text-[#424ec0]" aria-hidden="true">0{index + 1}</span><h3 className="mt-4 text-lg font-semibold">{title}</h3><p className="mt-2 text-sm leading-7 text-[#505b70]">{copy}</p></li>)}
            </ol>
            <div className="mt-10 border-t border-[#c8cfee] pt-7"><p className="text-base leading-7"><strong>El objetivo de la primera conversación:</strong> saber qué proceso vale la pena evaluar y qué necesitamos para hacerlo. Sin contraseñas ni archivos del cliente.</p></div>
            <BriefBuilder />
          </div>
        </section>

        <section className={`${section} py-16 sm:py-24`} aria-labelledby="partner-questions">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16"><div><h2 id="partner-questions" className={heading}>Antes de trabajar juntos.</h2><p className="mt-5 text-base leading-7 text-[#505b70]">Lo que conviene dejar claro desde el principio.</p></div><div className="divide-y divide-[#dce2ed] border-y border-[#dce2ed]">{partnerFaqs.map((faq) => <details key={faq.question} className="group py-1"><summary className={`flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-base font-semibold [&::-webkit-details-marker]:hidden ${focus}`}>{faq.question}<ChevronDown size={18} className="shrink-0 group-open:rotate-180 motion-safe:transition-transform" aria-hidden="true" /></summary><p className="pb-6 pr-6 text-base leading-8 text-[#505b70]">{faq.answer}</p></details>)}</div></div>
        </section>

        <section className={`${section} pb-20 sm:pb-24`} aria-labelledby="partner-invitation"><div className="flex flex-col gap-8 rounded-2xl bg-[#171827] p-8 text-white sm:p-12 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-2xl"><h2 id="partner-invitation" className={heading}>Piensa en ese cliente.<br />Partamos por ahí.</h2><p className="mt-5 max-w-xl text-base leading-7 text-[#d5d9e8]">El que todavía depende de una planilla, de cruzar facturas a mano o de perseguir datos antes de tomar una decisión.</p></div><div className="shrink-0"><Link to="/one/contacto" className={`${action} bg-white text-[#171827]`}>Conversemos <ArrowRight size={18} aria-hidden="true" /></Link><p className="mt-4 text-sm text-[#d5d9e8]">30 minutos · Sin compromiso</p></div></div></section>
      </main>
      <Footer />
    </div>
  );
}
