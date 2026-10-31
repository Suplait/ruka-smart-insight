import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { oneContent } from "@/content/oneContent";
import { OneLogo } from "./OneHeader";
import { OneCta } from "./OneCta";

export function OneFaq() {
  const content = oneContent.faq;
  return (
    <section id={content.id} data-scene="rest" aria-labelledby="one-faq-title" className="relative scroll-mt-20 py-28 sm:py-36">
      <div aria-hidden="true" className="one-shade-mask pointer-events-none absolute inset-0 bg-[rgba(3,4,10,0.55)]" />
      <div className="relative mx-auto grid max-w-[1360px] gap-12 px-5 sm:px-8 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-4">
          <p className="one-eyebrow" data-reveal>{content.eyebrow}</p>
          <h2 id="one-faq-title" data-reveal style={{ ["--d" as string]: 1 }} className="mt-6 text-balance text-[clamp(2rem,3.6vw,3.2rem)] font-semibold leading-[1] tracking-[-0.045em]">
            {content.title}
          </h2>
        </div>
        <div className="lg:col-span-8">
          {content.items.map((item) => (
            <details key={item.question} className="one-faq group border-t border-[var(--one-hair)] last:border-b">
              <summary className="flex min-h-[64px] items-center justify-between gap-6 py-5 text-left text-[clamp(1.1rem,1.8vw,1.4rem)] font-medium tracking-[-0.02em] text-white">
                {item.question}
                <span aria-hidden="true" className="one-faq-icon flex h-9 w-9 flex-none items-center justify-center rounded-full border border-[var(--one-hair-strong)] text-[var(--one-soft)] group-hover:border-white/40">
                  <Plus className="h-4 w-4" />
                </span>
              </summary>
              <p className="max-w-[44rem] pb-7 pr-12 text-[16.5px] leading-[1.65] text-[var(--one-soft)]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OneFinal() {
  const content = oneContent.finalCta;
  return (
    <section id={content.id} data-scene="close" aria-labelledby="one-final-title" className="relative flex min-h-[92svh] scroll-mt-20 items-center py-28">
      <div aria-hidden="true" className="one-shade-center pointer-events-none absolute inset-0" />
      <div className="relative mx-auto w-full max-w-[1360px] px-5 text-center sm:px-8 lg:px-12">
        <h2 id="one-final-title" data-reveal className="one-display mx-auto max-w-[14ch] text-balance text-[clamp(2.8rem,8vw,7.4rem)]">
          {content.title}
        </h2>
        <p data-reveal style={{ ["--d" as string]: 1 }} className="mx-auto mt-8 max-w-[36rem] text-pretty text-lg leading-[1.6] text-[var(--one-soft)]">
          {content.copy}
        </p>
        <div data-reveal style={{ ["--d" as string]: 2 }} className="mt-10 flex flex-col items-center gap-4">
          <OneCta label={content.action} size="lg" />
          <p className="rounded-full bg-[rgba(3,4,10,0.7)] px-3 py-1 text-sm text-[var(--one-soft)]">{content.microcopy}</p>
        </div>
      </div>
    </section>
  );
}

export function OneFooter() {
  return (
    <footer className="relative z-10 border-t border-[var(--one-hair)] bg-[var(--one-void)]">
      <div className="mx-auto flex max-w-[1360px] flex-col gap-8 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
        <OneLogo />
        <nav aria-label="Enlaces de Ruka" className="flex flex-wrap gap-x-7 gap-y-3 text-sm text-[var(--one-muted)]">
          <Link to="/" className="hover:text-white">Ruka</Link>
          <Link to="/recursos" className="hover:text-white">Recursos</Link>
          <Link to="/seguridad" className="hover:text-white">Seguridad</Link>
          <Link to="/privacy" className="hover:text-white">Privacidad</Link>
          <Link to="/terms" className="hover:text-white">Términos</Link>
        </nav>
        <p className="text-sm text-[var(--one-muted)]">© {new Date().getFullYear()} Ruka.ai</p>
      </div>
    </footer>
  );
}
