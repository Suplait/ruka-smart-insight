# Herramientas Ruka: revisión final de experiencia

Fecha: 27 de octubre de 2026. Rama: `codex/tools-experience-final`.

Alcance: `/recursos` y las cuatro herramientas públicas. Documento privado de trabajo: no pertenece a `public` ni se enlaza desde el sitio.

## Criterio de diseño

Una herramienta tiene que ayudar a tomar una decisión, no parecer una landing que contiene un formulario. Conservamos tipografía, colores y navegación de Ruka. Distinguimos el área editable del resultado; agrupamos los datos por significado y dejamos las opciones secundarias fuera del camino principal en móvil.

Aplicación de skills: **impeccable** para arquitectura, jerarquía y estados de producto; **design-taste-frontend** para el índice y la dirección visual; **emil-design-eng** para feedback, interacción y revisión antes/después. Varianza 6, movimiento 3, densidad 5. Las restricciones de diseño de marketing no se aplicaron literalmente a tablas o formularios reales. No añadimos imágenes decorativas, métricas comerciales inventadas ni animaciones de entrada que retrasen el uso.

## Auditoría inicial

| Antes | Después | Por qué |
|---|---|---|
| Cuatro tarjetas con una estructura muy parecida, sin orientación según la tarea | Selector de intención, recomendación contextual y fichas con requisitos y resultado | Elegir una herramienta no debería requerir abrir las cuatro |
| Inputs verticales y un resultado con fondo lavanda casi al mismo nivel visual | Formato de compra agrupado y resultado separado mediante una cabecera de alto contraste | Hace más clara la relación entre lo editable y lo calculado |
| Los ajustes ocupaban mucha pantalla en teléfono | Opciones de costos desplegables, resumen enlazado y editor de compra conservado | La acción principal debe quedar por delante de las opciones |
| Margen objetivo aislado del precio usado arriba | Aplicación explícita al precio, comparación con la venta actual y deshacer | Cierra el recorrido entre explorar un objetivo y ver su efecto |
| Quince asignaciones de columnas abiertas al cargar un ejemplo CSV | Asignaciones válidas cerradas, errores visibles y vista previa bajo demanda | La complejidad aparece cuando hace falta, no toda de golpe |
| Resultados CSV sin búsqueda ni selección exportable | Búsqueda, filtro de revisión, tamaño de página y descarga de selección | El resultado debe ser trabajable, no solo una lista larga |

## Inventario de 64 mejoras concretas

No contamos cada color, cada breakpoint ni cada ejecución de una prueba como una mejora independiente. Los cambios compartidos se cuentan una sola vez.

| # | Superficie | Antes | Después | Motivo / comprobación |
|---|---|---|---|---|
| 1 | Índice | Solo exploración de tarjetas | Selector «¿Qué necesitas resolver hoy?» | Elegir una intención sin navegar; prueba automatizada |
| 2 | Índice | La descripción no orientaba según la elección | Recomendación contextual por tarea | Explica cuándo usar cada herramienta |
| 3 | Índice | Todas las tarjetas con el mismo énfasis | La recomendada queda destacada sin ocultar las otras | Selección reversible; conserva cuatro enlaces |
| 4 | Índice | Requisitos dentro de un párrafo | Campo visible «Qué necesitas» | Saber si se tienen los datos antes de entrar |
| 5 | Índice | Resultado esperado mezclado con la descripción | Campo visible «Qué te llevas» | Distingue costo, variación, margen y diferencias |
| 6 | Índice | Bloque de ejemplo lateral muy estrecho | Ejemplo al pie con cifra y base separadas | Mejor lectura de unidades y contexto |
| 7 | Índice | Ejemplos podían leerse como prueba comercial | Etiqueta explícita de datos de ejemplo, no cliente | No convertir una demostración en un claim |
| 8 | Índice | Búsqueda literal insuficiente | Sinónimos como kilos, rentabilidad y conciliación | Tres consultas verificadas por prueba |
| 9 | Compartido | Navegación horizontal que escondía destinos en móvil | Cuatro destinos en cuadrícula 2×2 | Todos los destinos visibles a 360 px |
| 10 | Compartido | Estado activo como subrayado pequeño | Destino activo con superficie, contraste y `aria-current` | Orientación visual y accesible |
| 11 | Compartido | Navegación solo textual | Iconos de la familia existente según tarea | Reconocimiento sin reemplazar nombres |
| 12 | Calculadoras | Descripción debajo del título en desktop | Encabezado de dos columnas | Reduce altura antes del área útil |
| 13 | Resultados | Bloques lavanda poco diferenciados | Cabecera oscura y cuerpo blanco | Separa resultado y formulario |
| 14 | Accesibilidad | Lectura de un resultado entero en cada tecla | Anuncio del resultado tras una pausa de 700 ms | No interrumpir cada carácter; no retarda el cálculo visual |
| 15 | FAQ | Mismo heading genérico en todas | Heading vinculado al problema de cada herramienta | Contexto específico sin alterar las respuestas verificadas |
| 16 | FAQ | Sin regreso directo | «Volver al cálculo» con destino propio | Volver desde la lectura al trabajo |
| 17 | Costos | No distinguía claramente editar ejemplo de usar datos propios | Estado «Ejemplo editable» / «Tus datos» | Se actualiza al editar |
| 18 | Costos | Había que borrar cada campo | Acción «Usar mis datos» | Vacía ambas compras sin inventar un resultado cero |
| 19 | Costos | Un vaciado podía perder el trabajo | Recuperar datos anteriores | Restauración de ambas compras probada |
| 20 | Variación | Invertir compras requería reescribirlas | Intercambiar compras | +6,67% pasa correctamente a −6,25%, no −6,67% |
| 21 | Costos | Envases y contenido en filas separadas | Grupo «El formato que compraste» con campos juntos | Expresa la multiplicación necesaria |
| 22 | Costos | Unidad abreviada sin explicación | Opciones «kg · Kilos», «g · Gramos», etc. | Reduce interpretación de abreviaturas |
| 23 | Costos | Total de cantidad sin construcción visible | Multiplicación envases × contenido, incluida conversión ÷1.000 | Explica de dónde sale la unidad normalizada |
| 24 | Costos | «Total» podía confundirse con toda la factura | Ayuda explícita: solo el insumo, todos sus envases | Evita sumar productos distintos |
| 25 | Costos | Blur global validaba varios campos | Validación por campo visitado | No marcar campos que la persona aún no dejó |
| 26 | Costos | Input admitía texto mucho más largo que el contrato numérico | Límite de 24 caracteres alineado con el parser | Evita entradas inútiles; límites matemáticos se conservan |
| 27 | Costos | Error de descuento o IVA podía quedar dentro de un detalle cerrado | Aviso exterior que señala dónde corregir | Prueba con descuento de 101% |
| 28 | Costos | Base tributaria resumida dentro del control | Estado neto/IVA y descuento visible junto a los datos | Saber qué interpretación se está usando |
| 29 | Costos móvil | Herramientas auxiliares empujaban los inputs | «Opciones» desplegable para ajustes y ejemplos | Se mantiene todo el funcionamiento en menos altura inicial |
| 30 | Costo móvil | Había que bajar para ver la primera cifra | Resumen unitario enlazado antes de los campos | Ver el efecto mientras se trabaja |
| 31 | Costos | Vacío con instrucción genérica | Estado vacío con requisitos y regreso a los datos | No mostrar resultados basados en información incompleta |
| 32 | Costos | Solo CSV | Resumen copiable con moneda, unidad y límites | Compartir una cifra sin perder su contexto |
| 33 | Copia | Sin respuesta frente a portapapeles bloqueado | Error recuperable, datos intactos | Prueba de permiso denegado |
| 34 | Copia | Sin confirmación ni relación con nuevas ediciones | «Resultado copiado» solo para el contenido copiado | Editar invalida el feedback anterior |
| 35 | Costos | Descargar no confirmaba preparación | Confirmación visible de CSV preparado | No confundir click con acción sin respuesta |
| 36 | Costos | Descarga habilitable sin resumen válido no existía como concepto | Copia y exportación condicionadas al cálculo válido | Comparaciones incompatibles no se comparten como válidas |
| 37 | Costo | El siguiente paso era principalmente comercial | Criterios de comparabilidad y enlace a comparar otra compra | Ayuda primero a continuar la tarea |
| 38 | Variación | La cifra podía confundirse con recomendación de proveedor | Checklist de calidad, entrega, espacio y merma | Aclara lo que la cuenta no decide |
| 39 | Variación | Sin siguiente paso hacia precio de venta | Enlace contextual a margen | Conecta compra y efecto comercial sin enviar datos |
| 40 | Margen | Resultado no compartible | Copia con ambas bases y precio objetivo | Preserva diferencia entre margen y markup |
| 41 | Margen | Sin exportación propia | CSV con costo, venta, porcentajes, diferencia y objetivo | Mantener respaldo fuera de la pantalla |
| 42 | Margen | Sin estado de fallo de exportación | Fallo recuperable y alternativa de copia | Prueba automatizada; no se borran inputs |
| 43 | Margen | Precio objetivo solo informativo | Aplicar explícitamente a precio de venta | No modifica el costo ni aplica por sorpresa |
| 44 | Margen | Aplicar no existía, tampoco reversión | Deshacer aplicación y volver al precio previo | Precio 10.000 → 12.000 → 10.000 probado |
| 45 | Margen | Objetivo aislado de la venta actual | Diferencia por unidad frente al precio actual | Explica cuánto cambia la venta |
| 46 | Margen | Objetivos enormes podían ser calculables pero fuera del input | No aplicar precios por encima del límite de 10¹² | Impide introducir un precio que el propio cálculo rechazaría |
| 47 | Margen | Objetivo fuera del primer recorrido de navegación | Acceso directo al bloque de precio objetivo | Ancla con espacio para el navbar |
| 48 | Margen | Validación global de costo y venta | Validación por input visitado y reinicio de estado | Errores donde corresponden |
| 49 | Margen | Interpretación solo en texto largo | Checklist operativo y enlace a revisar costo unitario | No confundir margen bruto con utilidad final |
| 50 | CSV | Sin orientación de etapa | Cargar → revisar columnas → resolver diferencias | Progreso basado en estado real, no animación decorativa |
| 51 | CSV | Zona con apariencia de arrastre que no lo soportaba | Drag & drop real con estado visual | Mismo parser y límites que al elegir archivo |
| 52 | CSV | Arrastre múltiple no definido | Rechazo de varios archivos para un documento | No elegir silenciosamente un archivo entre varios |
| 53 | CSV | Borrado conjunto solamente | Quitar un documento específico | Indica exactamente cuál falta |
| 54 | CSV | Borrar/reemplazar podía perder la carga previa | Recuperar la carga anterior en memoria | Incluye recuperación después de quitar un documento |
| 55 | CSV | Todas las asignaciones desplegadas | Asignaciones válidas cerradas con contador | Las pendientes se abren; comprobado en ejemplo |
| 56 | CSV | Solo primera celda por selector | Vista previa tabular de tres filas | Contexto de columna antes de comparar, scroll local accesible |
| 57 | CSV | Mapeo incompleto se descubría al ejecutar | Campos faltantes visibles y comparación deshabilitada | Evita una ejecución que no puede funcionar |
| 58 | CSV | Mapeo repetido se descubría al ejecutar | Duplicación detectada inmediatamente | No usar la misma columna como código y unidad |
| 59 | CSV | Resultado desaparecía al cambiar datos sin explicación | Aviso de resultado desactualizado | Exige comparar de nuevo; no conserva un resultado engañoso |
| 60 | CSV | Lista sin búsqueda | Buscar código, referencia, unidad o motivo | Se combina con el filtro de revisión |
| 61 | CSV | 25 filas fijas | 25, 50 o 100 por página | Reinicia a página 1; prueba con 51 cruces |
| 62 | CSV | Solo exportación completa | Descargar selección filtrada, con límites en cada fila | La exportación completa sigue disponible |
| 63 | CSV | Vacío de filtro sin acción | Recuperación «Mostrar todos los cruces» y exportación vacía bloqueada | No confundir filtro vacío con ausencia de datos |
| 64 | CSV | Diferencias descriptivas sin orientación operativa cercana | Motivos destacados y acciones diferenciadas para cantidad/precio | Conecta operaciones, compras y respaldo; no autoriza pagos |

Adicionales no utilizados para alcanzar el mínimo: confirmación de nombre del CSV descargado; resumen dinámico en el ejemplo guiado; restauración individual de productos del ejemplo; texto de privacidad actualizado para explicar el comportamiento real de la memoria; código de las vistas formateado para mantenimiento; pruebas nuevas y revisión SEO.

## Iteraciones realizadas

1. Auditoría de código y navegador: rutas, cálculos, jerarquía, foco, densidad y flujo CSV.
2. Implementación: selección por tarea, estructura de edición/resultado, acciones de costos/margen y revisión CSV.
3. Crítica visual: se eliminó una fila redundante de controles, se compactaron los encabezados y se redujo la entrada del conciliador.
4. Revisión móvil: opciones secundarias de costos detrás de un control, cuatro destinos visibles y resumen del costo antes de los inputs.
5. Endurecimiento: errores de copia/descarga, columnas repetidas, datos incompletos, inversión del denominador, recuperación y paginación. Se actualizaron selectores de pruebas que dependían de los labels anteriores, sin quitar validaciones matemáticas.

## Contratos preservados

- Los algoritmos de `purchaseCost.ts`, `margin.ts`, `reconciliationCsv.ts` y `reconciliationExample.ts` no se modificaron.
- Sin envío de importes ni archivos a Ruka; sin almacenamiento persistente de estos inputs. La copia ocurre solo tras un click. Los CSV se generan localmente.
- La recuperación conserva una instantánea temporal en memoria. Recargar descarta los datos. No se presenta «borrar» como borrado irrecuperable mientras exista deshacer.
- No se tocó RegistrationForm, tracking, eventos, Calendly, Supabase, Slack, UTMs, pricing ni las rutas de conversión.
- Mismas rutas canónicas, titles, descriptions, FAQs y schema de aplicación. Las respuestas de FAQ siguen en el HTML inicial; los cálculos requieren JavaScript.
- No añadimos testimonios, certificaciones, métricas de ahorro ni conexiones que estas herramientas no tengan.

## QA y evidencia

Verificación terminada en local sobre el código final. Evidencia: `/tmp/ruka-tools-final.Iu8iSb/` (archivos temporales locales, no públicos).

| Comprobación | Resultado |
|---|---|
| Production build | PASS. 1.116 rutas prerenderizadas; validación editorial y límite de contenido público aprobados |
| Vitest, suite completa | 355 pruebas / 44 archivos, todas aprobadas; 19 pruebas nuevas de esta experiencia |
| ESLint de todos los archivos UI/tests modificados | PASS, sin errores ni warnings |
| SEO/AEO del build | 54.629 verificaciones aprobadas |
| Discovery | 4.496 verificaciones aprobadas |
| Conversión contextual | 1.076 páginas verificadas; destinos, HTML y schema conservados |
| Contrato de tracking | 31 llamadas existentes conservan nombres, argumentos y orden |
| Diff | `git diff --check` aprobado; sin cambios en algoritmos, formulario comercial ni integraciones |

### Responsive y uso real

Las cinco rutas se abrieron a **360, 768 y 1440 px**: 15 combinaciones, ancho del documento igual al viewport y cero imágenes cargadas rotas. Se revisaron capturas de las vistas, no solamente el DOM. El recorrido móvil de costo confirmó el resultado bajo el navbar (ancla a 112 px); el foco de teclado mostró un anillo visible. Se detectó un `max-width: 100%` global que cortaba las cabeceras oscuras en móvil: se corrigió localmente en costos y margen, sin alterar CSS global. Cabecera final: 318 px dentro de un panel de 320 px, descontando sus bordes.

Recorridos comprobados en navegador:

- Índice: seleccionar «Comparar dos compras» destaca su ficha sin retirar las otras herramientas.
- Costo móvil: vaciar, recuperar 18.000, saltar al resultado y copiar con confirmación real.
- Variación desktop: intercambiar las compras cambia +6,67% a −6,25%; el denominador es la nueva compra anterior.
- Margen móvil: objetivo 50%, aplicar venta 12.000, deshacer a 10.000 y descargar CSV. Se inspeccionó el archivo descargado: costo 6.000, venta 10.000, margen 40%, markup 66,666…%, objetivo 12.000.
- Conciliador: cargar ejemplo, comparar (2 de 3 cruces por revisar), filtrar, descargar selección de 2 y buscar HAR en móvil. Se inspeccionó el CSV descargado: solo HAR-01 y ACE-02, motivos y límite «no autoriza pagos» conservados.
- Pruebas automatizadas adicionales cubren 51 cruces con cambio de página/tamaño, drag & drop, columnas duplicadas, restauración, resultados desactualizados, campos inválidos y fallos de portapapeles/descarga.

Capturas principales: `recursos-desktop.png`, `costo-unitario-1440.png`, `margen-markup-1440.png`, `costo-resultado-mobile-final.png`, `conciliador-resultado-desktop.png`, `conciliador-resultado-mobile.png`, además de las cinco vistas a 360 y 1440 px.

### HTML inicial y SEO

Se solicitó por HTTP al preview de producción local cada archivo `index.html` que especifica el rewrite existente de Vercel. Todos respondieron 200 con HTML específico, un H1, title y description propios, canonical y og:url `https://www.ruka.ai` + su ruta. No se usó el DOM hidratado para esta verificación.

| Ruta | Texto inicial en root | FAQs en schema y HTML |
|---|---:|---:|
| `/recursos` | 4.577 caracteres | No corresponde |
| `/herramientas/costo-unitario` | 5.032 caracteres | 4 |
| `/herramientas/variacion-costos` | 6.075 caracteres | 4 |
| `/herramientas/margen-markup` | 4.748 caracteres | 4 |
| `/herramientas/conciliar-factura-orden-recepcion` | 7.278 caracteres | 5 |

Las cuatro herramientas conservan `WebApplication`, `FAQPage`, `WebPage`, `BreadcrumbList`, `Organization` y `WebSite`. La última corrección visual/copy se volvió a compilar y probar. Vite Preview no aplica `vercel.json`: pedir una ruta sin el rewrite puede devolver el fallback del home, por lo que se comprobaron expresamente los destinos de los rewrites. Esto no es una validación de un nuevo deploy: **producción no se modificó**.

### Advertencias existentes, no ocultadas

El chequeo global `tsc` conserva errores anteriores en pruebas ajenas (`reconciliationExample`, `resourcesInteraction`), `VolumeSelector`, `OneContact` y el target de `replaceAll` de `reconciliationCsv`. No se tocaron esas áreas para ocultarlos; el build y lint relevante pasan. `npm install --ignore-scripts` no modificó el lockfile y reportó 28 vulnerabilidades existentes del árbol de dependencias; no se ejecutó un upgrade masivo fuera de alcance. No se afirma un score Lighthouse ni una certificación de accesibilidad: el alcance de QA es el descrito arriba.

## Cómo revisarlo tú

Abrir `http://127.0.0.1:8094/recursos`.

1. Elegir una tarea. Debe destacarse la herramienta adecuada sin abrir otra página. Buscar «rentabilidad», «kilos» o «conciliacion».
2. Costo unitario: probar otro ejemplo; editar total y formato; abrir descuento/IVA; copiar resumen; vaciar con «Usar mis datos» y recuperar. En móvil abrir «Opciones» para estas acciones.
3. Variación: intercambiar las compras del ejemplo. +6,67% debe pasar a −6,25%. Cambiar una compra a litros: no debe mostrar una variación ni permitir compartir un resultado válido.
4. Margen: probar «40% de recargo», que deja 28,57% de margen. Elegir 50% de margen objetivo, aplicarlo y deshacer. Copiar y descargar. Probar 100%: no existe un precio finito.
5. Conciliador: cargar el ejemplo; abrir una vista previa; comparar. Debe dar 2 de 3 cruces por revisar. Buscar un código, filtrar, exportar selección y volver a todos. Cambiar la tolerancia obliga a recalcular. Quitar un archivo y recuperar.
6. Ejemplo guiado: editar un producto y restaurarlo individualmente. Ninguna coincidencia significa autorización de pago.

Esta revisión queda sin commit, push ni publicación para evaluación visual. Producción no cambia por abrir el servidor local.
