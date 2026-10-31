import { useEffect, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { oneContent } from "@/content/oneContent";
import type { FieldSceneName } from "@/components/one/field/fieldScenes";

const stages = oneContent.how.stages;
const before: FieldSceneName[] = ["hero", "friction", "shift"];

/**
 * Scroll band (in svh) that each beat owns while the stage is pinned. The stage
 * is pinned for `stages.length * BEAT` and the first band also covers the entry.
 */
const BEAT = 60;
/** Extra pinned scroll for the last beat, so the result can be seen before the chapter leaves. */
const HOLD = 40;

function bandFor(index: number): CSSProperties {
  const starts = stages.map((_, i) => (i === 0 ? 0 : 50 + i * BEAT));
  const top = starts[index];
  const end = index === stages.length - 1 ? 100 + stages.length * BEAT + HOLD : starts[index + 1];
  return { top: `${top}svh`, height: `${end - top}svh` };
}

/**
 * "Cómo ocurre": the field is the explanation. One region goes from scattered need to an
 * ordered solution, runs, and lifts a result. The DOM only names each beat.
 * Without JS or with reduced motion it renders as a short static chapter on the final beat.
 */
export function OneHow({ scene }: { scene: FieldSceneName }) {
  const content = oneContent.how;
  const [live, setLive] = useState(false);

  useEffect(() => {
    // Pinning relies on :has() to undo the global overflow reset (see one.css).
    const canPin = typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("selector(:has(*))");
    setLive(canPin && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const current = stages.findIndex((stage) => stage.scene === scene);
  const active = current >= 0 ? current : before.includes(scene) ? 0 : stages.length - 1;

  return (
    <section
      id={content.id}
      aria-labelledby="one-how-title"
      className={cn("one-how relative scroll-mt-20", live && "is-live")}
      style={{ ["--how-pin" as string]: `${stages.length * BEAT + HOLD}svh` }}
    >
      {/* Scroll bands: each one drives a beat of the field. Static mode holds the last beat. */}
      <div aria-hidden="true" className="one-how__beats">
        {stages.map((stage, index) => (
          <div
            key={stage.scene}
            data-scene={live ? stage.scene : "how-result"}
            className="one-how__beat"
            style={live ? bandFor(index) : { top: `${index * 25}%`, height: "25%" }}
          />
        ))}
      </div>

      <div className="one-how__stage">
        <div aria-hidden="true" className="one-shade-left pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] lg:block" />
        <div aria-hidden="true" className="one-how__shade-top pointer-events-none absolute inset-x-0 top-0 h-[42%] lg:hidden" />
        <div aria-hidden="true" className="one-how__shade-bottom pointer-events-none absolute inset-x-0 bottom-0 h-[40%] lg:hidden" />

        <div className="one-how__frame relative mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-12">
          <div className="max-w-[34rem]">
            <p className="one-eyebrow" data-reveal>{content.eyebrow}</p>
            <h2 id="one-how-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-5 text-balance text-[clamp(2.1rem,8.6vw,2.8rem)] font-semibold leading-[0.98] tracking-[-0.046em] sm:text-[clamp(2.6rem,5vw,4.3rem)] lg:mt-6">
              {content.title}
            </h2>
          </div>

          <div className="one-how__rail">
            <div aria-hidden="true" className="one-how__ticks">
              {stages.map((stage, index) => (
                <span key={stage.scene} className={cn("one-how__mark", `one-how__mark--${index}`, index === active && "is-active", index < active && "is-past")} />
              ))}
            </div>
            <ol className="one-how__list">
              {stages.map((stage, index) => {
                const state = index === active ? "active" : index < active ? "past" : "next";
                return (
                  <li key={stage.scene} className="one-how__item" data-state={state} aria-current={live && index === active ? "step" : undefined}>
                    <span aria-hidden="true" className={cn("one-how__mark", `one-how__mark--${index}`)} />
                    <div>
                      <h3 className="one-how__label">
                        <span className="one-how__num">0{index + 1}</span>
                        {stage.label}
                      </h3>
                      <div className="one-how__reveal">
                        <p className="one-how__text">{stage.text}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
