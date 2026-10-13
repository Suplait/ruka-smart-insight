# Conexión aditiva de Ruka One a GA4

`one-ga4-additive.json` contiene únicamente una etiqueta y un activador nuevos. Importar en **un workspace separado** de GTM-NTNN9QBG mediante **Merge**, conservando todas las etiquetas existentes. Nunca usar Overwrite. Verificar que la vista previa del import muestre exactamente dos altas y cero modificaciones/bajas.

Importado el 13 de octubre en [Ruka One · conexión GA4, workspace 24](https://tagmanager.google.com/?authuser=2#/container/accounts/6231394894/containers/206691913/workspaces/24). GTM asignó los IDs 60 a la etiqueta y 59 al activador. Se verificaron **0 modificados, 2 añadidos y 0 eliminados**; no se pulsó Submit/publicación. Los IDs 1001 del archivo son locales a la importación, no los IDs finales asignados por GTM.

La etiqueta GA4 conserva los siete nombres existentes de `oneTracking.ts`, con un activador de coincidencia exacta. Usa el destino existente `G-M7YT4CY8MC` y `ONCE_PER_EVENT`. No incluye email, teléfono, empresa, lead_id, URI de Calendly ni nuevos parámetros personalizados; las métricas del embudo se segmentan por nombre de evento y dimensiones de página existentes. No marca key events, modifica conversiones Ads ni añade llamadas Meta.

Auditoría previa: versión web 21 sin activadores/etiquetas One; versión Server 1 sin etiquetas; código One sólo escribe dataLayer. GA4 no tiene modificaciones y su único evento derivado es `ads_conversion_P_gina_de_logro_1`, a partir de page_view en /onboarding-success. El filtro `one_` no devuelve eventos recientes en la ventana de 28 días del administrador. Esto fundamenta la nueva conexión; no afirma recepción después de publicarla.

Antes de publicar: comprobar por Preview que cada evento One activa esta etiqueta una sola vez y que los eventos clásicos no la activan; verificar que las 29 etiquetas y los 15 activadores existentes no cambiaron. La publicación y verificación de recepción siguen pendientes.
