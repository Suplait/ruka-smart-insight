export const WORKS_NAME = "Ruka Works";
export const WORKS_PATH = "/works";
export const WORKS_CONTACT_PATH = "/works/contacto";

export const worksContent = {
  hero: {
    eyebrow: WORKS_NAME.toUpperCase(),
    title: "Hay procesos que no viven en ningún sistema. Viven en tu equipo.",
    lead: "Ruka los convierte en flujos que se ejecutan sobre tus sistemas, reglas y datos actuales.",
    body: "Si para que algo funcione alguien tiene que buscar, cruzar, validar, decidir y actualizar, queremos verlo.",
    primaryAction: "Revisar mi caso",
    secondaryAction: "Ver cómo funciona",
    microcopy: "30 min · Sin compromiso",
  },
  proof: {
    title: "Ruka ya procesa millones de registros operativos para cientos de empresas.",
  },
  familiar: {
    eyebrow: "TRABAJO QUE EL SOFTWARE NO TERMINÓ DE RESOLVER",
    title: "Si esto te suena familiar, estamos hablando de lo mismo.",
    patterns: [
      {
        number: "01",
        title: "Cada cierto tiempo alguien junta información de varios sistemas.",
        copy: "El dato existe. El trabajo está en buscarlo, cruzarlo y dejarlo donde corresponde.",
        kind: "converge",
      },
      {
        number: "02",
        title: "Cuando cambia algo, alguien tiene que replicarlo en otros lugares.",
        copy: "La operación termina dependiendo de que una persona mantenga dos o tres sistemas consistentes.",
        kind: "replicate",
      },
      {
        number: "03",
        title: "Una excepción se resuelve porque alguien conoce la regla de memoria.",
        copy: "El criterio existe, pero todavía vive en personas, mensajes o planillas.",
        kind: "rule",
      },
      {
        number: "04",
        title: "Si esa persona no está, el proceso espera.",
        copy: "El sistema funciona. El flujo completo, no necesariamente.",
        kind: "waiting",
      },
    ],
    transition: {
      title: "No necesitas llegar con la solución.",
      copy: "Solo con la parte de tu operación que todavía depende de trabajo manual.",
      action: "Revisar mi caso",
    },
  },
  comparison: {
    title: "La diferencia no es automatizar un paso. Es quién empuja el proceso.",
    lead: "Hoy una persona mueve cada caso de principio a fin. Con Ruka, el flujo corre y el equipo entra cuando realmente necesita decidir.",
    without: {
      label: "SIN RUKA",
      input: "Entrada",
      steps: [
        "Busca contexto",
        "Copia información",
        "Cruza datos",
        "Aplica una regla",
        "Pide aprobación",
        "Actualiza sistema",
        "Deja evidencia",
      ],
      close: "El proceso avanza porque una persona lo empuja.",
    },
    with: {
      label: "CON RUKA",
      input: "Entrada",
      steps: ["Busca contexto", "Cruza información", "Aplica reglas", "Ejecuta acciones"],
      decision: "¿Hay una excepción?",
      normal: "Ruka continúa",
      exception: "Decisión humana",
      finish: ["Actualiza sistemas", "Registra evidencia", "COMPLETADO"],
      close: "Tu equipo deja de operar cada caso. Entra cuando realmente necesita decidir.",
    },
  },
  method: {
    title: "Así pasamos del trabajo manual a un flujo operando.",
    steps: [
      {
        number: "01",
        verb: "ENTENDER",
        title: "Vemos cómo funciona hoy.",
        copy: "Recorremos qué activa el proceso, qué sistemas toca, qué reglas usa el equipo y dónde aparecen excepciones.",
        output: "Proceso entendido",
      },
      {
        number: "02",
        verb: "PONERLO A OPERAR",
        title: "Convertimos ese trabajo en un flujo real.",
        copy: "Conectamos sistemas, reglas y acciones, y lo probamos con casos reales antes de dejarlo operando.",
        output: "Flujo en producción",
      },
      {
        number: "03",
        verb: "MEJORAR",
        title: "Medimos lo que ocurre y reducimos excepciones.",
        copy: "Vemos qué ejecutó Ruka, dónde necesitó intervención y qué partes pueden automatizarse después.",
        output: "Cada vez menos trabajo manual",
      },
    ],
    technology: {
      title: "Agentes IA donde aportan. Reglas y controles donde importan.",
      copy: "Cada flujo puede combinar agentes IA, integraciones, reglas de negocio y revisión humana. Usamos el nivel de autonomía adecuado para cada parte del proceso.",
    },
    rail: ["Agentes IA", "Integraciones", "Reglas de negocio", "Revisión humana", "Trazabilidad"],
    statement: "El proceso puede ser específico. La tecnología debajo no parte de cero.",
    supporting: "Ruka reutiliza una base común para conectar sistemas, entender información, ejecutar reglas, actualizar datos y registrar lo que ocurrió.",
  },
  testimonial: {
    quote: "Información inmediata de volúmenes de compra, evolución de precios y control de pagos. Ahorro de HH en planillas.",
    author: "Hernán Sugg",
    role: "Socio, Barbazul",
  },
  faq: {
    title: "Preguntas antes de revisar un proceso.",
    items: [
      {
        question: "¿Qué procesos puede operar Ruka?",
        answer: "Ruka funciona mejor en procesos repetitivos que cruzan sistemas, documentos, reglas y decisiones. El punto de partida no es una lista cerrada de casos, sino entender cómo funciona hoy el proceso.",
      },
      {
        question: "¿Tengo que cambiar mi ERP o mis sistemas actuales?",
        answer: "No. Ruka se construye sobre los sistemas que tu empresa ya usa y ejecuta el trabajo entre ellos cuando es técnicamente posible integrarlos o interactuar con ellos.",
      },
      {
        question: "¿Qué pasa cuando Ruka encuentra una excepción?",
        answer: "El flujo puede detenerse, escalar el caso a una persona con el contexto necesario y continuar después de la decisión. La intervención humana forma parte del diseño cuando hace falta.",
      },
      {
        question: "¿Esto es desarrollo de software a medida?",
        answer: "No partimos desde cero para cada proceso. Usamos una base tecnológica común de Ruka y la configuramos para los sistemas, reglas y excepciones de cada operación.",
      },
    ],
  },
  finalCta: {
    title: "¿Hay una parte de tu operación que depende demasiado de una persona?",
    statement: "Revisémosla.",
    copy: "En 30 minutos vemos cómo funciona hoy y si tiene sentido que Ruka se haga cargo de parte del trabajo.",
    action: "Revisar mi caso",
    microcopy: "30 min · Sin compromiso",
  },
  contact: {
    eyebrow: "REVISIÓN DE CASO",
    title: "Veamos si Ruka puede hacerse cargo.",
    lead: "Déjanos tus datos y elige una hora. En la reunión partimos desde el proceso real.",
    calendarTitle: "Elige una hora.",
    calendarLead: "En 30 minutos vemos cómo funciona ese proceso y si tiene sentido abordarlo con Ruka.",
    successTitle: "Listo. Nos vemos en la reunión.",
    successCopy: "Partiremos entendiendo cómo funciona hoy el proceso y dónde está el trabajo manual.",
  },
  seo: {
    title: "Automatización de procesos empresariales | Ruka.ai",
    description: "Automatiza procesos que cruzan ERP, SII, correo, planillas y sistemas internos. Ruka ejecuta reglas, maneja excepciones y actualiza tus sistemas sin reemplazarlos.",
    canonical: "https://www.ruka.ai/works",
    image: "https://www.ruka.ai/ruka-works-og.png",
  },
} as const;

export type WorksLeadData = {
  name: string;
  company: string;
  email: string;
};

export const emptyWorksLead: WorksLeadData = {
  name: "",
  company: "",
  email: "",
};

export const worksDebugLead: WorksLeadData = {
  name: "María Operaciones",
  company: "Empresa de ejemplo",
  email: "maria@empresa.cl",
};
