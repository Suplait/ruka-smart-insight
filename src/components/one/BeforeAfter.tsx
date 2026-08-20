import { useRef } from "react";
import { ArrowRight, Check, GitBranch, UserRound } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { oneContent } from "@/content/oneContent";

function ManualSteps({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "mt-5" : "mt-4"}>
      {oneContent.comparison.without.steps.map((step, index) => (
        <div key={step} className="grid grid-cols-[28px_72px_1fr] items-center gap-2 py-2.5 sm:grid-cols-[32px_78px_1fr]">
          <span className="text-[10px] tabular-nums text-[#9ca2ae]">{String(index + 1).padStart(2, "0")}</span>
          <span className="text-[9px] font-semibold tracking-[0.1em] text-[#7d8493]">PERSONA</span>
          <span className="text-[13px] font-medium text-[#474b5a]">{step}</span>
        </div>
      ))}
    </div>
  );
}

function RukaFlow({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "mt-5" : "mt-4"}>
      <div className="rounded-xl bg-[#202230] px-4 py-4 text-white">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
          <p className="text-xs font-semibold tracking-[0.1em]">RUKA</p>
          <span className="text-[9px] font-medium text-white/55">OPERA EL FLUJO</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
          {oneContent.comparison.with.steps.map((step) => (
            <div key={step} className="flex items-center gap-2 text-[11px] font-medium text-white/78 sm:text-xs">
              <Check className="h-3.5 w-3.5 shrink-0 text-[#9eabf5]" /> {step}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto h-5 w-px bg-[#cfd5ea]" aria-hidden="true" />
      <div className="rounded-lg border border-[#cfd6f5] bg-[#f4f6ff] px-4 py-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-[#3f4773]"><GitBranch className="h-4 w-4 text-[#5369eb]" /> {oneContent.comparison.with.decision}</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-[#dce0e8] bg-white p-3">
          <span className="text-[9px] font-semibold text-[#7d8493]">NO</span>
          <p className="mt-2 flex items-center gap-2 text-xs font-medium text-[#4b5060]"><Check className="h-3.5 w-3.5 text-[#5369eb]" /> {oneContent.comparison.with.normal}</p>
        </div>
        <div className="rounded-lg border border-[#cfd6f5] bg-white p-3">
          <span className="text-[9px] font-semibold text-[#5369eb]">SÍ</span>
          <p className="mt-2 flex items-center gap-2 text-xs font-medium text-[#4b5060]"><UserRound className="h-3.5 w-3.5 text-[#5369eb]" /> {oneContent.comparison.with.exception}</p>
        </div>
      </div>

      <div className="mx-auto h-5 w-px bg-[#cfd5ea]" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-center gap-2">
        {oneContent.comparison.with.finish.map((step, index) => (
          <span key={step} className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold ${index === oneContent.comparison.with.finish.length - 1 ? "bg-[#5369eb] text-white" : "border border-[#dde1e9] bg-white text-[#626979]"}`}>
            {index === oneContent.comparison.with.finish.length - 1 ? <Check className="h-3 w-3" /> : null}{step}
          </span>
        ))}
      </div>
    </div>
  );
}

function MobileComparison() {
  return (
    <div className="mt-10 space-y-5 lg:hidden">
      <article id="sin-ruka" className="scroll-mt-24 border-y border-[#dfe3ea] py-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xs font-semibold tracking-[0.12em] text-[#767d8c]">{oneContent.comparison.without.label}</h3>
          <span className="text-[10px] font-medium text-[#9298a5]">7 intervenciones</span>
        </div>
        <div className="mt-5 rounded-lg border border-[#dfe3ea] bg-white px-3 py-2 text-xs font-semibold text-[#343745]">{oneContent.comparison.without.input}</div>
        <ManualSteps compact />
        <p className="mt-5 text-sm font-semibold leading-6 text-[#555b6b]">{oneContent.comparison.without.close}</p>
      </article>

      <div className="flex items-center justify-center gap-3 py-2 text-xs font-semibold text-[#5369eb]">
        <span className="h-px w-12 bg-[#cbd2f4]" /> El trabajo cambia de manos <ArrowRight className="h-4 w-4" />
      </div>

      <article id="con-ruka" className="scroll-mt-24 border-y border-[#cfd6f5] py-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xs font-semibold tracking-[0.12em] text-[#5369eb]">{oneContent.comparison.with.label}</h3>
          <span className="text-[10px] font-medium text-[#6873aa]">1 decisión humana</span>
        </div>
        <div className="mt-5 rounded-lg border border-[#cfd6f5] bg-[#f5f7ff] px-3 py-2 text-xs font-semibold text-[#39436f]">{oneContent.comparison.with.input}</div>
        <RukaFlow compact />
        <p className="mt-5 text-sm font-semibold leading-6 text-[#3f4874]">{oneContent.comparison.with.close}</p>
      </article>
    </div>
  );
}

export function BeforeAfter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const manualOpacity = useTransform(scrollYProgress, [0, 0.34, 0.76, 1], [1, 1, 0.42, 0.32]);
  const manualTransform = useTransform(scrollYProgress, [0, 0.75], ["translateX(0px)", "translateX(14px)"]);
  const rukaOpacity = useTransform(scrollYProgress, [0, 0.2, 0.64, 1], [0.25, 0.34, 1, 1]);
  const rukaTransform = useTransform(scrollYProgress, [0, 0.64], ["translateX(-14px)", "translateX(0px)"]);
  const handoffTransform = useTransform(scrollYProgress, [0, 1], ["translateX(-9px)", "translateX(9px)"]);
  const lineScale = useTransform(scrollYProgress, [0.18, 0.72], [0, 1]);

  return (
    <section id="como-funciona" className="scroll-mt-20 border-y border-[#e0e4ea] bg-white px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <h2 className="text-balance text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-[48px] lg:text-[52px]">{oneContent.comparison.title}</h2>
          <p className="mt-5 max-w-3xl text-pretty text-base leading-7 text-[#62697a] sm:text-lg sm:leading-8">{oneContent.comparison.lead}</p>
        </div>

        <MobileComparison />

        <div ref={sectionRef} className="relative mt-12 hidden min-h-[145vh] lg:block">
          <div className="sticky top-24 h-[calc(100vh-7rem)] min-h-[650px] max-h-[760px]">
            <div className="relative h-full overflow-hidden rounded-2xl border border-[#d8dce5] bg-[#fafbfc]">
              <div className="grid h-full grid-rows-[auto_1fr_auto]">
                <div className="flex items-center justify-between border-b border-[#e2e5eb] bg-white px-7 py-4">
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.13em] text-[#7d8493]">EL MISMO PROCESO</p>
                    <p className="mt-1 text-sm font-semibold text-[#2d2f3d]">{oneContent.comparison.without.input}</p>
                  </div>
                  <p className="text-xs font-medium text-[#747b8b]">Cambia quién sostiene la ejecución</p>
                </div>

                <div className="grid min-h-0 grid-cols-[1fr_72px_1fr]">
                  <motion.article style={reduceMotion ? undefined : { opacity: manualOpacity, transform: manualTransform }} className="flex min-h-0 flex-col px-7 py-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xs font-semibold tracking-[0.12em] text-[#767d8c]">{oneContent.comparison.without.label}</h3>
                      <span className="text-[10px] font-medium text-[#9298a5]">7 intervenciones</span>
                    </div>
                    <div className="mt-3 min-h-0 flex-1 overflow-hidden"><ManualSteps /></div>
                    <p className="border-t border-[#e0e3e9] pt-4 text-sm font-semibold leading-6 text-[#555b6b]">{oneContent.comparison.without.close}</p>
                  </motion.article>

                  <div className="relative flex items-center justify-center border-x border-[#e0e3e9] bg-white">
                    <motion.span style={reduceMotion ? { scaleY: 1 } : { scaleY: lineScale }} className="absolute inset-y-0 left-1/2 w-px origin-top -translate-x-1/2 bg-[#5369eb]" aria-hidden="true" />
                    <motion.div style={reduceMotion ? undefined : { transform: handoffTransform }} className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#b8c2f5] bg-white text-[#5369eb]">
                      <ArrowRight className="h-4 w-4" />
                    </motion.div>
                  </div>

                  <motion.article style={reduceMotion ? undefined : { opacity: rukaOpacity, transform: rukaTransform }} className="flex min-h-0 flex-col bg-[#f7f8fe] px-7 py-6">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xs font-semibold tracking-[0.12em] text-[#5369eb]">{oneContent.comparison.with.label}</h3>
                      <span className="text-[10px] font-medium text-[#6873aa]">1 decisión humana</span>
                    </div>
                    <div className="min-h-0 flex-1"><RukaFlow /></div>
                    <p className="border-t border-[#d7dcf2] pt-4 text-sm font-semibold leading-6 text-[#3f4874]">{oneContent.comparison.with.close}</p>
                  </motion.article>
                </div>

                <div className="flex items-center justify-center gap-3 border-t border-[#dce1ee] bg-[#f4f6ff] px-6 py-4 text-sm font-semibold text-[#43508b]">
                  <Check className="h-4 w-4 text-[#5369eb]" /> Proceso completado con trazabilidad
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
