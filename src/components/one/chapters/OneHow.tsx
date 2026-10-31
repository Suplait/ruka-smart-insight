import { cn } from "@/lib/utils";
import { oneContent } from "@/content/oneContent";

/** "Cómo ocurre": from a concrete problem to work running. The field lifts finished outputs meanwhile. */
export function OneHow() {
  const content = oneContent.how;
  const last = content.steps.length - 1;
  return (
    <section id={content.id} data-scene="execute" aria-labelledby="one-how-title" className="relative scroll-mt-20 py-28 sm:py-36 lg:py-48">
      <div aria-hidden="true" className="one-shade-left pointer-events-none absolute inset-0 hidden lg:block" />
      <div aria-hidden="true" className="one-shade-mask pointer-events-none absolute inset-0 bg-[rgba(3,4,10,0.72)] lg:hidden" />
      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[44rem]">
          <p className="one-eyebrow" data-reveal>{content.eyebrow}</p>
          <h2 id="one-how-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-6 text-balance text-[clamp(2.3rem,5vw,4.5rem)] font-semibold leading-[0.97] tracking-[-0.048em]">
            {content.title}
          </h2>
        </div>

        <ol className="mt-16 grid gap-x-10 lg:mt-20 lg:max-w-[45rem] lg:grid-cols-2">
          {content.steps.map((step, index) => {
            const outcome = index === last;
            return (
              <li
                key={step.label}
                data-reveal
                style={{ ["--d" as string]: index }}
                className={cn("one-step border-t py-6 lg:py-7", outcome ? "border-[var(--one-hair-strong)]" : "border-[var(--one-hair)]")}
              >
                <div className="flex items-center gap-4">
                  <span aria-hidden="true" className={cn("one-step__tile", outcome && "one-step__tile--outcome")} style={{ ["--lift" as string]: index }} />
                  <span className="text-xs font-semibold tabular-nums tracking-[0.16em] text-[var(--one-accent)]">0{index + 1}</span>
                  <h3 className="text-xl font-semibold tracking-[-0.025em] text-white lg:text-2xl">{step.label}</h3>
                </div>
                <p className="mt-3 text-pretty text-[17px] leading-[1.55] text-[var(--one-soft)]">{step.text}</p>
              </li>
            );
          })}
        </ol>

        <p data-reveal className="mt-12 max-w-[44rem] text-pretty border-l-2 border-[hsl(var(--primary))] pl-5 text-lg leading-[1.6] text-[var(--one-soft)] lg:mt-14">
          {content.note}
        </p>
      </div>
    </section>
  );
}
