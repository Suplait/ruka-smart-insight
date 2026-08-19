import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Check,
  CircleUserRound,
  Database,
  FileCheck2,
  Workflow,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

type StackLayer = "systems" | "ruka" | "execution";

type PlaybackStep = {
  label: string;
  layer: StackLayer;
  state: "working" | "success" | "exception" | "human";
};

const normalSequence: readonly PlaybackStep[] = [
  { label: "Evento recibido", layer: "systems", state: "working" },
  { label: "Contexto recuperado", layer: "ruka", state: "working" },
  { label: "Agente interpreta", layer: "ruka", state: "working" },
  { label: "Regla validada", layer: "ruka", state: "success" },
  { label: "Sistema actualizado", layer: "execution", state: "success" },
  { label: "Evidencia registrada", layer: "execution", state: "success" },
];

const exceptionSequence: readonly PlaybackStep[] = [
  { label: "Evento recibido", layer: "systems", state: "working" },
  { label: "Agente interpreta", layer: "ruka", state: "working" },
  { label: "Excepción detectada", layer: "ruka", state: "exception" },
  { label: "Revisión humana", layer: "ruka", state: "human" },
  { label: "Aprobado", layer: "ruka", state: "success" },
  { label: "Ruka continúa", layer: "ruka", state: "working" },
  { label: "Sistema actualizado", layer: "execution", state: "success" },
  { label: "Evidencia registrada", layer: "execution", state: "success" },
];

const layerContent = {
  systems: {
    label: "Sistemas",
    items: ["ERP", "SII", "Email", "Datos"],
    Icon: Database,
  },
  ruka: {
    label: "Ruka",
    items: ["Contexto", "Agente", "Reglas", "Decisiones"],
    Icon: Workflow,
  },
  execution: {
    label: "Ejecución",
    items: ["Actualizar", "Registrar", "Avisar", "Evidencia"],
    Icon: FileCheck2,
  },
} as const;

type Playback = {
  cycle: number;
  step: number;
};

function getSequence(cycle: number) {
  return cycle % 2 === 0 ? normalSequence : exceptionSequence;
}

function getActiveItem(step: PlaybackStep) {
  if (step.layer === "systems") return "Datos";
  if (step.layer === "execution") return step.label.includes("Evidencia") ? "Evidencia" : "Actualizar";
  if (step.label.includes("Agente") || step.label.includes("Contexto")) return step.label.includes("Agente") ? "Agente" : "Contexto";
  if (step.label.includes("Regla")) return "Reglas";
  return "Decisiones";
}

export function WorksExecutionStack() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(rootRef, { amount: 0.35 });
  const [playback, setPlayback] = useState<Playback>({ cycle: 0, step: 0 });
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 170, damping: 24, mass: 0.45 });
  const smoothY = useSpring(pointerY, { stiffness: 170, damping: 24, mass: 0.45 });
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-3, 3]);

  useEffect(() => {
    if (reduceMotion || !inView) return undefined;

    const interval = window.setInterval(() => {
      setPlayback((current) => {
        const sequence = getSequence(current.cycle);
        if (current.step >= sequence.length - 1) return { cycle: current.cycle + 1, step: 0 };
        return { ...current, step: current.step + 1 };
      });
    }, 1250);

    return () => window.clearInterval(interval);
  }, [inView, reduceMotion]);

  const sequence = getSequence(playback.cycle);
  const activeStep = reduceMotion ? normalSequence[normalSequence.length - 1] : sequence[playback.step];
  const pulseY = activeStep.layer === "systems" ? 0 : activeStep.layer === "ruka" ? 94 : 188;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative mt-7 overflow-hidden rounded-2xl bg-[#171927] p-4 text-white sm:p-5 lg:mt-8"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
        <p className="text-xs font-semibold text-white/80">Flujo en ejecución</p>
        <span className="font-mono text-[10px] text-white/45">RUKA / LIVE</span>
      </div>

      <motion.div
        className="relative mt-3 h-[286px] [perspective:900px] sm:h-[304px]"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        <div className="absolute bottom-5 left-[29px] top-5 w-px bg-white/10" />
        <motion.span
          className="absolute left-[25px] top-[31px] h-2.5 w-2.5 rounded-full border-2 border-[#171927] bg-[#8192ff]"
          animate={reduceMotion ? undefined : { y: pulseY, scale: [1, 1.3, 1] }}
          transition={{
            y: { duration: 0.48, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 0.65, ease: "easeOut" },
          }}
        />

        {(["systems", "ruka", "execution"] as const).map((layer, index) => (
          <StackPlane
            key={layer}
            layer={layer}
            index={index}
            activeStep={activeStep}
            reduceMotion={Boolean(reduceMotion)}
          />
        ))}
      </motion.div>

      <div className="flex min-h-10 items-center gap-3 border-t border-white/10 pt-3">
        <StatusIcon state={activeStep.state} />
        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={activeStep.label}
              className="truncate text-sm font-semibold text-white"
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeStep.label}
            </motion.p>
          </AnimatePresence>
        </div>
        <span className="text-[10px] font-semibold text-white/45">
          {playback.cycle % 2 === 0 ? "FLUJO NORMAL" : "CON EXCEPCIÓN"}
        </span>
      </div>
    </div>
  );
}

function StackPlane({
  layer,
  index,
  activeStep,
  reduceMotion,
}: {
  layer: StackLayer;
  index: number;
  activeStep: PlaybackStep;
  reduceMotion: boolean;
}) {
  const content = layerContent[layer];
  const Icon = content.Icon;
  const active = activeStep.layer === layer;
  const activeItem = getActiveItem(activeStep);

  return (
    <motion.div
      className={`absolute left-[48px] right-1 h-[78px] rounded-xl px-4 py-3 sm:left-[54px] sm:right-2 ${
        layer === "ruka" ? "bg-[#5369eb] text-white" : "bg-[#f7f8fc] text-[#222536]"
      }`}
      style={{
        top: 12 + index * 94,
        transform: `translate3d(${index * 4}px, 0, ${22 - index * 11}px) rotateX(5deg) rotateY(-2.5deg)`,
        boxShadow: layer === "ruka" ? "0 6px 0 #303da2" : "0 6px 0 #cfd4df",
        transformStyle: "preserve-3d",
      }}
      animate={
        reduceMotion
          ? undefined
          : {
              x: active ? 4 : 0,
              filter: active ? "brightness(1.04)" : "brightness(0.94)",
            }
      }
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[11px] font-semibold">
          <Icon className={`h-3.5 w-3.5 ${layer === "ruka" ? "text-white/80" : "text-[#5369eb]"}`} />
          {content.label}
        </p>
        <span className={`text-[9px] font-semibold ${layer === "ruka" ? "text-white/55" : "text-[#8a90a0]"}`}>
          0{index + 1}
        </span>
      </div>
      <div className="mt-2.5 flex gap-1.5 overflow-hidden">
        {content.items.map((item) => {
          const highlighted = active && item === activeItem;
          return (
            <motion.span
              key={item}
              className={`whitespace-nowrap rounded-md px-2 py-1 text-[9px] font-semibold sm:text-[10px] ${
                layer === "ruka"
                  ? highlighted
                    ? "bg-white text-[#3443b4]"
                    : "bg-white/10 text-white/70"
                  : highlighted
                    ? "bg-[#e3e7ff] text-[#4255d5]"
                    : "bg-[#e9ecf2] text-[#666d7d]"
              }`}
              animate={reduceMotion || !highlighted ? undefined : { y: [0, -2, 0] }}
              transition={{ duration: 0.34, ease: "easeOut" }}
            >
              {item}
            </motion.span>
          );
        })}
      </div>
    </motion.div>
  );
}

function StatusIcon({ state }: { state: PlaybackStep["state"] }) {
  const className = "h-4 w-4";
  if (state === "exception") {
    return (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f6c96b] text-[#4b3710]">
        <AlertTriangle className={className} />
      </span>
    );
  }
  if (state === "human") {
    return (
      <span className="grid h-7 w-7 place-items-center rounded-full bg-white/12 text-white">
        <CircleUserRound className={className} />
      </span>
    );
  }
  return (
    <span className={`grid h-7 w-7 place-items-center rounded-full ${state === "success" ? "bg-[#e8ecff] text-[#5369eb]" : "bg-white/12 text-white"}`}>
      <Check className={className} />
    </span>
  );
}
