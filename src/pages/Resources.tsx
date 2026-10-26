import { ArrowUpRight, Calculator, FileCheck2, BookOpen, Cable } from "lucide-react";
import { Link } from "react-router-dom";
import { ResourceLayout, resourceLinkClass } from "@/components/resources/ResourceLayout";

const groups = [
  { id: "calcular", icon: Calculator, title: "Ponle números a una compra.", lead: "Herramientas gratuitas. Tus datos se quedan en el navegador.", items: [
    { title: "Costo por kilo, litro o unidad", text: "Lleva cajas, bolsas y formatos distintos a una misma unidad de comparación.", href: "/herramientas/costo-unitario", label: "Calcular costo" },
    { title: "Variación de costos", text: "Compara dos compras con distinto formato, IVA o descuento. Mira qué cambió de verdad.", href: "/herramientas/variacion-costos", label: "Comparar compras" },
    { title: "Margen y markup", text: "Distingue margen sobre venta de recargo sobre costo. Calcula ambos y un precio objetivo.", href: "/herramientas/margen-markup", label: "Calcular margen" },
  ] },
  { id: "revisar", icon: FileCheck2, title: "Encuentra lo que no cuadra.", lead: "De la factura al pago, sin perder de vista lo recibido.", items: [
    { title: "Identificar un proveedor", text: "Busca por marca, razón social o RUT y revisa el canal oficial antes de registrar la compra.", href: "/proveedores", label: "Abrir directorio" },
    { title: "Recepción, documentos y SII", text: "Separa el control operativo de los eventos tributarios. Revisa ejemplos y fuentes oficiales.", href: "/guias/compras", label: "Explorar las guías" },
    { title: "Factura, orden y recepción", text: "Carga tus CSV, revisa las diferencias y descarga el resultado de la comparación.", href: "/herramientas/conciliar-factura-orden-recepcion", label: "Abrir conciliador" },
    { title: "Preparar la nómina del banco", text: "Qué revisar antes de generar el archivo para pagar a tus proveedores.", href: "/blog/nomina-pagos-proveedores-banco", label: "Leer la guía" },
  ] },
  { id: "conectar", icon: Cable, title: "Trabaja con tus sistemas.", lead: "Entiende dónde encaja cada conexión antes de implementarla.", items: [
    { title: "Desarrolladores e integradores", text: "Compras, clasificación, documentos y webhooks para tu ERP o tu propio dashboard.", href: "/desarrolladores", label: "Explorar la API" },
    { title: "Explorar integraciones", text: "SII, sistemas de gestión, POS y otras fuentes de tu operación.", href: "/integraciones", label: "Ver conexiones" },
    { title: "Registrar compras en Toteat", text: "Qué información preparar, cómo revisar equivalencias y dónde controlar el resultado.", href: "/procesos/registrar-compras-toteat", label: "Ver el proceso" },
  ] },
  { id: "entender", icon: BookOpen, title: "Decide qué automatizar primero.", lead: "Guías para bajar una idea a un proceso concreto.", items: [
    { title: "Qué hay de nuevo", text: "Los recursos y mejoras publicados, con un enlace directo para usarlos.", href: "/novedades", label: "Ver novedades" },
    { title: "Aprender a usar Ruka", text: "Pasos, requisitos y qué hacer si algo no cuadra: compras, recepción, insumos, pagos y facturación.", href: "/ayuda", label: "Abrir centro de ayuda" },
    { title: "Emitir con RukaFactura", text: "Prepara documentos, revisa importes y conoce los requisitos de tu empresa antes de emitir.", href: "/productos/facturacion-electronica", label: "Conocer el facturador" },
    { title: "Comparar soluciones", text: "Ruka y Tupana, Excel o automatización, OCR o un proceso completo. Elige según el trabajo pendiente.", href: "/comparar", label: "Explorar comparaciones" },
    { title: "Excel o registro automático", text: "Qué cambia cuando el registro de compras deja de depender de una planilla manual.", href: "/blog/registro-compras-excel-vs-automatizacion", label: "Comparar enfoques" },
    { title: "OCR no es registro automático", text: "Leer una factura y dejarla bien registrada son tareas distintas. Revisa qué falta entre ambas.", href: "/blog/ocr-facturas-vs-registro-automatico", label: "Leer la guía" },
  ] },
];

export default function Resources() {
  return <ResourceLayout path="/recursos" title="Recursos para compras, costos y automatización | Ruka" heading="Resuelve una tarea. Sigue con tu operación." description="Calculadoras, guías y ejemplos para entender tus costos, revisar compras y conectar los sistemas que ya usas." eyebrow="Recursos de Ruka">
    <nav aria-label="Tareas" className="mb-16 flex flex-wrap gap-x-7 gap-y-2 border-y border-[#dce2ed] py-4">{groups.map(group => <a href={`#${group.id}`} key={group.id} className={resourceLinkClass}>{group.id[0].toUpperCase() + group.id.slice(1)}</a>)}</nav>
    <div className="space-y-16">{groups.map(({ id, icon: Icon, title, lead, items }, index) => <section key={id} id={id} className="grid scroll-mt-28 gap-7 lg:grid-cols-[0.8fr_1.6fr] lg:gap-16">
      <header><p className="mb-4 flex items-center gap-3 text-sm font-medium text-[#424ec0]"><Icon size={20} aria-hidden="true" /> 0{index + 1}</p><h2 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight">{title}</h2><p className="mt-4 max-w-sm leading-7 text-[#505b70]">{lead}</p></header>
      <div className="divide-y divide-[#dce2ed] border-y border-[#dce2ed]">{items.map(item => <article key={item.href} className="py-7 first:pt-6"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-3 max-w-xl leading-7 text-[#505b70]">{item.text}</p><Link to={item.href} className={`${resourceLinkClass} mt-3`}>{item.label}<ArrowUpRight size={18} aria-hidden="true" /></Link></article>)}</div>
    </section>)}</div>
  </ResourceLayout>;
}
