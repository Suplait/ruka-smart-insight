# Recuperación del scheduler · 16 de octubre de 2026

## Causa comprobada

El reporte del 15 despertó a las 09:00 UTC (06:00 Chile), mientras SQLite lo esperaba
a las 12:00 UTC (09:00 Chile). El agente respondió `not_due` correctamente, pero el
scheduler no volvía a despertar hasta noviembre. El monitoreo y la ejecución también
podían despertar unos minutos antes de su obligación y perder un día por ese desacople.

## Cambio

Una automatización horaria en Codex consulta `dispatch`; SQLite mantiene las cinco
cadencias de negocio. Las rutinas anteriores permanecen versionadas en `jobs/` y sus
schedules independientes se pausan. No se ejecuta un motor paralelo en GitHub.

Los fallos conservan la obligación original y agregan `retry_after` independiente.
Cada reporte tiene una clave única por fecha programada, contenido persistido y un
comprobante Slack obligatorio. Un envío ambiguo se reconcilia buscando su reportId;
no se reenvía ciegamente. Leases, migración transaccional y recibos monotónicos evitan
doble ejecución y que un proceso vencido cierre el trabajo de otro.

## Recuperación real

- Monitoreo del 16: `bae45e10-3046-41c0-b2aa-4cd9eadab42e`, exitoso.
- Medición atrasada del 12: `d633625f-bbb6-45eb-b746-173ceed21226`, exitosa.
  Inspecciones actuales: seis páginas indexadas y stock descubierta sin indexar.
  No se reconstruyen observaciones históricas ni se atribuye causalidad de tráfico.
- Acción del 15: ya recuperada el 16 mediante
  `e3e7b793-e549-4d48-a9ca-a78ca5ab2057`. Evidencia privada nueva registrada;
  no se duplica ni se presenta como una publicación.
- Reporte del 15: `49fabeac-b1ac-4a1a-8377-15c01958e1fc`, entregado y releído
  en Slack; run `b89042e8-00f1-4c84-b2e3-6c53a9f833cd` exitoso.
  El permalink queda en SQLite. `dispatch` posterior: ningún trabajo debido o activo.

## Pruebas reproducibles

```sh
node --test scripts/organic-growth/*.test.mjs
npx eslint scripts/organic-growth/local-engine.mjs scripts/organic-growth/local-engine.test.mjs scripts/organic-growth/job-control.mjs scripts/organic-growth/generate-report.mjs
npm run build
npm run validate:seo
node scripts/organic-growth/job-control.mjs dispatch
node scripts/organic-growth/job-control.mjs integrity
```

46 pruebas del motor/evidencia pasan: regresión del 15, jitter temprano, fechas de
verano/invierno, frontera semanal, reintentos Slack, caída prolongada, migración,
recibos y dos procesos reales compitiendo por el mismo lease.
Build: 33 rutas prerenderizadas; validación SEO: 1.644 comprobaciones.

La configuración del modelo se verifica aparte en el run real de Codex: debe ser
`gpt-6-astra-camilo` con proveedor `azure`, nunca un fallback nativo.
La máquina y Codex deben estar activos. No se promete ejecución con el equipo
apagado: las obligaciones permanecen pendientes y se recuperan al siguiente despertar.
