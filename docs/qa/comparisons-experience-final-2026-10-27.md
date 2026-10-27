# Comparativas: experiencia de decisión, revisión final

Fecha: 27 de octubre de 2026. Estado: implementado y probado en local, **sin commit, push ni publicación**.

## Alcance

Las nueve fichas: Emisso, Tupana, Wasabil, Nubox, Defontana, Chipax, KAME, Bsale y Clay. Se conserva el índice `/comparar`, sus filtros, las URLs, el contenido factual de `comparisons.json`, los precios de Ruka, el formulario y el tracking. Los cambios locales anteriores de herramientas y proveedores permanecen intactos.

No son 60 cambios repetidos manualmente nueve veces: son **60 mejoras de la experiencia compartida**, aplicadas a cada ficha, más un mapa de decisión propio de cada competidor. El contenido no se uniforma con un cambio de nombre.

## Criterio de diseño

La página debe ayudar a distinguir tres decisiones: automatizar un trabajo con Ruka, elegir otro producto para un problema diferente o conservar lo que funciona y conectar el trabajo pendiente. No debe simular una prueba independiente ni inventar puntajes para declarar un ganador.

Se aplicaron `impeccable`, `design-taste-frontend` y `emil-design-eng`: auditoría antes de editar, identidad Ruka existente, jerarquía editorial, menos cajas repetidas, interacción con un propósito, teclado, estados recuperables, responsive y revisión visual real. Dirección: variación 6, movimiento 3, densidad 4. No se incorporaron tipografías, dependencias, logos inventados ni capturas sintéticas.

La revisión inicial encontró un hero y un cuerpo redundantes, información de convivencia repetida, fuentes lejos de cada decisión, una lista de implementación sin trabajo propio del lector y una ampliación de imagen que podía seguir limitada por el ancho máximo global.

## Las 60 mejoras

| # | Before | After | Why |
|---|---|---|---|
| 01 | Bloque oscuro con dos descripciones de producto. | Resumen visual claro: conservar, trabajo pendiente y resultado con Ruka. | Leer la diferencia como una decisión operativa. |
| 02 | Conservar sistemas se explicaba más abajo. | Cada marca identifica arriba lo que conviene conservar. | No plantear una migración innecesaria. |
| 03 | El trabajo manual quedaba distribuido en párrafos. | Un paso específico identifica el trabajo pendiente por competidor. | Que el comprador reconozca su problema. |
| 04 | Valor de Ruka mezclado con la descripción de ambos. | Resultado de Ruka destacado al final del resumen. | Dar protagonismo al resultado, no a una lista de funciones. |
| 05 | Comparar por tarea era un enlace secundario. | Acción sólida y visible en el hero. | Llevar al detalle a quien ya quiere comparar. |
| 06 | No había un camino directo para preparar la decisión. | Acción «Preparar mi decisión» desde el hero. | Ofrecer utilidad sin exigir una reunión. |
| 07 | No se anticipaba lo que ofrece la guía. | Se explicitan seis tareas, fuentes y pauta. | Establecer expectativas concretas. |
| 08 | El H1 podía romper líneas de forma poco equilibrada. | Balance de texto y tracking menos apretado. | Mejorar títulos largos en pantallas pequeñas. |
| 09 | Categoría y etiqueta editorial duplicaban información. | Eyebrow reducido a la categoría. | Quitar ruido antes del título. |
| 10 | Índice de cinco secciones sin pauta ni fuentes. | Siete accesos numerados, incluyendo pauta y fuentes. | Acceder a las partes útiles sin recorrer todo. |
| 11 | Índice móvil con saltos de línea arbitrarios. | Dos columnas en móvil, distribución flexible en escritorio. | Facilitar orientación y toque. |
| 12 | Encabezado de decisión separado de su explicación en dos columnas. | Título y explicación juntos, con ancho de lectura limitado. | Mantener la relación entre argumento y contexto. |
| 13 | Encaje de Ruka dentro de una caja estática. | Camino explícito «Automatizar con Ruka». | Entender cuándo evaluar su propuesta. |
| 14 | Encaje del competidor como segundo bloque estático. | Camino «Evaluar [competidor]» con su alcance intacto. | Mostrar dónde aporta la otra solución sin ocultarlo. |
| 15 | Convivencia explicada lejos del encaje. | Tercer camino «Conservar y conectar». | Evitar el falso dilema de reemplazarlo todo. |
| 16 | No había un control de decisión. | Grupo de radios nativos, con foco y navegación por teclado. | Hacer accesible la elección de perspectiva. |
| 17 | Dos párrafos de encaje siempre abiertos más otra sección de convivencia. | Una perspectiva visible a la vez; todas conservadas en HTML. | Reducir carga visual sin perder información rastreable. |
| 18 | Había que interpretar el párrafo completo de encaje. | Resumen «En una frase» dentro de cada perspectiva. | Facilitar una segunda lectura rápida. |
| 19 | Acciones genéricas al final de los bloques. | Acción contextual a producto, fuentes o Ruka One. | Continuar según la intención real. |
| 20 | Convivencia repetida en su propia sección. | Contenido consolidado dentro de la decisión. | Evitar otra parada redundante. |
| 21 | Captura de recepción reducida por la composición lateral. | Captura bajo su explicación y con ancho propio. | Mostrar controles y cantidades con más claridad. |
| 22 | Imagen sin contexto de pantalla en su marco. | Barra «Ruka / Recepción» o «Detalle de compra». | Identificar qué parte del producto se está mirando. |
| 23 | La ampliación conservaba restricciones globales de ancho. | Imagen sin `max-width`, con ancho natural y paneo. | Que ampliar realmente permita leer el detalle en móvil. |
| 24 | Área ampliada sin foco propio. | Región desplazable con nombre y foco de teclado. | Recorrer una captura sin depender de un gesto táctil. |
| 25 | Varios bordes y superficies dentro del marco de la captura. | Marco único, acción y pie separados por divisores. | Reducir decoración y destacar la evidencia visual. |
| 26 | Captura sin una pauta específica de observación. | Tres puntos para seguir una compra, propios de cada marca. | Relacionar el producto con una comprobación útil. |
| 27 | Encabezado de tareas con copy partido y etiqueta extra. | Pregunta y explicación en una sola zona de lectura. | Comprender cómo comparar antes de interactuar. |
| 28 | Siete botones ocupaban varias filas en móvil. | Selector nativo compacto; botones se conservan en escritorio. | Llegar antes a la comparación en teléfonos. |
| 29 | Solo se podía filtrar una tarea. | Marcar varias tareas como prioridades. | Reflejar las necesidades reales de un equipo. |
| 30 | No existía estado de tarea importante. | Bookmark con texto y `aria-pressed`. | Comunicar selección sin depender solo del color. |
| 31 | No había una vista de tareas elegidas. | Contador y filtro «Mis prioridades». | Revisar juntas las tareas relevantes. |
| 32 | No existía una recuperación para prioridades vacías. | Estado vacío con explicación y regreso a las seis tareas. | Evitar una pantalla sin salida. |
| 33 | No era posible compartir un subconjunto de la comparación. | Copia de prioridades con ambos alcances y sus fuentes. | Llevar una selección fiel a la discusión interna. |
| 34 | No había manejo de error para esa copia. | Mensaje recuperable si el portapapeles está bloqueado. | Mantener útil la experiencia con permisos limitados. |
| 35 | No existía limpieza de selección. | Quitar las marcas sin borrar el contenido. | Volver a empezar sin recargar. |
| 36 | Ver respaldo desplazaba al final de la página. | Fuente contextual en un diálogo sobre la misma tarea. | Consultar evidencia sin perder el lugar. |
| 37 | El dominio de la fuente no estaba visible en contexto. | Dominio oficial visible en el diálogo. | Saber a dónde conduce el enlace. |
| 38 | Había que localizar luego el enlace externo. | Acción directa a la fuente oficial, identificada como pestaña nueva. | Reducir pasos al revisar el respaldo. |
| 39 | No existía un diálogo de evidencia adaptado a móvil. | Margen lateral, alto acotado y cierre mínimo de 44 px. | Poder leer y cerrar cómodamente. |
| 40 | El lector perdía su posición al consultar la fuente dentro de la ficha. | Diálogo con Escape y restitución del foco al disparador. | Volver a la misma tarea por teclado. |
| 41 | Prioridades y pauta eran acciones aisladas durante la primera iteración. | La pauta incorpora cada prioridad con los dos alcances y fuente. | Convertir toda la página en un recorrido coherente. |
| 42 | No había confirmación de qué prioridades viajan en la pauta. | Resumen de seleccionadas y enlace para revisarlas. | Hacer visible el contenido que se compartirá. |
| 43 | Lista de implementación solo para leer. | Tres puntos revisables con checkbox. | Preparar una decisión, no solo consumir contenido. |
| 44 | Sin señal de avance en la revisión. | Contador y barra con nombre y valor accesibles. | Saber qué queda por revisar. |
| 45 | Completar la lista no tenía una interpretación explícita. | Cierre que recuerda confirmar alcance antes de contratar. | No confundir marcas personales con certificaciones. |
| 46 | No se podían agregar necesidades propias. | Nota opcional limitada a 600 caracteres. | Incorporar el contexto real del lector. |
| 47 | Sin ayuda para dimensionar esa nota. | Ejemplo práctico, etiqueta y contador de caracteres. | Evitar un campo ambiguo o demasiado largo. |
| 48 | Copia de tres instrucciones y una URL. | Pauta completa con revisión, notas, prioridades, encaje y fuentes. | Compartir contexto sin reconstruirlo a mano. |
| 49 | No existía descarga de la pauta. | Archivo Markdown local con nombre específico de competidor. | Guardar un entregable editable y reconocible. |
| 50 | No se podía revisar el resultado antes de compartirlo. | Vista previa de la pauta completa. | Verificar exactamente qué se copiará o descargará. |
| 51 | Sin explicación sobre persistencia de una pauta. | Aviso de datos temporales, descarga y no incluir credenciales. | Evitar expectativas falsas o datos innecesarios. |
| 52 | No había borrado controlado del trabajo del lector. | Confirmación antes de limpiar revisión y notas. | Evitar pérdidas accidentales. |
| 53 | Sin cancelación del borrado. | «Conservar notas»; se explicita que prioridades no se borran. | Recuperación y alcance claros. |
| 54 | No existía estado compartido entre prioridades y pauta. | Estado asociado a la ficha y reiniciado al cambiar de competidor. | No llevar notas o prioridades a la empresa equivocada. |
| 55 | Las FAQ se abrían una por una. | Acción para mostrar las cuatro respuestas. | Permitir lectura completa a quien la prefiera. |
| 56 | Para cerrar las FAQ había que hacerlo individualmente. | Cierre conjunto sin eliminar respuestas del HTML. | Recuperar una vista breve. |
| 57 | Preguntas sin identificación estable. | Numeración e IDs propios, con offset para el navbar. | Orientarse y enlazar partes concretas. |
| 58 | Después de las FAQ no había regreso directo al resumen. | «Volver al resumen». | Facilitar volver a decidir tras aclarar dudas. |
| 59 | Las respuestas no tenían salida contextual a la evidencia. | Enlace a fuentes y alcance desde cada respuesta. | Relacionar respuestas con el criterio editorial. |
| 60 | Alternativas relacionadas como nombres sueltos. | Filas amplias con nombre, diferencia principal y enlace. | Elegir la próxima lectura por relevancia, no solo por marca. |

## Diferencias específicas por competidor

| Marca | La decisión que estructura su ficha |
|---|---|
| Emisso | Comprar acceso a datos para construir versus definir un proceso que se opere. |
| Tupana | Emisión/cobranza versus convertir compras en insumos y costos comparables. |
| Wasabil | Conservar canales de venta y ordenar el circuito de compras. |
| Nubox | Mantener contabilidad y dar a operaciones el detalle que necesita. |
| Defontana | Cambiar ERP versus automatizar el trabajo que quedó alrededor. |
| Chipax | Caja y pagos versus qué se compró, recibió y costó. |
| KAME | Revisar lo que el ERP ya cubre antes de automatizar digitación o equivalencias. No se afirma que carezca de recepción. |
| Bsale | Mantener caja y canales; separar presentaciones de compra y unidades de venta. |
| Clay | Cierre contable versus detalle para explicar cambios en costos. |

## Iteraciones de revisión

1. Auditoría de plantilla, contenidos, interacciones, fuentes y captura del estado inicial. Identificación de redundancia y pérdida de contexto.
2. Nuevo resumen, perspectivas de decisión y lectura de producto. Revisión visual en escritorio y conservación de contratos SEO existentes.
3. Prioridades, evidencia contextual y pauta. Pruebas con teclado, portapapeles y fallos del portapapeles.
4. Revisión móvil: selector compacto en lugar de siete botones, margen y cierre de diálogos, ancho natural de capturas. Verificación de las nueve imágenes.
5. Revisión crítica del recorrido: prioridades integradas con pauta; borrado con alcance explícito; prueba de cambio de competidor y regresión completa.

## Evidencia de QA

- `npm test`: **398 tests, 46 archivos, todos aprobados**. Incluye 18 pruebas nuevas y parametrizadas de la experiencia final; 37 pruebas en total específicas de comparativas junto con las dos suites anteriores.
- `npm run build`: producción y SSR; **1116 rutas** prerenderizadas, 1000 fichas de proveedores verificadas, 1079 rutas con control editorial y 4325 activos textuales sin documentos internos públicos.
- ESLint de los siete archivos nuevos/modificados de implementación y pruebas: aprobado. No se atribuye este resultado al lint completo de todo el repositorio.
- `git diff --check`: aprobado.
- Validación SEO/AEO final: **54.629 comprobaciones en 1116 rutas**, aprobadas. Discovery: **4496 comprobaciones**, aprobadas. Estos resultados comprueban implementación técnica, no garantizan rankings ni conversiones.
- Guardas de tracking: 31 llamadas existentes conservan nombres, argumentos y orden. No se cambió RegistrationForm, Calendly, Slack, Supabase, UTMs ni eventos.
- 27 combinaciones de ruta/viewport: nueve fichas a **360, 768 y 1440 px**. Sin overflow horizontal, un H1, seis tareas y ningún anchor interno sin destino.
- Nueve capturas ampliadas en navegador a 360 px: todas cargadas; ancho natural 1015 px en compras y 850 px en recepción; paneo disponible sin desbordar la página.
- Interacciones reales verificadas: selector móvil KAME, bookmark, fuente contextual, Escape, pauta con nota de QA, checkbox, copia al portapapeles, descarga, abrir/cerrar las cuatro FAQ.
- Revisión final tras integrar el estado: «Detalle de la compra» marcado en la tabla aparece como prioridad en la pauta copiada; al recargar se limpian prioridades y notas como se informa en pantalla.
- Descarga real revisada: `/Users/camilosilva/Downloads/ruka-vs-tupana-mi-pauta.md`. Es un archivo de QA con una nota ficticia; no es un documento interno publicado.
- HTTP del HTML servido por el preview local: nueve rutas, todas 200, title/description/canonical/og:url específicos, seis tareas, cuatro FAQ y contenido real antes de ejecutar React.
- Se consultó `/comparar/<slug>/index.html` en el preview de Vite para inspeccionar el archivo producido; ese servidor no reproduce las reglas de routing de Vercel. Las rutas limpias se verificaron en el dev server. **No se hizo QA de una nueva publicación en producción porque no se publicó.**
- 30 URLs oficiales de competidores: HTTP 200 y títulos correspondientes, sin redirecciones a otro destino durante la comprobación. Esto verifica disponibilidad; no equivale a una prueba funcional de los productos.
- Evidencia visual y logs locales: `/tmp/ruka-comparisons-final.aqxmpH/`. Incluye capturas por marca y ancho, capturas ampliadas, build, tests y validadores. Este directorio no forma parte de `public` ni de la publicación.

Advertencias existentes del proyecto: bases de compatibilidad de navegador desactualizadas, avisos de React Router/SSR en tests y chunks generales grandes en el build. No se ocultaron ni se resolvieron alterando componentes ajenos a esta entrega. No se afirma haber ejecutado una auditoría Lighthouse ni probado con lectores de pantalla reales.

## SEO y credibilidad

Se conservaron las URLs, titles, descriptions, canonicals, `og:url`, Article, autor Camilo Silva y FAQPage. Los datos de competidores no se reescribieron para favorecer a Ruka y no se cambió la fecha de revisión factual solo por un cambio de diseño. Las respuestas y los alcances siguen en el HTML inicial, aunque una perspectiva o respuesta esté cerrada visualmente.

Las nuevas perspectivas son criterios de compra: no anuncian integraciones ya disponibles ni capacidades ausentes en otros productos. Se conserva la declaración editorial de que esta es una comparación de Ruka basada en fuentes oficiales, no una prueba independiente del servicio.

No se añadieron estrellas, aggregateRating, porcentajes de ahorro, rankings, precios de competidores ni resultados de clientes inventados. No se crearon nuevas páginas de texto plano como destino comercial. La descarga Markdown es una acción explícita y local del lector para guardar su pauta.

La revisión de fuentes queda registrada explícitamente en `config/editorial-source-lock.json`, ahora con 68 archivos revisados. El build no actualiza ni aprueba ese registro automáticamente.

## Cómo revisarlo

1. Abre `http://127.0.0.1:8094/comparar/ruka-vs-tupana`.
2. Mira el resumen y cambia entre «Automatizar con Ruka», «Evaluar Tupana» y «Conservar y conectar».
3. En «Tarea por tarea», marca dos prioridades y activa «Mis prioridades».
4. Abre «Ver respaldo». Revisa la fuente sin salir del contexto y cierra con Escape.
5. En «Mi pauta», marca un punto y escribe una nota ficticia. Copia la lista: debe incluir también tus prioridades y sus fuentes.
6. Descarga la pauta o revísala antes de compartir. Comprueba la confirmación y cancelación de «Limpiar revisión y notas».
7. Abre todas las FAQ y vuelve a cerrarlas.
8. Repite en móvil. El selector de tareas debe ser compacto, no debe existir scroll horizontal en la página y la captura ampliada sí debe poder recorrerse horizontalmente.
9. Revisa también `ruka-vs-emisso`, `ruka-vs-kame` y `ruka-vs-chipax`: el argumento y el recorrido de inspección cambian de verdad.

## Pendiente deliberado

Tu revisión visual y comercial. El goal termina con implementación local validada, no con publicación. No se abrió PR ni se hizo commit, push o merge.
