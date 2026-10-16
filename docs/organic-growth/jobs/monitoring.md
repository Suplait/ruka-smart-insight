# Ruka Organic Growth — watchdog diario

Esta rutina se ejecuta dentro del worktree limpio del coordinador. Reutiliza ese worktree; no crees ni elimines otro. El coordinador lo elimina al finalizar todas las rutinas. Cada rutina adquiere exclusivamente su propio lease. Todas las referencias a crear/eliminar worktrees en el procedimiento histórico se entienden subordinadas a esta regla.

Ejecuta el watchdog diario de Ruka Organic Growth. Su único propósito es observar salud técnica, indexación, frescura de datos y señales que merezcan atención; nunca debe editar ni publicar contenido.

Trabaja desde un worktree temporal limpio creado desde origin/main. No copies secretos de Organic Growth ni dependas de Supabase. Antes de instalar o consultar datos, ejecuta node scripts/organic-growth/job-control.mjs claim monitoring. Si claimed=false, elimina el worktree y termina sin cambios ni Slack. Si claimed=true, conserva run_id.

Actualiza de forma segura la conexión de Google Search Console para sc-domain:ruka.ai con la cuenta conectada en Codex. Ejecuta npm ci, luego ORGANIC_GROWTH_RUN_ID=<run_id> npm run organic:gsc y npm run organic:watchdog. Lee .organic-growth/watchdog.json. Verifica explícitamente HTTP y HTML prerenderizado del home, robots.txt, sitemap.xml, llms.txt, integridad SQLite, fecha finalizada de GSC, experimentos que ya deberían medirse y opportunityHints de queries comerciales non-brand respaldadas por Search Console.

Si health=healthy o warning, no modifiques archivos tracked, no abras PR y no envíes Slack por rutina. Completa con ORGANIC_GROWTH_RUN_ID=<run_id> ORGANIC_GROWTH_DATA_THROUGH_DATE=<fecha> ORGANIC_GROWTH_SUMMARY='<JSON conciso con health, issues, experimentsDue y opportunityHints>' node scripts/organic-growth/job-control.mjs complete.

Si health=critical o cualquier paso falla después del claim, registra primero un incidente local con job-control incident, envía un aviso accionable al canal Slack C073N8S9TB4 mediante el conector de Slack y registra su referencia con incident-delivered. Luego libera el lease con ORGANIC_GROWTH_RUN_ID=<run_id> ORGANIC_GROWTH_ERROR='<error seguro>' node scripts/organic-growth/job-control.mjs fail. Nunca dejes un lease abierto.

Elimina el worktree temporal. Salida final breve: health, endpoints, fecha GSC, issues, experimentos maduros, oportunidades comerciales, backup y próxima ejecución.

