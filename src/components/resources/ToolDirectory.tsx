import { useState } from "react";
import {
  ArrowUpRight,
  Calculator,
  ArrowLeftRight,
  Percent,
  Files,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const tools = [
  {
    slug: "costo-unitario",
    icon: Calculator,
    task: "Entender una compra",
    title: "Costo por kilo, litro o unidad",
    question: "De la caja al costo real.",
    text: "Lleva cualquier formato a una unidad que sí puedas comparar.",
    action: "Calcular costo",
    needs: "Total + envases + contenido",
    output: "Costo neto por kg, litro o unidad",
    result: "$3.000",
    suffix: "/ kg",
    context: "6 bolsas de 1 kg por $18.000 netos",
    tip: "Parte aquí si conoces el precio de la caja, pero no el costo de lo que contiene.",
  },
  {
    slug: "variacion-costos",
    icon: ArrowLeftRight,
    task: "Comparar dos compras",
    title: "Variación de costos",
    question: "El formato cambia. ¿El costo también?",
    text: "Compara por unidad, no por el precio de envases de distinto tamaño.",
    action: "Comparar compras",
    needs: "Los datos de ambas compras",
    output: "Variación % e impacto en la compra",
    result: "+6,67%",
    suffix: "por kg",
    context: "De $3.000 a $3.200 por kilo",
    tip: "Úsala si cambió el precio, el tamaño del envase o el descuento de un mismo insumo.",
  },
  {
    slug: "margen-markup",
    icon: Percent,
    task: "Revisar mi precio de venta",
    title: "Margen y markup",
    question: "Lo que vendes. Lo que te queda.",
    text: "Distingue margen de recargo y calcula un precio para tu margen objetivo.",
    action: "Calcular margen",
    needs: "Costo y precio neto por unidad",
    output: "Margen, markup y precio objetivo",
    result: "40%",
    suffix: "de margen",
    context: "Costo $6.000 · Venta $10.000",
    tip: "Úsala antes de sumar un porcentaje al costo: 40% de recargo no deja 40% de margen.",
  },
  {
    slug: "conciliar-factura-orden-recepcion",
    icon: Files,
    task: "Encontrar diferencias",
    title: "Factura, orden y recepción",
    question: "Tres documentos. Una revisión clara.",
    text: "Cruza cantidades y precios. Separa las diferencias y llévalas a tu revisión.",
    action: "Abrir conciliador",
    needs: "3 CSV con una referencia común",
    output: "Diferencias y respaldo descargable",
    result: "2 de 3",
    suffix: "por revisar",
    context: "Caso de ejemplo con tres productos",
    tip: "Úsala cuando tengas una orden, una factura y una recepción de la misma compra.",
  },
];

export function ToolDirectory({ paths }: { paths: string[] }) {
  const [task, setTask] = useState<string | null>(null);
  const visible = tools.filter((tool) =>
    paths.includes(`/herramientas/${tool.slug}`),
  );
  const selected = visible.find((tool) => tool.slug === task);
  if (!visible.length) return null;
  return (
    <section
      id="calcular"
      className="mb-16 scroll-mt-28"
      aria-labelledby="tools-directory-title"
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2
            id="tools-directory-title"
            className="text-2xl font-semibold tracking-tight"
          >
            Una pregunta. Una herramienta.
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#505b70]">
            Sin cuenta, sin esperar una llamada. Abre una y empieza.
          </p>
        </div>
        <p className="flex items-center gap-2 text-xs text-[#505b70]">
          <ShieldCheck size={17} aria-hidden="true" />
          Gratis · Datos procesados en tu navegador
        </p>
      </div>
      {visible.length > 1 && (
        <div className="mb-6 rounded-xl border border-[#dce2ed] bg-[#f8f9fc] p-4 sm:p-5">
          <p className="mb-3 text-sm font-semibold">
            ¿Qué necesitas resolver hoy?
          </p>
          <div className="flex flex-wrap gap-2" aria-label="Elegir una tarea">
            {visible.map((tool) => (
              <button
                type="button"
                key={tool.slug}
                aria-pressed={task === tool.slug}
                onClick={() => setTask(task === tool.slug ? null : tool.slug)}
                className="min-h-11 rounded-lg border border-[#d8deea] bg-white px-3 text-sm text-[#505b70] transition-colors duration-150 hover:border-[#a3ade9] focus-visible:ring-2 focus-visible:ring-primary aria-pressed:border-[#424ec0] aria-pressed:bg-[#eef0ff] aria-pressed:text-[#343fad] motion-reduce:transition-none"
              >
                {tool.task}
              </button>
            ))}
          </div>
          <p
            role="status"
            className="mt-3 min-h-6 text-sm leading-6 text-[#505b70]"
          >
            {selected
              ? `${selected.title}: ${selected.tip}`
              : "Todas incluyen ejemplos editables. No necesitas tener tus datos listos para probar."}
          </p>
        </div>
      )}
      <div className="grid gap-5 lg:grid-cols-2">
        {visible.map((tool, index) => (
          <Link
            key={tool.slug}
            to={`/herramientas/${tool.slug}`}
            className={`group flex min-w-0 flex-col overflow-hidden rounded-xl border bg-white transition-[border-color,box-shadow] duration-150 hover:border-[#929fe3] hover:shadow-[0_8px_24px_-16px_#515fee80] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 motion-reduce:transition-none ${selected?.slug === tool.slug ? "border-[#515fee] ring-1 ring-[#515fee]" : "border-[#dce2ed]"}`}
          >
            <div className="flex flex-1 flex-col p-5 sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <tool.icon
                  size={24}
                  className="text-[#424ec0]"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <span className="text-xs font-medium tabular-nums text-[#697386]">
                  0{index + 1} /{" "}
                  {tool.slug.includes("conciliar")
                    ? "ARCHIVOS CSV"
                    : "CALCULADORA"}
                </span>
              </div>
              <h3 className="text-2xl font-semibold leading-tight tracking-tight">
                {tool.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-[#424ec0]">
                {tool.question}
              </p>
              <p className="mt-3 max-w-lg text-sm leading-6 text-[#505b70]">
                {tool.text}
              </p>
              <dl className="my-6 grid gap-4 border-y border-[#e3e7ef] py-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs text-[#60687a]">Qué necesitas</dt>
                  <dd className="mt-1 text-sm font-medium">{tool.needs}</dd>
                </div>
                <div>
                  <dt className="text-xs text-[#60687a]">Qué te llevas</dt>
                  <dd className="mt-1 text-sm font-medium">{tool.output}</dd>
                </div>
              </dl>
              <div className="mt-auto flex items-center justify-between gap-3">
                <span className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#424ec0]">
                  {tool.action}
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
                <span className="text-xs text-[#60687a]">Sin registro</span>
              </div>
            </div>
            <div
              className={`flex flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-7 ${index === 0 ? "bg-[#171827] text-white" : "border-t border-[#e3e7ef] bg-[#f6f7fc]"}`}
            >
              <div>
                <p
                  className={`text-[11px] font-semibold uppercase tracking-wider ${index === 0 ? "text-[#c7ceff]" : "text-[#60687a]"}`}
                >
                  Ejemplo, no datos de un cliente
                </p>
                <p
                  className={`mt-1 text-xs leading-5 ${index === 0 ? "text-[#d4d8e6]" : "text-[#60687a]"}`}
                >
                  {tool.context}
                </p>
              </div>
              <p className="text-2xl font-semibold tabular-nums tracking-tight">
                {tool.result}{" "}
                <span
                  className={`text-xs font-normal ${index === 0 ? "text-[#d4d8e6]" : "text-[#60687a]"}`}
                >
                  {tool.suffix}
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
