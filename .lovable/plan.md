

# Plan: Arreglar diseño del Navbar en móvil

## Problema
El navbar tiene márgenes (`top-6 left-6 right-6` = 24px en cada lado) que dejan espacio visible donde se ve el fondo de la página cuando se hace scroll en móvil.

## Solución
Hacer el navbar de ancho completo en móvil (sin márgenes) y mantener el diseño flotante con márgenes solo en pantallas más grandes.

## Cambios en `src/components/Navbar.tsx`

### Línea 235 - Contenedor principal del nav
**Antes:**
```tsx
<nav className="fixed top-6 left-6 right-6 z-50 bg-white/70 backdrop-blur-xl border border-gray-200/30 rounded-2xl">
```

**Después:**
```tsx
<nav className="fixed top-0 left-0 right-0 md:top-6 md:left-6 md:right-6 z-50 bg-white/70 backdrop-blur-xl border-b md:border border-gray-200/30 md:rounded-2xl">
```

### Resultado
- **Móvil**: Navbar pegado arriba sin márgenes, borde solo en la parte inferior, sin bordes redondeados
- **Desktop (md+)**: Mantiene el diseño flotante original con márgenes y bordes redondeados

