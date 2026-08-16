import { useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Bot,
  ChevronRight,
  PackageCheck,
  ReceiptText,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Workflow = {
  icon: LucideIcon;
  title: string;
  copy: string;
  steps: readonly string[];
  video: string;
};

const workflows = {
  invoices: {
    icon: ReceiptText,
    title: "Facturas de proveedores",
    copy: "Deja de ingresar y ordenar facturas manualmente.",
    steps: ["Recibir", "Leer", "Homologar", "Actualizar"],
    video: "/robot_facturas.mp4",
  },
  reconciliations: {
    icon: RefreshCw,
    title: "Conciliaciones",
    copy: "Deja de cruzar información entre tus sistemas.",
    steps: ["Cruzar", "Conciliar", "Detectar", "Escalar"],
    video: "/robot_dinero.mp4",
  },
  inventory: {
    icon: PackageCheck,
    title: "Costos e inventario",
    copy: "Deja de mantener costos y stock manualmente.",
    steps: ["Actualizar", "Comparar", "Alertar"],
    video: "/robot_inventario.mp4",
  },
} satisfies Record<string, Workflow>;

type WorkSectionProps = {
  reduceMotion: boolean | null;
  ctaLabel: string;
  onPrimaryAction: () => void;
};

export function WorkSection({ reduceMotion, ctaLabel, onPrimaryAction }: WorkSectionProps) {
  const invoices = workflows.invoices;
  const reconciliations = workflows.reconciliations;
  const inventory = workflows.inventory;

  return (
    <section id="trabajo" className="scroll-mt-24 bg-white py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <h2
          id="work-section-title"
          className="max-w-3xl text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-[#171827] sm:text-5xl lg:text-6xl"
        >
          Trabajo que puedes sacar de tu equipo.
        </h2>

        <motion.div
          aria-labelledby="work-section-title"
          className="mt-12 overflow-hidden rounded-[14px] border border-[#dce1eb] bg-[#f7f8fc] sm:mt-14"
          initial={reduceMotion ? false : { opacity: 0.92, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.58, ease: easeOut }}
        >
          <article className="grid min-h-[34rem] bg-[#eef1fb] lg:grid-cols-[0.82fr_1.18fr]">
            <WorkflowCopy workflow={invoices} tone="dark" featured />
            <WorkflowMedia
              workflow={invoices}
              reduceMotion={reduceMotion}
              blendTopEdge
              className="min-h-[22rem] lg:min-h-[34rem]"
            />
          </article>

          <div className="grid border-t border-[#dce1eb] lg:grid-cols-12">
            <article className="grid min-h-[29rem] bg-white sm:grid-cols-[0.92fr_1.08fr] lg:col-span-7">
              <WorkflowCopy workflow={reconciliations} tone="light" />
              <WorkflowMedia
                workflow={reconciliations}
                reduceMotion={reduceMotion}
                className="min-h-[20rem] border-t border-[#dce1eb] sm:min-h-full sm:border-l sm:border-t-0"
              />
            </article>

            <article className="grid min-h-[29rem] border-t border-[#dce1eb] bg-[#edf0ff] lg:col-span-5 lg:border-l lg:border-t-0">
              <WorkflowCopy workflow={inventory} tone="tinted" />
              <WorkflowMedia
                workflow={inventory}
                reduceMotion={reduceMotion}
                className="min-h-[19rem] border-t border-[#d8def3]"
              />
            </article>
          </div>

          <aside className="grid min-w-0 items-center gap-6 border-t border-primary/70 bg-primary px-6 py-7 text-white sm:px-8 sm:py-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-x-10 lg:gap-y-5 xl:grid-cols-[0.8fr_1.25fr_auto] xl:gap-10">
            <div className="flex min-w-0 items-center gap-4 lg:row-span-2 xl:row-auto">
              <Bot className="h-7 w-7 flex-none" strokeWidth={1.8} aria-hidden="true" />
              <h3 className="min-w-0 text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] sm:text-3xl">
                ¿Otro proceso manual?
              </h3>
            </div>
            <p className="min-w-0 max-w-2xl text-base leading-7 text-white sm:text-lg">
              Creamos un operador para tu flujo, sobre los sistemas y reglas que ya usa tu empresa.
            </p>
            <Button
              className="h-12 min-w-0 w-full whitespace-nowrap rounded-full bg-white px-4 text-sm font-semibold text-primary shadow-none hover:bg-white/[0.92] active:scale-[0.98] sm:w-fit sm:px-6 sm:text-base lg:justify-self-start"
              onClick={onPrimaryAction}
            >
              <span className="min-[360px]:hidden">Encontrar mi operador</span>
              <span className="hidden min-[360px]:inline">{ctaLabel}</span>
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </aside>
        </motion.div>
      </div>
    </section>
  );
}

function WorkflowCopy({
  workflow,
  tone,
  featured = false,
}: {
  workflow: Workflow;
  tone: "dark" | "light" | "tinted";
  featured?: boolean;
}) {
  const Icon = workflow.icon;
  const isDark = tone === "dark";

  return (
    <div
      className={`flex min-w-0 flex-col justify-between p-6 sm:p-8 ${featured ? "lg:p-10 xl:p-12" : "lg:p-8"} ${
        isDark ? "bg-[#171a29] text-white" : tone === "tinted" ? "bg-[#edf0ff] text-[#171827]" : "bg-white text-[#171827]"
      }`}
    >
      <div>
        <div className="flex items-center gap-3">
          <Icon
            className={`h-6 w-6 flex-none ${isDark ? "text-[#8ea0ff]" : "text-primary"}`}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <h3
            className={`text-balance font-semibold leading-[1.1] tracking-[-0.03em] ${
              featured ? "text-3xl sm:text-4xl xl:text-[2.7rem]" : "text-2xl sm:text-3xl"
            }`}
          >
            {workflow.title}
          </h3>
        </div>
        <p className={`mt-5 max-w-md text-lg leading-8 ${isDark ? "text-white/[0.68]" : "text-[#555d70]"}`}>
          {workflow.copy}
        </p>
      </div>

      <WorkflowSteps steps={workflow.steps} dark={isDark} className={featured ? "mt-16" : "mt-12"} />
    </div>
  );
}

function WorkflowSteps({ steps, dark, className }: { steps: readonly string[]; dark: boolean; className?: string }) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-1 gap-y-3 text-[13px] font-semibold ${
        dark ? "text-white/[0.86]" : "text-[#303547]"
      } ${className ?? ""}`}
      aria-label={steps.join(", ")}
    >
      {steps.map((step, index) => (
        <span key={step} className="inline-flex items-center gap-1 whitespace-nowrap">
          <span>{step}</span>
          {index < steps.length - 1 && (
            <ChevronRight
              className={`h-3 w-3 ${dark ? "text-[#8ea0ff]" : "text-primary"}`}
              strokeWidth={2}
              aria-hidden="true"
            />
          )}
        </span>
      ))}
    </div>
  );
}

function WorkflowMedia({
  workflow,
  reduceMotion,
  blendTopEdge = false,
  className,
}: {
  workflow: Workflow;
  reduceMotion: boolean | null;
  blendTopEdge?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return undefined;

    if (reduceMotion) {
      video.pause();
      video.currentTime = 0;
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [reduceMotion]);

  return (
    <div className={`relative overflow-hidden bg-[#f4f5fb] ${className ?? ""}`}>
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full scale-[1.07] object-contain mix-blend-multiply"
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={`Demostración de Ruka para ${workflow.title.toLowerCase()}`}
      >
        <source src={workflow.video} type="video/mp4" />
      </video>
      {blendTopEdge && (
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-9 bg-gradient-to-b from-[#f4f5fb] via-[#f4f5fb]/95 to-transparent"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
