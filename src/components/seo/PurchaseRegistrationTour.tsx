import { CheckCircle2, ClipboardCheck, FileText, ShieldCheck, TriangleAlert } from "lucide-react";
import { ProductGuidedTour, type ProductGuidedTourStep } from "@/components/seo/ProductGuidedTour";

const steps = [
  {
    label: "Factura recibida", title: "Las compras llegan a una sola bandeja.",
    description: "Ruka reúne las facturas de compra y deja visible qué documentos necesitan una acción de tu equipo.",
    outcome: "La factura queda lista para revisar en el flujo de recepción.",
    focus: { label: "Estados del folio", copy: "Identifica en segundos los folios recibidos, por recibir y rechazados." },
    image: "/assets/registro-compras/facturas-en-bandeja.png", alt: "Bandeja de facturas de compra de Ruka con facturas procesadas y pendientes de confirmación", Icon: FileText,
  },
  {
    label: "Recepción pendiente", title: "Revisa la factura antes de seguir a pago.",
    description: "Desde la factura, el equipo puede confirmar si la mercadería llegó como se esperaba o iniciar una recepción con observaciones.",
    outcome: "La recepción conecta la factura con lo que realmente llegó a bodega.",
    focus: { label: "Registrar recepción", copy: "Desde esta acción confirmas que la factura llegó o registras lo que faltó." },
    image: "/assets/registro-compras/factura-pendiente-recepcion.png", alt: "Factura electrónica de Ruka con una recepción pendiente y la acción Registrar recepción", Icon: ClipboardCheck,
  },
  {
    label: "Decisión de recepción", title: "Marca si todo calza o si existe una diferencia.",
    description: "El flujo distingue entre una recepción correcta y una incompleta para que cada factura siga el camino que corresponde.",
    outcome: "Las diferencias no se pierden entre mensajes, planillas o revisiones manuales.",
    focus: { label: "Tipo de recepción", copy: "Elige si todo llegó según lo esperado o si hay una diferencia que debe quedar registrada." },
    image: "/assets/registro-compras/seleccion-recepcion.png", alt: "Modal de recepción de una factura con opciones de recepción correcta o recepción incorrecta", Icon: CheckCircle2,
  },
  {
    label: "Evidencia y cantidades", title: "Registra el faltante donde ocurrió.",
    description: "El equipo ingresa la cantidad recibida por ítem, deja un comentario y puede adjuntar evidencia cuando detecta una diferencia.",
    outcome: "La observación queda asociada a la factura y a los productos involucrados.",
    focus: { label: "Cantidades e incidencia", copy: "Registra lo recibido por producto y marca la incidencia para dejar una evidencia accionable." },
    image: "/assets/registro-compras/registro-diferencias.png", alt: "Formulario de recepción de Ruka para registrar cantidades recibidas, incidencias, comentarios y archivos", Icon: TriangleAlert,
  },
  {
    label: "Pago protegido", title: "La diferencia queda visible antes de pagar.",
    description: "Ruka muestra los productos que no calzan y mantiene la factura con observaciones mientras se resuelve la diferencia.",
    outcome: "El equipo evita pagar lo que no llegó o lo que todavía requiere una nota de crédito.",
    focus: { label: "Diferencia antes del pago", copy: "La observación y el detalle de productos quedan visibles antes de que la factura avance a pago." },
    image: "/assets/registro-compras/bloqueo-pago.png", alt: "Factura de Ruka con recepción registrada con observaciones y detalle de productos con diferencia", Icon: ShieldCheck,
  },
] as const;

const tourSteps: readonly ProductGuidedTourStep[] = steps.map((step) => ({
  ...step,
  aspect: "standard",
  visual: <img src={step.image} alt={step.alt} className="absolute inset-0 h-full w-full object-contain object-top" loading="lazy" decoding="async" />,
}));

export function PurchaseRegistrationTour() {
  return <ProductGuidedTour heading="De factura recibida a pago protegido." intro="Este es un ejemplo del flujo de recepción dentro de Ruka: el equipo confirma lo recibido, registra una diferencia y evita que una factura avance sin resolverla." steps={tourSteps} />;
}
