import { useRef } from "react";
import { oneContent } from "@/content/oneContent";
import { useScrollProgress } from "./useOneMotion";

export function OneTrust() {
  const content = oneContent.trust;
  const titleRef = useRef<HTMLHeadingElement>(null);
  const progress = useScrollProgress(titleRef);
  const words = content.title.split(" ");

  return (
    <section id={content.id} data-scene="trust" aria-labelledby="one-trust-title" className="relative scroll-mt-20 py-28 sm:py-36 lg:py-48">
      <div aria-hidden="true" className="one-shade-center pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        <p className="one-eyebrow" data-reveal>{content.eyebrow}</p>
        <h2 ref={titleRef} id="one-trust-title" className="mt-6 max-w-[62rem] text-balance text-[clamp(2.4rem,6vw,5.6rem)] font-semibold leading-[0.95] tracking-[-0.052em]">
          {words.map((word, index) => {
            const lit = progress * (words.length + 3) - index;
            const alpha = Math.max(0.16, Math.min(1, lit));
            return (
              <span key={`${word}-${index}`} className="one-word" style={{ color: `rgba(241,243,250,${alpha.toFixed(3)})` }}>
                {word}{index < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </h2>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-[var(--one-hair)] bg-[var(--one-hair)] sm:grid-cols-2 lg:mt-24 lg:grid-cols-4">
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
