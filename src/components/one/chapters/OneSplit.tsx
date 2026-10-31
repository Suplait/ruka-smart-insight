import { oneContent } from "@/content/oneContent";

export function OneSplit() {
  const content = oneContent.split;
  return (
    <section id={content.id} data-scene="decide" aria-labelledby="one-split-title" className="relative scroll-mt-20 py-28 sm:py-36 lg:py-48">
      <div aria-hidden="true" className="one-shade-left pointer-events-none absolute inset-0 hidden lg:block" />
      <div aria-hidden="true" className="one-shade-mask pointer-events-none absolute inset-0 bg-[rgba(3,4,10,0.72)] lg:hidden" />
      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[44rem]">
          <p className="one-eyebrow" data-reveal>{content.eyebrow}</p>
          <h2 id="one-split-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-6 text-balance text-[clamp(2.3rem,5vw,4.5rem)] font-semibold leading-[0.97] tracking-[-0.048em]">
            {content.title}
          </h2>
        </div>

        <div className="mt-16 grid gap-14 lg:mt-20 lg:max-w-[52rem] lg:grid-cols-2 lg:gap-12">
          <div data-reveal>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--one-accent)]">{content.ours.label}</h3>
            <ul className="mt-6">
              {content.ours.items.map((item) => (
                <li key={item} className="flex gap-4 border-t border-[var(--one-hair)] py-4 text-[17px] leading-snug text-[var(--one-soft)]">
                  <span aria-hidden="true" className="mt-[7px] h-[7px] w-[7px] flex-none rounded-[2px] bg-[hsl(var(--primary))]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={{ ["--d" as string]: 2 }}>
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">{content.yours.label}</h3>
            <ul className="mt-6">
              {content.yours.items.map((item) => (
                <li key={item} className="flex gap-4 border-t border-[var(--one-hair-strong)] py-4 text-xl font-medium leading-snug tracking-[-0.02em] text-white">
                  <span aria-hidden="true" className="mt-[6px] h-[11px] w-[11px] flex-none -translate-y-[3px] rounded-[3px] bg-white shadow-[0_6px_14px_-4px_rgba(160,175,255,0.9)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p data-reveal className="mt-14 max-w-[44rem] text-pretty border-l-2 border-[hsl(var(--primary))] pl-5 text-lg leading-[1.6] text-[var(--one-soft)]">
          {content.how}
        </p>
      </div>
    </section>
  );
}
