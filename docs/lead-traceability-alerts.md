# Alertas de trazabilidad

Responsable: equipo Ruka de captación; Camilo administra la integración.

El monitor independiente de n8n consulta cada cinco minutos un RPC privado de Supabase. Publica en el canal actual de leads sólo al aparecer/cambiar un tipo de problema y al recuperarse. Cambios de conteos dentro del mismo incidente no repiten avisos. Hay treinta minutos de espera ante oscilaciones o una entrega Slack no confirmada. No menciona usuarios ni al canal y no ejecuta workflows comerciales.

## Qué hacer ante cada aviso

| Señal | Comprobación y acción |
| --- | --- |
| Supabase no responde | Revisar disponibilidad del proyecto y credencial Supabase en n8n. No reejecutar el workflow comercial ni crear leads para recuperarlo. |
| Worker sin actividad | Revisar el horario publicado de `Trazabilidad leads · Slack y ClickUp` y sus errores. Restablecer el consumidor; las revisiones pendientes conservan su identidad. |
| Persistencia fallida/no confirmada | Revisar el submission indicado por las consultas inferiores y su evidencia. Comprobar primero si existe el lead antes de cualquier intervención. Un aviso anticipado no prueba un INSERT. |
| Slack atrasado | Revisar `last_error`, canal/ts confirmados y credencial del bot. No reenviar un mensaje incierto ni buscarlo automáticamente en el historial del canal. |
| ClickUp atrasado | Revisar si el workflow comercial guardó el vínculo a una tarea existente. Comprobar lista/campo y credencial. No crear otra tarea ni tocar estados comerciales. |
| Reintentos agotados | Corregir la causa y reservar de nuevo sólo el enriquecimiento fallido, conservando submission, tarea y mensaje originales. Nunca reejecutar el INSERT comercial. |
| Reconciliación Mauro atrasada | Revisar el horario de quince minutos, `last_error`, cursor y credencial Calendly. No borrar el cursor ni volver a crear suscripciones como primer remedio. Un ciclo terminado puede dormir 24 horas. |
| Reunión sin asociación | Revisar las reuniones reservadas en los últimos siete días sin lead inequívoco. No atribuir una reunión a un candidato ambiguo. Lorenzo está fuera de esta conexión. |

Las alertas no cuentan los ClickUp pendientes de One: ese flujo no tiene un vínculo CRM verificado. Una recuperación significa que las comprobaciones vuelven a estar dentro de sus umbrales, no que se haya reconstruido información ausente.

## Consultas privadas de diagnóstico

Ejecutar con una cuenta autorizada de Supabase. No copiar snapshots de contacto, tokens ni errores con cabeceras al canal.

```sql
select public.trace_monitor_snapshot();

select s.id, s.funnel, s.status, s.lead_id, s.one_lead_id,
       d.destination, d.pending_since, d.revision, d.delivered_revision,
       d.attempts, d.state, d.last_error
from public.lead_delivery_outbox d
join public.lead_submissions s on s.id=d.submission_id
where d.revision>d.delivered_revision
  and (d.destination='slack_enrichment' or s.funnel='classic')
order by d.pending_since;

select job,last_started_at,last_completed_at,result
from public.lead_traceability_health;

select attempts,next_attempt_at,cycle_started_at,cycle_completed_at,
       pages_processed,last_error
from public.lead_calendar_reconciliation;
```

## Límites y verificación

Los avisos usan conteos, nunca datos de contacto. El RPC es exclusivo de `service_role`. El monitor queda fuera de Supabase, pero comparte n8n con los consumidores: una caída completa de n8n requiere un segundo monitor externo; ese punto sigue pendiente. Tampoco están implementadas aquí las alertas de volumen ni la conciliación analítica diaria de GA4.

La memoria del cooldown se guarda en [static data de n8n](https://docs.n8n.io/build/code-in-n8n/cookbook/built-in-methods-and-variables-examples/getworkflowstaticdata.md) y se persiste sólo en ejecuciones publicadas con trigger que terminan correctamente. La entrada manual comprueba la consulta y decisión; no demuestra persistencia del cooldown. No publicar más de una copia del monitor. La cadencia de cinco minutos y el timeout de un minuto evitan solapamiento normal.

Estado de despliegue (13 de octubre de 2026): migración `20261014000000` aplicada. [Monitor publicado](https://ruka.app.n8n.cloud/workflow/ATYzHphnfkJMZX3J), versión «Monitor de leads: consulta y Slack verificados», cada cinco minutos. Consulta real con ocho señales en cero y decisión sin salida. Prueba de Slack confirmada en `C08DUJ6V2G6/1791926192.575939`, con `delivered=true`. Se retiró la salida fijada de prueba y se repitió la consulta real antes de publicar: cero salidas y ningún nuevo mensaje. El acceso MCP automático fue retirado.

La publicación del horario está confirmada; la primera ejecución programada no tiene evidencia retenida porque el workflow no guarda ejecuciones. La prueba manual verifica consulta, decisión y entrega, pero no demuestra persistencia del cooldown entre ejecuciones programadas.
