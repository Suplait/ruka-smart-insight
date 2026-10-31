import { ArrowDown } from "lucide-react";
import { oneContent } from "@/content/oneContent";
import { OneCta } from "./OneCta";

export function OneHero() {
  const hero = oneContent.hero;
  return (
    <section data-scene="hero" aria-labelledby="one-hero-title" className="relative flex min-h-[100svh] flex-col">
      <div aria-hidden="true" className="one-shade-left pointer-events-none absolute inset-y-0 left-0 hidden w-[max(62%,calc(50vw+300px))] lg:block" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[78%] bg-[linear-gradient(180deg,rgba(3,4,10,0.94)_0%,rgba(3,4,10,0.8)_55%,rgba(3,4,10,0)_100%)] lg:hidden" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-1 flex-col px-5 pb-10 pt-[104px] sm:px-8 lg:justify-center lg:px-12 lg:pb-24 lg:pt-[68px]">
        <div aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 -z-10 hidden h-[52rem] w-[64rem] -translate-x-[18%] -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(3,4,10,0.9)_0%,rgba(3,4,10,0.72)_55%,rgba(3,4,10,0)_100%)] lg:block" />
        <p className="one-eyebrow one-fade" style={{ ["--i" as string]: 0 }}><span>{hero.eyebrowShort}<span className="hidden sm:inline">{hero.eyebrowRest}</span></span></p>
        <h1 id="one-hero-title" className="one-display mt-6 text-[clamp(2.85rem,11.4vw,4.4rem)] sm:text-[clamp(4rem,8.6vw,6rem)] lg:mt-8 lg:text-[clamp(4.6rem,6.4vw,6.7rem)]">
          {hero.titleLines.map((line, index) => (
            <span key={line} className="one-line">
              {index > 0 ? " " : null}
              <span style={{ ["--i" as string]: index }}>{line}</span>
            </span>
          ))}
        </h1>
        <p className="one-fade mt-7 max-w-[34rem] text-pretty text-[17px] leading-[1.6] text-[var(--one-soft)] sm:text-lg lg:mt-9" style={{ ["--i" as string]: 2 }}>
          {hero.lead}
        </p>
        <div className="one-fade mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 lg:mt-10" style={{ ["--i" as string]: 3 }}>
          <OneCta label={hero.primaryAction} />
          <a href={`#${oneContent.between.id}`} className="one-ghost">
            {hero.secondaryAction}
            <ArrowDown className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
        <p className="one-fade mt-5 text-sm text-[var(--one-muted)]" style={{ ["--i" as string]: 4 }}>{hero.microcopy}</p>
      </div>

      <div className="relative z-10 mx-auto hidden w-full max-w-[1360px] px-5 pb-8 sm:px-8 md:block lg:px-12">
        <ul aria-label={hero.areasLabel} className="one-fade flex flex-wrap gap-x-7 gap-y-2 border-t border-[var(--one-hair)] pt-5 text-[13px] tracking-[0.02em] text-[var(--one-muted)]" style={{ ["--i" as string]: 6 }}>
          {hero.areas.map((area) => <li key={area}>{area}</li>)}
          <li className="text-[var(--one-accent)]">{hero.areasMore}</li>
        </ul>
      </div>
    </section>
  );
}

export function OneBeaconLabel() {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--one-accent)]">{oneContent.hero.beacon.kicker}</span>
      <span className="mt-1 text-[13px] font-medium text-white">{oneContent.hero.beacon.text}</span>
    </div>
  );
}
