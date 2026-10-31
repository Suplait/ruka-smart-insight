import { ONE_CONTACT_PATH, oneContent } from "@/content/oneContent";
import { OneCta } from "./OneCta";

const { closing } = oneContent;

export function OneClosing() {
  return (
    <section aria-labelledby="one-closing-title" className="one-night relative overflow-hidden px-4 py-24 sm:px-8 lg:px-10 lg:py-36">
      <span aria-hidden="true" className="absolute bottom-0 left-1/2 top-0 hidden w-[2px] bg-[var(--one-primary)] opacity-60 lg:block" />
      <div className="relative mx-auto grid max-w-[84rem] gap-14 lg:grid-cols-2 lg:gap-24">
        <div>
          <h2 id="one-closing-title" className="one-display text-[clamp(2.9rem,6.2vw,6rem)]">{closing.title}</h2>
        </div>
        <div className="flex flex-col justify-end lg:pl-6">
          <p className="one-pretty text-[1.1875rem] leading-[1.65] text-[var(--one-bone-2)] sm:text-[1.3125rem]">{closing.copy}</p>
          <div className="mt-10">
            <OneCta to={ONE_CONTACT_PATH} block>{closing.action}</OneCta>
            <p className="mt-4 text-sm text-[var(--one-bone-2)]">{closing.microcopy}</p>
          </div>
          <div className="mt-14 border-t border-[var(--one-night-rule)] pt-6">
            <h3 className="one-eyebrow text-[var(--one-bone-2)]">{closing.fitTitle}</h3>
            <ul className="mt-5 space-y-3 text-[1.0625rem] leading-[1.5]">
              {closing.fit.map((item) => (
                <li key={item} className="flex gap-4">
                  <span aria-hidden="true" className="mt-[0.7em] h-[2px] w-4 shrink-0 bg-[var(--one-primary-on-night)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
