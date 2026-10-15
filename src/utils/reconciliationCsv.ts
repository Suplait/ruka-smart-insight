import reconciliationSample from "@/content/reconciliationSample.json";

/** Local-file assistant, not Ruka's production reconciliation or payment approval engine. */
export const CSV_LIMITS = { bytes: 2_000_000, rows: 5000, columns: 60, cell: 2000 } as const;
export type DocumentKind = "order" | "invoice" | "receipt";
export type NumberStyle = "comma" | "dot";
export type CsvTable = { headers: string[]; rows: string[][]; delimiter: string };
export type ColumnMapping = { reference: string; code: string; unit: string; quantity: string; price: string };
export type MappedLine = { row: number; reference: string; code: string; unit: string; quantity: number | null; price: number | null; errors: string[] };
export type CsvResult = {
  reference: string; code: string; unit: string; status: "match" | "review";
  reasons: string[]; order?: MappedLine; invoice?: MappedLine; receipt?: MappedLine;
  rows: Record<DocumentKind, number[]>;
};
export const documentLabels: Record<DocumentKind, string> = { order: "Orden de compra", invoice: "Factura", receipt: "Recepción" };
export const fieldLabels: Record<keyof ColumnMapping, string> = { reference: "Referencia de compra común", code: "Código del producto", unit: "Unidad", quantity: "Cantidad", price: "Precio neto unitario" };

function readRecords(source: string, delimiter: string): string[][] {
  const records: string[][] = [];
  let row: string[] = [], cell = "", quoted = false, closed = false;
  function finishCell() {
    if (cell.length > CSV_LIMITS.cell) throw new Error("Una celda supera los 2.000 caracteres. Exporta solo las columnas necesarias.");
    row.push(cell); cell = ""; closed = false;
    if (row.length > CSV_LIMITS.columns) throw new Error("El archivo supera las 60 columnas.");
  }
  function finishRow() {
    finishCell();
    if (row.some(value => value.trim())) records.push(row);
    row = [];
    if (records.length > CSV_LIMITS.rows + 1) throw new Error("El archivo supera las 5.000 filas. Divide la exportación en lotes.");
  }
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char === '"') {
        if (source[i + 1] === '"') { cell += '"'; i++; } else { quoted = false; closed = true; }
      } else cell += char;
    } else if (char === delimiter) finishCell();
    else if (char === "\n" || char === "\r") { if (char === "\r" && source[i + 1] === "\n") i++; finishRow(); }
    else if (char === '"' && !cell && !closed) quoted = true;
    else if (closed || char === '"') throw new Error("Hay comillas mal cerradas en el CSV. Vuelve a exportarlo desde tu planilla.");
    else cell += char;
    if (cell.length > CSV_LIMITS.cell) throw new Error("Una celda supera los 2.000 caracteres.");
  }
  if (quoted) throw new Error("El CSV termina con una celda entre comillas sin cerrar.");
  if (cell || row.length || closed) finishRow();
  return records;
}

export function parseCsv(source: string, separator?: string): CsvTable {
  if (new TextEncoder().encode(source).length > CSV_LIMITS.bytes) throw new Error("El archivo supera los 2 MB. Divide la exportación en lotes.");
  const clean = source.replace(/^\uFEFF/, "");
  if (clean.includes("\u0000") || clean.includes("\uFFFD")) throw new Error("No podemos leer la codificación. Guarda el archivo como CSV UTF-8.");
  const candidates = separator ? [separator] : [";", ",", "\t"];
  let firstError: Error | undefined;
  for (const delimiter of candidates) {
    try {
      const records = readRecords(clean, delimiter);
      if (!records.length || records[0].length < 2) continue;
      const headers = records[0].map(value => value.trim());
      if (headers.some(value => !value) || new Set(headers.map(value => value.toLowerCase())).size !== headers.length) throw new Error("Cada columna necesita un encabezado distinto y no vacío.");
      const rows = records.slice(1);
      if (!rows.length) throw new Error("El archivo tiene encabezados, pero no contiene datos.");
      const badRow = rows.findIndex(row => row.length !== headers.length);
      if (badRow >= 0) throw new Error(`La fila de datos ${badRow + 1} tiene un número de columnas distinto al encabezado.`);
      return { headers, rows, delimiter };
    } catch (error) { firstError ??= error instanceof Error ? error : new Error("CSV no válido."); }
  }
  throw firstError || new Error("No encontramos columnas y datos. Usa un CSV separado por punto y coma, coma o tabulación.");
}

/** Strict locale chosen by the user. Integer hundredths avoid float comparisons. */
export function parseCsvNumber(value: string, style: NumberStyle, max: number): number | null {
  const text = value.trim();
  const pattern = style === "comma" ? /^(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d{1,2})?$/ : /^(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$/;
  if (!pattern.test(text)) return null;
  const normalized = style === "comma" ? text.replaceAll(".", "").replace(",", ".") : text.replaceAll(",", "");
  const [whole, fraction = ""] = normalized.split(".");
  const result = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return Number.isSafeInteger(result) && result <= max * 100 ? result : null;
}

const aliases: Record<keyof ColumnMapping, string[]> = {
  reference: ["referencia", "referencia_compra", "orden_compra", "oc", "purchase_order"],
  code: ["codigo", "codigo_producto", "sku", "product_code"], unit: ["unidad", "unit", "uom"],
  quantity: ["cantidad", "quantity", "qty"], price: ["precio_neto", "precio_unitario", "precio", "unit_price"],
};
const normalizeHeader = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, "_");
export function suggestMapping(headers: string[]): ColumnMapping {
  return Object.fromEntries(Object.entries(aliases).map(([field, names]) => [field, headers.find(header => names.includes(normalizeHeader(header))) || ""])) as ColumnMapping;
}

export function mapDocument(table: CsvTable, mapping: ColumnMapping, kind: DocumentKind, style: NumberStyle): MappedLine[] {
  const fields = (Object.keys(fieldLabels) as (keyof ColumnMapping)[]).filter(field => kind !== "receipt" || field !== "price");
  if (fields.some(field => !mapping[field] || !table.headers.includes(mapping[field]))) throw new Error(`Elige todas las columnas de ${documentLabels[kind].toLowerCase()}.`);
  if (new Set(fields.map(field => mapping[field])).size !== fields.length) throw new Error("No uses la misma columna para dos campos distintos.");
  return table.rows.map((cells, index) => {
    const get = (field: keyof ColumnMapping) => (cells[table.headers.indexOf(mapping[field])] || "").trim();
    const reference = get("reference"), code = get("code"), unit = get("unit");
    const quantity = parseCsvNumber(get("quantity"), style, 1_000_000);
    const price = kind === "receipt" ? null : parseCsvNumber(get("price"), style, 100_000_000);
    const errors: string[] = [];
    if (!reference || !code || !unit) errors.push("Falta referencia, código o unidad.");
    if (quantity === null) errors.push("Cantidad no válida: usa un número positivo o cero, con hasta 2 decimales y máximo 1.000.000.");
    if (kind !== "receipt" && price === null) errors.push("Precio no válido: usa un número positivo o cero, con hasta 2 decimales y máximo 100.000.000.");
    return { row: index + 1, reference, code, unit, quantity, price, errors };
  });
}

export function reconcileDocuments(documents: Record<DocumentKind, MappedLine[]>, tolerance = 0): CsvResult[] {
  if (![0, 1, 2].includes(tolerance)) throw new Error("Tolerancia no válida.");
  const groups = new Map<string, Record<DocumentKind, MappedLine[]>>();
  const kinds: DocumentKind[] = ["order", "invoice", "receipt"];
  for (const kind of kinds) for (const line of documents[kind]) {
    // Invalid identities must never join, even if all three documents omit the same field.
    const key = !line.reference || !line.code || !line.unit ? JSON.stringify([kind, line.row]) : JSON.stringify([line.reference, line.code, line.unit]);
    if (!groups.has(key)) groups.set(key, { order: [], invoice: [], receipt: [] });
    groups.get(key)![kind].push(line);
  }
  return [...groups.values()].map(group => {
    const first = [...group.invoice, ...group.order, ...group.receipt][0];
    const reasons: string[] = [];
    for (const kind of kinds) {
      if (!group[kind].length) reasons.push(`Falta ${documentLabels[kind].toLowerCase()} para esta referencia, código y unidad.`);
      if (group[kind].length > 1) reasons.push(`${documentLabels[kind]}: hay ${group[kind].length} filas con la misma clave. No se suman automáticamente.`);
      for (const line of group[kind]) reasons.push(...line.errors.map(error => `${documentLabels[kind]}, fila ${line.row}: ${error}`));
    }
    const order = group.order[0], invoice = group.invoice[0], receipt = group.receipt[0];
    if (!reasons.length) {
      if (invoice.quantity !== order.quantity) reasons.push("La cantidad facturada difiere de la cantidad pedida.");
      if (invoice.quantity !== receipt.quantity) reasons.push("La cantidad recibida difiere de la cantidad facturada.");
      if (Math.abs(invoice.price! - order.price!) * 100 > order.price! * tolerance) reasons.push("El precio facturado supera la diferencia de precio permitida respecto de la orden.");
    }
    return { reference: first.reference, code: first.code, unit: first.unit, status: reasons.length ? "review" : "match", reasons, order, invoice, receipt,
      rows: { order: group.order.map(line => line.row), invoice: group.invoice.map(line => line.row), receipt: group.receipt.map(line => line.row) } };
  });
}

/** Quote all fields and neutralize spreadsheet formulas, including leading whitespace. */
export function safeCsvCell(value: string): string {
  const safe = /^[\s\uFEFF]*[=+@-]/.test(value) || /^[\t\r\n]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
export function resultsCsv(results: CsvResult[], tolerance: number): string {
  const number = (value?: number | null) => value == null ? "" : (value / 100).toFixed(2).replace(".", ",");
  const headers = ["referencia", "codigo", "unidad", "estado", "motivos", "cantidad_oc", "cantidad_factura", "cantidad_recepcion", "precio_oc", "precio_factura", "filas_oc", "filas_factura", "filas_recepcion", "tolerancia_precio_porcentaje", "alcance"];
  return "\uFEFF" + [headers, ...results.map(result => [result.reference, result.code, result.unit,
    result.status === "match" ? "Coincide bajo estas reglas" : "Requiere revisión", result.reasons.join(" | "),
    ...(["order", "invoice", "receipt"] as const).map(kind => result.rows[kind].length === 1 ? number(result[kind]?.quantity) : ""),
    ...(["order", "invoice"] as const).map(kind => result.rows[kind].length === 1 ? number(result[kind]?.price) : ""),
    result.rows.order.join(", "), result.rows.invoice.join(", "), result.rows.receipt.join(", "), String(tolerance), "Sin impuestos ni aprobaciones; no autoriza pagos",
  ])].map(row => row.map(safeCsvCell).join(";")).join("\r\n");
}

export const sampleCsv: Record<DocumentKind, string> = reconciliationSample;
