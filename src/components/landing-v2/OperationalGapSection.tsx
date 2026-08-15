import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
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
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

type SourceDocument = {
  label: string;
  detail: string;
  icon?: LucideIcon;
  image?: string;
  position: string;
};

const sourceDocuments: SourceDocument[] = [
  {
    label: "SII",
    detail: "Registro tributario",
    image: "/logosii.png",
    position: "left-0 top-8 -rotate-[4deg]",
  },
  {
    label: "XML",
    detail: "Detalle de ítems",
    icon: FileCode2,
    position: "right-0 top-0 rotate-[3deg]",
  },
  {
    label: "PDF",
    detail: "Documento digital",
    icon: FileText,
    position: "left-1/2 top-[4.6rem] z-10 -translate-x-1/2 -rotate-[1deg]",
  },
  {
    label: "Correo",
    detail: "Adjuntos y respaldos",
    icon: Mail,
    position: "bottom-1 left-0 -rotate-[3deg]",
  },
  {
    label: "Factura física",
    detail: "Registro manual",
    icon: ReceiptText,
    position: "bottom-0 right-0 z-20 rotate-[2deg]",
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
  const [activeDestination, setActiveDestination] = useState(0);

  useEffect(() => {
    if (reduceMotion) {
      setActiveDestination(0);
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveDestination((current) => (current + 1) % destinations.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [reduceMotion]);

  return (
    <section id="problema" className="scroll-mt-24 bg-[#f3f5fa] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-4xl">
          <h2 className="text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-[#171827] sm:text-5xl lg:text-6xl">
            No te falta software. Te sobra trabajo entre tus sistemas.
          </h2>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-[#4e5569]">
            La información ya existe. El trabajo aparece cuando alguien todavía tiene que leerla, ordenarla y moverla entre los sistemas de tu empresa.
          </p>
        </div>

        <motion.article
          aria-labelledby="purchase-register-title"
          className="mt-12 overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_rgba(42,53,94,0.08)]"
          initial={reduceMotion ? false : { opacity: 0.9, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.58, ease: easeOut }}
        >
          <header className="border-b border-[#e0e4ed] px-5 py-6 sm:px-8 sm:py-7">
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

          <div className="xl:grid xl:grid-cols-[19rem_minmax(0,1fr)]">
            <SourcePanel reduceMotion={reduceMotion} />

            <div className="min-w-0 bg-white">
              <ComparisonLane
                label="Hoy"
                description="Tu equipo hace el registro"
                icon={UserRound}
                tone="manual"
                reduceMotion={reduceMotion}
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

        <div className="mx-auto mt-12 max-w-4xl border-t border-[#d9deea] pt-9 text-center">
          <p className="text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#171827] sm:text-3xl">
            Tus sistemas siguen siendo los mismos. Ruka hace el trabajo entre ellos.
          </p>
        </div>
      </div>
    </section>
  );
}

function SourcePanel({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <aside className="relative overflow-hidden bg-[#1b1c2d] px-5 py-7 text-white sm:px-8 sm:py-9 xl:min-h-[29rem] xl:px-7">
      <div className="max-w-md">
        <h4 className="text-xl font-semibold tracking-[-0.02em]">Las compras llegan por todos lados.</h4>
        <p className="mt-2 text-sm leading-6 text-white/65">SII, XML, PDFs, correos, planillas y documentos físicos.</p>
      </div>

      <motion.div
        className="relative mx-auto mt-7 h-64 w-full max-w-[17rem] sm:mt-8 xl:h-60"
        aria-label="Fuentes de una compra: SII, XML, PDF, correo, planilla y factura física"
        initial={reduceMotion ? false : { opacity: 0.88, y: 10 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.52, delay: reduceMotion ? 0 : 0.08, ease: easeOut }}
      >
        {sourceDocuments.map((document) => (
          <SourceDocumentCard key={document.label} document={document} />
        ))}
      </motion.div>

      <div className="mt-7 border-t border-white/10 pt-5 xl:mt-6">
        <p className="text-sm font-semibold text-white">Recibir la información no es el problema.</p>
        <p className="mt-1 text-sm leading-6 text-white/60">El problema es quién hace el trabajo entre medio.</p>
      </div>
    </aside>
  );
}

function SourceDocumentCard({ document }: { document: SourceDocument }) {
  const Icon = document.icon;

  return (
    <div
      className={`absolute w-36 rounded-xl bg-[#fbfcff] p-2.5 text-[#252837] shadow-[0_6px_12px_rgba(7,10,28,0.22)] ${document.position}`}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[#eef1f6] text-[#5b6377]">
          {document.image ? (
            <img src={document.image} alt="" className="h-6 w-6 object-contain" aria-hidden="true" />
          ) : Icon ? (
            <Icon className="h-4.5 w-4.5" strokeWidth={1.8} aria-hidden="true" />
          ) : null}
        </span>
        <span className="min-w-0">
          <span className="block whitespace-nowrap text-xs font-semibold sm:text-[13px]">{document.label}</span>
          <span className="mt-0.5 hidden truncate text-[11px] font-medium text-[#6b7284] sm:block">{document.detail}</span>
        </span>
      </div>
      <span className="mt-2.5 block h-1.5 w-full rounded-full bg-[#e8ebf2]" aria-hidden="true" />
      <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-[#eef0f5]" aria-hidden="true" />
    </div>
  );
}

function ManualWorkNode({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="w-full min-w-0 lg:flex-1">
      <div className="mb-2 flex flex-wrap gap-1.5 lg:gap-1" aria-label="Trabajo manual: descargar, ingresar, cruzar y corregir">
        {manualTasks.map((task, index) => (
          <motion.span
            key={task}
            className="rounded-md bg-[#f0f2f6] px-2 py-1 text-sm font-semibold text-[#61697b] lg:px-1.5 lg:text-[11px]"
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
      className="flex min-h-[7.5rem] w-full min-w-0 flex-col justify-center overflow-hidden rounded-xl bg-[#fbfcff] px-4 py-4 text-[#252837] ring-1 ring-[#d6dbe6] lg:flex-1"
      aria-label="Dónde la necesitas: ERP, POS, planilla o sistema contable"
    >
      <span className="text-sm font-semibold leading-5 sm:text-base">Dónde la necesitas</span>
      <div className="mt-3 flex h-10 items-center" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={destination.label}
            className="flex items-center gap-2.5"
            initial={reduceMotion ? false : { opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: easeOut }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf0f7] text-primary">
              <DestinationIcon className="h-4.5 w-4.5" strokeWidth={1.9} />
            </span>
            <span className="text-lg font-semibold tracking-[-0.02em] text-[#303547]">{destination.label}</span>
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
    <div className="w-full min-w-0 lg:flex-1">
      <div className="flex items-start gap-3">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary text-white">
          <Check className="h-5 w-5" strokeWidth={2.4} aria-hidden="true" />
        </span>
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
              className={`rounded-md px-2 py-1 text-sm font-semibold transition-[background-color,color,box-shadow] lg:text-xs ${
                reduceMotion ? "duration-0" : "duration-300"
              } ${
                isActive
                  ? "bg-[#e9edff] text-primary ring-1 ring-primary/35 shadow-[0_2px_7px_rgba(63,82,213,0.16)]"
                  : "bg-white/80 text-[#58628a] ring-1 ring-[#d6dcf4]"
              }`}
              animate={{ scale: isActive ? 1.02 : 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: easeOut }}
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
  children,
}: {
  label: string;
  description: string;
  icon: LucideIcon;
  tone: "manual" | "ruka";
  reduceMotion: boolean | null;
  children: ReactNode;
}) {
  const isRuka = tone === "ruka";

  return (
    <section
      aria-label={label}
      className={`relative px-5 py-7 sm:px-8 sm:py-9 lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:items-center lg:gap-7 xl:min-h-[14.5rem] xl:grid-cols-[10.5rem_minmax(0,1fr)] xl:px-7 ${
        isRuka ? "bg-[#f0f2ff]" : "border-b border-[#e0e4ed] bg-white"
      }`}
    >
      <span
        className={`absolute -left-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full xl:flex ${
          isRuka ? "bg-primary text-white" : "bg-[#eef1f6] text-[#697184]"
        }`}
        aria-hidden="true"
      >
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
      </span>
      <div className="flex items-center gap-3">
        <span
          className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${
            isRuka ? "bg-primary text-white" : "bg-[#edf0f5] text-[#50586b]"
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className={`block text-base font-semibold ${isRuka ? "text-primary" : "text-[#252837]"}`}>{label}</span>
          <span className={`mt-0.5 block text-sm font-medium leading-5 lg:text-xs ${isRuka ? "text-[#536097]" : "text-[#687084]"}`}>
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
    </section>
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
  const styles = {
    manual: "bg-[#202130] text-white",
    ruka: "bg-primary text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_5px_8px_rgba(61,77,184,0.2)]",
  }[tone];

  const detailStyles = tone === "ruka" ? "text-white/85" : "text-white/75";

  return (
    <div className={`flex min-h-[5.5rem] w-full min-w-0 items-center gap-3 rounded-xl px-4 py-4 lg:flex-1 ${styles}`}>
      <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-white/10 text-white">
        <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-5 sm:text-base">{title}</span>
        <span className={`mt-1 block text-sm font-medium leading-5 ${detailStyles}`}>{detail}</span>
      </span>
    </div>
  );
}
