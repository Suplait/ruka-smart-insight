import { Link } from "react-router-dom";

const tools = [
  { path: "/herramientas/costo-unitario", label: "Costo unitario" },
  { path: "/herramientas/variacion-costos", label: "Variación de costos" },
  { path: "/herramientas/margen-markup", label: "Margen / markup" },
  { path: "/herramientas/conciliar-factura-orden-recepcion", label: "Conciliar CSV" },
];

export function ToolNavigation({ path }: { path: string }) {
  if (!tools.some(tool => tool.path === path)) return null;
  return <nav aria-label="Herramientas" className="mb-5 flex gap-x-5 overflow-x-auto border-b border-[#dce2ed] sm:gap-x-6">{tools.map(tool => <Link key={tool.path} to={tool.path} aria-current={path === tool.path ? "page" : undefined} className={`inline-flex min-h-12 shrink-0 items-center border-b-2 px-1 text-sm font-medium transition-colors focus-visible:outline-primary ${path === tool.path ? "border-primary text-[#343fad]" : "border-transparent text-[#60687a] hover:border-[#cbd2df] hover:text-[#171827]"}`}>{tool.label}</Link>)}</nav>;
}
