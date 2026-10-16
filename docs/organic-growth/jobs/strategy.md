# Ruka Organic Growth — estrategia mensual

Esta rutina se ejecuta dentro del worktree limpio del coordinador. Reutiliza ese worktree; no crees ni elimines otro. El coordinador lo elimina al finalizar todas las rutinas. Cada rutina adquiere exclusivamente su propio lease. Todas las referencias a crear/eliminar worktrees en el procedimiento histórico se entienden subordinadas a esta regla.

Ejecuta la revisión estratégica mensual del Ruka Organic Growth Engine. Esta automatización reordena la cartera de oportunidades; no edita el sitio, no hace commits, no abre PR y no despliega.

Trabaja desde un worktree temporal limpio creado desde origin/main. Ejecuta node scripts/organic-growth/job-control.mjs claim strategy. Si claimed=false, elimina el worktree y termina. Si claimed=true, conserva run_id. Actualiza Search Console para sc-domain:ruka.ai y ejecuta npm ci. Luego ejecuta ORGANIC_GROWTH_RUN_ID=<run_id> npm run organic:gsc; RUKA_REPO_PATH=/Users/camilosilva/Desktop/Suplait/Dev/ruka-ai RUKA_V3_REPO_PATH=/Users/camilosilva/Desktop/Suplait/Dev/ruka_v3 npm run organic:product; y npm run organic:prepare.

Sigue STRATEGY.md, PRODUCT_INTELLIGENCE.md y las restricciones de OPERATIONS.md. Revisa demanda visible, intención comercial, páginas existentes, resultados de experimentos, capacidades verificadas del producto y prioridades del negocio. Reordena oportunidades con criterio: impacto comercial, confianza de demanda, ventaja real de Ruka, esfuerzo y riesgo. No inventes volumen, capacidades, clientes o integraciones. No conviertas una idea en experimento si todavía no fue desplegada. Mantén approval_required para superficies protegidas.

Si corresponde actualizar la cartera, conserva los ids y fingerprints existentes y persiste filas completas mediante engineRequest("sync_opportunities"); no borres oportunidades por ausencia temporal de datos. Guarda un resumen privado en .organic-growth/strategy-review.json y persiste las tres prioridades principales y sus razones dentro de ORGANIC_GROWTH_SUMMARY al completar el run. Si no hay evidencia para cambiar prioridades, déjalas intactas y explica por qué.

Completa con ORGANIC_GROWTH_RUN_ID=<run_id> ORGANIC_GROWTH_DATA_THROUGH_DATE=<fecha> ORGANIC_GROWTH_SUMMARY='<JSON conciso y válido>' node scripts/organic-growth/job-control.mjs complete. Ante fallo, registra incidente local, intenta avisar al canal Slack C073N8S9TB4, registra la entrega y ejecuta ORGANIC_GROWTH_RUN_ID=<run_id> ORGANIC_GROWTH_ERROR='<error seguro>' node scripts/organic-growth/job-control.mjs fail. Elimina el worktree. Salida final: cambios de prioridad, top 3, decisiones humanas requeridas, fecha de datos, backup y próxima revisión.

