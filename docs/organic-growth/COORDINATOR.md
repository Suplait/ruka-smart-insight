# Coordinador recuperable de Organic Growth

Codex despierta cada hora. SQLite decide qué trabajo está debido en America/Santiago.
La recurrencia de Codex no define las fechas de negocio y no requiere coincidir al minuto.

## En cada despertar

1. Verifica el repositorio y usa Node 24 o superior. Actualiza origin/main y crea un worktree temporal limpio desde ese ref. Nunca cambies el checkout del usuario ni copies secretos. El estado y los horarios viven exclusivamente en SQLite. El lector comercial opcional ya existente puede consultar sus fuentes autorizadas en modo lectura; si falla, registra fuente no disponible y sigue, sin informar cero. No escribas en Supabase ni modifiques el funnel.
2. Ejecuta `node scripts/organic-growth/job-control.mjs dispatch`. El comando recupera leases vencidos, conserva obligaciones y devuelve dueKinds, fechas, backoff y retraso. Si no hay pendientes, elimina el worktree y termina inmediatamente: no instales dependencias, no consultes servicios, no publiques ni envíes Slack.
3. Para cada kind debido, en el orden devuelto, lee y ejecuta completamente `docs/organic-growth/jobs/<kind>.md`. Cada rutina obtiene su propio lease con claim. No uses force en una corrida normal. No vuelvas a ejecutar un kind que ya intentaste en este despertar.
4. Si un claim devuelve not_due, retry_backoff o active_lease, sigue con los otros kinds. La próxima revisión horaria recuperará los pendientes; no cambies su fecha. No esperes horas dentro del agente.
5. Si un kind falla, registra incidente, intenta avisarlo a C073N8S9TB4, registra la entrega y ejecuta fail para liberar su lease. Continúa con los otros kinds independientes. No cierres como éxito una entrega sin comprobante o una acción sin resultado persistido.
6. Repite dispatch al finalizar para detectar trabajos que vencieron durante la corrida. Procesa los kinds nuevos todavía no intentados. Conserva los que estén en backoff o requieran otro período para el siguiente despertar. No fabriques comprobaciones de días pasados: recupera salud/medición con observaciones actuales. El reporte conserva su fecha programada original y explica la fecha real de los datos.
7. Verifica integrity, backup y el estado de todos los leases que adquiriste. Elimina el worktree. La salida debe distinguir realizados, no debidos, fallidos, en backoff y pendientes con fecha. Si hubo error, dilo explícitamente y conserva el incidente; no presentes la corrida completa como saludable.

## Entrega de reportes

Después de generate-report, usa exclusivamente el payload persistido en report-delivery.json.
Si deliveryRequired=false, NO envíes otra vez: usa el permalink guardado y completa el lease.
Si deliveryRequired=true, busca en el canal C073N8S9TB4 el reportId exacto incluido en el mensaje.
Si ya existe, registra ese permalink sin reenviar. Si no existe y la búsqueda respondió correctamente,
envía el mensaje al canal y guarda el permalink devuelto con report-delivered antes de complete.
Si la búsqueda falla o el envío queda ambiguo por timeout, no reenvíes a ciegas: deja fallido/reintentable
y resuelve la presencia del reportId en el próximo intento. Slack no garantiza una transacción conjunta
con SQLite; esta reconciliación cubre el intervalo entre envío y guardado del comprobante.
No cambies el destino a un hilo sin un thread_ts verificado y una instrucción del usuario.

## Cadencia y límites

- monitoring: observación diaria desde las 08:30.
- measurement: lunes desde las 10:00.
- strategy: día 1 desde las 11:00.
- execution: una iniciativa útil cada tres días desde las 17:30; público o evidencia privada según BUYER_EVIDENCE.md.
- reporting: días 1 y 15 desde las 09:00, con recuperación de períodos pendientes y comprobante obligatorio.
- Las cinco rutinas viven aquí versionadas; solo este coordinador tiene horario activo en Codex.
- Modelo del scheduler: gpt-6-astra-camilo, proveedor azure, reasoning high. Si no está disponible, informar el error; nunca cambiar al modelo nativo ni editar configuración para ocultarlo.
- La máquina debe estar encendida y Codex abierto para ejecutar. Un período sin app no borra pendientes: se recuperan al siguiente despertar. La revisión horaria no puede garantizar trabajo mientras el equipo está apagado.
- Las acciones públicas siguen todos los guards, pruebas, PR, checks y verificación de producción de execution.md. No existen permisos nuevos para formularios, funnel, precios ni datos reales.

