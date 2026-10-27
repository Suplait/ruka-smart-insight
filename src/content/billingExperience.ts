/** Marketing explanations of the reviewed biller scope, not tax eligibility rules. */
export const billingDocuments = [
  {
    id: "ventas",
    label: "Vender",
    title: "Documenta lo que vendes.",
    description:
      "Prepara la venta con tu catálogo. Revisa a quién facturas, qué entregas y cuánto corresponde cobrar.",
    documents: [
      {
        name: "Facturas afectas y exentas",
        detail:
          "Para documentar ventas o servicios, según el tratamiento tributario que corresponda a tu operación.",
      },
      {
        name: "Boletas",
        detail:
          "Para las ventas que debas documentar con boleta, según la habilitación de tu empresa.",
      },
    ],
    prepare:
      "Receptor, productos o servicios, cantidades, precios e impuestos.",
    result:
      "Un documento que puedes consultar por receptor o folio, con su estado y respaldo.",
    note: "La afectación o exención no se elige por conveniencia. Debe corresponder a la operación y a la situación tributaria del emisor.",
  },
  {
    id: "despacho",
    label: "Despachar",
    title: "Acompaña el movimiento de mercadería.",
    description:
      "Prepara una guía de despacho con el detalle de los productos. Mantén separado el traslado de la facturación.",
    documents: [
      {
        name: "Guías de despacho",
        detail:
          "Un documento para respaldar el traslado, según la operación y los requisitos que correspondan.",
      },
    ],
    prepare:
      "Empresa, destinatario, productos y datos requeridos para el traslado.",
    result: "La guía y su respaldo disponibles para consultar después.",
    note: "Una guía emitida no prueba por sí sola que el cliente recibió los productos ni reemplaza la factura cuando corresponde emitirla.",
  },
  {
    id: "ajustes",
    label: "Corregir",
    title: "Corrige sin perder la referencia original.",
    description:
      "Usa el documento de ajuste que corresponda y conserva la relación con la operación que estás corrigiendo.",
    documents: [
      {
        name: "Notas de crédito",
        detail:
          "Para los ajustes que correspondan mediante una nota de crédito referida al documento original.",
      },
      {
        name: "Notas de débito",
        detail:
          "Para los ajustes que correspondan mediante una nota de débito, con su referencia y motivo.",
      },
    ],
    prepare:
      "Documento original, motivo del ajuste y datos que necesitan corrección.",
    result: "El ajuste y su documento de referencia disponibles para revisión.",
    note: "Corregir un documento emitido no es editar su PDF. El tipo de ajuste debe corresponder a las reglas aplicables.",
  },
  {
    id: "especiales",
    label: "Otros documentos",
    title: "También hay operaciones con requisitos propios.",
    description:
      "Revisemos el documento y la habilitación antes de configurar un flujo especializado para tu empresa.",
    documents: [
      {
        name: "Factura de compra",
        detail:
          "Para las operaciones en que corresponde que el comprador emita este documento. No es registrar la factura de un proveedor.",
      },
      {
        name: "Liquidación-factura",
        detail:
          "Un flujo específico que requiere revisar el papel del emisor y la operación a documentar.",
      },
      {
        name: "Documentos de exportación",
        detail:
          "Para operaciones de exportación, con los datos y requisitos del documento correspondiente.",
      },
    ],
    prepare:
      "Tipo de operación, documento requerido y habilitación de la empresa.",
    result:
      "Un alcance de emisión definido para el caso, no una habilitación universal.",
    note: "Estos flujos se revisan por separado. Tener una cuenta no habilita todos los documentos.",
  },
] as const;

export const billingStates = [
  {
    id: "draft",
    label: "Borrador",
    title: "Todavía puedes revisar.",
    text: "Comprueba el receptor, las líneas y los importes antes de confirmar la emisión.",
    action: "Revisar el documento",
    limit: "Preparar un borrador no envía un DTE al SII.",
  },
  {
    id: "sent",
    label: "Enviado",
    title: "Ahora importa la respuesta.",
    text: "Consulta el resultado del envío. Si la respuesta sigue pendiente, revisa el estado antes de intentar otra emisión.",
    action: "Consultar el estado",
    limit: "Enviado no significa aceptado.",
  },
  {
    id: "accepted",
    label: "Aceptado",
    title: "Conserva el documento y su respaldo.",
    text: "Recupera el XML y el PDF, y mantén las referencias para consultas y ajustes posteriores.",
    action: "Revisar el respaldo",
    limit: "La aceptación no acredita que la factura esté pagada.",
  },
  {
    id: "rejected",
    label: "Rechazado",
    title: "Revisa el motivo antes de repetir.",
    text: "Consulta el diagnóstico y corrige lo que corresponda. No tomes un envío iniciado como una emisión resuelta.",
    action: "Revisar el diagnóstico",
    limit: "Repetir sin revisar puede dejar el problema sin resolver.",
  },
] as const;

export const billingPreparation = [
  {
    id: "company",
    title: "Empresa y permisos",
    detail:
      "Ten identificada la empresa emisora y quién está autorizado para operar.",
  },
  {
    id: "documents",
    title: "Documentos que necesitas",
    detail:
      "Define qué vas a emitir y revisa la habilitación correspondiente ante el SII.",
  },
  {
    id: "certificate",
    title: "Certificado y folios",
    detail:
      "Revisa la vigencia del certificado digital y los folios autorizados del documento.",
  },
  {
    id: "catalog",
    title: "Catálogo y receptores",
    detail:
      "Prepara productos, servicios, unidades y datos de clientes para configurar el trabajo.",
  },
] as const;

export function billingPreparationText(checked: readonly string[]) {
  return [
    "Preparar mi facturación con RukaFactura",
    "",
    ...billingPreparation.map(
      (item) =>
        `${checked.includes(item.id) ? "[x]" : "[ ]"} ${item.title}: ${item.detail}`,
    ),
    "",
    "Esta lista es una pauta personal. No verifica ni certifica la habilitación ante el SII.",
    "No compartas contraseñas ni certificados por correo.",
    "https://www.ruka.ai/ayuda/comenzar-rukafactura",
  ].join("\n");
}
