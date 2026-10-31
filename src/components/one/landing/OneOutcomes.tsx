import { oneContent } from "@/content/oneContent";
import { cn } from "@/lib/utils";
import { useOneReveal } from "./useOneInView";

const { outcomes, intelligence } = oneContent;

export function OneOutcomes() {
  const { ref, revealProps } = useOneReveal<HTMLDivElement>();

  return (
    <section aria-labelledby="one-outcomes-title" className="px-4 py-20 sm:px-8 lg:px-10 lg:py-32">
      <div ref={ref} data-enhanced={revealProps["data-enhanced"]} className={cn(revealProps.className, "mx-auto max-w-[84rem]")}>
        <p className="one-eyebrow text-[var(--one-ink-3)]">{outcomes.eyebrow}</p>
        <h2 id="one-outcomes-title" className="one-display mt-6 max-w-4xl text-[clamp(2.5rem,5vw,4.5rem)]">{outcomes.title}</h2>
        <ul className="mt-14 grid border-t border-[var(--one-ink)] sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {outcomes.items.map((item, index) => (
            <li key={item.title} className={cn("border-b border-[var(--one-rule)] py-8 sm:pr-8 lg:border-b-0 lg:py-10", index > 0 && "lg:border-l lg:pl-8")}>
              <h3 className="one-serif text-[1.85rem] leading-[1.1]">{item.title}</h3>
              <p className="one-pretty mt-4 text-[1.0625rem] leading-[1.6] text-[var(--one-ink-2)]">{item.copy}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-[0.9375rem] leading-6 text-[var(--one-ink-3)] lg:mt-12">{outcomes.honesty}</p>
      </div>
    </section>
  );
}

export function OneIntelligence() {
  const { ref, revealProps } = useOneReveal<HTMLDivElement>();

  return (
    <section aria-labelledby="one-intelligence-title" className="border-t border-[var(--one-rule)] bg-[var(--one-paper-2)] px-4 py-20 sm:px-8 lg:px-10 lg:py-32">
      <div ref={ref} data-enhanced={revealProps["data-enhanced"]} className={cn(revealProps.className, "mx-auto grid max-w-[84rem] gap-12 lg:grid-cols-12 lg:gap-10")}>
        <div className="lg:col-span-4">
          <p className="one-eyebrow text-[var(--one-ink-3)]">{intelligence.eyebrow}</p>
          <h2 id="one-intelligence-title" className="mt-6 text-[clamp(1.6rem,2.4vw,2.1rem)] font-medium leading-[1.2] tracking-[-0.02em] text-balance">{intelligence.title}</h2>
          <p className="one-pretty mt-6 text-[1.0625rem] leading-[1.65] text-[var(--one-ink-2)]">{intelligence.note}</p>
        </div>
        <ul className="lg:col-span-8">
          {intelligence.lines.map((line) => (
            <li key={line.tool} className="border-b border-[var(--one-rule)] py-5 first:pt-0 sm:py-7">
              <p className="one-serif text-[clamp(1.9rem,4.2vw,3.6rem)] leading-[1.05]">
                <span className="italic">{line.tool}</span>{" "}
                <span className="text-[var(--one-ink-3)]">{line.where}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
