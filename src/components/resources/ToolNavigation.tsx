import { Link } from "react-router-dom";
import { Calculator, ArrowLeftRight, Percent, Files } from "lucide-react";

const tools = [
  { path: "/herramientas/costo-unitario", label: "Costo unitario" },
  { path: "/herramientas/variacion-costos", label: "Variación de costos" },
  { path: "/herramientas/margen-markup", label: "Margen / markup" },
  {
    path: "/herramientas/conciliar-factura-orden-recepcion",
    label: "Conciliar CSV",
  },
];

export function ToolNavigation({ path }: { path: string }) {
  if (!tools.some((tool) => tool.path === path)) return null;
  return (
    <nav
      aria-label="Herramientas"
      className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-[#f1f3f8] p-1.5 sm:grid-cols-4"
    >
      {tools.map((tool, index) => {
        const Icon = [Calculator, ArrowLeftRight, Percent, Files][index];
        return (
          <Link
            key={tool.path}
            to={tool.path}
            aria-current={path === tool.path ? "page" : undefined}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-2 text-xs font-medium transition-[background-color,box-shadow] duration-150 sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary motion-reduce:transition-none ${path === tool.path ? "bg-white text-[#343fad] shadow-sm ring-1 ring-[#dce2ed]" : "text-[#60687a] hover:bg-white/70 hover:text-[#171827]"}`}
          >
            <Icon size={16} className="shrink-0" aria-hidden="true" />
            {tool.label}
          </Link>
        );
      })}
    </nav>
  );
}
