export type ProductResource = { href: string; title: string; description: string; kind: "Guía" | "Herramienta" | "Integración" };

export const productResources: Record<string, ProductResource[]> = {
  "/productos/registro-de-compras": [
    { href: "/procesos/registrar-compras-toteat", title: "Del documento a una compra en Toteat", description: "Qué reunir, qué relacionar y qué revisar con tu equipo antes del registro.", kind: "Guía" },
    { href: "/integraciones/idtecloud", title: "Recupera documentos desde iDTECloud", description: "Cómo incorporar esta fuente al registro de compras, con sus accesos y alcance.", kind: "Integración" },
    { href: "/blog/registro-compras-excel-vs-automatizacion", title: "¿Seguir con Excel o automatizar el registro?", description: "Qué resuelve una planilla y qué trabajo sigue quedando en tu equipo.", kind: "Guía" },
    { href: "/blog/ocr-facturas-vs-registro-automatico", title: "Leer una factura no es lo mismo que registrarla", description: "La diferencia entre extraer datos y dejarlos en el sistema correcto.", kind: "Guía" },
    { href: "/integraciones/sii", title: "Qué información se puede tomar del SII", description: "Fuentes, accesos y límites que conviene revisar antes de empezar.", kind: "Integración" },
  ],
  "/productos/conciliacion-automatica": [
    { href: "/herramientas/conciliar-factura-orden-recepcion", title: "Compara tus CSV y descarga las diferencias", description: "Orden de compra, factura y recepción. Sin registro; tus archivos se procesan localmente.", kind: "Herramienta" },
    { href: "/blog/conciliacion-dos-vs-tres-documentos", title: "¿Cruzar dos documentos o también la recepción?", description: "Qué puedes comprobar con cada cruce y qué todavía queda pendiente.", kind: "Guía" },
    { href: "/integraciones/chipax", title: "Trae los XML de compras desde Chipax", description: "Accesos y límites del ingreso de documentos. No es una conciliación bancaria.", kind: "Integración" },
  ],
  "/productos/cuentas-por-pagar": [
    { href: "/blog/nomina-pagos-proveedores-banco", title: "Prepara una nómina de proveedores para el banco", description: "Qué revisar antes de exportar el archivo y cargarlo a tu banco.", kind: "Guía" },
    { href: "/herramientas/conciliar-factura-orden-recepcion", title: "Revisa diferencias antes de preparar el pago", description: "Un cruce local de cantidades y precios, con un resultado descargable.", kind: "Herramienta" },
  ],
  "/productos/panel-control": [
    { href: "/herramientas/costo-unitario", title: "Calcula tu costo por kilo, litro o unidad", description: "Convierte cajas y envases a una base comparable, con descuento e IVA separados.", kind: "Herramienta" },
    { href: "/herramientas/variacion-costos", title: "¿Subió el costo o cambió el formato?", description: "Compara dos compras del mismo insumo y descarga el resultado.", kind: "Herramienta" },
    { href: "/herramientas/margen-markup", title: "Distingue margen de markup antes de fijar un precio", description: "Prueba ambos porcentajes y calcula un precio con margen objetivo.", kind: "Herramienta" },
    { href: "/blog/actualizar-costos-precios-proveedores", title: "Cuando cambia el precio del proveedor", description: "Cómo revisar unidades, costos y reglas antes de actualizar el margen.", kind: "Guía" },
    { href: "/integraciones/toteat", title: "Lleva las compras revisadas a Toteat", description: "Productos, unidades y locales que debes relacionar antes del envío.", kind: "Integración" },
  ],
  "/productos/stock": [
    { href: "/procesos/registrar-compras-toteat", title: "Compras, unidades y recepción en Toteat", description: "Una guía para preparar el registro sin perder de vista lo que realmente llegó.", kind: "Guía" },
    { href: "/blog/actualizar-costos-precios-proveedores", title: "Caja, kilo y unidad no son intercambiables", description: "Cómo evitar que una diferencia de formato termine alterando tus costos.", kind: "Guía" },
    { href: "/blog/conciliar-facturas-ordenes-compra-recepciones", title: "El inventario parte por lo que realmente recibiste", description: "Factura, orden y recepción: los cruces que ayudan a detectar diferencias.", kind: "Guía" },
  ],
};
