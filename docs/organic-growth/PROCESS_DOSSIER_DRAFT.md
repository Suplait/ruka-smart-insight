# Llevar una compra a Toteat sin volver a ingresarla a mano

Borrador editorial para revisión. No publicado. No es una prueba de una cuenta real ni una oferta de implementación.

## La decisión, en una página

Ya tienes la factura. Eso no significa que hayas recibido toda la mercadería ni que sus productos estén listos para registrarse en tu operación. Todavía hay que relacionarlos con los que usas, comprobar las unidades y decidir a qué local corresponde cada línea. Recién entonces tiene sentido enviarla al sistema de destino.

Este expediente sirve para evaluar ese trabajo concreto: **preparar y enviar una compra a Toteat con productos, unidades y locales definidos**. No propone cambiar tu POS ni automatizar toda la empresa de una vez.

El resultado que hay que comprobar no es “se envió una solicitud”. Es que el registro correcto quedó en el local correcto, con cantidades, fechas y referencias que tu equipo pueda revisar.

### Qué permanece igual

Tu empresa define qué compró, qué recibió, cómo usa cada insumo y quién puede aprobar cambios. Toteat sigue siendo el destino acordado. Tu equipo conserva la decisión sobre diferencias que no tienen una regla resuelta.

### Qué se busca quitar del medio

Revisar y volver a ingresar la misma información de una compra en el destino, una vez que sus relaciones y reglas están definidas. El alcance y la disponibilidad se confirman para tu cuenta; no basta con reconocer el logo de la integración.

## ¿Sirve para tu caso?

Tiene sentido evaluarlo cuando registras compras repetidamente, existe un destino habilitado y alguien puede definir las equivalencias de producto, unidad y local.

Primero hay que resolver otra cosa si no puedes acceder al detalle de las líneas, no está claro qué se recibió, nadie puede aprobar las equivalencias o no hay permiso para probar el destino. Automatizar esas ambigüedades no las corrige.

Si solo necesitas un registro tributario o esperas que Ruka elija por sí sola cómo tratar cada producto, este expediente no demuestra ese alcance.

### ¿Vale la pena cambiar este paso?

Antes de evaluar software, sigue una compra completa y anota cuánto trabajo requiere hoy: reunir el detalle, resolver diferencias, registrarla y revisar el destino. Cuenta también las correcciones, no solo la digitación.

Si ocurre pocas veces y el registro manual funciona, quizá baste con dejar una rutina clara. Si el trabajo se repite o depende de una persona que conoce todas las equivalencias, vale la pena evaluar el proceso. No hay un umbral universal ni un ahorro calculado aquí: la decisión necesita tus datos y el alcance que se pueda comprobar.

## Qué necesitamos poner sobre la mesa

| Insumo | Para qué sirve | Quién debe confirmarlo |
| --- | --- | --- |
| Un documento de ejemplo seguro, con sus líneas | Seguir la misma compra desde el origen hasta el resultado | Responsable de compras |
| Producto de origen y producto del destino | Evitar que nombres parecidos se traten como equivalentes sin revisión | Responsable del catálogo |
| Unidad, presentación y equivalencia | Distinguir cajas, kilos, litros o unidades sin suponer conversiones | Operación |
| Local y distribución de las líneas | Saber dónde debe registrarse cada parte de la compra | Operación y administración |
| Fechas y reglas de registro | Comprobar el período que corresponde | Responsable del proceso |
| Cuenta de prueba y permisos de destino | Verificar el resultado sin afectar una operación real | Administrador del sistema |

No envíes contraseñas ni facturas de clientes por un formulario público. La primera conversación puede hacerse sin ellas.

## Un recorrido que se puede comprobar

1. **Delimitar una compra.** Elegir un ejemplo y acordar qué debe quedar registrado. No mezclar varios procesos para que la prueba parezca más completa.
2. **Resolver las relaciones.** Identificar productos, unidades y locales. Anotar lo que todavía no se sabe en vez de completarlo por intuición.
3. **Probar una ejecución autorizada.** Conservar el estado anterior y el resultado esperado. Un ejemplo de demo muestra la experiencia; no prueba la escritura en un sistema externo.
4. **Mirar el destino.** Comparar línea por línea y confirmar fechas, cantidades, productos y local. Una respuesta positiva intermedia no reemplaza ese control.
5. **Probar lo que puede salir mal.** Revisar una unidad incompatible, datos sin resolver y un envío parcial antes de dar el proceso por aceptado.

## Qué sabemos y qué todavía no

La revisión actual reproduce controles del servicio de envío con datos ficticios, sin conectarse a Toteat. Al entregarle una unidad identificada como incompatible o una asignación de local marcada como bloqueante, el servicio detiene el envío. También conserva información de un fallo parcial sin marcar toda la factura como terminada. Falta probar cómo se detectan esas condiciones desde la compra original y cómo se resuelven en la operación completa.

| Nivel de evidencia | Qué permite afirmar hoy |
| --- | --- |
| Prueba interna del servicio | Se reprodujeron los controles descritos con entradas y respuestas controladas |
| Demo visual | Puede explicar la experiencia; no comprueba la escritura en Toteat |
| Prueba completa en destino | Pendiente de ejecución con una cuenta autorizada |

También se probó un reintento con información previa de los grupos confirmados. **Ese resultado depende de poder recuperar dicha información.** Sin ella, la prueba vuelve a solicitar ambos destinos. No es una garantía universal contra duplicados.

También hay que revisar las advertencias: en la prueba de una línea no resuelta que no bloquea el envío, el servicio envía la línea válida y advierte que excluyó la otra. Por eso la aceptación compara las líneas esperadas con las que quedaron en el destino, no solo el estado “enviada”.

Si un envío queda sin respuesta, no asumas que no llegó. Antes de repetirlo, el responsable debe revisar el destino y el historial disponible. Si no se puede determinar qué pasó, se detiene el reintento hasta aclararlo. Este expediente no demuestra reversión automática de un registro externo.

Falta verificar el recorrido completo con una cuenta autorizada: cómo se obtienen y resuelven los datos, cómo se conserva el estado y qué queda efectivamente registrado en Toteat. No se ha medido ahorro de tiempo de un cliente con este expediente.

## La hoja para decidir con tu equipo

Completen esto antes de pedir que el proceso opere con información real:

- Trabajo a retirar del equipo: ____________________
- Origen del documento y detalle disponible: ____________________
- Destino y local que deben actualizarse: ____________________
- Responsable de productos, unidades y reglas: ____________________
- Qué debe detener el envío: ____________________
- Cómo comprobaremos un resultado completo: ____________________
- Qué haremos si no sabemos si un envío llegó: ____________________
- Evidencia que falta para autorizar el siguiente paso: ____________________

**La decisión no es “comprar porque la demo se ve bien”. Es acordar un proceso y saber cómo reconocer que funciona.**

### Resumen para compartir internamente

Queremos evaluar el trabajo de registrar una compra en Toteat, sin cambiar el POS. Primero necesitamos confirmar el detalle del documento, productos, unidades y locales. Hay controles del servicio probados de forma aislada, pero falta validar el recorrido completo y el resultado en una cuenta autorizada. Proponemos delimitar una compra de prueba, acordar cómo aceptar el resultado y revisar qué hacer si un envío queda indeterminado. Este documento no autoriza accesos, gastos ni cambios productivos.

Cuando ese alcance esté claro, [agenda una conversación con Ruka](https://www.ruka.ai/register). No implica plazo, piloto gratuito ni precio acordado. Si el proceso requiere otro alcance, se evalúa por separado; no se presenta la conexión estándar como un desarrollo a medida por defecto.
