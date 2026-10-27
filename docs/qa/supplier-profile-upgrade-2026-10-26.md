# Fichas de proveedores — upgrade de experiencia

> Autorización posterior: el usuario pidió «deployea todo e2e lo que falte deployear». Se autoriza publicar conjuntamente estas iteraciones tras el QA. Las menciones a entrega local y aprobación pendiente que siguen son el registro histórico previo a esa autorización.

## Alcance y estado

Solicitud: mejorar claridad, contenido, UX/UI, estructura y SEO de todas las fichas de proveedores. Implementación local en `codex/comparison-guides-upgrade`; sin commit, push ni publicación. Se preservan los cambios previos de comparativas y herramientas.

El gestor rechazó crear el goal nuevo porque permanece activo el de comparativas. Este documento registra el objetivo independiente; no se declaró completado el goal anterior ni se simula la creación de otro.

Objetivo de aceptación: las 1.000 fichas deben permitir identificar a la empresa, consultar sus antecedentes con fecha, distinguir contacto comercial de consulta pública y continuar con una tarea útil. La plantilla debe funcionar con información enriquecida, registros básicos y nombres extensos, sin inventar datos.

## Criterio de diseño

Se aplicaron impeccable (registro de producto para consulta, marca Ruka preservada), design-taste-frontend y emil-design-eng. Se conservan tipografía, paleta y navegación existentes. Sin fotografías decorativas, logos inventados, números de confianza ni animaciones que retrasen la consulta.

| Before | After | Why |
| --- | --- | --- |
| Nombre y tabla extensa con un único botón de copia | Identidad jerarquizada, RUT destacado, copia de RUT o identificación completa | Reducir errores al trasladar razón social y RUT a otra tarea |
| Antecedentes con el mismo peso visual | Resumen de organización, domicilio fechado y canal comercial | Distinguir de inmediato qué información está disponible |
| Contacto al final en móvil | Contacto antes del detalle; lateral en desktop | No obligar a recorrer toda la ficha para saber cómo continuar |
| Las fichas sin contacto simplemente lo omitían | Estado explícito de canal no verificado | Evitar que Ruka parezca el contacto del proveedor o inventar uno |
| Recomendaciones al final como párrafos | Revisión personal interactiva después de la identidad, con reinicio y enlaces a herramientas | Dar un uso concreto sin simular una certificación ni autorización de pago |
| Cinco actividades visibles, sin fecha individual | Tres iniciales, resto expandible, fechas disponibles de cada actividad | Facilitar lectura sin eliminar contenido del HTML |
| Fuentes apretadas en el lateral | Sección con origen, finalidad y aviso de descarga ZIP | Hacer comprensibles el respaldo y los límites |
| Fecha de nómina fija en FAQ | Mes/año provenientes del registro | Evitar que futuras fuentes se atribuyan al mes equivocado |
| Contacto solo en FAQ de fichas enriquecidas | Respuesta condicional para fichas básicas y pregunta sobre límites antes de pagar | Cubrir intenciones reales sin afirmar datos inexistentes |

## Datos y contenido

- Mismo conjunto de 1.000 identidades. No se modificaron `supplier-profiles.json`, aprobaciones ni fuentes originales.
- 20 perfiles cuentan con canal comercial respaldado; los demás no se presentan como si lo tuvieran.
- 993 perfiles tienen antecedentes anuales; las ausencias se muestran sin inventar ubicación.
- 190 perfiles tienen más de cinco actividades: el contenido adicional permanece en el HTML inicial, dentro de una expansión nativa.
- Se reutilizan las recomendaciones específicas existentes en cada perfil, no se atribuyen nuevas condiciones comerciales a las empresas.
- Fechas de consulta, nómina y registro anual diferenciadas. No se refrescaron artificialmente fechas de datos ni se confirmó por navegación externa su vigencia actual.
- La copia completa contiene únicamente razón social y RUT. No incluye estados de revisión, datos bancarios, relaciones con clientes, compras ni métricas internas.
- El checklist no persiste ni envía datos. El texto aclara que no certifica al proveedor ni autoriza pagos.
- Enlaces a empresas del mismo rubro son filtros de exploración, no recomendaciones comerciales. Se mantienen los CTA existentes hacia el producto de Ruka.
- El lock editorial se actualizó explícitamente para los dos archivos revisados y el nuevo componente público. No se desactivó la revisión del build.

## Validación realizada

| Comprobación | Resultado |
| --- | --- |
| `npx vitest run --maxWorkers=2` | 318 pruebas, 41 archivos, aprobados |
| Tests nuevos | 6: copia completa, fallo de clipboard, checklist/reinicio, contacto ausente, fecha dinámica y nombre largo/datos opcionales |
| Pruebas existentes de proveedores | 8 aprobadas; incluyen render de todas las identidades sin JavaScript |
| `npm run build` | Aprobado, incluidas las 1.000 fichas y 40 páginas del directorio |
| `npm run validate:seo` | 54.629 verificaciones en 1.116 rutas |
| `npm run validate:discovery` | 4.496 comprobaciones y 1.110 documentos Markdown |
| Conversión de recursos | 1.076 páginas con siguiente paso y destinos comprobados |
| `npm run test:tracking-contract` | 31 llamadas conservan nombres, argumentos y orden |
| ESLint de los cuatro archivos de esta implementación | Aprobado |
| `git diff --check` | Aprobado |

El build comprueba canonical, H1, razón social, RUT, fuentes, identidad estructurada sin ratings inventados y coincidencia exacta entre FAQ visible y JSON-LD para las 1.000 fichas. No hay nuevos proveedores ni cambios de canonical en esta iteración.

La comprobación HTTP local consultó el destino `/index.html` de la regla existente `/proveedores/:slug`: Agrosuper, Toteat SPA y la razón social más larga devolvieron 200 con HTML inicial específico y seis FAQ. Vite Preview no reproduce los rewrites de Vercel: esto valida el artefacto servido y la configuración, no constituye QA de un nuevo despliegue en producción.

Advertencias existentes: Browserslist/baseline desactualizados y chunks globales grandes. La ficha no agrega dependencias; el chunk Suppliers resultó de 12,79 kB gzip. No se ejecutó Lighthouse ni se atribuye una puntuación de rendimiento. El lint global tenía fallos ajenos antes de esta iteración; el resultado declarado es el lint relevante.

## QA visual y funcional

Se revisaron Agrosuper, Toteat SPA y Comercial Nathalie Venegas Valdés Empresa Individual de Responsabilidad Limitada a 360, 768 y 1440 px: nueve mediciones sin desbordamiento horizontal, un H1 y ningún ancla rota. Capturas en `/Users/camilosilva/.codex/visualizations/2026/10/26/supplier-profile-upgrade/`.

Se verificaron en navegador la copia completa y el feedback, el salto a revisión de compra y el marcado del checklist. Las pruebas automatizadas cubren además clipboard denegado, reinicio, datos opcionales y errores de carga existentes. No se enviaron pedidos, formularios ni datos de prueba a proveedores.

## Cómo revisarlo

1. Abrir `http://127.0.0.1:8094/proveedores/agrosuper`.
2. Probar «Copiar RUT» y «Copiar identificación». La segunda copia razón social y RUT, no solo la marca.
3. Pulsar «Revisar una compra», marcar un punto y pulsar «Reiniciar».
4. Expandir las actividades y las preguntas. Revisar el período de cada antecedente.
5. Abrir `http://127.0.0.1:8094/proveedores/toteat-spa-763635791`: se explica la falta de canal comercial verificado; no se fabrica un contacto.
6. Revisar ambos en móvil. Contacto, navegación horizontal local, identidad y controles deben poder usarse sin desbordar la página.
7. En desktop, probar el enlace del mismo rubro y el CTA final al producto. Ninguno debe aparentar que se está contactando al proveedor a través de Ruka.

Pendiente: revisión del usuario y autorización de publicación de esta iteración. Esta entrega no altera producción ni cierra el goal E2E anterior.
