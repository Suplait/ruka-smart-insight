import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Ofrecen prueba gratuita?",
    answer: "Sí, 15 días gratis, sin tarjeta de crédito, sin compromiso, ni letra chica."
  },
  {
    question: "¿Cómo me creo una cuenta?",
    answer: "Agenda un demo con nuestro equipo para conocer tu historia y descubrir la mejor manera de implementar Ruka en tu negocio :)"
  },
  {
    question: "¿Qué tan compleja es la integración?",
    answer: "Es tan simple como iniciar sesión. Ruka se encarga de traer todos los datos."
  },
  {
    question: "¿Debo usar un facturador en particular? ¿Y si uso el del SII gratuito?",
    answer: "No importa si usas facturador de mercado o el gratuito del SII. En ambas opciones nos integramos rápido y fácil."
  },
  {
    question: "¿Cuánto tiempo toma ver resultados?",
    answer: "Resultados inmediatos. Desde el primer día tendrás acceso a reportes y análisis automáticos."
  },
  {
    question: "¿Qué soporte ofrecen?",
    answer: "Contamos con un equipo dedicado de soporte disponible para ayudarte en todo momento."
  },
  {
    question: "¿Mis datos están seguros?",
    answer: "Absolutamente. Utilizamos encriptación de nivel bancario y cumplimos con todos los estándares de seguridad."
  }
];

export default function FAQ() {
  return (
    <section className="py-24 bg-white">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-xl text-muted-foreground">
            Todo lo que necesitas saber sobre Ruka.ai
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