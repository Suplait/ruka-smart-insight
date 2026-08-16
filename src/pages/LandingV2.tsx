import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  Banknote,
  CheckCircle2,
  Database,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Braces,
  Layers3,
  Landmark,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Play,
  ReceiptText,
  Sparkles,
  Store,
  UsersRound,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import OperationalGapSection from "@/components/landing-v2/OperationalGapSection";
import { WorkSection } from "@/components/landing-v2/WorkSection";

const CTA_LABEL = "Agendar 20 min";
const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const navItems = [
  { label: "Trabajo", id: "trabajo" },
  { label: "Demo", id: "demo" },
  { label: "Integraciones", id: "integraciones" },
  { label: "Precios", id: "precios" },
] as const;

const rukaDemoEmbedUrl = "https://prueba.ruka.ai/?embed=1&source=landing-v2";

const coverSources: Array<[string, LucideIcon]> = [
  ["SII", ReceiptText],
  ["POS", Store],
  ["Banco", Banknote],
  ["ERP", Database],
  ["Planillas", FileSpreadsheet],
  ["Otros", Layers3],
];

const coverOutcomes = [
  "Compras registradas",
  "Conciliaciones ejecutadas",
  "Margen al día",
  "Sistemas actualizados",
] as const;

const coverOutputPaths = [
  "M858 154 C920 154, 902 58, 952 58",
  "M858 176 C918 176, 908 140, 952 140",
  "M858 198 C918 198, 908 222, 952 222",
  "M858 220 C920 220, 902 304, 952 304",
] as const;

type EcosystemItem = {
  name: string;
  image?: string;
  icon?: LucideIcon;
  logoSurface?: "dark";
  showName?: boolean;
};

type EcosystemGroup = {
  category: string;
  description: string;
  items: readonly EcosystemItem[];
};

const ecosystemGroups: readonly EcosystemGroup[] = [
  {
    category: "Facturación y documentos",
    description: "Emisión, recepción y descarga de documentos tributarios.",
    items: [
      { name: "SII", image: "/integrations/sii.jpg" },
      { name: "Ingefactura", image: "/integrations/ingefactura.png" },
      { name: "eBill", image: "/integrations/ebill.png" },
      { name: "iDTECloud", image: "/integrations/idtecloud.png", logoSurface: "dark" },
      { name: "DTEiGlobal", image: "/integrations/dteiglobal.png", showName: true },
      { name: "Facturacion.cl", image: "/integrations/facturacion.png" },
    ],
  },
  {
    category: "Gestión y contabilidad",
    description: "Información contable, compras, pagos y gestión operacional.",
    items: [
      { name: "Defontana", image: "/integrations/defontana.svg" },
      { name: "Nubox", image: "/integrations/nubox.svg" },
      { name: "Chipax", image: "/integrations/chipax.png" },
      { name: "Bancos", icon: Landmark },
      { name: "ERP propio", icon: Database },
    ],
  },
  {
    category: "Ventas y POS",
    description: "Ventas, productos, locales, precios y movimientos de stock.",
    items: [
      { name: "Toteat", image: "/integrations/toteat.svg" },
      { name: "Fudo", image: "/integrations/fudo.svg" },
      { name: "Justo", image: "/integrations/justo.svg" },
      { name: "Bsale", image: "/integrations/bsale.png" },
    ],
  },
  {
    category: "Archivos y sistemas propios",
    description: "Fuentes que hoy viven fuera de una integración estándar.",
    items: [
      { name: "Excel", icon: FileSpreadsheet },
      { name: "CSV", icon: FileSpreadsheet },
      { name: "XML", icon: FileCode2 },
      { name: "PDF", icon: FileText },
      { name: "Email", icon: Mail },
      { name: "API", icon: Braces },
    ],
  },
] as const;

const customerLogoPlaceholders = Array.from({ length: 18 }, (_, index) => index + 1);

const plans = [
  {
    name: "Start",
    volume: "Hasta 200 documentos / mes",
    price: "$99.990",
    copy: "Para operaciones con un flujo recurrente de menor volumen.",
  },
  {
    name: "Core",
    volume: "Hasta 500 documentos / mes",
    price: "$249.990",
    copy: "Para equipos con un volumen constante de compras y procesos operativos.",
    featured: true,
  },
  {
    name: "Scale",
    volume: "Hasta 1.200 documentos / mes",
    price: "$449.990",
    copy: "Para operaciones de mayor volumen, múltiples locales o sociedades.",
  },
] as const;

const faqItems = [
  {
    question: "¿Tengo que cambiar mi ERP, POS o sistema actual?",
    answer:
      "No. Ruka está diseñada para trabajar sobre las herramientas que ya usa tu empresa. Conectamos las fuentes necesarias y dejamos la información actualizada donde corresponda.",
  },
  {
    question: "¿Qué tipo de procesos puede automatizar Ruka?",
    answer:
      "Procesos repetitivos que implican recibir, leer, cruzar, validar, registrar o actualizar información entre sistemas. Por ejemplo: registro de compras, conciliaciones, actualización de costos, inventario, cálculo de margen y registro en otras plataformas.",
  },
  {
    question: "¿Pueden automatizar un proceso que no aparece en esta página?",
    answer:
      "Sí. Revisamos cómo funciona hoy, qué información utiliza, qué reglas tiene y qué acciones debe ejecutar. Si tiene suficiente estructura y podemos acceder a las fuentes necesarias, podemos evaluar un operador específico para ese flujo.",
  },
  {
    question: "¿Con qué sistemas se puede conectar Ruka?",
    answer:
      "Ruka ya trabaja con SII, POS, ERP, bancos, sistemas contables y otras plataformas. También puede operar con información proveniente de Excel, CSV, XML, PDF, correo, APIs y sistemas propios, dependiendo del caso.",
  },
  {
    question: "¿Cuánto demora empezar a usar Ruka?",
    answer:
      "Depende del proceso y de las conexiones necesarias. Partimos por un alcance concreto y buscamos llegar al primer flujo funcionando lo antes posible antes de ampliar la automatización.",
  },
  {
    question: "¿Ruka funciona sola o mi equipo tiene que aprobar lo que hace?",
    answer:
      "Depende del proceso. Algunas acciones pueden ejecutarse automáticamente y otras pueden requerir validación. Definimos esas reglas según cómo opera tu empresa.",
  },
  {
    question: "¿Qué pasa si Ruka encuentra información que no coincide?",
    answer:
      "El flujo se configura para manejar los casos conocidos y separar aquellos que requieren una decisión. El objetivo es que tu equipo deje de revisar todo y concentre su tiempo donde realmente hace falta.",
  },
  {
    question: "¿Cuánto cuesta Ruka?",
    answer:
      "Los planes estándar parten en $99.990 mensuales y cambian según volumen. Si necesitas un proceso o integración específica, evaluamos el alcance y cotizamos su implementación y operación.",
  },
  {
    question: "¿Cómo sé si Ruka tiene sentido para mi empresa?",
    answer:
      "Si tu equipo dedica horas todas las semanas a mover información, registrar documentos, cruzar sistemas, mantener planillas o revisar datos manualmente, probablemente hay un proceso que vale la pena evaluar.",
  },
] as const;

export default function LandingV2() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-[100dvh] bg-[#fbfcff] text-[#171827]">
      <Helmet>
        <title>Ruka.ai | Agentes IA para automatizar procesos operativos</title>
        <meta
          name="description"
          content="Ruka conecta SII, ERP, POS, bancos y otras plataformas para automatizar el trabajo operativo que tu equipo todavía hace manualmente."
        />
        <link rel="canonical" href="https://ruka.ai/v2" />
      </Helmet>

      <Navbar
        sectionLinks={navItems}
        sectionPath="/v2"
        logoPath="/v2"
        primaryAction={{ label: CTA_LABEL, path: "/register" }}
        showLogin={false}
      />
      <Hero reduceMotion={reduceMotion} navigate={navigate} />
      <SocialProofSection />
      <OperationalGapSection />
      <WorkSection reduceMotion={reduceMotion} onPrimaryAction={() => navigate("/register")} />
      <ProductDemoSection reduceMotion={reduceMotion} navigate={navigate} />
      <IntegrationsSection />
      <PricingSection navigate={navigate} />
      <FAQAndCTASection navigate={navigate} />
    </main>
  );
}

function Hero({
  reduceMotion,
  navigate,
}: {
  reduceMotion: boolean | null;
  navigate: (path: string) => void;
}) {
  return (
    <section
      className="relative overflow-hidden bg-[#fbfcff] px-5 pb-14 pt-24 sm:px-8 sm:pb-20 lg:min-h-[100dvh] lg:pb-16"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(23, 24, 39, 0.018) 1px, transparent 1px), linear-gradient(180deg, rgba(23, 24, 39, 0.018) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          className="mx-auto max-w-7xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOut }}
        >
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#dce3f2] bg-white px-4 py-2 text-sm font-semibold text-[#555b6e]">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Agentes IA que trabajan sobre tus sistemas</span>
          </p>
          <h1 className="mx-auto mt-7 max-w-6xl text-balance text-3xl font-semibold leading-[1.04] tracking-[-0.035em] text-[#171827] sm:text-5xl lg:text-[3.35rem] xl:text-[3.75rem] 2xl:text-[3.85rem]">
            <span className="block">Tu empresa ya tiene los sistemas.</span>
            <span className="block">Ruka hace el trabajo que queda entre medio.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-pretty text-lg leading-8 text-[#555b6e] sm:text-xl sm:leading-9">
            Conecta la información de tu SII, ERP, POS, bancos y otras plataformas para automatizar el trabajo operativo que tu equipo todavía hace manualmente.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-9 flex max-w-7xl flex-col items-center justify-center gap-3 sm:flex-row sm:items-start"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.46, delay: 0.12, ease: easeOut }}
        >
          <div className="flex w-full flex-col items-center gap-2 sm:w-auto">
            <Button
              className="h-12 w-full rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-none transition-transform duration-150 ease-out hover:bg-primary/90 active:scale-[0.97] sm:w-auto sm:px-6 sm:text-base"
              onClick={() => navigate("/register")}
            >
              {CTA_LABEL}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs font-medium text-[#6a7184]">Cuéntanos tu proceso · Sin preparación</p>
          </div>
          <a
            href="#demo"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#dce3f2] bg-white px-6 text-base font-semibold text-[#171827] transition-transform duration-150 ease-out hover:bg-[#f7f9ff] active:scale-[0.97] sm:w-auto"
          >
            Probar Ruka
            <ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" />
          </a>
        </motion.div>

        <motion.div
          className="mt-10 sm:mt-14"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.16, ease: easeOut }}
        >
          <CoverSystemMap reduceMotion={reduceMotion} />
        </motion.div>
      </div>
    </section>
  );
}

function CoverSystemMap({ reduceMotion }: { reduceMotion: boolean | null }) {
  const [animationStep, setAnimationStep] = useState(1);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const finalStep = coverOutcomes.length * 2;
    const isProcessing = animationStep % 2 === 1;
    const timeout = window.setTimeout(
      () => setAnimationStep((current) => (current === finalStep ? 0 : current + 1)),
      animationStep === 0 ? 450 : isProcessing ? 650 : animationStep === finalStep ? 1600 : 750,
    );

    return () => window.clearTimeout(timeout);
  }, [animationStep, reduceMotion]);

  const visibleCount = reduceMotion ? coverOutcomes.length : Math.ceil(animationStep / 2);
  const processingIndex = !reduceMotion && animationStep % 2 === 1 ? Math.floor(animationStep / 2) : -1;

  return (
    <div className="cover-system-map">
      <svg className="cover-flow-lines" viewBox="0 0 1240 360" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker id="cover-input-arrow" markerHeight="10" markerUnits="userSpaceOnUse" markerWidth="12" orient="auto" refX="10" refY="5">
            <path className="cover-input-arrow-path" d="M1 1 L10 5 L1 9" />
          </marker>
          <marker id="cover-output-arrow" markerHeight="14" markerUnits="userSpaceOnUse" markerWidth="16" orient="auto" refX="14" refY="7">
            <path className="cover-output-arrow-path" d="M2 2 L14 7 L2 12" />
          </marker>
        </defs>

        <g className="cover-input-flow">
          <path markerEnd="url(#cover-input-arrow)" d="M88 76 C184 76, 276 150, 416 154" />
          <path markerEnd="url(#cover-input-arrow)" d="M222 76 C308 76, 314 150, 416 164" />
          <path markerEnd="url(#cover-input-arrow)" d="M88 180 C196 180, 292 176, 416 176" />
          <path markerEnd="url(#cover-input-arrow)" d="M222 180 C314 180, 326 181, 416 186" />
          <path markerEnd="url(#cover-input-arrow)" d="M88 284 C196 284, 278 214, 416 198" />
          <path markerEnd="url(#cover-input-arrow)" d="M222 284 C316 284, 326 218, 416 208" />
        </g>

        <g className="cover-output-flow">
          {coverOutputPaths.map((path, index) => (
            <path
              key={path}
              className={index < visibleCount ? "is-visible" : undefined}
              markerEnd="url(#cover-output-arrow)"
              d={path}
            />
          ))}
        </g>
      </svg>

      <div className="cover-sources" aria-label="Fuentes de datos">
        {coverSources.map(([label, Icon]) => (
          <SourceTile key={label} icon={Icon} label={label} />
        ))}
      </div>
      <div className="cover-layer">
        <img className="cover-platform-asset" src="/assets/ruka-digital-operator-hero.webp" alt="" aria-hidden="true" />
      </div>
      <div className="cover-outcomes" aria-label="Trabajo completado por Ruka">
        <AnimatePresence initial={false}>
          {coverOutcomes.slice(0, visibleCount).map((label, index) => (
            <OutcomeTile key={label} isProcessing={processingIndex === index} label={label} reduceMotion={reduceMotion} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SourceTile({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="cover-input">
      <Icon size={32} />
      <span>{label}</span>
    </div>
  );
}

function OutcomeTile({
  label,
  isProcessing,
  reduceMotion,
}: {
  label: string;
  isProcessing: boolean;
  reduceMotion: boolean | null;
}) {
  return (
    <motion.div
      className={`cover-outcome${isProcessing ? " is-processing" : ""}`}
      aria-label={isProcessing ? `Procesando: ${label}` : label}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
      transition={{ duration: reduceMotion ? 0 : 0.22, ease: easeOut }}
    >
      <span className="cover-outcome-status" aria-hidden="true">
        {isProcessing ? <LoaderCircle className="cover-outcome-spinner" size={24} /> : <CheckCircle2 size={24} />}
      </span>
      <motion.span
        key={isProcessing ? "processing" : label}
        className="cover-outcome-label"
        aria-hidden="true"
        initial={reduceMotion ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.2, ease: easeOut }}
      >
        {isProcessing ? "Procesando..." : label}
      </motion.span>
    </motion.div>
  );
}

function SocialProofSection() {
  return (
    <section aria-labelledby="social-proof-title" className="border-y border-[#dce3f2] bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2
          id="social-proof-title"
          className="mx-auto max-w-4xl text-balance text-center text-3xl font-semibold leading-[1.12] tracking-[-0.035em] text-[#171827] sm:text-4xl"
        >
          Ruka ya procesa millones de transacciones para cientos de empresas.
        </h2>
      </div>

      <div className="social-proof-marquee mt-9">
        <div className="social-proof-track">
          <div className="social-proof-logo-group">
            {customerLogoPlaceholders.map((index) => (
              <CustomerLogoPlaceholder key={index} index={index} />
            ))}
          </div>
          <div className="social-proof-logo-group" aria-hidden="true">
            {customerLogoPlaceholders.map((index) => (
              <CustomerLogoPlaceholder key={`duplicate-${index}`} index={index} decorative />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl px-5 sm:px-8">
        <div className="grid border-y border-[#dce3f2] lg:grid-cols-[1.38fr_0.62fr]">
          <figure className="flex min-h-72 flex-col justify-between py-8 sm:py-10 lg:border-r lg:border-[#dce3f2] lg:pr-12">
            <blockquote className="max-w-4xl text-pretty text-2xl font-semibold leading-[1.35] tracking-[-0.025em] text-[#171827] sm:text-3xl">
              “Información inmediata de volúmenes de compra, evolución de precios y control de pagos. Ahorro de HH en planillas.”
            </blockquote>
            <figcaption className="mt-9 flex items-center gap-4 text-sm">
              <span className="h-px w-9 flex-none bg-primary" aria-hidden="true" />
              <span className="grid gap-0.5">
                <strong className="font-semibold text-[#171827]">Hernan Sugg</strong>
                <span className="font-medium text-[#555b6e]">Socio, Barbazul</span>
              </span>
            </figcaption>
          </figure>
          <dl className="grid grid-cols-2 border-t border-[#dce3f2] lg:grid-cols-1 lg:border-t-0">
            <div className="flex min-h-36 flex-col justify-center py-7 pr-5 sm:min-h-40 sm:py-8 lg:pl-10 lg:pr-0">
              <dd className="text-4xl font-semibold tracking-[-0.04em] text-primary sm:text-5xl">+300</dd>
              <dt className="mt-2 max-w-40 text-sm font-semibold leading-5 text-[#555b6e]">empresas operando con Ruka</dt>
            </div>
            <div className="flex min-h-36 flex-col justify-center border-l border-[#dce3f2] py-7 pl-5 sm:min-h-40 sm:py-8 lg:border-l-0 lg:border-t lg:pl-10">
              <dd className="text-4xl font-semibold tracking-[-0.04em] text-primary sm:text-5xl">+5M</dd>
              <dt className="mt-2 max-w-40 text-sm font-semibold leading-5 text-[#555b6e]">transacciones procesadas</dt>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

function CustomerLogoPlaceholder({ index, decorative = false }: { index: number; decorative?: boolean }) {
  return (
    <div
      className="social-proof-logo"
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `Logo de cliente ${String(index).padStart(2, "0")} (placeholder)`}
    >
      <span className="social-proof-logo-mark" aria-hidden="true" />
      <span className="social-proof-logo-wordmark" aria-hidden="true">
        <span className="social-proof-logo-line social-proof-logo-line-primary" />
        <span className="social-proof-logo-line social-proof-logo-line-secondary" />
      </span>
    </div>
  );
}

function ProductDemoSection({
  reduceMotion,
  navigate,
}: {
  reduceMotion: boolean | null;
  navigate: (path: string) => void;
}) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <section id="demo" className="scroll-mt-24 bg-[#f4f6fb] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary">Ruka en acción</p>
          <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-5xl">
            No te lo imagines. Pruébalo.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-8 text-[#555b6e]">
            Explora una operación de ejemplo y ve cómo Ruka organiza compras, costos, proveedores y otra información operacional.
          </p>
        </div>

        <motion.div
          className="mt-10 overflow-hidden rounded-2xl bg-white ring-1 ring-[#d7ddea] sm:mt-12"
          initial={reduceMotion ? false : { opacity: 0.92, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.55, ease: easeOut }}
        >
          <div className="flex h-11 items-center justify-between border-b border-[#e3e7f0] bg-[#fafbfe] px-4 sm:px-5">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#f3c44d]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#39c780]" />
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#6a7184]">
              <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
              prueba.ruka.ai
            </div>
          </div>

          <div
            className={`relative w-full overflow-hidden bg-[#eef1ff] ${
              reduceMotion ? "" : "transition-[height] duration-500 ease-out"
            } ${
              isDemoOpen
                ? "h-[75dvh] min-h-[32rem] max-h-[48rem] md:h-[75dvh] md:min-h-[700px] md:max-h-[750px]"
                : "aspect-[16/10]"
            }`}
          >
            {isDemoOpen ? (
              <iframe
                src={rukaDemoEmbedUrl}
                title="Demo interactiva de Ruka"
                loading="lazy"
                allow="clipboard-write"
                className="absolute inset-0 h-full w-full border-0 bg-white"
              />
            ) : (
              <button
                type="button"
                className="group absolute inset-0 block h-full w-full overflow-hidden bg-[#eef1ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                onClick={() => setIsDemoOpen(true)}
                aria-label="Abrir demo interactiva de Ruka"
              >
                <img
                  src="/assets/ruka-platform-insights.png"
                  alt="Vista de una operación de ejemplo dentro de Ruka"
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                />
                <span className="absolute inset-0 bg-[#171827]/20 transition-colors duration-300 group-hover:bg-[#171827]/14" aria-hidden="true" />
                <span className="absolute inset-0 flex items-center justify-center p-5">
                  <span className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-5 text-sm font-semibold text-[#171827] shadow-[0_6px_8px_rgba(23,24,39,0.12)] transition-transform duration-200 group-hover:scale-[1.03] sm:px-7 sm:text-base">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">
                      <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
                    </span>
                    Abrir demo interactiva
                  </span>
                </span>
              </button>
            )}
          </div>
        </motion.div>

        <div className="mt-7 flex flex-col gap-4 border-t border-[#dce1eb] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold tracking-[-0.015em] text-[#171827]">¿Te imaginas Ruka sobre tu propia operación?</h3>
            <p className="mt-1 text-sm leading-6 text-[#555b6e]">Cuéntanos qué proceso quieres sacar de tu equipo.</p>
          </div>
          <Button
            variant="ghost"
            className="h-11 w-fit flex-none justify-start rounded-full px-0 font-semibold text-primary hover:bg-transparent hover:text-primary/80"
            onClick={() => navigate("/register")}
          >
            {CTA_LABEL}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}

function IntegrationsSection() {
  return (
    <section id="integraciones" className="scroll-mt-24 overflow-hidden bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-4xl">
          <h2 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-5xl">
            Trabajamos donde ya vive tu operación.
          </h2>
          <p className="mt-5 max-w-3xl text-pretty text-lg leading-8 text-[#555b6e]">
            Sistemas de gestión, facturadores, POS, bancos, archivos o desarrollos propios. Conectamos las fuentes que necesita cada proceso, sin obligarte a cambiar tu stack.
          </p>
        </div>

        <div className="mt-12 border-y border-[#dce1eb]">
          {ecosystemGroups.map((group, index) => (
            <EcosystemRail key={group.category} group={group} reverse={index % 2 === 1} />
          ))}
        </div>

        <p className="mt-7 text-sm font-medium text-[#555b6e]">
          <span className="font-semibold text-[#171827]">¿No aparece tu sistema?</span> Revisamos cómo acceder a su información.
        </p>
      </div>
    </section>
  );
}

function EcosystemRail({ group, reverse }: { group: EcosystemGroup; reverse: boolean }) {
  const repeatedItems = [...group.items, ...group.items];

  return (
    <div className="grid border-b border-[#dce1eb] last:border-b-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <div className="flex flex-col justify-center bg-[#f7f8fc] px-5 py-5 sm:px-7 lg:min-h-32 lg:border-r lg:border-[#dce1eb]">
        <h3 className="text-lg font-semibold tracking-[-0.015em] text-[#171827]">{group.category}</h3>
        <p className="mt-1.5 max-w-xs text-sm leading-6 text-[#646b7d]">{group.description}</p>
      </div>
      <div
        className="integration-rail relative flex min-h-24 items-center overflow-hidden bg-white py-4 lg:min-h-32"
        role="group"
        aria-label={`${group.category}: ${group.items.map((item) => item.name).join(", ")}`}
      >
        <div className={`integration-rail-track ${reverse ? "integration-rail-track-reverse" : ""}`} aria-hidden="true">
          {repeatedItems.map((item, index) => {
            const ItemIcon = item.icon;

            return (
              <div
                key={`${group.category}-${item.name}-${index}`}
                className={`integration-chip ${ItemIcon ? "integration-chip-generic" : "integration-chip-product"} ${
                  index >= group.items.length ? "integration-chip-duplicate" : ""
                }`}
                aria-hidden={index >= group.items.length || undefined}
              >
                {item.image ? (
                  <>
                    <span className={item.logoSurface === "dark" ? "integration-logo-surface-dark" : undefined}>
                      <img src={item.image} alt={`${item.name} logo`} className="integration-logo-image" loading="lazy" />
                    </span>
                    {item.showName && <span className="integration-product-label">{item.name}</span>}
                  </>
                ) : ItemIcon ? (
                  <ItemIcon className="integration-chip-icon" strokeWidth={1.7} aria-hidden="true" />
                ) : null}
                {ItemIcon && <span>{item.name}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PricingSection({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section id="precios" className="scroll-mt-24 bg-[#f4f6fb] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-5xl">
            Planes según el volumen de tu operación.
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-[#555b6e]">
            Elige según la cantidad de documentos que procesas cada mes. Si necesitas más volumen o un proceso especial, armamos una propuesta para tu operación.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3 lg:items-stretch">
          {plans.map((plan) => {
            const isFeatured = "featured" in plan && plan.featured === true;

            return (
              <article
                key={plan.name}
                className={`relative flex min-h-[20rem] flex-col rounded-2xl p-6 sm:p-8 ${
                  isFeatured
                    ? "bg-primary text-white ring-1 ring-primary"
                    : "border border-[#d7ddea] bg-white text-[#171827]"
                }`}
              >
                <div className="flex min-h-8 items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold tracking-[-0.02em]">{plan.name}</h3>
                  {isFeatured && (
                    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary">Más elegido</span>
                  )}
                </div>

                <p className="mt-9 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{plan.price}</span>
                  <span className={`text-sm font-medium ${isFeatured ? "text-white/[0.72]" : "text-[#6a7184]"}`}>/ mes</span>
                </p>

                <div className={`mt-8 border-t pt-6 ${isFeatured ? "border-white/[0.2]" : "border-[#dce1eb]"}`}>
                  <p className="text-base font-semibold">{plan.volume}</p>
                  <p className={`mt-4 text-base leading-7 ${isFeatured ? "text-white/[0.78]" : "text-[#555b6e]"}`}>{plan.copy}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-5 flex flex-col gap-4 rounded-xl border border-[#d7ddea] bg-white px-5 py-4 lg:flex-row lg:items-center">
          <p className="flex-none text-sm font-semibold text-[#171827]">Todos los planes incluyen</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[#555b6e]" aria-label="Capacidades incluidas en todos los planes">
            {["Procesamiento de documentos", "Conexión con tus fuentes", "Reglas y homologaciones", "Seguimiento operativo"].map((capability) => (
              <li key={capability} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                {capability}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base leading-7 text-[#555b6e]">Te ayudamos a confirmar el plan según tu volumen y proceso.</p>
          <Button
            className="h-12 w-full rounded-full bg-primary px-6 font-semibold text-white shadow-none hover:bg-primary/90 active:scale-[0.98] sm:w-fit"
            onClick={() => navigate("/register")}
          >
            {CTA_LABEL}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl bg-[#171a29] text-white">
          <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:p-12">
            <div>
              <p className="text-sm font-semibold text-[#9ba9ff]">Más volumen o un flujo distinto</p>
              <h3 className="mt-3 max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-4xl">
                ¿Tu proceso no cabe en un plan? Lo diseñamos contigo.
              </h3>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/[0.72]">
                Integraciones, reglas y operación según tu flujo.
              </p>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              <p className="text-sm font-medium text-white/[0.6]">Sin precio público · Alcance definido contigo</p>
              <Button
                className="h-12 w-full rounded-full bg-white px-6 font-semibold text-[#171827] shadow-none hover:bg-[#f1f3ff] active:scale-[0.98] sm:w-fit"
                onClick={() => navigate("/register")}
              >
                Cuéntanos tu proceso
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQAndCTASection({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section id="faq" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <div>
            <h2 className="max-w-lg text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-5xl">
              Preguntas antes de poner Ruka a trabajar.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-[#555b6e]">
              Lo que normalmente nos preguntan antes de automatizar un proceso.
            </p>
          </div>
          <Accordion type="single" collapsible className="grid gap-3">
            {faqItems.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`} className="rounded-2xl border border-[#dce3f2] bg-[#fbfcff] px-5">
                <AccordionTrigger className="text-left text-base font-semibold text-[#171827] hover:text-primary hover:no-underline sm:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-7 text-[#555b6e]">{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-16 overflow-hidden rounded-2xl bg-[#eef1ff] p-6 sm:p-10 lg:p-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-5xl">
                ¿Qué trabajo sigue haciendo manualmente tu equipo?
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#555b6e]">Muéstranos el proceso. Te mostramos cómo lo operaría Ruka.</p>
            </div>
            <div className="flex flex-col items-start gap-3 lg:items-end">
              <Button
              className="h-12 w-full rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-none hover:bg-primary/90 active:scale-[0.97] sm:w-auto sm:px-6 sm:text-base"
                onClick={() => navigate("/register")}
              >
                {CTA_LABEL}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <p className="flex items-center gap-2 text-sm font-semibold text-[#555b6e]">
                <UsersRound className="h-4 w-4 text-primary" />
                20 min · Sin preparación
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-10 flex flex-col gap-5 border-t border-[#dce3f2] pt-7 text-sm text-[#6a7184] sm:flex-row sm:items-center sm:justify-between">
          <Link to="/v2" aria-label="Volver al inicio de Ruka">
            <img src="/logo.png" alt="Ruka.ai" className="h-8 w-auto" />
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy" className="hover:text-[#171827]">Privacidad</Link>
            <Link to="/terms" className="hover:text-[#171827]">Términos</Link>
          </div>
        </footer>
      </div>
    </section>
  );
}
