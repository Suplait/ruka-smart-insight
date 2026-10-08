import { useMemo, useState } from "react";
import { ArrowRight, Database, FileText, Landmark, Plug, Search, Store, X, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { MarketingSeo } from "@/components/seo/MarketingSeo";

type Family = "Documentos" | "Gestión" | "Ventas" | "Fuentes propias";
type Integration = { name: string; family: Family; logo?: string; detail: string; Icon?: LucideIcon };

const integrations: readonly Integration[] = [
  { name: "SII", family: "Documentos", logo: "/integrations/sii.jpg", detail: "Documentos tributarios" },
  { name: "Ingefactura", family: "Documentos", logo: "/integrations/ingefactura.png", detail: "Facturación electrónica" },
  { name: "eBill", family: "Documentos", logo: "/integrations/ebill.png", detail: "Facturación electrónica" },
  { name: "iDTECloud", family: "Documentos", logo: "/integrations/idtecloud.png", detail: "Documentos electrónicos" },
  { name: "DTEiGlobal", family: "Documentos", logo: "/integrations/dteiglobal.png", detail: "Documentos electrónicos" },
  { name: "Facturacion.cl", family: "Documentos", logo: "/integrations/facturacion.png", detail: "Facturación electrónica" },
  { name: "Defontana", family: "Gestión", logo: "/integrations/defontana.svg", detail: "ERP y gestión" },
  { name: "Nubox", family: "Gestión", logo: "/integrations/nubox.svg", detail: "Contabilidad y gestión" },
  { name: "Chipax", family: "Gestión", logo: "/integrations/chipax.png", detail: "Finanzas y caja" },
  { name: "KAME", family: "Gestión", logo: "/integrations/kame.png", detail: "ERP y operación" },
  { name: "SAP", family: "Gestión", logo: "/integrations/sap.svg", detail: "ERP empresarial" },
  { name: "Bancos", family: "Gestión", detail: "Cartolas y movimientos", Icon: Landmark },
  { name: "Toteat", family: "Ventas", logo: "/integrations/toteat.svg", detail: "POS y restaurantes" },
  { name: "Fudo", family: "Ventas", logo: "/integrations/fudo.svg", detail: "POS y restaurantes" },
  { name: "Justo", family: "Ventas", logo: "/integrations/justo.svg", detail: "Ventas y despacho" },
  { name: "Bsale", family: "Ventas", logo: "/integrations/bsale.png", detail: "Ventas e inventario" },
  { name: "Excel", family: "Fuentes propias", detail: "Planillas operativas", Icon: FileText },
  { name: "CSV", family: "Fuentes propias", detail: "Exportaciones", Icon: FileText },
  { name: "XML", family: "Fuentes propias", detail: "Documentos estructurados", Icon: FileText },
  { name: "PDF", family: "Fuentes propias", detail: "Documentos y respaldos", Icon: FileText },
  { name: "Correo", family: "Fuentes propias", detail: "Bandejas operativas", Icon: FileText },
  { name: "API", family: "Fuentes propias", detail: "Servicios conectados", Icon: Plug },
  { name: "Sistema propio", family: "Fuentes propias", detail: "Desarrollos internos", Icon: Database },
] as const;

const families: readonly { name: Family; description: string; Icon: LucideIcon }[] = [
  { name: "Documentos", description: "Facturación y documentos tributarios", Icon: FileText },
  { name: "Gestión", description: "ERP, contabilidad, finanzas y bancos", Icon: Database },
  { name: "Ventas", description: "POS, ecommerce y canales de venta", Icon: Store },
  { name: "Fuentes propias", description: "Archivos, APIs y sistemas internos", Icon: Plug },
];

const faqs = [
  { question: "¿Qué pasa si mi sistema no aparece?", answer: "Que no esté listado no significa que no podamos conectarlo. Revisamos el acceso disponible y la información que necesita el proceso." },
  { question: "¿Ruka necesita reemplazar alguno de mis sistemas?", answer: "No. Ruka está diseñada para trabajar sobre las herramientas que ya usa tu empresa." },
  { question: "¿Una integración permite leer y escribir información?", answer: "Depende del sistema, sus permisos y el proceso acordado. Antes de implementar definimos exactamente qué información se lee y qué acciones puede ejecutar Ruka." },
] as const;

export default function Integraciones() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("es");
  const groups = useMemo(() => families.map((family) => ({
    ...family,
    items: integrations.filter((integration) => integration.family === family.name && `${integration.name} ${integration.detail}`.toLocaleLowerCase("es").includes(normalized)),
  })).filter((family) => family.items.length), [normalized]);

  return (
    <div className="min-h-screen bg-[#fbfcff] text-[#171827]">
      <MarketingSeo
        path="/integraciones"
        name="Integraciones"
        title="Integraciones de Ruka | ERP, POS, SII y más"
        description="Ruka trabaja con SII, ERP, sistemas contables, POS, bancos, archivos y sistemas propios para automatizar procesos sin reemplazar tus herramientas."
        faqs={faqs}
        primaryEntity={{
          "@type": "ItemList",
          "@id": "https://www.ruka.ai/integraciones#catalogo",
          name: "Sistemas y fuentes con los que trabaja Ruka",
          numberOfItems: integrations.length,
          itemListElement: integrations.map((integration, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "Thing",
              name: integration.name,
              description: integration.detail,
            },
          })),
        }}
      />
      <Navbar />
      <main>
        <section className="overflow-hidden px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
            <div>
              <p className="text-sm font-semibold text-primary">Integraciones</p>
              <h1 className="mt-5 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-7xl">Trabajamos donde ya vive tu operación.</h1>
            </div>
            <div>
              <p className="max-w-2xl text-lg leading-8 text-[#5c6477]">Sistemas de gestión, facturadores, POS, bancos, archivos o desarrollos propios. Conectamos lo que Ruka necesita sin pedirte que cambies los sistemas que ya usas.</p>
              <div className="relative mt-7 max-w-xl">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" aria-hidden="true" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-14 w-full rounded-xl border border-[#cfd6e5] bg-white pl-12 pr-12 text-base text-[#202231] shadow-[0_10px_35px_rgba(37,49,90,0.06)] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#8b94a7] focus:border-primary focus:shadow-[0_0_0_4px_rgba(80,101,233,0.1)]" placeholder="Busca SII, SAP, Toteat..." aria-label="Buscar una integración" />
                {query ? <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#687084] hover:bg-[#eef1f7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Limpiar búsqueda"><X className="h-4 w-4" /></button> : null}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#dfe4ef] bg-white px-5 py-16 sm:px-8 sm:py-20" aria-live="polite">
          <div className="mx-auto max-w-7xl">
            {groups.length ? (
              <div className="divide-y divide-[#dfe4ef] border-y border-[#dfe4ef]">
                {groups.map(({ name, description, Icon, items }) => (
                  <section key={name} className="grid gap-7 py-10 lg:grid-cols-[16rem_1fr] lg:gap-12">
                    <div>
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#eef1ff] text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                      <h2 className="mt-4 text-xl font-semibold">{name}</h2>
                      <p className="mt-2 text-sm leading-6 text-[#697286]">{description}</p>
                    </div>
                    <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 xl:grid-cols-3">
                      {items.map((item) => {
                        const ItemIcon = item.Icon;
                        return (
                          <li key={item.name} className="flex min-h-20 items-center gap-4 border-b border-[#e8ebf2] py-4">
                            <span className="flex h-10 w-20 shrink-0 items-center justify-center">
                              {item.logo ? <img src={item.logo} alt={`Logo de ${item.name}`} className="max-h-8 max-w-[5rem] object-contain" loading="lazy" /> : ItemIcon ? <ItemIcon className="h-5 w-5 text-[#657087]" aria-hidden="true" /> : null}
                            </span>
                            <span className="min-w-0"><span className="block text-sm font-semibold text-[#252838]">{item.name}</span><span className="mt-1 block text-xs leading-5 text-[#737c8e]">{item.detail}</span></span>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-2xl font-semibold">No encontramos “{query}” en el catálogo.</p>
                <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[#667084]">Probablemente también podamos conectarlo. Revisamos contigo cómo acceder a su información.</p>
                <Link to="/register" className="mt-7 inline-flex min-h-12 items-center rounded-full bg-primary px-6 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">Cuéntanos qué sistema usas <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </div>
            )}
          </div>
        </section>

        <section className="px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-sm font-semibold text-primary">Cómo conectamos</p>
              <h2 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em]">La integración empieza por el proceso.</h2>
              <p className="mt-5 text-lg leading-8 text-[#5d6578]">No conectamos herramientas por acumular logos. Definimos qué información necesita Ruka y qué debe hacer con ella.</p>
            </div>
            <ol className="grid gap-4 sm:grid-cols-3">
              {["Muéstranos el trabajo manual", "Revisamos fuentes y accesos", "Conectamos el flujo necesario"].map((step, index) => (
                <li key={step} className="border-t-2 border-[#cfd6e8] pt-5"><span className="font-mono text-sm font-semibold text-primary">0{index + 1}</span><p className="mt-4 text-lg font-semibold leading-7">{step}</p></li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-[#dfe4ef] bg-white px-5 py-20 sm:px-8 sm:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.04em]">Preguntas sobre conexiones.</h2>
            <div className="border-t border-[#dfe4ef]">
              {faqs.map((faq) => <details key={faq.question} className="group border-b border-[#dfe4ef] py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{faq.question}<span className="text-primary transition-transform duration-200 group-open:rotate-45" aria-hidden="true">+</span></summary><p className="max-w-3xl pt-4 text-base leading-7 text-[#626a7d]">{faq.answer}</p></details>)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
