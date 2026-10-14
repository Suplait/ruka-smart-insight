# Capacidades: evidencia antes que contenido

La fuente consultable es `src/content/capabilities.json`. Las fichas de `src/content/integrationGuides.json` referencian una capacidad mediante `capabilityId`.

## Qué significa la revisión

- `implemented-conditional`: implementación revisada y alcance condicionado a permisos/configuración. **No equivale a un E2E en cuentas reales ni a disponibilidad universal**.
- `scope-dependent`: caso de uso publicado cuyo alcance concreto se confirma por operación.
- `not-established`: no se debe anunciar como capacidad disponible. El posteo nuevo a Defontana queda en este grupo; lectura no implica escritura.

`allowedClaims` delimita qué puede afirmarse. `notEstablished` enumera extrapolaciones que no tienen respaldo. Los tests comprueban que las tres fichas solo usan capacidades revisadas; no reemplazan la revisión editorial de nuevas frases.

No copiar nombres de clientes, credenciales, logs, rutas privadas ni código de los repos de producto a publicaciones. La evidencia privada de esta revisión se conserva fuera del repo. Los sitios públicos enlazados apoyan el alcance comercial; no son una certificación de partners.

## Antes de una nueva ficha o ampliación

1. Verificar implementación y versión, sentido del dato, requisitos y habilitación.
2. Diferenciar lectura de escritura, recepción física de evento tributario y exportación de pago efectivo.
3. Actualizar fecha, evidencia y límites; mantener una única URL por intención.
4. Ejecutar los tests de descubrimiento y la validación SEO/editorial.
5. Si el alcance no se puede probar, no ampliar el claim. Una lista de logos no es evidencia suficiente.

Las capturas de las tres guías se tomaron el 14 de octubre de 2026 en la demo pública. Los ejemplos numéricos y el demostrador usan datos ficticios. No se midieron ahorros ni resultados de clientes.
