# Inventario de conexiones existentes

Inspección del 13 de octubre de 2026 con `camilo@ruka.ai`. Configuración leída/exportada; no se publicaron cambios en GTM, GA4, Meta ni Ads.

## Fuentes y alcance

- GTM web `GTM-NTNN9QBG`, contenedor `206691913`, versión publicada **21**, “Google Ads scheduled event”, 4 de septiembre de 2026: 29 etiquetas, 15 activadores, siete variables y ninguna plantilla personalizada.
- GTM Server `GTM-WQZPBT68`, contenedor `208874413`, versión **1** publicada el 17 de marzo de 2025: **cero etiquetas**, cero activadores/variables/transformaciones y un cliente GA4 (`gaaw_client`). La cuenta tiene acceso de lectura. Este contenedor no tiene etiquetas que reenvíen eventos; no se verificó el estado de su infraestructura ni tráfico entrante.
- Exportaciones originales guardadas privadamente. `gtm-web-v21.json` y `gtm-server-v1.json` conservan el inventario y hashes SHA-256 de la configuración exacta, sin copiar JavaScript personalizado o secretos de plantillas.
- Fuente del navegador: `index.html` carga sólo el contenedor web anterior. `oneTracking.ts` únicamente envía eventos a dataLayer. La configuración no prueba recepción de cada hit; faltan las verificaciones de red y de destino durante QA.

## Mapeo de eventos

Todas las etiquetas GA4 listadas usan `G-M7YT4CY8MC`. El píxel inicializado es `1018711990106623`; los `fbq('track', ...)` existentes dependen de esa inicialización. Google Ads usa `AW-18420993007`.

| Disparador existente | GA4 (ID etiqueta) | Meta (ID etiqueta → evento) | Google Ads |
| --- | --- | --- | --- |
| Initialization | Google Tag (3) | — | Google Tag (50), Conversion Linker (51) |
| All Pages | — | Pixel base (9 → PageView) | — |
| `form_submit` (6) | `form_submit` (7) | 8 → Lead | — |
| `registration_success` (12) | `registration_success` (13) | 49 → registration_success | 52 → `U1POCNydluwcEO-X6M9E` |
| `lead_created` (31), URL `^https:\/\/www\.ruka\.ai\/(register\|restaurantes\|hoteles)` | `lead_created` (32) | — | — |
| `onboarding_step_1_months` (14) | mismo nombre (15) | — | — |
| `onboarding_step_2_billing` (16) | mismo nombre (17) | — | — |
| `onboarding_step_3_subdomain` (18) | mismo nombre (19) | — | — |
| `onboarding_step_4_sii` (20) | mismo nombre (21) | — | — |
| `onboarding_completed` (22) | mismo nombre (23) | 24 → CompleteRegistration | — |
| `whatsapp_onboarding` (26) | mismo nombre (28) | 27 → Contact | — |
| `webinar_registration_success` (29), Page Path contiene `webinar` | mismo nombre (30) | 33 → SubmitApplication | — |
| `calendly_event_scheduled` (35) | mismo nombre (40) | 36 → Schedule | 58 → `la29CMCXv-4cEO-X6M9E` |
| `calendly_group_scheduled` (37) | mismo nombre (39) | 38 → StartTrial | — |
| History Change (45), Page URL contiene `register` | `page_view_registro` (46) | — | — |
| `onboarding_step_1_invoices` (47) | mismo nombre (48) | — | — |

La etiqueta 25 carga Microsoft Clarity en All Pages. El activador 10 “Just Links - solicitar demo” no está referenciado por ninguna etiqueta de esta versión. El JSON conserva todos los filtros exactos, IDs, opciones de disparo y hashes; la tabla abrevia condiciones redundantes de `{{Event}}`.

## Parámetros y comportamiento que deben preservarse

- Etiqueta 13: `lead_id`, `company_name`. Etiquetas 19/21/23: además `facturas_compra_mes`, `sistema_facturacion`. Etiquetas 39/40/48: `lead_id`, `company_name`, `facturas_compra_mes`. Los valores proceden de variables dataLayer; el nuevo colector no modifica esos objetos.
- **Enhanced conversions ya existe**: etiqueta 54 “CHTML - listener user_data” observa email/teléfono del formulario clásico y añade `ruka_lead_submit` con `enhanced_conversion_data`. Etiquetas Ads 52 y 58 referencian `user_provided_data`. No se agregó esta función ni se alterará en este goal.
- El listener 54 observa tanto click como submit. Se debe conservar y comparar su comportamiento en QA; no se deduplica silenciosamente como parte del enriquecimiento.
- La etiqueta Meta 49 utiliza actualmente `fbq('track', 'registration_success')`. Se conserva tal cual; no se sustituye por `trackCustom` ni por otro nombre.
- No hay activadores ni etiquetas `one_*` en esta versión publicada, ni reenvío de esos eventos por GTM Server. El código One sólo hace push a dataLayer. Tras revisar la configuración de GA4 indicada abajo, se añadió una conexión exclusivamente como borrador en workspace 24; aún no se publicó ni se confirmó recepción.
- Tampoco hay activadores para los eventos dinámicos `form_submission_success/failure` o `registration_error` en esta versión. No son intercambiables con `form_submit` ni con un lead persistido.

## Consentimiento y cobertura

No se encontró CMP en el repositorio, etiquetas de consentimiento/CMP en la exportación, ni código de consentimiento en los HTML personalizados. Las 29 etiquetas muestran `consentStatus: NOT_SET`; esto es la configuración de consentimiento adicional de GTM, **no una prueba de consentimiento otorgado por una persona**. La nueva captura mantiene `analytics_consent: unknown` e IDs GA nulos hasta conectar una fuente explícita. No cambia la configuración de consentimiento de los destinos actuales.

GA4 muestra zona horaria **Chile, (GMT-03:00) Chile Time** y moneda CLP. En el stream `G-M7YT4CY8MC`, Custom configurations tiene un único evento derivado: `ads_conversion_P_gina_de_logro_1`, desde `event_name = page_view` y `page_path` comienza por `/onboarding-success` sin distinguir mayúsculas. No hay modificaciones de eventos. El filtro `one_` en Recent events devuelve cero resultados en la ventana administrativa de 28 días. Se preparó una conexión aditiva independiente en `integrations/gtm/one-ga4-additive.json`; todavía no se publicó.

El inventario establece el contrato de configuración, no la recepción histórica ni una garantía de entrega. Aún faltan los diagnósticos de Meta Events Manager y la verificación de red antes/después de la activación. No se habilitarán Measurement Protocol, CAPI ni importaciones offline para duplicar rutas que ya existen.

## Repetir la comparación

Desde Admin → Export Container → versión publicada → Preview JSON, guardar el JSON completo de forma privada. Generar un snapshot sin alterar la exportación original:

```sh
node scripts/lead-traceability/snapshot-gtm.mjs /ruta/privada/export.json /ruta/snapshot.json
```

Comparar hashes por ID de etiqueta/activador/variable, además de la lista de IDs. El hash de la versión completa también incluye metadatos de versión; una diferencia requiere revisar el detalle y no implica por sí sola un cambio de envíos. Estos snapshots son evidencia de auditoría; no sirven como archivos de importación de GTM.
