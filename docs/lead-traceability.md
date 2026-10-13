# Trazabilidad de leads: implementación y despliegue

Actualizado: 13 de octubre de 2026. Goal E2E autorizado y **todavía en curso**.

## Estado comprobado

- Proyecto Supabase: `rmxzryueysmzksmvpwpv` (landing-ruka).
- Base Git del contrato: `a054453`. Rama de trabajo: `codex/lead-traceability`.
- Aplicadas en producción: `20261013180000_add_lead_traceability.sql`, `20261013181000_add_calendly_evidence.sql`, `20261013190000_add_clickup_delivery.sql` y `20261013200000_add_calendar_reconciliation.sql`.
- Desplegados: `lead-intake`, `lead-enrichment-worker`, `lead-calendly-webhook` y `lead-calendly-reconcile`. Están desactivados por defecto; no se configuraron sus secretos de activación.
- Las tablas nuevas tienen RLS y no conceden SELECT a `anon`. Los RPC de escritura sólo permiten `service_role`.
- El frontend nuevo está preparado en esta rama, sin publicar. `VITE_LEAD_TRACEABILITY` está apagado por defecto.
- Los endpoints antiguos y permisos antiguos de `leads` siguen vigentes para conservar el flujo actual. **La exposición anónima anterior no se considera corregida todavía.**
- No se ejecutó ningún workflow comercial como prueba, no se generaron leads/reuniones productivos de prueba ni se modificaron etiquetas de GTM, GA4, Meta o Ads.
- Creado el campo opcional de texto largo **Trazabilidad del lead** en CRM empresas: `e40a83ca-2acc-4103-ac62-cbf5ab7563e0`. No se escribieron valores en tareas.
- Guardado el consumidor independiente [Trazabilidad leads · ClickUp (preparación)](https://ruka.app.n8n.cloud/workflow/lCtphAXKkdzgMa5h), sin publicar, sin horario y sin webhook. Una prueba manual con cero asociaciones confirmó acceso a Supabase y salida con cero elementos antes de cualquier llamada ClickUp. La primera prueba detectó una referencia de credencial importada incorrectamente; se corrigió en ambos nodos Supabase y en el generador.
- Guardado [Trazabilidad leads · Reconciliación Calendly (preparación)](https://ruka.app.n8n.cloud/workflow/30VjXmWyrIhz8hXh), cinco nodos sin horario, publicación ni MCP. Ambas ramas devolvieron HTTP 200 y `enabled: false`: valida autenticación n8n–Supabase, sin leer Calendly ni generar evidencia. Parámetros, credenciales y conexiones coinciden con el JSON versionado; settings aplicados por UI: orden v1, sin guardar ejecuciones y timeout de cuatro minutos.
- En GTM, [workspace 24 Ruka One · conexión GA4](https://tagmanager.google.com/?authuser=2#/container/accounts/6231394894/containers/206691913/workspaces/24) contiene una conexión nueva de los siete eventos One a GA4, sin publicar. La importación verificada añadió etiqueta 60 y activador 59, con cero modificaciones/bajas de configuración existente. Preview en Chrome validó un disparo para `one_page_view` y otro para `one_contact_view`, sin disparo en History Change ni submit de formulario. Faltan los pasos posteriores y recepción antes de publicarla.

## Contrato de compatibilidad

Las llamadas de tracking conservan nombres, argumentos y orden. Las pruebas de React verifican la secuencia de los formularios clásico y One con el transporte antiguo y el nuevo. El flujo clásico mantiene la carrera de Slack con un timeout de diez segundos; `lead_created` y `registration_success` siguen después de persistir. One mantiene sus eventos y avance inmediato aunque la petición remota esté pendiente. Su éxito anticipado sigue siendo una limitación heredada, no una confirmación de la base.

La captura de adquisición y el receptor de mensajes de Calendly funcionan separados del dataLayer. No se añadieron conversiones ni envíos Measurement Protocol/CAPI. El receptor nuevo de Calendly comprueba origen exacto, ventana del iframe y estructura; no modifica los listeners antiguos.

## Piezas implementadas

- `leadAttribution`: cinco UTMs, primera entrada, entrada de sesión, último contacto no directo, referrer externo, URLs sin query/hash y hasta veinte páginas observadas. Caducidad local de noventa días y sesión de treinta minutos. Storage bloqueado usa memoria. Los IDs propios nunca se presentan como IDs de Google.
- `leadIntake`: continuación aleatoria de 256 bits, almacenada en sesión/memoria y estado de navegación, nunca en URLs ni eventos. El servidor conserva SHA-256, con caducidad de siete días. Reintentos usan el mismo submission. No hay fallback automático a escrituras públicas cuando falla la ruta segura.
- Persistencia: un INSERT deja evidencia y dos entregas pendientes dentro de su transacción. El submit idempotente no vuelve a insertar ni dispara de nuevo el hook n8n. La calificación se guarda junto con su evidencia y deriva `requires_calendly` del umbral existente de 150.
- Slack inicial: contacto y marcadores existentes, cinco UTMs disponibles, origen/recorrido parcial y estado de persistencia. La reserva exclusiva evita dos mensajes ante peticiones simultáneas. Un timeout de resultado incierto requiere reconciliación; no se reenvía a ciegas.
- Worker Slack: `chat.update` sobre el canal/ts guardado, preservando bloques de contacto y quitando menciones repetidas. Outbox con lease, revisión, reintentos acotados, backoff y respeto de Retry-After. Una referencia ausente queda pendiente. Ahora reserva únicamente entregas Slack; el consumidor independiente de ClickUp usa su propio RPC de reserva.
- Consumidor ClickUp preparado: lee la tarea existente, valida ID/lista/campo/lease, modifica sólo el campo dedicado y confirma la revisión. Un valor idéntico es un no-op; los errores HTTP y 429 conservan la entrega para reintento. Agrupa hasta diez envíos recientes asociados a la misma tarea y serializa sus reservas para impedir que dos envíos sobrescriban su evidencia entre sí. El vínculo es privado, idempotente y rechaza reasignaciones silenciosas. Falta conectar ese vínculo al resultado del workflow comercial y realizar QA de escritura aislada antes de programarlo.
- Calendly: receptor con HMAC-SHA256 del cuerpo original, ventana de firma de tres minutos y confirmación HTTP sólo después del commit. Conserva invitees separados, cancelaciones y enlaces de reprogramación. Un evento creado atrasado no reactiva un invitee cancelado. Los receipts privados conservan evidencia aun sin lead asociado.
- Asociación: email normalizado sólo cuando hay un candidato inequívoco dentro de noventa días. Varios candidatos quedan ambiguos. Al completar un ciclo de reconciliación se intenta asociar hasta cien reuniones pendientes; aún falta programar y activar el consumidor.
- Recuperación Calendly: cursor independiente por usuario, consulta explícita de eventos e invitados activos/cancelados desde noventa días atrás, cuatro páginas por invocación, reserva de 120 segundos y commit atómico de evidencia/cursor. Sólo sigue tokens de paginación sobre el host fijo de Calendly. Conserva cancelaciones/reprogramaciones y almacena hashes, sin contacto ni respuestas del invitado. Respeta 429, limita reintentos y deja errores en salud por calendario. Cada ciclo completo espera 24 horas; la programación todavía está pendiente. Clásico y One requieren credenciales y URI de usuario separados, comprobados contra `/users/me`.

## Límites que faltan resolver antes de activar

1. Exportaciones de GTM web v21 y Server v1 completadas; [inventario y hashes](lead-traceability/tracking-inventory.md) guardados. Server tiene cero etiquetas; Meta y Ads tienen conectadas las rutas clásicas detalladas en el inventario. GA4 no tiene modificaciones, tiene una sola regla derivada ajena a One y no muestra `one_*` en su listado de eventos recientes. Conexión One preparada en workspace 24; falta Preview/publicación/recepción, diagnósticos de Meta y presentación del embudo con ambos eventos Calendly. Zona horaria de la propiedad leída: Chile Time (GMT-03:00).
2. Conectar el consentimiento real y la lectura de IDs mediante la API de Google. Actualmente el consentimiento es `unknown` y los IDs GA son nulos; no se infieren permisos de cookies ni se inventan identificadores.
3. Verificar un portador admitido por Calendly para `booking_token` con un payload real. `a1` ya contiene la empresa y las UTMs conservan su significado. No se utiliza `salesforce_uuid` como portador sin verificar su contrato en el embed.
4. Crear las suscripciones firmadas de Calendly y configurar credenciales sin alterar la suscripción comercial existente. El calendario clásico usa Mauro y One usa Lorenzo. La recuperación periódica está implementada/desplegada apagada; falta autenticación, QA con lecturas reales y horario. El trigger nativo de n8n confirma al recibir, por lo que no sustituye el receptor independiente que persiste antes de confirmar. OAuth requiere verificar la clave de firma de la aplicación; un secreto OAuth no equivale a esa clave.
5. Conectar `trace_link_clickup` a los resultados de creación/búsqueda del workflow comercial, validando los contextos Supabase y Calendly. El consumidor de diez nodos y el campo dedicado ya están preparados. Falta QA de escritura en destino aislado, programación y salud/alertas del consumidor. No tocar estados comerciales, crear tasks, repetir llamadas ni WhatsApp.
6. Completar reconciliación de Slack incierto y soporte de referencias heredadas. Los mensajes del flujo antiguo carecen del snapshot nuevo; el worker los deja pendientes para no sobrescribirlos sin respaldo.
7. Activar y observar los adaptadores en destinos aislados; verificar Safari/Chrome, móvil, bloqueo de storage, doble submit, cortes de red, las dos ramas de facturas y One.
8. Publicar el frontend, resolver la continuación de pestañas antiguas y recién entonces revocar SELECT/INSERT públicos y retirar el update genérico. Un cambio de permisos sin resolver los clientes cacheados rompería su onboarding.
9. Definir/activar retención del detalle del servidor, alertas con cooldown y monitor externo del heartbeat. No hay cron ni alertas nuevos activos todavía.

## n8n: evidencia inspeccionada

- MCP OAuth registrado como `n8n-ruka`; acceso expuesto únicamente a **Creación de leads**, aprobado por el usuario. Ejecución/test bloqueados en la configuración del cliente. El MCP responde al handshake; sus herramientas no estaban inyectadas en este chat, por lo que se continuó por UI.
- **Creación de leads** (`dL1cNJOzP7I7EquJ`): 73 nodos respaldados de forma privada. Entrada Supabase por INSERT y entrada Calendly `invitee.created`. Mantiene las acciones comerciales actuales.
- ClickUp: workspace `9013023083`, lista `901301203866`. Campos existentes para email, Supabase ID, Slack ts y tres UTMs verificadas en el catálogo actual (`utm_source`, `utm_medium`, `utm_campaing`). El workflow antiguo referencia un cuarto campo UTM que no apareció en ese catálogo; no se modificó. El enriquecimiento por IA puede reemplazar la descripción: se creó un campo separado.
- **Automatizacion WSP CRM**: lienzo rotulado PAUSED, sin disparador conectado visible. No se activó.
- **👁️ Visión reuniones rukito por slack**: temporizadores y lectura de tasks; no aparece un Slack Trigger en el lienzo inspeccionado.
- **📞 Motor de llamadas por teléfono**: 167 nodos respaldados privadamente. Temporizadores de 30/15 minutos, callbacks Dapta y un webhook con forma de automatización ClickUp. La regla activa **Cuando se crea -> espere -> lo llame si no agendó reu** dispara **Task created → n8n llamar si form pero no agendó**.
- Se revisaron las 41 reglas activas de CRM empresas. Hay reglas **Comment added → Call webhook**, por lo que este consumidor no añade comentarios. Las reglas observadas de cambios de campos apuntan a `⛔ subdomain bloqued`, `panel_status` y `Calificada?`; no al campo nuevo. Esto no reemplaza la prueba aislada ni verifica integraciones externas fuera del inventario visible de ClickUp.
- Credenciales existentes verificadas por UI: Supabase apunta al proyecto correcto y su uso por HTTP quedó confirmado con cola vacía; Calendly Mauro aparece conectado. No se crearon ni extrajeron claves nuevas. Los parámetros, credenciales referenciadas y conexiones de los diez nodos importados coinciden con el JSON del repositorio. La importación no aplicó los settings de retención/timeout: se ajustaron por UI a no guardar ejecuciones correctas/fallidas/manuales y timeout de un minuto.
- Las copias privadas incluyen datos fijados y configuración sensible. No se incluyen en Git, reportes públicos ni ejemplos.

## Migraciones históricas

Se comparó `supabase_migrations.schema_migrations` con el repo. Se restauró el SQL ya aplicado de mayo/junio de 2025, se corrigió el nombre/versión del archivo UTM a `20250723033910` y se recuperó `20251022160217`. No se ejecutó `migration repair` ni se reescribió el historial remoto. El dry-run sólo propuso las dos migraciones nuevas.

Hay dos registros históricos para `ADD COLUMN page_path` (`20251022160217` y `20251022160219`). Se preservan como evidencia del historial existente. El repositorio tampoco contiene la creación original de `leads`; un replay completo desde una base vacía necesita recuperar ese baseline. Las pruebas locales usan una fixture explícita y no afirman recrear todo el esquema histórico.

## Validación reproducible

```sh
npm install
npm run test:tracking-contract
npm run test:coverage
npm run test:lead-db
npm run test:lead-edge
node --test scripts/lead-traceability/clickup-projection.test.mjs
npm run build
npm run lint
```

La prueba SQL necesita PostgreSQL (`initdb`, `pg_ctl`, `psql`) en PATH. Crea y elimina un cluster temporal con socket privado y sin TCP; su hook n8n es una tabla local de conteo. Nunca usa las variables PG del entorno. Las pruebas Edge usan Deno fijado a 2.9.6 y un transporte falso, sin permiso de red para requests.

Resultado de esta etapa: 39 pruebas Vitest, 8 pruebas de handlers Edge, aserciones SQL en PostgreSQL local y build de 21 rutas correctos. Cobertura de las utilidades nuevas: 96,39% de líneas. La comprobación estática encontró 31 llamadas de tracking compatibles con `a054453`. El lint completo conserva 11 errores preexistentes y cinco warnings; los archivos nuevos revisados pasan lint. TypeScript conserva dos errores previos en VolumeSelector y el fallback de UUID de OneContact.

Etapa ClickUp: seis pruebas del proyector y del código realmente embebido en el JSON, nuevas aserciones SQL de asociaciones/consumidores/leases/permisos y ocho pruebas Edge correctas. Build y contrato de tracking siguen correctos. Regenerados los tipos desde Supabase. La validación real de n8n sólo cubrió acceso a Supabase y cola vacía; no se presenta como prueba E2E de escritura ClickUp.

Etapa reconciliación Calendly: catorce pruebas Edge correctas (ocho previas y seis nuevas), aserciones SQL de atomicidad, exclusión, reintentos y permisos correctas. Build de 21 rutas, lint de archivos nuevos y contrato de 31 llamadas correctos. Tipos regenerados desde la migración aplicada. La prueba remota verificó exclusivamente conexión y desactivación para ambas cuentas; no confirma todavía acceso a sus APIs ni suscripciones.

## Interruptores y rollback

| Interruptor | Estado por defecto | Uso |
| --- | --- | --- |
| `VITE_LEAD_TRACEABILITY` | apagado | Transporte nuevo del frontend |
| `LEAD_INTAKE_ENABLED` | apagado | Habilitar el intake después de validar dependencias |
| `LEAD_SLACK_ENRICHMENT_ENABLED` | apagado | Permitir al worker editar mensajes existentes |
| `LEAD_TRACEABILITY_WORKER_TOKEN` | sin configurar | Autorización exclusiva del scheduler |
| `LEAD_CALENDLY_ENABLED` | apagado | Habilitar recepción firmada |
| `LEAD_CALENDLY_SIGNING_KEY` | sin configurar | Validar firmas de la suscripción independiente |
| `LEAD_CALENDLY_RECONCILE_ENABLED` | apagado | Permitir lecturas periódicas de Calendly |
| `CALENDLY_ACCESS_TOKEN` / `LEAD_CALENDLY_USER_URI` | sin configurar | Token y usuario del calendario clásico |
| `CALENDLY_ONE_ACCESS_TOKEN` / `LEAD_CALENDLY_ONE_USER_URI` | sin configurar | Token y usuario del calendario One |

Antes del cierre de permisos, se puede volver a publicar el frontend con la flag apagada y desactivar los adaptadores. Después del cierre, el rollback debe mantener la ruta de continuación segura; no reabrir lecturas públicas como solución automática.

Las migraciones son aditivas: el rollback no elimina evidencia. Ante una regresión del nuevo trigger de persistencia, revisar primero el error concreto y volver a la versión validada; no desactivar triggers comerciales ni reejecutar workflows para compensar. Las entregas inciertas se reconcilian por sus referencias, no creando otro mensaje/task.

Fuentes de contratos: [firmas Calendly](https://developer.calendly.com/api-docs/overview/webhooks/webhook-signatures), [suscripciones](https://developer.calendly.com/api-docs/calendly-api/webhooks/create-webhook-subscription), [opciones de embed](https://developer.calendly.com/api-docs/overview/embedding/recipes).
