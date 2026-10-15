# Dos situaciones de compra — investigación y borradores editoriales

15-10-2026. No publicado. El destino editorial se eligió después de revisar las páginas existentes, no para aumentar el número de URLs. No hay estimación comprobada de volumen de búsqueda o conversión para estas situaciones.

## 1. La compra aparece, pero faltan los productos

**Decisión del lector:** localizar el detalle necesario antes de contratar una automatización o mandar a alguien a reconstruir la compra.

**Superficie propuesta:** ampliar `/integraciones/sii` con una sección de diagnóstico y enlazarla desde la guía existente de registro. No crear otra guía general “SII a ERP”: ya hay una ficha de alcance y un artículo de registro sin cambiar ERP.

**Encaje confirmado en el código:** `src/content/integrationGuides.json`, ficha `sii`, ya explica que el XML es solo el comienzo y pregunta qué hacer si falta. El añadido debe desarrollar esa respuesta con el diagnóstico, no repetir el hero, los tres pasos de integración ni otro CTA. Mantener el título, URL y enlace existente al registro de compras. La ficha no se convierte en una segunda guía general.

**Base:** el SII describe el Registro de Compras y Ventas como un registro para respaldar operaciones y controlar IVA, alimentado por documentos tributarios. Eso no acredita por sí mismo que una exportación concreta contenga todas las líneas operativas necesarias. Fuente primaria revisada: https://www.sii.cl/destacados/f29/registrocompraventas.htm

La ficha actual de Ruka ya condiciona el detalle a la disponibilidad de XML u otra fuente. No se confirmó en esta investigación una vía universal para obtener cualquier XML ni se ofrece eludir autenticación o permisos.

### Borrador: “Veo la factura, pero no tengo sus productos”

Antes de cambiar de herramienta, separa dos preguntas: ¿puedes identificar la compra? ¿Tienes el detalle para trabajar con ella?

Ver proveedor, folio y total ayuda a reconocer un documento. Para registrar insumos también necesitas saber qué se compró, cuánto y en qué unidad. Comprueba el archivo que realmente tienes; no supongas que una fila en el registro incluye ese detalle.

**Haz esta revisión con una compra:**

1. **Confirma que es el mismo documento.** Compara emisor, receptor, tipo y folio con el respaldo original. Una coincidencia de total no basta.
2. **Abre el respaldo disponible.** Revisa si el XML, PDF u otro archivo autorizado contiene las líneas. La extensión del archivo no garantiza que incluya todo lo necesario ni que sea el documento correcto.
3. **Marca lo que falta.** Producto, cantidad, unidad, descuentos y referencias que tu proceso requiera. “No disponible” es distinto de cero.
4. **Busca el respaldo que falta.** Comprueba el portal del facturador o pide el documento al proveedor, usando los accesos autorizados. Si solo hay una imagen, revisa que se lean los productos y sus cantidades.
5. **Recién entonces prueba el siguiente paso.** El detalle puede estar completo y aun así faltar la relación con tus productos o el local de destino.

Anota lo que encontraste y quién puede confirmar lo que falta:

| Dato necesario | Dónde lo encontré | Quién confirma lo que falta |
| --- | --- | --- |
| Identidad del documento | __________ | __________ |
| Productos y cantidades | __________ | __________ |
| Unidades/presentaciones | __________ | __________ |
| Destino operativo | __________ | __________ |

Si no consigues el detalle, no evalúes la automatización como si ya estuviera disponible. Acuerda primero la fuente y cómo revisar lo leído. Tampoco confundas el documento con la recepción física: saber qué se facturó no demuestra qué llegó.

Puedes pedir el respaldo así: “Necesito el detalle de productos, cantidades y unidades de esta factura. Tengo el folio y el total, pero me faltan las líneas”. Comparte la referencia por el canal autorizado de tu empresa; no adjuntes credenciales. Tener el detalle permite seguir la evaluación, no autoriza por sí solo un envío ni un pago.

Para comprobar si Ruka puede continuar ese registro, revisamos qué detalle está disponible y dónde debe quedar. Los límites tributarios y de acceso siguen siendo los de esta ficha.

### Prueba de utilidad pendiente

Con una muestra segura, una persona debería distinguir identidad de detalle, señalar dónde falta información y decidir a quién pedirla sin enviarnos sus credenciales. No basta con que recuerde “Ruka lee XML”.

**Ejercicio para revisión, no resultado:** mostrar una fila ficticia con proveedor/folio/total y un respaldo separado con dos productos. Preguntar “¿Qué puedes registrar con cada uno? ¿Qué pedirías antes de continuar?”. La respuesta suficiente diferencia documento de líneas y señala la fuente faltante. No es suficiente asumir que un total permite deducir productos, ni creer que tener un XML confirma la recepción física. Registrar primero la respuesta sin ayuda.

## 2. La factura dice cajas; la operación trabaja en kilos

**Decisión del lector:** saber si tiene una equivalencia válida antes de actualizar cantidades o costos.

**Superficie propuesta:** profundizar `/blog/actualizar-costos-precios-proveedores`, que ya contiene el ejemplo por kilo. Mantener su URL e intención. El añadido explica el caso que el cálculo simple no resuelve: una presentación ambigua o variable.

**Encaje confirmado en el código:** el artículo contiene `normalizar-unidades` y luego `aplicar-receta`. El diagnóstico de presentaciones va entre ambos: primero decide si existe una equivalencia; recién después se calcula. Conservar el ejemplo original de $1.000 → $1.200 por kg y no repetir sus explicaciones sobre impuestos, rendimiento o método de costo. No crear una FAQ nueva solo para volver a decir lo mismo.

**Base:** Toteat describe unidades por peso, volumen o unidad y conversiones según recetas. Eso respalda la importancia del problema, no demuestra cómo Ruka resuelve cualquier equivalencia. Fuente primaria revisada: https://www.toteat.com/productos/control-de-inventarios-y-stock

Las pruebas aisladas de Ruka verificaron que su servicio de envío se detiene cuando recibe una resolución incompatible. No validaron que deduzca automáticamente el contenido de una caja ni una conversión desde cualquier documento.

### Borrador: “¿Cuántos kilos trae esa caja?”

Si una caja siempre contiene cuatro bolsas de dos kilos del mismo producto, dos cajas representan 16 kg. Pero si el proveedor factura dos cajas de peso variable, el número de cajas no alcanza para calcular los kilos. Necesitas el peso correspondiente a esa entrega.

Antes de actualizar el costo o el inventario, anota cuatro cosas: el producto exacto, la unidad facturada, el contenido comprobado y la unidad que usa tu operación.

| Lo que recibes | Lo que sabes | Qué hacer |
| --- | --- | --- |
| Dos cajas de cuatro bolsas de 2 kg | Presentación fija confirmada; mismo producto | Calcular 2 × 4 × 2 = 16 kg y conservar la equivalencia aprobada |
| Dos cajas de peso variable | Solo sabes cuántas cajas llegaron | Obtener el peso de esa entrega; no reutilizar el de la anterior |
| Seis botellas de 1 litro | Volumen confirmado | Son 6 litros; no asumir 6 kg para cualquier producto |
| La misma descripción, otra presentación | Cambió el contenido o no está confirmado | Revisar antes de reutilizar la relación anterior |

Son ejemplos ficticios de revisión manual, no resultados de una ejecución de Ruka. Las equivalencias dependen del producto y de lo efectivamente documentado.

**El riesgo:** ingresar “2” como kilos cuando eran dos cajas. El sistema puede aceptar el número y dejar mal el stock.

No conviertas una unidad desconocida en “1” para terminar el registro. Deja el caso pendiente, consigue el dato y define quién puede aprobar esa equivalencia. Si cambia la presentación, vuelve a revisarla: un nombre parecido no garantiza que la relación siga siendo válida.

La decisión puede quedar en una frase: “Este producto se registra en kilos; esta presentación trae ___ kg, según ___, confirmado por ___”. Si no puedes completar el respaldo o el contenido, todavía falta un dato. Guardar esa relación tampoco reemplaza comprobar cuánto se recibió en esa compra.

Para evaluar una automatización, prueba una compra con la relación conocida y otra con una unidad incompatible. Mira la cantidad y la unidad en el destino, no solo la pantalla que dice enviado. Pregunta también qué ocurre si cambia el formato del proveedor y quién revisa los casos sin una regla acordada.

### Prueba de utilidad pendiente

Dar tres ejemplos seguros y pedir al lector que identifique cuál puede convertir, cuál necesita un dato adicional y cuál mezcla magnitudes. Si la respuesta es “Ruka lo adivina”, el texto falló y necesita otra iteración.

**Criterio para el facilitador:** con presentación fija confirmada, dos cajas de cuatro bolsas de 2 kg equivalen a 16 kg; con peso variable, faltan los kilos de esa entrega; seis botellas de un litro aportan seis litros, no una masa deducible sin más información. Aceptar explicaciones equivalentes, no exigir repetir el copy. Si la persona responde correctamente después de una pista, registrar la ayuda y no contar esa respuesta como comprensión inicial.

## Decisión editorial y límites de la investigación

- Ambas situaciones tienen una respuesta manual útil antes de recomendar software.
- No se atribuye al SII la promesa de entregar cualquier detalle ni a Toteat una certificación de Ruka.
- No se reutilizan capturas de otros artículos. La ampliación puede usar una tabla semántica; cualquier captura nueva debe ser segura, específica y mostrar algo que la tabla no explique mejor.
- Las fuentes externas sostienen hechos acotados; los ejemplos y recomendaciones de control son elaboración propia. No se convierten claims de un tercero en resultados de Ruka.
- Pendiente: adaptación a los componentes, pruebas de comprensión, render móvil/desktop, SEO server-side y publicación autorizada. Las cinco revisiones editoriales no cierran el entregable.

## Traspaso a implementación, una vez confirmada la dirección

- Publicar solo el copy útil para el lector. Las notas de investigación, referencias al repositorio y respuestas del facilitador no se insertan en la página.
- Conservar las dos URLs existentes y sus intenciones. Revisar el bloque completo después de insertar: no dejar dos explicaciones de lo mismo ni duplicar enlaces o CTAs.
- Atribuir a SII y Toteat únicamente los hechos acotados indicados en la base. Los ejercicios son propios y ficticios; no muestran una ejecución externa.
- Usar texto y tablas HTML legibles. Comprobar lectura sin JS, móvil, teclado y vista de impresión, sin convertir los ejercicios en una imagen.
- Cambiar la fecha editorial solo cuando se publique una actualización sustancial; no usarla como señal artificial de frescura. Verificar los documentos Markdown derivados, sitemap y canonical con el build real.
- Registrar las confusiones observadas en lectores y volver a revisar el bloque afectado antes de declarar validada su utilidad. No usar este checklist como sustituto de esas personas.
