# Expansión SEO: publicación y límites

Fecha editorial: 14 de octubre de 2026. Este lote implementa los puntos 1–4 solicitados; no modifica automatizaciones, formularios ni tracking.

## 1. FAQ y prueba de regresión

Home y el componente FAQ de acquisition mantienen las respuestas montadas en el HTML inicial. Permanecen visualmente cerradas hasta que el lector las abre. Se conserva Radix, teclado y selección exclusiva.

`seo-body-text.mjs` elimina scripts, estilos y templates antes de validar respuestas. Un texto presente solo en JSON-LD ya no cuenta como contenido. Tests verifican el caso negativo y renderizan los componentes reales. El validador estricto descubrió también el fallo en las cuatro acquisition pages; se corrigió únicamente su FAQ, no su formulario.

## 2. Cluster editorial

- Guía existente de registro: nueva sección sobre una compra recibida por dos fuentes y reintentos.
- Guía existente de conciliación: responsables y evidencia para resolver diferencias.
- Guía existente de nómina bancaria: verificación antes de cargar y revisión antes de reintentar.
- Nueva `/blog/actualizar-costos-precios-proveedores`: unidad comparable, receta, método de costo y alcance del margen. Ejemplos ficticios reproducibles: 25.000/25 = 1.000; 24.000/20 = 1.200; aumento 20%; 250 g cuestan 250 y luego 300.

Las URLs y fechas originales de las tres guías se preservan. Nuevos enlaces unen artículos, productos, integraciones y el demostrador existente. Artículos relacionados prioriza relaciones editoriales, no solo publicaciones recientes.

## 3. Integraciones verificadas

Nuevas fichas `/integraciones/chipax` y `/integraciones/idtecloud`, enlazadas desde el catálogo y desde guías. Se revisó implementación de consulta, descarga XML, validación de respuesta y envío optativo a Ruka. El registro de capacidades acota las afirmaciones.

**Revisión de código no es prueba E2E contra cuentas externas.** No se iniciaron sesiones de clientes, no se ejecutaron scrapers, no se probaron credenciales ni se activaron conexiones. Las fichas exigen confirmar acceso/configuración. No prometen escritura, emisión de facturas, conciliación bancaria ni disponibilidad universal. Defontana permanece sin ficha de posteo nuevo.

## 4. Comparativas de enfoques

- `/blog/registro-compras-excel-vs-automatizacion`: decidir por trabajo y controles pendientes, incluyendo cuándo conservar Excel.
- `/blog/ocr-facturas-vs-registro-automatico`: separar extracción de interpretación y escritura; una solución puede cubrir ambos alcances.
- `/blog/conciliacion-dos-vs-tres-documentos`: evidencia de recepción, servicios y entregas parciales; coincidencia no equivale a pago autorizado.

No se comparan marcas de terceros ni se afirman ahorros. Los cuatro diagramas son SVG originales, diferentes y ampliables, con contenido equivalente explicado en HTML; no son screenshots ni simulaciones del producto. Las capturas existentes no se reutilizan. Se corrigió el marco del artículo para no etiquetar los diagramas como demo.

## Demanda y medición

Selección basada en las preguntas operativas y territorios ya documentados en `RESEARCH.md`/`STRATEGY.md`, no en nuevos volúmenes de búsqueda inventados. Cada artículo registra intención, audiencia y targetQuery. Una guía describe el procedimiento; una comparación ayuda a elegir alcance; una ficha explica la conexión. No se crean páginas por sinónimos.

Publicación no equivale a indexación, ranking ni citas de IA. Esos resultados se observan después con Search Console y el motor existente, sin prometer posiciones.

## QA reproducible

```sh
npm run organic:blog:validate
npm test
npm run test:tracking-contract
npm run build
npm run validate:seo
node scripts/validate-discovery-delivery.mjs https://www.ruka.ai
```

El último valida HTML remoto sin React: incluye home, cuatro acquisition pages, siete artículos, cinco fichas, índices y demostrador; metadata, respuestas, imágenes, sitemap, llms, robots, redirects y 404. Usar build del commit publicado. El ESLint relevante debe pasar sobre los archivos cambiados.

Manual: a 1440px y 360px abrir/cerrar FAQ (también con Enter), navegar catálogo → ficha → guía → producto; comprobar diagramas sin recortes, enlaces de índice, ejemplos y ausencia de overflow. No enviar leads ni reservar horas como parte de este QA editorial.

## Evidencia de esta entrega

- Build: 31 rutas prerenderizadas; validación SEO: 1.552 assertions.
- Vitest: 85 tests, 12 archivos. Contrato: 31 llamadas de tracking conservadas.
- QA en navegador: seis páginas nuevas sin overflow ni imágenes rotas a 360 px; fichas y diagramas revisados a 1440 px. Logo de iDTECloud sobre fondo oscuro para conservar contraste.
- Recorrido real: catálogo → Chipax → comparación OCR → ancla del artículo → Registro de compras. FAQ home con apertura exclusiva y teclado; FAQ de acquisition probado en móvil con siete respuestas cerradas y una abierta.
- Implementaciones revisadas en `xml_downloader`, commit `43961d0052b1e714324f65ce1d660e5e5579a289`: `chipax/chipax_scraper.py` (consulta, descarga y envío condicional) e `idtecloud/idtecloud_scraper.py` (empresa, fechas, XML y envío). Revisión estática, sin ejecutar los conectores.
- Verificación remota: ejecutar el comando de delivery después de que Vercel confirme el despliegue; los resultados definitivos se registran en el PR y la entrega, no se presuponen aquí.
