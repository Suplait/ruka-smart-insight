import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { MotionValue } from "framer-motion";
import {
  ArrowRight,
  BookOpenCheck,
  Bot,
  Check,
  Database,
  FileCode2,
  FileSpreadsheet,
  FileText,
  Mail,
  ReceiptText,
  Store,
  UserRound,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

type SourceDocument = {
  label: string;
  detail: string;
  icon?: LucideIcon;
  image?: string;
  position: string;
  enter: { x: number; y: number; rotate: number };
};

const sourceDocuments: SourceDocument[] = [
  {
    label: "SII",
    detail: "Registro tributario",
    image: "/logosii.png",
    position: "left-0 top-8 -rotate-[2deg]",
    enter: { x: -84, y: -34, rotate: -8 },
  },
  {
    label: "XML",
    detail: "Detalle de ítems",
    icon: FileCode2,
    position: "right-0 top-0 rotate-[2deg]",
    enter: { x: 82, y: -48, rotate: 9 },
  },
  {
    label: "PDF",
    detail: "Documento digital",
    icon: FileText,
    position: "left-1/2 top-[4.6rem] z-10 -translate-x-1/2 -rotate-[0.5deg]",
    enter: { x: 0, y: -86, rotate: 5 },
  },
  {
    label: "Correo",
    detail: "Adjuntos y respaldos",
    icon: Mail,
    position: "bottom-1 left-0 -rotate-[1.5deg]",
    enter: { x: -92, y: 42, rotate: -10 },
  },
  {
    label: "Factura física",
    detail: "Registro manual",
    icon: ReceiptText,
    position: "bottom-0 right-0 z-20 rotate-[1.5deg]",
    enter: { x: 88, y: 56, rotate: 10 },
  },
];

const manualTasks = ["Descargar", "Ingresar", "Cruzar", "Corregir"] as const;

const destinations: Array<{ label: string; shortLabel: string; icon: LucideIcon }> = [
  { label: "ERP", shortLabel: "ERP", icon: Database },
  { label: "POS", shortLabel: "POS", icon: Store },
  { label: "Planilla", shortLabel: "Planilla", icon: FileSpreadsheet },
  { label: "Sistema contable", shortLabel: "Sistema contable", icon: BookOpenCheck },
];

export default function OperationalGapSection() {
  const reduceMotion = useReducedMotion();
  const storyRef = useRef<HTMLDivElement>(null);
  const [activeDestination, setActiveDestination] = useState(0);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start 78%", "end 24%"],
  });
  const manualOpacity = useTransform(scrollYProgress, [0.18, 0.34, 0.48, 0.68], [0.62, 1, 1, 0.38]);
  const manualScale = useTransform(scrollYProgress, [0.18, 0.34, 0.5, 0.68], [0.985, 1.012, 1, 0.98]);
  const rukaOpacity = useTransform(scrollYProgress, [0.3, 0.46, 0.62, 0.72], [0.35, 0.55, 1, 1]);
  const rukaScale = useTransform(scrollYProgress, [0.3, 0.46, 0.62, 0.76], [0.98, 0.99, 1.015, 1.015]);
  const closingOpacity = useTransform(scrollYProgress, [0.58, 0.76, 0.9], [0.48, 1, 1]);
  const progressScale = useTransform(scrollYProgress, [0.12, 0.88], [0, 1]);

  useEffect(() => {
    const destinationTimer = window.setInterval(() => {
      setActiveDestination((current) => (current + 1) % destinations.length);
    }, 1500);

    return () => window.clearInterval(destinationTimer);
  }, []);

  return (
    <section id="problema" className="scroll-mt-24 bg-[#f4f6fa] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div
          className="max-w-4xl"
          initial={reduceMotion ? false : { opacity: 0.82, filter: "blur(4px)" }}
          whileInView={reduceMotion ? undefined : { opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.56, ease: easeOut }}
        >
          <h2 className="text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-[#171827] sm:text-5xl lg:text-6xl">
            No te falta software. Te sobra trabajo entre tus sistemas.
          </h2>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-[#4e5569]">
            La información ya existe. El trabajo aparece cuando alguien todavía tiene que leerla, ordenarla y moverla entre los sistemas de tu empresa.
          </p>
        </motion.div>

        <div ref={storyRef} className="mt-12 xl:h-[210vh]">
          <motion.article
            aria-labelledby="purchase-register-title"
            className="relative overflow-hidden rounded-[14px] border border-[#dfe3ec] bg-white shadow-[0_6px_8px_rgba(42,53,94,0.05)] xl:sticky xl:top-24"
            initial={reduceMotion ? false : { opacity: 0.9 }}
            whileInView={reduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.58, ease: easeOut }}
          >
          <motion.span
            className="pointer-events-none absolute inset-y-0 left-0 z-30 w-[3px] origin-top bg-primary"
            style={reduceMotion ? undefined : { scaleY: progressScale }}
            aria-hidden="true"
          />
            <header className="border-b border-[#e0e4ed] bg-[#fbfcfe] px-5 py-6 sm:px-8 sm:py-7 xl:py-5">
            <h3
              id="purchase-register-title"
              className="text-balance text-xl font-semibold tracking-[-0.02em] text-[#171827] sm:text-2xl"
            >
              Un ejemplo: registro de compras
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#626a7d] sm:text-base">
              La misma información. Sin trabajo manual entre medio.
            </p>
            </header>

            <div className="xl:grid xl:grid-cols-[20rem_minmax(0,1fr)]">
            <SourcePanel
              reduceMotion={reduceMotion}
              scrollProgress={scrollYProgress}
            />

              <div className="min-w-0 bg-white xl:grid xl:grid-rows-2">
                <ComparisonLane
                  label="Hoy"
                  description="Tu equipo hace el registro"
                  icon={UserRound}
                  tone="manual"
                  reduceMotion={reduceMotion}
                  scrollOpacity={manualOpacity}
                  scrollScale={manualScale}
                >
                  <ManualWorkNode reduceMotion={reduceMotion} />
                  <FlowConnector tone="manual" reduceMotion={reduceMotion} />
                  <DestinationNode activeDestination={activeDestination} reduceMotion={reduceMotion} />
                </ComparisonLane>

                <ComparisonLane
                  label="Con Ruka"
                  description="Ruka hace el registro"
                  icon={Bot}
                  tone="ruka"
                  reduceMotion={reduceMotion}
                  scrollOpacity={rukaOpacity}
                  scrollScale={rukaScale}
                >
                  <ProcessNode
                    icon={Bot}
                    title="Ruka"
                    detail="Lee, cruza y aplica tus reglas."
                    tone="ruka"
                  />
                  <FlowConnector tone="ruka" reduceMotion={reduceMotion} />
                  <ResultNode activeDestination={activeDestination} reduceMotion={reduceMotion} />
                </ComparisonLane>
              </div>
            </div>
          </motion.article>
        </div>

        <motion.div
          className="mx-auto mt-12 max-w-4xl border-t border-[#d9deea] pt-9 text-center"
          style={reduceMotion ? undefined : { opacity: closingOpacity }}
          initial={reduceMotion ? false : { opacity: 0.72 }}
          whileInView={reduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.46, ease: easeOut }}
        >
          <p className="text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#171827] sm:text-3xl">
            Tus sistemas siguen siendo los mismos. Ruka hace el trabajo entre ellos.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function SourcePanel({
  reduceMotion,
  scrollProgress,
}: {
  reduceMotion: boolean | null;
  scrollProgress: MotionValue<number>;
}) {
  return (
    <motion.aside
      className="relative overflow-hidden bg-[#171a29] px-5 py-7 text-white sm:px-8 sm:py-9 xl:min-h-[25rem] xl:px-8 xl:py-8"
    >
      <div className="max-w-md">
        <h4 className="text-xl font-semibold leading-[1.25] tracking-[-0.02em]">Las compras llegan por todos lados.</h4>
        <p className="mt-2 text-sm leading-6 text-white/[0.68]">SII, XML, PDFs, correos, planillas y documentos físicos.</p>
      </div>

      <motion.div
        className="relative mx-auto mt-7 h-64 w-full max-w-[17rem] sm:mt-8 xl:mt-6 xl:h-52"
        aria-label="Fuentes de una compra: SII, XML, PDF, correo, planilla y factura física"
        initial={reduceMotion ? false : { opacity: 0.88, y: 10 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.52, delay: reduceMotion ? 0 : 0.08, ease: easeOut }}
      >
        {sourceDocuments.map((document, index) => (
          <SourceDocumentCard
            key={document.label}
            document={document}
            index={index}
            reduceMotion={reduceMotion}
            scrollProgress={scrollProgress}
          />
        ))}
      </motion.div>

      <div className="mt-7 border-t border-white/[0.15] pt-5 xl:mt-5">
        <p className="text-sm font-semibold text-white">Recibir la información no es el problema.</p>
        <p className="mt-1 text-sm leading-6 text-white/[0.64]">El problema es quién hace el trabajo entre medio.</p>
      </div>
    </motion.aside>
  );
}

function SourceDocumentCard({
  document,
  index,
  reduceMotion,
  scrollProgress,
}: {
  document: SourceDocument;
  index: number;
  reduceMotion: boolean | null;
  scrollProgress: MotionValue<number>;
}) {
  const Icon = document.icon;
  const enterStart = 0.08 + index * 0.022;
  const enterEnd = 0.25 + index * 0.022;
  const x = useTransform(scrollProgress, [enterStart, enterEnd], [document.enter.x, 0]);
  const y = useTransform(scrollProgress, [enterStart, enterEnd], [document.enter.y, 0]);
  const rotate = useTransform(scrollProgress, [enterStart, enterEnd], [document.enter.rotate, 0]);
  const opacity = useTransform(scrollProgress, [enterStart, enterEnd], [0, 1]);
  const scale = useTransform(scrollProgress, [enterStart, enterEnd], [0.9, 1]);

  return (
    <motion.div
      className={`absolute w-36 ${document.position}`}
      style={reduceMotion ? undefined : { x, y, rotate, opacity, scale }}
    >
      <motion.div
        className="rounded-[10px] border border-white/80 bg-[#fbfcff] p-2.5 text-[#252837] shadow-[0_5px_8px_rgba(7,10,28,0.2)]"
        whileHover={reduceMotion ? undefined : { y: -5, scale: 1.03 }}
        transition={{ duration: 0.2, ease: easeOut }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-md bg-[#edf0f5] text-[#535c70]">
            {document.image ? (
              <img src={document.image} alt="" className="h-6 w-6 object-contain" aria-hidden="true" />
            ) : Icon ? (
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
            ) : null}
          </span>
          <span className="min-w-0">
            <span className="block whitespace-nowrap text-xs font-semibold sm:text-[13px]">{document.label}</span>
            <span className="mt-0.5 hidden truncate text-[11px] font-medium text-[#6b7284] sm:block">{document.detail}</span>
          </span>
        </div>
        <span className="mt-2.5 block h-px w-full bg-[#dce1e9]" aria-hidden="true" />
        <span className="mt-1.5 block h-px w-2/3 bg-[#e5e8ee]" aria-hidden="true" />
      </motion.div>
    </motion.div>
  );
}

function ManualWorkNode({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="w-full min-w-0 lg:flex-1">
      <div
        className="mb-3 inline-flex max-w-full overflow-hidden rounded-[7px] border border-[#dce1ea] bg-[#f8f9fb]"
        aria-label="Trabajo manual: descargar, ingresar, cruzar y corregir"
      >
        {manualTasks.map((task, index) => (
          <motion.span
            key={task}
            className="border-r border-[#dce1ea] px-2.5 py-1.5 text-[13px] font-medium text-[#5f6779] last:border-r-0 lg:px-2 lg:text-[11px]"
            initial={reduceMotion ? false : { opacity: 0.65, y: 4 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.08 + index * 0.05, ease: easeOut }}
          >
            {task}
          </motion.span>
        ))}
      </div>
      <ProcessNode icon={FileSpreadsheet} title="Tu equipo" detail="Lee, ingresa, cruza y corrige." tone="manual" />
    </div>
  );
}

function DestinationNode({
  activeDestination,
  reduceMotion,
}: {
  activeDestination: number;
  reduceMotion: boolean | null;
}) {
  const destination = destinations[activeDestination];
  const DestinationIcon = destination.icon;

  return (
    <div
      className="w-full min-w-0 border-t border-[#cfd5e0] pt-4 text-[#252837] lg:flex-1"
      aria-label="Dónde la necesitas: ERP, POS, planilla o sistema contable"
    >
      <span className="text-[13px] font-semibold leading-5 text-[#656d80] sm:text-sm">Dónde la necesitas</span>
      <div className="relative mt-2.5 h-10 overflow-hidden" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={destination.label}
            className="absolute inset-y-0 left-0 flex items-center gap-2.5"
            initial={reduceMotion ? false : { opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, x: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: easeOut }}
          >
              <DestinationIcon className="h-5 w-5 text-primary" strokeWidth={1.8} />
            <span className="text-lg font-semibold tracking-[-0.02em] text-[#2b3040]">{destination.label}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultNode({
  activeDestination,
  reduceMotion,
}: {
  activeDestination: number;
  reduceMotion: boolean | null;
}) {
  return (
    <div className="w-full min-w-0 border-t border-[#cbd3f4] pt-4 lg:flex-1">
      <div className="flex items-start gap-3">
        <motion.span key={activeDestination} className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary text-white" initial={reduceMotion ? false : { scale: 0.82 }} animate={{ scale: 1 }} transition={{ duration: reduceMotion ? 0 : 0.24, ease: easeOut }}>
          <Check className="h-[18px] w-[18px]" strokeWidth={2.4} aria-hidden="true" />
        </motion.span>
        <span className="min-w-0">
          <span className="block text-base font-semibold leading-5 text-[#252837]">Registro listo</span>
          <span className="mt-1 block text-sm font-medium leading-5 text-[#586078]">Actualizado donde lo necesitas.</span>
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Destinos: ERP, POS, planilla o sistema contable">
        {destinations.map((item, index) => {
          const isActive = index === activeDestination;

          return (
            <motion.span
              key={item.shortLabel}
              className={`rounded-[6px] border px-2 py-1 text-sm font-semibold transition-[background-color,border-color,color] lg:text-xs ${
                reduceMotion ? "duration-0" : "duration-300"
              } ${
                isActive
                  ? "border-primary/[0.35] bg-white text-primary"
                  : "border-[#d6dcf4] bg-white/50 text-[#626b89]"
              }`}
              animate={reduceMotion ? undefined : { y: isActive ? -2 : 0, scale: isActive ? 1.03 : 1 }}
              transition={{ duration: 0.22, ease: easeOut }}
            >
              {item.shortLabel}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

function ComparisonLane({
  label,
  description,
  icon: Icon,
  tone,
  reduceMotion,
  scrollOpacity,
  scrollScale,
  children,
}: {
  label: string;
  description: string;
  icon: LucideIcon;
  tone: "manual" | "ruka";
  reduceMotion: boolean | null;
  scrollOpacity: MotionValue<number>;
  scrollScale: MotionValue<number>;
  children: ReactNode;
}) {
  const isRuka = tone === "ruka";

  return (
    <motion.section
      aria-label={label}
      className={`relative px-5 py-7 sm:px-8 sm:py-9 lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:items-center lg:gap-7 xl:min-h-[12.5rem] xl:grid-cols-[10.5rem_minmax(0,1fr)] xl:px-7 ${
        isRuka ? "bg-[#eef1fb]" : "border-b border-[#dfe3eb] bg-white"
      }`}
      style={reduceMotion ? undefined : { opacity: scrollOpacity, scale: scrollScale }}
      initial={reduceMotion ? false : { opacity: 0.82 }}
      whileInView={reduceMotion ? undefined : { opacity: 1 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.48, delay: reduceMotion ? 0 : isRuka ? 0.12 : 0.04, ease: easeOut }}
    >
      <span
        className={`absolute -left-3.5 top-1/2 hidden h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border xl:flex ${
          isRuka ? "border-primary bg-primary text-white" : "border-[#d9dee8] bg-[#f8f9fb] text-[#697184]"
        }`}
        aria-hidden="true"
      >
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-full border ${
            isRuka ? "border-primary bg-primary text-white" : "border-[#d9dee8] bg-white text-[#50586b]"
          }`}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className={`block text-base font-semibold tracking-[-0.015em] ${isRuka ? "text-primary" : "text-[#252837]"}`}>{label}</span>
          <span className={`mt-0.5 block text-sm font-medium leading-5 lg:text-[13px] ${isRuka ? "text-[#536097]" : "text-[#687084]"}`}>
            {description}
          </span>
        </span>
      </div>

      <motion.div
        className="mt-6 flex min-w-0 flex-col items-center gap-3 lg:mt-0 lg:flex-row lg:gap-4"
        initial={reduceMotion ? false : { opacity: 0.9, x: -10 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.46, delay: reduceMotion ? 0 : isRuka ? 0.16 : 0.06, ease: easeOut }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}

function FlowConnector({ tone, reduceMotion }: { tone: "manual" | "ruka"; reduceMotion: boolean | null }) {
  const isRuka = tone === "ruka";

  return (
    <>
      <div className="relative hidden h-5 w-12 flex-none items-center lg:flex" aria-hidden="true">
        {isRuka ? (
          <span className="relative h-px w-full bg-primary/25">
            <motion.span
              className="absolute inset-0 origin-left bg-primary"
              initial={reduceMotion ? false : { scaleX: 0.15 }}
              whileInView={reduceMotion ? undefined : { scaleX: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.48, delay: reduceMotion ? 0 : 0.26, ease: easeOut }}
            />
          </span>
        ) : (
          <span className="w-full border-t border-dashed border-[#aeb5c5]" />
        )}
        <ArrowRight className={`absolute -right-1 h-4 w-4 ${isRuka ? "text-primary" : "text-[#848c9e]"}`} strokeWidth={2} />
      </div>

      <div className="relative flex h-9 w-full items-center justify-center lg:hidden" aria-hidden="true">
        <span className={`h-full w-px ${isRuka ? "bg-primary/60" : "border-l border-dashed border-[#aeb5c5]"}`} />
        <ArrowRight
          className={`absolute bottom-0 h-4 w-4 rotate-90 ${isRuka ? "text-primary" : "text-[#848c9e]"}`}
          strokeWidth={2}
        />
      </div>
    </>
  );
}

function ProcessNode({
  icon: Icon,
  title,
  detail,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
  tone: "manual" | "ruka";
}) {
  const reduceMotion = useReducedMotion();
  const styles = {
    manual: "border-[#2f3345] bg-[#202332] text-white",
    ruka:
      "border-[#4056d6] bg-primary text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_5px_8px_rgba(61,77,184,0.16)]",
  }[tone];

  const detailStyles = tone === "ruka" ? "text-white/85" : "text-white/75";
  const dividerStyles = tone === "ruka" ? "border-white/[0.16]" : "border-white/[0.12]";

  return (
    <motion.div className={`grid min-h-[5.75rem] w-full min-w-0 grid-cols-[3rem_minmax(0,1fr)] overflow-hidden rounded-[10px] border lg:flex-1 ${styles}`} whileHover={reduceMotion ? undefined : { y: -3, scale: 1.01 }} transition={{ duration: 0.2, ease: easeOut }}>
      <span className={`flex items-center justify-center border-r text-white ${dividerStyles}`}>
        <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
      </span>
      <span className="min-w-0 px-4 py-4">
        <span className="block text-sm font-semibold leading-5 sm:text-base">{title}</span>
        <span className={`mt-1 block text-sm font-medium leading-5 ${detailStyles}`}>{detail}</span>
      </span>
    </motion.div>
  );
}
