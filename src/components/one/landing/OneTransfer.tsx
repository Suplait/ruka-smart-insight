import { useEffect, useRef, useState } from "react";
import { oneContent } from "@/content/oneContent";

const { transfer } = oneContent;
type Step = (typeof transfer.steps)[number];

function Split({ step, large }: { step: Step; large?: boolean }) {
  return (
    <div aria-hidden="true">
      <div className="flex justify-between text-xs font-medium uppercase tracking-[0.14em]">
        <span className="text-[var(--one-ink-3)]">{transfer.team}</span>
        <span>{transfer.one}</span>
      </div>
      <div
        className={large ? "one-split mt-3 h-56 border border-[var(--one-ink)] xl:h-64" : "one-split mt-2 h-10 border border-[var(--one-ink)]"}
        style={{ "--split": `${step.split}%` } as React.CSSProperties}
      >
        <div className="one-split__team" />
        <div className="one-split__one" />
      </div>
    </div>
  );
}

export function OneTransfer() {
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    setEnhanced(true);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
      }
    }, { rootMargin: "-45% 0px -45% 0px" });
    stepRefs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const current = transfer.steps[active];

  return (
    <section id="como-funciona" aria-labelledby="one-transfer-title" className="scroll-mt-20 border-t border-[var(--one-rule)] px-4 py-20 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[84rem]">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="one-eyebrow text-[var(--one-ink-3)]">{transfer.eyebrow}</p>
            <h2 id="one-transfer-title" className="one-display mt-6 text-[clamp(2.75rem,6vw,5.5rem)]">{transfer.title}</h2>
          </div>
          <p className="one-pretty self-end text-[1.1875rem] leading-[1.6] text-[var(--one-ink-2)] lg:col-span-4 lg:col-start-9">{transfer.lead}</p>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-10">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-32" aria-hidden="true">
              <Split step={current} large />
              <dl className="mt-8 grid grid-cols-2 gap-8 text-[1.0625rem] leading-[1.5]">
                <div>
                  <dt className="one-eyebrow text-[var(--one-ink-3)]">{transfer.team}</dt>
                  <dd className="mt-3 text-[var(--one-ink-2)]">{current.team}</dd>
                </div>
                <div>
                  <dt className="one-eyebrow">{transfer.one}</dt>
                  <dd className="mt-3">{current.one}</dd>
                </div>
              </dl>
            </div>
          </div>

          <ol className="one-steps lg:col-span-6 lg:col-start-7" data-enhanced={enhanced ? "true" : undefined}>
            {transfer.steps.map((step, index) => (
              <li
                key={step.number}
                ref={(node) => { stepRefs.current[index] = node; }}
                data-index={index}
                data-active={index === active ? "true" : undefined}
                className="one-step border-t border-[var(--one-ink)] pb-14 pt-6 lg:min-h-[62vh] lg:pb-24"
              >
                <p className="one-serif text-[1.35rem] italic text-[var(--one-ink-3)]">{step.number}</p>
                <h3 className="one-serif mt-3 text-[clamp(2rem,3.4vw,3rem)] leading-[1.05] text-balance">{step.title}</h3>
                <p className="one-pretty mt-5 max-w-xl text-[1.125rem] leading-[1.65] text-[var(--one-ink-2)]">{step.copy}</p>
                <div className="mt-8 lg:hidden">
                  <Split step={step} />
                  <div className="mt-3 grid grid-cols-2 gap-4 text-sm leading-5">
                    <p className="text-[var(--one-ink-3)]">{step.team}</p>
                    <p className="text-right">{step.one}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
