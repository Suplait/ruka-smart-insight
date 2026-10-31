import { useRef } from "react";
import { oneContent } from "@/content/oneContent";
import { useScrollProgress } from "./useOneMotion";

/** Measurable impact: the headline resolves word by word as you read it. */
export function OneImpact() {
  const content = oneContent.impact;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const progress = useScrollProgress(titleRef);
  const words = content.title.split(" ");

  return (
    <section id={content.id} data-scene="impact" aria-labelledby="one-impact-title" className="relative scroll-mt-20 py-28 sm:py-36 lg:py-48">
      <div aria-hidden="true" className="one-shade-center pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="one-shade-mask pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,4,10,0)_0%,rgba(3,4,10,0.78)_30%,rgba(3,4,10,0.78)_80%,rgba(3,4,10,0)_100%)]" />
      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        <p className="one-eyebrow" data-reveal>{content.eyebrow}</p>
        <h2 ref={titleRef} id="one-impact-title" className="mt-6 max-w-[62rem] text-balance text-[clamp(2.4rem,6vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.052em]">
          {words.map((word, index) => {
            const lit = progress * (words.length + 3) - index;
            const alpha = Math.max(0.16, Math.min(1, lit));
            return (
              <span key={`${word}-${index}`} className="one-word" style={{ color: `rgba(241,243,250,${alpha.toFixed(3)})` }}>
                {word}{index < words.length - 1 ? " " : ""}
                {/* Each sentence starts its own line. */}
                {word.endsWith(".") && index < words.length - 1 ? <br /> : null}
              </span>
            );
          })}
        </h2>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p data-reveal className="max-w-[40rem] text-pretty text-lg leading-[1.6] text-[var(--one-soft)] lg:text-xl">{content.lead}</p>
            <h3 data-reveal style={{ ["--d" as string]: 1 }} className="mt-10 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--one-accent)]">{content.metricsLabel}</h3>
            <ul data-reveal style={{ ["--d" as string]: 2 }} className="mt-4 flex flex-wrap gap-2">
              {content.metrics.map((metric) => (
                <li key={metric} className="one-metric inline-flex min-h-[36px] items-center gap-2.5 rounded-full border border-[var(--one-hair-strong)] bg-[rgba(5,7,16,0.7)] px-3.5 text-[14.5px] text-white">
                  <span aria-hidden="true" className="h-[7px] w-[7px] flex-none rounded-[2px] bg-[hsl(var(--primary))]" />
                  {metric}
                </li>
              ))}
            </ul>
            <p data-reveal style={{ ["--d" as string]: 3 }} className="mt-4 text-sm leading-6 text-[var(--one-muted)]">{content.metricsNote}</p>
          </div>
          <div data-reveal style={{ ["--d" as string]: 2 }} className="lg:col-span-5 lg:col-start-8">
            <div className="rounded-3xl border border-[var(--one-hair-strong)] bg-[rgba(5,7,16,0.9)] p-7 lg:p-9">
              <span aria-hidden="true" className="block h-[11px] w-[11px] rounded-[3px] bg-white shadow-[0_6px_14px_-4px_rgba(160,175,255,0.9)]" />
              <h3 className="mt-7 text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-[-0.035em]">{content.roi.title}</h3>
              <p className="mt-4 text-pretty text-[16.5px] leading-[1.6] text-[var(--one-soft)]">{content.roi.copy}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-[var(--one-hair)] bg-[var(--one-hair)] sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {content.commitments.map((item, index) => (
            <div key={item.title} data-reveal style={{ ["--d" as string]: index }} className="bg-[rgba(5,7,16,0.94)] p-6 lg:p-8">
              <span aria-hidden="true" className="block h-[10px] w-[10px] rounded-[3px] bg-[hsl(var(--primary))]" />
              <h3 className="mt-8 text-xl font-semibold tracking-[-0.025em]">{item.title}</h3>
              <p className="mt-3 text-[15.5px] leading-[1.55] text-[var(--one-soft)]">{item.text}</p>
            </div>
          ))}
        </div>
        <p data-reveal className="mt-8 max-w-[44rem] text-sm leading-6 text-[var(--one-muted)]">{content.platform}</p>
      </div>
    </section>
  );
}
