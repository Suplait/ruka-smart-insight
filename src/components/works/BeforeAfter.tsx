import { Check, FileText, GitBranch, UserRound, Waypoints } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { worksContent } from "@/content/worksContent";
import { WorksReveal, WorksSectionHeading } from "@/components/works/WorksReveal";

function ManualFlow() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="mt-8 space-y-0">
      {worksContent.comparison.without.steps.map(([step, actor], index) => (
        <motion.div
          key={step}
          initial={typeof window !== "undefined" && !reduceMotion ? { opacity: 0, x: -10 } : false}
          whileInView={typeof window !== "undefined" && !reduceMotion ? { opacity: 1, x: 0 } : undefined}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: index * 0.055, duration: 0.42 }}
          className="relative flex gap-4 pb-5 last:pb-0"
        >
          {index < worksContent.comparison.without.steps.length - 1 ? (
            <span className="absolute left-[17px] top-8 h-[calc(100%-1.2rem)] w-px bg-[#d9dde5]" aria-hidden="true" />
          ) : null}
          <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dcdfe6] bg-white text-[10px] font-semibold tabular-nums text-[#858b9a]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 border-b border-[#e7e9ee] pb-4">
            <p className="text-[9px] font-bold tracking-[0.15em] text-[#9297a4]">{actor}</p>
            <p className="mt-1 text-sm font-medium text-[#3a3c49]">{step}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function AutomatedFlow() {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 rounded-xl border border-[#d7dcf7] bg-white p-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#eef1ff] text-[#5369eb]"><FileText className="h-4 w-4" /></span>
        <div><p className="text-[9px] font-bold tracking-[0.15em] text-[#7d8495]">ENTRADA</p><p className="mt-1 text-sm font-semibold text-[#2c2e3d]">{worksContent.comparison.with.input}</p></div>
      </div>

      <div className="mx-auto h-6 w-px bg-[#cbd2f2]" />

      <div className="rounded-2xl bg-[#202231] p-5 text-white shadow-[0_20px_44px_rgba(23,24,39,0.18)]">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-[#8fa1ff]" /><p className="text-xs font-semibold tracking-[0.13em]">RUKA</p></div>
          <span className="text-[10px] text-white/45">FLUJO ACTIVO</span>
        </div>
        <div className="mt-4 grid gap-2">
          {worksContent.comparison.with.steps.map((step, index) => (
            <motion.div
              key={step}
              initial={motionEnabled ? { opacity: 0.35 } : false}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + index * 0.12 }}
              className="flex items-center gap-3 rounded-lg bg-white/[0.055] px-3 py-2.5"
            >
              <Check className="h-3.5 w-3.5 text-[#9cacff]" /><span className="text-xs font-medium text-white/82">{step}</span>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="mx-auto h-6 w-px bg-[#cbd2f2]" />

      <div className="rounded-xl border border-[#cfd6ff] bg-[#f3f5ff] p-4">
        <div className="flex items-center gap-3"><GitBranch className="h-4 w-4 text-[#5369eb]" /><p className="text-sm font-semibold text-[#343a65]">{worksContent.comparison.with.decision}</p></div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-[#d2d8f6] bg-white p-4">
          <span className="text-[9px] font-bold tracking-[0.15em] text-[#5369eb]">NO</span>
          <div className="mt-3 space-y-2">
            {worksContent.comparison.with.normal.map((step) => (
              <div key={step} className="flex items-start gap-2 text-xs font-medium leading-5 text-[#474b5d]"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#5369eb]" />{step}</div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[#e0e3ea] bg-white p-4">
          <span className="text-[9px] font-bold tracking-[0.15em] text-[#7c8291]">SÍ</span>
          <div className="mt-3 space-y-2">
            {worksContent.comparison.with.exception.map((step, index) => (
              <div key={step} className="flex items-start gap-2 text-xs font-medium leading-5 text-[#474b5d]">{index === 0 ? <UserRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6e7587]" /> : <Waypoints className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6e7587]" />}{step}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <section id="como-funciona" className="scroll-mt-20 border-y border-[#e3e6ed] bg-white px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <WorksSectionHeading
          eyebrow={worksContent.comparison.eyebrow}
          title={worksContent.comparison.title}
          lead={worksContent.comparison.lead}
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <WorksReveal className="rounded-[20px] border border-[#dfe2e9] bg-[#f7f8fa] p-5 sm:p-8" >
            <div id="sin-ruka" className="scroll-mt-24" />
            <div className="flex items-center justify-between border-b border-[#dfe2e9] pb-5">
              <p className="text-xs font-bold tracking-[0.17em] text-[#7d8392]">{worksContent.comparison.without.label}</p>
              <span className="rounded-full border border-[#dfe2e9] bg-white px-3 py-1 text-[10px] font-medium text-[#858b99]">8 intervenciones</span>
            </div>
            <ManualFlow />
            <p className="mt-8 border-t border-[#dfe2e9] pt-5 text-sm font-semibold leading-6 text-[#555b6b]">{worksContent.comparison.without.close}</p>
          </WorksReveal>

          <WorksReveal className="rounded-[20px] border border-[#cfd6fb] bg-[#f5f7ff] p-5 shadow-[0_20px_60px_rgba(83,105,235,0.08)] sm:p-8" delay={0.08}>
            <div id="con-ruka" className="scroll-mt-24" />
            <div className="flex items-center justify-between border-b border-[#d7dcf5] pb-5">
              <p className="text-xs font-bold tracking-[0.17em] text-[#5369eb]">{worksContent.comparison.with.label}</p>
              <span className="rounded-full border border-[#ccd4ff] bg-white px-3 py-1 text-[10px] font-medium text-[#4d60c7]">1 decisión humana</span>
            </div>
            <AutomatedFlow />
            <p className="mt-8 border-t border-[#d7dcf5] pt-5 text-sm font-semibold leading-6 text-[#3d4675]">{worksContent.comparison.with.close}</p>
          </WorksReveal>
        </div>
      </div>
    </section>
  );
}
