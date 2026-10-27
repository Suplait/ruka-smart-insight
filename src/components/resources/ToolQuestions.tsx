import { Plus } from "lucide-react";
import type { ToolFaq } from "@/content/toolGuides";

export function ToolQuestions({ faqs }: { faqs: readonly ToolFaq[] }) {
  return <section className="mt-16 grid gap-8 border-t border-[#dce2ed] pt-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16" aria-labelledby="tool-questions-title">
    <div><p className="text-sm font-medium text-[#424ec0]">Para usar bien el resultado</p><h2 id="tool-questions-title" className="mt-3 max-w-sm text-3xl font-semibold leading-tight tracking-tight">Las dudas que cambian la cuenta.</h2><p className="mt-4 max-w-sm text-base leading-7 text-[#505b70]">La fórmula importa. Los datos que eliges para alimentarla, también.</p></div>
    <div>{faqs.map(faq => <details key={faq.question} className="group border-b border-[#dce2ed] first:border-t"><summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-5 rounded py-5 text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary [&::-webkit-details-marker]:hidden">{faq.question}<Plus size={18} aria-hidden="true" className="shrink-0 text-[#505b70] transition-transform duration-150 group-open:rotate-45 motion-reduce:transition-none" /></summary><p className="max-w-2xl pb-6 pr-5 text-base leading-7 text-[#505b70]">{faq.answer}</p></details>)}</div>
  </section>;
}
