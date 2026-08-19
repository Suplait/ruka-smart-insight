import { ArrowLeft, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { worksContent, WORKS_PATH } from "@/content/worksContent";

export function WorksSuccess() {
  return (
    <section id="works-success" className="rounded-2xl border border-[#d9def7] bg-white p-7 sm:p-10">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5369eb] text-white"><Check className="h-5 w-5" /></span>
      <h1 className="mt-7 max-w-2xl text-balance text-[clamp(2.4rem,5vw,4.6rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-[#171827]">{worksContent.contact.successTitle}</h1>
      <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-[#676e80] sm:text-lg sm:leading-8">{worksContent.contact.successCopy}</p>
      <Link to={WORKS_PATH} className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#5369eb] transition hover:text-[#4056d5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5369eb] focus-visible:ring-offset-4"><ArrowLeft className="h-4 w-4" /> Volver a Ruka Works</Link>
    </section>
  );
}
