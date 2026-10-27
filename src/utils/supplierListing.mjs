/** Same stable public index for the offline generator and server HTML. */
export function supplierListing(records, pageSize = 25) {
  const rows = [...records].sort((a, b) => a.name.localeCompare(b.name, "es"));
  const compact = rows.map(({ slug, name, legalName, rut, aliases, category, registry }) => ({
    slug, name, legalName, rut, aliases, category,
    ...(registry?.annual ? { region: registry.annual.region, commune: registry.annual.commune } : {}),
  }));
  const pages = [];
  for (let start = 0; start < compact.length; start += pageSize) {
    pages.push({ file: `page-${pages.length + 1}.json`, entries: compact.slice(start, start + pageSize) });
  }
  return { rows, compact, pages };
}
