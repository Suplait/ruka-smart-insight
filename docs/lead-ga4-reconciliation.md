# Conciliación diaria de GA4

Lectura de la propiedad `478868017`, stream `10287402959`, zona verificada `America/Santiago`. No cambia tracking, key events, anuncios ni consentimiento; no envía Measurement Protocol, CAPI o conversiones offline.

`lead-ga4-reconcile` obtiene un token de una hora con `analytics.readonly` usando la cuenta de servicio existente `ga-mcp-ruka`. Su JSON se guarda exclusivamente como secreto `LEAD_GA4_SERVICE_ACCOUNT` de Supabase; nunca en el repositorio ni en n8n. El endpoint requiere service_role o el token privado de workers y el flag `LEAD_GA4_RECONCILE_ENABLED=true`. No acepta elegir propiedades, fechas o URLs desde el request.

El workflow generado `integrations/n8n/lead-ga4-reconciliation.json` consulta diariamente a las 09:00 de Santiago con la credencial Supabase existente. Se importa desactivado: publicar sólo después de verificar un snapshot real. No guarda ejecuciones ni contiene contactos o la clave de Google.

## Lectura y comparación

- Ventana de 29 fechas hasta tres días antes de hoy. A las 09:00 el día más reciente lleva más de 48 horas completo, también alrededor del cambio de hora. Las cuatro fechas separadas por siete días forman la referencia estacional.
- Dos consultas: sesiones por fecha; conteos de los ocho nombres explícitos de eventos por fecha. Un informe paginado, muestreado, sujeto a umbrales, con pérdida por `(other)`, esquema cambiado o zona distinta es un error de lectura, nunca un cero.
- Se guardan por separado `registration_success`, `lead_created` y los eventos One/Calendly. No se suman para calcular leads únicos. Supabase aporta leads realmente insertados, consentimiento observado y reuniones conocidas, incluyendo cancelaciones actuales y reuniones sin asociación. La ausencia de una reunión no prueba que no exista en el proveedor.
- Estos datos son agregados. No prueban recepción individual, ni que todos los leads fueran elegibles para GA4. `unknown` sigue siendo desconocido. No se calculan “conversiones perdidas” restando eventos a leads.
- Una alerta exige menos del 30% del valor esperado. Para tráfico: referencia de al menos 100 sesiones/día. Para cada señal de formulario: además al menos 100 sesiones actuales, 10 eventos/día de referencia y 10 esperados ajustando por tráfico. Una caída de tráfico no se anuncia como fallo del formulario. Son umbrales iniciales conservadores, no un modelo causal.
- One requiere cuatro referencias semanales completas posteriores al 13 de octubre de 2026. Antes aparece `insufficient_history`; volúmenes pequeños aparecen `insufficient_volume`.

## Evidencia y alertas

`lead_ga4_reconciliations` guarda un snapshot por fecha madura (upsert idempotente), con los 29 días, conteos de Supabase y evaluación. RLS sin políticas públicas; sólo service_role puede leer/escribir. No contiene emails, nombres, URLs, IDs de personas ni parámetros publicitarios. No dispara los triggers comerciales de `leads`.

`lead_traceability_health` registra `ga4_reconciliation`. `trace_monitor_snapshot()` añade `ga4_source_unavailable` (error o más de 36 horas sin lectura) y `ga4_volume_drop`. El monitor existente necesita publicar la proyección regenerada para incluir ambos avisos; la migración por sí sola no activa esos mensajes. Un colector que todavía nunca se ha activado no genera una alerta de disponibilidad.

Responsable: Camilo / equipo Ruka de captación. Ante error de lectura, revisar acceso de Viewer a la propiedad, API, secreto y cuota; no ejecutar el workflow comercial ni reenviar eventos. Ante caída, consultar el snapshot y comparar ambas señales de formulario, tráfico y conteos reales; revisar campañas/cobertura antes de concluir que falla la captación. La entrega de avisos usa el mismo monitor y cooldown existentes.

Rollback: despublicar sólo este workflow y desactivar `LEAD_GA4_RECONCILE_ENABLED`. Mantener snapshots para auditoría y retirar la fila de salud de monitorización sólo mediante un cambio explícito, para no ocultar una caída inadvertidamente. No hay cambios en la captura que revertir.

Validación: tests Deno del parser/ventana/umbrales/autorización; SQL desechable con límites horarios, permisos, consentimiento desconocido y señales del monitor. La activación requiere además una lectura real persistida, verificación del workflow publicado y primera ejecución programada.
