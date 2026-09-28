export type SeoLandingLink = {
  label: string;
  to: string;
};

export type SeoLandingItem = {
  title: string;
  description: string;
};

export type SeoLandingSection = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: readonly SeoLandingItem[];
};

export type SeoLandingFaq = {
  question: string;
  answer: string;
};

export type SeoLandingPageContent = {
  path: string;
  name: string;
  title: string;
  description: string;
  eyebrow: string;
  h1: string;
  lead: string;
  highlights: readonly SeoLandingItem[];
  sections: readonly SeoLandingSection[];
  faqs: readonly SeoLandingFaq[];
  relatedLinks: readonly SeoLandingLink[];
};

const siteOrigin = "https://www.ruka.ai";

export const seoLandingPages = {
  registroDeCompras: {
    path: "/productos/registro-de-compras",
    name: "Registro de compras",
    title: "Automatiza el registro de compras | Ruka",
    description:
      "Ruka recibe información desde SII, XML, PDF y otras fuentes para registrar compras en los sistemas que tu empresa ya usa.",
    eyebrow: "Registro de compras",
    h1: "Automatiza el registro de compras sin cambiar tus sistemas.",
    lead:
      "Ruka recibe documentos, lee la información relevante y la deja registrada donde tu operación la necesita. Tu equipo define las reglas; Ruka hace el trabajo repetitivo entre medio.",
    highlights: [
      {
        title: "Recibe documentos desde tus fuentes",
        description:
          "Ruka puede trabajar con información proveniente de SII, XML, PDF, correo, planillas y otras fuentes que ya usa tu operación.",
      },
      {
        title: "Lee, ordena y homologa",
        description:
          "El flujo puede clasificar y preparar la información antes de registrarla, siguiendo las reglas definidas para tu proceso.",
      },
      {
        title: "Registra donde corresponde",
        description:
          "La información puede terminar en tu ERP, POS, sistema contable, planilla u otra herramienta conectada a la operación.",
      },
    ],
    sections: [
      {
        eyebrow: "El flujo",
        title: "De documento recibido a compra registrada.",
        description:
          "Ruka se integra al flujo que ya existe: recibe la información, aplica las reglas del proceso y deja visibles los casos que requieren revisión.",
        items: [
          {
            title: "Fuentes conectadas",
            description: "Centraliza los documentos e información que hoy llegan por distintos canales.",
          },
          {
            title: "Reglas de tu operación",
            description: "Define cómo homologar, validar y preparar cada registro antes de enviarlo al sistema de destino.",
          },
          {
            title: "Excepciones separadas",
            description: "Cuando falta información o algo no coincide, el proceso puede dejar ese caso visible para que tu equipo decida.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "¿Con qué documentos puede trabajar Ruka?",
        answer:
          "Ruka puede trabajar con información de SII, XML, PDF, correo, planillas y otras fuentes disponibles para el proceso. La configuración depende de cómo llegan hoy tus documentos.",
      },
      {
        question: "¿Tengo que cambiar mi ERP o sistema contable?",
        answer:
          "No. Ruka está diseñada para trabajar sobre las herramientas que ya usa tu empresa y dejar la información actualizada donde corresponda.",
      },
      {
        question: "¿Qué pasa si un documento no cumple una regla?",
        answer:
          "El flujo se puede configurar para separar los casos que requieren una decisión. Así tu equipo no necesita revisar todo el volumen, solo las excepciones.",
      },
    ],
    relatedLinks: [
      { label: "Conciliación automática", to: "/productos/conciliacion-automatica" },
      { label: "Integraciones", to: "/integraciones" },
      { label: "Precios", to: "/precios" },
    ],
  },
  conciliacionAutomatica: {
    path: "/productos/conciliacion-automatica",
    name: "Conciliación automática",
    title: "Conciliación automática de facturas, órdenes y pagos | Ruka",
    description:
      "Ruka cruza cada factura con su orden de compra, su recepción y su pago según las reglas de tu equipo, y deja visibles solo las diferencias que necesitan una decisión.",
    eyebrow: "Conciliación automática",
    h1: "Tu equipo revisa las diferencias. Ruka revisa el resto.",
    lead:
      "Ruka cruza cada factura con su orden de compra, su recepción en bodega y su movimiento bancario. Lo que calza según tus reglas avanza solo; lo que no calza queda separado, con el esperado, lo recibido y el documento que lo originó.",
    highlights: [
      {
        title: "Las reglas las pone tu equipo",
        description:
          "Ustedes definen qué tiene que coincidir para dar una factura por validada, y cuánta diferencia se deja pasar sin levantar una excepción.",
      },
      {
        title: "Cada número lleva a su documento",
        description:
          "Desde cualquier resultado se vuelve a la factura, la orden y el movimiento que lo originaron. La conciliación se puede auditar, no solo leer.",
      },
      {
        title: "El resultado vuelve a tu sistema",
        description:
          "La conciliación queda en el sistema o la planilla donde tu operación sigue el proceso, sin exportar ni volver a digitar.",
      },
    ],
    sections: [
      {
        eyebrow: "Las reglas",
        title: "Qué tiene que calzar para que una factura avance.",
        description:
          "La conciliación no es una caja negra. Tu equipo fija los criterios y Ruka los aplica factura por factura, siempre igual.",
        items: [
          {
            title: "Monto y proveedor",
            description:
              "El total de la factura contra el de la orden de compra, y el proveedor contra el maestro de tu operación.",
          },
          {
            title: "Orden de compra y recepción",
            description:
              "Que la orden exista, que esté aprobada, y que lo recibido en bodega calce con lo que se está facturando.",
          },
          {
            title: "Fecha y tolerancias",
            description:
              "El rango de fechas aceptable y cuánta diferencia de monto o cantidad pasa sin levantar una excepción.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "¿Qué pasa con las facturas que sí calzan?",
        answer:
          "Avanzan sin que nadie las abra, y queda registrado qué regla las validó. Tu equipo solo entra a los casos que quedaron marcados como excepción.",
      },
      {
        question: "¿Qué información cruza Ruka?",
        answer:
          "Facturas, órdenes de compra, recepciones y pagos. El alcance exacto depende de qué fuentes tenga conectadas tu operación — eso lo revisamos antes de partir.",
      },
      {
        question: "¿Puede trabajar con información bancaria?",
        answer:
          "Sí, cuando el proceso cuenta con acceso a las cartolas. Qué bancos y qué formatos están disponibles lo revisamos junto con el resto de las fuentes.",
      },
      {
        question: "¿Y si una diferencia es aceptable?",
        answer:
          "Se define como tolerancia y deja de aparecer como excepción. Las tolerancias las fija tu equipo; no vienen puestas por defecto.",
      },
      {
        question: "¿Ruka reemplaza mi ERP o sistema contable?",
        answer:
          "No. Ruka trabaja entre los sistemas que ya existen para leer, cruzar y actualizar la información que tu operación maneja.",
      },
    ],
    relatedLinks: [
      { label: "Registro de compras", to: "/productos/registro-de-compras" },
      { label: "Integraciones", to: "/integraciones" },
      { label: "Precios", to: "/precios" },
    ],
  },
  precios: {
    path: "/precios",
    name: "Precios",
    title: "Precios de Ruka | Planes por volumen de documentos",
    description:
      "Conoce los planes de Ruka según el volumen mensual de documentos. Todos incluyen procesamiento de documentos, integraciones, reglas y homologación.",
    eyebrow: "Precios",
    h1: "Planes de Ruka según el volumen de documentos.",
    lead:
      "Todos los planes tienen las mismas capacidades. Lo que cambia es cuánto procesa Ruka cada mes. Si necesitas otra integración o un flujo propio, revisamos el alcance contigo.",
    highlights: [
      {
        title: "Start · $99.990 / mes",
        description: "Hasta 200 documentos al mes.",
      },
      {
        title: "Core · $249.990 / mes",
        description: "Hasta 500 documentos al mes.",
      },
      {
        title: "Scale · $449.990 / mes",
        description: "Hasta 1.200 documentos al mes.",
      },
    ],
    sections: [
      {
        eyebrow: "Incluido en todos los planes",
        title: "La misma base para automatizar tu operación.",
        description:
          "Los planes estándar se ajustan por volumen. Definimos el proceso, las fuentes y las reglas que Ruka necesita para operar sobre tus sistemas actuales.",
        items: [
          {
            title: "Procesamiento de documentos",
            description: "Ruka trabaja con la información que entra al proceso para leerla, clasificarla y prepararla según las reglas definidas.",
          },
          {
            title: "Integraciones",
            description: "Conectamos las fuentes y destinos relevantes para que la información circule por los sistemas que ya usa tu empresa.",
          },
          {
            title: "Reglas y homologación",
            description: "El flujo se configura para reflejar cómo tu operación clasifica, valida y maneja sus excepciones.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "¿Qué cambia entre los planes?",
        answer:
          "Los planes estándar cambian por el volumen mensual de documentos. Las capacidades publicadas son las mismas para todos los planes.",
      },
      {
        question: "¿Qué pasa si necesito más volumen o un proceso distinto?",
        answer:
          "Si necesitas más volumen, otra integración o un flujo propio de tu empresa, revisamos el alcance contigo para definir la implementación y operación.",
      },
      {
        question: "¿Ruka reemplaza mis sistemas actuales?",
        answer:
          "No. Ruka trabaja sobre los sistemas que ya usa tu empresa y hace el trabajo operativo entre ellos.",
      },
    ],
    relatedLinks: [
      { label: "Registro de compras", to: "/productos/registro-de-compras" },
      { label: "Conciliación automática", to: "/productos/conciliacion-automatica" },
      { label: "Integraciones", to: "/integraciones" },
    ],
  },
  integraciones: {
    path: "/integraciones",
    name: "Integraciones",
    title: "Integraciones de Ruka | ERP, POS, SII y más",
    description:
      "Ruka trabaja con SII, ERP, sistemas contables, POS, bancos, archivos y sistemas propios para automatizar procesos sin reemplazar tus herramientas actuales.",
    eyebrow: "Integraciones",
    h1: "Ruka trabaja donde ya vive tu operación.",
    lead:
      "Conectamos las fuentes y sistemas que Ruka necesita para hacer el trabajo operativo entre medio. No necesitas reemplazar el software que ya usa tu empresa.",
    highlights: [
      {
        title: "Facturación y documentos",
        description: "SII, facturadores y otras fuentes de documentos tributarios.",
      },
      {
        title: "Gestión y contabilidad",
        description: "ERP, sistemas contables, compras, pagos, bancos y gestión operacional.",
      },
      {
        title: "Ventas y operación",
        description: "POS, ventas, productos, locales, precios y movimientos de stock.",
      },
    ],
    sections: [
      {
        eyebrow: "Fuentes de información",
        title: "Sistemas, archivos y desarrollos propios.",
        description:
          "Además de las integraciones disponibles, Ruka puede trabajar con información que hoy vive fuera de una conexión estándar, siempre que el proceso cuente con el acceso necesario.",
        items: [
          {
            title: "SII, ERP, POS y bancos",
            description: "Fuentes habituales para documentos, gestión, pagos, ventas y otros datos operativos.",
          },
          {
            title: "Excel, CSV, XML, PDF y correo",
            description: "Archivos y documentos que forman parte del trabajo manual que hoy realiza tu equipo.",
          },
          {
            title: "APIs y sistemas propios",
            description: "Cuando el proceso requiere una fuente particular, revisamos cómo acceder a ella y cómo integrarla al flujo.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "¿Tengo que cambiar mi ERP, POS o sistema contable?",
        answer:
          "No. Ruka está diseñada para trabajar sobre las herramientas que ya usa tu empresa y dejar la información actualizada donde corresponda.",
      },
      {
        question: "¿Qué pasa si mi sistema no aparece en esta página?",
        answer:
          "Revisamos cómo funciona el proceso, qué información utiliza y qué acceso existe a esa fuente. La viabilidad exacta depende de esos elementos.",
      },
      {
        question: "¿Qué información puede usar Ruka?",
        answer:
          "Ruka puede trabajar con información de SII, ERP, POS, bancos, Excel, CSV, XML, PDF, correo, APIs y sistemas propios, según el caso.",
      },
    ],
    relatedLinks: [
      { label: "Registro de compras", to: "/productos/registro-de-compras" },
      { label: "Conciliación automática", to: "/productos/conciliacion-automatica" },
      { label: "Precios", to: "/precios" },
    ],
  },
} as const satisfies Record<string, SeoLandingPageContent>;

export const seoLandingCanonical = (path: string) => `${siteOrigin}${path}`;
