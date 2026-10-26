export function normalizeSupplierSearch(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function validCompanyRut(value: string): boolean {
  if (!/^\d{1,3}(?:\.\d{3}){2}-[0-9Kk]$/.test(value) && !/^\d{7,9}-[0-9Kk]$/.test(value)) return false;
  const [body, verifier] = value.replace(/\./g, "").toUpperCase().split("-");
  if (/^0+$/.test(body)) return false;
  let sum = 0;
  for (let i = 0; i < body.length; i++) sum += Number(body[body.length - 1 - i]) * (2 + i % 6);
  const remainder = 11 - sum % 11;
  return verifier === (remainder === 11 ? "0" : remainder === 10 ? "K" : String(remainder));
}

// RUT validation checks syntax and checksum, never identity, legal form or solvency.
export function matchesSupplier(supplier: { name: string; legalName: string; rut: string; aliases: string[]; category: string }, query: string, category = "Todas"): boolean {
  if (category !== "Todas" && supplier.category !== category) return false;
  const needle = normalizeSupplierSearch(query);
  return !needle || [supplier.name, supplier.legalName, supplier.rut, ...supplier.aliases].some(value => normalizeSupplierSearch(value).includes(needle));
}
