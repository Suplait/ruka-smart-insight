import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import questions from "@/content/acquisitionFaq.json";

export function AcquisitionFAQ() {
  const reduceMotion = useReducedMotion();
  const shouldAnimate = typeof window !== "undefined" && !reduceMotion;
  const headingId = useId();

  return (
    <motion.section
      initial={shouldAnimate ? { opacity: 0, y: 18 } : false}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-7"
      aria-labelledby={headingId}
    >
      <header className="max-w-2xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Antes de partir
        </p>
        <h2 id={headingId} className="text-3xl font-semibold tracking-[-0.035em] text-[#171827] sm:text-4xl">
          Preguntas antes de poner Ruka a trabajar.
        </h2>
      </header>

      <Accordion type="single" collapsible className="space-y-3">
        {questions.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`acquisition-faq-${index}`}
            className="rounded-2xl border border-[#dde2ed] bg-white px-5 shadow-[0_10px_35px_rgba(24,30,52,0.035)] transition-colors hover:border-primary/25"
          >
            <AccordionTrigger className="py-5 text-left text-base font-semibold leading-snug text-[#202231] hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="max-w-2xl pb-5 text-[15px] leading-7 text-[#62697a]">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
}
