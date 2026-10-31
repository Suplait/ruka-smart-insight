import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { oneContent } from "@/content/oneContent";

export function OneAreas({ active, onActiveChange }: { active: number; onActiveChange: (index: number) => void }) {
  const content = oneContent.areas;
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const count = content.items.length;
    const keys: Record<string, number> = {
      ArrowDown: (active + 1) % count,
      ArrowRight: (active + 1) % count,
      ArrowUp: (active - 1 + count) % count,
      ArrowLeft: (active - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    if (!(event.key in keys)) return;
    event.preventDefault();
    const next = keys[event.key];
    onActiveChange(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id={content.id} data-scene="areas" aria-labelledby="one-areas-title" className="relative scroll-mt-20 py-28 sm:py-36 lg:py-44">
      <div aria-hidden="true" className="one-shade-left pointer-events-none absolute inset-0 hidden lg:block" />
      <div aria-hidden="true" className="one-shade-mask pointer-events-none absolute inset-0 bg-[rgba(3,4,10,0.7)] lg:hidden" />
      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[46rem]">
          <p className="one-eyebrow" data-reveal>{content.eyebrow}</p>
          <h2 id="one-areas-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-6 text-balance text-[clamp(2.3rem,5vw,4.5rem)] font-semibold leading-[0.97] tracking-[-0.048em]">
            {content.title}
          </h2>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:max-w-[58rem] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div
            role="tablist"
            aria-label="Áreas de ejemplo"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0 lg:pl-6"
          >
            {content.items.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.name}
                  ref={(node) => { tabs.current[index] = node; }}
                  id={`one-area-tab-${index}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={`one-area-panel-${index}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => onActiveChange(index)}
                  onMouseEnter={() => onActiveChange(index)}
                  className={cn(
                    "one-area-tab min-h-[44px] flex-none whitespace-nowrap rounded-full border px-4 text-[15px] font-medium lg:rounded-none lg:border-0 lg:px-0 lg:py-1.5 lg:text-left lg:text-[clamp(1.6rem,2.6vw,2.4rem)] lg:font-semibold lg:tracking-[-0.035em]",
                    selected ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.16)] text-white lg:bg-transparent" : "border-[var(--one-hair)] text-[var(--one-muted)] hover:text-[var(--one-soft)]",
                  )}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[300px]">
            {content.items.map((item, index) => (
              <div
                key={item.name}
                id={`one-area-panel-${index}`}
                role="tabpanel"
                aria-labelledby={`one-area-tab-${index}`}
                hidden={index !== active}
                className={cn(index === active && "one-panel-enter")}
              >
                <p className="inline-flex items-center gap-2 rounded-full border border-[var(--one-hair-strong)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--one-muted)]">
                  {content.disclaimer}
                </p>
                <h3 className="mt-6 text-[clamp(1.7rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.04em]">{item.example}</h3>
                <dl className="mt-8">
                  <div className="border-t border-[var(--one-hair)] py-5">
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--one-accent)]">Lo que tomamos</dt>
                    <dd className="mt-2 text-lg leading-[1.55] text-[var(--one-soft)]">{item.ours}</dd>
                  </div>
                  <div className="border-t border-[var(--one-hair)] py-5">
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Lo que decides tú</dt>
                    <dd className="mt-2 text-lg font-medium leading-[1.55] text-white">{item.yours}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
