export const journeys = {
  costs: { title: "Una compra se calcula aquí. Cientos, se siguen en Ruka.", text: "Ruka reúne tus compras, relaciona los insumos y lleva sus costos a una misma unidad. Así puedes revisar cambios de precio sin volver a armar la cuenta en una planilla.", href: "/productos/panel-control", label: "Conocer el control de costos" },
  margin: { title: "Tu margen cambia cuando cambia tu costo.", text: "Ruka conecta la información de compras y costos para que puedas revisar tu operación con datos actualizados. La calculadora te ayuda con una cuenta; el producto te ayuda a mantener el seguimiento.", href: "/productos/panel-control", label: "Ver costos y márgenes" },
  receipt: { title: "Que la revisión no termine en otra planilla.", text: "Ruka reúne facturas, recepción y cuentas por pagar para que tu equipo revise las diferencias con su contexto. Conoce cómo se conecta ese trabajo en tu operación.", href: "/productos/cuentas-por-pagar", label: "Ver compras y recepción" },
  purchases: { title: "Menos tiempo registrando. Más tiempo revisando lo importante.", text: "Ruka conecta las compras con los sistemas que ya usas, relaciona productos e insumos y conserva el detalle del documento para revisar el registro.", href: "/productos/registro-de-compras", label: "Conocer el registro de compras" },
  api: { title: "Tus sistemas pueden seguir. El trabajo manual, no.", text: "Ruka organiza información operativa y la conecta con tu ERP, dashboard o desarrollo propio. Revisamos contigo las fuentes, los permisos y el alcance de la integración.", href: "/one", label: "Conocer Ruka One" },
  suppliers: { title: "Encontraste al proveedor. Ahora, ordena lo que le compras.", text: "Ruka te ayuda a reunir facturas, relacionar insumos y seguir tus compras. Este directorio es una consulta pública: las empresas listadas no se presentan como clientes ni partners de Ruka.", href: "/productos/registro-de-compras", label: "Ver el registro de compras" },
  billing: { title: "De la guía a tus documentos del día a día.", text: "Con RukaFactura puedes emitir documentos electrónicos y seguir su estado. Conoce el producto y revisemos los requisitos para tu empresa antes de comenzar.", href: "/productos/facturacion-electronica", label: "Conocer RukaFactura" },
  overview: { title: "¿Qué es Ruka y qué trabajo puede sacar de tu equipo?", text: "Ruka automatiza trabajo operativo entre los sistemas que tu empresa ya usa: registrar compras, cruzar información y mantener costos actualizados. Empieza por el proceso que hoy haces a mano.", href: "/", label: "Conocer Ruka" },
} as const;

export function resourceJourney(path: string): keyof typeof journeys {
  if (path.includes("margen-markup")) return "margin";
  if (path.includes("costo-unitario") || path.includes("variacion-costos") || path.includes("homolog")) return "costs";
  if (path.includes("conciliar-factura") || path.includes("recepcion") || path.includes("nomina")) return "receipt";
  if (path.startsWith("/proveedores")) return "suppliers";
  if (path.startsWith("/desarrolladores")) return "api";
  if (path.includes("rukafactura") || path.includes("emitir-")) return "billing";
  if (path.startsWith("/guias/compras") || path.startsWith("/ayuda/")) return "purchases";
  return "overview";
}
