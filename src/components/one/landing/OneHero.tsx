import { useState } from "react";
import { ONE_CONTACT_PATH, oneContent } from "@/content/oneContent";
import { OneCta } from "./OneCta";

const { hero, line } = oneContent;

/** The central idea: work crosses the line to Ruka One; decisions stay with the team. */
function ResponsibilityLine() {
  const [run, setRun] = useState(0);
  let moved = 0;
  let kept = 0;

  return (
    <figure className="relative">
      <figcaption className="sr-only">{line.label}</figcaption>
      <div className="grid grid-cols-2 border-b border-[var(--one-rule)] pb-3">
        <p className="one-eyebrow pr-4 text-right text-[var(--one-ink-3)]">{line.team}</p>
        <p className="one-eyebrow pl-4 text-[var(--one-ink)]">{line.one}</p>
      </div>
      <div key={run} className="one-line pt-4 pb-2">
        <span aria-hidden="true" className="one-line__rail" />
        <ul>
          {line.rows.map((row) => {
            const index = row.stays ? kept++ : moved++;
            return (
              <li key={row.text} className="one-line__row" style={{ "--i": row.stays ? index * 3 + 1 : index } as React.CSSProperties}>
                {row.stays ? (
                  <span className="one-line__keep"><span className="sr-only">{line.team}: </span>{row.text}</span>
                ) : (
                  <span className="one-line__word"><span className="sr-only">{line.one}: </span>{row.text}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex items-start justify-between gap-6 border-t border-[var(--one-rule)] pt-4">
        <p className="max-w-[22rem] text-sm leading-6 text-[var(--one-ink-2)]">{line.caption}</p>
        <button
          type="button"
          onClick={() => setRun((value) => value + 1)}
          className="shrink-0 text-sm text-[var(--one-ink-3)] underline decoration-[var(--one-rule)] underline-offset-4 transition-colors hover:text-[var(--one-ink)] motion-reduce:hidden"
        >
          {line.replay}
        </button>
      </div>
    </figure>
  );
}

export function OneHero() {
  return (
    <section aria-labelledby="one-title" className="px-4 pb-20 pt-8 sm:px-8 sm:pt-12 lg:px-10 lg:pb-28 lg:pt-12">
      <div className="mx-auto max-w-[84rem]">
        <p className="one-eyebrow flex items-center gap-3 text-[var(--one-ink-2)]">
          <span aria-hidden="true" className="inline-block h-[2px] w-8 bg-[var(--one-primary)]" />
          {hero.eyebrow}
        </p>
        <h1 id="one-title" className="one-display mt-6 text-[clamp(3.1rem,7.6vw,7.5rem)] sm:mt-7">
          <span className="block">{hero.titleLead}</span>{" "}
          <span className="block italic">{hero.titleEmphasis}</span>
        </h1>

        <div className="mt-10 grid gap-14 lg:mt-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20 xl:gap-28">
          <div className="flex flex-col gap-10">
            <p className="one-pretty max-w-[34rem] text-[1.1875rem] leading-[1.6] text-[var(--one-ink-2)] sm:text-[1.3125rem]">
              {hero.lead}
            </p>
            <div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
                <OneCta to={ONE_CONTACT_PATH} block>{hero.primaryAction}</OneCta>
                <a href="#como-funciona" className="one-link self-start text-[1.0625rem] text-[var(--one-ink)] sm:self-auto">
                  {hero.secondaryAction}
                </a>
              </div>
              <p className="mt-4 text-sm text-[var(--one-ink-3)]">{hero.microcopy}</p>
            </div>
          </div>
          <ResponsibilityLine />
        </div>
      </div>
    </section>
  );
}
