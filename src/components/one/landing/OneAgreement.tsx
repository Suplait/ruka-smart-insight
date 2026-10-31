import { oneContent } from "@/content/oneContent";
import { cn } from "@/lib/utils";
import { useOneReveal } from "./useOneInView";

const { agreement } = oneContent;
const [titleLead, titleEmphasis] = agreement.title.split(",");

export function OneAgreement() {
  const { ref, revealProps } = useOneReveal<HTMLDivElement>();

  return (
    <section id="responsabilidad" aria-labelledby="one-agreement-title" className="one-night scroll-mt-16 px-4 py-20 sm:px-8 lg:px-10 lg:py-32">
      <div ref={ref} data-enhanced={revealProps["data-enhanced"]} className={cn(revealProps.className, "mx-auto max-w-[84rem]")}>
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="one-eyebrow text-[var(--one-bone-2)]">{agreement.eyebrow}</p>
            <h2 id="one-agreement-title" className="one-display mt-6 text-[clamp(2.75rem,6.4vw,6rem)]">
              {`${titleLead},`}<span className="italic">{titleEmphasis}</span>
            </h2>
          </div>
          <p className="one-pretty self-end text-[1.1875rem] leading-[1.6] text-[var(--one-bone-2)] lg:col-span-4 lg:col-start-9">{agreement.lead}</p>
        </div>

        <ol className="mt-16 grid border-t border-[var(--one-night-rule)] sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {agreement.clauses.map((clause) => (
            <li key={clause.number} className="group relative border-b border-[var(--one-night-rule)] py-8 sm:pr-10 lg:py-12">
              <span aria-hidden="true" className="absolute left-0 top-[-1px] h-[2px] w-10 bg-[var(--one-primary)] transition-[width] duration-700 ease-out group-hover:w-full" />
              <p className="flex items-baseline gap-4">
                <span className="one-serif text-[1.25rem] italic text-[var(--one-bone-2)]">§ {clause.number}</span>
                <span className="text-[1.25rem] font-medium tracking-[-0.01em]">{clause.title}</span>
              </p>
              <p className="one-pretty mt-4 text-[1.0625rem] leading-[1.65] text-[var(--one-bone-2)]">{clause.copy}</p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid gap-6 border-l-2 border-[var(--one-primary)] pl-6 lg:mt-20 lg:grid-cols-12 lg:gap-10 lg:pl-10">
          <p className="one-eyebrow text-[var(--one-bone-2)] lg:col-span-3">{agreement.limitsTitle}</p>
          <p className="one-serif text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.2] lg:col-span-9">{agreement.limits}</p>
        </div>
      </div>
    </section>
  );
}
