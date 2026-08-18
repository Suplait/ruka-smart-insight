import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { worksContent, WORKS_CONTACT_PATH } from "@/content/worksContent";
import { WorksReveal } from "@/components/works/WorksReveal";

export function WorksFinalCta() {
  return (
    <section id="works-final-cta" className="px-5 pb-8 pt-12 sm:px-8 sm:pb-10 sm:pt-20">
      <WorksReveal className="mx-auto max-w-7xl overflow-hidden rounded-[22px] border border-[#d7dcec] bg-[#202231] px-6 py-14 text-white shadow-[0_30px_80px_rgba(23,24,39,0.16)] sm:px-12 sm:py-20 lg:px-20">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-[#9daafb]">{worksContent.finalCta.eyebrow}</p>
        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="max-w-4xl text-balance text-[clamp(2.8rem,6vw,6.3rem)] font-semibold leading-[0.9] tracking-[-0.065em]">{worksContent.finalCta.title}</h2>
            <p className="mt-6 max-w-2xl text-pretty text-base leading-7 text-white/64 sm:text-lg sm:leading-8">{worksContent.finalCta.copy}</p>
          </div>
          <div>
            <Link
              to={WORKS_CONTACT_PATH}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-[#202231] transition hover:-translate-y-0.5 hover:bg-[#f0f2ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#202231]"
            >
              {worksContent.finalCta.action} <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 text-center text-xs text-white/48">{worksContent.finalCta.microcopy}</p>
          </div>
        </div>
      </WorksReveal>
    </section>
  );
}
