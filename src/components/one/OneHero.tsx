import { ArrowDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { oneContent, ONE_CONTACT_PATH } from "@/content/oneContent";
import { ProcessExecution } from "@/components/one/ProcessExecution";

export function OneHero() {
  const reduceMotion = useReducedMotion();
  const motionEnabled = typeof window !== "undefined" && !reduceMotion;

  return (
    <header className="relative px-5 pb-16 pt-24 sm:px-8 sm:pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14 xl:gap-20">
          <motion.div
            initial={motionEnabled ? { opacity: 0, transform: "translateY(14px)" } : false}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.62, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-[11px] font-semibold tracking-[0.18em] text-[#5369eb]">{oneContent.hero.eyebrow}</p>
            <h1 className="mt-6 max-w-[760px] text-balance text-[42px] font-semibold leading-[1.02] tracking-[-0.035em] text-[#171827] sm:text-[52px] xl:text-[64px]">
              {oneContent.hero.title}
            </h1>
            <p className="mt-7 max-w-xl text-pretty text-lg font-medium leading-7 tracking-[-0.01em] text-[#303342] sm:text-xl sm:leading-8">
              {oneContent.hero.lead}
            </p>
            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-[#5f6677]">
              {oneContent.hero.body}
            </p>

            <div id="one-hero-actions" className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                to={ONE_CONTACT_PATH}
                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#5369eb] px-6 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#465bda] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4"
              >
                {oneContent.hero.primaryAction} <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#cfd4df] bg-white px-6 text-sm font-semibold text-[#2b2d3b] transition-[border-color,background-color,transform] duration-150 hover:border-[#aeb5c3] hover:bg-[#f8f9fb] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4"
              >
                {oneContent.hero.secondaryAction} <ArrowDown className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-3 text-xs font-medium text-[#767d8d]">{oneContent.hero.microcopy}</p>
          </motion.div>

          <motion.div
            initial={motionEnabled ? { opacity: 0, transform: "translateY(18px)" } : false}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="min-w-0"
          >
            <ProcessExecution />
          </motion.div>
        </div>
      </div>
    </header>
  );
}
