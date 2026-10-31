export const ONE_NAME = "Ruka One";
export const ONE_PATH = "/one";
export const ONE_CONTACT_PATH = "/one/contacto";

export const oneContent = {
  hero: {
    eyebrow: "Ruka One · IA y automatización a medida",
    eyebrowShort: "Ruka One",
    eyebrowRest: " · IA y automatización a medida",
    titleLines: ["Nos hacemos cargo", "del trabajo que hoy", "le quita tiempo", "a tu equipo."],
    title: "Nos hacemos cargo del trabajo que hoy le quita tiempo a tu equipo.",
    lead: "Ruka One asume procesos completos de tu empresa. Combinamos agentes de IA, automatización y supervisión humana para ejecutar el trabajo manual que aún queda en tu empresa.",
    primaryAction: "Conversemos",
    secondaryAction: "Cómo funciona",
    microcopy: "Ni otra licencia ni un desarrollo que queda solo.",
    beacon: {
      kicker: "Un proceso funcionando",
      text: "Miles de tareas. Un resultado.",
    },
    areasLabel: "Áreas donde trabaja Ruka One",
    areas: ["Ventas", "Marketing", "Atención", "Customer success", "Operaciones", "Finanzas", "Back office"],
    areasMore: "y tus procesos propios",
  },
  between: {
    id: "entre",
    eyebrow: "El trabajo que nadie ve",
    title: "El trabajo que más cuesta no vive en ningún sistema. Vive entre ellos.",
    fragments: [
      "Entre un lead y el primer contacto.",
      "Entre una solicitud y su respuesta.",
      "Entre un área y la siguiente.",
      "Entre el ERP y el banco.",
      "Entre lo prometido y lo entregado.",
    ],
    close: "Ahí alguien persigue, copia, cruza, recuerda y reintenta. Todos los días. Cuando ese tramo funciona, el lead recibe respuesta, el cliente su seguimiento y el cierre deja de esperar.",
  },
  difference: {
    id: "diferencia",
    eyebrow: "La diferencia",
    title: "Menos herramientas que administrar. Más trabajo hecho.",
    lead: "El software entrega capacidades, y muchas veces automatiza y mide. Pero alguien tiene que adaptarlo a tu proceso, conectarlo y sostenerlo. En Ruka One asumimos ese trabajo: implementamos la solución sobre tus sistemas y la acompañamos mientras opera.",
    label: "Comprar herramientas frente a que el proceso funcione",
    columns: ["Comprar herramientas", "Que el proceso funcione"],
    rows: [
      { question: "¿Qué obtienes?", software: "Capacidades para configurar.", one: "Un proceso implementado." },
      { question: "¿Quién lo integra?", software: "Tu equipo o un integrador.", one: "Nosotros, sobre tus sistemas." },
      { question: "¿Qué queda funcionando?", software: "Lo que tu equipo configure y sostenga.", one: "El trabajo diario, resuelto." },
      { question: "¿Quién acompaña la operación?", software: "Soporte de la plataforma.", one: "Un equipo que sigue y ajusta." },
      { question: "¿Cómo se mide?", software: "Uso de la herramienta.", one: "Resultados contra lo acordado." },
    ],
    note: "Tener herramientas no es lo mismo que tener el trabajo hecho.",
  },
  how: {
    id: "como-funciona",
    eyebrow: "Cómo ocurre",
    title: "Así tu proceso empieza a funcionar.",
    /** Each stage drives one preset of the field, in order. */
    stages: [
      { scene: "how-need", label: "Lo pendiente", text: "Entendemos dónde se pierden tiempo, clientes u oportunidades." },
      { scene: "how-build", label: "A tu medida", text: "Diseñamos la solución y la conectamos a tus sistemas." },
      { scene: "how-run", label: "Funcionando", text: "Opera con casos reales y la acompañamos día a día." },
      { scene: "how-result", label: "Resultado medible", text: "Lo medimos contra lo acordado y seguimos mejorando." },
    ],
  },
  scope: {
    id: "alcance",
    eyebrow: "El alcance",
    title: "Cada caso empieza con un compromiso por escrito.",
    lead: "Tu empresa tiene procesos propios. Antes de implementar acordamos qué tiene que ocurrir, cómo lo vamos a medir y dónde están los bordes.",
    edges: [
      { side: "start", label: "El objetivo", text: "El problema u oportunidad que vamos a mover, y desde qué punto partimos." },
      { side: "top", label: "Qué se implementa", text: "La solución, sus integraciones y el trabajo que hará, sobre qué sistemas." },
      { side: "end", label: "Cómo lo medimos", text: "El resultado esperado y los indicadores con que lo vamos a revisar." },
      { side: "bottom", label: "Límites y evolución", text: "Qué queda fuera, qué pasa con las excepciones y cuándo ampliamos." },
    ],
    implementation: {
      title: "Primero un caso. Después, más.",
      copy: "Empezamos con un proceso focalizado, lo probamos con casos reales junto a quienes lo hacen hoy y ampliamos cuando muestra resultados. Tu equipo aporta lo que mejor conoce: el proceso, los accesos y la validación.",
    },
  },
  areas: {
    id: "ejemplos",
    eyebrow: "Ejemplos",
    title: "Cada área tiene algo que hoy se queda pendiente.",
    lead: "Algunas oportunidades frecuentes y cómo se notaría el cambio. Cada solución se diseña para cómo trabaja tu empresa.",
    disclaimer: "Ejemplo ilustrativo",
    labels: { problem: "Oportunidad", work: "Qué cambia", result: "Cómo lo medimos" },
    items: [
      {
        name: "Ventas",
        example: "Que ningún lead quede sin respuesta.",
        problem: "Leads que llegan por varios canales y esperan horas o días.",
        work: "Cada lead recibe respuesta y seguimiento por los canales autorizados, se califica con tus criterios y llega agendado a tu equipo.",
        result: "Tiempo de primera respuesta, leads con seguimiento y reuniones agendadas.",
      },
      {
        name: "Marketing",
        example: "Campañas que salen a tiempo.",
        problem: "Señales de clientes y del mercado que nadie alcanza a revisar.",
        work: "Los segmentos con oportunidad se detectan a tiempo y cada campaña queda lista para salir con tus reglas.",
        result: "Campañas a tiempo, respuesta y conversión por segmento.",
      },
      {
        name: "Customer success",
        example: "Retener antes de que sea tarde.",
        problem: "Señales de que un cliente se enfría que aparecen tarde o dispersas.",
        work: "Uso, solicitudes y pagos se cruzan a diario, y las cuentas en riesgo llegan a tu equipo con contexto y un siguiente paso.",
        result: "Cuentas en riesgo detectadas antes, seguimiento realizado y retención.",
      },
      {
        name: "Atención",
        example: "Responder rápido lo que se repite.",
        problem: "Las mismas preguntas y gestiones consumen al equipo cada día.",
        work: "Las solicitudes recurrentes se resuelven dentro de lo acordado y el resto llega a tu equipo con todo el contexto.",
        result: "Tiempo de respuesta, solicitudes resueltas y casos derivados.",
      },
      {
        name: "Operaciones",
        example: "Anticipar incidencias en las entregas.",
        problem: "Coordinar rutas, entregas e incidencias depende de llamadas y planillas.",
        work: "Cada entrega se sigue, los desvíos se avisan a quien corresponde y cada incidencia queda registrada hasta su cierre.",
        result: "Incidencias detectadas a tiempo, entregas cumplidas y horas de coordinación.",
      },
      {
        name: "Finanzas",
        example: "Cerrar el mes con menos horas.",
        problem: "Validar documentos, conciliar y perseguir pagos toma días de trabajo manual.",
        work: "Facturas validadas contra órdenes y recepciones, bancos conciliados con el ERP y cobranza con el tono acordado.",
        result: "Horas de conciliación, diferencias explicadas y días de cobro.",
      },
      {
        name: "¿Y tu proceso?",
        example: "El que hoy frena a tu empresa.",
        problem: "Un proceso propio, con tus reglas y sistemas, que depende de alguien que lo empuje.",
        work: "Lo revisamos contigo y definimos qué solución, integraciones y acompañamiento necesitaría.",
        result: "Un primer alcance con objetivo e indicadores para partir con foco.",
      },
    ],
  },
  impact: {
    id: "impacto",
    eyebrow: "Impacto medible",
    title: "La IA es el medio. El trabajo hecho y su impacto son el producto.",
    lead: "Cada caso parte con objetivos e indicadores acordados y, cuando es posible, una línea base para comparar el antes y el después. Revisamos el impacto contigo de forma periódica.",
    metricsLabel: "Indicadores que suelen importar",
    metricGroups: [
      { name: "Crecimiento", items: ["Conversión", "Velocidad de respuesta", "Retención"] },
      { name: "Eficiencia", items: ["Tiempo recuperado", "Costo por proceso"] },
      { name: "Calidad", items: ["Incidencias y errores", "Diferencias explicadas"] },
      { name: "Confiabilidad", items: ["Cumplimiento de plazos", "Seguimiento realizado"] },
    ],
    metricsNote: "Elegimos los que reflejan el valor de tu proceso. Muchos no son monetarios y también cuentan.",
    roi: {
      title: "Que la inversión se justifique.",
      formula: "ROI = (beneficio atribuible − costo total) ÷ costo total",
      copy: "Cuando el beneficio es económico, lo medimos así, con el costo total de implementación, operación y mantenimiento. Buscamos que cada caso se pague con el valor que genera, con cifras que salen de tus datos.",
    },
    commitments: [
      { title: "Trazable", text: "Cada acción queda registrada: qué se hizo, con qué datos y por qué." },
      { title: "Integrado", text: "Funciona con las herramientas que ya usas, según el acceso que permita cada una." },
      { title: "Supervisado", text: "Un equipo de Ruka sigue la operación. Las acciones sensibles pasan por aprobación cuando el proceso lo requiere." },
      { title: "En mejora continua", text: "Revisamos resultados contra los indicadores y ajustamos para que el proceso rinda más." },
    ],
    platform: "Ruka One se construye sobre la misma base tecnológica con la que Ruka procesa millones de registros operativos para cientos de empresas.",
  },
  faq: {
    id: "preguntas",
    eyebrow: "Preguntas",
    title: "Lo que suelen preguntarnos antes de empezar.",
    items: [
      {
        question: "¿Qué es Ruka One?",
        answer: "Un servicio en el que Ruka toma un problema u oportunidad concreta de tu empresa, en ventas, atención, operaciones, finanzas o un proceso propio, y lo hace funcionar. Diseñamos e implementamos la solución con agentes de IA y automatización sobre tus sistemas, la acompañamos en operación y medimos su impacto con indicadores acordados.",
      },
      {
        question: "¿Qué tipo de procesos pueden resolver?",
        answer: "Por ejemplo, responder y hacer seguimiento a leads, detectar clientes en riesgo, resolver solicitudes recurrentes, coordinar entregas e incidencias, validar documentos, conciliar información o gestionar cobranza. Partimos por tu proceso, no por una lista cerrada, y revisamos contigo su viabilidad antes de comprometer un alcance.",
      },
      {
        question: "¿Necesito saber qué tecnología usar?",
        answer: "No. Basta con que nos cuentes el problema, la oportunidad y el resultado que buscas. Nosotros elegimos la combinación: agentes de IA donde aportan, y automatizaciones, reglas, APIs o personas donde son más confiables. No todo necesita un modelo de lenguaje.",
      },
      {
        question: "¿En qué se diferencia de comprar software o contratar un desarrollo?",
        answer: "El software entrega capacidades que tu equipo configura y opera, y puede automatizar mucho. Un desarrollo a medida entrega código que después alguien tiene que mantener. Con Ruka One implementamos la solución sobre tus sistemas, la acompañamos en operación y la mejoramos contra indicadores acordados.",
      },
      {
        question: "¿Cuál es la diferencia entre Ruka y Ruka One?",
        answer: "Ruka ofrece productos estandarizados para procesos que ya resolvimos, como compras o conciliación, y tu equipo los usa directamente. Con Ruka One partimos de un proceso propio de tu empresa y construimos la solución que necesita. La base tecnológica es la misma.",
      },
      {
        question: "¿Funciona con mis herramientas actuales?",
        answer: "Sí, ese es el punto de partida. Trabajamos sobre los sistemas que ya usas, como ERP, CRM, correo, WhatsApp, planillas o APIs, según el acceso que permita cada uno. No te pedimos cambiar de stack.",
      },
      {
        question: "¿Cómo es la implementación y cuánto participa mi equipo?",
        answer: "Empezamos con un caso focalizado. Tu equipo nos explica el proceso, da acceso a los sistemas necesarios y valida los primeros resultados. Después acompañamos la operación y ampliamos cuando el caso funciona.",
      },
      {
        question: "¿Cómo sabemos si está funcionando?",
        answer: "Con objetivos e indicadores acordados para cada caso y, cuando es posible, una línea base. Revisamos el impacto contigo y buscamos que la inversión se justifique con el valor generado. No garantizamos un retorno: lo diseñamos para medirlo y mejorarlo.",
      },
      {
        question: "¿Los agentes de IA actúan solos o necesitan aprobación?",
        answer: "Depende del proceso. En el alcance definimos qué se ejecuta de forma automática, qué pasos requieren aprobación de tu equipo y con qué permisos se accede a cada sistema. Cada acción queda registrada.",
      },
    ],
  },
  finalCta: {
    id: "conversemos",
    title: "¿Qué proceso quieres que funcione mejor?",
    copy: "Cuéntanos el problema o la oportunidad y el resultado que buscas; no necesitas saber qué tecnología hace falta. En 30 minutos exploramos viabilidad, un posible primer alcance y cómo mediríamos el impacto.",
    action: "Conversemos",
    microcopy: "30 min · Conversación exploratoria",
  },
  contact: {
    eyebrow: "Ruka One · Conversación de 30 minutos",
    eyebrowRest: " · Conversación de 30 minutos",
    title: "¿Qué proceso quieres que funcione mejor?",
    lead: "Elige una hora y cuéntanos el problema o la oportunidad y qué resultado esperas. No necesitas saber qué tecnología hace falta: eso lo vemos juntos.",
    expectations: [
      "Nos cuentas el problema u oportunidad tal como está hoy.",
      "Exploramos qué haría falta para resolverlo y su viabilidad.",
      "Vemos un posible primer alcance y cómo mediríamos el impacto.",
    ],
    calendarTitle: "Elige una hora.",
    calendarLead: "Una conversación exploratoria de 30 minutos: nos cuentas el problema o la oportunidad y exploramos cómo resolverlo.",
    calendarEventTitle: "Conversación exploratoria",
    successTitle: "Listo. Nos vemos.",
    successCopy: "Llega con el proceso, el problema o la oportunidad tal como está hoy. Nosotros llegamos con preguntas.",
    seoTitle: "Cuéntanos tu proceso | Ruka One",
    seoDescription: "Cuéntanos qué problema u oportunidad quieres resolver y el resultado que buscas. Una conversación exploratoria de 30 minutos con el equipo de Ruka One.",
  },
  seo: {
    title: "Agentes de IA a medida para empresas | Ruka One",
    description: "Procesos que funcionan en ventas, atención, operaciones, finanzas y back office: agentes de IA y automatización a medida, implementados y medidos por Ruka One.",
    serviceType: "Implementación de agentes de IA y automatización de procesos empresariales",
    serviceDescription: "Ruka One es un servicio en el que Ruka toma un problema u oportunidad concreta de una empresa, en ventas, marketing, atención, operaciones, finanzas o back office, diseña e implementa la solución con agentes de IA, automatizaciones e integraciones sobre sus sistemas, la acompaña en operación y la mejora contra indicadores acordados.",
    imageAlt: "Ruka One: un campo de miles de tareas del que se eleva un resultado, con el titular «Lo pendiente, resuelto.»",
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
