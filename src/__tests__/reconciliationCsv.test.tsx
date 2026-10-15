import { describe, expect, it } from "vitest";
import { CSV_LIMITS, mapDocument, parseCsv, parseCsvNumber, reconcileDocuments, resultsCsv, safeCsvCell, sampleCsv, suggestMapping, type DocumentKind } from "@/utils/reconciliationCsv";

const documents = () => Object.fromEntries((Object.keys(sampleCsv) as DocumentKind[]).map(kind => {
  const table = parseCsv(sampleCsv[kind]);
  return [kind, mapDocument(table, suggestMapping(table.headers), kind, "comma")];
})) as Parameters<typeof reconcileDocuments>[0];

describe("CSV parsing boundaries", () => {
  it.each([";", ",", "\t"])("accepts %s, BOM, CRLF and quoted embedded separators", separator => {
    const table = parseCsv(`\uFEFFcode${separator}name\r\n001${separator}"a${separator}b"\r\n002${separator}"line\nwith ""quote"""`);
    expect(table.rows).toEqual([["001", `a${separator}b`], ["002", 'line\nwith "quote"']]);
  });
  it.each(["", "a;b", "a;a\n1;2", "a;\n1;2", "a;b\n1;2;3", 'a;b\n1;"bad', 'a;b\n1;"bad"x', 'a;b\n1;ab"cd', "a;b\n1;\uFFFD", "a;b\n1;\u0000"])("rejects malformed input %j", source => expect(() => parseCsv(source)).toThrow());
  it("bounds bytes, cells and rows", () => {
    expect(() => parseCsv("a".repeat(CSV_LIMITS.bytes + 1))).toThrow(/2 MB/);
    expect(() => parseCsv(`a;b\n1;${"x".repeat(2001)}`)).toThrow();
    expect(() => parseCsv(`a;b\n${"1;2\n".repeat(5001)}`)).toThrow();
  });
});

describe("explicit numeric conventions", () => {
  it.each([["1.234,50", "comma", 123450], ["1,234.50", "dot", 123450], ["1.000", "comma", 100000], ["1,00", "comma", 100], ["0", "comma", 0], ["0.29", "dot", 29]] as const)("parses %s as %s", (value, style, expected) => expect(parseCsvNumber(value, style, 1e8)).toBe(expected));
  it.each(["", "-1", "NaN", "1e3", "1,2,3", "$100", "1.50", "2,345", "100000001", "Infinity", "=1+2"])("rejects ambiguous/invalid comma number %s", value => expect(parseCsvNumber(value, "comma", 1e8)).toBeNull());
});

describe("safe matching", () => {
  it("processes the full 5,000-row limit without dropping rows or source references", () => {
    const source = "referencia;codigo;unidad;cantidad;precio_neto\n" + Array.from({ length: 5000 }, (_, i) => `OC-${i};${String(i).padStart(5, "0")};un;10;1000`).join("\n");
    const table = parseCsv(source);
    const mapping = suggestMapping(table.headers);
    const data = Object.fromEntries((["order", "invoice", "receipt"] as const).map(kind => [kind, mapDocument(table, mapping, kind, "comma")])) as Parameters<typeof reconcileDocuments>[0];
    data.receipt[4999].quantity = 900;
    const result = reconcileDocuments(data);
    expect(result).toHaveLength(5000);
    expect(result.filter(row => row.status === "match")).toHaveLength(4999);
    expect(result[4999].status).toBe("review");
    expect(result[4999].rows).toEqual({ order: [5000], invoice: [5000], receipt: [5000] });
    const exported = parseCsv(resultsCsv(result, 0));
    expect(exported.rows).toHaveLength(5000);
    expect(exported.rows[0]).toContain("00000");
    expect(exported.rows[4999]).toContain("OC-4999");
  });
  it("produces exactly two review lines and a matching line", () => expect(reconcileDocuments(documents()).map(row => row.status)).toEqual(["review", "review", "match"]));
  it("never merges distinct references, SKU case or units", () => {
    for (const field of ["reference", "code", "unit"] as const) {
      const data = documents(); data.receipt[2][field] += "X";
      const result = reconcileDocuments(data);
      expect(result).toHaveLength(4); expect(result.every(row => row.status === "review")).toBe(true);
    }
  });
  it("flags duplicates and does not export a misleading first-row total", () => {
    const data = documents(); data.invoice.push({ ...data.invoice[2], row: 4 });
    const row = reconcileDocuments(data)[2];
    expect(row.status).toBe("review"); expect(row.rows.invoice).toEqual([3, 4]);
    const csv = parseCsv(resultsCsv([row], 0));
    expect(csv.rows[0][csv.headers.indexOf("cantidad_factura")]).toBe("");
  });
  it("does not match missing identities", () => {
    const data = documents(); for (const kind of Object.keys(data) as DocumentKind[]) data[kind][2].reference = "";
    expect(reconcileDocuments(data)).toHaveLength(5);
    expect(reconcileDocuments(data).every(row => row.status === "review")).toBe(true);
  });
  it("uses exact tolerance boundaries and zero-price rules", () => {
    const data = documents(); data.invoice[2].price = 15150;
    expect(reconcileDocuments(data, 1)[2].status).toBe("match");
    data.invoice[2].price = 15151; expect(reconcileDocuments(data, 1)[2].status).toBe("review");
    data.order[2].price = 0; expect(reconcileDocuments(data, 2)[2].status).toBe("review");
    expect(() => reconcileDocuments(data, -1)).toThrow();
  });
  it("requires distinct mapped columns and preserves leading zero codes", () => {
    const table = parseCsv("referencia;codigo;unidad;cantidad;precio_neto\nOC-1;001;kg;2,5;1000");
    const mapping = suggestMapping(table.headers);
    expect(mapDocument(table, mapping, "invoice", "comma")[0].code).toBe("001");
    expect(() => mapDocument(table, { ...mapping, unit: mapping.code }, "invoice", "comma")).toThrow(/misma columna/);
    expect(() => mapDocument(table, { ...mapping, code: "" }, "invoice", "comma")).toThrow(/Elige/);
  });
  it.each(["=SUM(A1)", " +cmd", "-cmd", "@cmd", "\tformula", "\nformula"])("neutralizes export formulas %j", value => expect(safeCsvCell(value)).toMatch(/^"'/));
  it("keeps limitations and configured tolerance in every exported row", () => {
    const table = parseCsv(resultsCsv(reconcileDocuments(documents(), 2), 2));
    expect(table.rows).toHaveLength(3);
    expect(table.rows.every(row => row.at(-2) === "2" && row.at(-1)?.includes("no autoriza pagos"))).toBe(true);
  });
});
