import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { oneContent, ONE_PATH } from "@/content/oneContent";

export function OneSuccess() {
  return (
    <section id="one-success" className="relative py-10 text-center sm:py-16">
      <span aria-hidden="true" className="one-success-tile mx-auto flex h-16 w-16 items-center justify-center rounded-[18px] bg-[hsl(var(--primary))] text-white shadow-[0_24px_60px_-18px_hsl(var(--primary))]">
        <Check className="h-7 w-7" />
      </span>
      <h1 className="one-display mx-auto mt-10 max-w-[12ch] text-balance text-[clamp(2.8rem,7vw,6rem)]">{oneContent.contact.successTitle}</h1>
      <p className="mx-auto mt-6 max-w-[34rem] text-pretty text-lg leading-[1.6] text-[var(--one-soft)]">{oneContent.contact.successCopy}</p>
      <Link to={ONE_PATH} className="one-ghost mt-8 justify-center">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a Ruka One
      </Link>
    </section>
  );
}
