import { pricingPlans, volumeOptions } from "@/content/pricing";

export const VOLUME_OPTIONS = volumeOptions;
export const PRICING_PLANS = pricingPlans;

export function getVolumeLabel(count: number) {
  return VOLUME_OPTIONS.find((option) => option.value === count)?.label ?? `${count} facturas`;
}
