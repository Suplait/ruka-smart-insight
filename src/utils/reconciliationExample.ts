/** Educational, deterministic comparison. Not the production Ruka reconciliation engine. */
export type ExampleLine = {
  id: string;
  name: string;
  unit: string;
  orderedQuantity: string;
  agreedPrice: string;
  invoiceQuantity: string;
  invoicePrice: string;
  receivedQuantity: string;
};

export const exampleLines: readonly ExampleLine[] = [
  { id: "harina", name: "Harina panadera", unit: "sacos", orderedQuantity: "10", agreedPrice: "1000", invoiceQuantity: "10", invoicePrice: "1000", receivedQuantity: "8" },
  { id: "aceite", name: "Aceite vegetal", unit: "bidones", orderedQuantity: "6", agreedPrice: "2500", invoiceQuantity: "6", invoicePrice: "2800", receivedQuantity: "6" },
  { id: "envases", name: "Envases", unit: "unidades", orderedQuantity: "100", agreedPrice: "150", invoiceQuantity: "100", invoicePrice: "150", receivedQuantity: "100" },
];

// Parse to hundredths without float multiplication; accept Chilean decimal commas.
export function parseHundredths(value: string, max: number): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!/^\d{1,7}(?:\.\d{1,2})?$/.test(normalized)) return null;
  const [whole, fraction = ""] = normalized.split(".");
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return result <= max * 100 ? result : null;
}

export function compareLine(line: ExampleLine, tolerancePercent = 0, hasOrder = true, hasReceipt = true) {
  const ordered = parseHundredths(line.orderedQuantity, 10000);
  const agreed = parseHundredths(line.agreedPrice, 1000000);
  const invoiced = parseHundredths(line.invoiceQuantity, 10000);
  const price = parseHundredths(line.invoicePrice, 1000000);
  const received = hasReceipt ? parseHundredths(line.receivedQuantity, 10000) : 0;
  if ([ordered, agreed, invoiced, price, received].some((v) => v === null) || ![0, 1, 2].includes(tolerancePercent)) {
    return { status: "invalid" as const, reasons: ["Completa los valores con números válidos, sin separadores de miles y con hasta 2 decimales."], invoiceNet: null, missingQuantity: null };
  }
  const reasons: string[] = [];
  const invoiceNet = Math.round(invoiced! * price! / 10000); // CLP rounded per line
  if (!hasOrder) reasons.push("Falta la orden de compra para comprobar cantidad y precio acordados.");
  if (!hasReceipt) reasons.push("Falta registrar la recepción; no podemos comprobar lo que llegó.");
  const missingQuantity = hasReceipt ? Math.max(0, invoiced! - received!) / 100 : null;
  if (hasOrder && invoiced! !== ordered!) reasons.push("La cantidad facturada no coincide con la orden de compra.");
  if (hasOrder && Math.abs(price! - agreed!) * 100 > agreed! * tolerancePercent) reasons.push("El precio facturado está fuera de la tolerancia respecto de la orden.");
  if (hasReceipt && received! < invoiced!) reasons.push("Hay cantidad facturada que todavía no está respaldada por la recepción.");
  if (hasReceipt && received! > invoiced!) reasons.push("La recepción supera lo facturado: revisa si corresponde a otra entrega o documento.");
  return { status: reasons.length ? "review" as const : "match" as const, reasons, invoiceNet, missingQuantity };
}

export type ExamplePreset = "differences" | "match" | "partial";
export function createExample(preset: ExamplePreset = "differences"): ExampleLine[] {
  return exampleLines.map((line, index) => ({ ...line,
    invoicePrice: preset === "differences" ? line.invoicePrice : line.agreedPrice,
    receivedQuantity: preset === "match" ? line.orderedQuantity : preset === "partial" && index === 0 ? "5" : line.receivedQuantity,
  }));
}

export const formatClp = (value: number) => new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(value);
export const reconciliationExamplePath = "/herramientas/conciliar-factura-orden-recepcion";
