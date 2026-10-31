import { oneContent } from "@/content/oneContent";
import { cn } from "@/lib/utils";
import { useOneReveal } from "./useOneInView";

const { definition } = oneContent;

export function OneDefinition() {
  const { ref, revealProps } = useOneReveal<HTMLDivElement>();

  return (
    <section id="categoria" aria-labelledby="one-definition-title" className="scroll-mt-20 border-t border-[var(--one-rule)] bg-[var(--one-paper-2)] px-4 py-20 sm:px-8 lg:px-10 lg:py-32">
      <div ref={ref} data-enhanced={revealProps["data-enhanced"]} className={cn(revealProps.className, "mx-auto max-w-[84rem]")}>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <p className="one-eyebrow text-[var(--one-ink-3)]">{definition.eyebrow}</p>
            <h2 id="one-definition-title" className="one-display mt-6 text-[clamp(2.4rem,4.6vw,4.25rem)]">{definition.title}</h2>
          </div>
          <dl className="lg:col-span-6 lg:col-start-7">
            <dt className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="one-serif text-[2.5rem] leading-none">{definition.term}</span>
              <span className="text-sm italic text-[var(--one-ink-3)]">{definition.phonetic}</span>
            </dt>
            <dd className="one-pretty mt-5 border-l-2 border-[var(--one-primary)] pl-5 text-[1.1875rem] leading-[1.65] text-[var(--one-ink-2)] sm:text-[1.3125rem]">
              {definition.meaning}
            </dd>
          </dl>
        </div>

        <div className="mt-20 lg:mt-28">
          <h3 className="one-eyebrow text-[var(--one-ink-3)]">{definition.contrastTitle}</h3>
          <ul className="mt-6 border-t border-[var(--one-rule)]">
            {definition.contrasts.map((item) => (
              <li key={item.who} className="grid gap-1 border-b border-[var(--one-rule)] py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-6">
                <span className="one-serif text-[1.65rem] leading-tight text-[var(--one-ink-2)] sm:col-span-4 sm:text-[2rem]">{item.who}</span>
                <span className="text-[1.0625rem] text-[var(--one-ink-2)] sm:col-span-3">{item.what}</span>
                <span className="text-[1.0625rem] text-[var(--one-ink-3)] sm:col-span-5">{item.then}</span>
              </li>
            ))}
            <li className="relative grid gap-1 border-b-2 border-[var(--one-ink)] py-6 sm:grid-cols-12 sm:items-baseline sm:gap-6 sm:py-8">
              <span aria-hidden="true" className="absolute -top-px left-0 h-[2px] w-full origin-left bg-[var(--one-primary)]" />
              <span className="one-serif text-[2rem] italic leading-tight sm:col-span-4 sm:text-[2.6rem]">{definition.ours.who}</span>
              <span className="text-[1.1875rem] font-medium sm:col-span-8">
                {definition.ours.what} <span className="text-[var(--one-ink-2)]">{definition.ours.then}</span>
              </span>
            </li>
          </ul>
          <p className="one-serif mt-12 max-w-3xl text-balance text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15]">
            {definition.closing}
          </p>
        </div>
      </div>
    </section>
  );
}
