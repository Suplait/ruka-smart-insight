# Ruka Organic Growth — watchdog diario

Esta rutina se ejecuta dentro del worktree limpio del coordinador. Reutiliza ese worktree; no crees ni elimines otro. El coordinador lo elimina al finalizar todas las rutinas. Cada rutina adquiere exclusivamente su propio lease. Todas las referencias a crear/eliminar worktrees en el procedimiento histórico se entienden subordinadas a esta regla.

Ejecuta el watchdog diario de Ruka Organic Growth. Su único propósito es observar salud técnica, indexación, frescura de datos y señales que merezcan atención; nunca debe editar ni publicar contenido.

Trabaja desde un worktree temporal limpio creado desde origin/main. No copies secretos de Organic Growth ni dependas de Supabase. Antes de instalar o consultar datos, ejecuta node scripts/organic-growth/job-control.mjs claim monitoring. Si claimed=false, elimina el worktree y termina sin cambios ni Slack. Si claimed=true, conserva run_id.

El comando claim prepara .organic-growth antes de adquirir el lease. No lances comprobaciones auxiliares antes de que claim termine. Guarda evidencia adicional mediante writePrivateJson de scripts/organic-growth/lib.mjs, que también garantiza la existencia del directorio y archivos privados. No dependas de que npm ci u organic:gsc creen la carpeta en paralelo.

Actualiza de forma segura la conexión de Google Search Console para sc-domain:ruka.ai con la cuenta conectada en Codex. Ejecuta npm ci, luego ORGANIC_GROWTH_RUN_ID=<run_id> npm run organic:gsc y npm run organic:watchdog. Lee .organic-growth/watchdog.json. Verifica explícitamente HTTP y HTML prerenderizado del home, robots.txt, sitemap.xml, llms.txt, integridad SQLite, fecha finalizada de GSC, experimentos que ya deberían medirse y opportunityHints de queries comerciales non-brand respaldadas por Search Console.

Si health=healthy o warning, no modifiques archivos tracked, no abras PR y no envíes Slack por rutina. Completa con ORGANIC_GROWTH_RUN_ID=<run_id> ORGANIC_GROWTH_DATA_THROUGH_DATE=<fecha> ORGANIC_GROWTH_SUMMARY='<JSON conciso con health, issues, experimentsDue y opportunityHints>' node scripts/organic-growth/job-control.mjs complete.

Un error local auxiliar recuperable (por ejemplo, guardar evidencia antes de crear un directorio) no equivale a caída del sitio ni a fallo definitivo. Corrige la precondición y reintenta ese paso una sola vez, dentro del mismo run y lease. Solo cuenta como recuperado si vuelve a ejecutarse correctamente, su evidencia queda guardada y legible y todas las comprobaciones obligatorias terminan con resultados actuales. Registra el error original, la corrección y su verificación en summary.recoveredErrors. Si el resultado final es healthy o warning, completa normalmente sin Slack por ese error recuperado. No borres el historial, no ignores fallos pendientes ni uses datos antiguos para aparentar recuperación.

Si health=critical, una comprobación obligatoria queda incompleta o el fallo persiste después del intento local acotado, registra primero un incidente local con job-control incident, envía un aviso accionable al canal Slack C073N8S9TB4 mediante el conector de Slack y registra su referencia con incident-delivered. Luego libera el lease con ORGANIC_GROWTH_RUN_ID=<run_id> ORGANIC_GROWTH_ERROR='<error seguro>' node scripts/organic-growth/job-control.mjs fail. Nunca dejes un lease abierto. Un fallo interno se identifica como tal; no anuncies una caída del sitio sin evidencia HTTP/HTML que la sustente.

Elimina el worktree temporal. Salida final breve: health, endpoints, fecha GSC, issues, experimentos maduros, oportunidades comerciales, backup y próxima ejecución.

