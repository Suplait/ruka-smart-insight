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
| GA4 sin lectura | Revisar acceso, cuota y ejecución diaria del colector. Un error de API no es ausencia de conversiones. Ver [conciliación GA4](lead-ga4-reconciliation.md). |
| Caída de señales GA4 | Consultar `lead_ga4_reconciliations`, comparar tráfico, el mismo día semanal y conteos confirmados en Supabase. Es una señal agregada para investigar, no una prueba de leads perdidos. |

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

Los avisos usan conteos, nunca datos de contacto. El RPC es exclusivo de `service_role`. El monitor de n8n queda fuera de Supabase. Lo complementa el comprobador de Supabase descrito abajo, que cubre ausencia prolongada del worker aunque n8n no funcione. Una caída simultánea de ambos proveedores o de Slack puede impedir la notificación. Tampoco están implementadas aquí las alertas de volumen ni la conciliación analítica diaria de GA4.

La memoria del cooldown se guarda en [static data de n8n](https://docs.n8n.io/build/code-in-n8n/cookbook/built-in-methods-and-variables-examples/getworkflowstaticdata.md) y se persiste sólo en ejecuciones publicadas con trigger que terminan correctamente. La entrada manual comprueba la consulta y decisión; no demuestra persistencia del cooldown. No publicar más de una copia del monitor. La cadencia de cinco minutos y el timeout de un minuto evitan solapamiento normal.

Estado de despliegue (13 de octubre de 2026): migración `20261014000000` aplicada. [Monitor publicado](https://ruka.app.n8n.cloud/workflow/ATYzHphnfkJMZX3J), versión «Monitor de leads: consulta y Slack verificados», cada cinco minutos. Consulta real con ocho señales en cero y decisión sin salida. Prueba de Slack confirmada en `C08DUJ6V2G6/1791926192.575939`, con `delivered=true`. Se retiró la salida fijada de prueba y se repitió la consulta real antes de publicar: cero salidas y ningún nuevo mensaje. El acceso MCP automático fue retirado.

La publicación del horario está confirmada; la primera ejecución programada no tiene evidencia retenida porque el workflow no guarda ejecuciones. La prueba manual verifica consulta, decisión y entrega, pero no demuestra persistencia del cooldown entre ejecuciones programadas.

## Comprobador externo a n8n

`lead-external-watchdog` corre desde Supabase cada cinco minutos (`pg_cron` → `pg_net` → Edge Function). Usa el último `last_completed_at` del worker como señal, no tráfico de clientes: una landing sin leads sigue saludable si el worker completa sus consultas vacías. Tras 30 minutos sin actividad confirmada envía un aviso al canal existente, aunque todo n8n esté caído. Es una escalación independiente de la señal de diez minutos del primer monitor; no demuestra por sí sola la causa del fallo. No prueba disponibilidad de cada workflow de n8n.

El mensaje identifica responsable y workflow a revisar. No ejecuta consumidores ni crea leads/tareas. Cuando vuelve el heartbeat, envía una recuperación que no afirma haber resuelto todas las entregas. La reserva se persiste antes de llamar Slack; conserva 30 minutos de cooldown, y una respuesta incierta no se reenvía automáticamente aunque termine ese plazo. Sólo un rechazo explícito admite reintento. El intento anterior no puede confirmar otro intento más reciente.

La función exige `X-Lead-Watchdog-Signature` con formato `t=<epoch>,v1=<HMAC-SHA256>`. Firma `timestamp + '.' + cuerpo exacto` con una clave dedicada de 256 bits en Vault y Edge. Rechaza firmas de más de tres minutos y cuerpos alterados. La cola y el horario no contienen el secreto ni una clave `service_role`. Un replay de la misma solicitud válida queda sujeto a la reserva idempotente. El cuerpo ordinario es `{}`. El cuerpo firmado `{"probe":true}` tiene una reserva independiente y permite una única prueba explícita del canal; no simula una caída ni una recuperación. `LEAD_WATCHDOG_ENABLED=false` apaga el envío.

La migración `20261014022000` intentó retirar permisos de la cola HTTP; la verificación mostró que no tuvo efecto porque la tabla pertenece al rol administrado `supabase_admin` y el rol de migración no puede revocar sus concesiones. Se conserva el historial aplicado. **No se afirma que esos permisos estén cerrados.** La migración `20261014023000` reemplaza el transporte del secreto por firma temporal. Se pausó sólo este job durante el cambio y se rotó de nuevo su clave; la anterior devuelve 401. No se afirma que haya ocurrido una lectura no autorizada. Las credenciales y los triggers de captación no cambiaron; el trigger HTTP existente usa `security definer`. Los permisos administrados de pg_net requieren revisión del administrador/proveedor si se desea restringir esa infraestructura además del protocolo firmado.

Migraciones `20261014020000`–`20261014023000` aplicadas y función desplegada. Prueba real de entrega: autorización incorrecta 401; consulta sana 200/sin aviso; probe 200/entrega confirmada; segundo probe y consulta posterior 200/sin aviso. El protocolo firmado posterior se verifica con clave anterior, cuerpo alterado, firma expirada, consulta sana y probe repetido. Pruebas locales SQL y ocho pruebas Edge cubren fallo/transporte, duplicados, recuperación, cooldown, permisos, firmas y falta de confirmación. El scheduler se verifica separadamente de estas llamadas directas.

Diagnóstico privado, sin historial de Slack:

```sql
select id,last_state,delivery_state,checked_at,confirmed_at,cooldown_until
from public.lead_watchdog_state;
select jobname,active,schedule from cron.job
where jobname='lead-external-watchdog';
select r.start_time,r.end_time,r.status
from cron.job_run_details r join cron.job j using(jobid)
where j.jobname='lead-external-watchdog'
order by r.start_time desc limit 5;
```

Un job SQL exitoso sólo confirma que encoló la llamada HTTP. Verificar también respuesta HTTP y `checked_at` reciente. Si `delivery_state='uncertain'`, revisar el envío específico manualmente antes de restablecer una reserva; nunca reejecutar el flujo comercial.
