# Retención de atribución

Política del detalle nuevo de trazabilidad, coherente con los 90 días de atribución del navegador:

- Tras 90 días desde el registro se eliminan `anonymous_id`, `session_id`, IDs de GA4, identificadores de clic de los tres contactos y `observed_pages` del registro privado del servidor.
- Se conservan las cinco UTM y resúmenes de origen para análisis de campañas. `detail_expired` y `attribution_detail_expired_at` distinguen expiración de fallos de captura. Los siguientes enriquecimientos de Slack muestran esa diferencia.
- Se eliminan hashes de continuación cuyo vencimiento ya pasó. La autorización sigue venciendo a los siete días aunque el mantenimiento todavía no haya ejecutado.
- No se eliminan leads, claves de idempotencia, reuniones, evidencias de entrega ni referencias de Slack/ClickUp. Por decisión del usuario, las copias de contacto y del mensaje inicial se conservan mientras exista el lead original, sin un límite adicional por antigüedad. Esta política **no constituye borrado integral de datos personales** ni cambia la retención de las herramientas externas.

`trace_expire_attribution_detail()` sólo admite `service_role`. Procesa como máximo 1.000 registros por categoría y omite filas bloqueadas para no interferir con captación/entregas. El trabajo `lead-attribution-retention` ejecuta en Supabase mediante `pg_cron`, al minuto 17 de cada hora, independiente de n8n. La expiración física puede demorarse hasta el siguiente ciclo; con más de 1.000 candidatos necesita ciclos adicionales.

Migraciones: `20261014010000` (función) y `20261014011000` (horario). Estado y recuentos sin contactos en `lead_traceability_health`, clave `attribution_retention`. Las filas históricas de ejecución de pg_cron siguen la retención de la instancia; esta migración no modifica trabajos ajenos.

Publicación verificada el 13 de octubre de 2026: ambas migraciones aplicadas; job activo con horario `17 * * * *` y la llamada exacta a esta función. Primera invocación real devolvió cero detalles y cero tokens expirados, consistente con la ausencia de registros antiguos. Worker Slack desplegado con la etiqueta de expiración. Primera ejecución automática observada a las 22:17:00 UTC del 13 de octubre de 2026, con estado succeeded.

Verificación: `npm run test:lead-db` comprueba límites temporales, eliminación de detalle, preservación de campañas/contacto/referencias, token vigente, idempotencia, permisos y ausencia de nuevas entregas. Seis pruebas de la proyección Slack pasan. El fixture local no instala pg_cron; la instalación y el horario requieren verificación en Supabase.

Reversión: desactivar únicamente el job por nombre. Los campos eliminados tras el vencimiento no se reconstruyen; las referencias y campañas permanecen disponibles.

## Copias vinculadas al lead original

La migración `20261014050000` añade `original_deleted_at` y un trigger privado en `lead_submissions`. Cuando la FK se vacía por la eliminación de `leads` o `leads_one`, en esa misma transacción se vacían `contact_snapshot`, `slack_initial_message`, `email_hash` y el token de continuación. Las escrituras tardías no pueden restaurar esos campos ni reutilizar la misma submission para otro lead.

Los registros pendientes de captura todavía no tienen lead original: se preservan para permitir que termine el formulario. No se deduce una eliminación por la mera ausencia de una FK. Antes del despliegue se verificó que no había submissions persistidas sin original; la migración también aborta si encuentra alguna, para revisarla sin borrar datos por inferencia.

El cambio no elimina originales, reuniones, campañas, referencias ni mensajes de Slack/ClickUp, y no encola entregas ni ejecuta llamadas externas. Tampoco cancela solicitudes externas que ya estén en vuelo ni es un mecanismo de borrado integral. La retención previa de detalle técnico a 90 días sigue vigente.

La prueba SQL local cubre ambos formularios, permanencia con originales antiguos, eliminación de copias, escrituras tardías, token inválido, reintentos normales y ausencia de nuevos disparos comerciales. No se borran leads productivos para verificarla.
