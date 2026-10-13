# Consumidor de trazabilidad ClickUp

Fuente: `scripts/lead-traceability/build-clickup-workflow.mjs`, con proyección pura en `clickup-projection.mjs`.

```sh
node scripts/lead-traceability/build-clickup-workflow.mjs
node --test scripts/lead-traceability/clickup-projection.test.mjs
```

Borrador guardado en Ruka.ai: `lCtphAXKkdzgMa5h`. No publicado, sin cron y sin webhook. Los IDs del JSON son referencias a credenciales existentes, no claves. La importación del archivo en esta versión de n8n no aplicó los settings: confirmar por UI **Do not save** para ejecuciones fallidas, correctas y manuales, orden v1 y timeout de un minuto. MCP permanece desactivado para este borrador.

La lista y el campo de producción están fijados en el SQL y el proyector. No ejecutar con tareas reales como prueba de escritura. La única ejecución remota realizada usó una cola sin asociaciones, y se detuvo antes del GET de ClickUp. Para QA de escritura falta preparar un destino aislado y su configuración explícita; no relajar el guard de lista para apuntar a cualquier tarea.

## Contrato de enlace publicado

El workflow comercial conserva sus nodos y sus acciones. La rama independiente publicada en `Creación de leads` llama por HTTP con la credencial Supabase existente:

```text
POST /rest/v1/rpc/trace_link_clickup
{ "p_submission": "UUID del submission persistido", "p_task_id": "ID de la tarea ya resuelta", "p_list_id": "901301203866" }
```

No inferir el submission a partir del item actual sin verificar qué disparador lo produjo: el workflow mezcla entradas Supabase y Calendly. No volver a ejecutar el flujo comercial para recuperar la referencia. La llamada repetida al RPC devuelve false y no genera otra evidencia ni otro envío. Una referencia diferente es un error explícito que requiere reconciliación.

Fuente del enlace: `build-clickup-link.mjs`, `clickup-link.mjs` y `lead-clickup-link-nodes.json`. Se añaden ramas desde **Crea el lead** y **Guardar ID del lead**. El proyector lee el INSERT original, exige un único task de la lista correcta y omite entradas Calendly/antiguas. El export antes/después confirmó intactos los 73 nodos originales y su grafo; sólo se añadieron tres nodos y cuatro conexiones.

## Consumo

`trace_claim_clickup_delivery` devuelve una entrega y un resumen de los envíos asociados a la tarea, sin token de continuación ni snapshot de contacto. Reserva una tarea por vez durante 90 segundos, incluyendo exclusión entre submissions que comparten task. Los nodos HTTP tienen timeout de diez segundos y el workflow de sesenta. El proyector rechaza tareas ajenas, subtareas, campos ausentes y reservas que vencerán en menos de quince segundos.

Sólo se escribe `POST /task/{id}/field/{field}` con `{value}`. No hay creación de tasks, comentarios, cambios de status/nombre/descripcion/fecha/responsables ni llamadas a bots. Antes de escribir, se compara el valor para que un retry ambiguo pueda confirmarse sin una segunda escritura. `trace_finish_delivery` confirma sólo el lease y la revisión recibidos; evidencia posterior sigue pendiente. Se deben programar salud, alertas y recuperación de trabajos agotados antes de activar el horario.

## Recuperación de reuniones Calendly

Fuente: `scripts/lead-traceability/build-calendly-workflow.mjs`. Genera `lead-calendly-reconciliation.json` con cuatro nodos: disparador manual, horario cada quince minutos, lectura de Mauro y resultado. Workflow publicado `30VjXmWyrIhz8hXh`. Settings aplicados y comparados con export: v1, no guardar ejecuciones correctas/fallidas/manuales, timeout de dos minutos; MCP apagado. El JSON exportable conserva `active:false` para evitar activaciones involuntarias al importar.

Llama `lead-calendly-reconcile` con la credencial Supabase existente y `{account: "classic"}`. Token/usuario de Mauro y receptor firmado están configurados; la prueba manual previa leyó cuatro páginas y guardó dos reuniones reales. Lorenzo/One queda fuera por petición expresa del usuario. El endpoint nunca sustituye una cuenta por otra. Lee `/users/me` para comprobar identidad, procesa hasta cuatro páginas y persiste evidencia junto con el cursor. No llama a workflows comerciales ni escribe tareas/mensajes.

La cola privada conserva un lease por usuario, backoff y ocho intentos sin progreso. Sólo se marca terminado después de recorrer eventos e invitados activos/cancelados. El siguiente ciclo completo vence en 24 horas; el horario más frecuente permite avanzar páginas pendientes. El resultado devuelve `ok:false` ante error: la vigilancia debe comprobar esa respuesta y la salud persistida, no sólo el estado verde de n8n. Falta observar la primera ejecución automática y conectar las alertas.
