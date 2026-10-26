import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ChevronDown, FileCheck2, FilePenLine, FolderOpen, Settings2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { organizationId } from "@/utils/structuredData";
import { resourceLinkClass } from "@/components/resources/ResourceLayout";
import { billingAccess, billingContent } from "@/content/billingContent";

function BillingVisual() {
  return <figure className="overflow-hidden rounded-2xl border border-[#dce2ed] bg-white shadow-[0_20px_60px_-25px_rgba(25,30,65,.18)]">
    <div className="flex items-center gap-3 border-b border-[#dce2ed] px-6 py-5 text-sm font-medium"><FileCheck2 size={20} className="text-[#424ec0]" aria-hidden="true" /> RukaFactura · Antes de emitir</div>
    <div className="p-4 sm:p-6"><p className="mb-5 text-2xl font-semibold tracking-tight">Revisa el detalle. Después confirma.</p><a href="/assets/facturacion/revision-importes-demo.jpg" target="_blank" rel="noopener noreferrer" className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4" aria-label="Ampliar captura de la revisión de importes; abre otra pestaña"><img src="/assets/facturacion/revision-importes-demo.jpg" width="880" height="212" alt="Vista previa de una factura ficticia: neto de 150.000 pesos, IVA de 28.500 y total de 178.500." className="h-auto w-full rounded-lg border border-[#e5e8f0]" /></a><figcaption className="mt-5 text-sm leading-6 text-[#606a7e]">Captura de la demo con datos ficticios. No se emitió este documento. La interfaz puede variar según versión y módulos habilitados.</figcaption></div>
  </figure>;
}

function BillingScope() {
  return <>
    <section className="border-b border-[#dce2ed] px-5 py-8 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><h2 className="font-semibold">¿Ya tienes acceso a RukaFactura?</h2><p className="mt-1 text-sm leading-6 text-[#586176]">Entra a tu cuenta y elige la empresa con la que vas a trabajar.</p></div><a href={billingAccess} className={resourceLinkClass}>Entrar al facturador <ArrowUpRight size={18} aria-hidden="true" /></a></div></section>
    <nav aria-label="Ayuda de facturación" className="mx-auto flex max-w-7xl flex-wrap gap-x-8 gap-y-3 px-5 pt-8 sm:px-8"><Link to="/ayuda/comenzar-rukafactura" className={resourceLinkClass}>Preparar mi primera emisión <ArrowUpRight size={16} aria-hidden="true" /></Link><Link to="/ayuda/preparar-cierre-contable" className={resourceLinkClass}>Revisar el cierre del mes <ArrowUpRight size={16} aria-hidden="true" /></Link></nav>
    <section className="px-5 py-20 sm:px-8 sm:py-24"><div className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-16"><header><p className="text-sm font-semibold text-[#424ec0]">También después de emitir</p><h2 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-[-.04em] sm:text-5xl">El mes no termina en la última factura.</h2><p className="mt-6 text-lg leading-8 text-[#586176]">Compras, ventas y registros contables tienen que conversar. RukaFactura reúne información para revisar el período, encontrar diferencias y preparar el trabajo de contabilidad.</p><Link to="/guias/compras/clasificacion-compras-entrega-contable" className={`${resourceLinkClass} mt-5`}>Preparar una entrega contable <ArrowUpRight size={18} aria-hidden="true" /></Link></header><div className="divide-y divide-[#dce2ed] border-y border-[#dce2ed]">{[
      ["Compras y ventas por período", "Consulta documentos e importes, distingue notas de crédito y revisa la cobertura de una importación. Un total del libro no equivale al saldo de caja ni al IVA a declarar."],
      ["Cada empresa, en su contexto", "Trabaja con la empresa activa y sus permisos. Sus documentos y configuraciones deben revisarse por separado, aunque administres más de una."],
      ["Contabilidad con fuentes revisables", "Reúne registros, honorarios recibidos y cartolas importadas. Consulta informes y prepara el borrador F29 sin confundirlo con una declaración ya presentada."],
    ].map(([title, description]) => <article key={title} className="py-7"><h3 className="text-xl font-semibold tracking-tight">{title}</h3><p className="mt-3 leading-7 text-[#586176]">{description}</p></article>)}</div></div>
    <figure className="mt-12 overflow-hidden rounded-xl border border-[#dce2ed] bg-white p-4 sm:p-8"><a href="/assets/facturacion/libro-compras-demo.jpg" target="_blank" rel="noopener noreferrer" className="block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4" aria-label="Ampliar captura del libro de compras; abre otra pestaña"><img src="/assets/facturacion/libro-compras-demo.jpg" width="917" height="363" loading="lazy" decoding="async" alt="Libro de compras de una empresa ficticia, con proveedor, RUT, fecha e importes netos, exentos e IVA separados." className="mx-auto h-auto w-full max-w-[917px]" /></a><figcaption className="mx-auto mt-5 max-w-[917px] text-sm leading-6 text-[#606a7e]">Libro de compras en la demo: datos ficticios, no operaciones de clientes. Revisa las fuentes y la integridad del período antes de usarlas en contabilidad.</figcaption></figure>
    </div></section>
    <aside className="bg-[#eef0ff] px-5 py-10 sm:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 md:gap-16"><div><h2 className="text-xl font-semibold">¿Lo que necesitas es registrar compras?</h2><p className="mt-3 leading-7 text-[#505b70]">Si el documento lo emite tu proveedor, el trabajo empieza al recibirlo: leerlo, revisar sus líneas y dejarlo disponible en tus sistemas.</p><Link to="/productos/registro-de-compras" className={`${resourceLinkClass} mt-3`}>Ver registro de compras <ArrowUpRight size={17} aria-hidden="true" /></Link></div><div><h2 className="text-xl font-semibold">¿Buscas llevar datos a tu propio sistema?</h2><p className="mt-3 leading-7 text-[#505b70]">La API pública documentada de Ruka permite consultar compras y recibir eventos. No es una API de emisión de facturas.</p><Link to="/desarrolladores" className={`${resourceLinkClass} mt-3`}>Explorar la API de compras <ArrowUpRight size={17} aria-hidden="true" /></Link></div></div></aside>
  </>;
}

export default function FacturacionElectronica() {
  const content = billingContent;
  const url = `https://www.ruka.ai${content.path}`;
  const journey = [
    { label: "Empresa", detail: "Habilitación y permisos", icon: Settings2 },
    { label: "Borrador", detail: "Receptor, líneas e importes", icon: FilePenLine },
    { label: "Emisión", detail: "Envío y consulta de estado", icon: FileCheck2 },
    { label: "Respaldo", detail: "Documentos y registros", icon: FolderOpen },
  ];
  return <div className="min-h-screen bg-white text-[#171827]">
    <MarketingSeo path={content.path} title={content.title} description={content.description} name={content.name} faqs={content.faqs} primaryEntity={{ "@type": "Service", "@id": `${url}#service`, name: content.name, url, description: content.description, serviceType: content.name, category: "Automatización de procesos operativos con agentes IA", provider: { "@id": organizationId }, areaServed: { "@type": "Country", name: "Chile", identifier: "CL" } }} />
    <Navbar />
    <main>
      <section className="px-5 pb-14 pt-28 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold text-[#424ec0]">RukaFactura · Facturación electrónica</p>
          <div className="mt-5 grid gap-7 lg:grid-cols-[1.1fr_.9fr] lg:items-start lg:gap-20">
            <h1 className="max-w-3xl text-balance text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[1.06] tracking-[-.045em]">{content.h1}</h1>
            <div><p className="max-w-xl text-lg leading-8 text-[#586176]">{content.lead}</p><div className="mt-7 flex flex-wrap items-center gap-5"><Link to="/register" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-primary px-6 font-semibold text-white hover:bg-[#424ec0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">Agendar 30 min <ArrowRight size={18} aria-hidden="true" /></Link><a href="#como-funciona" className={resourceLinkClass}>Ver cómo funciona</a></div><p className="mt-3 text-sm text-[#60687a]">30 min · Sin compromiso</p></div>
          </div>
          <nav aria-label="Recorrido de facturación" className="mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border border-[#dce2ed] bg-[#f8f9fc] lg:grid-cols-4">
            {journey.map((item, index) => <a key={item.label} href={`#facturacion-paso-${index + 1}`} className="group border-b border-r border-[#dce2ed] p-5 transition-colors hover:bg-[#eef0ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:p-7"><div className="flex items-center justify-between"><item.icon size={25} strokeWidth={1.5} className="text-[#424ec0]" aria-hidden="true" /><ArrowRight size={17} className="text-[#8e97a8]" aria-hidden="true" /></div><span className="mt-5 block text-xl font-semibold">{item.label}</span><span className="mt-2 block text-sm leading-6 text-[#60687a]">{item.detail}</span></a>)}
          </nav>
        </div>
      </section>
      <section aria-label="Resultados de Facturación electrónica" className="mx-auto grid max-w-[1344px] gap-8 px-5 pb-16 sm:px-8 md:grid-cols-3">{content.outcomes.map(item => <article key={item.title} className="border-t border-[#dce2ed] pt-6"><h2 className="text-lg font-semibold">{item.title}</h2><p className="mt-3 text-sm leading-7 text-[#586176]">{item.description}</p></article>)}</section>
      <section id="como-funciona" className="scroll-mt-28 bg-[#f8f9fc] px-5 py-16 sm:px-8 sm:py-20"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
        <header className="lg:sticky lg:top-28 lg:self-start"><p className="text-sm font-semibold text-[#424ec0]">Cómo funciona</p><h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{content.flowTitle}</h2><p className="mt-5 leading-8 text-[#586176]">{content.flowLead}</p></header>
        <ol className="space-y-9">{content.flow.map((step, index) => <li key={step.number} id={`facturacion-paso-${index + 1}`} className="scroll-mt-28 border-t border-[#dce2ed] pt-6"><div className="flex items-start gap-4"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#cbd2df] bg-white text-xs font-semibold text-[#424ec0]">{step.number}</span><div><h3 className="text-xl font-semibold tracking-tight">{step.title}</h3><p className="mt-3 leading-7 text-[#586176]">{step.description}</p></div></div>{index === 1 && <div className="mt-6"><BillingVisual /></div>}</li>)}</ol>
      </div></section>
      <BillingScope />
      <section className="mx-auto grid max-w-[1344px] gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[.7fr_1.3fr] lg:gap-20" aria-labelledby="product-faq-title"><div><p className="text-sm font-semibold text-[#424ec0]">Preguntas frecuentes</p><h2 id="product-faq-title" className="mt-4 text-3xl font-semibold leading-tight tracking-tight">Antes de empezar a facturar.</h2></div><div className="border-t border-[#dce2ed]">{content.faqs.map(faq => <details key={faq.question} className="group border-b border-[#dce2ed]"><summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 text-base font-semibold focus-visible:outline-primary [&::-webkit-details-marker]:hidden">{faq.question}<ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></summary><p className="pb-6 leading-7 text-[#586176]">{faq.answer}</p></details>)}</div></section>
      <section className="px-5 pb-20 sm:px-8"><div className="mx-auto grid max-w-7xl gap-7 rounded-2xl bg-[#171827] p-8 text-white sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center"><div><h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight">{content.promise}</h2><p className="mt-4 max-w-2xl leading-7 text-[#c4c9de]">Muéstranos el proceso. En 30 minutos vemos contigo qué parte podría tomar Ruka.</p></div><Link to="/register" className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-6 font-semibold text-[#171827] hover:bg-[#eef0ff] focus-visible:outline-white">Agendar 30 min <ArrowRight size={18} aria-hidden="true" /></Link></div></section>
    </main><Footer />
  </div>;
}
