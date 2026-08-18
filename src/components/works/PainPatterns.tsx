import { ArrowRight, CheckCircle2, Clock3, GitBranch, UserRound } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { worksContent } from "@/content/worksContent";
import { WorksReveal, WorksSectionHeading } from "@/components/works/WorksReveal";

const patternIcons = [ArrowRight, GitBranch, Clock3, UserRound];

export function PainPatterns() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="dolor" className="border-y border-[#e4e7ee] bg-white px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <WorksSectionHeading
          eyebrow={worksContent.pain.eyebrow}
          title={worksContent.pain.title}
          lead={worksContent.pain.lead}
        />

        <div className="mt-16 grid border-y border-[#dfe3eb] md:grid-cols-2">
          {worksContent.pain.patterns.map((pattern, index) => {
            const Icon = patternIcons[index];
            return (
              <motion.article
                key={pattern.number}
                initial={typeof window !== "undefined" && !reduceMotion ? { opacity: 0, y: 14 } : false}
                whileInView={typeof window !== "undefined" && !reduceMotion ? { opacity: 1, y: 0 } : undefined}
                viewport={{ once: true, amount: 0.28 }}
                transition={{ duration: 0.58, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className={`relative min-h-[310px] px-1 py-9 sm:px-8 sm:py-11 ${
                  index % 2 === 0 ? "md:border-r md:border-[#dfe3eb]" : ""
                } ${index < 2 ? "border-b border-[#dfe3eb]" : index === 2 ? "border-b border-[#dfe3eb] md:border-b-0" : ""}`}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="text-sm font-medium tabular-nums text-[#9aa0af]">{pattern.number}</span>
                  <Icon className="h-5 w-5 text-[#5369eb]" />
                </div>
                <h3 className="mt-8 text-2xl font-semibold tracking-[-0.035em] text-[#1b1d2b] sm:text-3xl">{pattern.title}</h3>
                <p className="mt-4 max-w-xl text-base leading-7 text-[#676d7e]">{pattern.copy}</p>

                <div className="mt-8 flex items-center gap-2 overflow-hidden" aria-hidden="true">
                  {pattern.diagram.map((item, itemIndex) => (
                    <div key={item} className="contents">
                      <span className="shrink-0 rounded-lg border border-[#e1e4ec] bg-[#fafbfc] px-2.5 py-1.5 text-[10px] font-semibold text-[#656c7d]">{item}</span>
                      {itemIndex < pattern.diagram.length - 1 ? (
                        <span className="relative h-px min-w-4 flex-1 overflow-hidden bg-[#d9dde7]">
                          <motion.span
                            className="absolute inset-y-0 left-0 bg-[#5369eb]"
                            initial={reduceMotion ? { width: "100%" } : { width: "0%" }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.18 + index * 0.06 }}
                          />
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </motion.article>
            );
          })}
        </div>

        <WorksReveal className="mt-16 grid items-start gap-8 lg:grid-cols-[auto_1fr] lg:gap-12">
          <CheckCircle2 className="h-10 w-10 text-[#5369eb]" />
          <p className="max-w-5xl text-balance text-[clamp(2rem,4.2vw,4.3rem)] font-medium leading-[1.04] tracking-[-0.052em] text-[#202231]">
            {worksContent.pain.statement}
          </p>
        </WorksReveal>
      </div>
    </section>
  );
}
