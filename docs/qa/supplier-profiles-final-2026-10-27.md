# Fichas de proveedores — rediseño final

Fecha: 27 de octubre de 2026. Estado: implementado y verificado **localmente, sin commit ni publicación**.

## Resultado y alcance

La plantilla compartida de las 1.000 fichas pasa de una lectura predominantemente registral a una herramienta para identificar una empresa y preparar una compra. Se mantienen la identidad de Ruka y todos los antecedentes aprobados. Las funciones condicionales se muestran únicamente cuando existen sus datos: por ejemplo, búsqueda de actividades para empresas con más de tres actividades, y contacto oficial cuando está publicado.

No son 60 cambios multiplicados artificialmente por 1.000 páginas: son **60 mejoras de la plantilla y sus estados**, enumeradas abajo. No se afirma haber inspeccionado visualmente 1.000 páginas; se verificaron automáticamente las 1.000 y visualmente cuatro casos, cada uno en tres anchos.

Se conservaron los cambios locales anteriores de herramientas. No se modificaron el índice del directorio, los formularios comerciales, el tracking, los precios, las fuentes aprobadas ni el backend. No se consultaron bases privadas ni se agregaron empresas, contactos, logos, reputación o relaciones comerciales inventadas.

## Criterio de diseño

- **Impeccable:** flujo de consulta antes que decoración, separación de hechos y recomendaciones, carga cognitiva, estados vacíos y recuperación.
- **Design Taste Frontend:** auditoría del diseño existente; tipografía, jerarquía, composición y lenguaje visual de Ruka. Una ficha de antecedentes no necesita una fotografía decorativa ni un logo fabricado.
- **Emil Design Engineering:** detalles de interacción, feedback, reversibilidad y transición breve de color. No se añadió movimiento automático a la consulta de información.

La decisión central fue evitar que una ficha básica aparente un perfil comercial rico: una empresa sin contacto publicado sigue siendo útil por su identificación, búsqueda de actividades, antecedentes, comparación local del RUT y exportación.

## 60 mejoras comprobables

| # | Antes | Después | Por qué |
|---|---|---|---|
| 1 | RUT en una tarjeta oscura muy dominante | Identificador tipográfico con acento lateral de Ruka | Comparte jerarquía con el nombre, sin competir con todo el contenido. |
| 2 | Categoría como etiqueta estática | Enlace al rubro del directorio desde la cabecera | Permite continuar una búsqueda por intención. |
| 3 | Tres bloques de metadatos apilados en móvil | Franja compacta de ubicación, fuentes y contacto | Reduce el recorrido hasta la identificación. |
| 4 | Actividad registral extensa como introducción en fichas básicas | Introducción que explica para qué sirve la ficha | Evita confundir actividad tributaria con una oferta comercial. |
| 5 | Enlace de contacto dentro de un bloque secundario | Acceso explícito desde cabecera; texto distinto si falta contacto | Hace visible la tarea sin inventar un canal. |
| 6 | Navegación de secciones horizontal que se perdía al bajar | Índice lateral fijo en desktop | Orientación durante una ficha extensa. |
| 7 | Índice sin ubicación actual | Sección activa con observación de intersección y `aria-current` | Saber dónde se está leyendo. |
| 8 | Índice que consumía espacio o desplazamiento lateral en móvil | Desplegable de secciones con enlaces nativos | Acceso rápido sin desplazar la información principal. |
| 9 | Contacto adelantado en móvil y lateral en desktop | Orden de contenido coherente: identificación, contacto, revisión | El documento debe identificarse antes de actuar. |
| 10 | Razón social dentro de una tabla general | Panel de identificación con razón social y RUT juntos | Facilita comparar el par que identifica al emisor. |
| 11 | Organización, fecha y aliases al mismo nivel de prioridad | Antecedentes secundarios en un desplegable, conservados en HTML | Reduce ruido sin quitar información a personas ni crawlers. |
| 12 | Compartir requería copiar la barra del navegador | Copiar enlace canónico de la ficha | Evita compartir un hash local o una URL de desarrollo. |
| 13 | Sin exportación del expediente público | Descargar ficha CSV sin registro | Permite llevar antecedentes al trabajo real. |
| 14 | Exportación inexistente, sin modelo temporal | Cada dato exportado conserva período o alcance | No transforma un registro de 2024 en un dato actual. |
| 15 | Fuentes disponibles solo en la página | CSV con enlaces y etiquetas de las fuentes | La procedencia acompaña al dato fuera del sitio. |
| 16 | Sin protección de exportación específica | Neutralización de celdas que pueden convertirse en fórmulas | Evita inyección de fórmulas al abrir el CSV. |
| 17 | Sin formato de exportación para planillas | UTF-8 con BOM, separador `;`, comillas y saltos escapados | Conserva tildes, razones sociales y texto multilínea. |
| 18 | Sin estado de descarga | Confirmación con nombre del archivo preparado | Feedback verificable después de actuar. |
| 19 | Sin recuperación de exportación | Mensaje recuperable si no se puede generar el archivo | Ofrece copiar los datos o reintentar, sin falsa confirmación. |
| 20 | Clipboard rechazado: instrucción genérica | Texto exacto en textarea seleccionable | Recuperación directa aun cuando el navegador niega copiar. |
| 21 | Copia no vinculada a cambios de contenido | Confirmación invalidada si cambia el texto o falla la copia | No indicar que una revisión nueva ya fue copiada. |
| 22 | Comparar un RUT solo manualmente | Comparador local contra la ficha | Reduce errores de identificación al registrar compras. |
| 23 | Sin normalización interactiva | RUT con o sin puntos/guion y `k` minúscula | Acepta formatos habituales de documentos. |
| 24 | Sin control del dígito verificador en esta acción | Verificación de sintaxis y checksum antes de comparar | Separa un error de escritura de otra empresa. |
| 25 | Sin respuesta para entrada vacía | Instrucción contextual al intentar comparar vacío | Explica qué falta sin bloquear la página. |
| 26 | Sin estado de RUT incorrecto | Error en texto, estado accesible y ayuda asociada | No depende solamente del color. |
| 27 | Sin resultado de coincidencia | Coincidencia explícita, sin certificar factura ni pago | Ayuda útil sin convertir igualdad en autorización. |
| 28 | Sin salida para un RUT diferente | Explicación y búsqueda opcional en el directorio | Continúa la tarea con la otra identidad. |
| 29 | Sin separación entre escribir y comprobar | Comparación al enviar; el resultado anterior se limpia al editar | Evita errores ruidosos y resultados desactualizados. |
| 30 | Sin limpieza rápida de RUT | Limpiar y devolver foco al campo | Facilita corregir con teclado o móvil. |
| 31 | Contacto presentado como bloque de texto | Área propia con una tarea comercial clara | Distingue al proveedor del servicio de Ruka. |
| 32 | El usuario debía redactar todas las consultas | Borrador copiable con identidad y preguntas de compra | Facilita solicitar condiciones sin enviar mensajes automáticamente. |
| 33 | Destino del canal menos explícito | Dominio visible y aviso de nueva pestaña | Permite reconocer adónde conduce el enlace. |
| 34 | Revisión solo con contador | Barra de progreso accesible junto al contador | Lectura inmediata del avance personal. |
| 35 | Todos los puntos siempre visibles | Filtro «Solo pendientes» | Concentrarse en lo que falta revisar. |
| 36 | Reinicio irreversible | Deshacer el último reinicio | Recupera marcas ante un click accidental. |
| 37 | Revisión quedaba solo en pantalla | Copiar revisión con estado de cada punto | Permite compartir lo revisado y lo pendiente. |
| 38 | Sin archivo de revisión | CSV independiente de revisión personal | Separa antecedentes del proveedor de acciones del usuario. |
| 39 | Sin cierre explícito de checklist | Mensaje al completar, sin certificar ni autorizar pagos | Reconoce el avance sin exagerar su significado. |
| 40 | Actividades solo como lista | Búsqueda por descripción o código | Útil especialmente con 32 actividades. |
| 41 | Sin búsqueda tolerante a tildes | Coincidencia normalizada de acentos | No exigir reproducir el texto del registro exactamente. |
| 42 | Orden fijo de actividades | Orden por código o fecha más reciente | Permite dos formas de consulta distintas. |
| 43 | Sin contexto del filtro | Cantidad de coincidencias respecto del total | Explica cuánto contenido quedó visible. |
| 44 | Sin estado de búsqueda vacía | Mensaje y botón para limpiar actividades | Recuperación sin rehacer la navegación. |
| 45 | Código visualmente confundible con descripción | Código monoespaciado separado de actividad y fecha | Mejora lectura y reconocimiento de campos. |
| 46 | Sin exportación de actividades | CSV de todas las actividades con fecha, nómina y fuente | Lleva la clasificación completa a una planilla. |
| 47 | Acción de desplegar no diferenciaba ocultar | Etiqueta abrir/ocultar sincronizada, incluso después de ordenar | Hace reversible y comprensible la interacción. |
| 48 | Registro anual sin mostrar su rubro completo | Rubro SII además de actividad principal y subrubro | Recupera un antecedente ya aprobado, sin inventar contenido. |
| 49 | Año histórico explicado solo en prosa | Etiqueta de antecedente histórico al lado del título | Evita interpretar ubicación y trabajadores como actuales. |
| 50 | Sin navegación relacionada por región | Enlace al filtro regional con el valor real del índice | Continúa la exploración sin prometer cobertura de despacho. |
| 51 | Continuar por rubro oculto en móvil | Navegación relacionada disponible en todos los tamaños | No penaliza la exploración desde teléfono. |
| 52 | FAQs solo desplegables | Buscar entre preguntas y respuestas de esa ficha | Encuentra datos concretos sin abrir todo. |
| 53 | Sin recuperación para una pregunta no encontrada | Reset y acceso al contacto desde el estado vacío | No deja al lector en un callejón sin salida. |
| 54 | Todas las fuentes en lista indiferenciada | Filtros por identificación, actividad y contacto disponible | Relaciona la fuente con lo que respalda. |
| 55 | Formato/dominio poco visibles | Dominio y tipo de documento separados del título | Anticipa web, PDF o descarga ZIP. |
| 56 | ZIP identificado pero sin orientación | Explicación para descomprimir y buscar por RUT | Evita que el enlace termine en un archivo incomprensible. |
| 57 | Correo de corrección con asunto únicamente | Ficha, RUT y campos de corrección/fuente prellenados | Reduce ida y vuelta sin solicitar documentos privados. |
| 58 | Carga como frase aislada | Estado de carga estable, skeleton estático y `aria-busy` | Comunica espera sin simular datos ni animación innecesaria. |
| 59 | Error de red sin contexto | Explicación explícita y reintento conservando identidad de ruta | No confunde indisponibilidad con información de otra empresa. |
| 60 | Error con una única salida | Volver a buscar otra empresa desde el fallo | Mantiene una ruta útil si la recuperación no resulta. |

## Iteraciones y correcciones tras inspección

1. Auditoría de la plantilla, contratos de datos, fuentes y cuatro tipos de ficha; capturas anteriores guardadas.
2. Reestructuración del encabezado, identificación, contacto y navegación; herramientas locales añadidas.
3. Revisión visual desktop: se separó el comparador de RUT del panel anterior; antes parecían pegados.
4. Revisión móvil: se plegó el índice, se corrigió el salto extraño entre fecha y etiqueta, se compactó la cabecera sin truncar razones sociales.
5. QA de estados: se corrigió el plegado de actividades después de ordenar; se verificaron exportación, checklist reversible, fuentes y preguntas.
6. Build, render server-side de las 1.000 fichas, suite completa y validadores SEO/discovery/conversión.

## Evidencia de QA

Directorio de evidencia local: `/tmp/ruka-supplier-final.7VErn5/`. Estos archivos son temporales de QA, no se publican en el sitio.

| Control | Resultado |
|---|---|
| `npm run build` | PASS; 1.116 rutas prerenderizadas y control de las 1.000 fichas al final del build. |
| `npm test` | PASS; 380 tests, 45 archivos. 25 casos nuevos en `supplierFinalExperience.test.tsx`. |
| Lint de 6 componentes, helper, página y tests afectados | PASS. No se afirma que el lint global histórico esté libre de problemas. |
| `npm run validate:seo` | PASS; 54.629 verificaciones en 1.116 rutas. |
| `npm run validate:discovery` | PASS; 4.496 verificaciones, 1.110 documentos Markdown. |
| `node scripts/validate-resource-conversion.mjs` | PASS; 1.076 páginas con enlaces contextuales, schema y destinos. |
| `npm run test:tracking-contract` | PASS; 31 llamadas conservan nombre, argumentos y orden. |
| Proveedores | 1.000 identidades, canonical, schema, FAQ visible en HTML, fuentes e integridad de datos verificados automáticamente. |
| Public content boundary | PASS; 4.325 activos de texto, sin informes internos ni documentos de mantenimiento. |
| Datos y aprobaciones | `supplier-profiles.json`, `supplier-approvals.json` y `supplier-release.json` sin cambios. |
| Responsive | 4 fichas × 360, 768 y 1440 px. Cero desbordamientos detectados en el contenido. |
| Descarga real | `ruka-99.554.560-8-ficha.csv` descargado desde navegador; inspeccionado el contenido y su período. |
| HTML recibido por HTTP local | 4 respuestas 200 del HTML generado, con título por ficha, H1 completo, canonical y FAQPage antes de ejecutar React. |

El test que renderiza las 1.000 páginas tenía un límite de 5 segundos y lo superó durante la ejecución simultánea de build y tests. Se asignó **15 segundos únicamente a ese test masivo**, sin quitar ninguna comprobación. La ejecución final pasó (aproximadamente 4,7 segundos para ese caso).

En desarrollo se observa el warning de React StrictMode sobre `UNSAFE_componentWillMount` de `SideEffect(NullComponent2)` (dependencia de Helmet). No se migró esa dependencia en este ajuste. No se presenta la consola de desarrollo como libre de advertencias.

Las verificaciones HTTP usan `/proveedores/{slug}/index.html` en el preview estático local porque Vite Preview no reproduce los rewrites del hosting. Las rutas limpias se prueban en el servidor de desarrollo. Esto no es una comprobación de un nuevo despliegue productivo: esta iteración no se ha publicado.

### Fichas visuales

- Agrosuper: resumen comercial y canal oficial disponibles; siete actividades.
- Comercial CCU: sin canal comercial publicado; experiencia completa sin fabricarlo.
- Cencosud Retail: 32 actividades; filtros, orden y plegado.
- Comercial Nathalie Venegas Valdés Empresa Individual de Responsabilidad Limitada: nombre extenso y cero trabajadores informados en 2024; sin convertir cero en dato ausente.

Capturas: `agrosuper-before-desktop.png`, `ccu-before-mobile.png`, `{agrosuper,ccu,cencosud,long-name}-after-{360,768,1440}.png`, `rut-match-mobile.png`, `activities-desktop.png`, `checklist-desktop.png`, `sources-desktop.png`. Métricas: `responsive.json`. Resultados: `build.log`, `tests.log`, `seo.log`, `discovery.log`, `conversion.log`, `tracking.log`, `server-html.json`.

## Integridad, SEO y límites

- Sin cambios en RUT, razón social, fuentes o fechas de revisión de los registros. La consulta histórica sigue siendo histórica.
- No se usan estrellas, ratings, «proveedor recomendado», falsas verificaciones, cuentas bancarias, datos de clientes privados o imágenes inventadas.
- La comparación de RUT es local. No consulta al SII ni envía un documento. La búsqueda posterior es una acción explícita con el RUT en la URL del directorio.
- Los borradores se copian; no se envían mensajes ni correos automáticamente.
- Las actividades y las respuestas de FAQ existen en el HTML inicial aunque sus desplegables estén cerrados. La búsqueda es una ayuda interactiva, no un requisito para leer o indexar el contenido.
- La revisión editorial de los archivos modificados se registró explícitamente en el source lock. El build no actualiza ni aprueba hashes automáticamente.
- No se alteró `dateModified` ni se fingió una nueva investigación de los antecedentes. Tampoco se promete mejor ranking por incorporar más controles.
- Se mantuvo el CTA contextual a registro de compras y conversación con Ruka, separado del contacto del proveedor.

## Cómo revisarlo tú

1. Abre [Agrosuper local](http://127.0.0.1:8094/proveedores/agrosuper). Mira la identificación, copia el RUT y descarga la ficha.
2. En «¿Es el mismo emisor?», escribe `799842408` y compara. Después prueba `99.554.560-8`: debe ofrecer buscar otra empresa, nunca aprobar un pago.
3. Marca un punto de «De la ficha a tu compra», activa «Solo pendientes», reinicia y deshaz el reinicio. Copia o descarga la revisión.
4. Abre [Cencosud local](http://127.0.0.1:8094/proveedores/cencosud-retail-s-a-81201000k). Busca `bebidas`, limpia, ordena por fecha y pliega/despliega las actividades.
5. Abre [CCU local](http://127.0.0.1:8094/proveedores/comercial-ccu-sa-995545608): debe decir claramente que no tiene canal comercial verificado, pero permitir consultar y exportar sus antecedentes.
6. Prueba las preguntas y el filtro de fuentes. La corrección abre tu correo con una plantilla; no la envíes para hacer QA.
7. Repite a 360 px de ancho. El menú de secciones es plegable, el nombre sigue completo y los controles no se salen de pantalla.

La aprobación visual final es tuya. No se hicieron commit, push, PR, merge ni despliegue en esta iteración.
