export const VOLUME_OPTIONS = [
  {
    plan: "Start",
    label: "Start · Hasta 200 facturas",
    volume: "Hasta 200 facturas de compra / mes",
    price: "$99.990",
    priceDetail: "/ mes",
    value: 75,
  },
  {
    plan: "Core",
    label: "Core · Hasta 500 facturas",
    volume: "Hasta 500 facturas de compra / mes",
    price: "$249.990",
    priceDetail: "/ mes",
    value: 225,
    featured: true,
  },
  {
    plan: "Scale",
    label: "Scale · Hasta 1.200 facturas",
    volume: "Hasta 1.200 facturas de compra / mes",
    price: "$449.990",
    priceDetail: "/ mes",
    value: 450,
  },
  {
    plan: "A medida",
    label: "A medida · Más de 1.200 facturas",
    volume: "Más de 1.200 facturas de compra / mes",
    price: "Hablemos",
    value: 750,
  },
] as const;

export const PRICING_PLANS = [
  {
    name: "Start",
    price: "$99.990",
    capacity: "Hasta 200 facturas de compra / mes",
  },
  {
    name: "Core",
    price: "$249.990",
    capacity: "Hasta 500 facturas de compra / mes",
  },
  {
    name: "Scale",
    price: "$449.990",
    capacity: "Hasta 1.200 facturas de compra / mes",
  },
] as const;

export function getVolumeLabel(count: number) {
  return VOLUME_OPTIONS.find((option) => option.value === count)?.label ?? `${count} facturas`;
}
