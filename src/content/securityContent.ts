export const securityPath = "/seguridad";
export const securityTitle = "Seguridad y tratamiento de datos en Ruka | Ruka";
export const securityDescription = "Conoce cómo Ruka trabaja con documentos, accesos e integraciones. Revisa el alcance de permisos, continuidad, IA y privacidad antes de conectar tu operación.";
export const securitySections = [
  {
    id: "datos", title: "Qué información entra en el proceso", summary: "El alcance parte por los datos que tu operación necesita.",
    paragraphs: [
      "Según el servicio habilitado, Ruka trata información de tu empresa y usuarios, documentos de compra o venta, proveedores, productos, cantidades, precios y registros del proceso. Una integración puede necesitar credenciales o autorizaciones para consultar una fuente o actualizar un destino.",
      "Antes de conectar un nuevo flujo, identifica empresa, fuentes, acciones y responsables. Evita incorporar datos que no sean necesarios para esa tarea. Las herramientas de cálculo de este sitio operan en tu navegador: los importes que ingresas en ellas no se envían a Ruka.",
    ],
    links: [{ href: "/privacy", label: "Leer la política de privacidad" }, { href: "/ayuda/preparar-conexion", label: "Preparar una conexión" }],
  },
  {
    id: "accesos", title: "Quién puede ver y hacer qué", summary: "Acceder a una cuenta no equivale a tener permiso para todas sus acciones.",
    paragraphs: [
      "El producto utiliza usuarios y permisos para controlar las acciones disponibles. La empresa y el contexto de trabajo importan: consultar una factura, cambiar su clasificación, registrar una recepción y preparar un pago son acciones distintas. La configuración concreta depende del producto y de los módulos habilitados.",
      "En la API pública V3, la clave está vinculada a una cuenta y a un usuario activo. Se puede revocar y su acceso sigue sujeto a los permisos y membresía correspondientes. Mantén las claves en tu servidor; no las incluyas en código del navegador, capturas o repositorios públicos.",
    ],
    links: [{ href: "/desarrolladores", label: "Revisar acceso y contrato API" }],
  },
  {
    id: "integraciones", title: "Conectar no significa delegar todo", summary: "La consulta de información y la ejecución de una acción se acuerdan por separado.",
    paragraphs: [
      "Una conexión puede limitarse a descargar documentos o incluir acciones en otro sistema. Revisa qué hace cada integración, con qué frecuencia y qué sucede si hay información incompleta. Un resultado local no demuestra por sí solo que el destino haya aceptado el envío.",
      "Generar una nómina bancaria no ejecuta una transferencia. Preparar un documento no lo convierte en una emisión aceptada. Los pasos de revisión y autorización de tu empresa, el banco o el SII siguen siendo relevantes. No compartas credenciales con alguien que no esté autorizado para operar esas fuentes.",
    ],
    links: [{ href: "/integraciones", label: "Ver alcance de las conexiones" }, { href: "/ayuda/preparar-nomina-banco", label: "Distinguir nómina y pago" }],
  },
  {
    id: "ia", title: "Dónde interviene la IA", summary: "La IA puede ayudar a leer y clasificar. El contexto y las reglas siguen importando.",
    paragraphs: [
      "Ruka utiliza procesamiento automatizado y servicios de IA en tareas como lectura de documentos y categorización. El procesamiento puede involucrar servicios de terceros, incluido Microsoft Azure, según el componente y la configuración. No todas las acciones del producto utilizan un modelo de IA.",
      "Si tu evaluación exige un proveedor, región, condición de retención o restricción específica de uso de datos, revisemos ese flujo antes de habilitarlo. Las condiciones de un proveedor no deben extrapolarse a todos los componentes de Ruka ni a cualquier configuración. La política de privacidad y el acuerdo aplicable definen el tratamiento correspondiente.",
    ],
    links: [{ href: "/privacy", label: "Consultar tratamiento y uso de información" }],
  },
  {
    id: "continuidad", title: "Continuidad y conservación", summary: "Respaldo, recuperación y disponibilidad no son la misma promesa.",
    paragraphs: [
      "Ruka utiliza infraestructura en la nube y respaldos para sus servicios. Las configuraciones de recuperación y disponibilidad difieren por componente. Para una evaluación técnica, podemos revisar el alcance del servicio que usarás, sus dependencias y el procedimiento de recuperación, sin publicar detalles de acceso a la infraestructura.",
      "La conservación de información también depende de obligaciones legales, del servicio y de sus condiciones. Solicitar una eliminación no implica que todos los respaldos desaparezcan en el mismo instante. Revisa tu caso con el contacto de privacidad; esta página no establece un plazo nuevo de retención ni un SLA distinto al acordado.",
    ],
    links: [{ href: "/terms", label: "Consultar los términos del servicio" }],
  },
  {
    id: "consulta", title: "Una revisión concreta, por tu operación", summary: "Partamos por la pregunta y el dato que necesitas proteger.",
    paragraphs: [
      "Para una evaluación, indica el producto, las fuentes que quieres conectar, el tipo de información y los controles que exige tu empresa. Podemos revisar los permisos, proveedores y responsabilidades pertinentes por un canal privado. No es necesario publicar un documento de cliente para plantear una pregunta de seguridad.",
      "Para ejercer derechos sobre tus datos o reportar una preocupación de privacidad, usa el contacto publicado en nuestra política. En el primer mensaje describe el problema sin contraseñas, certificados, claves API ni documentos de terceros. Si se necesita evidencia adicional, coordinemos primero un medio adecuado para compartirla.",
    ],
    links: [{ href: "mailto:privacidad@ruka.ai", label: "Contactar por privacidad" }],
  },
];
