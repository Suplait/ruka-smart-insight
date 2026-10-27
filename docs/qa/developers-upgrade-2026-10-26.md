# /desarrolladores — rediseño y verificación local

> Autorización posterior: el usuario pidió «deployea todo e2e lo que falte deployear». Se autoriza publicar conjuntamente estas iteraciones tras el QA. Las menciones a entrega local y aprobación pendiente que siguen son el registro histórico previo a esa autorización.

Fecha: 26 de octubre de 2026.

## Objetivo y estado

Convertir la página de API en una entrada útil para evaluar y empezar una integración: propuesta de valor concreta, operaciones explorables, ejemplos fieles al contrato, requisitos de acceso y recuperación ante errores. Mantener identidad Ruka, rutas, SEO y funnel.

Implementación y QA local terminados. Pendiente: revisión visual del usuario y eventual autorización de publicación. **Sin commit, push, PR, merge ni despliegue de esta iteración.**

Se intentó crear el goal solicitado. El gestor lo rechazó porque ya existe un goal inconcluso de comparativas en este hilo. No se cerró ni pausó ese goal de forma artificial. Este documento registra por separado el objetivo, alcance y evidencias de desarrolladores.

## Criterio de diseño

Se aplicaron `impeccable`, `design-taste-frontend` y `emil-design-eng`: auditoría primero, jerarquía editorial con identidad Ruka, controles accesibles, interacción inmediata y verificación en navegador. Variación 6, movimiento 3, densidad 5. No se añadieron dependencias, ilustraciones decorativas ni animaciones que retrasen la lectura del código.

| Antes | Después | Por qué |
|---|---|---|
| Encabezado genérico y documentación distribuida entre enlaces | Propuesta breve junto a una primera petición copiable | Entender para qué sirve y cómo empezar en la primera pantalla |
| Tres tarjetas similares y capacidades repetidas | Tres tareas: dashboard, ERP y eventos, cada una con resultado, alcance y guía | Elegir por el trabajo que se quiere resolver |
| Referencia externa sin exploración local | Diez operaciones con ejemplos cURL/Node.js, parámetros y variantes de respuesta | Evaluar la API sin pedir credenciales ni salir constantemente de la página |
| Primera iteración del explorador demasiado larga | Vistas separadas de Petición, Parámetros y Respuestas | Reducir el desplazamiento y mantener una sola tarea visible |
| Advertencias dispersas | Paginación por página frente a cursor, documentos, precisión y recuperación | Evitar errores concretos de integración |
| Webhooks tratados como una capacidad genérica | Verificar → persistir → procesar y reconciliar | Explicar cómo aprovecharlos sin prometer entregas únicas u ordenadas |
| Sin FAQ propia | Seis respuestas visibles mediante accordion y presentes en el HTML inicial | Resolver dudas de acceso, alcance y seguridad; schema consistente |
| Nombres largos recortaban “Copiar código” a 320 px | Encabezado del bloque de código con wrapping y salto seguro | Conservar el botón completo y accesible en mobile |

## Fuentes y límites del contenido

- Catálogo revisado: `config/api-public-catalog.json`, el mismo que genera `public/api/openapi.json`. No se modificó el contrato.
- Guías existentes: `src/content/apiGuides.json`, revisadas completas, incluidas firma HMAC, deduplicación y reconciliación.
- Referencia pública `https://api.rukafactura.cl/api_docs`: HTTP 200; se verificaron sus diez IDs de operación y los anchors `webhooks-guide` y `errores` contra el HTML entregado.
- Ejemplos de petición generados a partir del catálogo, con parámetros obligatorios y valores de ejemplo. PATCH incluye un cambio explícito de eventos. DELETE no intenta interpretar JSON en HTTP 204.
- JSON, XML y representación abreviada de PDF se muestran como variantes sintéticas del contrato. Elegir una respuesta no se presenta como ejecutar ni modificar la petición.
- No se utilizaron claves, datos de cuentas reales ni endpoints autenticados. No se registraron, modificaron o eliminaron webhooks.
- No se promete sandbox, SDK oficial, escritura automática en ERP ni emisión de DTE mediante estas operaciones.
- No se añadió contenido interno de QA al sitio. Este informe vive en `docs/qa`, fuera de `public` y `dist`.

## Archivos de esta iteración

- `src/pages/Developers.tsx`: nueva estructura, copy, navegación, acceso, casos de uso, contratos, webhooks, errores y FAQ.
- `src/components/resources/ApiExplorer.tsx`: explorador local, sin llamadas de red.
- `src/content/developerExperience.ts`: generador de ejemplos, FAQ y ayudas de errores.
- `src/components/resources/CodeExample.tsx`: solo ajuste del encabezado para no recortar el botón Copiar en pantallas estrechas; comportamiento de copia intacto.
- `src/__tests__/developerExperience.test.tsx`: interacción, copia, errores y ejemplos de diez operaciones.
- `src/__tests__/developerSeo.test.tsx`: HTML inicial, enlaces, FAQ/schema y validación de sintaxis sin ejecutar peticiones.
- `config/editorial-source-lock.json`: hashes de los archivos revisados; no se cambió la política del gate.

Se conservaron los cambios anteriores de herramientas, proveedores y comparativas presentes en la branch `codex/comparison-guides-upgrade`.

## SEO y descubrimiento

- Ruta `/desarrolladores`, H1 y title conservados.
- Description nueva: “API de Ruka para consultar facturas y líneas de compra, integrar tu ERP y recibir webhooks. Explora endpoints, ejemplos cURL y Node.js, permisos y paginación.”
- Canonical y og:url: `https://www.ruka.ai/desarrolladores`.
- Seis preguntas y respuestas coherentes entre contenido visible y FAQPage.
- Índice completo de diez endpoints en el HTML inicial, no generado únicamente al interactuar.
- Anchors reales, enlaces a las tres guías y alternativa `<noscript>` para acceder a la referencia.
- Se conserva la salida comercial a `/one` y `/register`; sin gate de registro para consultar contenido o descargar ejemplos.
- No se introdujeron ratings, claims de resultados ni markup de funcionalidades inexistentes. Los validadores técnicos no garantizan posiciones ni citaciones futuras.

## QA ejecutado

| Comprobación | Resultado |
|---|---|
| `npm run build` final | OK; 1.116 rutas prerenderizadas |
| `npm test -- --silent` final | 336 pruebas, 43 archivos, todas pasan |
| Pruebas nuevas de desarrolladores | 16; incluyen sintaxis Node.js y `bash -n` para diez ejemplos, sin ejecutar requests |
| ESLint de los seis archivos TS/TSX de esta iteración | OK |
| SEO/AEO | 54.629 assertions, 1.116 rutas |
| Discovery | 4.496 checks; 1.110 documentos Markdown |
| Tracking | 31 llamadas existentes conservan nombres, argumentos y orden |
| Public content boundary | 4.325 assets de texto; sin informes internos ni documentos de mantenimiento |
| Typecheck global | Continúa fallando con 14 errores ajenos a esta iteración; cero errores en los archivos de desarrolladores o CodeExample |
| Tamaño del chunk Developers | 64,29 kB sin comprimir / 15,89 kB gzip, carga diferida; sin dependencias nuevas |

Los avisos de Browserslist/baseline y los chunks globales grandes ya existían. No se ampliaron dependencias ni se refactorizó el bundle general para ocultarlos.

### HTML entregado por el servidor local

Comprobación HTTP del artefacto `http://127.0.0.1:8095/desarrolladores/index.html`: 200, sin redirect, title/H1 propios, canonical y og:url correctos, seis FAQs en cuerpo y schema, diez operaciones y CTA a `/one`.

Se comprobó el rewrite existente `/desarrolladores` → `/desarrolladores/index.html` en Vercel. Vite preview no emula los rewrites de Vercel; no se confundió el DOM después de React con la respuesta HTML del servidor, ni se modificó configuración de hosting por esa diferencia.

Las descargas locales responden 200: OpenAPI como `application/json`, los dos ejemplos `.mjs` como `text/javascript`. No se desplegó ni se comprobó esta nueva versión en producción remota.

### Revisión visual y de interacción

- 320 px: diez operaciones sin desborde de página. Se encontró y corrigió el recorte de Copiar; su ancho final queda dentro del bloque. Copia real confirmada mediante su mensaje de estado.
- 390 px: hero, CTA y selector; error 401 legible; bundle de producción local; accordion FAQ operado con Enter.
- 768 px: selector de documento y respuesta XML sin comillas JSON ni desborde de página.
- 1.440 px: cabecera, guías, explorador completo, POST/Node.js, footer y ritmo de toda la página.
- Cambiar de operación restablece petición, lenguaje y respuesta; el estado anterior no se arrastra.
- Parámetros y respuestas cambian mediante controles con `aria-pressed`; la selección móvil usa un `<select>` nativo.
- Fallo de clipboard probado: aparece alternativa de copia manual. El caso exitoso copia exclusivamente el ejemplo elegido.
- Código largo desplazable dentro del bloque, no en toda la página; bloques accesibles por teclado.
- No se añadieron animaciones ni dependencias temporales a los controles; los accordions son nativos.

Capturas privadas de esta sesión: `/tmp/ruka-developers-qa.wddwTi/desktop-full.png`, `mobile-320-copy.png`, `mobile-390-final.png`. Son evidencia local, no assets publicados.

## Cómo revisarlo

1. Abre `http://127.0.0.1:8094/desarrolladores`.
2. Pulsa **Explorar la API**. Elige una operación; alterna cURL/Node.js y copia el ejemplo. No se ejecuta nada.
3. Abre **Parámetros** y **Respuestas**. Cambia entre HTTP 200/401/422; en Documento de compra revisa XML y PDF abreviado. En DELETE debe advertir que el ejemplo modificaría configuración si se ejecutara externamente.
4. Usa **Datos y paginación**, **Webhooks**, **Errores** y **Preguntas frecuentes**. Abre una guía y vuelve.
5. Prueba a 320–390 px: selector visible, botones completos, código con scroll interno y ningún scroll lateral de página.
6. Descarga OpenAPI. **Conocer Ruka One** debe ir a `/one`; **Agendar 30 min**, a `/register`.

No necesitas completar formularios, pegar credenciales ni agendar una reunión para hacer este QA.
