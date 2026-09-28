export const pricingPlans = [
  { name: "Start", price: "$99.990", priceValue: 99990, capacity: "Hasta 200 facturas de compra / mes", value: 75 },
  { name: "Core", price: "$249.990", priceValue: 249990, capacity: "Hasta 500 facturas de compra / mes", value: 225, featured: true },
  { name: "Scale", price: "$449.990", priceValue: 449990, capacity: "Hasta 1.200 facturas de compra / mes", value: 450 },
  { name: "A medida", price: "Hablemos", capacity: "Más de 1.200 facturas de compra / mes", value: 750 },
] as const;

export const includedInEveryPlan = [
  "Procesamiento de documentos",
  "Integraciones",
  "Reglas y homologación",
] as const;

export const prepaidOptions = [
  { term: "3 meses", discount: "3%" },
  { term: "6 meses", discount: "6%" },
  { term: "12 meses", discount: "10%" },
] as const;

export const volumeOptions = pricingPlans.map((plan) => ({
  ...plan,
  label: `${plan.name} · ${plan.capacity.replace(" de compra / mes", "")}`,
  volume: plan.capacity,
  priceDetail: plan.name === "A medida" ? undefined : "/ mes",
}));
