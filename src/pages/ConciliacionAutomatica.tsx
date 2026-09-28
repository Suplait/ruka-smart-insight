import { BadgeCheck, Network, TriangleAlert } from "lucide-react";
import { ProductGuidedTour } from "@/components/seo/ProductGuidedTour";
import { ReconciliationMismatches } from "@/components/seo/ReconciliationMismatches";
import { ConciliationWorkspaceVisual } from "@/components/seo/ProductDemoVisuals";
import { SeoLandingPage } from "@/components/seo/SeoLandingPage";
import { seoLandingPages } from "@/content/seoLandingPages";

const conciliationSteps = [
  {
    label: "Fuentes conectadas",
    title: "Los cuatro documentos que explican un pago, juntos.",
    description:
      "La factura, la orden de compra, la recepción de bodega y el movimiento bancario llegan al mismo caso. Nadie los va a buscar entre sistemas, correos y planillas.",
    outcome: "El caso se arma solo, con todo lo necesario para decidir si avanza.",
    focus: {
      label: "Documentos del mismo caso",
      copy: "Cada fuente aporta una pieza: qué se pidió, qué llegó, qué se facturó y qué se pagó.",
      left: "3%",
      top: "19%",
      width: "43%",
      height: "49%",
    },
    Icon: Network,
    visual: <ConciliationWorkspaceVisual />,
    aspect: "cinema",
  },
  {
    label: "Reglas de cruce",
    title: "Tu equipo define qué tiene que calzar.",
    description:
      "Monto, proveedor, fecha, orden de compra y recepción. Ruka aplica esos criterios factura por factura, con las tolerancias que ustedes fijaron.",
    outcome: "Lo repetitivo se resuelve con la regla correcta, no con revisión manual.",
    focus: {
      label: "Reglas de validación",
      copy: "Los criterios son los de tu operación. Ruka no decide por su cuenta qué es aceptable.",
      left: "48%",
      top: "28%",
      width: "19%",
      height: "38%",
    },
    Icon: BadgeCheck,
    visual: <ConciliationWorkspaceVisual />,
    aspect: "cinema",
  },
  {
    label: "Excepciones visibles",
    title: "Lo que calza avanza. Lo que no, queda arriba.",
    description:
      "Cuando un monto, una cantidad o una recepción no coincide, el caso se separa con el esperado, lo recibido y el documento que lo originó.",
    outcome: "Tu equipo abre las excepciones, no el volumen completo.",
    focus: {
      label: "Diferencia por resolver",
      copy: "Esperado 16 kg, recibido 14. La excepción llega con la evidencia, no con una alerta a secas.",
      left: "3%",
      top: "74%",
      width: "94%",
      height: "19%",
      labelPosition: "bottom",
    },
    Icon: TriangleAlert,
    visual: <ConciliationWorkspaceVisual />,
    aspect: "cinema",
  },
] as const;

export default function ConciliacionAutomatica() {
  return (
    <SeoLandingPage content={seoLandingPages.conciliacionAutomatica}>
      <ProductGuidedTour
        heading="De cuatro documentos sueltos a un caso resuelto."
        intro="Ruka arma el caso, aplica tus reglas y deja arriba solo lo que necesita una decisión de tu equipo."
        steps={conciliationSteps}
      />
      <ReconciliationMismatches />
    </SeoLandingPage>
  );
}
