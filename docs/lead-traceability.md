# Trazabilidad de leads: implementación y despliegue

Actualizado: 13 de octubre de 2026. Goal E2E autorizado y **todavía en curso**.

## Estado comprobado

- Proyecto Supabase: `rmxzryueysmzksmvpwpv` (landing-ruka).
- Base Git del contrato: `a054453`. [PR #86](https://github.com/Suplait/ruka-smart-insight/pull/86) integrado en `main`, commit `77d7379`; cierre pendiente en `codex/lead-traceability-closeout`.
- Aplicadas en producción: `20261013180000_add_lead_traceability.sql`, `20261013181000_add_calendly_evidence.sql`, `20261013190000_add_clickup_delivery.sql` `20261013200000_add_calendar_reconciliation.sql`, `20261013210000_add_slack_recovery.sql` y `20261013220000_simplify_slack_visibility.sql`.
- Desplegados: `lead-intake`, `lead-enrichment-worker`, `lead-calendly-webhook` y `lead-calendly-reconcile`. Intake y enriquecimiento Slack habilitados; frontend público publicado y verificado. Recepción firmada y lectura Calendly habilitadas para la cuenta clásica; Calendly de Lorenzo/One queda fuera de esta entrega por petición del usuario. El consumidor de lectura de Mauro está publicado con horario cada quince minutos.
- Las tablas nuevas tienen RLS y no conceden SELECT a `anon`. Los RPC de escritura sólo permiten `service_role`.
- El frontend nuevo está publicado en `www.ruka.ai`: Vercel Production `7049491048`, commit `77d7379`, estado `success`. La prueba pública One confirmó persistencia con continuación privada y Slack con cinco UTMs. `VITE_LEAD_TRACEABILITY=false` queda disponible sólo para pruebas de compatibilidad y rollback anterior al cierre de accesos antiguos.
- Los endpoints antiguos y permisos antiguos de `leads` siguen vigentes para conservar el flujo actual. **La exposición anónima anterior no se considera corregida todavía.**
- El usuario autorizó después una prueba en los destinos reales, sin listas/canales temporales. Se creó un lead ficticio sin teléfono desde el formulario local conectado a Supabase productivo; el hook comercial lo procesó normalmente. No se ejecutó manualmente ni se reintentó ese workflow comercial. No se reservaron reuniones ni se publicaron cambios de GTM, GA4, Meta o Ads.
- Creado el campo opcional de texto largo **Trazabilidad del lead** en CRM empresas: `e40a83ca-2acc-4103-ac62-cbf5ab7563e0`. Escritura validada en la tarea de prueba `17tgxqycuuc`.
- Publicado [Trazabilidad leads · Slack y ClickUp](https://ruka.app.n8n.cloud/workflow/lCtphAXKkdzgMa5h), con trece nodos y horario cada minuto. Actualiza el campo dedicado y el mensaje Slack confirmado. Prueba real y posterior ejecución sin trabajos pendientes correctas. Sin webhook público, MCP ni retención de ejecuciones; timeout de dos minutos.
- Publicado [Trazabilidad leads · Reconciliación Calendly](https://ruka.app.n8n.cloud/workflow/30VjXmWyrIhz8hXh), con cuatro nodos para Mauro: entrada manual, horario cada quince minutos, llamada de lectura y resultado. La lectura previa guardó dos reuniones reales. Lorenzo se retiró por petición del usuario. Settings: orden v1, sin guardar ejecuciones, timeout de dos minutos y MCP apagado. La primera ejecución por horario avanzó de cuatro a ocho páginas a las 20:15 UTC, sin errores.
- En GTM, [workspace 24 Ruka One · conexión GA4](https://tagmanager.google.com/?authuser=2#/container/accounts/6231394894/containers/206691913/workspaces/24) contiene una conexión nueva de los siete eventos One a GA4, sin publicar. La importación verificada añadió etiqueta 60 y activador 59, con cero modificaciones/bajas de configuración existente. Preview en Chrome validó un disparo para `one_page_view` y otro para `one_contact_view`, sin disparo en History Change ni submit de formulario. Faltan los pasos posteriores y recepción antes de publicarla.

## Contrato de compatibilidad

Las llamadas de tracking conservan nombres, argumentos y orden. Las pruebas de React verifican la secuencia de los formularios clásico y One con el transporte antiguo y el nuevo. El flujo clásico mantiene la carrera de Slack con un timeout de diez segundos; `lead_created` y `registration_success` siguen después de persistir. One mantiene sus eventos y avance inmediato aunque la petición remota esté pendiente. Su éxito anticipado sigue siendo una limitación heredada, no una confirmación de la base.

La captura de adquisición y el receptor de mensajes de Calendly funcionan separados del dataLayer. No se añadieron conversiones ni envíos Measurement Protocol/CAPI. El receptor nuevo de Calendly comprueba origen exacto, ventana del iframe y estructura; no modifica los listeners antiguos.

## Piezas implementadas

- `leadAttribution`: cinco UTMs, primera entrada, entrada de sesión, último contacto no directo, referrer externo, URLs sin query/hash y hasta veinte páginas observadas. Caducidad local de noventa días y sesión de treinta minutos. Storage bloqueado usa memoria. Los IDs propios nunca se presentan como IDs de Google.
- `leadIntake`: continuación aleatoria de 256 bits, almacenada en sesión/memoria y estado de navegación, nunca en URLs ni eventos. El servidor conserva SHA-256, con caducidad de siete días. Reintentos usan el mismo submission. No hay fallback automático a escrituras públicas cuando falla la ruta segura.
- Persistencia: un INSERT deja evidencia y dos entregas pendientes dentro de su transacción. El submit idempotente no vuelve a insertar ni dispara de nuevo el hook n8n. La calificación se guarda junto con su evidencia y deriva `requires_calendly` del umbral existente de 150.
- Slack inicial: contacto y marcadores existentes, cinco UTMs disponibles, origen/recorrido parcial y estado de persistencia. La reserva exclusiva evita dos mensajes ante peticiones simultáneas. Un timeout de resultado incierto queda registrado como entrega no confirmada; no se consulta el historial ni se reenvía a ciegas. La reserva inicial deja un trabajo pendiente incluso si la pestaña desaparece antes de persistir.
- Worker Slack: `chat.update` sobre el canal/ts guardado, preservando bloques de contacto y quitando menciones repetidas. Outbox con lease, revisión, reintentos acotados, backoff y respeto de Retry-After. Una referencia ausente queda pendiente con causa explícita. Sólo usa referencias y snapshots confirmados; no requiere permisos de lectura del canal. Ahora reserva únicamente entregas Slack; el consumidor independiente de ClickUp usa su propio RPC de reserva.
- Consumidor ClickUp preparado: lee la tarea existente, valida ID/lista/campo/lease, modifica sólo el campo dedicado y confirma la revisión. Un valor idéntico es un no-op; los errores HTTP y 429 conservan la entrega para reintento. Agrupa hasta diez envíos recientes asociados a la misma tarea y serializa sus reservas para impedir que dos envíos sobrescriban su evidencia entre sí. El vínculo es privado, idempotente y rechaza reasignaciones silenciosas. El vínculo al resultado del workflow comercial ya está publicado. QA real autorizada completada y consumidor programado cada minuto.
- Calendly: receptor con HMAC-SHA256 del cuerpo original, ventana de firma de tres minutos y confirmación HTTP sólo después del commit. Conserva invitees separados, cancelaciones y enlaces de reprogramación. Un evento creado atrasado no reactiva un invitee cancelado. Los receipts privados conservan evidencia aun sin lead asociado.
- Asociación: email normalizado sólo cuando hay un candidato inequívoco dentro de noventa días. Varios candidatos quedan ambiguos. Al completar un ciclo de reconciliación se intenta asociar hasta cien reuniones pendientes; el lector de Mauro ya está programado y publicado.
- Recuperación Calendly: cursor independiente por usuario, consulta explícita de eventos e invitados activos/cancelados desde noventa días atrás, cuatro páginas por invocación, reserva de 120 segundos y commit atómico de evidencia/cursor. Sólo sigue tokens de paginación sobre el host fijo de Calendly. Conserva cancelaciones/reprogramaciones y almacena hashes, sin contacto ni respuestas del invitado. Respeta 429, limita reintentos y deja errores en salud por calendario. Cada ciclo completo espera 24 horas; el horario de quince minutos avanza páginas pendientes. Clásico y One usan configuración explícita de credencial y URI de usuario, comprobada contra `/users/me`; nunca se sustituye silenciosamente una cuenta por otra.

El estado de persistencia fallida, su evidencia y el trabajo de enriquecimiento se guardan en una sola transacción. Repetir el callback no añade otra entrega y un callback atrasado no cambia un lead ya persistido.

## Estado de los requisitos y pendientes

Retención del detalle de atribución implementada en migraciones `20261014010000`/`20261014011000`: identificadores y recorrido a 90 días, hashes de continuación vencidos, trabajo privado por hora en Supabase. [Política, límites y pruebas](lead-attribution-retention.md). La retención integral de contactos/snapshots y de las herramientas externas queda fuera de esta limpieza técnica; no se afirma que todos los datos personales expiren a 90 días.

Cobertura complementaria ante caída de n8n implementada: comprobador firmado desde Supabase cada cinco minutos, aviso a los 30 minutos sin heartbeat del worker y recuperación con deduplicación persistida. Entrega real única y rechazo de firma alterada/expirada verificados. [Runbook, permisos administrados de pg_net y límites](lead-traceability-alerts.md#comprobador-externo-a-n8n). No se afirma disponibilidad de todos los workflows ni cobertura ante caída simultánea de ambos proveedores.

1. Exportaciones de GTM web v21 y Server v1 completadas; [inventario y hashes](lead-traceability/tracking-inventory.md) guardados. Server tiene cero etiquetas; Meta y Ads tienen conectadas las rutas clásicas detalladas en el inventario. GA4 no tiene modificaciones, tiene una sola regla derivada ajena a One y no muestra `one_*` en su listado de eventos recientes. Conexión One publicada en v22, cinco eventos recibidos una vez en DebugView y exploración compartida con ambos eventos Calendly. Siguen pendientes diagnósticos de Meta y QA de reserva/éxito. Zona horaria de la propiedad leída: Chile Time (GMT-03:00).
2. Conectar el consentimiento real y la lectura de IDs mediante la API de Google. Actualmente el consentimiento es `unknown` y los IDs GA son nulos; no se infieren permisos de cookies ni se inventan identificadores.
3. Verificar un portador admitido por Calendly para `booking_token` con un payload real. `a1` ya contiene la empresa y las UTMs conservan su significado. No se utiliza `salesforce_uuid` como portador sin verificar su contrato en el embed.
4. Calendario clásico de Mauro conectado por suscripción firmada; lectura real y guardado de dos reuniones verificados. Lectura programada cada quince minutos; primera ejecución automática comprobada; falta una entrega firmada originada realmente en Calendly. Calendly de Lorenzo/One se omite por petición del usuario. El trigger comercial permanece sin cambios. El receptor independiente guarda la evidencia antes de confirmar.
5. `trace_link_clickup` conectado a los resultados de creación/búsqueda del workflow comercial, con fixtures para entradas Supabase y Calendly y comparación completa del workflow original. El consumidor de trece nodos ya entregó datos a Slack/ClickUp y está publicado cada minuto. El monitor de incidencias está publicado; falta cobertura ante caída completa de n8n. No modificar estados comerciales ni disparar llamadas/WhatsApp con enriquecimientos.
6. Aviso inicial y actualización por referencia confirmada verificados con el lead ficticio 1883. Por la corrección de alcance del usuario, no leer historial, ampliar scopes del bot ni reconstruir mensajes antiguos. Las entregas inciertas quedan pendientes y deben aparecer en las alertas técnicas ya previstas.
7. Prueba real autorizada completada en Chrome para clásico y ambas ramas de volumen; escritura Slack/ClickUp y reintentos vacíos confirmados. One probado desde local y después desde el sitio público: persistencia, Slack y avance al calendario. Faltan móvil/Safari; storage, tiempos y fallos tienen pruebas locales.
8. Frontend publicado. Falta la decisión del usuario entre cerrar los accesos antiguos ahora o conservar 24 horas de compatibilidad. Entonces revocar SELECT/INSERT públicos y retirar el update genérico. Un cambio de permisos sin resolver los clientes cacheados rompería su onboarding. La migración `20261013230000` ya retiró permisos directos de UPDATE/DELETE/TRUNCATE/REFERENCES/TRIGGER que ningún formulario utiliza; no cerró todavía la lectura pública.
9. Definir/activar retención del detalle del servidor y completar alertas/monitor externo del heartbeat. Están activos el lector de Mauro y el enriquecimiento Slack/ClickUp. Migración `20261014000000` aplicada: RPC privado de salud verificado con ocho señales en cero. Monitor de seis nodos `ATYzHphnfkJMZX3J` publicado, entrega real confirmada y acceso MCP adicional retirado. La ejecución programada/cooldown entre ejecuciones sigue sin evidencia retenida. Cinco pruebas del monitor y pruebas PostgreSQL correctas. [Runbook y límites de cobertura](./lead-traceability-alerts.md).

## n8n: evidencia inspeccionada

- MCP OAuth registrado como `n8n-ruka`; acceso expuesto únicamente a **Creación de leads**, aprobado por el usuario. Ejecución/test bloqueados en la configuración del cliente. El MCP responde al handshake; sus herramientas no estaban inyectadas en este chat, por lo que se continuó por UI.
- **Creación de leads** (`dL1cNJOzP7I7EquJ`): 73 nodos originales respaldados de forma privada y conservados íntegros. Publicados tres nodos adicionales para el vínculo privado ClickUp (76 en total). Entrada Supabase por INSERT y entrada Calendly `invitee.created`. Mantiene las acciones comerciales actuales.
- ClickUp: workspace `9013023083`, lista `901301203866`. Campos existentes para email, Supabase ID, Slack ts y tres UTMs verificadas en el catálogo actual (`utm_source`, `utm_medium`, `utm_campaing`). El workflow antiguo referencia un cuarto campo UTM que no apareció en ese catálogo; no se modificó. El enriquecimiento por IA puede reemplazar la descripción: se creó un campo separado.
- **Automatizacion WSP CRM**: lienzo rotulado PAUSED, sin disparador conectado visible. No se activó.
- **👁️ Visión reuniones rukito por slack**: temporizadores y lectura de tasks; no aparece un Slack Trigger en el lienzo inspeccionado.
- **📞 Motor de llamadas por teléfono**: 167 nodos respaldados privadamente. Temporizadores de 30/15 minutos, callbacks Dapta y un webhook con forma de automatización ClickUp. La regla activa **Cuando se crea -> espere -> lo llame si no agendó reu** dispara **Task created → n8n llamar si form pero no agendó**.
- Se revisaron las 41 reglas activas de CRM empresas. Hay reglas **Comment added → Call webhook**, por lo que este consumidor no añade comentarios. Las reglas observadas de cambios de campos apuntan a `⛔ subdomain bloqued`, `panel_status` y `Calificada?`; no al campo nuevo. Esto no reemplaza la prueba aislada ni verifica integraciones externas fuera del inventario visible de ClickUp.
- Credenciales existentes verificadas por UI: Supabase apunta al proyecto correcto y su uso por HTTP quedó confirmado con cola vacía; Calendly Mauro aparece conectado. No se crearon ni extrajeron claves nuevas. Los parámetros, credenciales referenciadas y conexiones de los diez nodos importados coinciden con el JSON del repositorio. La importación no aplicó los settings de retención/timeout: se ajustaron por UI a no guardar ejecuciones correctas/fallidas/manuales y timeout de un minuto.
- Las copias privadas incluyen datos fijados y configuración sensible. No se incluyen en Git, reportes públicos ni ejemplos.

## Simplificación de Slack

Se retiró el prototipo de recuperación por `conversations.history` tras la observación del usuario sobre complejidad. El worker no contiene lecturas de historial, búsquedas ni un modo de diagnóstico. Sólo puede actualizar el mensaje cuya referencia ya se confirmó. Se conserva el registro de errores, la confirmación de leases y los límites de duración.

La migración 210000 llegó a aplicarse con los adaptadores apagados; la 220000 elimina su tabla vacía y RPC de recuperación, preservando el historial de migraciones y la escritura atómica de fallos. La limpieza aborta si encuentra evidencia almacenada. No se solicitaron ni cambiaron permisos de Slack. El diagnóstico manual aislado `N7dAiNUjJ9EMzwLG` devolvió `missing_scope`; quedó sin publicar, sin horario y sin retención de ejecuciones. No se usa como dependencia del flujo.

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
node --test scripts/lead-traceability/clickup-projection.test.mjs scripts/lead-traceability/clickup-link.test.mjs
npm run build
npm run lint
```

La prueba SQL necesita PostgreSQL (`initdb`, `pg_ctl`, `psql`) en PATH. Crea y elimina un cluster temporal con socket privado y sin TCP; su hook n8n es una tabla local de conteo. Nunca usa las variables PG del entorno. Las pruebas Edge usan Deno fijado a 2.9.6 y un transporte falso, sin permiso de red para requests.

Resultado de esta etapa: 39 pruebas Vitest, 8 pruebas de handlers Edge, aserciones SQL en PostgreSQL local y build de 21 rutas correctos. Cobertura de las utilidades nuevas: 96,39% de líneas. La comprobación estática encontró 31 llamadas de tracking compatibles con `a054453`. El lint completo conserva 11 errores preexistentes y cinco warnings; los archivos nuevos revisados pasan lint. TypeScript conserva dos errores previos en VolumeSelector y el fallback de UUID de OneContact.

Etapa ClickUp: seis pruebas del proyector y del código realmente embebido en el JSON, nuevas aserciones SQL de asociaciones/consumidores/leases/permisos y ocho pruebas Edge correctas. Build y contrato de tracking siguen correctos. Regenerados los tipos desde Supabase. La validación real de n8n sólo cubrió acceso a Supabase y cola vacía; no se presenta como prueba E2E de escritura ClickUp.

Etapa reconciliación Calendly: catorce pruebas Edge correctas (ocho previas y seis nuevas), aserciones SQL de atomicidad, exclusión, reintentos y permisos correctas. Build de 21 rutas, lint de archivos nuevos y contrato de 31 llamadas correctos. Tipos regenerados desde la migración aplicada. La prueba remota verificó exclusivamente conexión y desactivación para ambas cuentas; no confirma todavía acceso a sus APIs ni suscripciones.

Etapa simplificación Slack: 17 pruebas Edge correctas, aserciones SQL de idempotencia, fallo transaccional y permisos; build de 21 rutas y contrato de 31 llamadas correctos. No se presentan las pruebas locales como validación E2E de mensajes productivos.

## Calendly clásico conectado

El token facilitado por el usuario se verificó contra `/users/me`: usuario `e1fc0690-f20a-4400-9940-284d3c8a2e24`, perfil Ruka, `https://calendly.com/ruka-ai`, zona `America/Santiago`. Coincide con los dos calendarios clásicos del código. Token y URI se guardaron como secretos de Supabase; el token no está en Git. Se verificó acceso a reuniones y suscripciones mediante la API oficial.

Suscripción independiente `61eb5709-d781-4fa5-8da8-e81c7cf0502c`, scope `user`, estado `active`, eventos `invitee.created` e `invitee.canceled`, destino `lead-calendly-webhook`. Se compararon las dos suscripciones anteriores (n8n y Snov) antes/después: sin cambios. Se usa una clave de firma propia guardada sólo como secreto.

Prueba remota sin escritura: firma inválida devuelve 401; firma válida con evento no admitido devuelve 200/ignored. Esto verifica configuración criptográfica del receptor, no una entrega originada en Calendly. La ejecución manual del consumidor realizó cuatro páginas y guardó dos receipts/reuniones reales; cero submissions y cero trabajos de entrega. El cursor queda preparado para continuar. One respondió enabled=false y luego el usuario pidió omitir ese calendario por ahora. No se crearon reservas, leads ni contactos de prueba ni se ejecutó el workflow comercial.

21 pruebas Edge correctas, incluidas cuatro nuevas del receptor (firma, proyección mínima, fallo de commit y comprobación sin escritura). Lint de los archivos cambiados correcto. El cliente API usa un User-Agent explícito: la lectura inicial con el agente por defecto de urllib devolvió 403; con identificación de la aplicación funcionó.

## Vínculo ClickUp publicado

Versión n8n `68052816-124d-4f94-9d6c-6e29ce71b435`, «Vinculo privado lead–ClickUp», publicada el 13 de octubre. Se comparó el export completo contra el baseline `68dd9d24-0903-46bb-ba76-4666921dbbb6`: los 73 nodos originales (incluidos parámetros, credenciales, posiciones y webhook IDs), settings, pinData y tags son idénticos. Al retirar las cuatro conexiones nuevas, el grafo coincide exactamente con el original. La rama nueva queda debajo de las ramas anteriores para respetar su orden de ejecución v1.

El proyector acepta sólo INSERT de `public.leads` con submission UUID válido y un único resultado ClickUp de la lista esperada. Los leads antiguos y la entrada directa de Calendly se omiten. Los nodos existentes no reciben parámetros nuevos. El RPC guarda únicamente la asociación privada, con reintentos idempotentes; no modifica `leads` ni repite su hook comercial. Las tres pruebas del proyector/código realmente embebido pasan. No se ejecutó el workflow comercial como QA y la prueba real posterior confirmó la asociación del lead 1883 con la tarea `17tgxqycuuc`.

El lector de Mauro también está publicado («Lectura periódica de Calendly Mauro», versión `bb42cb47-8382-423a-a6aa-38fa07320359`). Su export coincide con los cuatro nodos, conexiones y settings del generador. La primera ejecución automática avanzó cuatro páginas a las 20:15 UTC (ocho acumuladas). Todavía no se ha observado un webhook originado realmente en Calendly.

## Prueba real autorizada del 13 de octubre

El usuario descartó destinos temporales y pidió probar como un lead real. Desde Chrome se usó el frontend local con `VITE_LEAD_TRACEABILITY=true` conectado al Supabase real. Datos: **PRUEBA TRAZABILIDAD — SIN CONTACTAR**, correo ficticio `trazabilidad-20261013@example.invalid`, sin teléfono y cinco UTMs identificadas como QA. No se crearon listas, canales ni reservas de Calendly.

- Un submission `bcbc6838-b145-4efa-94fa-1559d4b43548`, lead `1883` y tarea [PRUEBA TRAZABILIDAD — SIN CONTACTAR](https://app.clickup.com/t/17tgxqycuuc).
- Mensaje inicial confirmado en canal `C08DUJ6V2G6`, ts `1791922057.271889`, bot Leads-landing. El worker actualizó esa misma raíz con UTMs, entrada/conversión, recorrido parcial, volumen y vínculo ClickUp. Se inspeccionó únicamente ese hilo por su referencia confirmada; no se leyó historial del canal ni se agregó lectura al worker.
- El hook comercial ejecutó normalmente `221568`, estado **Succeeded**, 22,959 segundos. Los campos antiguos `supabase_id` y `slack_ts` se conservaron. El vínculo privado se recibió automáticamente.
- El mismo lead avanzó a `calendario-general-150` con 75 facturas y a `calendario-general-1` con 225. Se verificó la selección visual antes de continuar; los inputs radio ocultos no reaccionaban al clic directo del controlador, pero la tarjeta visible sí. No se reservó ninguna hora.
- El campo dedicado de ClickUp recibió las cinco UTMs, páginas y 225 facturas. Outbox confirmado: ClickUp revisión 5/5, Slack 6/6, sin errores. La ejecución posterior devolvió `delivered:0, waiting:0, failed:0`; no repitió las entregas.
- Durante QA se corrigieron tres defectos propios antes del rollout público: preservar WhatsApp vacío como cadena para el `.replace()` del webhook existente, formatear páginas sin depender de `URL` en el sandbox de n8n y completar `last_started_at` en el upsert de salud (NOT NULL se valida antes del conflicto). La primera entrega Slack funcionó pero la escritura de salud devolvió 503; después de corregirla, el consumidor terminó correctamente sin reenviar.
- Validación local: 40 tests Vitest, 21 Edge, seis del proyector ClickUp, tres del vínculo, lint de archivos cambiados y contrato de 31 llamadas de tracking correctos. No se modificaron los eventos.

Export del consumidor de doce nodos comparado íntegramente con fuente (`383db25f-b4eb-4f5b-83ad-f00f6549bfb0`); después se añadió y verificó un Schedule Trigger de un minuto con dos conexiones. Publicado con nombre de versión **Slack y ClickUp · entrega automática validada** (prefijo `c7c89060`). Retención desactivada y timeout de dos minutos. Primer heartbeat automático verificado a las 20:25:20 UTC: `delivered:0, waiting:0, failed:0`.

El frontend público todavía usa la versión anterior, así que esto valida la ruta preparada con servicios reales, no un rollout público completado. Los nuevos builds de esta rama activan el transporte seguro por defecto: 14 pruebas de transporte/guardrail pasan y el build genera las 21 rutas. Los datos de prueba se conservaron para revisión del usuario; no se borraron.

## Interruptores y rollback

| Interruptor | Estado por defecto | Uso |
| --- | --- | --- |
| `VITE_LEAD_TRACEABILITY` | activo por defecto y publicado | Transporte nuevo del frontend |
| `LEAD_INTAKE_ENABLED` | activo en producción | Habilitar el intake después de validar dependencias |
| `LEAD_SLACK_ENRICHMENT_ENABLED` | activo en producción | Permitir al worker editar mensajes existentes |
| `LEAD_TRACEABILITY_WORKER_TOKEN` | sin configurar | Alternativa a la credencial service role existente de n8n para autenticar el worker |
| `LEAD_CALENDLY_ENABLED` | activo en producción | Recepción firmada del calendario clásico |
| `LEAD_CALENDLY_SIGNING_KEY` | configurado como secreto | Validar firmas de la suscripción independiente |
| `LEAD_CALENDLY_RECONCILE_ENABLED` | activo; lector cada quince minutos | Permitir lecturas de Calendly por el consumidor autorizado |
| `CALENDLY_ACCESS_TOKEN` / `LEAD_CALENDLY_USER_URI` | configurados como secretos | Token y usuario del calendario clásico |
| `CALENDLY_ONE_ACCESS_TOKEN` / `LEAD_CALENDLY_ONE_USER_URI` | fuera de esta entrega | Calendly de Lorenzo omitido por petición del usuario |

Antes del cierre de permisos, se puede volver a publicar el frontend con la flag apagada y desactivar los adaptadores. Después del cierre, el rollback debe mantener la ruta de continuación segura; no reabrir lecturas públicas como solución automática.

Las migraciones son aditivas: el rollback no elimina evidencia. Ante una regresión del nuevo trigger de persistencia, revisar primero el error concreto y volver a la versión validada; no desactivar triggers comerciales ni reejecutar workflows para compensar. Las entregas inciertas se reconcilian por sus referencias, no creando otro mensaje/task.

Fuentes de contratos: [firmas Calendly](https://developer.calendly.com/api-docs/overview/webhooks/webhook-signatures), [suscripciones](https://developer.calendly.com/api-docs/calendly-api/webhooks/create-webhook-subscription), [opciones de embed](https://developer.calendly.com/api-docs/overview/embedding/recipes).

## Publicación y prueba One — 13 de octubre, 20:38 UTC

- PR #86 integrado mediante el conector GitHub `camilosilvac23`; el CLI tenía otra cuenta con sólo lectura. Vercel Production confirmó el SHA `77d737923fb28c4c7cc819060eabeb92f729179a`. El preview Vercel de rama se omite por configuración; su check verde no prueba un build. Netlify generó su preview, pero no tiene los rewrites Vercel y no se usó para validar rutas profundas.
- Verificación pública: HTTP 200, canonical y contenido prerenderizado en seis rutas (`/`, `/register`, `/one`, `/one/contacto`, `/restaurantes`, `/productos/registro-de-compras`).
- One local: lead 12, submission `13b3f88e-f020-425a-b419-4222d864ec43`, Slack `1791923663.613079`. El consumidor automático confirmó revisión Slack 3/3. No existe vínculo CRM para este flujo; su entrega ClickUp permanece sin reservar, a la espera de una referencia real. No se creó una tarea One artificial.
- One público: lead 13, submission `c9982d7a-f0b1-473f-8fcd-728ff116470a`, Slack `1791923871.267209`, campaña `rollout_20261013`. Ruta observada `/register → /one/contacto`, las cinco UTMs y token privado confirmados en Supabase. Lectura del hilo exacto confirmó el contenido en Slack. Se usaron correo `.invalid` y teléfono de ceros, sin reserva de Calendly.
- Pruebas al cierre de esta etapa: 41 Vitest, 31 llamadas existentes en el contrato de tracking y 24 Edge (incluye tres casos de caducidad de la ruta antigua).
- Preparado, **sin desplegar/configurar todavía**: `LEAD_LEGACY_ACCESS_ENDS_AT` permite fijar una fecha UTC de cierre en los tres endpoints antiguos. Antes de esa fecha conserva el comportamiento; desde la fecha responde 410 antes de leer contacto o usar la cuenta de servicio. Una configuración malformada responde 503. La revocación final de SELECT/INSERT sigue pendiente de la decisión de compatibilidad; las rutas nuevas continúan operando.

## Publicaciones verificadas — 13 de octubre de 2026

- PR87 integrado en `main`, commit `69870ec1fa9140d6a86b2cedeb24f6a642ff22c1`; Vercel Production `7050148420` confirmó éxito. `utm_term` sólo se completa desde un contacto cuyos otros cuatro UTMs coinciden; no mezcla campañas. 43 pruebas frontend y build de 21 rutas correctos.
- Monitor publicado y entrega real verificada; consultar el [runbook actualizado](./lead-traceability-alerts.md). El cierre de accesos antiguos sigue sin activar.
- GTM `GTM-NTNN9QBG` versión 22 publicada por `camilo@ruka.ai`: etiqueta 60 y trigger 59 añadidos, sin modificaciones ni eliminaciones. Cinco eventos One reales dispararon una vez la etiqueta nueva y aparecen una vez cada uno en DebugView: `one_page_view`, `one_contact_view`, `one_form_submit_attempt`, `one_lead_created`, `one_calendly_view`. Reserva/éxito aún sin prueba real; Lorenzo sigue excluido.
- Lead One de QA 14, submission `627ff3f4-82c6-44d0-8897-be697c6ae170`, persistido con Slack `C08DUJ6V2G6/1791926513.814919`. Contacto ficticio, sin reserva. Las etiquetas heredadas GA4/Meta `form_submit` ejecutaron tres veces durante esa interacción; se conservaron y no son ejecuciones de la etiqueta nueva.
- [Exploración compartida de captación](https://analytics.google.com/analytics/web/?authuser=2#/analysis/a346401680p478868017/edit/tKbORAGuQoGNutzhOZjkVg): sólo lectura para quienes ya tienen acceso a la propiedad. Dos pestañas, clásico y One; ventana móvil de 28 días completos, zona Chile, desglose por dispositivo.

La exploración cuenta usuarios GA4, no registros de Supabase. Clásico: (`registration_success` OR `lead_created`) → `onboarding_step_1_invoices` → `calendly_event_scheduled` OR `calendly_group_scheduled`. One: `one_contact_view` → `one_lead_created` → `one_calendly_scheduled`. Son embudos cerrados, con pasos indirectos; el denominador es quien alcanza el primer paso en esa ventana. One conserva su éxito anticipado heredado: su evento de lead no confirma la base. La agenda es señal del navegador, no confirmación del webhook.

One tiene cobertura adicional desde el 13 de octubre; la ventana de 28 días completos verificada terminaba el 12 y mostraba «No data available». No interpretarlo como cero leads ni como información retrospectiva reconstruida. La recepción reciente está confirmada en DebugView.
