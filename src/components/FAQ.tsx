
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

export default function FAQ() {
  const { t, i18n } = useTranslation();
  
  // FAQ items in both languages
  const faqItems = {
    es: [
      {
        question: "¿Cómo funciona Ruka.ai?",
        answer: "Ruka utiliza inteligencia artificial para automatizar el procesamiento de tus facturas de proveedores. Simplemente sube tus documentos y Ruka se encarga de extraer toda la información importante, organizarla y presentártela de forma clara y útil.",
      },
      {
        question: "¿Qué tipos de documentos puede procesar?",
        answer: "Ruka puede procesar facturas electrónicas (DTE) directamente desde el SII, facturas en PDF, imágenes de facturas (JPG, PNG), y facturas escaneadas. Nuestro sistema puede extraer datos de casi cualquier formato de factura.",
      },
      {
        question: "¿Cuánto tiempo toma implementar Ruka en mi negocio?",
        answer: "La implementación de Ruka es muy rápida, generalmente entre 1 y 2 días. No requiere instalación de software y la integración con tus sistemas existentes es simple y directa.",
      },
      {
        question: "¿Es seguro compartir mis datos financieros con Ruka?",
        answer: "Absolutamente. En Ruka utilizamos encriptación de nivel bancario para proteger todos tus datos. Cumplimos con todas las normativas de seguridad y privacidad, y nunca compartimos tu información con terceros sin tu consentimiento explícito.",
      },
      {
        question: "¿Puedo probar Ruka antes de comprometerme?",
        answer: "Sí, ofrecemos una prueba gratuita de 14 días para que puedas evaluar cómo Ruka puede ayudar a tu negocio. No necesitas tarjeta de crédito para comenzar.",
      },
      {
        question: "¿Ruka reemplaza a mi software contable?",
        answer: "No, Ruka complementa tu software contable existente. Nos integramos con la mayoría de los sistemas contables populares para que puedas seguir usando las herramientas que ya conoces, pero con datos más precisos y actualizados.",
      },
    ],
    en: [
      {
        question: "How does Ruka.ai work?",
        answer: "Ruka uses artificial intelligence to automate the processing of your supplier invoices. Simply upload your documents, and Ruka extracts all the important information, organizes it, and presents it to you in a clear and useful way.",
      },
      {
        question: "What types of documents can it process?",
        answer: "Ruka can process electronic invoices (DTE) directly from SII, PDF invoices, invoice images (JPG, PNG), and scanned invoices. Our system can extract data from almost any invoice format.",
      },
      {
        question: "How long does it take to implement Ruka in my business?",
        answer: "Implementing Ruka is very quick, usually between 1 and 2 days. It requires no software installation, and integration with your existing systems is simple and straightforward.",
      },
      {
        question: "Is it safe to share my financial data with Ruka?",
        answer: "Absolutely. At Ruka, we use bank-level encryption to protect all your data. We comply with all security and privacy regulations, and we never share your information with third parties without your explicit consent.",
      },
      {
        question: "Can I try Ruka before committing?",
        answer: "Yes, we offer a 14-day free trial so you can evaluate how Ruka can help your business. No credit card required to start.",
      },
      {
        question: "Does Ruka replace my accounting software?",
        answer: "No, Ruka complements your existing accounting software. We integrate with most popular accounting systems so you can continue using the tools you already know, but with more accurate and up-to-date data.",
      },
    ]
  };

  // Determine which FAQ items to show based on current language
  const currentFaqItems = i18n.language.startsWith('en') ? faqItems.en : faqItems.es;

  return (
    <section id="faq" className="py-16">
      <div className="container px-4 sm:px-6">
        <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {currentFaqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
