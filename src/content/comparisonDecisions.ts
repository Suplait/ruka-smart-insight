export type ComparisonDecision = {
  keep: string;
  manual: string;
  outcome: string;
  question: string;
  inspect: [string, string, string];
};

// Buying criteria, not claims about features missing from another product.
export const comparisonDecisions: Record<string, ComparisonDecision> = {
  Emisso: {
    keep: "Las conexiones que necesita tu producto",
    manual: "Construir las reglas y resolver las excepciones",
    outcome: "Un proceso con responsables y un resultado definido",
    question: "¿Buscas datos para construir o un proceso para operar?",
    inspect: ["Origen y permisos de un documento", "Reglas que transforman esos datos", "Registro final y responsable de un fallo"],
  },
  Tupana: {
    keep: "El circuito de emisión y cobranza que ya funciona",
    manual: "Convertir facturas de proveedores en información útil",
    outcome: "Compras, insumos y costos en una unidad comparable",
    question: "¿El cuello de botella está en cobrar o en controlar las compras?",
    inspect: ["Producto tal como aparece en la factura", "Equivalencia con tu insumo y su unidad", "Costo por unidad, no solo total pagado"],
  },
  Wasabil: {
    keep: "Tus canales de venta y su catálogo",
    manual: "Ordenar lo que compras en otras presentaciones",
    outcome: "Información de compras que sirve para controlar costos",
    question: "¿Necesitas ordenar la venta online o lo que compras para vender?",
    inspect: ["Compra que repone una venta", "Relación entre proveedor, producto e insumo", "Quién actualiza stock y quién mantiene costos"],
  },
  Nubox: {
    keep: "La contabilidad y sus responsables",
    manual: "Reconstruir el detalle operativo de cada compra",
    outcome: "Productos, unidades y costos además del documento",
    question: "¿Qué necesita operaciones que no se resuelve con el asiento?",
    inspect: ["Documento que recibe contabilidad", "Detalle que necesita compras", "Información que llega a cada equipo al cerrar"],
  },
  Defontana: {
    keep: "Los módulos del ERP que ya te resuelven el día",
    manual: "Ingresar, relacionar y revisar compras a mano",
    outcome: "Un flujo definido alrededor de tus sistemas actuales",
    question: "¿Falta un ERP o falta terminar el trabajo alrededor del ERP?",
    inspect: ["Tarea que el ERP ya resuelve", "Paso manual que todavía hace el equipo", "Destino, permisos y resultado de la integración"],
  },
  Chipax: {
    keep: "Tu seguimiento de caja y pendientes",
    manual: "Entender qué se compró y cuánto llegó realmente",
    outcome: "Control de insumos, recepción y costos de la compra",
    question: "¿Necesitas saber qué pagaste o entender qué recibiste?",
    inspect: ["Factura asociada al movimiento bancario", "Cantidades recibidas y diferencias", "Efecto de la compra en el costo del insumo"],
  },
  KAME: {
    keep: "Órdenes, aprobaciones y módulos que ya utilizas",
    manual: "Descargar, digitar y relacionar información repetida",
    outcome: "Menos trabajo manual para mantener la compra al día",
    question: "¿Qué sigue haciendo tu equipo aunque ya tenga un ERP?",
    inspect: ["Recepción y controles ya cubiertos por KAME", "Digitación o equivalencias que aún son manuales", "Alcance concreto que vale la pena automatizar"],
  },
  Bsale: {
    keep: "Tu caja, catálogo y canales de venta",
    manual: "Reconocer insumos y comparar presentaciones de compra",
    outcome: "Costos comparables sin confundir compra con venta",
    question: "¿La caja funciona, pero compras sigue trabajando en planillas?",
    inspect: ["Producto que se vende en tu negocio", "Presentación en que se compra al proveedor", "Equivalencia y costo en una unidad común"],
  },
  Clay: {
    keep: "El cierre contable y su equipo responsable",
    manual: "Explicar cambios de costo desde cada compra",
    outcome: "Detalle de insumos para decidir, además del cierre",
    question: "¿Buscas cerrar las cuentas o entender por qué cambian los costos?",
    inspect: ["Documento usado para el cierre", "Insumo y presentación de la compra", "Costo comparable y diferencia de recepción"],
  },
};
