import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { worksContent, WORKS_CONTACT_PATH } from "@/content/worksContent";

export function WorksFinalCta() {
  return (
    <section id="works-final-cta" className="border-t border-[#dfe3ea] bg-white px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-9 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
        <div>
          <h2 className="max-w-4xl text-balance text-[38px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#171827] sm:text-[48px] lg:text-[52px]">{worksContent.finalCta.title}</h2>
          <p className="mt-3 text-[32px] font-semibold tracking-[-0.03em] text-[#5369eb] sm:text-[40px]">{worksContent.finalCta.statement}</p>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#62697a]">{worksContent.finalCta.copy}</p>
        </div>
        <div>
          <Link
            to={WORKS_CONTACT_PATH}
            className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#5369eb] px-6 text-sm font-semibold text-white transition-[background-color,transform] duration-150 hover:bg-[#465bda] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4"
          >
            {worksContent.finalCta.action} <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-3 text-center text-xs font-medium text-[#7a8190]">{worksContent.finalCta.microcopy}</p>
        </div>
      </div>
    </section>
  );
}
