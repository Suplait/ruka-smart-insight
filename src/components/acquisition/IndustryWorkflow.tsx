import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const workflows = {
  restaurantes: {
    title: "La misma cocina. Distintos nombres en cada factura.",
    lead: "Un proveedor vende la caja; otro, el kilo. Antes de decidir a quién comprar, necesitas una base comparable.",
    steps: [
      ["Recibir", "La compra llega con su documento y su presentación. El equipo registra lo que recibió y las diferencias."],
      ["Homologar", "Los ítems se vinculan al insumo maestro con su unidad y equivalencia. Caja, bolsa y kilo dejan de mezclarse en una comparación nominal."],
      ["Decidir", "Revisa el costo por unidad y su variación antes de cambiar de proveedor o actualizar el costo de una receta."],
    ],
    example: "Ejemplo: una caja de 4 kg a $12.000 netos equivale a $3.000 por kg. Una bolsa de 2 kg a $6.400 equivale a $3.200 por kg. El precio del envase por sí solo no responde cuál cuesta menos.",
    limit: "El rendimiento de una receta y las mermas requieren sus propios datos. Normalizar una compra no los inventa.",
    href: "/herramientas/costo-unitario", link: "Comparar mis formatos de compra",
  },
  hoteles: {
    title: "Una compra para desayuno no cuenta la misma historia que una de mantención.",
    lead: "Cuando varias áreas compran, el total del mes no basta. Necesitas saber a qué operación corresponde cada gasto.",
    steps: [
      ["Identificar", "Revisa la sociedad, el proveedor y el documento. Una propiedad y una sociedad pueden ser contextos distintos."],
      ["Clasificar", "Asigna el centro de costo y la cuenta según las reglas del hotel: cocina, housekeeping o mantención, por ejemplo."],
      ["Revisar", "Contrasta recepción, pendientes y costos por área. Entrega a contabilidad información con su origen, no una planilla que hay que reconstruir."],
    ],
    example: "Ejemplo de revisión: una factura de alimentos corresponde a cocina; otra, de amenidades, a housekeeping. Si una compra abastece a más de un área, acuerda el criterio de distribución antes de comparar sus costos.",
    limit: "Las conexiones con PMS y ERP se revisan por sistema y proceso. No se da por disponible una integración por tratarse de un hotel.",
    href: "/desarrolladores/guias/compras-revisadas-erp", link: "Ver cómo entregar compras a un ERP",
  },
  retail: {
    title: "Lo que llegó a cada local importa tanto como lo que dice la factura.",
    lead: "Una compra puede venir en cajas y terminar en distintas sucursales. El control comienza antes de preparar el pago.",
    steps: [
      ["Revisar", "Identifica empresa, documento y destino de la compra. Contrasta cantidad y formato contra la orden cuando forme parte del flujo."],
      ["Recibir", "Registra lo que llegó y documenta los faltantes. Conserva la diferencia junto a la compra para que administración no tenga que perseguirla."],
      ["Preparar", "Revisa los documentos y saldos listos para pago. Genera la nómina del formato habilitado y continúa la autorización en el banco."],
    ],
    example: "Ejemplo: diez cajas de doce unidades representan 120 unidades solo si ese es el formato recibido. Si llegó una caja menos, registra la diferencia antes de dar por completa la recepción.",
    limit: "El efecto sobre stock y sistemas externos depende de los módulos y reglas habilitados. Descargar una nómina no mueve dinero.",
    href: "/ayuda/registrar-recepcion", link: "Ver el registro de recepción",
  },
};

export function IndustryWorkflow({ industry }: { industry: keyof typeof workflows }) {
  const content = workflows[industry];
  return <section aria-labelledby={`${industry}-workflow`} className="space-y-6"><header><p className="text-sm font-semibold text-[#424ec0]">Un proceso de tu operación</p><h2 id={`${industry}-workflow`} className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">{content.title}</h2><p className="mt-5 text-lg leading-8 text-[#505b70]">{content.lead}</p></header><ol className="divide-y divide-[#dce2ed] border-y border-[#dce2ed]">{content.steps.map(([title, text], index) => <li key={title} className="grid grid-cols-[2rem_1fr] gap-3 py-6"><span className="pt-0.5 text-sm font-semibold text-[#424ec0]">0{index + 1}</span><div><h3 className="text-xl font-semibold">{title}</h3><p className="mt-2 leading-7 text-[#505b70]">{text}</p></div></li>)}</ol><div className="rounded-xl border border-[#dce2ed] bg-white p-6"><p className="leading-7 text-[#444e61]">{content.example}</p><p className="mt-4 border-t border-[#e2e6ef] pt-4 text-sm leading-7 text-[#60687a]">{content.limit}</p></div><Link to={content.href} className="inline-flex min-h-11 items-center gap-2 rounded font-semibold text-[#424ec0] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-primary">{content.link}<ArrowRight size={17} aria-hidden="true" /></Link></section>;
}
