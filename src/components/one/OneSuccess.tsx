import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { oneContent, ONE_PATH } from "@/content/oneContent";

export function OneSuccess() {
  return (
    <section id="one-success" className="pt-6">
      <span aria-hidden="true" className="block h-[3px] w-24 bg-[var(--one-primary)]" />
      <h1 className="one-display mt-8 max-w-3xl text-[clamp(3rem,6.4vw,6rem)]">{oneContent.contact.successTitle}</h1>
      <p className="one-pretty mt-8 max-w-2xl text-[1.1875rem] leading-[1.6] text-[var(--one-ink-2)] sm:text-[1.3125rem]">{oneContent.contact.successCopy}</p>
      <Link to={ONE_PATH} className="mt-10 inline-flex items-center gap-2 text-[1.0625rem] text-[var(--one-ink)] underline decoration-[var(--one-rule)] underline-offset-4 transition-colors hover:decoration-[var(--one-ink)]"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Ruka One</Link>
    </section>
  );
}
