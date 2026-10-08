import { BadgeCheck, Network, TriangleAlert } from "lucide-react";
import { ProductLandingPage } from "@/components/seo/ProductLandingPage";
import { ProductGuidedTour } from "@/components/seo/ProductGuidedTour";
import { ConciliationWorkspaceVisual } from "@/components/seo/ProductDemoVisuals";
import { productPages } from "@/content/productPages";

const steps = [
  {
    label: "Fuentes reunidas",
    title: "Los documentos del mismo caso, juntos.",
    description: "Factura, orden, recepción y pago dejan de vivir como piezas separadas.",
    outcome: "El caso queda completo antes de aplicar una regla.",
    focus: { label: "Caso completo", copy: "Cada fuente aporta la evidencia que explica el resultado." },
    Icon: Network,
    visual: <ConciliationWorkspaceVisual stage="sources" />,
    aspect: "cinema" as const,
  },
  {
    label: "Reglas aplicadas",
    title: "Tus criterios se aplican siempre igual.",
    description: "Monto, proveedor, fecha, orden, recepción y las tolerancias que define tu equipo.",
    outcome: "Lo repetitivo deja de depender de una revisión manual.",
    focus: { label: "Reglas de validación", copy: "La operación define qué significa que un caso calce." },
    Icon: BadgeCheck,
    visual: <ConciliationWorkspaceVisual stage="rules" />,
    aspect: "cinema" as const,
  },
  {
    label: "Diferencias separadas",
    title: "Solo queda arriba lo que necesita una decisión.",
    description: "La diferencia aparece con el valor esperado, el recibido y su documento de origen.",
    outcome: "El equipo revisa excepciones, no el volumen completo.",
    focus: { label: "Diferencia explicada", copy: "La excepción conserva el contexto necesario para resolverla." },
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
      demo={<ProductGuidedTour heading="De cuatro documentos a un caso resuelto." intro="Recorre el proceso completo sin perder el contexto de cada decisión." steps={steps} />}
    />
  );
}
