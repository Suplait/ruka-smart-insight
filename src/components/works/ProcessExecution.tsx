import { useEffect, useMemo, useState } from "react";
import { Check, FileText, GitBranch, Mail, Search, ShieldCheck, UserRound, Waypoints } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const sequence = [
  "Factura recibida",
  "Consultando ERP",
  "3 registros encontrados",
  "Validando recepción",
  "Regla aplicada",
  "Coincidencia confirmada",
  "ERP actualizado",
  "Evidencia registrada",
  "Proceso completado",
] as const;

type FlowNodeProps = {
  index: number;
  stage: number;
  title: string;
  meta?: string;
  icon: typeof FileText;
  accent?: boolean;
  compact?: boolean;
};

function FlowNode({ index, stage, title, meta, icon: Icon, accent, compact }: FlowNodeProps) {
  const completed = stage > index;
  const active = stage === index;

  return (
    <motion.div
      animate={{
        borderColor: active || completed ? (accent ? "#5369eb" : "#aeb9f8") : "#e4e7ef",
        backgroundColor: active ? (accent ? "#5369eb" : "#f3f5ff") : completed ? "#fbfcff" : "#ffffff",
        y: active ? -2 : 0,
      }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className={cn(
        "relative rounded-xl border px-3.5 py-3 shadow-[0_8px_24px_rgba(28,32,56,0.06)]",
        compact ? "min-h-[68px]" : "min-h-[82px]",
      )}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
            active && accent
              ? "border-white/25 bg-white/15 text-white"
              : active || completed
                ? "border-[#ccd3ff] bg-white text-[#4f64dd]"
                : "border-[#e3e6ee] bg-[#f7f8fb] text-[#8b91a2]",
          )}
        >
          {completed ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
        </span>
        <div className="min-w-0">
          <p className={cn("text-sm font-semibold leading-5", active && accent ? "text-white" : "text-[#202231]")}>{title}</p>
          {meta ? (
            <p className={cn("mt-1 text-[11px] leading-4", active && accent ? "text-white/72" : "text-[#7b8193]")}>{meta}</p>
          ) : null}
        </div>
      </div>
      {active ? (
        <motion.span
          layoutId="works-active-token"
          className={cn("absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full", accent ? "bg-white" : "bg-[#5369eb]")}
        />
      ) : null}
    </motion.div>
  );
}

function Connector({ active }: { active: boolean }) {
  return (
    <div className="relative mx-auto h-7 w-px overflow-hidden bg-[#dfe3ed] lg:h-px lg:w-full">
      <motion.span
        className="absolute inset-0 origin-top bg-[#5369eb] lg:origin-left"
        animate={{ scaleY: active ? 1 : 0, scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      />
    </div>
  );
}

export function ProcessExecution() {
  const reduceMotion = useReducedMotion();
  const [stage, setStage] = useState(() => (typeof window === "undefined" ? sequence.length - 1 : 0));

  useEffect(() => {
    if (reduceMotion) {
      setStage(sequence.length - 1);
      return;
    }
    const timer = window.setInterval(() => {
      setStage((current) => (current + 1) % (sequence.length + 2));
    }, 720);
    return () => window.clearInterval(timer);
  }, [reduceMotion]);

  const visibleStage = Math.min(stage, sequence.length - 1);
  const status = sequence[visibleStage];
  const progress = useMemo(() => Math.round(((visibleStage + 1) / sequence.length) * 100), [visibleStage]);

  return (
    <figure
      id="works-process-visual"
      className="relative overflow-hidden rounded-[22px] border border-[#dfe3ed] bg-white shadow-[0_28px_80px_rgba(28,32,56,0.11)]"
      aria-label="Ejemplo de un proceso de validación de factura ejecutado por Ruka"
    >
      <div className="flex flex-col gap-4 border-b border-[#e8eaf0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#5369eb] opacity-30" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#5369eb]" />
          </span>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.17em] text-[#6d7384]">PROCESO EN EJECUCIÓN</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={status}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
                className="mt-1 text-xs font-medium text-[#242635]"
              >
                {status}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-medium text-[#73798b]">
          <span><strong className="text-[#292b3a]">6</strong> pasos</span>
          <span><strong className="text-[#292b3a]">3</strong> sistemas</span>
          <span><strong className="text-[#292b3a]">2</strong> reglas</span>
          <span><strong className="text-[#292b3a]">1</strong> excepción</span>
        </div>
      </div>

      <div className="h-1 bg-[#eef0f5]">
        <motion.div className="h-full bg-[#5369eb]" animate={{ width: `${progress}%` }} transition={{ duration: 0.32 }} />
      </div>

      <div className="p-4 sm:p-6 lg:p-7">
        <div className="mb-5 flex flex-wrap gap-2">
          {[
            ["SII", FileText],
            ["ERP", Waypoints],
            ["Correo", Mail],
          ].map(([label, Icon]) => (
            <span key={label as string} className="inline-flex items-center gap-1.5 rounded-full border border-[#e3e6ed] bg-[#fafbfc] px-2.5 py-1 text-[10px] font-semibold text-[#686f82]">
              <Icon className="h-3 w-3" /> {label as string}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 items-center lg:grid-cols-[1fr_28px_1fr_28px_1fr]">
          <FlowNode index={0} stage={visibleStage} title="Factura recibida" meta="Documento capturado desde SII o correo" icon={FileText} />
          <Connector active={visibleStage > 0} />
          <FlowNode index={1} stage={visibleStage} title="Buscar orden de compra" meta="Consulta automática en ERP" icon={Search} />
          <Connector active={visibleStage > 1} />
          <FlowNode index={3} stage={visibleStage} title="Validar recepción" meta="Cruza cantidades, montos y estado" icon={ShieldCheck} />
        </div>

        <div className="mx-auto h-7 w-px bg-[#dfe3ed]" />

        <div className="mx-auto max-w-[280px]">
          <FlowNode index={4} stage={visibleStage} title="¿Coincide?" meta="Ruka aplica tolerancias y reglas" icon={GitBranch} accent />
        </div>

        <div className="relative mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="absolute left-1/2 top-[-28px] hidden h-7 w-px -translate-x-1/2 bg-[#dfe3ed] sm:block" />
          <div className="absolute left-1/4 right-1/4 top-[-1px] hidden h-px bg-[#dfe3ed] sm:block" />
          <div className="relative rounded-2xl border border-[#d9defb] bg-[#f8f9ff] p-3.5">
            <span className="absolute -top-3 left-4 rounded-full border border-[#d9defb] bg-white px-2 py-0.5 text-[9px] font-bold tracking-[0.12em] text-[#4f64dd]">SÍ</span>
            <div className="grid gap-2.5">
              <FlowNode compact index={6} stage={visibleStage} title="Actualizar ERP" icon={Waypoints} />
              <FlowNode compact index={7} stage={visibleStage} title="Registrar evidencia" icon={FileText} />
              <FlowNode compact index={8} stage={visibleStage} title="Completado" meta="Caso cerrado con trazabilidad" icon={Check} />
            </div>
          </div>
          <div className="relative rounded-2xl border border-[#e1e3ea] bg-[#fbfbfc] p-3.5">
            <span className="absolute -top-3 left-4 rounded-full border border-[#e1e3ea] bg-white px-2 py-0.5 text-[9px] font-bold tracking-[0.12em] text-[#7b8191]">NO</span>
            <div className="grid gap-2.5">
              <FlowNode compact index={5} stage={visibleStage} title="Crear excepción" meta="Motivo y contexto quedan registrados" icon={GitBranch} />
              <FlowNode compact index={6} stage={visibleStage} title="Revisión humana" meta="Solo este caso necesita una decisión" icon={UserRound} />
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
