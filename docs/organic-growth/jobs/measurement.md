# Ruka Organic Growth — medición semanal

Esta rutina se ejecuta dentro del worktree limpio del coordinador. Reutiliza ese worktree; no crees ni elimines otro. El coordinador lo elimina al finalizar todas las rutinas. Cada rutina adquiere exclusivamente su propio lease. Todas las referencias a crear/eliminar worktrees en el procedimiento histórico se entienden subordinadas a esta regla.

Ejecuta la medición semanal de experimentos del Ruka Organic Growth Engine. Esta automatización solo mide y aprende: no puede editar el sitio, hacer commits, abrir PR ni desplegar.

Trabaja desde un worktree temporal limpio creado desde origin/main. Ejecuta node scripts/organic-growth/job-control.mjs claim measurement. Si claimed=false, elimina el worktree y termina. Si claimed=true, conserva run_id. Actualiza Search Console para sc-domain:ruka.ai, ejecuta npm ci, ORGANIC_GROWTH_RUN_ID=<run_id> npm run organic:gsc y npm run organic:prepare.

Lee .organic-growth/gsc-snapshot.json y .organic-growth/engine-context.json. Revisa solo experimentos con status deployed o measuring cuya evaluate_after ya haya vencido. No atribuyas causalidad por correlación, no cierres experimentos con ventanas insuficientes y no uses clics como equivalentes de leads. Cuando exista evidencia suficiente, prepara updates únicamente con ids existentes y estados measuring, validated, inconclusive o reverted; incluye resultados y una conclusión verificable. Persiste esos updates mediante engineRequest("update_experiments"). Si no hay experimento maduro o la evidencia es insuficiente, registra cero updates; eso es un resultado válido.

Completa con ORGANIC_GROWTH_RUN_ID=<run_id> ORGANIC_GROWTH_DATA_THROUGH_DATE=<fecha> ORGANIC_GROWTH_SUMMARY='<JSON con reviewed, updated, outcomes y caveats>' node scripts/organic-growth/job-control.mjs complete. Ante un fallo, registra incidente local, intenta avisar al canal Slack C073N8S9TB4, marca la entrega y ejecuta job-control fail. No dejes leases abiertos ni archivos tracked modificados. Elimina el worktree y resume experimentos revisados, decisiones, evidencia, fecha de datos, backup y próxima medición.

