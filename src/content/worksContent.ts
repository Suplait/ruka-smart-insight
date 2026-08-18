export const WORKS_NAME = "Ruka Works";
export const WORKS_PATH = "/works";
export const WORKS_CONTACT_PATH = "/works/contacto";

export const worksContent = {
  navigation: [
    { id: "como-funciona", label: "Cómo funciona" },
    { id: "casos", label: "Casos" },
    { id: "como-trabajamos", label: "Cómo trabajamos" },
  ],
  hero: {
    eyebrow: WORKS_NAME.toUpperCase(),
    title: "Tu operación tiene procesos que el software estándar no resuelve de punta a punta.",
    lead: "Ruka los convierte en flujos que se ejecutan sobre tus sistemas, reglas y datos actuales.",
    body: "Diseñamos y operamos flujos específicos para trabajo que hoy requiere personas moviendo información, aplicando reglas y coordinando varios sistemas.",
    primaryAction: "Cuéntanos el proceso",
    secondaryAction: "Ver cómo funciona",
    microcopy: "30 min · Sin compromiso",
  },
  pain: {
    eyebrow: "DÓNDE APARECE EL PROBLEMA",
    title: "El trabajo más difícil suele quedar entre sistemas.",
    lead: "El software resuelve piezas. El equipo termina operando todo lo que queda entre ellas.",
    patterns: [
      {
        number: "01",
        title: "Cruza varios sistemas",
        copy: "La información nace en una herramienta, se consulta en otra y termina registrada en una tercera. Entre medio, alguien mueve y transforma datos manualmente.",
        diagram: ["Origen", "Persona", "Destino"],
      },
      {
        number: "02",
        title: "Tiene reglas propias",
        copy: "El proceso depende de condiciones, tolerancias, excepciones, aprobaciones o criterios que son específicos de tu empresa.",
        diagram: ["Condición", "Regla", "Decisión"],
      },
      {
        number: "03",
        title: "Se repite constantemente",
        copy: "Ocurre cada día, cada semana o cada cierre. El trabajo vuelve aunque el caso cambie.",
        diagram: ["Hoy", "Mañana", "Cierre"],
      },
      {
        number: "04",
        title: "Depende de una persona",
        copy: "El proceso avanza porque alguien sabe qué mirar, dónde buscar y qué hacer cuando algo no coincide.",
        diagram: ["Buscar", "Entender", "Resolver"],
      },
    ],
    statement: "Si tu equipo puede mostrarnos el proceso paso a paso, podemos evaluar cuánto de ese trabajo puede operar Ruka.",
  },
  cases: {
    eyebrow: "ALGUNOS EJEMPLOS",
    title: "No construimos otro dashboard. Tomamos un proceso.",
    lead: "El flujo puede cambiar completamente según la empresa. Estos son ejemplos del tipo de trabajo que Ruka puede operar.",
    items: [
      {
        id: "conciliar",
        label: "01 · CONCILIAR ANTES DE PAGAR",
        title: "Revisar una factura antes de aprobarla.",
        problem: "Antes de pagar, alguien necesita comprobar información que puede estar repartida entre:",
        inputs: ["Factura", "Orden de compra", "Recepción", "Condiciones comerciales", "Registros previos", "Pagos"],
        execution: "Ruka obtiene la información desde los sistemas correspondientes, cruza documentos, aplica las reglas del negocio y separa solamente los casos que realmente necesitan revisión.",
        result: "El equipo deja de revisar todo. Se concentra en las diferencias.",
      },
      {
        id: "sincronizar",
        label: "02 · MANTENER SISTEMAS SINCRONIZADOS",
        title: "Cuando una operación termina en un sistema, pero el trabajo sigue en otro.",
        problem: "Un cambio ocurre en un sistema, pero después alguien debe buscar contexto, transformar información y reflejarla manualmente en otro.",
        inputs: ["ERP → POS", "SII → ERP", "Excel → sistema interno", "Correo → ERP"],
        execution: "Ruka detecta el cambio, obtiene los datos necesarios, aplica las transformaciones y reglas, actualiza el sistema destino y registra qué ocurrió.",
        result: "No automatizamos solamente A → B. Operamos el trabajo que existe entre A y B.",
      },
      {
        id: "cierre",
        label: "03 · PREPARAR UN CIERRE",
        title: "Juntar, validar y dejar listo lo que hoy se arma manualmente.",
        problem: "Al final de un período, distintas personas reúnen información desde ERP, bancos, POS, planillas, emails u otros sistemas para confirmar que la operación esté completa.",
        inputs: ["ERP", "Bancos", "POS", "Planillas", "Emails"],
        execution: "Ruka obtiene la información, identifica faltantes, cruza movimientos, ejecuta validaciones y deja las excepciones listas para revisión.",
        result: "El cierre deja de empezar con horas de preparación manual.",
      },
    ],
    interruption: {
      title: "Probablemente tu proceso no está en esta página.",
      lead: "Mejor. Muéstranos cómo funciona hoy.",
      action: "Cuéntanos el proceso",
    },
  },
  comparison: {
    eyebrow: "ANTES / DESPUÉS",
    title: "No se trata de automatizar un paso. Se trata de cambiar quién opera el proceso.",
    lead: "Hoy una persona empuja cada caso de principio a fin. Con Ruka, el flujo corre y el equipo entra cuando realmente necesita decidir.",
    without: {
      label: "SIN RUKA",
      steps: [
        ["Factura llega por correo", "Entrada"],
        ["abre documento", "PERSONA"],
        ["busca OC en ERP", "PERSONA"],
        ["compara montos", "PERSONA"],
        ["revisa recepción", "PERSONA"],
        ["corrige o decide", "PERSONA"],
        ["actualiza ERP", "PERSONA"],
        ["avisa que terminó", "PERSONA"],
      ],
      close: "El proceso vive en el tiempo y en la cabeza de una persona.",
    },
    with: {
      label: "CON RUKA",
      input: "Factura recibida",
      steps: ["Obtiene información", "Cruza sistemas", "Aplica reglas"],
      decision: "¿Hay una excepción?",
      normal: ["Actualiza sistemas", "Registra evidencia", "Proceso completado"],
      exception: ["Revisión humana", "Ruka continúa y registra el resultado"],
      close: "Tu equipo supervisa resultados y resuelve excepciones.",
    },
  },
  method: {
    eyebrow: "CÓMO TRABAJAMOS",
    title: "Del proceso que existe hoy a un flujo operando con Ruka.",
    steps: [
      {
        number: "01",
        verb: "MAPEAR",
        title: "Entendemos cómo funciona hoy.",
        copy: "Recorremos el proceso real: qué lo inicia, qué información necesita, qué sistemas toca, qué reglas aplica el equipo y qué excepciones aparecen.",
        output: "Mapa del proceso",
      },
      {
        number: "02",
        verb: "DISEÑAR",
        title: "Definimos qué opera Ruka y qué sigue siendo humano.",
        copy: "Separamos los pasos repetibles de las decisiones que todavía requieren revisión, y acordamos inputs, outputs, reglas y excepciones.",
        output: "Alcance claro",
      },
      {
        number: "03",
        verb: "IMPLEMENTAR",
        title: "Lo conectamos con tu operación.",
        copy: "Construimos el flujo sobre tus sistemas actuales y lo probamos con casos reales, incluyendo errores, excepciones y datos incompletos.",
        output: "Proceso en producción",
      },
      {
        number: "04",
        verb: "OPERAR",
        title: "Medimos y mejoramos.",
        copy: "Seguimos ejecución, excepciones y resultados para ajustar reglas y reducir cada vez más el trabajo manual.",
        output: "Operación mejorando",
      },
    ],
  },
  difference: {
    eyebrow: "POR QUÉ RUKA",
    title: "No es una automatización aislada ni software hecho desde cero.",
    items: [
      {
        number: "01",
        title: "Llegamos hasta la ejecución.",
        copy: "No nos quedamos en mostrar datos, generar una alerta o recomendar una acción. Ruka consulta, cruza, actualiza y deja el trabajo terminado dentro de tus sistemas.",
      },
      {
        number: "02",
        title: "Trabajamos con las reglas de tu operación.",
        copy: "Tolerancias, proveedores especiales, condiciones, aprobaciones y excepciones pueden formar parte del flujo.",
      },
      {
        number: "03",
        title: "Construimos sobre una base común.",
        copy: "Cada proceso puede ser distinto, pero no partimos desde cero. Reutilizamos la misma base para conectar sistemas, leer documentos, estructurar datos, ejecutar acciones y registrar evidencia.",
      },
    ],
    statement: "El proceso puede ser específico. La tecnología debajo no parte de cero.",
  },
  proof: {
    title: "Ruka ya procesa millones de registros operativos para cientos de empresas.",
    quote: "Información inmediata de volúmenes de compra, evolución de precios y control de pagos. Ahorro de HH en planillas.",
    author: "Hernán Sugg",
    role: "Socio, Barbazul",
  },
  finalCta: {
    eyebrow: "TU PROCESO",
    title: "Muéstranos cómo funciona hoy.",
    copy: "En 30 minutos revisamos el proceso, los sistemas que toca y qué tendría que pasar para que Ruka pueda operarlo.",
    action: "Cuéntanos el proceso",
    microcopy: "30 min · Sin compromiso",
  },
  contact: {
    eyebrow: "REVISIÓN DE PROCESO",
    title: "Cuéntanos qué quieres dejar de operar manualmente.",
    lead: "No necesitas definir la solución. Queremos entender cómo funciona hoy.",
    calendarTitle: "Revisemos el proceso juntos.",
    calendarLead: "En 30 minutos recorremos cómo funciona hoy, qué podría operar Ruka y qué necesitaríamos para implementarlo.",
    successTitle: "Listo. Ya tenemos el contexto.",
    successCopy: "En la reunión partiremos desde el proceso que nos contaste, así podemos ir directo a entender qué parte puede operar Ruka.",
  },
  seo: {
    title: `${WORKS_NAME} | Automatiza procesos que tu software no resuelve`,
    description: "Ruka convierte procesos operativos específicos en flujos que se ejecutan sobre los sistemas, reglas y datos que tu empresa ya usa.",
    canonical: "https://www.ruka.ai/works",
    image: "https://www.ruka.ai/ruka-works-og.png",
  },
} as const;

export const worksFrequencyOptions = [
  "Varias veces al día",
  "Todos los días",
  "Todas las semanas",
  "Todos los meses",
  "Otro",
] as const;

export const worksManualHoursOptions = [
  "Menos de 5 h / semana",
  "5-20 h / semana",
  "20-50 h / semana",
  "Más de 50 h / semana",
  "No sé",
] as const;

export type WorksFrequency = (typeof worksFrequencyOptions)[number];
export type WorksManualHours = (typeof worksManualHoursOptions)[number];

export type WorksLeadData = {
  processDescription: string;
  systems: string;
  frequency: WorksFrequency | "";
  manualHours: WorksManualHours | "";
  name: string;
  company: string;
  email: string;
  whatsapp: string;
};

export const emptyWorksLead: WorksLeadData = {
  processDescription: "",
  systems: "",
  frequency: "",
  manualHours: "",
  name: "",
  company: "",
  email: "",
  whatsapp: "",
};

export const worksDebugLead: WorksLeadData = {
  processDescription: "Recibimos facturas por correo, buscamos la orden en SAP, revisamos si la recepción coincide y actualizamos el ERP manualmente.",
  systems: "SAP, SII, correo",
  frequency: "Todos los días",
  manualHours: "20-50 h / semana",
  name: "María Operaciones",
  company: "Empresa de ejemplo",
  email: "maria@empresa.cl",
  whatsapp: "+56 9 1234 5678",
};
