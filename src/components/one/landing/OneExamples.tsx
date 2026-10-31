import { useRef, useState } from "react";
import { oneContent } from "@/content/oneContent";
import { cn } from "@/lib/utils";

const { examples } = oneContent;

export function OneExamples() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    const next = (index + examples.items.length) % examples.items.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: examples.items.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    focusTab(keys[event.key]);
  };

  return (
    <section id="aplicaciones" aria-labelledby="one-examples-title" className="scroll-mt-20 px-4 py-20 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[84rem]">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="one-eyebrow text-[var(--one-ink-3)]">{examples.eyebrow}</p>
            <h2 id="one-examples-title" className="one-display mt-6 text-[clamp(2.75rem,6vw,5.5rem)]">{examples.title}</h2>
          </div>
          <p className="self-end text-[0.9375rem] leading-6 text-[var(--one-ink-3)] lg:col-span-4 lg:col-start-9">{examples.disclaimer}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:mt-20 lg:grid-cols-12 lg:gap-10">
          <div
            role="tablist"
            aria-label="Áreas de ejemplo"
            aria-orientation="vertical"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:col-span-4 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-[var(--one-rule)] lg:px-0 lg:pb-0"
          >
            {examples.items.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  ref={(node) => { tabRefs.current[index] = node; }}
                  id={`one-example-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`one-example-${item.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                  className={cn(
                    "group relative shrink-0 whitespace-nowrap border px-4 py-2.5 text-left text-[0.9375rem] transition-colors lg:flex lg:items-center lg:justify-between lg:border-0 lg:border-b lg:border-[var(--one-rule)] lg:px-0 lg:py-5",
                    selected ? "border-[var(--one-ink)] bg-[var(--one-ink)] text-[var(--one-paper)] lg:bg-transparent lg:text-[var(--one-ink)]" : "border-[var(--one-rule)] text-[var(--one-ink-2)] hover:text-[var(--one-ink)]",
                  )}
                >
                  <span className="lg:[font-family:var(--one-serif)] lg:text-[2rem] lg:leading-none">{item.area}</span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "hidden h-[2px] bg-[var(--one-primary)] transition-[width] duration-500 lg:block",
                      selected ? "w-16" : "w-0 group-hover:w-6",
                    )}
                  />
                </button>
              );
            })}
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            {examples.items.map((item, index) => (
              <article
                key={item.id}
                id={`one-example-${item.id}`}
                role="tabpanel"
                aria-labelledby={`one-example-tab-${item.id}`}
                hidden={index !== active}
                tabIndex={0}
                className="focus-visible:outline-offset-8"
              >
                <h3 className="one-serif text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.05]">{item.title}</h3>
                <dl className="mt-8 border-t border-[var(--one-ink)]">
                  <div className="grid gap-2 border-b border-[var(--one-rule)] py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                    <dt className="one-eyebrow pt-1 text-[var(--one-ink-3)]">{examples.labels.today}</dt>
                    <dd className="text-[1.125rem] leading-[1.6] text-[var(--one-ink-2)]">{item.today}</dd>
                  </div>
                  <div className="relative grid gap-2 border-b border-[var(--one-rule)] py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                    <span aria-hidden="true" className="absolute bottom-5 left-[-1rem] top-5 w-[2px] bg-[var(--one-primary)] sm:left-[-1.25rem]" />
                    <dt className="one-eyebrow pt-1">{examples.labels.withOne}</dt>
                    <dd className="text-[1.125rem] font-medium leading-[1.6]">{item.withOne}</dd>
                  </div>
                  <div className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr] sm:gap-6">
                    <dt className="one-eyebrow pt-1 text-[var(--one-ink-3)]">{examples.labels.decide}</dt>
                    <dd className="one-serif text-[1.5rem] italic leading-[1.3]">{item.decide}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
