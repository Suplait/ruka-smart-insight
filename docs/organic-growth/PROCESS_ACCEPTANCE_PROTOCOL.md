# Protocolo de aceptación — compra hacia Toteat

Estado: listo para revisión del responsable; ejecución externa pendiente. No es una función nueva del producto ni una autorización para escribir en una cuenta real.

## Antes de tocar una cuenta

El responsable de Ruka y el administrador del destino deben confirmar por escrito: cuenta de prueba, permisos, alcance, datos permitidos y persona que verificará el resultado. No usar una cuenta de cliente por comodidad. No enviar correos, notificaciones ni movimientos productivos como parte de una prueba implícita.

El operador identifica versión desplegada, configuración relevante, fecha/hora y estado previo. Los diez tests locales existentes pertenecen a una copia de código identificada: no prueban que producción use esa versión. Si las versiones difieren, se vuelve a inspeccionar antes de extender cualquier conclusión.

## Un fixture pequeño, pero que permita decidir

Preparar un documento ficticio con identificador inequívoco, dos productos y dos destinos de prueba. Acordar cantidades y unidades explícitas. No usar RUT, razón social ni cuenta bancaria de un cliente real. Guardar la correspondencia origen → producto → unidad → local en el espacio privado autorizado.

El responsable define el resultado esperado antes de ejecutar. Capturar el estado anterior sin personas, tokens, otras compras ni navegación privada visible. No basta con observar un “éxito” en Ruka: el resultado se revisa también en el destino.

### Hoja de expectativa, fijada antes del primer intento

Una fila por combinación de línea y local. Si una línea se reparte entre locales, registrar cada parte y comprobar que la suma conserva la cantidad acordada. Esta hoja es un control humano de la prueba, no una afirmación de que el servicio calcule o valide automáticamente todos sus campos.

| Línea ficticia | Producto/código de destino | Local | Cantidad y unidad esperadas | Fecha de emisión / fecha de registro | Incluida o excluida, y motivo |
| --- | --- | --- | --- | --- | --- |
| A | Por definir | Por definir | Por definir | Por definir / por definir | Por definir |
| B | Por definir | Por definir | Por definir | Por definir / por definir | Por definir |

No ejecutar con casillas pendientes. Anotar por separado las dos fechas: la prueba local comprueba que se transmiten ambas, no que el destino las interprete correctamente. Si costos, impuestos o redondeos forman parte del alcance, agregar su base y tolerancia acordada antes de probar; no dar por validado un cálculo solo porque coincidió el total. No cambiar la expectativa después para hacer que coincida con el resultado.

## Casos mínimos

| Caso | Preparación segura | Qué comprobar | Evidencia local disponible | Falta comprobar fuera del harness |
| --- | --- | --- | --- | --- |
| Compra válida | Líneas y relaciones acordadas | Registro final correcto por local, cantidad, unidad, fecha y referencia | Servicio completa tras respuestas positivas controladas | Datos reales de prueba, resolución, persistencia y resultado externo |
| Ya reportada | Misma compra marcada/reportada como enviada | No volver a solicitarla por ese flujo | Servicio omite la solicitud | Origen/persistencia de esa marca; concurrencia y deduplicación por identidad son otras pruebas |
| Unidad incompatible | Equivalencia deliberadamente incompatible y aceptada como fixture | Detección, bloqueo y salida clara para corregir | Bloqueo cuando recibe una resolución incompatible | Detección desde datos de entrada y mensaje en UI |
| Local no resuelto | Una línea válida y otra con ruteo bloqueante | No completar parcialmente por accidente | Servicio detiene antes de HTTP | Qué configuración produce ese bloqueo y cómo lo corrige el operador |
| Línea excluida sin bloqueo | Una línea válida y otra clasificada como no resuelta, no bloqueante | Identificar qué se envió y qué quedó fuera; contrastar con el alcance esperado | Servicio puede marcar enviada la factura y devolver una advertencia de exclusión | Visibilidad de la advertencia, destino real y resolución posterior de la línea omitida |
| Fallo parcial | Solo en entorno que permita inyectar fallos con permiso | Conservar destinos confirmados, no marcar el conjunto como completado | Fallo y timeout de segundo grupo controlados | Persistencia de tracking y estado de cada destino |
| Reintento | Partir de un fallo conocido con tracking recuperable | Reenviar solo lo pendiente y comprobar estado final | Servicio lo hace con tracking simulado | Tracking real, concurrencia, respuestas tardías y resultado externo |

Recepción parcial, notas de crédito y detección general de documentos duplicados **no están validadas por esos tests**. Si son necesarias para el caso comercial, se agregan como requisitos de aceptación pendientes y no se aprueba el proceso sin probarlas.

## Timeout: el estado importante es “no sabemos”

Una falta de respuesta no demuestra que el destino no haya registrado. No volver a enviar todo por reflejo. El responsable revisa el destino y el historial disponible antes de decidir. Si no puede identificar de forma fiable qué ocurrió, el caso queda indeterminado y requiere resolución humana. No prometer rollback, idempotencia universal ni recuperación automática.

### No confundir “no lo veo” con “no existe”

Comprobar cuenta, local, permisos y filtros antes de buscar la referencia del fixture. Si el destino procesa de forma asíncrona, su responsable acuerda una ventana de observación y cómo confirmar un estado final; no inventar aquí un plazo universal. Registrar cuándo y dónde se buscó. Si la consulta falla, no hay acceso suficiente o vence la ventana sin poder determinar el resultado, marcar **indeterminado**, no “cero registros”.

Para afirmar que un bloqueo evitó una escritura, combinar la evidencia del lado de Ruka con la revisión autorizada del destino. Un mensaje de error o un botón deshabilitado por sí solos no acreditan ausencia de efectos externos. La cobertura de los tests aislados se limita a las solicitudes HTTP capturadas por sus dobles de prueba.

### Un reintento no es una compra nueva

Conservar el mismo identificador de factura, evento, líneas, relaciones y distribución del intento original. Comparar la configuración y el tracking recuperado antes de repetir. No recrear la factura ni borrar su historial para “volver a probar”: eso cambia la pregunta y puede ocultar una duplicación.

Si alguien cambia producto, código de destino, cantidad, reparto o reglas después del fallo, detener el reintento de este protocolo. Primero hay que acordar cómo conciliar lo ya enviado con la nueva intención. El comportamiento ante cambios durante la recuperación no está validado por la prueba local de tracking; no extrapolarla. Tampoco simular una caída de red o retirar permisos en una cuenta compartida para obtener un fallo parcial: requiere un entorno preparado y autorización específica.

## Registro de cada ejecución

Usar una fila por intento, sin sobrescribir el anterior:

| Campo | Contenido requerido |
| --- | --- |
| Identificador de prueba/intento | ID estable y consecutivo |
| Autorización | Referencia al permiso, no copia de credenciales |
| Código/entorno | Versión, cuenta de prueba y configuración relevante minimizada |
| Entrada y expectativa | Fixture seguro y resultado acordado antes de ejecutar |
| Observación | Qué ocurrió en Ruka y qué ocurrió en el destino, por separado |
| Evidencia | Capturas/logs seguros con hora, referencia y hash cuando corresponda |
| Resultado | Aprobado, fallido, indeterminado o no ejecutado |
| Siguiente acción | Corregir, repetir con condiciones, acotar alcance o detener |
| Revisión | Responsable que comprobó el resultado y cuándo |

Una captura de demo no se usa como comprobante de escritura. Un test con HTTP simulado se conserva como test aislado. El operador puede declarar que un caso no aplica y justificarlo; no convertirlo silenciosamente en aprobado.

## Decisión de aceptación

Se autoriza solamente el alcance que tenga entradas, reglas, salida y contingencia verificadas por los responsables. Un fallo crítico o resultado indeterminado bloquea ese alcance. No compensar un fallo con nueve casos verdes ni promediar controles de distinta importancia.

“Enviada” no equivale a “todas las líneas quedaron registradas”: el test aislado de una exclusión no bloqueante devuelve éxito con advertencia. Si la expectativa acordada exige todas las líneas, una línea faltante impide aprobar el caso aunque el servicio responda éxito. Una exclusión intencional solo es aceptable si estaba acordada antes y existe responsable para lo que queda pendiente.

Para detener la prueba: cortar nuevos intentos, registrar los identificadores ya enviados y conservar evidencia. Cualquier corrección o eliminación en el destino necesita aprobación y procedimiento propio; no ejecutar una limpieza destructiva automática.

La autorización para usar un caso comercial, una captura o una marca en público es separada de la autorización para probar. Si no existe, el material público solo usa datos ficticios y describe con precisión su nivel de evidencia.

## Entrega al responsable: una decisión que pueda revisar otra persona

El cierre de la prueba incluye:

- Alcance exacto evaluado, versión y fecha; qué quedó fuera.
- Hoja de expectativa original y comparación por línea/local, incluidas las exclusiones.
- Resultado de cada escenario, con enlaces privados a intentos y comprobaciones del destino. Los casos no ejecutados siguen visibles.
- Diferencias y estados indeterminados pendientes; responsable y siguiente acción acordada, sin inventar fechas de resolución.
- Decisión: **aceptado para el alcance escrito**, **rechazado** o **pendiente de evidencia**. Indicar quién la tomó y cuándo.
- Permiso de difusión separado: sin permiso, no publicar capturas, cuenta, nombres ni testimonio.

La persona que acepta debe poder seguir estas referencias sin una explicación oral del ejecutor. Si falta acceso a una evidencia necesaria, la aceptación queda pendiente. Haber terminado el protocolo, aprobado los tests locales o redactado esta hoja no cuenta como firma del responsable.

### Estado al 15-10-2026

Preparación y pruebas aisladas completadas; cuenta externa, operador y aceptación pendientes. No existe todavía una compra de prueba enviada a Toteat por este trabajo ni una autorización para operar cuentas productivas.
