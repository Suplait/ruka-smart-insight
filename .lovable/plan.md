

# Plan: Crear Landing de Retail

## Resumen

Crear una nueva landing page en `/retail` siguiendo la estructura y el brief proporcionado, enfocada en negocios con volumen de compras que sufren por digitacion manual y falta de control. El formulario existente (`RegistrationForm`) se reutiliza sin modificaciones.

---

## Estructura de la Landing

La pagina seguira 8 secciones segun el brief:

### 1. Hero (Seccion Principal)
- **Headline**: "Deja de digitar facturas y controla tus compras sin Excel"
- **Subheadline**: "Ruka centraliza compras, facturas y precios para que el stock, los pagos y los margenes se controlen solos, sin Excel ni digitacion."
- **CTA**: "Ver si Ruka aplica para mi negocio"
- Badge indicando segmento objetivo
- Formulario sticky en desktop (columna derecha)

### 2. Dolor Operativo (Entry Point)
Presentar los dolores universales con iconos y texto claro:
- 2-4 horas al dia digitando facturas o items
- Excel que no escala con el volumen
- Alto riesgo de error humano
- Todo depende de una sola persona
- Pregunta: "Te suena familiar?"

### 3. Consecuencia Real (Emocional + Financiera)
Mostrar lo que pasa cuando el problema no se resuelve:
- Detectas alzas de precios cuando ya perdiste margen
- Reclamas sin evidencia clara
- Pagas con ansiedad y doble revision
- Tu stock refleja la realidad "mas o menos"

### 4. Propuesta de Valor (1 Frase Clara)
Card destacada con:
> "Ruka centraliza compras, facturas y precios para que el stock, los pagos y los margenes se controlen solos, sin Excel ni digitacion."

### 5. Como se ve el Valor (TTFV < 5 dias)
Timeline visual mostrando:

```text
+-------------+    +-------------+    +-------------+
|   Dia 1     |    |   Dia 3     |    |   Dia 5     |
+-------------+    +-------------+    +-------------+
| Conectas    |    | XML         |    | Alertas de  |
| SII o       |    | desglosado  |    | alza de     |
| correo      |    | automatico  |    | precios     |
|             |    |             |    |             |
| Facturas    |    | Cero        |    | Evidencia   |
| entran      |    | digitacion  |    | para        |
| solas       |    |             |    | reclamar    |
|             |    | Compras     |    |             |
|             |    | ordenadas   |    | Primer      |
|             |    | por         |    | ahorro      |
|             |    | proveedor   |    | detectado   |
+-------------+    +-------------+    +-------------+
```

- Destacar: "Primer valor visible: deje de digitar facturas"

### 6. Beneficios (No Features)
Lista de beneficios claros:
- Las facturas se cargan solas
- Sabes si un proveedor te cobra mas caro
- Sabes exactamente que pagar esta semana
- El stock se actualiza sin doble trabajo
- Puedes delegar sin perder control

### 7. Para Quien Es
Bloque de calificacion con dos columnas:

**Es para negocios que:**
- Tienen volumen de compras
- Usan Excel + ERP / POS / contador
- Quieren orden sin contratar mas gente

**No es para quienes:**
- No usan facturacion electronica
- Prefieren seguir digitando todo a mano

### 8. CTA Final
- Tono de evaluacion, no venta agresiva
- "Evalua si Ruka aplica para tu empresa"
- Microcopy: Sin compromiso, Sin tarjeta, Implementacion rapida
- Formulario visible nuevamente en mobile

---

## Archivos a Crear/Modificar

### 1. `src/pages/Retail.tsx` (NUEVO)
Pagina principal siguiendo el patron de `Restaurantes.tsx`:
- Helmet con SEO para retail
- Layout de dos columnas (contenido + formulario sticky)
- Todas las 8 secciones del brief
- Reutiliza `RegistrationForm` sin modificaciones
- Estilo Apple: limpio, profesional, minimalista
- Animaciones con Framer Motion

### 2. `src/App.tsx` (MODIFICAR)
- Agregar import de Retail
- Agregar ruta `/retail`

### 3. `src/components/Navbar.tsx` (MODIFICAR)
- Agregar link a Retail en el menu de Industrias (junto a Restaurantes y Hoteles)
- Usar icono apropiado (ej: `Store` o `ShoppingBag`)

---

## Detalles Tecnicos

### Componentes Reutilizados
- `Navbar` - navegacion global
- `Footer` - pie de pagina
- `RegistrationForm` - formulario de registro (SIN TOCAR)
- `FAQ` - preguntas frecuentes
- `Button`, `motion` y otros UI components

### Estilo Visual
- Apple-style: tipografia light/thin, espaciado generoso
- Gradientes sutiles de fondo
- Cards con bordes suaves y sombras minimas
- Animaciones de entrada con Framer Motion
- Paleta de colores coherente con el resto del sitio

### SEO
- Titulo: "Ruka.ai | Automatizacion de Compras para Retail"
- Meta description enfocada en el problema y solucion
- Structured data para SoftwareApplication
- Canonical URL

### Mobile First
- Formulario aparece en posicion estrategica en mobile
- Boton flotante para scroll al formulario
- Todas las secciones responsive

---

## Resultado Esperado

Una landing page que:
- Sea clara y enfocada en operacion
- Tenga un unico CTA consistente
- Transmita tranquilidad y control
- Haga sentir: "esto me quita un problema de encima"
- Mantenga la coherencia visual con el resto del sitio
- Use el formulario existente sin modificaciones

