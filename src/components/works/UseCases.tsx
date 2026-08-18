import { ArrowRight, Check, FileCheck2, RefreshCw, Rows3, Split, Waypoints } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { worksContent, WORKS_CONTACT_PATH } from "@/content/worksContent";
import { WorksReveal, WorksSectionHeading } from "@/components/works/WorksReveal";

function CaseDiagram({ caseId, inputs }: { caseId: string; inputs: readonly string[] }) {
  const reduceMotion = useReducedMotion();
  const icon = caseId === "conciliar" ? Split : caseId === "sincronizar" ? RefreshCw : Rows3;
  const CenterIcon = icon;

  if (caseId === "sincronizar") {
    return (
      <div className="grid gap-3 sm:grid-cols-2" aria-label="Ejemplos de sistemas que Ruka mantiene sincronizados">
        {inputs.map((input, index) => {
          const [from, to] = input.split(" → ");
          return (
            <motion.div
              key={input}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="flex min-h-[74px] items-center gap-3 rounded-xl border border-[#e0e4ec] bg-white px-4"
            >
              <span className="text-xs font-semibold text-[#343746]">{from}</span>
              <span className="relative h-px flex-1 overflow-hidden bg-[#dfe3ec]">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-[#5369eb]"
                  initial={reduceMotion ? { width: "100%" } : { width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: 0.12 + index * 0.08 }}
                />
              </span>
              <span className="text-xs font-semibold text-[#5369eb]">{to}</span>
            </motion.div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#dfe3eb] bg-[#f9fafc] p-4 sm:p-6" aria-label={`Diagrama del caso ${caseId}`}>
      <div className="flex flex-wrap gap-2">
        {inputs.map((input, index) => (
          <motion.span
            key={input}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-[#e0e4ec] bg-white px-3 py-2 text-[11px] font-semibold text-[#5f6678] shadow-[0_4px_14px_rgba(29,32,53,0.04)]"
          >
            {input}
          </motion.span>
        ))}
      </div>
      <div className="mx-auto h-7 w-px bg-[#ccd3e2]" />
      <div className="mx-auto flex max-w-[260px] items-center gap-3 rounded-xl bg-[#202231] px-4 py-3 text-white shadow-[0_14px_28px_rgba(23,24,39,0.15)]">
        <CenterIcon className="h-5 w-5 text-[#9cacf9]" />
        <div>
          <p className="text-[10px] font-semibold tracking-[0.13em] text-white/55">RUKA OPERA</p>
          <p className="mt-0.5 text-sm font-semibold">Cruza, valida y aplica reglas</p>
        </div>
      </div>
      <div className="mx-auto h-7 w-px bg-[#ccd3e2]" />
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-[#cfd7ff] bg-[#f0f3ff] px-3 py-3 text-center">
          <Check className="mx-auto h-4 w-4 text-[#5369eb]" />
          <p className="mt-1.5 text-[11px] font-semibold text-[#3e4ea8]">Listo</p>
        </div>
        <div className="rounded-xl border border-[#e1e4eb] bg-white px-3 py-3 text-center">
          <Waypoints className="mx-auto h-4 w-4 text-[#7c8394]" />
          <p className="mt-1.5 text-[11px] font-semibold text-[#62697b]">Excepción</p>
        </div>
      </div>
    </div>
  );
}

export function UseCases() {
  return (
    <section id="casos" className="scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <WorksSectionHeading
          eyebrow={worksContent.cases.eyebrow}
          title={worksContent.cases.title}
          lead={worksContent.cases.lead}
        />

        <div className="mt-20 space-y-24 sm:space-y-32">
          {worksContent.cases.items.map((item, index) => (
            <article id={`caso-${item.id}`} key={item.id} className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <WorksReveal className={cn("min-w-0", index % 2 === 1 && "lg:order-2")}>
                <p className="text-[11px] font-semibold tracking-[0.16em] text-[#5369eb]">{item.label}</p>
                <h3 className="mt-5 max-w-xl text-balance text-[clamp(2rem,4vw,4rem)] font-semibold leading-[1.01] tracking-[-0.052em] text-[#1c1e2c]">{item.title}</h3>
                <p className="mt-6 max-w-xl text-base leading-7 text-[#656c7e]">{item.problem}</p>

                <div className="mt-7 border-l-2 border-[#d9defa] pl-5">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-[#7a8193]">QUÉ HACE RUKA</p>
                  <p className="mt-2 text-base leading-7 text-[#343746]">{item.execution}</p>
                </div>

                <div className="mt-7 flex gap-3 rounded-xl border border-[#dce1f8] bg-[#f7f8ff] p-4">
                  <FileCheck2 className="mt-0.5 h-5 w-5 shrink-0 text-[#5369eb]" />
                  <p className="text-sm font-semibold leading-6 text-[#2f365f]">{item.result}</p>
                </div>
              </WorksReveal>
              <WorksReveal className={cn("min-w-0", index % 2 === 1 && "lg:order-1")} delay={0.08}>
                <CaseDiagram caseId={item.id} inputs={item.inputs} />
              </WorksReveal>
            </article>
          ))}
        </div>

        <WorksReveal className="mt-24 overflow-hidden rounded-[20px] border border-[#d9deeb] bg-white p-7 shadow-[0_24px_70px_rgba(30,34,56,0.09)] sm:mt-32 sm:p-12 lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div>
            <p className="max-w-3xl text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] text-[#1e2030] sm:text-5xl">{worksContent.cases.interruption.title}</p>
            <p className="mt-3 text-xl text-[#687083] sm:text-2xl">{worksContent.cases.interruption.lead}</p>
          </div>
          <Link
            to={WORKS_CONTACT_PATH}
            className="mt-8 inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#5369eb] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#455adb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4 lg:mt-0"
          >
            {worksContent.cases.interruption.action} <ArrowRight className="h-4 w-4" />
          </Link>
        </WorksReveal>
      </div>
    </section>
  );
}
