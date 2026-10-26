/** Only real, indexable parent routes; never invent /herramientas or /guias. */
export function resourceParents(path: string) {
  const resources = { path: "/recursos", name: "Recursos" };
  const groups = [
    { path: "/guias/compras", name: "Guías de compras" },
    { path: "/desarrolladores", name: "API de Ruka" },
    { path: "/proveedores", name: "Proveedores" },
    { path: "/ayuda", name: "Centro de ayuda" },
    { path: "/comparar", name: "Comparativas" },
  ];
  const parent = groups.find(group => path.startsWith(`${group.path}/`));
  if (parent) return [resources, parent];
  if (groups.some(group => path === group.path) || path.startsWith("/herramientas/")) return [resources];
  return [];
}
