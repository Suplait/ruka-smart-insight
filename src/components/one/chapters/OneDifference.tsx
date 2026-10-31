import { cn } from "@/lib/utils";
import { oneContent } from "@/content/oneContent";

export function OneDifference() {
  const content = oneContent.difference;
  return (
    <section id={content.id} data-scene="shift" aria-labelledby="one-difference-title" className="relative scroll-mt-20 py-28 sm:py-36 lg:py-44">
      <div aria-hidden="true" className="one-shade-mask pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(3,4,10,0)_0%,rgba(3,4,10,0.82)_22%,rgba(3,4,10,0.82)_78%,rgba(3,4,10,0)_100%)]" />
      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[56rem]">
          <p className="one-eyebrow" data-reveal>{content.eyebrow}</p>
          <h2 id="one-difference-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-6 text-balance text-[clamp(2.3rem,5.6vw,5rem)] font-semibold leading-[0.96] tracking-[-0.05em]">
            {content.title}
          </h2>
          <p data-reveal style={{ ["--d" as string]: 2 }} className="mt-7 max-w-[40rem] text-pretty text-lg leading-[1.6] text-[var(--one-soft)]">
            {content.lead}
          </p>
        </div>

        <div className="mt-16 lg:mt-24" role="table" aria-label={content.label}>
          <div role="row" className="hidden grid-cols-12 gap-6 pb-5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--one-muted)] md:grid">
            <span role="columnheader" className="col-span-6"><span className="sr-only">Pregunta</span></span>
            <span role="columnheader" className="col-span-3">{content.columns[0]}</span>
            <span role="columnheader" className="col-span-3 text-[var(--one-accent)]">{content.columns[1]}</span>
          </div>
          {content.rows.map((row, index) => {
            // The last row is the outcome: its marker rises like a finished tile.
            const outcome = index === content.rows.length - 1;
            return (
              <div
                key={row.question}
                role="row"
                data-reveal
                style={{ ["--d" as string]: index }}
                className={cn("one-ledger-row grid grid-cols-2 gap-x-6 gap-y-3 py-6 md:grid-cols-12 md:items-baseline md:py-8", outcome && "one-ledger-row--outcome")}
              >
                <span role="rowheader" className="col-span-2 text-[clamp(1.25rem,2.4vw,2rem)] font-medium leading-tight tracking-[-0.03em] md:col-span-6">
                  {row.question}
                </span>
                <span role="cell" className="text-[15px] text-[var(--one-muted)] md:col-span-3 md:text-xl">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6f7690] md:hidden">{content.columns[0]}</span>
                  {row.software}
                </span>
                <span role="cell" className="text-[15px] font-semibold text-white md:col-span-3 md:text-xl">
                  <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--one-accent)] md:hidden">{content.columns[1]}</span>
                  <span className="one-ledger-cell-one ml-[18px] inline-block md:ml-0">{row.one}</span>
                </span>
              </div>
            );
          })}
          <p data-reveal className="border-t border-[var(--one-hair)] pt-8 text-balance text-[clamp(1.35rem,2.6vw,2.1rem)] font-semibold leading-[1.15] tracking-[-0.035em] text-white md:pt-10">{content.note}</p>
        </div>
      </div>
    </section>
  );
}
