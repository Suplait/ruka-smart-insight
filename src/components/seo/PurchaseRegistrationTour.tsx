import { CheckCircle2, ClipboardCheck, FileText, ShieldCheck, TriangleAlert } from "lucide-react";
import { ProductGuidedTour, type ProductGuidedTourStep } from "@/components/seo/ProductGuidedTour";

const steps = [
  {
    label: "Factura recibida", title: "Todas las facturas, en una sola bandeja.",
    description: "Ruka reúne las compras y muestra de inmediato cuáles están listas y cuáles necesitan algo de tu equipo.",
    outcome: "Ya no tienes que buscar la factura antes de empezar a trabajarla.",
    focus: { label: "Estado de cada factura", copy: "Distingue en segundos qué llegó, qué falta y qué fue rechazado." },
    image: "/assets/registro-compras/facturas-en-bandeja.png", alt: "Bandeja de facturas de compra de Ruka con facturas procesadas y pendientes de confirmación", Icon: FileText,
  },
  {
    label: "Recepción pendiente", title: "Antes de pagar, confirma qué llegó.",
    description: "Desde la misma factura, tu equipo confirma la mercadería o registra una recepción con observaciones.",
    outcome: "La factura queda conectada con lo que realmente recibió la bodega.",
    focus: { label: "Registrar recepción", copy: "Confirma que llegó todo o deja anotado lo que faltó." },
    image: "/assets/registro-compras/factura-pendiente-recepcion.png", alt: "Factura electrónica de Ruka con una recepción pendiente y la acción Registrar recepción", Icon: ClipboardCheck,
  },
  {
    label: "Decisión de recepción", title: "¿Llegó todo o hay una diferencia?",
    description: "El equipo marca una recepción correcta o incompleta y la factura sigue el camino adecuado.",
    outcome: "El faltante no se pierde en un mensaje o en otra planilla.",
    focus: { label: "Tipo de recepción", copy: "Indica si llegó lo esperado o si hay algo que resolver." },
    image: "/assets/registro-compras/seleccion-recepcion.png", alt: "Modal de recepción de una factura con opciones de recepción correcta o recepción incorrecta", Icon: CheckCircle2,
  },
  {
    label: "Evidencia y cantidades", title: "Deja el faltante junto a la factura.",
    description: "Ingresa cuánto llegó por producto, agrega un comentario y adjunta una foto si hace falta.",
    outcome: "La observación queda en la factura y en los productos involucrados.",
    focus: { label: "Cantidades e incidencia", copy: "Registra lo recibido y deja claro qué producto tuvo el problema." },
    image: "/assets/registro-compras/registro-diferencias.png", alt: "Formulario de recepción de Ruka para registrar cantidades recibidas, incidencias, comentarios y archivos", Icon: TriangleAlert,
  },
  {
    label: "Pago protegido", title: "Lo pendiente no avanza por error.",
    description: "Ruka muestra qué productos no calzan y mantiene la factura observada hasta que alguien resuelva la diferencia.",
    outcome: "Evitas pagar mercadería que no llegó o que todavía necesita una nota de crédito.",
    focus: { label: "Diferencia antes del pago", copy: "La observación sigue visible hasta que la factura pueda avanzar." },
    image: "/assets/registro-compras/bloqueo-pago.png", alt: "Factura de Ruka con recepción registrada con observaciones y detalle de productos con diferencia", Icon: ShieldCheck,
  },
] as const;

const tourSteps: readonly ProductGuidedTourStep[] = steps.map((step) => ({
  ...step,
  aspect: "standard",
  visual: <img src={step.image} alt={step.alt} className="absolute inset-0 h-full w-full object-contain object-top" loading="lazy" decoding="async" />,
}));

export function PurchaseRegistrationTour() {
  return <ProductGuidedTour heading="Mira cómo se registra una compra." intro="En este ejemplo, la factura llega, el equipo confirma lo recibido y una diferencia queda resuelta antes de que avance a pago." steps={tourSteps} />;
}
