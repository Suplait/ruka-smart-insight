import { BadgeCheck, Network, TriangleAlert } from "lucide-react";
import { ProductLandingPage } from "@/components/seo/ProductLandingPage";
import { ProductGuidedTour } from "@/components/seo/ProductGuidedTour";
import { ConciliationWorkspaceVisual } from "@/components/seo/ProductDemoVisuals";
import { productPages } from "@/content/productPages";

const steps = [
  {
    label: "Fuentes reunidas",
    title: "Primero, Ruka junta todo lo de la compra.",
    description: "Factura, orden, recepción y pago aparecen unidos en un solo caso.",
    outcome: "Ya no tienes que abrir cuatro sistemas para entender qué pasó.",
    focus: { label: "Caso completo", copy: "Cada documento queda a mano para comprobar el resultado." },
    Icon: Network,
    visual: <ConciliationWorkspaceVisual stage="sources" />,
    aspect: "cinema" as const,
  },
  {
    label: "Reglas aplicadas",
    title: "Después, comprueba que los datos coincidan.",
    description: "Compara monto, proveedor, fecha, orden, recepción y las tolerancias que acepta tu equipo.",
    outcome: "Las compras correctas avanzan sin una revisión manual.",
    focus: { label: "Reglas de validación", copy: "Tú defines qué debe coincidir y qué diferencia es aceptable." },
    Icon: BadgeCheck,
    visual: <ConciliationWorkspaceVisual stage="rules" />,
    aspect: "cinema" as const,
  },
  {
    label: "Diferencias separadas",
    title: "Si algo no calza, te muestra exactamente qué.",
    description: "La diferencia aparece con el valor esperado, lo que llegó y el documento donde se encontró.",
    outcome: "Tu equipo revisa cuatro diferencias, no 128 compras.",
    focus: { label: "Diferencia explicada", copy: "Tienes el contexto necesario para resolverla sin volver a investigar." },
    Icon: TriangleAlert,
    visual: <ConciliationWorkspaceVisual stage="exceptions" />,
    aspect: "cinema" as const,
  },
];

function HeroVisual() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white p-2 shadow-[0_26px_70px_rgba(29,38,72,0.14)] transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transition-none">
      <div className="flex h-9 items-center gap-1.5 border-b border-[#e6e9f0] px-3" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-[#d7dce7]" />
        <span className="h-2 w-2 rounded-full bg-[#d7dce7]" />
        <span className="h-2 w-2 rounded-full bg-[#d7dce7]" />
        <span className="ml-auto text-[10px] font-medium text-[#778094]">Conciliaciones / Operación</span>
      </div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-b-xl bg-[#eef1f5]">
        <ConciliationWorkspaceVisual />
      </div>
    </div>
  );
}

export default function ConciliacionAutomatica() {
  return (
    <ProductLandingPage
      content={productPages.conciliacion}
      visual={<HeroVisual />}
      demo={<ProductGuidedTour heading="Mira cómo Ruka concilia una compra." intro="Los documentos se reúnen, las reglas se aplican y solo las diferencias reales llegan a tu equipo." steps={steps} />}
    />
  );
}
