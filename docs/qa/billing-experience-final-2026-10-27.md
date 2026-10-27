# Facturación electrónica: revisión final de experiencia

Fecha: 27 de octubre de 2026. Estado: implementado y probado en local, sin commit, push ni publicación.

Ruta: `/productos/facturacion-electronica`.

Revisión local: <http://127.0.0.1:8094/productos/facturacion-electronica>.

## Criterio de diseño

La página anterior explicaba una secuencia de configuración, pero hacía difícil reconocer la amplitud del facturador. Tenía una cabecera separada en dos bloques de texto, una captura pequeña enterrada en el recorrido y varias listas con el mismo ritmo.

El nuevo recorrido responde, en orden, a estas preguntas:

1. ¿Qué hace RukaFactura por mi operación?
2. ¿Qué documentos contempla para mi trabajo?
3. ¿Cómo preparo, emito y reviso el resultado?
4. ¿Qué puedo hacer después con esa información?
5. ¿Qué necesito identificar para empezar?

Dirección: práctica, inteligente y tranquilizadora; conservar marca Ruka, tema claro, tipografía existente y acento índigo. Composición 7/10, movimiento 3/10 y densidad 4/10. Las skills impeccable, design-taste-frontend y emil-design-eng guiaron jerarquía, reducción de repetición, responsive, foco, controles y estados de error. No se añadió una estética ajena ni un framework nuevo.

Las capturas siguen siendo las reales disponibles de la demo sintética. No se inventaron interfaces, clientes, métricas ni documentos emitidos. En lugar de generar imágenes de un producto ficticio, se mejoró cómo se muestran y amplían las existentes.

## 58 mejoras concretas

No son 58 animaciones ni una promesa de incremento de conversión. Son cambios verificables frente a la versión anterior, agrupados por la tarea que resuelven.

| # | Before | After | Why |
|---|---|---|---|
| 1 | H1 genérico sobre la venta | H1 explícito de facturación electrónica | Reconocer inmediatamente el producto. |
| 2 | Párrafo largo en el hero | Propuesta de 16 palabras | Entender la oferta antes de recorrer la página. |
| 3 | Headline y CTA en columnas de texto separadas | Mensaje y acciones en el mismo bloque | Unir intención con siguiente paso. |
| 4 | Captura escondida a mitad de página | Revisión de importes visible en el hero | Mostrar producto desde el comienzo. |
| 5 | “Todo a” y “mano” podían quedar separados | Dos unidades de lectura en escritorio | Evitar un corte tipográfico pobre. |
| 6 | Secuencia técnica como primera navegación | CTA secundario a documentos | Comenzar por lo que necesita el visitante. |
| 7 | Sin índice de temas de la página | Navegación a documentos, flujo, gestión y preparación | Recorrerla sin leerla linealmente. |
| 8 | Acceso de cliente después del proceso | “Ya tengo cuenta” junto al índice | Evitar que un cliente atraviese la venta de nuevo. |
| 9 | Tipos de DTE dentro de una respuesta extensa | Explorador por tarea | Hacer visible el alcance sin una matriz interminable. |
| 10 | Facturas y boletas poco diferenciadas | Panel Vender | Explicar el trabajo comercial habitual. |
| 11 | Guías mencionadas en una lista | Panel Despachar | Separar traslado, recepción y facturación. |
| 12 | Notas de ajuste sólo nombradas | Panel Corregir | Explicar la referencia al documento original. |
| 13 | Flujos especializados mezclados con los comunes | Panel Otros documentos | Mostrar amplitud sin prometer habilitación universal. |
| 14 | Tipos sin contexto de entrada | “Lo que preparas” por operación | Ayudar a identificar los datos necesarios. |
| 15 | Tipos sin un resultado claro | “Lo que queda disponible” por operación | Conectar la función con el trabajo posterior. |
| 16 | Condiciones generales alejadas del documento | Límite específico en cada panel | Evitar confundir guía con recepción o ajuste con edición de PDF. |
| 17 | Sin selector accesible de operaciones | Tabs con flechas, Home/End y selección semántica | Operar sin ratón. |
| 18 | Sin composición móvil de ese selector | Cuatro opciones en una cuadrícula 2×2 | Evitar pestañas escondidas fuera de pantalla. |
| 19 | Potencial corte del rótulo largo en móvil | Padding y texto adaptados desde 320 px | Mantener “Otros documentos” completo. |
| 20 | El visitante debía encontrar el próximo bloque | Enlace directo desde documentos a preparación | Dar continuidad útil al recorrido. |
| 21 | Empresa/Borrador/Emisión/Respaldo como sustantivos | Configura/Prepara/Emite/Encuentra | Nombrar acciones reconocibles. |
| 22 | Cuatro pasos verticales de gran longitud | Recorrido compacto en dos columnas en escritorio | Comparar preparación y resultado sin exceso de scroll. |
| 23 | Los estados sólo estaban en párrafos | Guía interactiva de cuatro estados | Explicar qué cambia después de emitir. |
| 24 | Borrador sin acción diferenciada | Revisión previa y no envío al SII | Separar preparación de ejecución. |
| 25 | Enviado podía parecer trabajo terminado | Consulta de estado y respuesta pendiente | Evitar confundir envío con aceptación. |
| 26 | Aceptado sin siguiente paso explícito | Recuperación de respaldos | Hacer útil el estado sin equipararlo a pago. |
| 27 | Rechazo como advertencia general | Diagnóstico antes de repetir | Hacer concreta la respuesta a una excepción. |
| 28 | Sin identificación de la naturaleza del ejemplo | Guía de estados marcada como explicativa | No simular una consulta real al SII. |
| 29 | Estado y acción dispersos | Siguiente acción junto a cada estado | Reducir interpretación del visitante. |
| 30 | “Después de emitir” tratado como un bloque secundario | Sección dedicada al trabajo posterior | Mostrar más valor que la emisión aislada. |
| 31 | Búsqueda de documentos poco visible | Beneficio específico por receptor o folio | Mostrar cómo se recupera una factura. |
| 32 | Lotes relegados al FAQ | Beneficio visible de preparar varias y revisar cada resultado | Mostrar eficiencia sin prometer aceptación total. |
| 33 | Contexto multiempresa disperso | Explicación de empresa activa y permisos | Aclarar separación entre emisores. |
| 34 | Libro de compras como imagen al final de una lista | Captura junto al trabajo de revisar el período | Dar contexto al visual. |
| 35 | Módulos contables agrupados en prosa | Cartolas, honorarios y F29 claramente diferenciados | Hacer comprensible su alcance. |
| 36 | Preparación contable sin un siguiente paso cercano | Guía de cierre junto al libro | Continuar desde la función hacia una ayuda concreta. |
| 37 | Sólo un párrafo de requisitos | Pauta personal de cuatro puntos | Convertir información en preparación útil. |
| 38 | Sin acción sobre esa pauta | Casillas independientes con área de clic amplia | Permitir revisar lo que ya se tiene. |
| 39 | Sin feedback de preparación | Conteo accesible de puntos identificados | Mostrar avance sin fingir certificación. |
| 40 | Sin manera de volver al inicio | Reiniciar con estado inactivo cuando no hay nada que borrar | Control claro y reversible. |
| 41 | Sin material que llevar al equipo | Descarga explícita de la pauta con la selección real | Continuar fuera de la página sin enviar datos. |
| 42 | Sin recuperación ante un bloqueo de descarga | Texto seleccionable y mensaje contextual | Evitar un control que falla silenciosamente. |
| 43 | Sin indicación sobre persistencia de la selección | Aviso de selección local, no guardada ni enviada | Explicar lo que ocurre con los datos. |
| 44 | Requisitos podían sugerir envío de credenciales | Indicación de no compartir contraseñas ni certificados por correo | Preparar una conversación sin solicitar secretos. |
| 45 | Emisión y registro separados por una pregunta lateral | Contraste “Tu empresa emite / Tu proveedor emite” | Resolver una confusión comercial central. |
| 46 | API como otro bloque con igual protagonismo | Enlace contextual, con límite explícito de API de compras | Orientar a técnicos sin vender una API de emisión inexistente en el contrato público. |
| 47 | Siete FAQs | Nueve, incluyendo acceso y respaldos | Resolver dudas prácticas de clientes y prospectos. |
| 48 | Respuesta “No asumas…” | Explicación directa de habilitación por alcance | Mantener el límite con un tono más humano. |
| 49 | CTA final amplio y genérico | Conversación sobre documentos y gestión actuales | Explicar qué se revisará en la llamada. |
| 50 | CTA final invertía a un bloque oscuro | Cierre dentro de la misma familia visual clara | Mantener continuidad con el resto de Ruka. |
| 51 | Capturas abrían otra pestaña | Ventana dentro de la página | No perder el lugar del recorrido. |
| 52 | Una única escala de captura | Modo Ver completa | Ver el contexto completo primero. |
| 53 | Texto diminuto en pantallas estrechas | Modo Leer detalle | Leer a una escala útil sin deformar la imagen. |
| 54 | Recorte horizontal sin explicación | Área desplazable, instrucción y navegación por teclado | Hacer entendible el zoom en móvil. |
| 55 | Sin gestión local del foco al ampliar | Modal con cierre, Escape y retorno al disparador | Conservar orientación y accesibilidad. |
| 56 | Alturas y anchuras no adaptadas al nuevo modal | Ventana limitada al viewport y scroll contenido | Evitar salir de una pantalla pequeña. |
| 57 | Imagen principal sin prioridad explícita | Eager/high en hero y lazy en libro, con dimensiones reservadas | Priorizar lo visible sin cargar ambos antes de tiempo. |
| 58 | El flujo no tenía respuesta visual a selección | Selecciones de alto contraste y cambios de color de 150 ms | Feedback rápido, sin movimiento ornamental y con reduced motion. |

## SEO y base técnica

- URL y canonical preservados: `https://www.ruka.ai/productos/facturacion-electronica`.
- Title preservado: `Facturación electrónica y gestión contable en Chile | Ruka`.
- Description preservada: `Prepara y emite facturas con RukaFactura. Revisa importes, consulta documentos y reúne compras y ventas para contabilidad, según la habilitación de tu empresa.`
- H1 ahora nombra la intención de búsqueda explícitamente y sigue siendo único.
- Categoría del Service precisa: facturación electrónica y gestión contable, en lugar de una categoría genérica de agentes IA.
- Nueve preguntas y respuestas tanto en HTML como en FAQPage.
- Los ocho paneles de documentos y estados están presentes en el HTML inicial. Los inactivos tienen `hidden` y no entran al recorrido accesible hasta seleccionarlos. Se preserva el contenido para extracción sin depender de una llamada de datos en el cliente.
- Se conservan los anchors `como-funciona` y `facturacion-paso-1` a `facturacion-paso-4`.
- No se añade un precio especial, oferta estructurada, rating, plazo de habilitación ni garantía de aceptación del SII.
- Fecha editorial y fecha de modificación actualizadas al cambio real. Hashes de contenido revisados explícitamente; ningún proceso de build se autoaprueba.
- Componentes separados para documentos, estados, pauta y capturas. Radix y Lucide ya estaban instalados; sin dependencias nuevas.
- El chunk de la ruta mide 36,96 kB, 10,44 kB gzip. Esto no es el peso completo de la visita: hay dependencias y recursos compartidos.

## Revisión de alcance y fuentes

Se reutiliza el alcance de `billingContent.ts`, revisado previamente contra el producto y fijado por el repositorio a `billerProduction: 4505fa7009cfdc3bc306ed8ee67a8e7aea0353cf`. En esta tarea no se reaudita el motor del biller, no se ingresa a cuentas de clientes y no se emite ningún DTE. Las nuevas explicaciones reorganizan las capacidades ya declaradas; no presentan orientación tributaria personalizada ni una autorización para emitir.

Se mantienen límites: habilitación por empresa/documento, envío distinto de aceptación, aceptación distinta de pago, borrador F29 distinto de declaración, cartola importada distinta de conexión bancaria universal y API de compras distinta de API de emisión.

Los datos de las capturas son ficticios y se identifican como tales. No hay reportes internos, logs ni fichas de QA enlazados públicamente. La pauta descargable es un material para el visitante, no un reporte interno ni una ruta pública TXT.

## Iteraciones realizadas

1. Auditoría visual de la versión anterior y lectura de contenido, imágenes y contratos.
2. Recomposición del hero y sustitución de listas repetidas por documentos, estados y preparación.
3. Revisión de legibilidad: corte del H1 en escritorio y paneles ocultos semánticamente, no sólo por CSS.
4. Revisión móvil: rótulo largo de pestañas, captura ampliada, zoom opcional y límites de altura del modal.
5. Pruebas de errores: descarga bloqueada, recuperación por texto, reinicio y selección no persistida.
6. Build/SEO: actualización de la expectativa del H1 del validador, sin eliminar la validación; nueva ejecución satisfactoria.

## QA ejecutado

| Comprobación | Resultado |
|---|---|
| Tests específicos de facturación | 17 aprobados en dos archivos |
| Suite completa | 448 tests aprobados, 48 archivos |
| Production build | Aprobado, 1.116 rutas prerenderizadas |
| SEO/AEO | 54.633 verificaciones aprobadas |
| Discovery | 4.496 comprobaciones aprobadas |
| Tracking existente | 31 llamadas conservan nombres, argumentos y orden |
| ESLint de archivos de esta tarea | Aprobado |
| `git diff --check` | Aprobado |
| HTML servido local | HTTP 200, H1, title, description, canonical, og:url y seis tipos de schema propios |
| Responsive | 320, 360, 390, 768 y 1.440 px revisados; sin desbordamiento horizontal observado |
| Documentos | Cuatro categorías probadas en móvil y escritorio |
| Estados | Cuatro estados probados en móvil; selección también verificada en escritorio |
| Teclado | Flecha derecha cambia categoría y foco en navegador; Home/End y Escape cubiertos por tests |
| Capturas | Ambas cargan; ampliar, modo detalle y cerrar revisados en navegador |
| Download | Archivo real descargado y leído: conserva Empresa y Certificado marcados, otros dos sin marcar |
| FAQ | Tres respuestas de alcance abiertas en navegador; las nueve presentes y verificadas en HTML |
| Anchors locales | Todos los destinos encontrados en el DOM |

### Límites del QA

- El typecheck global sigue señalando ocho diagnósticos previos en seis archivos ajenos a esta tarea: `comparisonFinalExperience.test.tsx`, `reconciliationExample.test.tsx`, `resourcesInteraction.test.tsx`, `VolumeSelector.tsx`, `OneContact.tsx` y `reconciliationCsv.ts`. No hay diagnósticos nuevos en los archivos de facturación. No se afirma que todo el repositorio esté limpio de TypeScript.
- No se ejecutó Lighthouse ni se midieron Core Web Vitals de campo. El navegador disponible no expone esa capacidad. No se atribuye una puntuación inventada de rendimiento o accesibilidad.
- Reduced motion se cubre con ausencia de animaciones automáticas y clases CSS específicas; no se cambió la preferencia del sistema operativo.
- No se envió ningún formulario, no se reservó una cita ni se probó emisión real en el SII. Son flujos externos que este rediseño no modifica.
- Esta revisión es local. Producción conserva su versión anterior hasta que se autorice la publicación.

## Evidencias privadas

Directorio local: `/tmp/ruka-billing-final.DuSJnY/`.

- `hero-desktop.png`, `hero-320.png`, `hero-768.png`.
- `documents-desktop.png`, `mobile-documents.json`, `desktop-documents.json`.
- `mobile-states.png`, `mobile-states.json`, `states-desktop.png`.
- `management-desktop.png`, `mobile-book-detail.png`.
- `mobile-preparation.png`, `faq-desktop.png`, `responsive.json`.
- `server-html.json`, `build.log`, `tests.log`, `seo.log`, `discovery.log`, `tracking.log`, `types.log`, `lint.log`.
- Descarga de QA: `/Users/camilosilva/Downloads/ruka-preparar-facturacion.txt` (pauta personal sin datos sensibles).

## Cómo revisarlo

1. Abre <http://127.0.0.1:8094/productos/facturacion-electronica>.
2. Mira el primer bloque y pulsa **Ampliar**. Alterna **Ver completa** y **Leer detalle**. Cierra con Escape.
3. Pulsa **Explorar documentos** y recorre las cuatro opciones. Cada una debe cambiar el contenido, no sólo el título.
4. Baja a **El estado cambia lo que haces después**. Revisa Borrador, Enviado, Aceptado y Rechazado.
5. En gestión, amplía el libro de compras y revisa la lectura del detalle.
6. En **Mi preparación**, marca dos casillas, descarga la pauta y comprueba las marcas. Pulsa Reiniciar.
7. Abre las preguntas sobre documentos, F29 y plan actual. No deben prometer emisión universal ni declaración automática.
8. Repite en móvil. Las pestañas deben verse completas, el modal no debe ensanchar la página y los botones deben poder tocarse sin precisión milimétrica.

No se modificaron formulario, tracking, Calendly, backend, navbar global, precios ni los trabajos locales previos de herramientas, proveedores, comparadores y desarrolladores.
