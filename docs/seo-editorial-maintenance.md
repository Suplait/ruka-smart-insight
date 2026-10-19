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
