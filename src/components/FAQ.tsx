
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Do you offer a money-back guarantee?",
    answer: "Yes, 100% money-back guarantee in the first 30 days, no questions, no commitment, no fine print."
  },
  {
    question: "How do I create an account?",
    answer: "Schedule a meeting with our team to learn about your story and discover the best way to implement Ruka in your business."
  },
  {
    question: "How complex is the integration?",
    answer: "It's as simple as logging in. Ruka takes care of bringing in all the data."
  },
  {
    question: "Do I need to use a specific billing system? What if I use the free SII one?",
    answer: "It doesn't matter if you use a market billing system or the free SII one. In both options, we integrate quickly and easily."
  },
  {
    question: "How long does it take to see results?",
    answer: "Immediate results. From day one, you'll have access to automatic reports and analysis."
  },
  {
    question: "What support do you offer?",
    answer: "We have a dedicated support team available to help you at all times."
  },
  {
    question: "Are my data secure?",
    answer: "Absolutely. We use bank-level encryption and comply with all security standards."
  }
];

export default function FAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about Ruka.ai
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
