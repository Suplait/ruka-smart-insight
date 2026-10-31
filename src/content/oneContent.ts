export const ONE_NAME = "Ruka One";
export const ONE_PATH = "/one";
export const ONE_CONTACT_PATH = "/one/contacto";

export const oneContent = {
  hero: {
    eyebrow: "Ruka One · Back office operado por Ruka",
    eyebrowShort: "Ruka One",
    eyebrowRest: " · Back office operado por Ruka",
    titleLines: ["Tu back office,", "operado por Ruka."],
    title: "Tu back office, operado por Ruka.",
    lead: "Nos hacemos cargo de procesos completos —finanzas, compras, cobranza, administración y más— y respondemos por que ocurran. Tu equipo se queda con las decisiones.",
    primaryAction: "Conversemos",
    secondaryAction: "Cómo funciona",
    microcopy: "Un servicio operado, no otro software que administrar.",
    beacon: {
      kicker: "Lo que llega a tu equipo",
      text: "Una decisión. El resto lo operamos.",
    },
    areas: ["Finanzas", "Compras", "Cobranza", "Administración", "Coordinación", "Atención", "Compliance"],
  },
  between: {
    id: "entre",
    eyebrow: "El trabajo que nadie ve",
    title: "El trabajo que más cuesta no vive en ningún sistema. Vive entre ellos.",
    fragments: [
      "Entre el ERP y el banco.",
      "Entre un correo y una planilla.",
      "Entre quien pide y quien aprueba.",
      "Entre lo que se acordó y lo que se hizo.",
    ],
    close: "Ahí alguien persigue, copia, cruza, recuerda y reintenta. Todos los días. Ese es el trabajo que tomamos.",
  },
  difference: {
    id: "como-funciona",
    eyebrow: "La diferencia",
    title: "No te vendemos una herramienta. Nos hacemos cargo del trabajo.",
    lead: "Con software, tu equipo configura, opera y persigue cada error. Con Ruka One acordamos qué tiene que ocurrir, lo operamos y respondemos por ello.",
    columns: ["Comprar software", "Contratar Ruka One"],
    rows: [
      { question: "¿Quién opera el proceso cada día?", software: "Tu equipo", one: "Ruka" },
      { question: "¿Quién persigue lo que quedó pendiente?", software: "Tu equipo", one: "Ruka" },
      { question: "¿Quién responde si algo no ocurre?", software: "Tu equipo", one: "Ruka, ante ti" },
      { question: "¿Quién decide?", software: "Tu equipo", one: "Tu equipo" },
    ],
    note: "La última fila no cambia. Es a propósito.",
  },
  split: {
    id: "reparto",
    eyebrow: "El reparto",
    title: "Lo operamos de punta a punta. Las decisiones siguen siendo tuyas.",
    ours: {
      label: "Ruka One se hace cargo de",
      items: [
        "Ejecutar cada caso, de la entrada al cierre.",
        "Coordinar sistemas, proveedores y personas.",
        "Perseguir lo pendiente hasta que se resuelve.",
        "Dejar registro de qué se hizo y por qué.",
        "Avisarte cuando algo se sale de lo acordado.",
      ],
    },
    yours: {
      label: "Tu equipo conserva",
      items: [
        "El criterio y las políticas.",
        "Las aprobaciones que definas.",
        "Las excepciones que acordemos.",
        "La última palabra.",
      ],
    },
    how: "Cómo lo hacemos es asunto nuestro: IA, integraciones con tus sistemas, reglas acordadas y personas de Ruka que supervisan cuando hace falta. Lo que te importa es que ocurra.",
  },
  scope: {
    id: "alcance",
    eyebrow: "El alcance",
    title: "Antes de operar, trazamos el perímetro.",
    lead: "Cada operación que tomamos tiene bordes claros y por escrito. Así sabes qué es nuestro, qué es tuyo y qué pasa con lo que no calza.",
    edges: [
      { side: "start", label: "Dónde empieza", text: "Qué activa el proceso: una solicitud, un documento, un vencimiento." },
      { side: "end", label: "Dónde termina", text: "El resultado que acordamos entregar, y cómo se ve cuando está listo." },
      { side: "top", label: "Qué decides tú", text: "Las aprobaciones, montos y criterios que siguen en manos de tu equipo." },
      { side: "bottom", label: "Lo que no calza", text: "Qué hacemos con cada excepción: la resolvemos, te la llevamos o la escalamos." },
    ],
    implementation: {
      title: "Empezar lleva trabajo de ambos lados.",
      copy: "Recorremos el proceso con quienes lo hacen hoy, conectamos tus sistemas y probamos con casos reales antes de operar. Partimos acotado y ampliamos cuando lo acordado funciona.",
    },
  },
  areas: {
    id: "areas",
    eyebrow: "Transversal",
    title: "Cualquier operación que hoy alguien empuja a mano.",
    disclaimer: "Ejemplos ilustrativos",
    items: [
      { name: "Finanzas", example: "Cierre mensual", ours: "Reunir movimientos de bancos, ERP y planillas, conciliarlos y dejar listo el cuadre.", yours: "Apruebas los ajustes que superen el criterio acordado." },
      { name: "Compras", example: "De la solicitud a la orden", ours: "Cotizar, comparar según tus políticas, emitir la orden y hacer seguimiento al proveedor.", yours: "Apruebas sobre el monto que definas." },
      { name: "Cobranza", example: "Facturas vencidas", ours: "Hacer seguimiento a cada documento, con el tono y la frecuencia que acordemos.", yours: "Decides los acuerdos de pago fuera de política." },
      { name: "Administración", example: "Proveedores y documentos", ours: "Dar de alta proveedores y mantener contratos y documentos al día en cada sistema.", yours: "Validas lo que tu política marque como sensible." },
      { name: "Coordinación", example: "Entregas entre equipos", ours: "Coordinar a proveedores, bodegas y áreas internas para que lo comprometido llegue.", yours: "Te enteras solo cuando algo cambia el plan." },
      { name: "Atención", example: "Solicitudes recurrentes", ours: "Responder y resolver lo que clientes o proveedores piden una y otra vez.", yours: "Los casos sensibles llegan a tu equipo con contexto." },
      { name: "Compliance", example: "Vencimientos y evidencia", ours: "Reunir la evidencia, controlar plazos y preparar lo que hay que presentar.", yours: "Revisas y firmas." },
      { name: "Otro proceso", example: "El tuyo", ours: "Si es recurrente, tiene reglas reconocibles y hoy depende de alguien que lo empuje, conversemos.", yours: "Tú nos dices dónde duele." },
    ],
  },
  trust: {
    id: "confianza",
    eyebrow: "Por qué confiar",
    title: "No prometemos que nada falle. Prometemos hacernos cargo cuando falla.",
    commitments: [
      { title: "Por escrito", text: "Qué hacemos, qué decides tú y qué pasa con cada excepción, acordado antes de operar." },
      { title: "Visible", text: "Cada caso deja registro de qué se hizo y por qué. Puedes revisarlo cuando quieras." },
      { title: "Supervisado", text: "Personas de Ruka siguen la operación y responden cuando algo se sale de lo acordado." },
      { title: "Sobre lo que ya usas", text: "Operamos sobre tus sistemas actuales. No te pedimos cambiar de ERP." },
    ],
    platform: "Ruka One usa la misma base tecnológica que hoy procesa millones de registros operativos para cientos de empresas.",
  },
  faq: {
    id: "preguntas",
    eyebrow: "Preguntas",
    title: "Lo que suelen preguntarnos antes de empezar.",
    items: [
      {
        question: "¿Qué es Ruka One?",
        answer: "Un servicio en el que Ruka se hace cargo de operar procesos completos de back office de tu empresa, con un alcance y resultados acordados. Lo operamos con IA, integraciones, reglas y supervisión de nuestro equipo. Tu equipo conserva las decisiones y las excepciones que definamos.",
      },
      {
        question: "¿En qué se diferencia de comprar software?",
        answer: "Con software, tu equipo configura la herramienta y sigue operando el proceso. Con Ruka One no administras una herramienta: acordamos qué tiene que ocurrir, lo operamos y respondemos por ello.",
      },
      {
        question: "¿Cuál es la diferencia entre Ruka y Ruka One?",
        answer: "Ruka ofrece productos estandarizados para procesos que ya resolvimos, como compras o conciliación, y tu equipo los usa directamente. Con Ruka One partimos de un proceso propio de tu empresa y lo operamos nosotros. La base tecnológica es la misma.",
      },
      {
        question: "¿Qué tipo de procesos trabajamos con Ruka One?",
        answer: "Procesos recurrentes de finanzas, compras, cobranza, administración, coordinación, atención o cumplimiento que hoy dependen de personas para buscar información, cruzar sistemas, coordinar a otros o perseguir respuestas. Partimos por cómo funciona tu proceso, no por una lista cerrada.",
      },
      {
        question: "¿Qué sigue decidiendo mi equipo?",
        answer: "Lo que definamos juntos: políticas, montos de aprobación, criterios y excepciones. Cuando un caso necesita una decisión tuya, te llega con el contexto necesario y el proceso continúa después.",
      },
      {
        question: "¿Tengo que cambiar mi ERP o mis sistemas actuales?",
        answer: "No. Operamos sobre los sistemas que tu empresa ya usa y definimos contigo cómo conectarnos a ellos según lo que requiera el proceso.",
      },
      {
        question: "¿Qué pasa si algo sale mal?",
        answer: "Lo detectamos, te avisamos y lo corregimos. Personas de nuestro equipo supervisan la operación y cada caso deja registro de qué se hizo. No prometemos cero errores; sí que alguien se hace cargo.",
      },
    ],
  },
  finalCta: {
    id: "conversemos",
    title: "¿Qué trabajo quieres dejar de administrar?",
    copy: "En 30 minutos nos cuentas cómo funciona hoy y conversamos un primer alcance: qué tomaría Ruka One y qué seguiría decidiendo tu equipo.",
    action: "Conversemos",
    microcopy: "30 min · Sin compromiso",
  },
  contact: {
    eyebrow: "Ruka One · Conversación de 30 minutos",
    eyebrowRest: " · Conversación de 30 minutos",
    title: "¿Qué trabajo quieres dejar de administrar?",
    lead: "Elige una hora y cuéntanos cómo funciona hoy. Salimos con un primer alcance: qué tomaría Ruka One y qué seguiría decidiendo tu equipo.",
    expectations: [
      "Nos cuentas el proceso tal como funciona hoy.",
      "Vemos qué tomaríamos y qué decide tu equipo.",
      "Te proponemos por dónde partir.",
    ],
    calendarTitle: "Elige una hora.",
    calendarLead: "Nos cuentas cómo funciona hoy y conversamos qué parte de ese trabajo tomaría Ruka One.",
    successTitle: "Listo. Nos vemos.",
    successCopy: "Llega con el proceso tal como funciona hoy. Del resto nos hacemos cargo.",
  },
  seo: {
    title: "Back office operado por Ruka, con IA | Ruka One",
    description: "Ruka One se hace cargo de procesos completos de back office —finanzas, compras, cobranza y más— con IA y supervisión humana. Tu equipo decide.",
    serviceType: "Operación de procesos de back office",
    serviceDescription: "Ruka One es un servicio en el que Ruka opera procesos completos de back office de una empresa con IA, integraciones y supervisión humana, bajo un alcance acordado; el cliente conserva las decisiones.",
    imageAlt: "Ruka One: un campo de trabajo operado por Ruka del que solo se eleva una decisión",
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
