# Directorio público: contrato de mantenimiento

El directorio es una selección editorial de entidades jurídicas con información
pública. No es una exportación del maestro de proveedores de clientes.

## Promoción

1. Preparar `config/supplier-profiles.json` con fuentes primarias verificables.
2. Confirmar identidad jurídica, RUT/DV, marca/sociedad, ausencia de conflictos,
   finalidad pública y exclusión de datos personales, bancarios y operacionales.
3. Registrar una aprobación exacta en `config/supplier-approvals.json`, con SHA256
   sobre JSON.stringify del registro. No hacerlo automáticamente en build.
4. Revisar el diff contra el manifiesto de release y actualizarlo deliberadamente.
   Toda expansión masiva exige revisión editorial humana del lote y sus conflictos.
5. Generar, probar, revisar las fichas modificadas en móvil y escritorio, construir
   y verificar HTTP/HTML/SEO antes y después del deploy.

`auditDirectory` pone en cuarentena ambos registros de un RUT duplicado, registros
no aprobados, personas naturales, información desconocida, fechas inválidas,
fuentes inseguras y contenido distinto del aprobado. El build falla si hay una
sola cuarentena: no publica parcialmente un archivo ambiguo.

## Salida pública

Cada ficha produce HTML y un JSON independiente. El cliente solo importa un
manifiesto compacto y 20 resultados iniciales. Shards de 250 entradas contienen
únicamente datos de búsqueda. Los perfiles completos no entran en ese bundle.
Los JSON auxiliares tienen X-Robots-Tag noindex; las fichas HTML tienen canonical,
Organization de la entidad y fuentes visibles. No hay rating ni relación de
partnership inferida.

El sitemap general conserva las URLs; además se genera una familia de sitemaps
de proveedores por lotes de 2.000, bajo 50 MB por archivo. Lastmod corresponde a
una revisión sustantiva, nunca a Date.now() del build.

## Retirada, corrección y rollback

El contacto de corrección está en cada ficha. Solicitar fuente pública y mantener
la solicitud privada. No pedir facturas, documentos personales o datos bancarios.
Ante un conflicto serio, retirar perfil, aprobación y rutas/registro editorial en
el mismo cambio; verificar que el build no conserve el JSON antiguo. El generador
solo limpia artefactos JSON generados dentro de public/supplier-data.

Para revertir un lote, recuperar los archivos curados y aprobaciones del commit
anterior mediante otro commit revisado. El rebuild reproduce los artefactos.
No restaurar un JSON público aislado dejando el HTML o sitemap incoherente.

## Antes de escalar

La prueba reproducible `scripts/suppliers/benchmark.mjs` usa exclusivamente datos
sintéticos y mide 1k/10k/32k renders del mismo componente. No demuestra derechos
de publicación, rendimiento móvil ni tiempo de subida a hosting. A 32k el HTML
aproxima 1 GB: validar presupuesto y límite del proveedor antes de ampliar.

No promover más de 1.000 fichas sin revisión de arquitectura: búsqueda por
prefijo/categoría bajo demanda, caché y generación incremental del HTML por hash,
presupuesto de despliegue y medición de interacciones en dispositivos móviles.
El índice actual es adecuado para el piloto; un benchmark rápido no elimina
estos requisitos. La siguiente ampliación debe aportar demanda y utilidad propia
por ficha, no texto intercambiable a escala.

Pruebas: `node --test scripts/suppliers/directory.test.mjs`; `npm test`;
`npm run build`; `npm run validate:seo`; `npm run validate:discovery`.
