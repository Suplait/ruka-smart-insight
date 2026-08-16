import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  ArrowRight,
  Bot,
  ChevronRight,
  ReceiptText,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Workflow = {
  id: string;
  icon: LucideIcon;
  title: string;
  navCopy: string;
  copy: string;
  steps: readonly string[];
  video: string;
};

const workflows: readonly Workflow[] = [
  {
    id: "registro-compras",
    icon: ReceiptText,
    title: "Registro de compras",
    navCopy: "Leer, ordenar y registrar",
    copy: "Ruka recibe compras desde SII, XML, PDF o papel; lee, homologa y registra la información donde corresponde.",
    steps: ["Recibir", "Leer", "Homologar", "Registrar"],
    video: "/robot_facturas.mp4",
  },
  {
    id: "conciliaciones",
    icon: ArrowLeftRight,
    title: "Conciliaciones",
    navCopy: "Cruzar facturas, OC y pagos",
    copy: "Ruka cruza facturas, órdenes de compra, recepciones y pagos para validar coincidencias y alertar diferencias.",
    steps: ["Cruzar", "Validar", "Conciliar", "Alertar"],
    video: "/robot_dinero.mp4",
  },
  {
    id: "actualizacion",
    icon: RefreshCw,
    title: "Actualización entre sistemas",
    navCopy: "Mantener tus herramientas al día",
    copy: "Ruka mueve y actualiza información entre tu ERP, POS, planillas, inventario, recetario u otras herramientas.",
    steps: ["Preparar", "Conectar", "Actualizar", "Confirmar"],
    video: "/robot_inventario.mp4",
  },
  {
    id: "costos-margen",
    icon: TrendingUp,
    title: "Costos y margen",
    navCopy: "Monitorear cambios y resultados",
    copy: "Ruka homologa insumos, monitorea cambios de costo y mantiene el margen calculado con información al día.",
    steps: ["Homologar", "Monitorear", "Calcular", "Alertar"],
    video: "/robot_grafico2.mp4",
  },
] as const;

type WorkSectionProps = {
  reduceMotion: boolean | null;
  onPrimaryAction: () => void;
};

export function WorkSection({ reduceMotion, onPrimaryAction }: WorkSectionProps) {
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const selectedWorkflow = workflows[activeWorkflow];

  return (
    <section id="trabajo" className="scroll-mt-24 bg-white py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <h2
            id="work-section-title"
            className="text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.035em] text-[#171827] sm:text-5xl lg:text-6xl"
          >
            Trabajo que puedes sacar de tu equipo.
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-[#555d70]">
            Ruka registra, concilia, actualiza y calcula sobre los sistemas que tu operación ya usa.
          </p>
        </div>

        <motion.div
          aria-labelledby="work-section-title"
          className="mt-12 overflow-hidden rounded-[14px] border border-[#dce1eb] bg-white sm:mt-14"
          initial={reduceMotion ? false : { opacity: 0.92, y: 18 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.58, ease: easeOut }}
        >
          <div className="lg:grid lg:grid-cols-12">
            <nav
              className="grid grid-cols-1 gap-px border-b border-[#dce1eb] bg-[#dce1eb] min-[360px]:grid-cols-2 lg:col-span-3 lg:grid-cols-1 lg:border-b-0 lg:border-r"
              aria-label="Trabajos que Ruka puede automatizar"
            >
              {workflows.map((workflow, index) => (
                <WorkflowSelector
                  key={workflow.id}
                  workflow={workflow}
                  selected={activeWorkflow === index}
                  onSelect={() => setActiveWorkflow(index)}
                />
              ))}
            </nav>

            <div className="min-w-0 lg:col-span-9" id="workflow-panel" aria-live="polite">
              <AnimatePresence initial={false} mode="wait">
                <motion.article
                  key={selectedWorkflow.id}
                  className="grid min-h-[38rem] md:grid-cols-5"
                  initial={reduceMotion ? false : { opacity: 0.7, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: reduceMotion ? 0 : 0.24, ease: easeOut }}
                >
                  <WorkflowDetail workflow={selectedWorkflow} />
                  <WorkflowVideo workflow={selectedWorkflow} reduceMotion={reduceMotion} />
                </motion.article>
              </AnimatePresence>
            </div>
          </div>

          <aside className="grid min-w-0 items-center gap-5 border-t border-[#dce1eb] bg-[#fbfcfe] px-6 py-7 sm:px-8 lg:grid-cols-[0.85fr_1.2fr_auto] lg:gap-8">
            <div className="flex min-w-0 items-center gap-4">
              <Bot className="h-7 w-7 flex-none text-primary" strokeWidth={1.8} aria-hidden="true" />
              <h3 className="min-w-0 text-balance text-2xl font-semibold leading-tight tracking-[-0.025em] text-[#171827]">
                ¿Otro proceso manual?
              </h3>
            </div>
            <p className="min-w-0 max-w-2xl text-base leading-7 text-[#555d70]">
              Creamos un operador para tu flujo, sobre los sistemas y reglas que ya usa tu empresa.
            </p>
            <Button
              className="h-12 min-w-0 w-full whitespace-nowrap rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-none hover:bg-primary/90 active:scale-[0.98] sm:w-fit sm:px-6 sm:text-base"
              onClick={onPrimaryAction}
            >
              Cuéntanos tu proceso
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </aside>
        </motion.div>
      </div>
    </section>
  );
}

function WorkflowSelector({
  workflow,
  selected,
  onSelect,
}: {
  workflow: Workflow;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = workflow.icon;

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-controls="workflow-panel"
      className={`group min-h-[6rem] min-w-0 px-4 py-4 text-left transition-[background-color,color] duration-200 focus-visible:relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:px-5 lg:min-h-[6.35rem] lg:px-6 ${
        selected ? "bg-primary text-white" : "bg-[#f8f9fc] text-[#202333] hover:bg-white"
      }`}
      onClick={onSelect}
      onMouseEnter={onSelect}
      onFocus={onSelect}
    >
      <span className="flex min-w-0 items-start gap-3">
        <Icon
          className={`mt-0.5 h-5 w-5 flex-none ${selected ? "text-white" : "text-primary"}`}
          strokeWidth={1.8}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold leading-5 sm:text-[15px]">{workflow.title}</span>
          <span className={`mt-1 block text-xs leading-[1.45] sm:text-[13px] ${selected ? "text-white/[0.78]" : "text-[#6a7184]"}`}>
            {workflow.navCopy}
          </span>
        </span>
        <ChevronRight
          className={`mt-1 hidden h-4 w-4 flex-none transition-transform duration-200 lg:block ${
            selected ? "translate-x-0 text-white" : "-translate-x-1 text-[#a3aabd] group-hover:translate-x-0"
          }`}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}

function WorkflowDetail({ workflow }: { workflow: Workflow }) {
  const Icon = workflow.icon;

  return (
    <div className="flex min-w-0 flex-col justify-between bg-[#171a29] p-6 text-white sm:p-8 md:col-span-2 lg:p-10">
      <div>
        <div className="flex items-start gap-3">
          <Icon className="mt-1 h-6 w-6 flex-none text-[#8ea0ff]" strokeWidth={1.8} aria-hidden="true" />
          <h3 className="text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl">
            {workflow.title}
          </h3>
        </div>
        <p className="mt-6 max-w-md text-pretty text-lg leading-8 text-white/[0.76]">{workflow.copy}</p>
      </div>

      <WorkflowSteps steps={workflow.steps} />
    </div>
  );
}

function WorkflowSteps({ steps }: { steps: readonly string[] }) {
  return (
    <div
      className="mt-14 flex flex-wrap items-center gap-x-1 gap-y-3 text-[13px] font-semibold text-white/[0.88]"
      aria-label={steps.join(", ")}
    >
      {steps.map((step, index) => (
        <span key={step} className="inline-flex items-center gap-1 whitespace-nowrap">
          <span>{step}</span>
          {index < steps.length - 1 && (
            <ChevronRight className="h-3 w-3 text-[#8ea0ff]" strokeWidth={2} aria-hidden="true" />
          )}
        </span>
      ))}
    </div>
  );
}

function WorkflowVideo({ workflow, reduceMotion }: { workflow: Workflow; reduceMotion: boolean | null }) {
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
  }, [reduceMotion, workflow.id]);

  return (
    <div className="relative aspect-square min-h-0 overflow-hidden bg-white md:col-span-3 md:aspect-auto md:min-h-full">
      <div className="absolute inset-x-0 top-1/2 aspect-square w-full -translate-y-1/2 overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain mix-blend-multiply"
          loop
          muted
          playsInline
          preload="auto"
          aria-label={`Demostración de Ruka: ${workflow.title.toLowerCase()}`}
        >
          <source src={workflow.video} type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
