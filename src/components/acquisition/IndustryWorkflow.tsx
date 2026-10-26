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
  return <section aria-labelledby={`${industry}-workflow`} className="space-y-7">
    <header><p className="text-sm font-semibold text-[#424ec0]">Un proceso de tu operación</p><h2 id={`${industry}-workflow`} className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">{content.title}</h2><p className="mt-5 text-lg leading-8 text-[#505b70]">{content.lead}</p></header>
    <div className="overflow-hidden rounded-2xl border border-[#dce2ed] bg-white">
      <div className="border-b border-[#dce2ed] bg-[#f8f9fc] p-5 sm:p-6"><p className="mb-5 text-xs font-semibold uppercase tracking-wider text-[#60687a]">Ejemplo ilustrativo</p>
        {industry === "restaurantes" ? <div className="space-y-5">{[["Caja · 4 kg", "$3.000 / kg", "93.75%"], ["Bolsa · 2 kg", "$3.200 / kg", "100%"]].map(([label, amount, width]) => <div key={label}><div className="flex justify-between gap-4 text-sm"><span>{label}</span><strong className="tabular-nums">{amount}</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e4e7f1]"><div style={{width}} className="h-full rounded-full bg-[#5965d8]" /></div></div>)}</div> : industry === "hoteles" ? <div className="space-y-3">{[["Alimentos", "Cocina"], ["Amenidades", "Housekeeping"]].map(([from,to]) => <div key={from} className="flex items-center justify-between gap-3 rounded-lg border border-[#dce2ed] bg-white px-4 py-3 text-sm"><span>{from}</span><ArrowRight size={16} className="shrink-0 text-[#8e97a8]" aria-hidden="true" /><strong>{to}</strong></div>)}</div> : <div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-[#60687a]">10 cajas × 12</p><p className="mt-2 text-3xl font-semibold tabular-nums">120 <span className="text-xs font-normal">esperadas</span></p></div><div className="border-l border-[#dce2ed] pl-4"><p className="text-xs text-[#60687a]">Si falta una caja</p><p className="mt-2 text-3xl font-semibold tabular-nums">108 <span className="text-xs font-normal">recibidas</span></p></div></div>}
      </div>
      <p className="p-5 text-sm leading-7 text-[#505b70] sm:px-6">{content.example}</p>
    </div>
    <ol className="space-y-0">{content.steps.map(([title, text], index) => <li key={title} className="relative grid grid-cols-[2rem_1fr] gap-4 pb-7 last:pb-0"><span className="z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#cbd2df] bg-white text-xs font-semibold text-[#424ec0]">{index + 1}</span>{index < content.steps.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-4 top-8 w-px bg-[#dce2ed]" />}<div><h3 className="text-lg font-semibold">{title}</h3><p className="mt-2 leading-7 text-[#505b70]">{text}</p></div></li>)}</ol>
    <p className="border-l-2 border-[#cbd2df] pl-4 text-sm leading-7 text-[#60687a]">{content.limit}</p>
    <Link to={content.href} className="inline-flex min-h-11 items-center gap-2 rounded font-semibold text-[#424ec0] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-primary">{content.link}<ArrowRight size={17} aria-hidden="true" /></Link>
  </section>;
}
