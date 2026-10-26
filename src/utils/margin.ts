import { decimalValue } from "./purchaseCost";

export function marginMetrics(costRaw: string, priceRaw: string) {
  const cost = decimalValue(costRaw), price = decimalValue(priceRaw);
  const valid = (value: number) => Number.isFinite(value) && value > 0 && value <= 1e12;
  if (!valid(cost) || !valid(price)) return { ok: false as const, costInvalid: !valid(cost), priceInvalid: !valid(price) };
  const contribution = price - cost;
  return { ok: true as const, cost, price, contribution, margin: contribution / price * 100, markup: contribution / cost * 100 };
}

export function priceForMargin(costRaw: string, marginRaw: string) {
  const cost = decimalValue(costRaw), margin = decimalValue(marginRaw);
  if (!Number.isFinite(cost) || cost <= 0 || cost > 1e12 || !Number.isFinite(margin) || margin < 0 || margin >= 100) return null;
  return cost / (1 - margin / 100);
}
