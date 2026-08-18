import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { worksContent, WORKS_CONTACT_PATH } from "@/content/worksContent";
import { ProcessExecution } from "@/components/works/ProcessExecution";

export function WorksHero() {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;

  return (
    <header className="relative overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pb-28 sm:pt-40 lg:pb-32 lg:pt-44">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#5369eb]" />
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 xl:gap-20">
          <motion.div
            initial={motionEnabled ? { opacity: 0, y: 18, filter: "blur(3px)" } : false}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-32"
          >
            <div className="mb-7 flex items-center gap-3">
              <span className="h-px w-8 bg-[#5369eb]" />
              <p className="text-[11px] font-semibold tracking-[0.2em] text-[#4f64dd]">{worksContent.hero.eyebrow}</p>
            </div>
            <h1 className="max-w-2xl text-balance text-[clamp(3.05rem,5.8vw,6.15rem)] font-semibold leading-[0.92] tracking-[-0.065em] text-[#171827]">
              {worksContent.hero.title}
            </h1>
            <p className="mt-8 max-w-xl text-pretty text-xl font-medium leading-8 tracking-[-0.018em] text-[#313444] sm:text-2xl sm:leading-9">
              {worksContent.hero.lead}
            </p>
            <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-[#6b7182] sm:text-lg sm:leading-8">
              {worksContent.hero.body}
            </p>

            <div id="works-hero-actions" className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                to={WORKS_CONTACT_PATH}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#5369eb] px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(83,105,235,0.24)] transition hover:-translate-y-0.5 hover:bg-[#455adb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4"
              >
                {worksContent.hero.primaryAction} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-[#d7dbe5] bg-white px-6 text-sm font-semibold text-[#272938] transition hover:-translate-y-0.5 hover:border-[#bfc5d2] hover:bg-[#f8f9fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4"
              >
                {worksContent.hero.secondaryAction} <ArrowDown className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-3 text-xs font-medium text-[#7a8091]">{worksContent.hero.microcopy}</p>
          </motion.div>

          <motion.div
            initial={motionEnabled ? { opacity: 0, y: 26, scale: 0.985 } : false}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.82, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-0 lg:pt-9"
          >
            <ProcessExecution />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
