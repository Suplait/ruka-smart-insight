import { useRef } from "react";
import { Check } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { worksContent } from "@/content/worksContent";

export function WorksMethod() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start 72%", "end 68%"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="como-trabajamos" ref={sectionRef} className="relative scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <h2 className="max-w-4xl text-balance text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-[48px] lg:text-[52px]">
          {worksContent.method.title}
        </h2>

        <div className="relative mt-12">
          <div className="absolute bottom-0 left-[15px] top-0 w-px bg-[#dfe3ea] md:bottom-auto md:left-0 md:right-0 md:top-[15px] md:h-px md:w-auto" aria-hidden="true">
            <motion.span
              className="absolute inset-0 origin-top bg-[#5369eb] md:origin-left"
              style={reduceMotion ? { scaleY: 1, scaleX: 1 } : { scaleY: lineScale, scaleX: lineScale }}
            />
          </div>
          <div className="grid gap-10 md:grid-cols-3 md:gap-8">
            {worksContent.method.steps.map((step, index) => (
              <article key={step.number} className="relative grid grid-cols-[32px_1fr] gap-5 md:block">
                <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#c9d1f2] bg-[#fbfcff] text-[10px] font-semibold tabular-nums text-[#5369eb]">{step.number}</span>
                <div className="md:mt-7">
                  <p className="text-[10px] font-semibold tracking-[0.13em] text-[#5369eb]">{step.verb}</p>
                  <h3 className="mt-3 text-[24px] font-semibold leading-[1.15] tracking-[-0.025em] text-[#252735] sm:text-[28px]">{step.title}</h3>
                  <p className="mt-3 max-w-md text-sm leading-6 text-[#666d7d]">{step.copy}</p>
                  <p className="mt-4 text-xs font-semibold text-[#4d5363]">{step.output}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-14 border-y border-[#dfe3ea] bg-white">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4">
            {worksContent.method.rail.map((item, index) => (
              <div key={item} className={`flex items-center gap-3 px-4 py-4 text-sm font-semibold text-[#454a59] sm:px-5 ${index % 2 === 0 ? "sm:border-r sm:border-[#e1e4ea]" : ""} ${index < 2 ? "border-b border-[#e1e4ea] lg:border-b-0" : ""} ${index > 0 ? "lg:border-l lg:border-[#e1e4ea]" : ""}`}>
                <Check className="h-4 w-4 shrink-0 text-[#5369eb]" /> {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 max-w-5xl">
          <p className="text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#202230] sm:text-[42px]">{worksContent.method.statement}</p>
          <p className="mt-4 max-w-3xl text-base leading-7 text-[#646b7b]">{worksContent.method.supporting}</p>
        </div>
      </div>
    </section>
  );
}
