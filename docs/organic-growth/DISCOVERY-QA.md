# QA: guías, integraciones y ejemplo de conciliación

## Alcance

Tres guías existentes conservan su URL y fecha original, con nuevos ejemplos y capturas propias. Tres fichas de SII, Toteat y Nubox aclaran dirección, requisitos y límites. El ejemplo interactivo usa datos ficticios, no documentos subidos ni conexiones bancarias. Ver `CAPABILITIES.md` para la política de evidencia.

No se cambian formularios comerciales, tracking, Calendly, pricing, Supabase, Navbar, Footer ni automatizaciones del motor orgánico.

## Checks reproducibles

```sh
npm test
npm run test:tracking-contract
npm run organic:blog:validate
npm run build
npm run validate:seo
node scripts/validate-discovery-delivery.mjs https://www.ruka.ai
```

El último comando se ejecuta tras desplegar. Compara HTML **recibido del servidor** con el build local: 10 páginas, contenido, title, description, canonical, og:url, JSON-LD, respuestas FAQ y bytes de las 3 imágenes. También revisa sitemap, llms.txt, robots, redirecciones permanentes y 404 de integración inexistente. No hidrata React ni envía leads.

Lint relevante: ejecutar ESLint sobre los archivos TS/TSX/MJS del diff. El repo tiene deuda de lint/typecheck anterior fuera del alcance; no debe confundirse con regresiones del cambio.

## QA manual

1. Abrir `/integraciones`, buscar SII, Toteat o Nubox y entrar por «Ver alcance y requisitos». Comprobar logo, dirección del dato, límites y FAQ. Volver al catálogo.
2. Abrir `/blog` y las guías de registro de compras, conciliación y nómina bancaria. Cada una debe mostrar una captura diferente, identificada como demo, ampliable y sin recorte CSS. El índice salta a la sección indicada.
3. En la guía de conciliación, pulsar «Probar esta conciliación».
4. El ejemplo debe comenzar con **2 de 3 productos requieren revisión**, total **$41.800**.
5. Cambiar harina recibida de 8 a 10 y precio de aceite de 2800 a 2500: **Los 3 productos coinciden**, total **$40.000**.
6. Quitar «Tengo la recepción»: **3 de 3 requieren revisión**, campos de recepción deshabilitados. Nunca aparece autorización de pago.
7. Reiniciar. Vaciar un precio: error legible y total «Por completar», nunca cero engañoso o NaN.
8. «Entrega parcial» muestra cinco sacos sin respaldo; «Todo coincide» recupera el caso conciliado.
9. Repetir a 360px y desktop: sin scroll horizontal, campos/etiquetas legibles, foco visible, opciones alcanzables por teclado. La comparación no depende de hover.

## Lo que NO prueba este QA

No prueba conectores en cuentas externas, ahorros de clientes, aprobación de pagos ni ranking/citas en buscadores. Esos resultados necesitan validación separada. Las fichas no prometen disponibilidad universal ni reemplazan el diagnóstico de una operación.
