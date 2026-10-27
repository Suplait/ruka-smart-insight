import type { ProductPageContent } from "@/components/seo/ProductLandingPage";

export const billingPath = "/productos/facturacion-electronica";
export const billingAccess = "https://plataforma.rukafactura.cl/";
export const billingContent: ProductPageContent = {
  path: billingPath,
  name: "Facturación electrónica",
  title: "Facturación electrónica y gestión contable en Chile | Ruka",
  description:
    "Prepara y emite facturas con RukaFactura. Revisa importes, consulta documentos y reúne compras y ventas para contabilidad, según la habilitación de tu empresa.",
  h1: "Facturación electrónica. Todo a mano.",
  lead: "Emite con tu catálogo, consulta tus documentos y reúne compras y ventas para el trabajo contable.",
  promise:
    "Facturar es una parte. Tener la información a mano también importa.",
  outcomes: [
    {
      title: "Menos datos escritos de nuevo",
      description:
        "Reutiliza productos, servicios, unidades y precios de tu catálogo al preparar una factura.",
    },
    {
      title: "Revisión antes de emitir",
      description:
        "Comprueba receptor, líneas e importes. Preparar un borrador no envía un documento al SII.",
    },
    {
      title: "Documentos que puedes encontrar",
      description:
        "Busca por receptor o folio y distingue un envío pendiente de un documento aceptado o rechazado.",
    },
  ],
  flowTitle: "Parte con tu empresa. Sigue con una factura.",
  flowLead:
    "La habilitación se revisa por empresa y tipo de documento. No basta con tener una cuenta para emitir cualquier DTE.",
  flow: [
    {
      number: "01",
      title: "Revisa lo que necesitas para emitir.",
      description:
        "Confirma los datos y permisos de la empresa, su habilitación ante el SII, certificado digital vigente, folios autorizados y configuración del documento que usarás.",
    },
    {
      number: "02",
      title: "Prepara y revisa el documento.",
      description:
        "Elige el receptor, incorpora productos o servicios y comprueba cantidades, precios, impuestos y descuentos en la vista previa. Puedes retomar un borrador antes de emitir.",
    },
    {
      number: "03",
      title: "Emite y comprueba el resultado.",
      description:
        "La emisión consume un folio y envía el documento al SII. Consulta su estado: enviado no significa aceptado. Ante un rechazo o una respuesta pendiente, revisa el diagnóstico antes de repetir.",
    },
    {
      number: "04",
      title: "Mantén el respaldo para lo que sigue.",
      description:
        "Recupera XML y PDF, revisa notas de crédito o débito asociadas y reúne los registros del período. Corregir un documento emitido no es editar su archivo original.",
    },
  ],
  faqs: [
    {
      question: "¿Cuántos ítems puede tener una factura?",
      answer:
        "Hasta 60 ítems por factura, con el detalle de los productos o servicios de la venta. Es un límite por documento, no la cantidad de facturas que puedes emitir al mes.",
    },
    {
      question: "¿Puedo separar quién prepara de quién emite?",
      answer:
        "Sí. Los permisos por empresa permiten separar la preparación de documentos, la aprobación y emisión, el mantenimiento del catálogo y clientes y la administración de integraciones.",
    },
    {
      question: "¿Puedo conectar Claude o ChatGPT para facturar por MCP?",
      answer:
        "Es una integración a coordinar con nuestro equipo. Revisamos el conector, la compatibilidad de tu cuenta de Claude o ChatGPT y las acciones que podrá ejecutar. No se incluye una conexión automática con el acceso al facturador ni debe confundirse con la API pública de consulta de compras.",
    },
    {
      question: "¿Es lo mismo que el registro de compras de Ruka?",
      answer:
        "No. RukaFactura prepara y emite documentos de tu empresa. El registro de compras organiza documentos recibidos de proveedores. Son trabajos distintos: revisamos cuál necesitas y cómo conectarlo con tu operación.",
    },
    {
      question: "¿Puedo emitir apenas creo una cuenta?",
      answer:
        "La emisión requiere configurar la empresa y cumplir los requisitos del SII para el documento correspondiente, incluyendo permisos, certificado vigente y folios autorizados. La revisión de requisitos evita confundir acceso al sistema con autorización para emitir.",
    },
    {
      question: "¿Qué documentos contempla el facturador?",
      answer:
        "El producto contempla facturas afectas y exentas, boletas, guías de despacho, notas de crédito y débito, y flujos especializados de factura de compra, liquidación-factura y exportación. La disponibilidad depende de la habilitación, configuración y alcance de cada empresa; no todos los tipos están disponibles para cualquier emisor.",
    },
    {
      question: "¿Puedo preparar varias facturas a la vez?",
      answer:
        "Existe un flujo de facturación por lote con revisión previa. El formato, tipo de documento y requisitos de emisión deben corresponder a la empresa. Revisa cada resultado del lote; iniciar el proceso no acredita que todos los documentos hayan sido aceptados.",
    },
    {
      question: "¿El F29 se presenta automáticamente?",
      answer:
        "No. El módulo contable permite preparar un borrador revisable con sus fuentes y ajustes. No equivale a una declaración presentada ni reemplaza la revisión tributaria correspondiente.",
    },
    {
      question: "¿Las cartolas y honorarios también se pueden revisar?",
      answer:
        "RukaFactura contempla conciliación a partir de cartolas importadas y gestión de honorarios recibidos y sus pagos. Importar una cartola no es una conexión bancaria universal; registrar un pago no mueve dinero. Honorarios recibidos no significa emitir boletas de honorarios.",
    },
    {
      question: "¿Está incluido en mi plan actual de Ruka?",
      answer:
        "El facturador y sus módulos se habilitan según el alcance acordado para tu empresa. Tener una cuenta de compras no implica que estén incluidos. Nuestro equipo te ayuda a confirmar qué necesitas.",
    },
    {
      question: "¿Dónde entro si ya tengo acceso?",
      answer:
        "El acceso a RukaFactura está en plataforma.rukafactura.cl. Entra con tu cuenta y selecciona la empresa correspondiente antes de preparar o consultar documentos.",
    },
    {
      question: "¿Puedo recuperar el XML y el PDF de una factura?",
      answer:
        "Sí. Puedes consultar el documento y recuperar sus respaldos XML y PDF. Si necesitas corregir una emisión, revisa el ajuste que corresponde; editar el PDF no modifica el documento tributario.",
    },
  ],
};
