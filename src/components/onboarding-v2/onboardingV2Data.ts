export const VOLUME_OPTIONS = [
  { label: "Menos de 150 facturas", value: 75 },
  { label: "150 a 300 facturas", value: 225 },
  { label: "300 a 600 facturas", value: 450 },
  { label: "Más de 600 facturas", value: 750 },
] as const;

export const PRICING_PLANS = [
  {
    name: "Start",
    price: "$99.990",
    capacity: "Hasta 200 documentos / mes",
  },
  {
    name: "Core",
    price: "$249.990",
    capacity: "Hasta 500 documentos / mes",
  },
  {
    name: "Scale",
    price: "$449.990",
    capacity: "Hasta 1.200 documentos / mes",
  },
] as const;

export function getVolumeLabel(count: number) {
  return VOLUME_OPTIONS.find((option) => option.value === count)?.label ?? `${count} facturas`;
}
