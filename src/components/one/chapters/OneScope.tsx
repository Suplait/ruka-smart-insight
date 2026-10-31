import { oneContent } from "@/content/oneContent";

const position: Record<string, string> = {
  start: "lg:col-start-1 lg:row-start-2 lg:self-center lg:text-right",
  end: "lg:col-start-3 lg:row-start-2 lg:self-center",
  top: "lg:col-start-2 lg:row-start-1 lg:text-center lg:mx-auto",
  bottom: "lg:col-start-2 lg:row-start-3 lg:text-center lg:mx-auto",
};

export function OneScope() {
  const content = oneContent.scope;
  return (
    <section id={content.id} data-scene="scope" aria-labelledby="one-scope-title" className="relative scroll-mt-20 py-28 sm:py-36 lg:py-44">
      <div aria-hidden="true" className="one-shade-mask pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_45%,rgba(3,4,10,0.15)_0%,rgba(3,4,10,0.8)_100%)]" />
      <div className="relative mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[48rem] text-center">
          <p className="one-eyebrow" data-reveal>{content.eyebrow}</p>
          <h2 id="one-scope-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-6 text-balance text-[clamp(2.3rem,5.4vw,4.8rem)] font-semibold leading-[0.96] tracking-[-0.05em]">
            {content.title}
          </h2>
          <p data-reveal style={{ ["--d" as string]: 2 }} className="mx-auto mt-7 max-w-[38rem] text-pretty text-lg leading-[1.6] text-[var(--one-soft)]">
            {content.lead}
          </p>
        </div>

        {/* The perimeter: four edges, each one a written agreement. */}
        <div data-reveal className="relative mt-16 grid gap-4 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] lg:grid-rows-[auto_minmax(260px,auto)_auto] lg:gap-8">
          <div aria-hidden="true" data-one-perimeter className="relative hidden lg:col-start-2 lg:row-start-2 lg:block">
            <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
              <rect className="one-frame-rect" x="0" y="0" width="100" height="100" rx="3" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" vectorEffect="non-scaling-stroke" pathLength={1} />
            </svg>
            {[
              "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
              "right-0 top-0 translate-x-1/2 -translate-y-1/2",
              "left-0 bottom-0 -translate-x-1/2 translate-y-1/2",
              "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
            ].map((corner) => (
              <span key={corner} className={`absolute h-[9px] w-[9px] rounded-[2px] bg-white ${corner}`} />
            ))}
          </div>
          {content.edges.map((edge) => (
            <div key={edge.side} className={`max-w-[22rem] rounded-2xl border border-[var(--one-hair)] bg-[rgba(7,10,22,0.82)] p-5 lg:border-0 lg:bg-transparent lg:p-0 ${position[edge.side]}`}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">{edge.label}</h3>
              <p className="mt-2 text-[16px] leading-[1.55] text-[var(--one-soft)]">{edge.text}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-20 grid max-w-[60rem] gap-6 border-t border-[var(--one-hair)] pt-10 lg:mt-28 lg:grid-cols-[1fr_1.4fr] lg:gap-12">
          <h3 data-reveal className="text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-tight tracking-[-0.035em]">{content.implementation.title}</h3>
          <p data-reveal style={{ ["--d" as string]: 1 }} className="text-pretty text-lg leading-[1.6] text-[var(--one-soft)]">{content.implementation.copy}</p>
        </div>
      </div>
    </section>
  );
}
