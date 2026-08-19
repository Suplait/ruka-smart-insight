import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { worksContent, WORKS_CONTACT_PATH } from "@/content/worksContent";

type PatternKind = (typeof worksContent.familiar.patterns)[number]["kind"];

function Node({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span className={`inline-flex h-8 items-center rounded-md border px-2.5 text-[10px] font-semibold ${strong ? "border-[#aeb9f5] bg-[#f1f3ff] text-[#4d61cf]" : "border-[#dde1e8] bg-white text-[#687081]"}`}>
      {children}
    </span>
  );
}

function PatternVisual({ kind, index }: { kind: PatternKind; index: number }) {
  const reduceMotion = useReducedMotion();
  const common = {
    initial: reduceMotion ? false : { opacity: 0.45, transform: "translateY(5px)" },
    whileInView: { opacity: 1, transform: "translateY(0px)" },
    viewport: { once: true, amount: 0.7 },
    transition: { duration: reduceMotion ? 0 : 0.45, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] as const },
  };

  if (kind === "converge") {
    return (
      <motion.div {...common} className="flex h-16 items-center" aria-hidden="true">
        <div className="grid gap-1"><Node>ERP</Node><Node>Correo</Node><Node>Planilla</Node></div>
        <div className="relative mx-3 h-px flex-1 bg-[#dfe3ea]"><motion.span className="absolute inset-0 origin-left bg-[#5369eb]" initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.65 }} /></div>
        <Node strong>Una tarea</Node>
      </motion.div>
    );
  }

  if (kind === "replicate") {
    return (
      <motion.div {...common} className="flex h-16 items-center" aria-hidden="true">
        <Node strong>Cambio</Node>
        <div className="relative mx-3 h-px flex-1 bg-[#dfe3ea]"><motion.span className="absolute inset-0 origin-left bg-[#5369eb]" initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.65, delay: 0.08 }} /></div>
        <div className="grid gap-1"><Node>Sistema A</Node><Node>Sistema B</Node></div>
      </motion.div>
    );
  }

  if (kind === "rule") {
    return (
      <motion.div {...common} className="flex h-16 items-center gap-2" aria-hidden="true">
        <Node>Si monto cambia</Node>
        <ArrowRight className="h-4 w-4 text-[#a0a6b3]" />
        <Node strong>Pedir aprobación</Node>
      </motion.div>
    );
  }

  return (
    <motion.div {...common} className="flex h-16 items-center gap-3" aria-hidden="true">
      <Node>Entrada</Node>
      <div className="relative h-px flex-1 bg-[#dfe3ea]">
        <motion.span className="absolute inset-y-0 left-0 w-[58%] origin-left bg-[#5369eb]" initial={reduceMotion ? { scaleX: 1 } : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: reduceMotion ? 0 : 0.55 }} />
        <span className="absolute left-[58%] top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#5369eb] bg-white" />
      </div>
      <span className="text-[10px] font-semibold text-[#777e8e]">Esperando</span>
    </motion.div>
  );
}

export function FamiliarPatterns() {
  return (
    <section id="dolor" className="px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-[#5369eb]">{worksContent.familiar.eyebrow}</p>
          <h2 className="mt-5 text-balance text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-[48px] lg:text-[52px]">
            {worksContent.familiar.title}
          </h2>
        </div>

        <div className="mt-12 grid border-t border-[#dfe3ea] md:grid-cols-2">
          {worksContent.familiar.patterns.map((pattern, index) => (
            <article
              key={pattern.number}
              className={`min-w-0 py-9 md:min-h-[300px] md:px-9 md:py-10 ${index % 2 === 0 ? "md:border-r md:border-[#dfe3ea]" : ""} ${index < 2 ? "border-b border-[#dfe3ea]" : index === 2 ? "border-b border-[#dfe3ea] md:border-b-0" : ""}`}
            >
              <p className="text-xs font-medium tabular-nums text-[#959ba8]">{pattern.number}</p>
              <h3 className="mt-5 max-w-xl text-balance text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] text-[#252735] sm:text-[28px]">
                {pattern.title}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-7 text-[#62697a]">{pattern.copy}</p>
              <div className="mt-6 max-w-md"><PatternVisual kind={pattern.kind} index={index} /></div>
            </article>
          ))}
        </div>

        <div className="flex flex-col gap-5 border-t border-[#dfe3ea] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-[#272936]">{worksContent.familiar.transition.title}</p>
            <p className="mt-1 text-sm leading-6 text-[#666d7d]">{worksContent.familiar.transition.copy}</p>
          </div>
          <Link to={WORKS_CONTACT_PATH} className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-[#5369eb] transition-colors duration-150 hover:text-[#4054c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4">
            {worksContent.familiar.transition.action} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
