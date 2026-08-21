import { useEffect, useState } from "react";
import { AlertCircle, Check, UserRound } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const trace = [
  { time: "09:41:02", label: "Solicitud recibida", context: "Correo", state: "done" },
  { time: "09:41:03", label: "Consultando sistema de origen", context: "ERP", state: "done" },
  { time: "09:41:04", label: "Contexto encontrado", context: "ERP", state: "done" },
  { time: "09:41:04", label: "Aplicando regla de negocio", context: "Regla", state: "done" },
  { time: "09:41:05", label: "Excepción detectada", context: "Revisión", state: "exception" },
  { time: "09:43:18", label: "Revisión humana aprobada", context: "Humano", state: "human" },
  { time: "09:43:19", label: "Sistema destino actualizado", context: "ERP", state: "done" },
  { time: "09:43:20", label: "Evidencia registrada", context: "Registro", state: "done" },
] as const;

const stepDelays = [650, 680, 680, 760, 1400, 920, 720, 1900];

export function ProcessExecution() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(() => (typeof window === "undefined" ? trace.length : 0));

  useEffect(() => {
    if (reduceMotion) {
      setActiveIndex(trace.length);
      return;
    }

    let timer = 0;
    const advance = (index: number) => {
      setActiveIndex(index);
      const next = index >= trace.length ? 0 : index + 1;
      const delay = index >= trace.length ? 2200 : stepDelays[Math.min(index, stepDelays.length - 1)];
      timer = window.setTimeout(() => advance(next), delay);
    };

    advance(0);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  const completed = activeIndex >= trace.length;
  const progress = completed ? 1 : Math.max(0.04, activeIndex / trace.length);

  return (
    <figure
      id="one-execution-trace"
      className="overflow-hidden rounded-2xl border border-[#d9dde6] bg-white"
      aria-label="Traza de ejecución de un proceso operado por Ruka, incluyendo una excepción y una decisión humana"
    >
      <figcaption className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e3e6ec] px-4 py-4 sm:px-6">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.14em] text-[#697083]">EJEMPLO DE EJECUCIÓN</p>
          <p className="mt-1 text-sm font-semibold text-[#242634]">Caso #1048</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#62697a]">
          <span className={cn("h-2 w-2 rounded-full", completed ? "bg-[#5369eb]" : "bg-[#8a94c9]")} aria-hidden="true" />
          {completed ? "Completado" : "En ejecución"}
        </div>
      </figcaption>

      <div className="relative px-4 py-3 sm:px-6 sm:py-4">
        <span className="absolute bottom-6 left-[91px] top-6 w-px bg-[#e2e5eb] sm:left-[116px]" aria-hidden="true" />
        <motion.span
          className="absolute bottom-6 left-[91px] top-6 w-px origin-top bg-[#5369eb] sm:left-[116px]"
          animate={{ scaleY: progress }}
          transition={{ duration: reduceMotion ? 0 : 0.36, ease: [0.23, 1, 0.32, 1] }}
          aria-hidden="true"
        />

        <ol className="relative">
          {trace.map((event, index) => {
            const isVisible = completed || index <= activeIndex;
            const isActive = !completed && index === activeIndex;
            const isException = event.state === "exception";
            const isHuman = event.state === "human";

            return (
              <motion.li
                key={`${event.time}-${event.label}`}
                animate={{
                  opacity: isVisible ? 1 : 0.32,
                  transform: isActive ? "translateX(4px)" : "translateX(0px)",
                }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.23, 1, 0.32, 1] }}
                className={cn(
                  "grid min-h-14 grid-cols-[66px_18px_1fr_auto] items-center gap-2 border-b border-[#edf0f4] py-2.5 last:border-b-0 sm:grid-cols-[84px_18px_1fr_auto] sm:gap-3",
                  isActive && "bg-[#f7f8fc]",
                )}
              >
                <time className="text-[10px] font-medium tabular-nums text-[#858b99] sm:text-[11px]">{event.time}</time>
                <span
                  className={cn(
                    "relative z-10 flex h-[18px] w-[18px] items-center justify-center rounded-full border bg-white",
                    isException
                      ? "border-[#9ba3bd] text-[#68718e]"
                      : isHuman
                        ? "border-[#8595ec] text-[#5369eb]"
                        : isVisible
                          ? "border-[#8e9cf0] text-[#5369eb]"
                          : "border-[#d6dae3] text-[#b0b5c0]",
                  )}
                  aria-label={isException ? "Excepción" : isHuman ? "Intervención humana" : isVisible ? "Completado" : "Pendiente"}
                >
                  {isException ? <AlertCircle className="h-3 w-3" /> : isHuman ? <UserRound className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                </span>
                <span className={cn("text-[13px] font-medium leading-5 sm:text-sm", isActive ? "text-[#1d1f2d]" : "text-[#4d5262]")}>{event.label}</span>
                <span className={cn("hidden rounded-md px-2 py-1 text-[9px] font-semibold sm:inline-flex", isHuman ? "bg-[#eef1ff] text-[#5369eb]" : isException ? "bg-[#f0f1f4] text-[#62697a]" : "bg-[#f5f6f8] text-[#747b8b]")}>{event.context}</span>
              </motion.li>
            );
          })}
        </ol>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-[#e3e6ec] bg-[#fafbfc] px-4 py-4 sm:px-6">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.13em] text-[#7b8292]">RESULTADO</p>
          <p className="mt-1 text-sm font-semibold text-[#282a38]">Sistema actualizado y evidencia registrada</p>
        </div>
        <motion.span
          animate={{ opacity: completed ? 1 : 0.35, transform: completed ? "scale(1)" : "scale(0.96)" }}
          transition={{ duration: reduceMotion ? 0 : 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#5369eb] text-white"
          aria-label={completed ? "Proceso completado" : "Proceso en ejecución"}
        >
          <Check className="h-4 w-4" />
        </motion.span>
      </div>
    </figure>
  );
}
