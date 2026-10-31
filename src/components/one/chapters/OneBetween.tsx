import { useRef } from "react";
import { cn } from "@/lib/utils";
import { oneContent } from "@/content/oneContent";
import { useReadingIndex } from "./useOneMotion";

export function OneBetween() {
  const content = oneContent.between;
  const listRef = useRef<HTMLOListElement>(null);
  const active = useReadingIndex(listRef, "li");

  return (
    <section id={content.id} data-scene="friction" aria-labelledby="one-between-title" className="relative scroll-mt-20 py-28 sm:py-36 lg:py-48">
      <div aria-hidden="true" className="one-shade-left pointer-events-none absolute inset-0 hidden lg:block" />
      <div aria-hidden="true" className="one-shade-center pointer-events-none absolute inset-0 lg:hidden" />
      <div className="relative mx-auto grid max-w-[1360px] gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-6">
          <p className="one-eyebrow" data-reveal>{content.eyebrow}</p>
          <h2 id="one-between-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-6 text-balance text-[clamp(2.2rem,5vw,4.3rem)] font-semibold leading-[0.98] tracking-[-0.045em]">
            {content.title}
          </h2>
        </div>
        <ol ref={listRef} className="flex flex-col gap-3 lg:col-span-6 lg:col-start-7 lg:pt-40">
          {content.fragments.map((fragment, index) => (
            <li
              key={fragment}
              className={cn(
                "one-fragment text-[clamp(1.6rem,3.4vw,2.9rem)] font-medium leading-[1.15] tracking-[-0.035em]",
                active === index && "is-active",
              )}
            >
              {fragment}
            </li>
          ))}
        </ol>
        <p data-reveal className="max-w-[40rem] text-pretty text-lg leading-[1.6] text-[var(--one-soft)] lg:col-span-6 lg:col-start-7 lg:text-xl">
          {content.close}
        </p>
      </div>
    </section>
  );
}
