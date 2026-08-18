import { ArrowDownRight } from "lucide-react";
import { worksContent } from "@/content/worksContent";
import { WorksReveal, WorksSectionHeading } from "@/components/works/WorksReveal";

export function WorksDifference() {
  return (
    <section id="por-que-ruka" className="border-y border-[#e2e5ec] bg-white px-5 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <WorksSectionHeading eyebrow={worksContent.difference.eyebrow} title={worksContent.difference.title} />

        <div className="mt-16 border-t border-[#dfe3eb]">
          {worksContent.difference.items.map((item, index) => (
            <WorksReveal key={item.number} className="grid gap-5 border-b border-[#dfe3eb] py-8 sm:grid-cols-[80px_0.8fr_1.2fr] sm:gap-8 sm:py-10" delay={index * 0.06}>
              <p className="text-sm font-medium tabular-nums text-[#9298a7]">{item.number}</p>
              <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#222432] sm:text-2xl">{item.title}</h3>
              <p className="max-w-2xl text-base leading-7 text-[#676e80]">{item.copy}</p>
            </WorksReveal>
          ))}
        </div>

        <WorksReveal className="mt-14 grid items-start gap-6 sm:grid-cols-[auto_1fr] sm:gap-9">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5369eb] text-white"><ArrowDownRight className="h-5 w-5" /></span>
          <p className="max-w-5xl text-balance text-[clamp(2.1rem,4.4vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.052em] text-[#202231]">
            {worksContent.difference.statement}
          </p>
        </WorksReveal>
      </div>
    </section>
  );
}
