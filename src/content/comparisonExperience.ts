// Editorial framing of the capabilities documented in comparisons.json.
// Examples explain a decision; they are not measured customer outcomes.
type ComparisonExperience = {
  question: string;
  ruka: string;
  alternative: string;
  distinction: { title: string; text: string };
  proof: "purchase" | "receipt";
  proofTitle: string;
  proofLead: string;
  practice: string;
  costExample?: boolean;
};

export const comparisonExperience: Record<string, ComparisonExperience> = {
  Emisso: {
    question: "¿Necesitas una conexión o un proceso funcionando?",
    ruka: "Operar el trabajo que hoy se hace a mano: documentos, reglas y acciones entre sistemas.",
    alternative: "Obtener acceso programático a sistemas para construir tu propia solución.",
    distinction: {
      title: "Acceder al dato no resuelve qué hacer con él.",
      text: "Una API puede entregar una factura. Todavía hay que reconocer sus productos, aplicar equivalencias, decidir qué hacer ante una diferencia y registrar el resultado. La decisión incluye quién desarrolla y mantiene ese recorrido.",
    },
    proof: "purchase",
    proofTitle: "El dato necesita contexto antes de convertirse en una compra.",
    proofLead: "En este detalle de Ruka, cada línea conserva el producto del proveedor y su relación con un insumo maestro. Esa relación es parte del trabajo operativo posterior a obtener el documento.",
    practice: "Sigue una factura completa: desde su origen hasta el destino. Define qué respuesta esperas y quién resuelve una excepción en cada paso.",
  },
  Tupana: {
    question: "¿El trabajo pendiente está en cobrar o en controlar lo que compras?",
    ruka: "Pasar de facturas de proveedores a compras, insumos y costos comparables.",
    alternative: "Emitir documentos de venta, seguir la cobranza y conciliar pagos.",
    distinction: {
      title: "Una factura emitida y una compra entendida son dos resultados distintos.",
      text: "Ruka también tiene facturador. Pero al comparar estas propuestas, su diferencia está en trabajar el detalle de la compra: qué producto es, en qué unidad lo usas y cuánto cuesta realmente esa unidad.",
    },
    proof: "purchase",
    proofTitle: "No solo el total de la factura. Cada insumo y su costo.",
    proofLead: "Los nombres del proveedor no siempre coinciden con los de tu operación. Ruka relaciona las líneas con tus insumos maestros y mantiene visible la cantidad, la unidad y el importe para revisarlos.",
    practice: "Toma dos compras del mismo insumo en presentaciones distintas. Lo importante es poder compararlas sobre una unidad común, no elegir la factura con el menor total.",
    costExample: true,
  },
  Wasabil: {
    question: "¿Quieres automatizar la venta online o la entrada de compras?",
    ruka: "Ordenar documentos de proveedores, relacionar insumos y seguir los costos de compra.",
    alternative: "Conectar ventas online con facturación, catálogo e inventario.",
    distinction: {
      title: "El catálogo que vendes no siempre es el producto que compras.",
      text: "Una tienda puede vender por unidad y recibir productos en cajas o formatos diferentes. Antes de conectar más herramientas, define quién mantiene el catálogo comercial y quién transforma la información del proveedor en datos de compra.",
    },
    proof: "purchase",
    proofTitle: "Del nombre del proveedor al insumo que reconoce tu equipo.",
    proofLead: "El detalle de compra conserva ambas referencias. Esto permite revisar presentaciones, cantidades y costos sin confundir el catálogo de venta con la información que llega en la factura.",
    practice: "Elige una venta online y la compra que la abastece. Revisa por separado la emisión al cliente, la entrada de productos y qué sistema debe actualizar cada dato.",
  },
  Nubox: {
    question: "¿Necesitas contabilidad o resolver el trabajo previo al asiento?",
    ruka: "Preparar el detalle operativo: productos, unidades, recepción y costos.",
    alternative: "Trabajar libros, balances, conciliación y asientos contables.",
    distinction: {
      title: "El contador y operaciones necesitan leer la misma compra de otra manera.",
      text: "Registrar un documento para contabilidad no explica necesariamente qué insumo llegó ni cómo cambió su costo. Puedes conservar el sistema contable y mejorar la información operativa, definiendo el intercambio que realmente necesitas.",
    },
    proof: "purchase",
    proofTitle: "La información que operaciones necesita además del documento.",
    proofLead: "Producto del proveedor, cantidad, unidad, importe e insumo maestro aparecen juntos. Esta vista explica el detalle de la compra; no representa un asiento contable ni una sincronización con Nubox.",
    practice: "Con una factura real de tu operación, separa los datos que necesita contabilidad de los que usa el equipo para recibir, registrar y comparar compras.",
  },
  Defontana: {
    question: "¿Falta un sistema central o falta alimentar bien el que ya tienes?",
    ruka: "Automatizar el ingreso y la revisión de información sobre tus sistemas actuales.",
    alternative: "Centralizar compras, ventas, inventario y contabilidad en un ERP.",
    distinction: {
      title: "Cambiar dónde guardas los datos no elimina cómo los preparas.",
      text: "Antes de reemplazar un ERP, sigue el trabajo que ocurre alrededor: documentos que llegan por distintas vías, productos que hay que relacionar y datos que alguien vuelve a ingresar. Ahí se define si falta una plataforma o automatizar un proceso.",
    },
    proof: "receipt",
    proofTitle: "La recepción también forma parte del dato que llega al sistema.",
    proofLead: "En la demo de Ruka se revisan cantidades recibidas y se marcan incidencias por producto. El destino de esa información se acuerda por proceso; esta captura no acredita una escritura en Defontana.",
    practice: "Recorre una compra desde la factura hasta el ERP. Anota dónde una persona copia información, qué verifica y qué campo debe quedar actualizado al terminar.",
  },
  Chipax: {
    question: "¿Quieres explicar el movimiento del banco o el detalle de la compra?",
    ruka: "Controlar insumos, cantidades recibidas y costos; preparar el trabajo de compras.",
    alternative: "Ordenar caja, pendientes y la relación entre movimientos bancarios y documentos.",
    distinction: {
      title: "Un pago conciliado no confirma que recibiste todo.",
      text: "La conciliación bancaria relaciona dinero y documentos. La revisión operativa contrasta qué se compró y qué se recibió. Son controles complementarios: uno no debe darse por hecho porque el otro esté resuelto.",
    },
    proof: "receipt",
    proofTitle: "La diferencia que no aparece al mirar solo el banco.",
    proofLead: "Esta recepción de ejemplo registra 14 kg frente a 16 kg esperados y permite marcar la incidencia. El importe de una transferencia, por sí solo, no describe esa diferencia física.",
    practice: "Usa una compra con recepción parcial. Revisa por separado el documento, el movimiento bancario y la cantidad recibida antes de dar el proceso por terminado.",
  },
  KAME: {
    question: "¿Falta un control o falta quitar trabajo para mantenerlo al día?",
    ruka: "Reducir tareas repetidas al incorporar documentos, relacionar productos y mantener costos.",
    alternative: "Gestionar órdenes, aprobaciones, recepción, inventario y contabilidad en el ERP.",
    distinction: {
      title: "No necesitas duplicar una recepción que tu ERP ya resuelve.",
      text: "KAME documenta controles de compras y recepción. El aporte de Ruka debe evaluarse en el trabajo manual que queda: preparar el dato, relacionar insumos o completar un flujo entre sistemas. Si ese trabajo ya está resuelto, sumar otra herramienta puede no aportar.",
    },
    proof: "receipt",
    proofTitle: "El control importa. También cuánto trabajo cuesta alimentarlo.",
    proofLead: "La recepción en Ruka permite contrastar cantidades y registrar incidencias. No es una capacidad exclusiva: compárala con tu configuración de KAME y busca el paso manual que aún necesitas resolver.",
    practice: "Parte de tu configuración actual, no de una lista de funciones. Sigue una compra y distingue qué hace KAME, qué hace tu equipo y qué tarea concreta podría tomar Ruka.",
  },
  Bsale: {
    question: "¿Tu problema está al vender o al incorporar lo que compras?",
    ruka: "Relacionar productos de proveedores con insumos, unidades y costos de compra.",
    alternative: "Gestionar caja, documentos de venta, inventario y canales online.",
    distinction: {
      title: "Vender unidades y comprar cajas exige hablar el mismo idioma.",
      text: "Si el punto de venta funciona, no empieces por reemplazarlo. Revisa cómo llega la información de compras, quién define las equivalencias y qué sistema mantiene cada dato de stock y costo.",
    },
    proof: "purchase",
    proofTitle: "La compra tiene un detalle que la caja no debería reconstruir.",
    proofLead: "Ruka relaciona el producto escrito por el proveedor con el insumo de tu operación. El intercambio con un punto de venta depende del acceso y alcance acordados, no de que aparezca su logo.",
    practice: "Elige un producto que vendas por unidad y compres en otro formato. Revisa la equivalencia y quién debe actualizar el stock y el costo, sin hacer que dos sistemas compitan por el mismo dato.",
    costExample: true,
  },
  Clay: {
    question: "¿Necesitas cerrar las cuentas o entender qué cambió en tus compras?",
    ruka: "Trabajar productos, presentaciones, recepción y costos a nivel de insumo.",
    alternative: "Conectar finanzas y contabilidad desde bancos y SII, con opciones de servicio contable.",
    distinction: {
      title: "Gastar más no siempre significa comprar más.",
      text: "El total de compras puede subir por volumen, precio o una presentación distinta. Mirar el insumo y su unidad ayuda a separar esas causas. Esa lectura operativa no reemplaza la conciliación ni el trabajo contable.",
    },
    proof: "purchase",
    proofTitle: "Del gasto agregado a lo que pasó con cada insumo.",
    proofLead: "Cantidades, unidades y productos relacionados permiten revisar el detalle detrás del importe. La captura muestra una compra de ejemplo en Ruka, no un cierre contable ni resultados obtenidos en Clay.",
    practice: "Toma un insumo cuyo gasto haya aumentado. Compara cantidad comprada, presentación y costo unitario antes de atribuir el cambio a una sola causa.",
    costExample: true,
  },
};
