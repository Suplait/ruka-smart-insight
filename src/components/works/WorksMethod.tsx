import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { worksContent } from "@/content/worksContent";
import { WorksReveal, WorksSectionHeading } from "@/components/works/WorksReveal";

export function WorksMethod() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 70%", "end 65%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="como-trabajamos" ref={sectionRef} className="relative scroll-mt-20 px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <WorksSectionHeading eyebrow={worksContent.method.eyebrow} title={worksContent.method.title} />

        <div className="relative mt-16">
          <div className="absolute bottom-0 left-[19px] top-0 w-px bg-[#dfe3eb] lg:bottom-auto lg:left-0 lg:right-0 lg:top-[19px] lg:h-px lg:w-auto" aria-hidden="true">
            <motion.span
              className="absolute inset-0 origin-top bg-[#5369eb] lg:origin-left"
              style={reduceMotion ? { scaleY: 1, scaleX: 1 } : { scaleY: lineScale, scaleX: lineScale }}
            />
          </div>
          <div className="grid gap-12 lg:grid-cols-4 lg:gap-8">
            {worksContent.method.steps.map((step, index) => (
              <WorksReveal key={step.number} className="relative grid grid-cols-[40px_1fr] gap-5 lg:block" delay={index * 0.06}>
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#cfd5ed] bg-[#fbfcff] text-[10px] font-bold tabular-nums text-[#5369eb]">
                  {step.number}
                </span>
                <div className="lg:mt-8">
                  <p className="text-[10px] font-bold tracking-[0.16em] text-[#5369eb]">{step.verb}</p>
                  <h3 className="mt-3 text-xl font-semibold leading-tight tracking-[-0.03em] text-[#222432] sm:text-2xl">{step.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-[#686f80]">{step.copy}</p>
                  <p className="mt-5 inline-flex rounded-full border border-[#dfe3eb] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#5c6374]">{step.output}</p>
                </div>
              </WorksReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
