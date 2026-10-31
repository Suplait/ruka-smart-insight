import { oneContent } from "@/content/oneContent";
import { cn } from "@/lib/utils";
import { useOneInView } from "./useOneInView";

const { between } = oneContent;

function Task({ text, index }: { text: string; index: number }) {
  const { ref, seen } = useOneInView<HTMLLIElement>("0px 0px -38% 0px");
  return (
    <li ref={ref} className={cn("grid grid-cols-[2.5rem_1fr] items-baseline border-b border-[var(--one-rule)] py-4 sm:grid-cols-[4rem_1fr] sm:py-5", seen && "is-struck")}>
      <span aria-hidden="true" className="text-sm tabular-nums text-[var(--one-ink-3)]">{String(index + 1).padStart(2, "0")}</span>
      <span className="one-serif text-[clamp(1.6rem,3.4vw,3rem)] leading-[1.12]">
        <span className="one-strike">{text}</span>
      </span>
    </li>
  );
}

export function OneBetween() {
  return (
    <section aria-labelledby="one-between-title" className="px-4 py-20 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-[84rem] gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="one-eyebrow text-[var(--one-ink-3)]">{between.eyebrow}</p>
            <h2 id="one-between-title" className="mt-6 text-[clamp(1.6rem,2.4vw,2.1rem)] font-medium leading-[1.2] tracking-[-0.02em] text-balance">
              {between.title}
            </h2>
          </div>
        </div>
        <div className="lg:col-span-8">
          <ol className="border-t border-[var(--one-rule)]" aria-label="Trabajo que hoy hace alguien de tu equipo">
            {between.tasks.map((task, index) => <Task key={task} text={task} index={index} />)}
          </ol>
          <p className="one-pretty mt-12 max-w-2xl text-[1.1875rem] leading-[1.65] text-[var(--one-ink-2)]">{between.cost}</p>
          <p className="one-serif mt-8 text-[clamp(2rem,4vw,3.25rem)] italic leading-[1.05]">
            <span className="border-b-2 border-[var(--one-primary)]">{between.turn}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
