export const ONE_NAME = "Ruka One";
export const ONE_PATH = "/one";
export const ONE_CONTACT_PATH = "/one/contacto";

export const oneContent = {
  hero: {
    eyebrow: ONE_NAME.toUpperCase(),
    title: "Tu empresa ya tiene los sistemas. Nosotros nos hacemos cargo del trabajo.",
    lead: "Ejecutamos procesos completos de tu back office con agentes de IA, integraciones y operación continua. Tu equipo deja de hacer la pega manual y nosotros respondemos por el resultado.",
    body: "No te vendemos otra herramienta para que tu equipo trabaje más rápido. Nos hacemos cargo de ejecutar, verificar e investigar lo que antes tenía que resolver una persona.",
    primaryAction: "Conversemos",
    secondaryAction: "Qué trabajo asumimos",
    microcopy: "30 min · Sin compromiso",
  },
  proof: {
    title: "La tecnología detrás de Ruka One se apoya en la experiencia de Ruka procesando millones de registros operativos para cientos de empresas.",
  },
  startingPoint: {
    eyebrow: "DOS FORMAS DE PARTIR",
    title: "Ruka parte de procesos que ya estandarizamos. Ruka One parte del tuyo.",
    copy: "Con Ruka puedes usar procesos que ya resolvimos como producto. Con Ruka One, empezamos por entender cómo funciona un proceso propio de tu empresa y trabajamos contigo para llevarlo a operar sobre la misma base tecnológica de Ruka.",
    options: [
      {
        name: "RUKA",
        copy: "Partimos desde un proceso que ya estandarizamos como producto.",
      },
      {
        name: "RUKA ONE",
        copy: "Partimos desde cómo funciona tu empresa hoy.",
      },
    ],
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
      action: "Conversemos",
    },
  },
  comparison: {
    title: "La diferencia no es automatizar un paso. Es quién empuja el proceso.",
    lead: "Hoy alguien empuja cada caso de principio a fin. Con Ruka One, diseñamos el flujo para que avance y tu equipo entre cuando realmente necesita decidir.",
    without: {
      label: "SIN RUKA ONE",
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
      label: "CON RUKA ONE",
      input: "Entrada",
      steps: ["Busca contexto", "Cruza información", "Aplica reglas", "Ejecuta acciones"],
      decision: "¿Hay una excepción?",
      normal: "El flujo continúa",
      exception: "Decisión humana",
      finish: ["Actualiza sistemas", "Registra evidencia", "COMPLETADO"],
      close: "Tu equipo deja de operar cada caso. Entra cuando realmente necesita decidir.",
    },
  },
  method: {
    title: "Del proceso actual a una operación de la que nos hacemos responsables.",
    steps: [
      {
        number: "01",
        verb: "ENTENDER",
        title: "Partimos por cómo funciona hoy.",
        copy: "Recorremos contigo qué activa el proceso, qué sistemas toca, qué reglas usa el equipo y dónde aparecen excepciones.",
        output: "Proceso entendido",
      },
      {
        number: "02",
        verb: "CONSTRUIR",
        title: "Conectamos y ponemos a operar.",
        copy: "Conectamos sistemas, reglas y acciones, y lo probamos con casos reales antes de ponerlo a operar.",
        output: "Flujo en producción",
      },
      {
        number: "03",
        verb: "OPERAR Y MEJORAR",
        title: "Lo operamos, verificamos y mejoramos.",
        copy: "Monitoreamos el resultado, investigamos las excepciones y escalamos las decisiones que requieren al cliente. Mejoramos la cobertura con evidencia.",
        output: "Resultado y seguimiento acordados",
      },
    ],
    technology: {
      title: "La tecnología se adapta al proceso, no al revés.",
      copy: "Cada flujo puede combinar agentes IA, integraciones, reglas de negocio y revisión humana según lo que necesite cada parte.",
    },
    rail: ["Agentes IA", "Integraciones", "Reglas de negocio", "Revisión humana", "Trazabilidad"],
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
        question: "¿Qué es Ruka One?",
        answer: "Ruka One es nuestra forma de trabajar procesos específicos de una empresa. Partimos por entender cómo funcionan hoy y los llevamos a operar sobre la base tecnológica de Ruka.",
      },
      {
        question: "¿Cuál es la diferencia entre Ruka y Ruka One?",
        answer: "Con Ruka partes desde procesos que ya hemos estandarizado como producto. Con Ruka One, el punto de partida es un proceso propio de tu empresa, con sus sistemas, reglas y excepciones. La base tecnológica es la misma.",
      },
      {
        question: "¿Qué tipo de procesos trabajamos con Ruka One?",
        answer: "Procesos repetitivos que hoy dependen de personas para buscar información, cruzar sistemas, aplicar reglas, resolver excepciones o mantener datos actualizados. Partimos por cómo funciona tu proceso, no por una lista cerrada de casos.",
      },
      {
        question: "¿Tengo que cambiar mi ERP o mis sistemas actuales?",
        answer: "No. Con Ruka One trabajamos sobre los sistemas que tu empresa ya usa y definimos cómo conectarlos o interactuar con ellos según lo que requiera el proceso.",
      },
      {
        question: "¿Ruka One usa agentes IA?",
        answer: "Sí, cuando aportan. Un flujo puede combinar agentes IA, integraciones, reglas determinísticas y revisión humana. Elegimos qué usar en cada parte según el trabajo que hay que hacer y el nivel de control que necesita.",
      },
      {
        question: "¿Qué pasa cuando aparece una excepción?",
        answer: "El flujo puede pedir una decisión humana con el contexto necesario y continuar después. Las excepciones se diseñan como parte del proceso, no quedan fuera de él.",
      },
      {
        question: "¿Esto es desarrollo de software a medida?",
        answer: "No partimos desde cero. Con Ruka One usamos la plataforma de Ruka y la adaptamos al proceso, sistemas, reglas y excepciones de tu operación.",
      },
    ],
  },
  finalCta: {
    title: "¿Qué proceso te gustaría dejar de ejecutar manualmente?",
    statement: "Revisémosla.",
    copy: "Conversemos 30 minutos sobre el trabajo que hoy hace tu equipo, qué resultado necesitas y qué parte podemos asumir nosotros.",
    action: "Conversemos",
    microcopy: "30 min · Sin compromiso",
  },
  contact: {
    eyebrow: "RUKA ONE",
    title: "¿Qué parte de tu operación sigue siendo manual?",
    lead: "Elige una hora y cuéntanos cómo funciona hoy. Vemos contigo cómo llevar ese proceso a operar sobre Ruka.",
    calendarTitle: "Elige una hora.",
    calendarLead: "Nos cuentas cómo funciona hoy y vemos juntos cómo llevarlo a operar sobre Ruka.",
    successTitle: "Listo. Nos vemos.",
    successCopy: "Partimos por tu proceso tal como funciona hoy.",
  },
  seo: {
    title: "Operación de back office con agentes IA | Ruka One",
    description: "Ruka One asume la ejecución de procesos de back office con agentes IA, integraciones y seguimiento continuo. Tu equipo decide; nosotros hacemos el trabajo.",
    serviceDescription: "Ruka One asume la ejecución de procesos de back office mediante agentes IA, integraciones, controles y operación continua, con responsabilidades y resultados acordados.",
    canonical: "https://www.ruka.ai/one",
    image: "https://www.ruka.ai/ruka-one-og.png",
  },
} as const;

export type OneLeadData = {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
};

export const emptyOneLead: OneLeadData = {
  name: "",
  company: "",
  email: "",
  whatsapp: "",
};

export const oneDebugLead: OneLeadData = {
  name: "María Operaciones",
  company: "Empresa de ejemplo",
  email: "maria@empresa.cl",
  whatsapp: "987654321",
};
