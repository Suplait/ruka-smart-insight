# Mantenimiento editorial SEO

## Fechas

El sitemap se genera durante el build. No hay una copia manual en public.
Para páginas no editoriales, la fuente es src/content/pageModified.json.
Para artículos, es dateModified en cada JSON de src/content/blog/posts.

Actualizar la fecha cuando cambia contenido principal, enlaces relevantes o
datos estructurados. No cambiarla por un despliegue, una dependencia, un
copyright o una revisión sin cambios. No usar la hora del build ni inventar
fechas de revisión del producto. reviewedAt de una integración sigue
describiendo la revisión de su alcance, no la creación de su preview social.

## Autor

Camilo Silva es el autor aprobado de los siete artículos actuales. La firma,
bio y Person comparten src/content/blog/author.ts y enlazan /about#founder-1.
Un artículo nuevo debe contar con aprobación editorial del autor antes de
atribuirlo; el generador no convierte una autoría inventada en válida.

## Validación antes de publicar

- npm run build
- npm run validate:seo
- npm run validate:discovery
- npm run organic:blog:validate
- npm test
- Lint de los archivos modificados y revisión visual desktop/mobile.

Verificar HTML servido en producción, no solo el DOM: autor, canonical,
description, JSON-LD, imágenes OG, sitemap y enlaces mailto de páginas legales.
Los informes internos y la respuesta al consultor nunca se copian a public.

## Recursos y guías revisadas

Las nuevas rutas indexables necesitan una ficha en
`config/editorial-publications.json`. El build contrasta esta ficha con el
sitemap y el HTML servido. La lista `editorial-legacy-routes.json` identifica
las rutas anteriores a este control, no autoriza nuevas excepciones.

Para las guías de compras, la revisión incluye fuentes oficiales del SII,
fecha, alcance y afirmaciones concretas. Se publica el autor aprobado,
la fecha y las fuentes legibles; las notas de auditoría permanecen privadas.
La autorización del CEO permite esta verificación documental sin una firma
externa. No se presenta como certificación contable ni como asesoría sobre
una operación particular.

`reviewedContentSha256` vincula la aprobación con todos los valores del
artículo en `src/content/purchaseGuides.json`: texto, enlaces y fuentes.
Cambiar cualquiera de ellos exige revisar nuevamente el contenido antes de
actualizar el digest. No regenerarlo automáticamente durante el build para
ocultar un cambio. La fecha debe corresponder a una revisión realmente hecha.

La revisión vence según `reviewWithinDays` (90 días en guías tributarias).
El build falla ante revisión vencida, fechas futuras, fuentes ausentes,
cambios sin revisar o borradores incluidos en la salida. Eso exige volver a
consultar las fuentes y resolver las diferencias; no basta mover una fecha.

Pruebas del control: `node --test scripts/editorial/validate-publications.test.mjs`.

## Revisión exacta de las otras superficies

`config/editorial-source-lock.json` registra hashes de las fuentes nuevas y sus
capacidades. Incluye API, comparación, ayuda, seguridad y páginas de producto.
`validate-source-lock.mjs` falla si se modifica una fuente sin actualizar su
revisión. No genera nuevos hashes durante build: primero verificar el diff y
las fuentes, después aprobar explícitamente. Las notas de esa revisión siguen
en privado. El control tributario adicional exige hechos/fuentes/fecha.

No se asume que una revisión local monitoriza un sistema externo. Al cambiar
el release de API/Biller, cotejar la versión, volver a ejecutar los specs y
reexportar el catálogo oficial antes de reaprobar los ejemplos. El snapshot
OpenAPI señala su fecha y siempre enlaza la referencia vigente.

## Novedades

`src/content/releaseNotes.ts` contiene solo cambios que llegan en el mismo
despliegue y enlaces a recursos reales. No inferir una función productiva de
un commit, una demo o un test. No inventar releases anteriores ni fechas
recientes para refrescar el SEO. Una nota de recursos no altera habilitaciones
de producto. El radar privado propone cambios; publicar requiere este QA.
