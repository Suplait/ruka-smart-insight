# Facturador: detalle, equipo y asistentes

Iteración local sobre la página de facturación. Sin emisión fiscal, cambios de backend, commit o deploy.

## Contenido y criterio

- Hasta 60 ítems por factura en el hero, bloque propio y FAQ. No confundir con facturas mensuales.
- Permisos por empresa para preparar, aprobar/emitir, catálogo/clientes e integraciones. No inventar nombres de roles como administrador, contador o vendedor.
- Reutilizar una venta y apoyarse en catálogo/clientes para evitar recargar información.
- MCP con Claude/ChatGPT tiene una sección diferenciada, ejemplo explícitamente ilustrativo y CTA comercial. No se implementó ni comprobó un servidor MCP. Se presenta como integración a coordinar, no activación automática o conexión productiva verificada.
- La API documentada de compras mantiene su alcance de consulta/eventos. No se confunde con emisión.
- Preguntas y respuestas en HTML inicial, accesos por anclas, estructura responsive y sin simulación de emisión.

## Evidencia consultada (privada, no publicar en la landing)

Repositorio local hermano ruka_biller, rama codex/experiencia-facturador-completa:
- app/services/invoice_reuse.rb: validación de 1–60 ítems y reutilización.
- app/models/membership.rb: owner/member y capacidades prepare_documents, emit_documents, manage_catalog, manage_integrations.
- Búsqueda de MCP/Claude/ChatGPT: no se encontró implementación del conector en esta copia. Esta inspección no demuestra su ausencia en todos los despliegues ni verifica disponibilidad productiva.

No se modificó el repositorio del facturador ni se expusieron datos de clientes, credenciales o trazas internas.

## Verificación

- 17 pruebas de contenido SSR e interacciones del facturador aprobadas.
- ESLint de los cuatro archivos de implementación/pruebas modificados: aprobado.
- Production build: aprobado; 1116 rutas prerenderizadas y validación de frontera pública aprobada.
- SEO/AEO: 54.639 verificaciones aprobadas.
- Revisión visual en 1440 × 1000 y 360 × 800; ancla MCP funcional. En móvil, scrollWidth=360 e innerWidth=360 (sin desborde horizontal).
- Evidencia local: /tmp/ruka-billing-teamwork-desktop.png y /tmp/ruka-billing-mcp-desktop.png.
- Sin commit ni despliegue. Estas pruebas verifican la página de marketing, no una conexión MCP real ni emisión fiscal.
