import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  Check,
  Database,
  FileCode2,
  FileSpreadsheet,
  ListChecks,
  UserRound,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

type SourceItem = {
  label: string;
  detail: string;
  icon?: LucideIcon;
  image?: string;
};

const manualSources: SourceItem[] = [
  { label: "SII", detail: "Registro", image: "/logosii.png" },
  { label: "XML", detail: "Detalle", icon: FileCode2 },
];

const rukaSources: SourceItem[] = [
  { label: "SII", detail: "Registro", image: "/logosii.png" },
  { label: "XML", detail: "Detalle", icon: FileCode2 },
  { label: "Reglas", detail: "Tu operación", icon: ListChecks },
];

export default function OperationalGapSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="problema" className="scroll-mt-24 bg-[#f4f6fb] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-4xl">
          <h2 className="text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-[#171827] sm:text-5xl lg:text-6xl">
            No te falta software. Te sobra trabajo entre tus sistemas.
          </h2>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-[#4e5569]">
            La información ya está en el SII, los XML y tu ERP. Hoy una persona todavía tiene que unirla para cerrar el Registro de Compras.
          </p>
        </div>

        <motion.article
          aria-labelledby="purchase-register-title"
          className="mt-12 overflow-hidden rounded-2xl bg-white ring-1 ring-[#d7ddea]"
          initial={reduceMotion ? false : { opacity: 0.82, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.14 }}
          transition={{ duration: 0.58, ease: easeOut }}
        >
          <header className="border-b border-[#dfe4ee] px-5 py-6 sm:px-8 sm:py-7">
            <h3
              id="purchase-register-title"
              className="text-balance text-xl font-semibold tracking-[-0.02em] text-[#171827] sm:text-2xl"
            >
              Ejemplo real: Registro de Compras
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#626a7d] sm:text-base">
              La misma información. Dos formas muy distintas de operarla.
            </p>
          </header>

          <ComparisonRow
            label="Hoy"
            description="Tu equipo mantiene el hilo"
            icon={UserRound}
            tone="manual"
            delay={0.08}
            reduceMotion={reduceMotion}
          >
            <SourceGroup items={manualSources} />
            <FlowArrow tone="manual" />
            <FlowNode
              icon={FileSpreadsheet}
              title="Tu equipo"
              detail="Descarga, cruza y corrige en Excel"
              tone="manual"
            />
            <FlowArrow tone="manual" />
            <FlowNode icon={Database} title="ERP" detail="Carga manual" tone="destination" />
          </ComparisonRow>

          <ComparisonRow
            label="Con Ruka"
            description="Tu equipo revisa excepciones"
            icon={Bot}
            tone="ruka"
            delay={0.2}
            reduceMotion={reduceMotion}
          >
            <SourceGroup items={rukaSources} />
            <FlowArrow tone="ruka" />
            <FlowNode
              icon={Bot}
              title="Ruka"
              detail="Conecta, valida y aplica tus reglas"
              tone="ruka"
            />
            <FlowArrow tone="ruka" />
            <FlowNode
              icon={Check}
              title="Registro listo"
              detail="ERP actualizado. Excepciones separadas."
              tone="result"
            />
          </ComparisonRow>

          <footer className="flex items-start gap-3 border-t border-[#dfe4ee] bg-[#fbfcff] px-5 py-5 sm:items-center sm:px-8 sm:py-6">
            <span className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#e9edff] text-primary sm:mt-0">
              <Check className="h-4 w-4" strokeWidth={2.3} aria-hidden="true" />
            </span>
            <p className="text-pretty text-base font-semibold leading-7 text-[#303547] sm:text-lg">
              Ruka hace los traspasos. Tu equipo conserva las decisiones.
            </p>
          </footer>
        </motion.article>

        <p className="mx-auto mt-10 max-w-4xl text-center text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#171827] sm:text-3xl">
          No hagas más rápido el trabajo manual. Deja de hacerlo.
        </p>
      </div>
    </section>
  );
}

function ComparisonRow({
  label,
  description,
  icon: Icon,
  tone,
  delay,
  reduceMotion,
  children,
}: {
  label: string;
  description: string;
  icon: LucideIcon;
  tone: "manual" | "ruka";
  delay: number;
  reduceMotion: boolean | null;
  children: ReactNode;
}) {
  const isRuka = tone === "ruka";

  return (
    <div
      className={`grid xl:grid-cols-[12.5rem_minmax(0,1fr)] ${
        isRuka ? "bg-[#f8f9ff]" : "border-b border-[#dfe4ee] bg-white"
      }`}
    >
      <div
        className={`flex items-center gap-3 border-b border-[#dfe4ee] px-5 py-5 sm:px-8 xl:border-b-0 xl:border-r xl:px-6 ${
          isRuka ? "text-primary" : "text-[#303547]"
        }`}
      >
        <span
          className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${
            isRuka ? "bg-primary text-white" : "bg-[#edf0f5] text-[#4f576a]"
          }`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold sm:text-base">{label}</span>
          <span className={`mt-0.5 block text-xs font-medium leading-5 ${isRuka ? "text-[#58659d]" : "text-[#6b7284]"}`}>
            {description}
          </span>
        </span>
      </div>

      <motion.div
        className="flex flex-col items-center gap-4 px-5 py-7 sm:px-8 sm:py-9 lg:flex-row lg:gap-5 lg:px-9"
        initial={reduceMotion ? false : { opacity: 0, x: -12 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.48, delay: reduceMotion ? 0 : delay, ease: easeOut }}
      >
        {children}
      </motion.div>
    </div>
  );
}

function SourceGroup({ items }: { items: SourceItem[] }) {
  return (
    <div className={`grid w-full gap-2 sm:w-auto ${items.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            className="flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl bg-[#eef1f6] px-2 py-3 text-center sm:min-w-[7.25rem] sm:flex-row sm:justify-start sm:gap-2.5 sm:px-3 sm:text-left lg:min-w-[5.25rem] xl:min-w-[7.25rem]"
          >
            <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white text-[#596176]">
              {item.image ? (
                <img src={item.image} alt="" className="h-6 w-6 object-contain" aria-hidden="true" />
              ) : Icon ? (
                <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              ) : null}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[#303547] sm:text-sm">{item.label}</span>
              <span className="mt-0.5 hidden truncate text-[11px] font-medium text-[#6b7284] sm:block lg:hidden xl:block">{item.detail}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FlowArrow({ tone }: { tone: "manual" | "ruka" }) {
  return (
    <span
      className={`flex h-8 w-8 flex-none rotate-90 items-center justify-center rounded-full lg:rotate-0 ${
        tone === "ruka" ? "bg-[#e9edff] text-primary" : "bg-[#eef1f6] text-[#7a8192]"
      }`}
      aria-hidden="true"
    >
      <ArrowRight className="h-4 w-4" strokeWidth={2} />
    </span>
  );
}

function FlowNode({
  icon: Icon,
  title,
  detail,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  detail: string;
  tone: "manual" | "ruka" | "destination" | "result";
}) {
  const styles = {
    manual: "bg-[#171827] text-white",
    ruka: "bg-primary text-white",
    destination: "bg-white text-[#252837] ring-1 ring-[#d7ddea]",
    result: "bg-white text-[#252837] ring-1 ring-[#bcc7f8]",
  }[tone];

  const detailStyles = tone === "manual" || tone === "ruka" ? "text-white/70" : "text-[#626a7d]";

  return (
    <div className={`flex w-full min-w-0 items-center gap-3 rounded-xl px-4 py-4 lg:min-h-[5.25rem] lg:flex-1 ${styles}`}>
      <span
        className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${
          tone === "manual" || tone === "ruka" ? "bg-white/10 text-white" : "bg-[#eef1f6] text-primary"
        }`}
      >
        <Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-5 sm:text-base">{title}</span>
        <span className={`mt-1 block text-xs font-medium leading-5 sm:text-sm ${detailStyles}`}>{detail}</span>
      </span>
    </div>
  );
}
