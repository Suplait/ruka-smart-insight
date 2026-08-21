import { Quote } from "lucide-react";
import { oneContent } from "@/content/oneContent";

export function OneTestimonial() {
  return (
    <section id="testimonio" className="border-y border-[#e1e4ea] bg-white px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[180px_1fr] lg:items-start lg:gap-14">
        <div className="flex items-center gap-4 lg:block">
          <img src="/customer-logos/03-barbazul.webp" alt="Barbazul" loading="lazy" className="max-h-14 w-auto max-w-[7.5rem] object-contain" />
          <Quote className="h-5 w-5 text-[#5369eb] lg:mt-8" aria-hidden="true" />
        </div>
        <blockquote>
          <p className="max-w-5xl text-balance text-[30px] font-medium leading-[1.22] tracking-[-0.025em] text-[#222432] sm:text-[38px] lg:text-[42px]">“{oneContent.testimonial.quote}”</p>
          <footer className="mt-7 text-sm">
            <strong className="font-semibold text-[#292b39]">{oneContent.testimonial.author}</strong>
            <span className="ml-2 text-[#6f7686]">{oneContent.testimonial.role}</span>
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
