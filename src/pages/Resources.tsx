import { useState } from "react";
import {
  ArrowUpRight,
  Calculator,
  FileCheck2,
  BookOpen,
  Cable,
  Search,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  ResourceLayout,
  resourceLinkClass,
} from "@/components/resources/ResourceLayout";
import { ToolDirectory } from "@/components/resources/ToolDirectory";

const groups = [
  {
    id: "calcular",
    icon: Calculator,
    title: "Ponle números a una compra.",
    lead: "Herramientas gratuitas. Tus datos se quedan en el navegador.",
    items: [
      {
        title: "Costo por kilo, litro o unidad",
        text: "Lleva cajas, bolsas y formatos distintos a una misma unidad de comparación.",
        href: "/herramientas/costo-unitario",
        label: "Calcular costo",
      },
      {
        title: "Variación de costos",
        text: "Compara dos compras con distinto formato, IVA o descuento. Mira qué cambió de verdad.",
        href: "/herramientas/variacion-costos",
        label: "Comparar compras",
      },
      {
        title: "Margen y markup",
        text: "Distingue margen sobre venta de recargo sobre costo. Calcula ambos y un precio objetivo.",
        href: "/herramientas/margen-markup",
        label: "Calcular margen",
      },
    ],
  },
  {
    id: "revisar",
    icon: FileCheck2,
    title: "Encuentra lo que no cuadra.",
    lead: "De la factura al pago, sin perder de vista lo recibido.",
    items: [
      {
        title: "Identificar un proveedor",
        text: "Busca por marca, razón social o RUT y revisa el canal oficial antes de registrar la compra.",
        href: "/proveedores",
        label: "Abrir directorio",
      },
      {
        title: "Recepción, documentos y SII",
        text: "Separa el control operativo de los eventos tributarios. Revisa ejemplos y fuentes oficiales.",
        href: "/guias/compras",
        label: "Explorar las guías",
      },
      {
        title: "Factura, orden y recepción",
        text: "Carga tus CSV, revisa las diferencias y descarga el resultado de la comparación.",
        href: "/herramientas/conciliar-factura-orden-recepcion",
        label: "Abrir conciliador",
      },
      {
        title: "Preparar la nómina del banco",
        text: "Qué revisar antes de generar el archivo para pagar a tus proveedores.",
        href: "/blog/nomina-pagos-proveedores-banco",
        label: "Leer la guía",
      },
    ],
  },
  {
    id: "conectar",
    icon: Cable,
    title: "Trabaja con tus sistemas.",
    lead: "Entiende dónde encaja cada conexión antes de implementarla.",
    items: [
      {
        title: "Desarrolladores e integradores",
        text: "Compras, clasificación, documentos y webhooks para tu ERP o tu propio dashboard.",
        href: "/desarrolladores",
        label: "Explorar la API",
      },
      {
        title: "Explorar integraciones",
        text: "SII, sistemas de gestión, POS y otras fuentes de tu operación.",
        href: "/integraciones",
        label: "Ver conexiones",
      },
      {
        title: "Registrar compras en Toteat",
        text: "Qué información preparar, cómo revisar equivalencias y dónde controlar el resultado.",
        href: "/procesos/registrar-compras-toteat",
        label: "Ver el proceso",
      },
    ],
  },
  {
    id: "entender",
    icon: BookOpen,
    title: "Decide qué automatizar primero.",
    lead: "Guías para bajar una idea a un proceso concreto.",
    items: [
      {
        title: "Qué hay de nuevo",
        text: "Los recursos y mejoras publicados, con un enlace directo para usarlos.",
        href: "/novedades",
        label: "Ver novedades",
      },
      {
        title: "Aprender a usar Ruka",
        text: "Pasos, requisitos y qué hacer si algo no cuadra: compras, recepción, insumos, pagos y facturación.",
        href: "/ayuda",
        label: "Abrir centro de ayuda",
      },
      {
        title: "Emitir con RukaFactura",
        text: "Prepara documentos, revisa importes y conoce los requisitos de tu empresa antes de emitir.",
        href: "/productos/facturacion-electronica",
        label: "Conocer el facturador",
      },
      {
        title: "Comparar soluciones",
        text: "Ruka y Tupana, Excel o automatización, OCR o un proceso completo. Elige según el trabajo pendiente.",
        href: "/comparar",
        label: "Explorar comparaciones",
      },
      {
        title: "Excel o registro automático",
        text: "Qué cambia cuando el registro de compras deja de depender de una planilla manual.",
        href: "/blog/registro-compras-excel-vs-automatizacion",
        label: "Comparar enfoques",
      },
      {
        title: "OCR no es registro automático",
        text: "Leer una factura y dejarla bien registrada son tareas distintas. Revisa qué falta entre ambas.",
        href: "/blog/ocr-facturas-vs-registro-automatico",
        label: "Leer la guía",
      },
    ],
  },
];

export default function Resources() {
  const [query, setQuery] = useState("");
  const normalize = (value: string) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean);
  const aliases: Record<string, string> = {
    "/herramientas/costo-unitario":
      "kg kilo kilos gramo gramos litro litros unidades caja bolsa saco IVA neto",
    "/herramientas/variacion-costos":
      "subida ahorro aumento proveedor formatos diferencia porcentaje",
    "/herramientas/margen-markup":
      "rentabilidad ganancia utilidad precio venta recargo porcentaje",
    "/herramientas/conciliar-factura-orden-recepcion":
      "conciliar conciliacion excel planillas archivos csv diferencias",
  };
  const filtered = groups.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      terms.every((term) =>
        normalize(
          `${item.title} ${item.text} ${item.label} ${group.id} ${aliases[item.href] || ""}`,
        ).includes(term),
      ),
    ),
  }));
  const count = filtered.reduce(
    (total, group) => total + group.items.length,
    0,
  );
  return (
    <ResourceLayout
      catalog
      path="/recursos"
      title="Recursos para compras, costos y automatización | Ruka"
      heading="Resuelve una tarea. Sigue con tu operación."
      description="Calculadoras, guías y ejemplos para entender tus costos, revisar compras y conectar los sistemas que ya usas."
      eyebrow="Recursos de Ruka"
    >
      <div className="mb-10 grid gap-4 border-y border-[#dce2ed] py-4 lg:grid-cols-[1fr_420px] lg:items-center">
        <nav aria-label="Tareas" className="flex flex-wrap gap-x-6 gap-y-1">
          {groups.map((group) => (
            <a
              href={`#${group.id}`}
              key={group.id}
              onClick={() => setQuery("")}
              className={`${resourceLinkClass} text-sm`}
            >
              {group.id[0].toUpperCase() + group.id.slice(1)}
            </a>
          ))}
        </nav>
        <div>
          <label htmlFor="resource-search" className="sr-only">
            Buscar un recurso
          </label>
          <div className="relative">
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3.5 text-[#60687a]"
            />
            <input
              id="resource-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca una tarea: costos, API, recepción…"
              className="min-h-11 w-full rounded-lg border border-[#808ca2] bg-[#f8f9fc] pl-10 pr-12 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-0 top-0 grid h-11 w-11 place-items-center rounded-lg focus-visible:outline-primary"
              >
                <X size={17} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
      {query && (
        <p role="status" className="mb-6 text-sm text-[#505b70]">
          {count} {count === 1 ? "recurso encontrado" : "recursos encontrados"}
        </p>
      )}
      {count === 0 && (
        <section className="rounded-xl bg-[#f8f9fc] p-8">
          <h2 className="text-xl font-semibold">No encontramos esa tarea.</h2>
          <p className="mt-3 leading-7 text-[#505b70]">
            Prueba con compras, costos o facturación, o vuelve a explorar todas
            las categorías.
          </p>
          <button
            type="button"
            onClick={() => setQuery("")}
            className={`${resourceLinkClass} mt-4`}
          >
            Ver todos los recursos
          </button>
        </section>
      )}
      <ToolDirectory
        paths={filtered.flatMap((group) =>
          group.items.map((item) => item.href),
        )}
      />
      <div className="space-y-16">
        {filtered
          .map((group) => ({
            ...group,
            items: group.items.filter(
              (item) => !item.href.startsWith("/herramientas/"),
            ),
          }))
          .filter((group) => group.items.length > 0)
          .map(({ id, icon: Icon, title, lead, items }) => (
            <section key={id} id={id} className="scroll-mt-28">
              <header className="mb-6 flex items-start gap-3">
                <Icon
                  size={22}
                  aria-hidden="true"
                  className="mt-1 shrink-0 text-[#424ec0]"
                />
                <div>
                  <h2 className="text-2xl font-semibold leading-tight tracking-tight">
                    {title}
                  </h2>
                  <p className="mt-2 leading-7 text-[#505b70]">{lead}</p>
                </div>
              </header>
              <div
                className={`grid gap-4 ${id === "calcular" ? "lg:grid-cols-3" : "md:grid-cols-2"}`}
              >
                {items.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#dce2ed] bg-white transition-[border-color,box-shadow] duration-150 hover:border-[#a9b1ef] hover:shadow-[0_4px_18px_-8px_rgba(23,24,39,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-xl font-semibold leading-7 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="mb-5 mt-3 max-w-xl text-sm leading-6 text-[#505b70]">
                        {item.text}
                      </p>
                      <span className="mt-auto flex min-h-8 items-center justify-between gap-4 text-sm font-semibold text-[#424ec0]">
                        {item.label}
                        <ArrowUpRight
                          size={18}
                          aria-hidden="true"
                          className="shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none"
                        />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}
      </div>
    </ResourceLayout>
  );
}
