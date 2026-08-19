import { ChevronDown } from "lucide-react";
import { worksContent } from "@/content/worksContent";

export function WorksFaq() {
  return (
    <section id="preguntas" className="scroll-mt-20 px-5 py-20 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
        <h2 className="max-w-lg text-balance text-[36px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#171827] sm:text-[46px]">{worksContent.faq.title}</h2>
        <div className="border-t border-[#d9dde5]">
          {worksContent.faq.items.map((item, index) => (
            <details key={item.question} className="group border-b border-[#d9dde5]" open={index === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-base font-semibold text-[#292b38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-inset sm:text-lg [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <ChevronDown className="h-5 w-5 shrink-0 text-[#7c8392] transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="pb-6 pr-10">
                <p className="max-w-2xl text-sm leading-7 text-[#62697a] sm:text-base">{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
