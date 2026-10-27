# Herramientas: mejora de experiencia

> Autorización posterior: el usuario pidió «deployea todo e2e lo que falte deployear». Se autoriza publicar conjuntamente estas iteraciones tras el QA. Las menciones a entrega local y aprobación pendiente que siguen son el registro histórico previo a esa autorización.

## Objetivo solicitado

Mejorar el índice `/recursos` y las cuatro herramientas existentes: costo unitario, variación de costos, margen/markup y conciliación de factura, orden y recepción. Claridad de tarea, ejemplos, interpretación de resultados, diseño responsive, accesibilidad, contenido útil y SEO. Mantener cálculos, URLs, privacidad, funnel y tracking.

El gestor de goals no permite un segundo objetivo mientras el de comparativas espera aprobación. Este documento registra el alcance nuevo sin declarar completado el anterior. Implementación local, sin commit ni publicación hasta revisión.

## Dirección

Identidad Ruka; controles sobrios y resultados protagonistas. Impeccable para arquitectura y claridad, design-taste-frontend para el índice editorial, emil-design-eng para interacción. Variación 6, movimiento 3, densidad 4. Sin imágenes decorativas ni falsas capturas.

## Auditoría inicial

| Antes | Cambio aplicado | Por qué |
| --- | --- | --- |
| Calculadoras separadas de conciliación en el índice | Selector de las cuatro tareas, con entradas y salida explícitas | Ayudar a elegir sin conocer el nombre de una herramienta |
| Un ejemplo fijo por calculadora | Escenarios de formatos, unidades e impuestos | Enseñar el uso con casos concretos |
| Resultado numérico aislado | Desglose de la cuenta e interpretación contextual | Hacer el cálculo comprobable y útil |
| Conciliación exige entender CSV antes de empezar | Preparación, progreso y explicación de la clave compartida | Evitar errores de correspondencia |
| Fórmulas sin FAQs en calculadoras | Preguntas propias de cada herramienta y schema coincidente | Resolver dudas reales en HTML accesible a buscadores |

## Implementación

- Índice: las cuatro herramientas juntas, elegidas por la pregunta del usuario; entrada, resultado de ejemplo y acción reconocibles. Se mantienen búsqueda, categorías y los demás recursos. Conteo de búsqueda y tarjetas usan el mismo filtro.
- Navegación común entre las cuatro herramientas, con enlaces reales. En móvil, una fila desplazable evita ocupar dos líneas antes de la tarea.
- Costo unitario y variación: escenarios de bolsas/sacos, botellas/bidones y precio con IVA; desglose numérico del total neto dividido por cantidad; resultado destacado y descarga con recuperación de errores.
- Variación: impacto sobre la cantidad actual, sin inventar una proyección mensual. En móvil se alterna entre las dos compras sin perder valores; el resumen queda antes del editor.
- Margen: escenarios de margen, recargo y venta bajo costo; referencias de margen objetivo explícitamente no recomendadas; cálculo y explicaciones consistentes. Se conserva la advertencia de que margen no es utilidad neta.
- Conciliación: encabezado más compacto; preparación de CSV con ejemplo de clave compartida; progreso de archivos cargados; resumen de cruces, coincidencias y pendientes; descarga con error recuperable. Se mantienen validación de mapeos, archivos mezclados, límites de tamaño, tolerancia, paginación e invalidación al editar.
- Contenido: 4 FAQs propias en cada calculadora y 5 en conciliación. Sus respuestas están en HTML, no se descargan al abrir el acordeón. Schema FAQPage y WebApplication, además de los metadatos existentes.
- Los CTA hacia producto y conversación siguen presentes, sin poner formularios delante de las herramientas.

## Iteración crítica

1. Se reorganizó la experiencia alrededor de elegir tarea, ingresar datos e interpretar un resultado. Se conservaron las funciones matemáticas existentes.
2. La revisión de escritorio mostró que explicar los CSV antes de la carga desplazaba demasiado la tarea. La preparación quedó desplegable, con su contenido disponible en HTML.
3. La revisión de 360 px mostró demasiada altura dedicada a escenarios. Se sustituyeron por selectores en móvil, manteniendo los botones en escritorio. La comparación móvil evita dos formularios consecutivos y conserva ambos estados.
4. Se reforzaron los bordes de campos: contraste 3,39:1 sobre blanco y 3,17:1 sobre el panel. Texto secundario 5,59:1 y enlaces azules 6,81:1 sobre blanco. La revisión responsive se repitió después de estos ajustes.

## Validación ejecutada

- `npm test -- --maxWorkers=2 --silent`: **312 pruebas, 40 archivos, todas aprobadas**. Incluye 10 pruebas nuevas de escenarios, impacto, unidades incompatibles, conservación de datos, fallos de descarga, margen negativo, objetivos, descubrimiento y preparación de archivos.
- `npm run build`: aprobado. HTML específico para 1.116 rutas; validaciones editoriales, contenido público y proveedores aprobadas.
- ESLint de los 11 archivos TS/TSX nuevos o modificados de este alcance: aprobado.
- `npm run validate:seo`: **50.669 verificaciones** aprobadas.
- `npm run validate:discovery`: **4.496 verificaciones** aprobadas.
- Validación de conversión: **1.076 páginas** con siguiente paso, destino y contenido server-side válidos.
- Contrato de tracking: **31 llamadas existentes** conservan nombre, argumentos y orden.
- Cálculos base: sin diff en `margin.ts`, `purchaseCost.ts`, `reconciliationExample.ts` y `reconciliationCsv.ts`. No cambió RegistrationForm ni el funnel.
- QA de las cinco vistas a **360, 768 y 1440 px**: un H1, ningún campo sin etiqueta y sin desbordamiento horizontal de la página. La navegación y la tabla estrecha permiten desplazamiento dentro de su contenedor.
- Navegador: selección de escenarios, compra actual en móvil, ejemplo CSV, comparación (2 de 3 requieren revisión), filtro de pendientes, borrado y recarga por click. Activación por teclado comprobada en el ejemplo.

### HTML inicial y hosting

Vite Preview no interpreta `vercel.json`: en una URL limpia puede devolver el fallback del home. No se confundió ese comportamiento local con el despliegue de Vercel. Se verificó que cada ruta tiene su rewrite correcto y se solicitó por HTTP el archivo exacto de destino, sin ejecutar JavaScript:

| Ruta | HTTP del destino de rewrite | H1 | FAQ en schema y cuerpo | Canonical / og:url |
| --- | --- | --- | --- | --- |
| `/recursos` | 200, sin redirect | 1 | No aplica | Propios |
| `/herramientas/costo-unitario` | 200, sin redirect | 1 | 4 / 4 | Propios |
| `/herramientas/variacion-costos` | 200, sin redirect | 1 | 4 / 4 | Propios |
| `/herramientas/margen-markup` | 200, sin redirect | 1 | 4 / 4 | Propios |
| `/herramientas/conciliar-factura-orden-recepcion` | 200, sin redirect | 1 | 5 / 5 | Propios |

Titles y descriptions específicos comprobados; WebApplication en las cuatro herramientas. Esto valida el build y sus destinos configurados, no un nuevo despliegue. No implica garantía de ranking ni de rich results.

### Advertencias que no se ocultaron

El build mantiene avisos previos sobre Browserslist y chunks grandes del sitio global. No se añadieron dependencias. En desarrollo continúan advertencias previas de React Router y react-helmet/StrictMode. No se afirma que el lint global histórico esté limpio: se ejecutó el lint relevante de este alcance.

## Cómo revisarlo

Servidor de desarrollo: `http://127.0.0.1:8094/recursos`.

1. Entra a cada una de las cuatro tarjetas. Busca `margen`, `recepción` y una palabra inexistente; limpia la búsqueda.
2. Costo unitario: prueba Botellas y bidones. Debe dar $4.000/l. Prueba Precio con IVA: debe dar $3.000/kg. Cambia contenido y abre Descuento e IVA.
3. Variación: el ejemplo inicial da +6,67% y $5.000 más para 25 kg. Botellas y bidones da −10% y $2.000 menos para 5 l. Cambia una moneda o mezcla kg con l: no debe calcular ni habilitar descarga.
4. En móvil, alterna Editar anterior / Editar actual. Los valores se conservan. Ver detalle baja al resultado.
5. Margen: 40% de recargo muestra 28,57% de margen. Venta bajo costo muestra −20%. Un objetivo de 50% con costo 6.000 da precio 12.000. Objetivo 100 debe mostrar validación.
6. Conciliación: abre la preparación, carga el caso de ejemplo, revisa columnas y pulsa Comparar archivos. Deben aparecer 2 de 3 por revisar. Filtra, descarga y borra; cambiar una regla invalida el resultado anterior.
7. Abre FAQs y enlaces de siguiente paso. La herramienta debe seguir funcionando sin registro.

Capturas locales: `/Users/camilosilva/.codex/visualizations/2026/10/26/tools-upgrade/`.

## Entrega

Cambios locales, **sin commit, push ni publicación**. Comparativas previas preservadas. Falta la aprobación visual del usuario antes de preparar una publicación. Este informe es privado y no está en `public` ni `dist`.
