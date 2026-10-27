import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const decisions = {
  cost: {
    title: "Ya tienes una base para comparar.",
    checks: [
      "Mismo insumo y calidad",
      "Misma unidad y moneda",
      "Flete y merma revisados aparte",
    ],
    text: "El precio de la caja no cuenta toda la historia. Usa el costo por unidad para contrastar otra compra o definir tu precio de venta.",
    path: "/herramientas/variacion-costos",
    action: "Comparar con otra compra",
  },
  variation: {
    title: "Antes de decidir por precio.",
    checks: [
      "Calidad y rendimiento equivalentes",
      "Condiciones de entrega comparables",
      "Espacio y merma del nuevo formato",
    ],
    text: "Una diferencia de costo es una señal para revisar la compra, no una recomendación automática de cambiar de proveedor.",
    path: "/herramientas/margen-markup",
    action: "Revisar el efecto en mi margen",
  },
  margin: {
    title: "Un margen no es toda la rentabilidad.",
    checks: [
      "Costo y venta sin IVA",
      "Misma moneda y unidad",
      "Gastos, merma y comisiones aparte",
    ],
    text: "Revisa lo que todavía no está dentro del costo antes de usar este porcentaje para fijar precios.",
    path: "/herramientas/costo-unitario",
    action: "Revisar mi costo por unidad",
  },
} as const;

export function ToolDecision({ kind }: { kind: keyof typeof decisions }) {
  const item = decisions[kind];
  return (
    <section
      aria-label="Cómo usar este resultado"
      className="mt-10 grid gap-7 border-y border-[#dce2ed] py-8 md:grid-cols-[1.2fr_1fr]"
    >
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{item.title}</h2>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[#505b70]">
          {item.text}
        </p>
        <Link
          to={item.path}
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-[#424ec0] hover:underline focus-visible:ring-2 focus-visible:ring-primary"
        >
          {item.action}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <ul className="space-y-3 self-center">
        {item.checks.map((check) => (
          <li
            key={check}
            className="flex items-start gap-3 text-sm leading-6 text-[#505b70]"
          >
            <Check
              size={17}
              className="mt-1 shrink-0 text-[#424ec0]"
              aria-hidden="true"
            />
            {check}
          </li>
        ))}
      </ul>
    </section>
  );
}
