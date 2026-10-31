import { Link } from "react-router-dom";
import { customerLogos } from "@/content/customerLogos";
import { oneContent } from "@/content/oneContent";

const { origin } = oneContent;

export function OneOrigin() {
  return (
    <section aria-labelledby="one-origin-title" className="border-t border-[var(--one-rule)] px-4 py-20 sm:px-8 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[84rem]">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="one-eyebrow text-[var(--one-ink-3)]">{origin.eyebrow}</p>
            <h2 id="one-origin-title" className="one-display mt-6 text-[clamp(2.4rem,4.4vw,4rem)]">{origin.title}</h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="one-pretty text-[1.1875rem] leading-[1.65] text-[var(--one-ink-2)]">{origin.copy}</p>
            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[1.0625rem]">
              {origin.links.map((link) => (
                <li key={link.href}><Link to={link.href} className="one-link">{link.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <figure className="mt-16 border-t border-[var(--one-rule)] pt-8 lg:mt-20">
          <figcaption className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <span className="one-eyebrow text-[var(--one-ink-2)]">{origin.logosLabel}</span>
            <span className="text-sm text-[var(--one-ink-3)]">{origin.logosNote}</span>
          </figcaption>
          <ul className="mt-8 grid grid-cols-3 items-center gap-x-6 gap-y-8 sm:grid-cols-6">
            {customerLogos.map((logo) => (
              <li key={logo.name} className="flex h-14 min-w-0 items-center justify-center">
                <img src={logo.image} alt={logo.name} loading="lazy" decoding="async" className={`one-logo h-auto w-auto object-contain ${logo.className} max-sm:!max-w-full`} />
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </section>
  );
}
