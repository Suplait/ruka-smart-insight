
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "¿Ofrecen garantía de devolución?",
    answer: "Sí, garantía de devolución 100% en los primeros 30 días, sin preguntas, sin compromiso, ni letra chica."
  },
  {
    question: "¿Cómo me creo una cuenta?",
    answer: "Agenda un espacio con nuestro equipo para conocer tu historia y descubrir la mejor manera de implementar Ruka en tu negocio."
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
    <section className="py-32 bg-[#f4f5f9] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white via-white/70 to-transparent" />
        <div className="absolute bottom-10 right-[12%] h-44 w-44 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.12),transparent_70%)] blur-[100px]" />
      </div>
      <div className="max-w-4xl mx-auto px-6 sm:px-8">
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-4xl lg:text-6xl font-thin text-gray-900 tracking-tight">
            Preguntas{" "}
            <span className="font-light bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              Frecuentes
            </span>
          </h2>
          <p className="text-xl text-gray-600 font-light">
            Todo lo que necesitas saber sobre Ruka.ai
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="bg-white/60 backdrop-blur-xl rounded-2xl border border-gray-200/50 px-6 data-[state=open]:bg-white/80 transition-all duration-300">
              <AccordionTrigger className="text-left text-lg font-medium text-gray-900 hover:text-primary transition-colors py-6 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 font-light pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
