import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  Check,
  CheckCircle2,
  Clock3,
  Database,
  FileSpreadsheet,
  Layers3,
  Landmark,
  LoaderCircle,
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

const CTA_LABEL = "Ver Ruka en mi operación";
const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

const navItems = [
  { label: "Trabajo", id: "trabajo" },
  { label: "Casos", id: "casos" },
  { label: "Integraciones", id: "integraciones" },
  { label: "Precios", id: "precios" },
] as const;

const coverSources: Array<[string, LucideIcon]> = [
  ["Ventas", BarChart3],
  ["Compras", ReceiptText],
  ["Banco", Banknote],
  ["Planillas", FileSpreadsheet],
  ["ERP", Database],
  ["Otros", Layers3],
];

const coverOutcomes = [
  "Compras registradas",
  "Pagos conciliados",
  "Costos actualizados",
  "Datos listos donde corresponden",
] as const;

const customerCases = [
  {
    company: "Barbazul",
    result: "Horas de planilla recuperadas",
    before: "Cruzar compras, precios y pagos antes de poder revisar la operación.",
    after: "Información inmediata de volúmenes, evolución de precios y control de pagos.",
    person: "Hernan Sugg, socio",
  },
  {
    company: "Ottoburguer",
    result: "Control de precios al instante",
    before: "Revisar facturas y compras por proveedor de forma manual.",
    after: "Facturas y compras mensuales visibles para detectar cobros fuera de rango.",
    person: "Esteban Hojas, socio",
  },
  {
    company: "Grupo Melting Cook",
    result: "Ruka dentro de la operación",
    before: "Procesos recurrentes dependientes del seguimiento del equipo.",
    after: "Una operación acompañada por Ruka y soporte cercano cuando aparece una excepción.",
    person: "Alphonse Reynes, gerencia",
  },
] as const;

type Integration = {
  name: string;
  exchange: string;
  image?: string;
  icon?: LucideIcon;
  mark?: string;
};

const integrations: Integration[] = [
  { name: "SII", exchange: "Facturas y documentos tributarios", image: "/logosii.png" },
  { name: "Toteat", exchange: "Ventas, productos y locales", image: "/toteat-logo.png" },
  { name: "Fudo", exchange: "Ventas y catálogo del POS", image: "/fudo-logo.png" },
  { name: "Justo", exchange: "Pedidos, ventas y productos", image: "/justo-logo.png" },
  { name: "Defontana", exchange: "Compras, inventario y contabilidad", mark: "D" },
  { name: "Nubox", exchange: "Contabilidad y documentos", mark: "N" },
  { name: "Bsale", exchange: "Ventas, stock y documentos", icon: Store },
  { name: "Bancos", exchange: "Pagos, cartolas y conciliaciones", icon: Landmark },
];

const customerLogoPlaceholders = Array.from({ length: 18 }, (_, index) => index + 1);

const plans = [
  {
    name: "Start",
    volume: "Hasta 200 documentos / mes",
    price: "$99.990",
    pricePrefix: "",
    copy: "Para operaciones pequeñas que quieren sacar la digitación del día a día.",
    features: ["Hasta 200 documentos al mes", "Un flujo recurrente", "Onboarding guiado"],
    sampleVolume: 150,
  },
  {
    name: "Core",
    volume: "201 - 500 documentos / mes",
    price: "$249.990",
    pricePrefix: "",
    copy: "Para equipos con un flujo constante de documentos y procesos recurrentes.",
    features: ["Hasta 500 documentos al mes", "Reglas y homologaciones", "Seguimiento operativo"],
    sampleVolume: 350,
    featured: true,
  },
  {
    name: "Scale",
    volume: "501 - 1.200 documentos / mes",
    price: "$449.990",
    pricePrefix: "",
    copy: "Para operaciones de mayor volumen, múltiples locales o sociedades.",
    features: ["Hasta 1.200 documentos al mes", "Múltiples locales o sociedades", "Automatizaciones coordinadas"],
    sampleVolume: 850,
  },
  {
    name: "Enterprise",
    volume: "1.200+ documentos / mes o flujo complejo",
    price: "$699.990",
    pricePrefix: "Desde",
    copy: "Para volúmenes superiores o procesos que requieren un diseño a medida.",
    features: ["Volumen superior o flujo complejo", "Integraciones dedicadas", "Alcance definido con tu equipo"],
    sampleVolume: 1_350,
  },
] as const;

const faqItems = [
  {
    question: "¿Tengo que cambiar mi ERP?",
    answer:
      "No. Ruka se conecta con los sistemas que ya usa tu empresa y opera entre ellos. La idea es aprovechar tu infraestructura actual, no reemplazarla.",
  },
  {
    question: "¿Pueden automatizar un proceso distinto?",
    answer:
      "Sí. Partimos entendiendo el flujo, sus reglas y las excepciones. Si el proceso usa información disponible y pasos repetibles, podemos diseñar un operador para ejecutarlo.",
  },
  {
    question: "¿Cuánto demora implementar?",
    answer:
      "Depende de las fuentes y del proceso. Comenzamos con un alcance acotado, conectamos lo necesario y mostramos el primer resultado antes de ampliar la automatización.",
  },
  {
    question: "¿Con qué sistemas funciona?",
    answer:
      "Ruka trabaja con SII, ERP, POS, bancos, planillas y otras plataformas. También podemos habilitar conexiones para sistemas propios o flujos que hoy funcionan por correo y archivos.",
  },
  {
    question: "¿Qué pasa cuando Ruka no puede resolver algo?",
    answer:
      "Ruka identifica la excepción y la escala con contexto para que una persona decida. El objetivo no es esconder los casos difíciles, sino reducir todo el trabajo que no necesita intervención humana.",
  },
] as const;

export default function LandingV2() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-[100dvh] bg-[#fbfcff] text-[#171827]">
      <Helmet>
        <title>Ruka.ai | Operadores digitales para tu empresa</title>
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
      <WorkSection reduceMotion={reduceMotion} ctaLabel={CTA_LABEL} onPrimaryAction={() => navigate("/register")} />
      <ResultsSection reduceMotion={reduceMotion} />
      <IntegrationsSection />
      <PricingSection reduceMotion={reduceMotion} navigate={navigate} />
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
            <span>Operadores digitales para tu operación</span>
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
          className="mx-auto mt-9 flex max-w-7xl flex-col items-center justify-center gap-3 sm:flex-row"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.46, delay: 0.12, ease: easeOut }}
        >
          <Button
            className="h-12 w-full rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-none transition-transform duration-150 ease-out hover:bg-primary/90 active:scale-[0.97] sm:w-auto sm:px-6 sm:text-base"
            onClick={() => navigate("/register")}
          >
            {CTA_LABEL}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <a
            href="#trabajo"
            className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#dce3f2] bg-white px-6 text-base font-semibold text-[#171827] transition-transform duration-150 ease-out hover:bg-[#f7f9ff] active:scale-[0.97] sm:w-auto"
          >
            Ver cómo funciona
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
  const [animationStep, setAnimationStep] = useState(coverOutcomes.length * 2 - 1);

  useEffect(() => {
    if (reduceMotion) return undefined;

    const isProcessing = animationStep % 2 === 0;
    const isLastCompleteStep = animationStep === coverOutcomes.length * 2 - 1;
    const timeout = window.setTimeout(
      () => setAnimationStep((current) => (current + 1) % (coverOutcomes.length * 2)),
      isProcessing ? 600 : isLastCompleteStep ? 1600 : 900,
    );

    return () => window.clearTimeout(timeout);
  }, [animationStep, reduceMotion]);

  const processingIndex = !reduceMotion && animationStep % 2 === 0 ? animationStep / 2 : -1;

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
          <path markerEnd="url(#cover-output-arrow)" d="M858 154 C920 154, 902 58, 952 58" />
          <path markerEnd="url(#cover-output-arrow)" d="M858 176 C918 176, 908 140, 952 140" />
          <path markerEnd="url(#cover-output-arrow)" d="M858 198 C918 198, 908 222, 952 222" />
          <path markerEnd="url(#cover-output-arrow)" d="M858 220 C920 220, 902 304, 952 304" />
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
        {coverOutcomes.map((label, index) => (
          <OutcomeTile key={label} isProcessing={processingIndex === index} label={label} reduceMotion={reduceMotion} />
        ))}
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
    <div className={`cover-outcome${isProcessing ? " is-processing" : ""}`} aria-label={label}>
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
    </div>
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

function ResultsSection({ reduceMotion }: { reduceMotion: boolean | null }) {
  const [activeCase, setActiveCase] = useState(0);
  const selectedCase = customerCases[activeCase];

  return (
    <section id="casos" className="scroll-mt-24 bg-[#f4f6fb] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-5xl">
          Ruka ya está haciendo la pega.
        </h2>
        <div className="mt-12 grid gap-5 lg:grid-cols-[0.38fr_0.62fr]">
          <div className="grid gap-3" role="tablist" aria-label="Casos de clientes">
            {customerCases.map((customerCase, index) => (
              <button
                key={customerCase.company}
                type="button"
                role="tab"
                aria-selected={activeCase === index}
                aria-controls="customer-case-panel"
                onClick={() => setActiveCase(index)}
                className={`rounded-2xl p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:p-6 ${
                  activeCase === index ? "bg-[#171827] text-white" : "border border-[#d7ddea] bg-white text-[#171827] hover:border-primary/40"
                }`}
              >
                <span className={`text-sm font-semibold ${activeCase === index ? "text-white/60" : "text-[#6a7184]"}`}>{customerCase.company}</span>
                <span className="mt-2 block text-xl font-semibold tracking-[-0.02em]">{customerCase.result}</span>
              </button>
            ))}
          </div>

          <motion.article
            id="customer-case-panel"
            key={selectedCase.company}
            role="tabpanel"
            className="rounded-2xl border border-[#d7ddea] bg-white p-6 sm:p-9"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: easeOut }}
          >
            <div className="flex flex-col gap-3 border-b border-[#dce3f2] pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary">{selectedCase.company}</p>
                <h3 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.03em] text-[#171827] sm:text-4xl">{selectedCase.result}</h3>
              </div>
              <p className="text-sm font-medium text-[#6a7184]">{selectedCase.person}</p>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div>
                <p className="text-sm font-semibold text-[#6a7184]">Antes</p>
                <p className="mt-3 text-lg leading-8 text-[#303547]">{selectedCase.before}</p>
              </div>
              <ArrowRight className="h-6 w-6 rotate-90 text-primary sm:rotate-0" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-primary">Con Ruka</p>
                <p className="mt-3 text-lg font-medium leading-8 text-[#171827]">{selectedCase.after}</p>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}

function IntegrationsSection() {
  return (
    <section id="integraciones" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-5xl">
            No cambies tus sistemas. Pon Ruka entre ellos.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-8 text-[#555b6e]">
            Conectamos la información que ya existe y usamos las reglas con las que tu empresa ya opera.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {integrations.map((integration) => (
            <IntegrationTile key={integration.name} integration={integration} />
          ))}
        </div>
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {[
            ["1", "Muéstranos el proceso", "Vemos dónde se pierde tiempo, qué reglas existen y qué excepciones importan."],
            ["2", "Conectamos tus sistemas", "Accedemos solo a las fuentes necesarias y ordenamos la información para operar."],
            ["3", "Ruka empieza a hacerlo", "El operador ejecuta, registra lo que hizo y escala los casos que requieren decisión."],
          ].map(([number, title, copy]) => (
            <li key={number} className="border-t-2 border-primary pt-5">
              <span className="text-sm font-semibold text-primary">{number}</span>
              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-[#171827]">{title}</h3>
              <p className="mt-3 text-base leading-7 text-[#555b6e]">{copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function IntegrationTile({ integration }: { integration: Integration }) {
  const Icon = integration.icon;
  return (
    <button
      type="button"
      className="group relative flex min-h-28 items-center justify-center overflow-hidden rounded-xl border border-[#dce3f2] bg-[#fbfcff] p-4 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      aria-label={`${integration.name}: ${integration.exchange}`}
    >
      <div className="transition duration-200 group-hover:-translate-y-3 group-hover:opacity-20 group-focus-visible:-translate-y-3 group-focus-visible:opacity-20">
        {integration.image ? (
          <img src={integration.image} alt={integration.name} className="mx-auto max-h-10 w-auto max-w-[5.5rem] object-contain" />
        ) : Icon ? (
          <div className="flex flex-col items-center gap-2">
            <Icon className="h-7 w-7 text-[#303547]" strokeWidth={1.8} />
            <span className="text-sm font-semibold text-[#303547]">{integration.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white">{integration.mark}</span>
            <span className="text-sm font-semibold text-[#303547]">{integration.name}</span>
          </div>
        )}
      </div>
      <span className="pointer-events-none absolute inset-x-3 top-1/2 -translate-y-1/2 translate-y-3 text-xs font-semibold leading-5 text-[#303547] opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        {integration.exchange}
      </span>
    </button>
  );
}

function PricingSection({
  reduceMotion,
  navigate,
}: {
  reduceMotion: boolean | null;
  navigate: (path: string) => void;
}) {
  const [documentVolume, setDocumentVolume] = useState(350);
  const [people, setPeople] = useState(3);
  const [weeklyHours, setWeeklyHours] = useState(15);
  const selectedPlanIndex = documentVolume <= 200 ? 0 : documentVolume <= 500 ? 1 : documentVolume <= 1_200 ? 2 : 3;
  const activePlan = plans[selectedPlanIndex];
  const formattedDocumentVolume = documentVolume.toLocaleString("es-CL");
  const volumeProgress = ((documentVolume - 1) / (1_500 - 1)) * 100;
  const monthlyHours = people * weeklyHours * 4;
  const workDays = Math.round(monthlyHours / 8);

  return (
    <section id="precios" className="scroll-mt-24 bg-[#f4f6fb] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-5xl">
          El plan correcto para tu volumen.
        </h2>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[#555b6e]">
          El volumen define el punto de partida. Si tu proceso es más complejo, lo diseñamos contigo.
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl border border-[#d7ddea] bg-white">
          <div className="grid grid-cols-2 gap-px bg-[#d7ddea] lg:grid-cols-4" role="group" aria-label="Planes disponibles">
            {plans.map((plan, index) => {
              const isActive = selectedPlanIndex === index;

              return (
                <button
                  key={plan.name}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setDocumentVolume(plan.sampleVolume)}
                  className={`relative min-h-40 p-4 text-left transition-colors duration-200 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary active:scale-[0.99] sm:p-5 ${
                    isActive ? "bg-[#eef1ff]" : "bg-white hover:bg-[#f8f9fd]"
                  }`}
                >
                  <span className="flex min-h-7 items-center justify-between gap-2">
                    <span className="text-base font-semibold text-[#171827] sm:text-lg">{plan.name}</span>
                    {plan.featured && (
                      <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-primary sm:text-xs">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        Más elegido
                      </span>
                    )}
                  </span>
                  <span className="mt-3 block text-sm font-medium text-[#555b6e]">{plan.volume}</span>
                  <span className="mt-5 flex flex-wrap items-baseline gap-x-1.5 text-[#171827]">
                    {plan.pricePrefix && <span className="text-xs font-semibold text-[#6a7184]">{plan.pricePrefix}</span>}
                    <span className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">{plan.price}</span>
                    <span className="text-xs font-medium text-[#6a7184]">/ mes</span>
                  </span>
                  <span
                    className={`absolute inset-x-0 bottom-0 h-1 origin-left bg-primary transition-transform duration-200 ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>

          <div className="grid border-t border-[#d7ddea] lg:grid-cols-[0.92fr_1.08fr]">
            <motion.div
              key={activePlan.name}
              className="flex min-h-[29rem] flex-col bg-primary p-6 text-white sm:p-9 lg:p-10"
              initial={reduceMotion ? false : { opacity: 0.72, y: 12 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: easeOut }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white/[0.78]">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Recomendado para {formattedDocumentVolume} documentos
              </div>
              <div className="mt-8 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">{activePlan.name}</h3>
                  <p className="mt-3 text-base font-medium text-white/[0.76]">{activePlan.volume}</p>
                </div>
                {activePlan.featured && (
                  <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary">Más elegido</span>
                )}
              </div>
              <div className="mt-8">
                <p className="text-sm font-semibold text-white/[0.68]">Precio de lista</p>
                <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
                  {activePlan.pricePrefix && <span className="text-lg font-semibold text-white/[0.78]">{activePlan.pricePrefix}</span>}
                  <span className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{activePlan.price}</span>
                  <span className="text-base font-medium text-white/[0.72]">/ mes</span>
                </p>
              </div>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/[0.82]">{activePlan.copy}</p>
              <Button
                className="mt-auto h-12 w-full whitespace-nowrap rounded-full bg-white px-5 font-semibold text-[#171827] shadow-none hover:bg-[#f5f6ff] active:scale-[0.98] sm:w-fit sm:px-7"
                onClick={() => navigate("/register")}
              >
                {CTA_LABEL}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>

            <div className="p-6 sm:p-9 lg:p-10">
              <label htmlFor="document-volume" className="block text-sm font-semibold text-[#303547]">
                Documentos que procesa tu empresa al mes
              </label>
              <div className="mt-3 flex items-end justify-between gap-4">
                <output htmlFor="document-volume" className="text-4xl font-semibold tracking-[-0.035em] text-[#171827] sm:text-5xl" aria-live="polite">
                  {formattedDocumentVolume}
                </output>
                <span className="pb-1 text-sm font-medium text-[#6a7184]">documentos / mes</span>
              </div>
              <input
                id="document-volume"
                type="range"
                min="1"
                max="1500"
                step="1"
                value={documentVolume}
                onInput={(event) => setDocumentVolume(Number(event.currentTarget.value))}
                className="pricing-range mt-8 w-full cursor-pointer focus-visible:outline-none"
                style={{ "--range-progress": `${volumeProgress}%` } as CSSProperties}
                aria-describedby="document-volume-help"
              />
              <div className="relative mt-4 h-5 text-[0.68rem] font-semibold text-[#6a7184] sm:text-xs" aria-hidden="true">
                <span className="absolute left-0">1</span>
                <span className="absolute left-[13.3%] -translate-x-1/2">200</span>
                <span className="absolute left-[33.3%] -translate-x-1/2">500</span>
                <span className="absolute left-[80%] -translate-x-1/2">1.200</span>
                <span className="absolute right-0">1.500</span>
              </div>
              <p id="document-volume-help" className="mt-4 text-sm leading-6 text-[#555b6e]">
                Mueve el selector o elige uno de los planes de arriba para comparar.
              </p>

              <div className="mt-8 border-t border-[#d7ddea] pt-7">
                <h4 className="text-base font-semibold text-[#171827]">Este plan está pensado para</h4>
                <ul className="mt-5 grid gap-4">
                  {activePlan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm font-medium leading-6 text-[#303547] sm:text-base">
                      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-[#eef1ff] text-primary">
                        <Check className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div id="roi" className="mt-10 grid scroll-mt-24 overflow-hidden rounded-2xl border border-[#d7ddea] bg-white lg:grid-cols-[0.95fr_1.05fr]">
          <div className="p-6 sm:p-9">
            <h3 className="max-w-xl text-balance text-3xl font-semibold leading-tight tracking-[-0.03em] text-[#171827]">
              ¿Cuántas horas dedica hoy tu equipo?
            </h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#555b6e]">
              Ajusta los valores para dimensionar el trabajo manual que hoy existe entre tus sistemas.
            </p>
            <div className="mt-9 grid gap-8">
              <label className="grid gap-3 text-sm font-semibold text-[#303547]">
                <span className="flex items-center justify-between gap-4">
                  Personas
                  <output className="text-lg text-primary">{people}</output>
                </span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={people}
                  onInput={(event) => setPeople(Number(event.currentTarget.value))}
                  className="h-2 w-full cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                />
              </label>
              <label className="grid gap-3 text-sm font-semibold text-[#303547]">
                <span className="flex items-center justify-between gap-4">
                  Horas por semana, por persona
                  <output className="text-lg text-primary">{weeklyHours}</output>
                </span>
                <input
                  type="range"
                  min="1"
                  max="40"
                  step="1"
                  value={weeklyHours}
                  onInput={(event) => setWeeklyHours(Number(event.currentTarget.value))}
                  className="h-2 w-full cursor-pointer accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-primary p-6 text-white sm:p-9">
            <div className="flex items-center gap-3 text-white/[0.74]">
              <Clock3 className="h-5 w-5" />
              <p className="text-sm font-semibold">Trabajo manual detectado</p>
            </div>
            <motion.p
              key={monthlyHours}
              className="mt-6 text-5xl font-semibold leading-none tracking-[-0.04em] sm:text-6xl"
              initial={reduceMotion ? false : { opacity: 0.5, y: 8 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.22, ease: easeOut }}
              aria-live="polite"
            >
              {monthlyHours} horas
            </motion.p>
            <p className="mt-3 text-xl font-medium text-white/[0.76]">por mes</p>
            <div className="mt-8 border-t border-white/[0.18] pt-6">
              <p className="text-lg leading-8 text-white/[0.84]">
                Equivale a <strong className="text-white">{workDays} jornadas completas</strong> dedicadas a mover información y revisar pasos repetitivos.
              </p>
              <p className="mt-4 text-sm font-semibold text-white">Ese es el espacio que vale la pena automatizar primero.</p>
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
              Lo esencial antes de partir.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-[#555b6e]">Cinco respuestas para saber si Ruka puede operar sobre tu proceso actual.</p>
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
