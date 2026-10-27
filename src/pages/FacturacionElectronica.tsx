import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Files,
  FileCheck2,
  FilePenLine,
  FolderOpen,
  Settings2,
  Search,
  ListChecks,
  Building2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MarketingSeo } from "@/components/seo/MarketingSeo";
import { organizationId } from "@/utils/structuredData";
import { billingAccess, billingContent } from "@/content/billingContent";
import { BillingDocumentGuide } from "@/components/resources/BillingDocumentGuide";
import { BillingStatusGuide } from "@/components/resources/BillingStatusGuide";
import { BillingPreparation } from "@/components/resources/BillingPreparation";
import { BillingCapture } from "@/components/resources/BillingCapture";
import { BillingTeamwork } from "@/components/resources/BillingTeamwork";

const action =
  "inline-flex min-h-12 items-center justify-center gap-3 whitespace-nowrap rounded-full bg-[#424ec0] px-6 font-semibold text-white transition-colors duration-150 hover:bg-[#343fad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 motion-reduce:transition-none";
const textLink =
  "inline-flex min-h-11 items-center gap-2 font-semibold text-[#424ec0] underline-offset-4 hover:underline focus-visible:outline-primary";
const heading =
  "text-3xl font-semibold leading-[1.12] tracking-[-.035em] sm:text-5xl";
const journey = [
  { label: "Configura", detail: "Tu empresa y sus permisos", icon: Settings2 },
  {
    label: "Prepara",
    detail: "Receptor, catálogo e importes",
    icon: FilePenLine,
  },
  { label: "Emite", detail: "Envío y consulta de estado", icon: FileCheck2 },
  { label: "Encuentra", detail: "XML, PDF y referencias", icon: FolderOpen },
];

function BillingOperations() {
  return (
    <section
      id="gestion"
      aria-labelledby="billing-management-title"
      className="scroll-mt-28 px-5 py-16 sm:px-8 sm:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <header className="max-w-3xl">
          <h2 id="billing-management-title" className={heading}>
            Tu trabajo no termina al emitir.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#586176]">
            Después toca encontrar documentos, preparar nuevas ventas y revisar
            el mes. La información sigue contigo.
          </p>
        </header>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16">
          <div className="rounded-2xl bg-[#eef0ff] p-5 sm:p-8">
            <h3 className="mb-3 text-2xl font-semibold tracking-tight">
              Un período, con el detalle a mano.
            </h3>
            <p className="mb-6 leading-7 text-[#505b70]">
              Consulta compras y ventas. Distingue los importes, revisa las
              notas de crédito y vuelve al documento cuando algo no cuadra.
            </p>
            <BillingCapture kind="book" />
            <Link
              to="/ayuda/preparar-cierre-contable"
              className={`${textLink} mt-5`}
            >
              Preparar el cierre del mes{" "}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="space-y-8 lg:py-3">
            {[
              {
                icon: Search,
                title: "Encuentra esa factura.",
                text: "Busca por receptor o folio. Consulta su estado y recupera el XML o PDF sin reconstruir el historial de la venta.",
              },
              {
                icon: Files,
                title: "Prepara varias. Revisa cada una.",
                text: "La facturación por lote permite trabajar con varios documentos y revisión previa. Comprueba los resultados individualmente.",
              },
              {
                icon: Building2,
                title: "Cada empresa, por separado.",
                text: "Trabaja en el contexto de la empresa activa, con sus permisos y configuración. No mezcles documentos de distintos emisores.",
              },
            ].map((item) => (
              <article key={item.title} className="flex items-start gap-4">
                <item.icon
                  size={22}
                  strokeWidth={1.5}
                  className="mt-1 shrink-0 text-[#424ec0]"
                  aria-hidden="true"
                />
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-7 text-[#586176]">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t border-[#dce2ed] pt-9">
          <h3 className="text-2xl font-semibold tracking-tight">
            Y para el trabajo contable.
          </h3>
          <p className="mt-3 max-w-3xl leading-7 text-[#586176]">
            Reúne las fuentes del período, revisa informes y prepara el cierre.
            Confirmamos contigo los módulos que necesita tu empresa.
          </p>
          <dl className="mt-7 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="font-semibold">Cartolas importadas</dt>
              <dd className="mt-2 text-sm leading-7 text-[#586176]">
                Conciliación a partir de los movimientos que importas. No
                implica una conexión automática con todos los bancos.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Honorarios recibidos</dt>
              <dd className="mt-2 text-sm leading-7 text-[#586176]">
                Revisión de honorarios y registro de sus pagos. Registrar un
                pago no mueve dinero ni emite una boleta de honorarios.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Borrador F29</dt>
              <dd className="mt-2 text-sm leading-7 text-[#586176]">
                Una preparación revisable, con fuentes y ajustes. No es una
                declaración presentada ni reemplaza la revisión tributaria.
              </dd>
            </div>
          </dl>
          <Link
            to="/guias/compras/clasificacion-compras-entrega-contable"
            className={`${textLink} mt-5`}
          >
            Organizar la entrega a contabilidad{" "}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function FacturacionElectronica() {
  const content = billingContent;
  const url = `https://www.ruka.ai${content.path}`;
  return (
    <div className="min-h-screen bg-white text-[#171827]">
      <MarketingSeo
        path={content.path}
        title={content.title}
        description={content.description}
        name={content.name}
        faqs={content.faqs}
        primaryEntity={{
          "@type": "Service",
          "@id": `${url}#service`,
          name: content.name,
          url,
          description: content.description,
          serviceType: content.name,
          category: "Facturación electrónica y gestión contable",
          provider: { "@id": organizationId },
          areaServed: { "@type": "Country", name: "Chile", identifier: "CL" },
        }}
      />
      <Navbar />
      <main>
        <section className="px-5 pb-12 pt-28 sm:px-8 sm:pb-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-12">
            <div>
              <p className="text-sm font-semibold text-[#424ec0]">
                RukaFactura para empresas en Chile
              </p>
              <h1 className="mt-5 text-[clamp(2.25rem,3.65vw,3.5rem)] font-semibold leading-[1.08] tracking-[-.04em]">
                <span className="block">Facturación electrónica.</span>{" "}
                <span className="block">Todo a mano.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-[#586176]">
                {content.lead}
              </p>
              <p className="mt-4 text-sm font-semibold leading-6 text-[#424ec0]">
                Hasta 60 ítems por factura · Roles y permisos por empresa
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Link to="/register" className={action}>
                  Agendar 30 min <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a href="#documentos" className={textLink}>
                  Explorar documentos{" "}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
            <div className="rounded-2xl bg-[#eef0ff] p-5 sm:p-8">
              <div className="mb-7 flex items-center gap-3 text-[#424ec0]">
                <FileCheck2 size={23} strokeWidth={1.5} aria-hidden="true" />
                <span className="font-semibold">Antes de emitir</span>
              </div>
              <p className="mb-5 max-w-sm text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
                El detalle que revisas. El total que confirmas.
              </p>
              <BillingCapture kind="preview" priority />
            </div>
          </div>
        </section>

        <div className="border-y border-[#dce2ed] bg-[#f8f9fc] px-5 py-4 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 lg:flex-row lg:items-center">
            <nav
              aria-label="En esta página"
              className="flex flex-wrap gap-x-6 gap-y-1 text-sm font-semibold text-[#505b70]"
            >
              {[
                ["#documentos", "Documentos"],
                ["#equipo", "Catálogo y equipo"],
                ["#mcp", "IA y MCP"],
                ["#como-funciona", "Cómo funciona"],
                ["#gestion", "Gestión contable"],
                ["#preparar", "Cómo empezar"],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="inline-flex min-h-11 items-center hover:text-[#424ec0] focus-visible:outline-primary"
                >
                  {label}
                </a>
              ))}
            </nav>
            <a href={billingAccess} className={`${textLink} text-sm`}>
              Ya tengo cuenta <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>

        <BillingDocumentGuide />
        <BillingTeamwork />

        <section
          id="como-funciona"
          aria-labelledby="billing-flow-title"
          className="scroll-mt-28 bg-[#f8f9fc] px-5 py-16 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <header className="max-w-3xl">
              <h2 id="billing-flow-title" className={heading}>
                Del primer borrador al documento que necesitas.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#586176]">
                Usa tu catálogo, revisa los importes y comprueba el resultado.
                Cada parte tiene su lugar.
              </p>
            </header>
            <nav
              aria-label="Recorrido de facturación"
              className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-4"
            >
              {journey.map((item, index) => (
                <a
                  key={item.label}
                  href={`#facturacion-paso-${index + 1}`}
                  className="flex min-h-20 items-center gap-3 rounded-lg border border-[#dce2ed] bg-white p-4 transition-colors duration-150 hover:border-[#424ec0] focus-visible:outline-primary motion-reduce:transition-none"
                >
                  <item.icon
                    size={22}
                    strokeWidth={1.5}
                    className="shrink-0 text-[#424ec0]"
                    aria-hidden="true"
                  />
                  <span>
                    <span className="block font-semibold">{item.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-[#586176]">
                      {item.detail}
                    </span>
                  </span>
                </a>
              ))}
            </nav>
            <ol className="mt-10 grid gap-x-12 gap-y-9 lg:grid-cols-2">
              {content.flow.map((step, index) => (
                <li
                  key={step.number}
                  id={`facturacion-paso-${index + 1}`}
                  className="scroll-mt-28 border-t border-[#dce2ed] pt-6"
                >
                  <div className="flex items-baseline gap-4">
                    <span
                      className="text-sm font-semibold text-[#424ec0]"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <h3 className="text-xl font-semibold tracking-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-3 pl-6 leading-7 text-[#586176]">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
            <BillingStatusGuide />
          </div>
        </section>

        <BillingOperations />
        <BillingPreparation />

        <section
          aria-labelledby="billing-fit-title"
          className="px-5 py-16 sm:px-8 sm:py-24"
        >
          <div className="mx-auto max-w-7xl">
            <h2 id="billing-fit-title" className={heading}>
              Facturar y registrar compras no son lo mismo.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#586176]">
              Ruka puede acompañar ambos trabajos. Parte por el documento y por
              quién lo emite.
            </p>
            <div className="mt-9 grid gap-8 md:grid-cols-2 md:gap-12">
              <article className="border-t border-[#dce2ed] pt-6">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Tu empresa emite.
                </h3>
                <p className="mt-3 leading-7 text-[#586176]">
                  Vendes un producto o servicio y necesitas preparar el
                  documento para tu cliente. Ese es el trabajo de RukaFactura.
                </p>
                <a href="#preparar" className={`${textLink} mt-4`}>
                  Preparar mi facturación{" "}
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              </article>
              <article className="border-t border-[#dce2ed] pt-6">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Tu proveedor emite.
                </h3>
                <p className="mt-3 leading-7 text-[#586176]">
                  Recibes una factura y necesitas leer sus líneas, revisar la
                  compra y llevar los datos a tus sistemas. Ese es el registro
                  de compras.
                </p>
                <Link
                  to="/productos/registro-de-compras"
                  className={`${textLink} mt-4`}
                >
                  Ver registro de compras{" "}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              </article>
            </div>
            <aside className="mt-9 flex flex-col items-start gap-4 rounded-xl bg-[#f7f8fc] p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-2xl text-sm leading-7 text-[#586176]">
                <strong className="text-[#171827]">
                  ¿Estás integrando tu propio sistema?
                </strong>{" "}
                La API pública documentada permite consultar compras y recibir
                eventos. No es una API de emisión.
              </p>
              <Link
                to="/desarrolladores"
                className={`${textLink} shrink-0 text-sm`}
              >
                Ver API de compras <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </section>

        <section
          id="preguntas"
          className="scroll-mt-28 px-5 pb-16 sm:px-8 sm:pb-24"
          aria-labelledby="product-faq-title"
        >
          <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[.7fr_1.3fr] lg:gap-16">
            <div>
              <h2
                id="product-faq-title"
                className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl"
              >
                Antes de empezar a facturar.
              </h2>
              <p className="mt-4 leading-7 text-[#586176]">
                Respuestas sobre documentos, acceso y alcance. Si tu caso es
                distinto, lo revisamos contigo.
              </p>
            </div>
            <div className="border-t border-[#dce2ed]">
              {content.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group border-b border-[#dce2ed]"
                >
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-5 text-base font-semibold focus-visible:outline-primary [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <ChevronDown
                      size={18}
                      className="shrink-0 transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="pb-6 leading-7 text-[#586176]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 sm:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 rounded-2xl bg-[#eef0ff] p-7 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <ListChecks
                size={26}
                className="mb-5 text-[#424ec0]"
                aria-hidden="true"
              />
              <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                Veamos cómo facturas hoy.
              </h2>
              <p className="mt-4 max-w-2xl leading-7 text-[#505b70]">
                Cuéntanos qué documentos emites y cómo los gestionas. Revisamos
                contigo la configuración y los módulos que necesitas.
              </p>
            </div>
            <div>
              <Link to="/register" className={`${action} w-full sm:w-auto`}>
                Agendar 30 min <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <p className="mt-3 text-center text-sm text-[#586176]">
                30 min · Sin compromiso
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
