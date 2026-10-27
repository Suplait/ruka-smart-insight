# /desarrolladores — revisión final de experiencia

Fecha: 27 de octubre de 2026. Estado: implementación local, sin commit ni publicación.

## Decisión de diseño

El visitante técnico necesita resolver tres preguntas: qué puede construir, qué contrato debe usar y cómo evitar errores de integración. La página anterior contenía buena parte de la información, pero la obligaba a leer como una secuencia larga de documentación. La nueva versión organiza el recorrido por decisiones y tareas, con herramientas que funcionan localmente.

Se conserva la identidad de Ruka: fondo claro, tipografía existente, tinta oscura, acento azul, bordes contenidos y movimiento breve. No se agregó un terminal que finja ejecutar peticiones, una sandbox ficticia, una imagen decorativa de código ni métricas inventadas. La referencia es el catálogo público revisado `config/api-public-catalog.json`; no se modifica ese contrato.

Skills aplicadas: impeccable para jerarquía y reducción de carga cognitiva; design-taste-frontend para separar la introducción comercial del espacio técnico y evitar una grilla decorativa de features; emil-design-eng para estados, feedback, controles táctiles y QA iterativo. No era necesario generar imágenes: aquí el componente real es más útil que una captura de código.

## 64 mejoras concretas

La tabla compara contra la versión local anterior de `/desarrolladores`, no contra una versión histórica distante. No se cuentan endpoints nuevos ni pruebas automatizadas como mejoras de producto.

| # | Antes | Después | Por qué |
|---|---|---|---|
| 01 | Hero con texto muy apretado y poco aire superior | Tracking más abierto y separación del navbar | Lectura más tranquila sin cambiar el H1 indexado |
| 02 | Primera petición como bloque aislado | Recorrido Acceso → Petición → Datos | Explica el orden de trabajo |
| 03 | Acceso mezclado con el ejemplo | Paso propio con acceso a la documentación autenticada | No presupone que ya tienes credenciales |
| 04 | Ping junto al resto de instrucciones | Paso que explica qué prueba y qué no prueba un 200 | Evita confundir autenticación con permisos |
| 05 | Siguiente paso implícito | Acción para elegir una operación desde el inicio | Mantiene continuidad |
| 06 | Tres artículos apilados por caso | Selector de dashboard, ERP y cambios | Reduce lectura antes de encontrar el caso propio |
| 07 | Dashboard descrito genéricamente | Recorrido desde compras hasta líneas y modelo de costos | Aterriza el resultado que puede construirse |
| 08 | ERP explicado en una fila | Recorrido revisión → libro/documentos → registro en destino | Distingue extracción de escritura en un ERP |
| 09 | Webhooks mezclados con consultas | Recorrido cambio → firma → receptor/cola | Explica que necesita infraestructura propia |
| 10 | Secuencias escritas como texto corrido | Tres etapas visuales por recorrido | Facilita entender dependencias |
| 11 | Responsabilidad de la integración repartida en párrafos | Bloque «De tu lado» por caso | Separa claramente lo que hace Ruka de lo que implementas tú |
| 12 | Limitaciones lejos de la decisión | Condición importante al lado de cada recorrido | Conserva precisión sin convertir todo en advertencias |
| 13 | CTA genérico al explorador | «Ver esta operación» abre el endpoint correspondiente | El contexto no se pierde al avanzar |
| 14 | Guías al final de artículos largos | Guía contextual junto a la operación sugerida | Permite profundizar cuando corresponde |
| 15 | Diez operaciones sin búsqueda | Búsqueda por nombre, ruta o método | Encuentra rápido un recurso conocido |
| 16 | Búsqueda inexistente | Normalización de mayúsculas y tildes | «clasificacion» encuentra «Clasificación» |
| 17 | Lista plana | Filtro Acceso / Compras / Webhooks | Reduce el conjunto a una tarea concreta |
| 18 | Sin feedback del conjunto | Contador dinámico de operaciones | Hace visible el efecto combinado de filtros |
| 19 | Sin estado vacío | Explicación y «Limpiar filtros» | Evita un explorador aparentemente roto |
| 20 | Sin política de búsqueda/selección | Filtrar no cierra la operación abierta | No descarta una revisión en curso |
| 21 | Selector mobile sin filtros | Selector filtrado que conserva la operación abierta | Mantiene consistencia con escritorio |
| 22 | Selección poco diferenciada | Operación activa en tinta oscura y método alineado | Ubicación visual más inmediata |
| 23 | Método HTTP sin traducción de impacto | «Solo lectura» o «Modifica configuración» | Ayuda a interpretar el riesgo |
| 24 | Permisos en texto secundario disperso | Permiso junto a ruta y descripción | Se revisa antes de copiar la petición |
| 25 | Advertencia de mutación del mismo tono que notas | Tratamiento ámbar y mensaje explícito de baja irreversible | Distingue acciones sensibles sin ejecutarlas |
| 26 | Pestañas se partían en dos filas a 360 px | Tres columnas; contador en segunda línea en móvil | Estabilidad y blancos táctiles claros |
| 27 | OpenAPI solo después de todo el contenido | Descarga adicional a la entrada del explorador | Sirve a quien ya sabe qué importar |
| 28 | Parámetros sin tipo visible | Tipo del catálogo junto al nombre | Reduce ambigüedad al implementar |
| 29 | Ubicación incompleta en opcionales | Query/path/body y obligatoriedad visibles | Evita enviar un campo en el lugar equivocado |
| 30 | Defaults solo en prosa, cuando estaban | Default explícito, incluidos false y 0 | No confunde ausencia con falsedad |
| 31 | Enums escondidos en la referencia | Valores admitidos junto al campo | Reduce ensayo y error |
| 32 | Ejemplo de campo solo dentro del código | Ejemplo individual por parámetro | Facilita leer arrays, objetos y strings |
| 33 | Opcionales en una lista larga | Búsqueda por nombre y descripción del parámetro | Encuentra filtros específicos sin recorrer todo |
| 34 | Sin recuperación de búsqueda de parámetros | Contador, vacío y acción para limpiar | Hace reversible la exploración |
| 35 | Notas del catálogo fuera del detalle local | «Lo importante de esta operación» | Acerca límites reales al código que se está leyendo |
| 36 | Peticiones completamente fijas | Editor local acotado de parámetros GET | Permite adaptar el ejemplo sin pedir una clave |
| 37 | Sin campos editables ni ayudas asociadas | Labels, descripción, inputMode y 16 px en móvil | Mejora comprensión, teclado y evita zoom de Safari |
| 38 | Sin validación local | Campos necesarios vacíos se identifican | No ofrece un ejemplo evidentemente incompleto |
| 39 | Fechas fijas | Validación de fechas existentes y formato | Rechaza fechas imposibles |
| 40 | Rango de reportes explicado solo en prosa | Comprobación de orden y diferencia máxima de 31 días | Ayuda a construir una consulta coherente |
| 41 | Ventana del libro fácil de confundir con reportes | Regla de mes calendario diferenciada, incluso fin de mes/bisiesto | No aplica una regla única a contratos distintos |
| 42 | Valores de paginación fijos | Enteros positivos y límite local de 100 por página | Evita ejemplos fuera del rango recomendado |
| 43 | Folio no editable | Edición como texto, preservando ceros iniciales | Respeta identidad documental |
| 44 | Posibilidad de copiar cualquier texto de ejemplo | Código/descarga no disponibles mientras hay errores locales | Evita exportar un ejemplo conocido como inválido |
| 45 | Sin reinicio del ejemplo | Restablecer valores originales | Recuperación sin recargar toda la página |
| 46 | Cambio de lenguaje con valores fijos | cURL y Node reflejan la misma edición | No obliga a editar dos versiones |
| 47 | Solo copiar código | Archivo .sh o .mjs según operación y lenguaje | Facilita llevar el ejemplo al entorno propio |
| 48 | Sin feedback de descarga | Confirmación y alternativa de copia si falla | Cierra el ciclo de la acción |
| 49 | Respuesta solo como JSON extenso | Lectura de campos del primer registro/objeto | Permite orientarse antes de leer todo el JSON |
| 50 | Tipos inferidos mentalmente | Diferencia texto, número, objeto, array y null | Refuerza precisión decimal y ausencia de datos |
| 51 | Estados HTTP únicamente en el selector | Explicación de éxito, error y 204 sin contenido | Evita intentar parsear JSON vacío |
| 52 | Errores como acordeones separados | Selector HTTP con diagnóstico contextual | Reduce búsqueda cuando se conoce el status |
| 53 | Ayuda de errores sin relación explícita a operaciones | Códigos extraídos del catálogo con enlace al endpoint | Permite comprobar la interpretación |
| 54 | Riesgo de interpretar todos los errores como universales | Aclaración sobre alcance por operación | Mantiene rigor técnico |
| 55 | Webhooks como tres párrafos | Secuencia visible de entrega nueva | Aclara persistir antes de responder |
| 56 | Duplicados descritos solo en prosa | Caso seleccionable «Evento repetido» | Muestra cómo evitar repetir efectos |
| 57 | Firma inválida sin recorrido propio | Caso seleccionable de rechazo | Distingue datos recibidos de datos confiables |
| 58 | Verificación de firma en párrafo largo | Disclosure específico junto al flujo | Mantiene disponible el detalle sin tapar la secuencia |
| 59 | Sin cierre técnico accionable | Pauta personal de ocho verificaciones | Convierte lectura en próximos pasos para un equipo |
| 60 | Sin estado de revisión personal | Contador y barra accesible de puntos marcados | Expone pendientes sin fingir una certificación |
| 61 | Checklist desconectada de documentación | Link a la sección pertinente en cada punto | Reduce la vuelta a buscar respuestas |
| 62 | Sin entregable personal | Copiar y descargar pauta Markdown con selecciones | Permite compartir pendientes fuera de la página |
| 63 | Sin control de estado de pauta | Reset y aviso de estado solo en memoria | No promete guardado ni transmite selecciones |
| 64 | Controles nuevos sin garantías responsive | Foco visible, blancos táctiles y reflujo revisado a 360/768/1440 px | La interacción no depende del mouse ni del ancho desktop |

## Cinco pasadas de revisión

1. **Arquitectura:** lectura de la página, componentes, catálogo y tests existentes; separación de casos de uso, contrato e implementación. Se descartó un ejecutor de API en frontend y cualquier captura de credenciales.
2. **Implementación:** recorridos, búsqueda, editor local, respuestas, errores y pauta. Los ejemplos se generan desde el mismo catálogo; no se escribieron endpoints alternativos.
3. **Rigor funcional:** 34 pruebas nuevas, límites de fechas, fechas imposibles, enteros inseguros, folios con ceros, errores de copia/descarga, no envío de peticiones y rutas/guías correctas.
4. **Revisión visual:** escritorio y teléfono. Se corrigieron pestañas que se envolvían, tamaño de inputs móvil, enlaces demasiado juntos en webhooks y estilo nativo inconsistente de la barra de progreso.
5. **Regresión y salida:** build, prerender, validación SEO/discovery, contrato de tracking y revisión de salida pública. QA/documentos internos continúan fuera de `public`.

## Comprobaciones

- Suite completa: **432 tests, 47 archivos, aprobados**.
- Portal API: **50 tests**, de los cuales **34 son nuevos**.
- ESLint de los archivos API y test nuevo: aprobado.
- Production build: aprobado; **1.116 rutas prerenderizadas**.
- SEO/AEO: **54.629 comprobaciones**; HTML inicial, títulos, canonical, JSON-LD, FAQ, enlaces, robots, sitemap y recursos de descubrimiento.
- Discovery: **4.496 comprobaciones**.
- Tracking: **31 llamadas existentes** preservan nombres, argumentos y orden.
- Catálogo público: mismos diez endpoints, mismos permisos; no se agregaron SDK, sandbox, promesas de disponibilidad o API de emisión.
- Diez operaciones seleccionadas y comprobadas en desktop y mobile. Sin scroll horizontal de página a 360, 768 y 1440 px. El código puede desplazarse dentro de su propio panel.
- Descarga real de `ruka-v1-purchase-lines.mjs`; `node --check` aprobado, **sin ejecutar el script**.
- Descarga real de pauta Markdown, con un punto de QA marcado y siete pendientes; estado posteriormente restablecido.
- El navegador de QA denegó portapapeles: se comprobó el mensaje de recuperación; éxito de copia cubierto por prueba automatizada con API de clipboard controlada. No se afirma que el permiso del navegador se haya concedido.
- No se llamó a la API de producción ni se usó una cuenta de clientes.

### Límites y avisos reales

- `tsc -p tsconfig.app.json --noEmit` no está globalmente verde: hay ocho diagnósticos previos a este ajuste en seis archivos ajenos al portal (tests de comparación/conciliación/recursos, VolumeSelector, OneContact y reconciliationCsv). **Ningún diagnóstico corresponde a los archivos API nuevos/modificados.** No se tocó el funnel para resolverlos.
- Avisos existentes de React Router, Helmet/SSR y tamaño de chunks generales continúan. No se agregó ninguna dependencia.
- No se ejecutó Lighthouse ni se midieron Core Web Vitals de producción en esta tarea; no se reporta una nota inventada.
- La validación del editor es ayuda local para los campos soportados, no validación exhaustiva de negocio, permisos, existencia de identidades ni disponibilidad de una cuenta.
- Los cambios están **solo en local**, conservando los upgrades previos de herramientas, proveedores y comparativas. Sin commit, push, PR, merge ni deploy de este ajuste.

## Cómo revisarlo

Abrir `http://127.0.0.1:8094/desarrolladores`.

1. Arriba, alternar Acceso, Petición y Datos. Ver que cada paso tenga una acción distinta y no pida credenciales.
2. Elegir «Conectar un ERP» y luego «Ver esta operación»: debe abrir **Libro de compras aceptadas**.
3. Buscar `PATCH` y probar las familias. Escribir una búsqueda inexistente y limpiar los filtros.
4. Abrir Líneas de compra → «Ajustar parámetros». Escribir `101` en per_page: aparece el error y no se puede copiar/descargar un ejemplo. Cambiar a `25` y alternar cURL/Node.js.
5. En Parámetros, buscar `reviewed`: leer tipo, valores y default. En Respuestas, cambiar status y abrir «Leer los campos de este ejemplo».
6. Elegir Eliminar webhook: debe advertir que modifica configuración. La respuesta 204 no presenta JSON ficticio.
7. Revisar los tres escenarios de webhook. Luego abrir HTTP 409 o 503 en Errores y comprobar sus enlaces al contrato.
8. Marcar puntos de la pauta, descargarla y comprobar las selecciones. Restablecer para volver a cero.
9. Repetir en móvil: tres pestañas alineadas, campos legibles y ninguna página desplazándose horizontalmente.

Evidencia privada de esta ejecución: `/tmp/ruka-developers-final.nGoLj3/` (logs de build/tests/SEO, capturas y auditorías de tamaños). Los archivos en `/tmp` son temporales; este documento registra el resultado durable.
