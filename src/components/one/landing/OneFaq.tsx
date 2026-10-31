import { oneContent } from "@/content/oneContent";

const { faq } = oneContent;

export function OneFaq() {
  return (
    <section id="preguntas" aria-labelledby="one-faq-title" className="one-faq scroll-mt-20 border-t border-[var(--one-rule)] bg-[var(--one-paper-2)] px-4 py-20 sm:px-8 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-[84rem] gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p className="one-eyebrow text-[var(--one-ink-3)]">{faq.eyebrow}</p>
            <h2 id="one-faq-title" className="one-display mt-6 text-[clamp(2.4rem,4vw,3.75rem)]">{faq.title}</h2>
          </div>
        </div>
        <div className="border-t border-[var(--one-ink)] lg:col-span-8">
          {faq.items.map((item) => (
            <details key={item.question} className="group border-b border-[var(--one-rule)]">
              <summary className="flex items-start justify-between gap-6 py-6 sm:py-7">
                <h3 className="one-serif text-[clamp(1.45rem,2.2vw,1.9rem)] leading-[1.2]">{item.question}</h3>
                <span aria-hidden="true" className="one-faq__mark mt-1 shrink-0 text-[1.75rem] font-light leading-none text-[var(--one-ink-2)]">+</span>
              </summary>
              <p className="one-pretty max-w-2xl pb-8 text-[1.0625rem] leading-[1.7] text-[var(--one-ink-2)]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
