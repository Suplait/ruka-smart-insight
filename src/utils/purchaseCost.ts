export const costUnits = {
  kg: { label: "Kilogramos (kg)", base: "kg", factor: 1 },
  g: { label: "Gramos (g)", base: "kg", factor: 0.001 },
  l: { label: "Litros (l)", base: "l", factor: 1 },
  ml: { label: "Mililitros (ml)", base: "l", factor: 0.001 },
  un: { label: "Unidades", base: "un", factor: 1 },
} as const;

export type CostUnit = keyof typeof costUnits;
export type PurchaseCostInput = {
  price: string;
  packs: string;
  content: string;
  unit: CostUnit;
  discount: string;
  taxRate: string;
  taxIncluded: boolean;
  currency: "CLP" | "USD";
};
export type CostField = "price" | "packs" | "content" | "discount" | "taxRate";
export type PurchaseCost = { netTotal: number; quantity: number; unitCost: number; unit: "kg" | "l" | "un"; currency: "CLP" | "USD" };
type CostResult = { ok: true; value: PurchaseCost } | { ok: false; errors: Partial<Record<CostField, string>> };

// Decimal separator only: do not guess whether a pasted period means thousands.
export function decimalValue(raw: string): number {
  const value = raw.trim();
  return value.length <= 24 && /^\d+(?:[.,]\d{1,6})?$/.test(value) ? Number(value.replace(",", ".")) : NaN;
}

export function calculatePurchaseCost(input: PurchaseCostInput): CostResult {
  const errors: Partial<Record<CostField, string>> = {};
  const values = { price: decimalValue(input.price), packs: decimalValue(input.packs), content: decimalValue(input.content), discount: decimalValue(input.discount), taxRate: decimalValue(input.taxRate) };
  for (const field of ["price", "packs", "content"] as const) {
    if (!Number.isFinite(values[field]) || values[field] <= 0 || values[field] > 1e12) errors[field] = "Ingresa un número mayor que 0 y hasta un billón, con máximo 6 decimales y sin separador de miles.";
  }
  if (!Number.isFinite(values.discount) || values.discount < 0 || values.discount > 100) errors.discount = "El descuento debe estar entre 0 y 100%.";
  if (input.taxIncluded && (!Number.isFinite(values.taxRate) || values.taxRate < 0 || values.taxRate > 100)) errors.taxRate = "Ingresa una tasa entre 0 y 100%.";
  if (Object.keys(errors).length) return { ok: false, errors };
  const quantity = values.packs * values.content * costUnits[input.unit].factor;
  const netTotal = values.price * (1 - values.discount / 100) / (input.taxIncluded ? 1 + values.taxRate / 100 : 1);
  return { ok: true, value: { netTotal, quantity, unitCost: netTotal / quantity, unit: costUnits[input.unit].base, currency: input.currency } };
}

export function comparePurchaseCosts(previous: PurchaseCost, current: PurchaseCost) {
  if (previous.currency !== current.currency) return { ok: false as const, error: "Usa la misma moneda en ambas compras. No aplicamos tipo de cambio." };
  if (previous.unit !== current.unit) return { ok: false as const, error: "Compara unidades equivalentes: peso con peso, volumen con volumen o unidades con unidades. No convertimos kilos en litros." };
  if (previous.unitCost === 0) return { ok: false as const, error: "El costo anterior es cero: no se puede calcular una variación porcentual." };
  const difference = current.unitCost - previous.unitCost;
  return { ok: true as const, difference, percent: difference / previous.unitCost * 100 };
}

export const examplePurchase: PurchaseCostInput = { price: "18000", packs: "6", content: "1", unit: "kg", discount: "0", taxRate: "19", taxIncluded: false, currency: "CLP" };

export function purchaseCostCsv(costs: PurchaseCost[]) {
  const decimal = (value: number) => Number(value.toPrecision(12)).toString().replace(".", ",");
  return "\uFEFF" + [
    "Compra;Moneda;Cantidad total;Unidad;Total neto con descuento;Costo unitario neto",
    ...costs.map((cost, i) => [costs.length === 1 ? "Compra" : i === 0 ? "Anterior" : "Actual", cost.currency, decimal(cost.quantity), cost.unit, decimal(cost.netTotal), decimal(cost.unitCost)].join(";")),
  ].join("\r\n") + "\r\n";
}
