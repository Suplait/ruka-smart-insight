import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Banknote,
  BarChart3,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Database,
  FileSpreadsheet,
  Gauge,
  GitBranch,
  Layers3,
  LineChart,
  LockKeyhole,
  MessageSquareText,
  Plug,
  ReceiptText,
  RefreshCw,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
  Zap,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const easeOut: [number, number, number, number] = [0.23, 1, 0.32, 1];

const navItems = [
  ["Problema", "#problema"],
  ["Solución", "#solucion"],
  ["Plataforma", "#plataforma"],
  ["Agentes", "#agentes"],
  ["Valor", "#valor"],
];

const coverSources: Array<[string, LucideIcon]> = [
  ["Ventas", BarChart3],
  ["Compras", ReceiptText],
  ["Banco", Banknote],
  ["Planillas", FileSpreadsheet],
  ["ERP", Database],
  ["Otros", Layers3],
];

const coverOutcomes: Array<[string, LucideIcon]> = [
  ["Menos trabajo manual", Bot],
  ["Verdad operacional", ShieldCheck],
  ["Alertas accionables", Zap],
  ["Margen visible al día", CircleDollarSign],
];

const trustStats = [
  ["+250", "empresas operan con Ruka"],
  ["+5M", "transacciones procesadas"],
  ["+US$600M", "en datos operacionales"],
];

const problemItems = [
  {
    icon: FileSpreadsheet,
    title: "La operación vive en demasiadas planillas",
    copy: "Compras, facturas, pagos, inventario y ventas se revisan en herramientas distintas. La foto completa aparece tarde.",
  },
  {
    icon: Clock3,
    title: "El margen se entiende cuando ya pasó",
    copy: "Las alzas de precio, compras fuera de norma y diferencias de proveedor suelen aparecer en el cierre, no cuando todavía se puede actuar.",
  },
  {
    icon: SearchCheck,
    title: "El equipo monitorea a mano una parte mínima",
    copy: "Con cientos de documentos y miles de ítems, la revisión humana termina enfocándose solo en urgencias visibles.",
  },
  {
    icon: RefreshCw,
    title: "Cada reporte depende de alguien juntando piezas",
    copy: "Las preguntas importantes requieren descargar archivos, cruzar columnas y pedir contexto antes de llegar a una respuesta útil.",
  },
];

const leakRows = [
  ["Precio", "Un insumo sube 12% y nadie lo ve hasta el cierre."],
  ["Proveedor", "Se compra fuera del acuerdo porque el dato no estaba a mano."],
  ["Documento", "Una factura queda sin clasificar y rompe el análisis mensual."],
  ["Pago", "La nómina bancaria se arma tarde y con doble revisión manual."],
];

const layerSteps = [
  {
    icon: Plug,
    title: "Conecta lo que ya existe",
    copy: "Ruka se monta sobre facturas, POS, ERP, bancos, planillas, correos y cargas manuales sin forzar un cambio de sistema.",
  },
  {
    icon: GitBranch,
    title: "Ordena una capa canónica",
    copy: "Proveedores, documentos, ítems, centros, pagos y ventas quedan normalizados para que el dato tenga una sola lectura.",
  },
  {
    icon: Bot,
    title: "Activa operadores digitales",
    copy: "Agentes clasifican, reconcilian, detectan anomalías, preparan reportes y levantan tareas antes de que el problema escale.",
  },
  {
    icon: Gauge,
    title: "Entrega decisión y ejecución",
    copy: "El equipo recibe alertas, dashboards, chat y automatizaciones para actuar con contexto, no con intuición.",
  },
];

const platformCallouts = [
  {
    icon: BarChart3,
    title: "Brecha ventas-compras",
    copy: "La lectura ejecutiva aparece arriba, sin pedir otro archivo.",
    position: "lg:left-[4vw] lg:top-[56%]",
  },
  {
    icon: TrendingUp,
    title: "Insumos al alza",
    copy: "Ruka muestra qué está subiendo y dónde conviene revisar.",
    position: "lg:right-[4vw] lg:top-[28%]",
  },
  {
    icon: ShieldCheck,
    title: "Trabajo trazable",
    copy: "El equipo ve el dato, la señal y la acción sugerida.",
    position: "lg:right-[13vw] lg:bottom-[9%]",
  },
];

const platformSignalDots = [
  "left-[32%] top-[32%]",
  "left-[47%] top-[41%]",
  "left-[72%] top-[25%]",
];

const teamMoments = [
  {
    icon: SearchCheck,
    title: "Operaciones deja de perseguir datos",
    copy: "La información llega ordenada: compras, proveedores, precios y anomalías en una lectura común.",
  },
  {
    icon: WalletCards,
    title: "Finanzas revisa con contexto",
    copy: "Pagos, documentos y diferencias dejan de ser una cadena de mensajes sueltos antes del cierre.",
  },
  {
    icon: MessageSquareText,
    title: "Gerencia pregunta y decide",
    copy: "La plataforma responde con evidencia, no con una promesa abstracta de automatización.",
  },
];

const agentModules = [
  {
    icon: ReceiptText,
    title: "Registro automático de compras",
    copy: "Digitaliza documentos, extrae ítems y deja la información disponible sin digitación manual.",
    video: "/robot_facturas.mp4",
  },
  {
    icon: Layers3,
    title: "Maestro inteligente de insumos",
    copy: "Agrupa nombres distintos para el mismo producto y reduce el ruido de proveedores, formatos y cargas.",
    video: "/robot_cajas.mp4",
  },
  {
    icon: TrendingUp,
    title: "Monitoreo continuo de precios",
    copy: "Detecta variaciones, compara periodos y muestra qué cambios tienen impacto real en la operación.",
    video: "/robot_grafico2.mp4",
  },
  {
    icon: Zap,
    title: "Alertas antes del cierre",
    copy: "Levanta señales cuando un precio se dispara, aparece un proveedor nuevo o una compra sale de patrón.",
    video: "/robot_alerta.mp4",
  },
  {
    icon: WalletCards,
    title: "Cuentas por pagar ordenadas",
    copy: "Prepara pagos, conciliaciones y nóminas con trazabilidad para que finanzas revise menos y controle más.",
    video: "/robot_dinero.mp4",
  },
  {
    icon: RefreshCw,
    title: "Sincronización con sistemas actuales",
    copy: "Envía datos limpios a inventario, BI, contabilidad o cualquier herramienta donde el equipo ya trabaja.",
    video: "/robot_inventario.mp4",
  },
];

const valueCards = [
  {
    title: "Menos horas de back office",
    value: "15+",
    unit: "hrs / semana",
    copy: "La digitación y cruce manual se convierten en revisión asistida.",
  },
  {
    title: "Más velocidad de reacción",
    value: "24/7",
    unit: "monitoreo",
    copy: "Los cambios relevantes aparecen cuando ocurren, no cuando alguien arma un reporte.",
  },
  {
    title: "Más control de margen",
    value: "día a día",
    unit: "visibilidad",
    copy: "Compras, precios y proveedores se leen con contexto operativo.",
  },
];

const workflowMoments = [
  {
    time: "Lunes 08:40",
    title: "El equipo llega con prioridades claras",
    copy: "Ruka ya revisó documentos, variaciones y proveedores antes de la primera reunión.",
  },
  {
    time: "Durante el día",
    title: "Las alertas llegan con contexto",
    copy: "No dice solo que algo cambió: muestra cuánto, dónde y qué dato lo respalda.",
  },
  {
    time: "Antes del cierre",
    title: "Menos reconstrucción, más decisión",
    copy: "Compras, pagos y margen se revisan sobre una historia común, no sobre versiones sueltas.",
  },
];

const conversationSnippets = [
  "¿Qué insumos subieron más este mes?",
  "Muéstrame proveedores con compras fuera de patrón.",
  "Prepara el resumen de brecha ventas-compras.",
];

const beforeAfter = [
  {
    label: "Antes",
    tone: "border-[#f0c8c8] bg-[#fffafa]",
    icon: Clock3,
    points: [
      "Registro manual de documentos",
      "Datos desactualizados entre sistemas",
      "Revisión parcial de proveedores e ítems",
      "Reportes que dependen de cierres y planillas",
      "Margen visible cuando ya hay poco margen de acción",
    ],
  },
  {
    label: "Con Ruka",
    tone: "border-[#c8d2ff] bg-[#fbfcff]",
    icon: CheckCircle2,
    points: [
      "Compras clasificadas automáticamente",
      "Datos consistentes para operación y finanzas",
      "Monitoreo continuo de precio, proveedor y gasto",
      "Reportes y preguntas en lenguaje natural",
      "Alertas para actuar antes de perder margen",
    ],
  },
];

const adoptionSteps = [
  ["01", "Mapeo de fuentes", "Identificamos dónde vive la información y qué decisiones se quieren mejorar primero."],
  ["02", "Conexión y normalización", "Ruka trae datos, agrupa entidades y deja trazabilidad entre documentos, ítems y proveedores."],
  ["03", "Activación de operadores", "Configuramos alertas, reportes y automatizaciones para los dolores de mayor impacto."],
  ["04", "Mejora continua", "El sistema aprende reglas del negocio y expande módulos sin desordenar la operación."],
];

const testimonials = [
  {
    name: "Hernan Sugg",
    role: "Socio, Barbazul",
    quote: "Información inmediata de volúmenes de compra, evolución de precios y control de pagos. Ahorro de HH en planillas.",
  },
  {
    name: "Esteban Hojas",
    role: "Socio, Ottoburguer",
    quote: "Me ayuda a saber la cantidad de facturas y compras mensuales por proveedor. Ahora puedo saber de una si me están cobrando de más.",
  },
  {
    name: "Alphonse Reynes",
    role: "Gerencia, Grupo Melting Cook",
    quote: "Ruka es fundamental en nuestra operación. Además, tienen un servicio al cliente de otro nivel.",
  },
];

const faqItems = [
  {
    question: "¿Qué problema resuelve Ruka primero?",
    answer: "Parte por ordenar compras, documentos, proveedores, pagos y señales de margen. Desde esa base activa alertas, reportes y automatizaciones según el dolor de mayor impacto.",
  },
  {
    question: "¿Tengo que cambiar mi ERP, POS o facturador?",
    answer: "No. Ruka se conecta sobre las fuentes actuales y crea una capa operativa unificada. La idea es aprovechar lo que ya tienes, no obligarte a migrar.",
  },
  {
    question: "¿Qué tan compleja es la integración?",
    answer: "Depende de las fuentes disponibles, pero el enfoque es progresivo: partir con las integraciones o cargas más rápidas, mostrar valor y luego ampliar la cobertura.",
  },
  {
    question: "¿Cuándo se ven resultados?",
    answer: "Los primeros resultados suelen aparecer al normalizar documentos y compras: menos digitación, más trazabilidad y alertas sobre variaciones relevantes.",
  },
  {
    question: "¿Mis datos están seguros?",
    answer: "Sí. Ruka trabaja con controles de acceso, buenas prácticas de seguridad y trazabilidad para que los datos operacionales se usen con cuidado.",
  },
  {
    question: "¿Qué pasa si no me acomoda?",
    answer: "Tienes garantía de devolución durante los primeros 30 días. La promesa es simple: si no ves valor, no seguimos empujando algo que no te sirve.",
  },
];

export default function LandingV2() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  return (
    <main className="min-h-[100dvh] bg-[#fbfcff] text-[#171827]">
      <Helmet>
        <title>Ruka.ai | Operadores digitales para compras, inventario y margen</title>
        <meta
          name="description"
          content="Ruka conecta tus fuentes operacionales, ordena compras y activa operadores digitales para controlar margen, pagos y decisiones del día a día."
        />
        <link rel="canonical" href="https://ruka.ai/v2" />
      </Helmet>

      <Hero reduceMotion={reduceMotion} navigate={navigate} />
      <TrustStrip />
      <PlatformPreviewSection />
      <ProblemSection />
      <LeakSection />
      <SolutionSection />
      <AgentShowcase reduceMotion={reduceMotion} />
      <ValueSection />
      <TeamSection />
      <BeforeAfterSection />
      <AdoptionSection />
      <TestimonialsSection />
      <PricingGuaranteeSection navigate={navigate} />
      <FAQSection />
      <FinalCTA navigate={navigate} />
    </main>
  );
}

function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.2,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.46, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
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
      className="relative overflow-hidden bg-[#fbfcff] px-5 pb-14 pt-5 max-[360px]:pb-8 sm:px-8 sm:pb-24 lg:min-h-[100dvh] lg:pb-20"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(23, 24, 39, 0.018) 1px, transparent 1px), linear-gradient(180deg, rgba(23, 24, 39, 0.018) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    >
      <nav className="relative z-20 mx-auto flex h-14 max-w-7xl items-center justify-between">
        <Link to="/" className="flex items-center gap-3" aria-label="Ruka.ai">
          <img src="/logo.png" alt="Ruka.ai" className="h-9 w-auto" />
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-[#555b6e] md:flex">
          {navItems.map(([label, href]) => (
            <a key={href} href={href} className="transition-colors duration-150 hover:text-[#171827]">
              {label}
            </a>
          ))}
        </div>
        <Button
          className="h-11 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-none transition-transform duration-150 ease-out hover:bg-primary/90 active:scale-[0.97]"
          onClick={() => navigate("/register")}
        >
          Regístrate
        </Button>
      </nav>

      <div className="relative z-10 mx-auto mt-12 max-w-7xl sm:mt-16 lg:mt-20">
        <motion.div
          className="mx-auto max-w-7xl text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: easeOut }}
        >
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#dce3f2] bg-white px-4 py-2 text-sm font-semibold text-[#555b6e]">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Prueba con garantía de 30 días</span>
          </p>
          <h1 className="mx-auto mt-7 max-w-none text-balance text-3xl font-semibold leading-[1.04] tracking-tight text-[#171827] sm:text-5xl lg:whitespace-nowrap lg:text-[3.35rem] xl:text-[3.75rem] 2xl:text-[3.85rem]">
            Controla tu operación mientras se mueve
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg leading-8 text-[#555b6e] sm:text-xl sm:leading-9">
            Ruka conecta compras, proveedores, ventas y gastos para detectar alzas, anomalías y oportunidades de control antes de que impacten tu margen.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-center gap-3 sm:flex-row"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.46, delay: 0.12, ease: easeOut }}
        >
          <Button
            className="h-12 w-full rounded-full bg-primary px-5 text-base font-semibold text-white shadow-none transition-transform duration-150 ease-out hover:bg-primary/90 active:scale-[0.97] sm:w-auto sm:px-6"
            onClick={() => navigate("/register")}
          >
            Ver si aplica a mi operación
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <a
            href="#plataforma"
            className="hidden h-12 w-full items-center justify-center rounded-full border border-[#dce3f2] bg-white px-5 text-base font-semibold text-[#171827] transition-transform duration-150 ease-out hover:bg-[#f7f9ff] active:scale-[0.97] sm:inline-flex sm:w-auto sm:px-6"
          >
            Ver Ruka en acción
          </a>
        </motion.div>

        <motion.div
          className="mt-12 sm:mt-16"
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
  return (
    <div className="cover-system-map">
      <svg className="cover-flow-lines" viewBox="0 0 1240 360" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <marker
            id="cover-input-arrow"
            markerHeight="10"
            markerUnits="userSpaceOnUse"
            markerWidth="12"
            orient="auto"
            refX="10"
            refY="5"
          >
            <path className="cover-input-arrow-path" d="M1 1 L10 5 L1 9" />
          </marker>
          <marker
            id="cover-output-arrow"
            markerHeight="14"
            markerUnits="userSpaceOnUse"
            markerWidth="16"
            orient="auto"
            refX="14"
            refY="7"
          >
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
          <div key={label}>
            <SourceTile icon={Icon} label={label} />
          </div>
        ))}
      </div>

      <div className="cover-layer">
        <img className="cover-platform-asset" src="/assets/ruka-v2-cover-platform.png" alt="" aria-hidden="true" />
      </div>

      <div className="cover-outcomes" aria-label="Resultados operativos">
        {coverOutcomes.map(([label, Icon]) => (
          <div key={label}>
            <OutcomeTile icon={Icon} label={label} />
          </div>
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

function OutcomeTile({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="cover-outcome">
      <Icon size={34} />
      <span>{label}</span>
    </div>
  );
}

function TrustStrip() {
  return (
    <section id="traccion" className="border-y border-[#dce3f2] bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <Reveal className="max-w-xl">
            <p className="text-sm font-semibold text-primary">Tracción real</p>
            <h2 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-[2.35rem]">
              Operación real.
              <br />
              Respaldo real.
            </h2>
          </Reveal>

          <div>
            <Reveal>
              <div className="grid border-y border-[#dce3f2] sm:grid-cols-3">
                {trustStats.map(([value, label], index) => (
                  <div
                    key={label}
                    className="border-b border-[#dce3f2] py-6 last:border-b-0 sm:border-b-0 sm:border-r sm:px-6 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
                  >
                    <p className="text-[3.1rem] font-semibold leading-none tracking-tight text-[#171827] sm:text-[3.4rem]">{value}</p>
                    <p className="mt-3 max-w-[12rem] text-sm font-semibold leading-5 text-[#555b6e]">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-[#555b6e]">Respaldado por:</p>
                <div className="grid grid-cols-4 items-center gap-x-6 gap-y-4 opacity-70 sm:flex sm:gap-x-8">
                  {[
                    ["/microsoft2.png", "Microsoft"],
                    ["/openai2.png", "OpenAI"],
                    ["/500logo.png", "500 Global"],
                    ["/logocorfo.png", "CORFO"],
                  ].map(([src, alt]) => (
                    <img key={alt} src={src} alt={alt} className="max-h-8 w-auto object-contain grayscale" />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section id="problema" className="bg-[#fbfcff] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <p className="text-sm font-semibold text-primary">El problema</p>
            <h2 className="mt-3 max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-5xl">
              No falta información. Falta una operación que entienda esa información a tiempo.
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-8 text-[#555b6e]">
              Las empresas ya tienen facturas, ventas, pagos, inventario y reportes. El dolor aparece cuando todo vive separado y nadie alcanza a cruzarlo antes de decidir.
            </p>
          </Reveal>

          <div className="grid gap-3">
            {problemItems.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.04}>
                <div className="grid gap-4 rounded-2xl border border-[#dce3f2] bg-white p-5 sm:grid-cols-[3.25rem_1fr] sm:p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-[#171827]">{item.title}</h3>
                    <p className="mt-2 text-base leading-7 text-[#555b6e]">{item.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeakSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary">Lo que se pierde entre medio</p>
          <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-5xl">
            El margen se fuga en detalles pequeños que llegan tarde.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-8 text-[#555b6e]">
            Una operación puede verse estable y aun así estar perdiendo dinero por señales que nadie alcanzó a conectar.
          </p>
        </Reveal>

        <div className="mt-12 overflow-hidden rounded-2xl border border-[#dce3f2] bg-[#171827] text-white">
          <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal className="p-6 sm:p-9 lg:p-11">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <LineChart className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-7 max-w-xl text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
                La diferencia no está en mirar más dashboards. Está en que alguien mire por ti todo el tiempo.
              </h3>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/72">
                Ruka convierte ruido operacional en señales: qué cambió, por qué importa y qué debería hacer el equipo ahora.
              </p>
            </Reveal>

            <div className="border-t border-white/10 lg:border-l lg:border-t-0">
              {leakRows.map(([label, copy], index) => (
                <Reveal key={label} delay={index * 0.04} className="border-b border-white/10 last:border-b-0">
                  <div className="grid gap-3 p-5 sm:grid-cols-[7rem_1fr] sm:p-6">
                    <p className="text-sm font-semibold text-primary">{label}</p>
                    <p className="text-base leading-7 text-white/82">{copy}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section id="solucion" className="bg-[#fbfcff] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-4xl">
          <p className="text-sm font-semibold text-primary">La solución</p>
          <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-5xl">
            Una capa operativa entre tus sistemas y las decisiones del negocio.
          </h2>
          <p className="mt-5 max-w-3xl text-pretty text-lg leading-8 text-[#555b6e]">
            Ruka no es otro tablero para mirar. Es una capa que conecta, entiende, alerta y ejecuta trabajo repetitivo para que el equipo tome decisiones con contexto.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-[#dce3f2] bg-[#dce3f2] lg:grid-cols-4">
          {layerSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.title} delay={index * 0.04} amount={0.35}>
                <div className="h-full bg-white p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#dce3f2] bg-[#fbfcff] text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <p className="mt-7 text-sm font-semibold text-primary">0{index + 1}</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-[#171827]">{step.title}</h3>
                  <p className="mt-3 text-base leading-7 text-[#555b6e]">{step.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-12 rounded-2xl border border-[#dce3f2] bg-white p-5 sm:p-7 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold text-primary">Arquitectura práctica</p>
              <h3 className="mt-2 text-balance text-2xl font-semibold tracking-tight text-[#171827] sm:text-3xl">
                Empieza por las fuentes disponibles y escala desde el valor.
              </h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {["Captura", "Criterio", "Acción"].map((item, index) => (
                <div key={item} className="rounded-xl border border-[#dce3f2] bg-[#fbfcff] p-4">
                  <p className="text-sm font-semibold text-primary">{item}</p>
                  <p className="mt-2 text-sm leading-6 text-[#555b6e]">
                    {index === 0 && "Traer datos sin pedirle más carga al equipo."}
                    {index === 1 && "Ordenar reglas, entidades y excepciones."}
                    {index === 2 && "Alertar, responder y preparar trabajo."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PlatformPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 22,
    mass: 0.8,
  });
  const frameScale = useTransform(smoothProgress, [0, 0.24, 0.76, 1], [0.68, 0.96, 1.08, 0.96]);
  const frameY = useTransform(smoothProgress, [0, 0.24, 0.76, 1], [250, 72, -22, -110]);
  const frameRotateX = useTransform(smoothProgress, [0, 0.28, 0.78, 1], [7, 0, 0, -3]);
  const frameRotateZ = useTransform(smoothProgress, [0, 0.36, 1], [-2.4, 0, 1.2]);
  const introOpacity = useTransform(smoothProgress, [0, 0.08, 0.22, 0.34], [1, 1, 0.35, 0]);
  const introY = useTransform(smoothProgress, [0, 0.34], [0, -38]);
  const glowX = useTransform(smoothProgress, [0, 1], ["-28%", "28%"]);
  const scanY = useTransform(smoothProgress, [0.16, 0.84], ["12%", "84%"]);
  const scanOpacity = useTransform(smoothProgress, [0.08, 0.18, 0.84, 0.94], [0, 1, 1, 0]);
  const firstCalloutOpacity = useTransform(smoothProgress, [0.18, 0.3, 0.72, 0.84], [0, 1, 1, 0]);
  const secondCalloutOpacity = useTransform(smoothProgress, [0.32, 0.44, 0.78, 0.9], [0, 1, 1, 0]);
  const thirdCalloutOpacity = useTransform(smoothProgress, [0.5, 0.62, 0.9, 1], [0, 1, 1, 0]);
  const firstCalloutY = useTransform(smoothProgress, [0.18, 0.32], [26, 0]);
  const secondCalloutY = useTransform(smoothProgress, [0.32, 0.46], [26, 0]);
  const thirdCalloutY = useTransform(smoothProgress, [0.5, 0.64], [26, 0]);
  const calloutStyles = [
    { opacity: firstCalloutOpacity, y: firstCalloutY },
    { opacity: secondCalloutOpacity, y: secondCalloutY },
    { opacity: thirdCalloutOpacity, y: thirdCalloutY },
  ];

  return (
    <section
      id="plataforma"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#fbfcff] py-16 sm:py-24 lg:min-h-[225dvh] lg:overflow-visible lg:py-0"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(23, 24, 39, 0.018) 1px, transparent 1px), linear-gradient(180deg, rgba(23, 24, 39, 0.018) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-[#dce3f2]" />
      <div className="lg:sticky lg:top-0 lg:flex lg:min-h-[100dvh] lg:items-center lg:overflow-hidden">
        <div className="relative mx-auto w-full max-w-[1540px] px-5 sm:px-8 lg:px-8">
          <motion.div
            className="relative z-20 max-w-3xl lg:absolute lg:left-8 lg:top-10 lg:max-w-[560px]"
            style={reduceMotion ? undefined : { opacity: introOpacity, y: introY }}
          >
            <p className="text-sm font-semibold text-primary">La plataforma en operación</p>
            <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-5xl">
              Una pantalla grande, viva y accionable.
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-8 text-[#555b6e]">
              La pantalla entra como una mesa de control: ventas, compras, brechas y señales en una vista que el equipo puede leer sin pedir otro archivo.
            </p>
          </motion.div>

          <div
            className="relative mt-10 hidden min-h-[64dvh] w-full items-center justify-center sm:mt-12 lg:mt-0 lg:flex lg:min-h-[100dvh]"
            style={{ perspective: 1400 }}
          >
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[74dvh] w-[86vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[#eef2ff] opacity-80 [filter:blur(54px)] lg:block"
              style={reduceMotion ? undefined : { x: glowX }}
              aria-hidden="true"
            />
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[1px] w-[86vw] -translate-x-1/2 bg-primary/40 lg:block"
              style={reduceMotion ? undefined : { y: scanY, opacity: scanOpacity }}
              aria-hidden="true"
            />

            <motion.div
              className="relative z-10 w-[118vw] max-w-none rounded-2xl bg-[#f6f8ff] p-2 shadow-[0_8px_8px_rgba(31,43,93,0.05)] sm:w-[calc(100vw-4rem)] lg:w-[94vw] lg:max-w-[1540px] [transform-style:preserve-3d]"
              style={reduceMotion ? undefined : { scale: frameScale, y: frameY, rotateX: frameRotateX, rotateZ: frameRotateZ }}
              initial={reduceMotion ? false : { opacity: 0 }}
              whileInView={reduceMotion ? undefined : { opacity: 1 }}
              viewport={{ once: true, amount: 0.18 }}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              <div className="overflow-hidden rounded-xl border border-[#dce3f2] bg-white">
                <div className="flex h-9 items-center justify-between border-b border-[#e6ebf5] bg-[#fbfcff] px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f3c44d]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#39c780]" />
                  </div>
                  <div className="hidden items-center gap-2 text-xs font-semibold text-[#7b8296] sm:flex">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    ruka.ai / monitoreo
                  </div>
                </div>
                <div className="relative">
                  <img
                    src="/assets/ruka-platform-insights.png"
                    alt="Pantalla de Ruka con análisis de compras, ventas y variaciones de insumos"
                    className="h-auto w-full"
                  />
                  <motion.div
                    className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/42 to-transparent"
                    style={reduceMotion ? undefined : { x: glowX }}
                  />
                  <motion.div
                    className="pointer-events-none absolute inset-x-0 h-px bg-primary/45"
                    style={reduceMotion ? undefined : { top: scanY, opacity: scanOpacity }}
                  />
                  {platformSignalDots.map((position, index) => (
                    <motion.span
                      key={position}
                      className={`pointer-events-none absolute hidden h-3 w-3 rounded-full bg-primary shadow-[0_0_0_6px_rgba(79,92,238,0.16)] sm:block ${position}`}
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                      whileInView={reduceMotion ? undefined : { opacity: 1, scale: [1, 1.24, 1] }}
                      viewport={{ once: true, amount: 0.45 }}
                      transition={reduceMotion ? undefined : { duration: 1.8, delay: 0.55 + index * 0.18, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block">
              {platformCallouts.map((callout, index) => {
                const Icon = callout.icon;
                return (
                  <motion.div
                    key={callout.title}
                    className={`absolute w-[254px] rounded-2xl border border-[#dce3f2] bg-white p-4 shadow-[0_8px_8px_rgba(31,43,93,0.05)] ${callout.position}`}
                    style={reduceMotion ? undefined : calloutStyles[index]}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="min-w-0 text-sm font-semibold leading-5 text-[#171827]">{callout.title}</h3>
                    </div>
                    <p className="mt-3 break-words text-sm leading-6 text-[#555b6e]">{callout.copy}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <Reveal className="mt-10 lg:hidden">
            <div className="relative left-1/2 w-[118vw] max-w-none -translate-x-1/2 rounded-2xl bg-[#f6f8ff] p-2 shadow-[0_8px_8px_rgba(31,43,93,0.05)]">
              <div className="overflow-hidden rounded-xl border border-[#dce3f2] bg-white">
                <div className="flex h-9 items-center justify-between border-b border-[#e6ebf5] bg-[#fbfcff] px-4">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff6b6b]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#f3c44d]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#39c780]" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#7b8296]">
                    <LockKeyhole className="h-3.5 w-3.5" />
                    ruka.ai
                  </div>
                </div>
                <img
                  src="/assets/ruka-platform-insights.png"
                  alt="Pantalla de Ruka con análisis de compras, ventas y variaciones de insumos"
                  className="h-auto w-full"
                />
              </div>
            </div>
          </Reveal>

          <div className="mt-5 grid gap-3 lg:hidden">
            {platformCallouts.map((callout, index) => {
              const Icon = callout.icon;
              return (
                <Reveal key={callout.title} delay={index * 0.04}>
                  <div className="rounded-2xl border border-[#dce3f2] bg-[#fbfcff] p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="min-w-0 text-sm font-semibold leading-5 text-[#171827]">{callout.title}</h3>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[#555b6e]">{callout.copy}</p>
                  </div>
                </Reveal>
              );
            })}

            {teamMoments.map((moment, index) => {
              const Icon = moment.icon;
              return (
                <Reveal key={moment.title} delay={0.12 + index * 0.04}>
                  <div className="grid gap-3 rounded-2xl border border-[#dce3f2] bg-white p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7f9ff] text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#171827]">{moment.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-[#555b6e]">{moment.copy}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function AgentShowcase({ reduceMotion }: { reduceMotion: boolean | null }) {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [activeAgent, setActiveAgent] = useState(0);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
  });
  const imageY = useTransform(smoothProgress, [0, 1], [0, -18]);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (reduceMotion || !Number.isFinite(latest)) return;
    const next = Math.min(agentModules.length - 1, Math.max(0, Math.floor(latest * agentModules.length)));
    setActiveAgent((current) => (current === next ? current : next));
  });

  const active = agentModules[activeAgent];

  return (
    <section id="agentes" ref={sectionRef} className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold text-primary">Operadores digitales</p>
          <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-5xl">
            Agentes que hacen trabajo operativo, no solo responden preguntas.
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-pretty text-lg leading-8 text-[#555b6e]">
            Cada operador tiene un rol concreto: registrar, clasificar, monitorear, alertar, conciliar o sincronizar. El valor está en que trabajan sobre datos del negocio.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div ref={listRef} className="grid gap-3 lg:pb-24">
            {agentModules.map((agent, index) => {
              const Icon = agent.icon;
              const isActive = index === activeAgent;
              return (
                <motion.button
                  key={agent.title}
                  type="button"
                  className={`group w-full rounded-2xl border p-5 text-left transition-colors duration-200 active:scale-[0.99] ${
                    isActive
                      ? "border-primary/45 bg-[#f7f9ff]"
                      : "border-[#dce3f2] bg-white hover:bg-[#fbfcff]"
                  }`}
                  onMouseEnter={() => setActiveAgent(index)}
                  onFocus={() => setActiveAgent(index)}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.36, delay: index * 0.035, ease: easeOut }}
                >
                  <div className="grid gap-4 sm:grid-cols-[3.25rem_1fr]">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isActive ? "bg-primary text-white" : "bg-[#f1f4fb] text-[#6d7489]"}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight text-[#171827]">{agent.title}</h3>
                      <p className="mt-2 text-base leading-7 text-[#555b6e]">{agent.copy}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          <div className="lg:sticky lg:top-24">
            <motion.div
              className="overflow-hidden rounded-2xl border border-[#dce3f2] bg-[#f7f9ff]"
              style={reduceMotion ? undefined : { y: imageY }}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: easeOut }}
            >
              <div className="border-b border-[#dce3f2] bg-white px-5 py-4">
                <p className="text-sm font-semibold text-primary">Ahora trabajando</p>
                <p className="mt-1 text-lg font-semibold tracking-tight text-[#171827]">{active.title}</p>
              </div>
              <div className="aspect-[1.1] bg-[#eef2ff]">
                <video key={active.video} autoPlay loop muted playsInline preload="metadata" className="h-full w-full object-cover">
                  <source src={active.video} type="video/mp4" />
                </video>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ValueSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="valor" className="bg-[#fbfcff] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <Reveal>
            <p className="text-sm font-semibold text-primary">Valor para el negocio</p>
            <h2 className="mt-3 max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-5xl">
              Menos fricción operativa. Más control sobre lo que afecta el margen.
            </h2>
          </Reveal>
          <Reveal>
            <p className="max-w-2xl text-pretty text-lg leading-8 text-[#555b6e]">
              La promesa no es tener otro reporte bonito. Es que compras, pagos, proveedores e insumos dejen de consumir horas del equipo y empiecen a generar señales útiles.
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {valueCards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.04}>
              <motion.div
                className="h-full rounded-2xl border border-[#dce3f2] bg-white p-6 transition-colors duration-200 hover:border-primary/35"
                whileHover={reduceMotion ? undefined : { y: -4 }}
                transition={{ duration: 0.2, ease: easeOut }}
              >
                <p className="text-sm font-semibold text-primary">{card.title}</p>
                <div className="mt-8 flex items-end gap-3">
                  <p className="text-5xl font-semibold tracking-tight text-[#171827]">{card.value}</p>
                  <p className="pb-1 text-sm font-semibold text-[#555b6e]">{card.unit}</p>
                </div>
                <p className="mt-5 text-base leading-7 text-[#555b6e]">{card.copy}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <div className="rounded-2xl border border-[#dce3f2] bg-[#171827] p-6 text-white sm:p-8 lg:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <MessageSquareText className="h-6 w-6 text-white" />
              </div>
              <h2 className="mt-7 max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                La tecnología se siente útil cuando baja la ansiedad del equipo.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
                Ruka no reemplaza el criterio de operaciones o finanzas. Les quita trabajo invisible, deja evidencia a mano y hace que las conversaciones partan más arriba.
              </p>

              <div className="mt-8 grid gap-3">
                {conversationSnippets.map((snippet, index) => (
                  <motion.div
                    key={snippet}
                    className="rounded-2xl border border-white/10 bg-white/[0.055] p-4 text-sm font-semibold leading-6 text-white/86"
                    initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.45 }}
                    transition={{ duration: 0.38, delay: index * 0.08, ease: easeOut }}
                  >
                    "{snippet}"
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {workflowMoments.map((moment, index) => (
              <Reveal key={moment.title} delay={index * 0.05}>
                <div className="grid gap-4 rounded-2xl border border-[#dce3f2] bg-[#fbfcff] p-5 sm:grid-cols-[7.5rem_1fr] sm:p-6">
                  <p className="text-sm font-semibold text-primary">{moment.time}</p>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-[#171827]">{moment.title}</h3>
                    <p className="mt-2 text-base leading-7 text-[#555b6e]">{moment.copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function BeforeAfterSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary">Antes y después</p>
          <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-5xl">
            El cambio se siente en la rutina del equipo.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {beforeAfter.map((column, index) => {
            const Icon = column.icon;
            return (
              <Reveal key={column.label} delay={index * 0.05}>
                <div className={`h-full rounded-2xl border p-6 sm:p-7 ${column.tone}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-2xl font-semibold tracking-tight text-[#171827]">{column.label}</h3>
                  </div>
                  <div className="mt-7 grid gap-3">
                    {column.points.map((point) => (
                      <div key={point} className="flex items-start gap-3 rounded-xl bg-white/80 p-4">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" />
                        <p className="text-base leading-7 text-[#333849]">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AdoptionSection() {
  return (
    <section className="bg-[#fbfcff] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal>
            <p className="text-sm font-semibold text-primary">Cómo se empieza</p>
            <h2 className="mt-3 max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-5xl">
              Implementación progresiva, enfocada en valor visible.
            </h2>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-8 text-[#555b6e]">
              No necesitas resolver todo el mapa operacional el primer día. Ruka parte por las fuentes que generan impacto y crece desde ahí.
            </p>
          </Reveal>

          <div className="rounded-2xl border border-[#dce3f2] bg-white">
            {adoptionSteps.map(([number, title, copy], index) => (
              <Reveal key={title} delay={index * 0.04} className="border-b border-[#e7ecf5] last:border-b-0">
                <div className="grid gap-4 p-5 sm:grid-cols-[4.5rem_1fr] sm:p-6">
                  <p className="text-2xl font-semibold tracking-tight text-primary">{number}</p>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-[#171827]">{title}</h3>
                    <p className="mt-2 text-base leading-7 text-[#555b6e]">{copy}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary">Clientes</p>
          <h2 className="mt-3 text-balance text-4xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-5xl">
            Equipos que ya usan Ruka para ordenar la operación.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 0.05}>
              <figure className="h-full rounded-2xl border border-[#dce3f2] bg-[#fbfcff] p-6">
                <div className="flex gap-1 text-primary" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Sparkles key={star} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <blockquote className="mt-6 text-lg leading-8 text-[#333849]">
                  "{testimonial.quote}"
                </blockquote>
                <figcaption className="mt-7 border-t border-[#dce3f2] pt-5">
                  <p className="font-semibold text-[#171827]">{testimonial.name}</p>
                  <p className="mt-1 text-sm leading-6 text-[#555b6e]">{testimonial.role}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingGuaranteeSection({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="bg-[#fbfcff] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
          <Reveal>
            <div className="h-full rounded-2xl border border-[#dce3f2] bg-white p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-semibold text-primary">Precio claro</p>
              <h2 className="mt-3 max-w-2xl text-balance text-4xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-5xl">
                Más capacidad operativa sin aumentar el back office.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[#555b6e]">
                Ruka automatiza trabajo repetitivo y deja al equipo enfocado en revisión, negociación y decisiones. Es software, pero se siente como sumar manos al equipo.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {["Digitación y clasificación automática", "Alertas y reportes ilimitados", "Onboarding guiado", "Soporte cercano por WhatsApp"].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-xl border border-[#dce3f2] bg-[#fbfcff] p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none text-primary" />
                    <p className="text-sm font-semibold leading-6 text-[#171827]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="h-full rounded-2xl border border-[#dce3f2] bg-[#171827] p-6 text-white sm:p-8 lg:p-10">
              <p className="text-sm font-semibold text-primary">Planes desde</p>
              <div className="mt-4 flex flex-wrap items-end gap-x-3 gap-y-1">
                <p className="text-5xl font-semibold tracking-tight">$40.990</p>
                <p className="pb-1 text-base text-white/60">CLP / mes</p>
              </div>
              <p className="mt-5 text-base leading-7 text-white/72">
                Precio de lanzamiento para equipos que quieren reemplazar tareas manuales por operadores digitales.
              </p>

              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                  <p className="font-semibold">Garantía de 30 días</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-white/68">
                  Si no ves valor en el primer mes, te devolvemos el dinero sin letra chica.
                </p>
              </div>

              <Button
                className="mt-8 h-12 w-full rounded-full bg-white px-5 text-base font-semibold text-[#171827] shadow-none transition-transform duration-150 ease-out hover:bg-white/92 active:scale-[0.97]"
                onClick={() => navigate("/register")}
              >
                Regístrate ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  return (
    <section id="faq" className="bg-white py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <Reveal>
          <p className="text-sm font-semibold text-primary">Preguntas frecuentes</p>
          <h2 className="mt-3 max-w-xl text-balance text-4xl font-semibold leading-tight tracking-tight text-[#171827] sm:text-5xl">
            Lo esencial antes de hablar con el equipo.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-[#555b6e]">
            La idea es que llegues a la conversación sabiendo exactamente qué hace Ruka y cómo puede empezar a generar valor.
          </p>
        </Reveal>

        <Reveal>
          <Accordion type="single" collapsible className="grid gap-3">
            {faqItems.map((item, index) => (
              <AccordionItem key={item.question} value={`faq-${index}`} className="rounded-2xl border border-[#dce3f2] bg-[#fbfcff] px-5">
                <AccordionTrigger className="text-left text-base font-semibold text-[#171827] hover:text-primary hover:no-underline sm:text-lg">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-7 text-[#555b6e]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA({ navigate }: { navigate: (path: string) => void }) {
  return (
    <section className="bg-[#171827] px-5 py-16 text-white sm:px-8 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <p className="text-sm font-semibold text-primary">Siguiente paso</p>
              <h2 className="mt-3 max-w-3xl text-balance text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Veamos qué parte de tu operación puede empezar a trabajar sola.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">
                Partimos por un dolor concreto: compras, pagos, proveedores, margen o reportes. Si hay datos, Ruka puede convertirlos en control.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button
                className="h-12 rounded-full bg-white px-6 text-base font-semibold text-[#171827] shadow-none transition-transform duration-150 ease-out hover:bg-white/92 active:scale-[0.97]"
                onClick={() => navigate("/register")}
              >
                Agendar revisión
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a
                href="#solucion"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/16 px-6 text-base font-semibold text-white transition-transform duration-150 ease-out hover:bg-white/8 active:scale-[0.97]"
              >
                Volver a la solución
              </a>
            </div>
          </div>
        </Reveal>

        <footer className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/56 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/logo.png" alt="Ruka.ai" className="h-8 w-auto brightness-0 invert" />
          </Link>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/privacy" className="hover:text-white">Privacidad</Link>
            <Link to="/terms" className="hover:text-white">Términos</Link>
            <Link to="/register" className="hover:text-white">Registro</Link>
          </div>
        </footer>
      </div>
    </section>
  );
}
