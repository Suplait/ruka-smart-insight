# Comparativas: revisión editorial, diseño y QA

> Autorización posterior: el usuario pidió «deployea todo e2e lo que falte deployear». Se autoriza publicar conjuntamente estas iteraciones tras el QA. Las menciones a entrega local y aprobación pendiente que siguen son el registro histórico previo a esa autorización.

Documento interno de trabajo. No está en public/, no se enlaza desde el sitio y no debe publicarse como contenido comercial.

## Estado

- Branch: codex/comparison-guides-upgrade.
- Nueve fichas implementadas y directorio rediseñado.
- Revisión local: http://127.0.0.1:8094/comparar.
- El usuario rechazó la versión que estaba publicada. Esta nueva iteración queda para revisión, sin commit, push, merge ni despliegue.
- El goal E2E sigue abierto: falta aprobación visual y después publicación y comprobación en producción.

## Criterio

El visitante está decidiendo cómo resolver trabajo administrativo, no buscando una auditoría de software. La página debe explicar el aporte de Ruka primero y reconocer con precisión dónde cada alternativa tiene otro alcance. La ausencia de documentación pública no prueba la ausencia de una función.

Se aplicaron impeccable, design-taste-frontend y emil-design-eng: auditoría antes de intervenir, marca Ruka existente, jerarquía editorial, contenido accesible desde el HTML inicial, interacción pequeña y útil, lectura móvil y revisión con capturas. Dirección: variación 6, movimiento 3, densidad 4. Sin inventar logos ni métricas, sin ruido ornamental ni animación automática.

## Iteraciones y autocrítica

| Antes | Después | Por qué |
| --- | --- | --- |
| “Pregunta en la demo” repetido | Seis diferencias completas y visibles; checklist secundario | La página debe responder, no delegar toda la explicación a una reunión |
| Comparación centrada en evaluar al competidor | Apertura con el trabajo que resuelve Ruka y límites explícitos | Es una página comercial de Ruka, no una ficha de evaluación interna |
| Hero con otra caja de texto | Ejemplo interactivo de presentación y costo por kilo | Muestra una diferencia operativa que el comprador puede entender y tocar |
| Mismos consejos genéricos | Caso específico para cada alternativa | Facturación, ERP, tesorería, POS y APIs no resuelven el mismo problema |
| Referencias genéricas o antiguas | Títulos descriptivos y enlaces oficiales por fila | Permite revisar la afirmación sin exponer documentos internos |
| Tabla que exigiría desplazamiento horizontal | Fila por tarea en móvil, con nombres de las dos soluciones | Mantiene la comparación legible en 390 px |
| Captura pequeña sin detalle utilizable en teléfono | Visor ampliable, descripción, Escape y cierre de 44×44 px | Hace posible inspeccionar el producto sin romper el ancho de la página |
| Una sola comparativa | Nueve fichas, búsqueda y filtro por necesidad | Permite encontrar la alternativa y no fuerza una página idéntica para todas |
| Nuevas rutas solo en React | Prerender y rewrites explícitos para cada ruta | El servidor debe entregar el contenido y SEO correctos |

## Verificación editorial

Se revisaron sitios oficiales, documentación de producto y centros de ayuda. Los 30 enlaces finales devolvieron HTTP 200 durante esta revisión. Las URLs y su relación con cada afirmación están en src/content/comparisons.json.

- Emisso: se distingue Connect (infraestructura de conexión) de implementar y mantener el proceso completo. No se le atribuye una ausencia general de servicios de ingeniería.
- Tupana: /compras redirige a facturación; se retiraron conclusiones basadas en esa antigua URL. API apunta a /api-factura. Se reconoce emisión, cobranza y conciliación bancaria.
- Wasabil: se reconoce ecommerce, catálogo e inventario; la conciliación bancaria está presentada como beta por su sitio. No se copiaron promesas de recuperación fiscal ni porcentajes de éxito.
- Nubox: se reconocen libros, balances, asientos y conciliación. Su documentación de API de compras exige credencial de partner; no se presenta como acceso universal.
- Defontana: se reconocen ERP, portal de proveedores y controles propios. Integrar no implica permiso universal de escritura.
- Chipax: se diferencia Chipay de exportar una nómina bancaria con Ruka; el equipo carga y autoriza esta última en el banco.
- KAME: se reconocen órdenes, recepción parcial, cruces e importaciones. Ruka no se presenta como sustituto de una carpeta de importación.
- Bsale: se distinguen POS/ventas/stock de preparar la información de las compras.
- Clay: se distingue software de finanzas/contabilidad, automatización y servicio de contadores del alcance operativo de Ruka.

No se copió pricing ni se añadieron puntuaciones, benchmarks o testimonios inventados. El ejemplo de costos está identificado como ejemplo, no como resultado de un cliente. La captura es una captura real de la demo con datos de ejemplo.

## QA reproducible

1. Abrir /comparar: se muestran las nueve alternativas antes de filtrar.
2. Elegir “ERP y contabilidad”: quedan tres. Buscar “kame”: queda una. Escribir algo inexistente y limpiar filtros: vuelve a nueve.
3. Abrir /comparar/ruka-vs-tupana. Cambiar “Caja de 6 kg” por “Saco de 25 kg”: el costo cambia de $3.000/kg a $3.200/kg y explica el 6,67%.
4. Usar los enlaces de sección. Leer las seis diferencias sin abrir acordeones.
5. Ampliar la captura. En móvil, desplazarse dentro del visor; cerrar con Escape o el botón.
6. Copiar la lista opcional. Si el navegador bloquea el portapapeles, debe ofrecer seleccionar el texto.
7. Abrir FAQ y fuentes. Las fuentes abren páginas oficiales, no archivos internos TXT.
8. Verificar los enlaces a /register y /one sin enviar ningún formulario.
9. Repetir las rutas con emisso, wasabil, nubox, defontana, chipax, kame, bsale y clay.

## Resultados

- Production build: correcto; 1.116 rutas prerenderizadas.
- Lint de Compare, pruebas nuevas y validador SEO: correcto.
- Suite completa: 302/302 pruebas, 39 archivos, con --maxWorkers=2. La primera ejecución en paralelo con el build tuvo un timeout de 5 s en el test preexistente que renderiza 1.000 proveedores; pasó sin cambiar ese test al limitar concurrencia.
- Pruebas específicas después del último ajuste del visor: 17/17.
- SEO/AEO: 50.665 comprobaciones aprobadas, incluyendo HTML inicial, title, description, canonical, og:url, H1, schema Article/FAQ y respuestas presentes.
- Discovery: 4.496 comprobaciones aprobadas.
- Conversión de recursos: 1.076 páginas verificadas en el build.
- Tracking: 31 llamadas existentes conservan nombres, argumentos y orden.
- Navegador: las nueve fichas cargan H1, seis filas y cuatro FAQ a 390 px; las nueve cargan a 1.440 px. Sin desbordamiento horizontal del documento en ambos anchos.
- Interacciones revisadas en navegador: selector de presentación, filtros, recuperación sin resultados, navegación por secciones y visor.
- No se modificaron formularios, Calendly, Supabase, Slack, UTMs ni eventos.

## Límites que no se deben ocultar

- El contenido de competidores es investigación documental, no una prueba de sus cuentas ni una certificación independiente.
- El build mantiene advertencias existentes de chunks grandes y bases de compatibilidad desactualizadas. El módulo de comparativas pesa aproximadamente 20,2 kB gzip; no se añadieron dependencias.
- El QA técnico no equivale a aprobación de diseño ni garantiza posiciones en Google.
- La verificación HTTP en producción de estas nuevas fichas queda pendiente de aprobación y despliegue.

## Nueva iteración: fichas de decisión, 26 de octubre de 2026

Esta sección complementa la revisión anterior; los resultados de abajo corresponden a la nueva iteración. El goal de comparativas continúa activo: no se cierra artificialmente para crear uno duplicado. La nueva versión se mantiene local para revisión visual, sin commit ni publicación.

### Auditoría y decisiones de diseño

Se aplicaron nuevamente impeccable, design-taste-frontend y emil-design-eng. Dirección: variación 7, movimiento 3, densidad 4; identidad Ruka blanca/azul/tinta, tipografía existente, sin dependencias nuevas. Las capturas son evidencia de producto, no decoración: no se generaron interfaces ficticias ni imágenes de competidores.

| Antes | Después | Por qué |
| --- | --- | --- |
| El mismo cálculo de cajas y kilos abría las nueve fichas | Una pregunta de decisión y un resumen de los dos alcances, escritos individualmente | Un ERP, una API y un facturador no se eligen por la misma razón |
| Mucho texto sin una diferencia central fácil de recordar | Nueve distinciones concretas, desde conexión/proceso hasta banco/recepción | Permite entender el argumento antes de leer el detalle |
| Una captura y un relato idénticos para todos | Detalle de compra o recepción, con título y explicación pertinentes por competidor | La evidencia debe responder al problema de esa guía |
| Franjas laterales y columnas repetitivas de beneficios | Jerarquía editorial, contraste puntual y pares de decisiones legibles | Evita componentes decorativos sin función |
| Seis filas sin forma de concentrarse en una necesidad | Selector por tarea, restablecimiento y anuncio accesible del resultado | Facilita comparar un punto concreto sin perder acceso al conjunto |
| Tabla comprimida en móvil | Cada tarea presenta Ruka y alternativa en bloques consecutivos, identificados | No exige arrastrar una tabla para entenderla |
| El ejemplo interactivo ocupaba el hero incluso en APIs | Solo aparece en los casos de Tupana, Bsale y Clay | Ilustra una diferencia de costos donde tiene sentido; no simula al competidor |
| Fuentes solo al final del texto | Acceso “Ver respaldo” por tarea y referencias también en Article.citation | Afirmaciones legibles y trazabilidad documental sin TXT interno |
| Repetición de la conclusión en dos párrafos consecutivos | Una explicación central sin el párrafo redundante | Más contenido útil no significa repetir argumentos |

### Contenido específico de cada ficha

- Emisso: conexión programática frente a construir y mantener el proceso que usa los datos.
- Tupana: emisión/cobranza frente al detalle operativo de las compras. Se conserva explícitamente que Ruka tiene facturador.
- Wasabil: venta online y catálogo frente a documentos y presentaciones de proveedores.
- Nubox: trabajo contable frente a la información operativa previa al asiento.
- Defontana: centralización en ERP frente al trabajo manual que alimenta el sistema.
- Chipax: conciliación de dinero frente a recepción física. La captura explica 14 kg recibidos de 16 kg esperados, como ejemplo.
- KAME: se reconocen sus controles de compras y recepción; el argumento no es duplicarlos, sino identificar trabajo manual residual.
- Bsale: POS/canales comerciales frente a cómo entran compras, equivalencias y costos.
- Clay: finanzas/contabilidad frente a distinguir variación de volumen, presentación y costo unitario.

La nueva redacción se deriva de las capacidades y fuentes oficiales ya documentadas en comparisons.json. No se agregaron nuevos claims funcionales sobre competidores ni se hizo una nueva prueba de sus productos. No hay puntuaciones, pricing copiado, garantías de integración universal ni ausencia de funciones inferida del silencio documental.

### QA de esta iteración

- Suite completa: **320/320 tests, 41 archivos**.
- Después del último ajuste de copy/visor: **19/19 pruebas específicas** de comparativas.
- Lint relevante de Compare, ComparisonTasks, comparisonExperience y ambos archivos de tests: aprobado.
- Build final: aprobado, **1.116 rutas**. Protección editorial: 56 archivos revisados; 4.325 archivos de texto públicos sin informes internos.
- SEO: **54.629 comprobaciones**; discovery: **4.496 comprobaciones**.
- Conversión: 1.076 páginas de recursos verificadas en el build. Contrato de tracking: **31 llamadas sin cambios** de nombre, argumentos u orden.
- Navegador: las nueve fichas revisadas a 1.440×1.000 y 390×844; sin desbordamiento horizontal. Comprobación adicional de Defontana a 320 px y KAME a 768 px.
- Se probaron selección por tarea, restauración, cambio de ficha que reinicia el filtro, calculadora contextual, ampliación y Escape. Tests cubren copia y fallback de portapapeles.
- HTML obtenido por HTTP desde el preview local: **9/9 respuestas 200** con title propio, canonical correcto, seis filas de comparación y referencias Article.citation. Se solicitó el destino index.html de cada rewrite de Vercel, porque Vite preview no implementa esos rewrites. Esto no sustituye una validación de producción.
- Las seis filas están visibles en el HTML inicial. El filtro las oculta únicamente tras una selección; no depende de un fetch adicional. Las FAQ conservan sus respuestas en HTML y schema.
- No se editaron datos de proveedores, herramientas, formularios, navegación global, eventos, backend ni funnel durante esta iteración. Los cambios locales de trabajos anteriores se preservaron.

### Cómo revisar

1. Abre http://127.0.0.1:8094/comparar/ruka-vs-tupana y revisa la nueva entrada.
2. Pulsa “Comparar por tarea”, elige “Detalle de la compra” y vuelve a “Todas las tareas”.
3. Amplía la captura. En móvil puedes desplazar la imagen dentro del visor, sin ensanchar la página.
4. Baja al caso, cambia caja/saco y revisa la explicación del costo unitario.
5. Contrasta con /comparar/ruka-vs-chipax y /comparar/ruka-vs-emisso: la decisión y la evidencia no cuentan la misma historia.
6. Copia la lista previa al cambio, abre las FAQ y verifica los enlaces oficiales. No envíes formularios para revisar la presentación.
7. Desde /comparar puedes abrir las otras seis alternativas.

Capturas locales: `/Users/camilosilva/.codex/visualizations/2026/10/26/comparison-upgrade-v2/`. Incluyen los nueve encabezados en desktop y móvil, mosaicos de auditoría y KAME completo en tablet.

### Límites pendientes

Esta pasada no incluye commit, push, merge ni deploy. El goal E2E no está completo hasta la revisión y publicación correspondientes. El módulo Compare queda en aproximadamente **23,64 kB gzip** (antes ~20,2 kB); se mantiene lazy-loaded y no se agregaron librerías. Persisten los avisos globales de chunks grandes y bases de compatibilidad antiguas. No se corrió Lighthouse ni se promete una posición en Google. El lint global tiene fallos previos fuera de este alcance; el lint relevante sí pasa.
