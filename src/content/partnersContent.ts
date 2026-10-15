export const partnersPath = "/partners";
export const partnersTitle = "Automatización para consultoras de restaurantes | Ruka";
export const partnersDescription = "Potencia tu consultoría gastronómica con Ruka: compras y conciliaciones automatizadas, insumos maestros, costos unitarios y API para tus propios dashboards.";

// Illustrative, net CLP prices. Quantities are expressed in the ingredient's base unit.
export const ingredientExamples = [
  { name: "Tomate cherry", unit: "kg", purchases: [
    { name: "Tomate cherry caja", pack: "Caja de 6 kg", quantity: 6, price: 18000 },
    { name: "Cherry selección", pack: "Bolsa de 2 kg", quantity: 2, price: 6800 },
  ] },
  { name: "Queso mantecoso", unit: "kg", purchases: [
    { name: "Q. mantecoso barra", pack: "Barra de 3 kg", quantity: 3, price: 22500 },
    { name: "Queso mantecoso trozo", pack: "Envase de 500 g", quantity: 0.5, price: 4200 },
  ] },
  { name: "Aceite de maravilla", unit: "litro", purchases: [
    { name: "Aceite maravilla bidón", pack: "Bidón de 5 litros", quantity: 5, price: 9500 },
    { name: "Aceite maravilla botella", pack: "Botella de 1 litro", quantity: 1, price: 2200 },
  ] },
] as const;

export function unitCost(purchase: { price: number; quantity: number }) {
  if (!Number.isFinite(purchase.quantity) || purchase.quantity <= 0 || !Number.isFinite(purchase.price) || purchase.price < 0) throw new RangeError("A valid price and positive base-unit quantity are required.");
  return purchase.price / purchase.quantity;
}

export const partnerComparison = [
  { task: "Preparar la reunión", without: "Pedir archivos, reunir compras y ordenar la información antes de analizar.", with: "Compras registradas y organizadas para dedicar la reunión a lo que cambia en el negocio." },
  { task: "Entender qué se compra", without: "El mismo insumo aparece con nombres y presentaciones distintos según el proveedor.", with: "Insumos maestros y equivalencias para trabajar con una identidad común por producto." },
  { task: "Revisar los costos", without: "Convertir cajas, bolsas y gramos a mano para comparar precios.", with: "Costos llevados a una unidad común para detectar variaciones y revisar su impacto en el margen." },
  { task: "Entregar tu análisis", without: "Rearmar la base de la planilla o del dashboard cada vez que llegan datos nuevos.", with: "Usar la API de Ruka para alimentar tus propios dashboards con la información autorizada de cada cliente." },
] as const;

export const partnerProcesses = [
  {
    label: "Registro de compras",
    id: "compras",
    shortLabel: "Compras",
    title: "Que preparar la información no se coma tu asesoría.",
    benefit: "Llega al análisis sin reconstruir las compras del mes.",
    image: "/assets/partners/compras.webp",
    imageAlt: "Bandeja de facturas de compra de Ruka, con documentos, proveedores y estados de revisión.",
    caption: "Bandeja de compras de Ruka, con datos de ejemplo.",
    manual: "Volver a digitar cada factura.",
    outcome: "Compras registradas donde hacen falta.",
    consultant: "Defines productos, unidades y dónde debe quedar cada compra.",
    ruka: "Lee la información y prepara o ejecuta el registro según las conexiones y reglas acordadas.",
    review: "Productos nuevos, unidades sin equivalencia y datos incompletos.",
    path: "/productos/registro-de-compras",
  },
  {
    label: "Conciliaciones",
    id: "conciliaciones",
    shortLabel: "Conciliaciones",
    title: "Dedica la revisión a lo que no calza.",
    benefit: "Conversa sobre una diferencia concreta, no sobre cuatro archivos separados.",
    image: "/assets/partners/recepcion.webp",
    imageAlt: "Recepción de una factura en Ruka: cantidades recibidas, incidencias y comentario de la entrega.",
    caption: "Recepción registrada por el equipo, con datos de ejemplo.",
    manual: "Cruzar documentos uno por uno.",
    outcome: "Diferencias a la vista, sin revisar todo a mano.",
    consultant: "Defines qué debe coincidir y quién resuelve una diferencia.",
    ruka: "Cruza facturas, órdenes y recepciones disponibles, y separa lo que necesita revisión.",
    review: "Entregas incompletas, precios distintos y documentos faltantes.",
    path: "/productos/conciliacion-automatica",
  },
  {
    label: "Costos y margen",
    id: "costos",
    shortLabel: "Costos",
    title: "Habla de decisiones. No de actualizar la planilla.",
    benefit: "Usa la información de compras y ventas para acompañar las decisiones del restaurante.",
    image: "/assets/partners/indicadores.webp",
    imageAlt: "Panel de Ruka con compras frente a ventas e indicadores para el seguimiento de la operación.",
    caption: "Panel de Ruka: compras frente a ventas y evolución de la operación.",
    manual: "Armar de nuevo la misma planilla.",
    outcome: "Costos actualizados para conversar sobre el negocio.",
    consultant: "Defines las equivalencias y los criterios de cálculo que usa tu asesoría.",
    ruka: "Procesa los datos disponibles y actualiza los costos y cálculos configurados en Ruka.",
    review: "Cambios de formato, información pendiente y variaciones que requieren una decisión.",
    path: "/productos/panel-control",
  },
] as const;

export const partnerFaqs = [
  { question: "¿Tenemos que usar un POS específico?", answer: "No planteamos la colaboración alrededor de una sola marca. Revisamos el POS, ERP, facturador y archivos de cada cliente. La lectura y la escritura disponibles dependen del acceso, los permisos y las capacidades de cada sistema; las confirmamos antes de proponer una automatización." },
  { question: "¿Ruka reemplaza el trabajo de la consultora?", answer: "La propuesta es complementar tu asesoría. Tú aportas el diagnóstico, los criterios del negocio y el acompañamiento al cliente. Ruka se encarga de los pasos repetitivos que acordemos automatizar. Definimos por escrito quién atiende al cliente y quién resuelve cada tipo de incidencia." },
  { question: "¿Podemos usar la API para nuestros propios dashboards?", answer: "Sí. Ruka tiene API para construir tus propios dashboards y análisis sobre la información de tus clientes. Acordamos qué datos necesitas, qué información está disponible y los permisos de cada cliente. No implica acceso automático a toda tu cartera ni un conector listo para cualquier herramienta." },
  { question: "¿Qué son los insumos maestros y los costos unitarios?", answer: "Un insumo maestro reúne las equivalencias de un producto que puede llegar con nombres y presentaciones diferentes. Con las cantidades y conversiones definidas, Ruka lleva los costos a una unidad común, como kilo, litro o unidad. Tu criterio es importante: productos con distinta calidad o rendimiento no se vuelven equivalentes solo por tener un nombre parecido." },
  { question: "¿Cómo funciona el acuerdo comercial?", answer: "Lo definimos contigo según el proceso, la implementación y el acompañamiento necesarios. Antes de presentar una propuesta al cliente, acordamos alcance, responsabilidades, costos y forma de contratación. Esta página no ofrece comisiones ni exige exclusividad." },
  { question: "¿Qué necesitamos para la primera conversación?", answer: "Un ejemplo de trabajo manual que se repita y los nombres de los sistemas que toca. No necesitas traer facturas, datos personales ni contraseñas de tus clientes. Si después evaluamos un caso real, acordamos primero los permisos y cómo compartir la información." },
  { question: "¿Podemos empezar con un solo cliente?", answer: "Sí. Es la forma que proponemos: un cliente, un proceso y un resultado acordado. Confirmamos la viabilidad, probamos el recorrido con autorización y revisamos el resultado antes de ampliar el alcance." },
] as const;

export const partnerSources = ["POS y facturas", "ERP o sistema contable", "Planillas y archivos", "Varios sistemas", "Todavía por confirmar"] as const;

export function createPartnerBrief(process: string, source: string) {
  return `Quiero conversar sobre una colaboración con Ruka.\n\nProceso a revisar: ${process}.\nFuentes o sistemas: ${source}.\n\nPara completar en la conversación:\n- Qué trabajo se repite hoy y con qué frecuencia.\n- Dónde debería quedar el resultado.\n- Qué reglas aplica nuestra consultora.\n- Quién resuelve las excepciones.\n- Cómo comprobaremos que funciona.\n\nPrimero queremos confirmar viabilidad, responsabilidades y alcance. No incluye datos ni autorización de acceso de un cliente.`;
}
