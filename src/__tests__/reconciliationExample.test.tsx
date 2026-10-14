import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { compareLine, createExample, parseHundredths } from "@/utils/reconciliationExample";
import ReconciliationExample from "@/pages/ReconciliationExample";

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/seo/MarketingSeo", () => ({ MarketingSeo: () => null }));
afterEach(cleanup);

describe("educational comparison: bounded fixed-point arithmetic", () => {
  it.each(["", " ", "-1", "Infinity", "NaN", "1e4", "1.000,00", "1,000.00", "0.001", "1.2.3", "<script>", "10001"])("rejects invalid quantity %s", (value) => {
    expect(parseHundredths(value, 10000)).toBeNull();
  });
  it.each([["1,25", 125], ["1.25", 125], ["0", 0], [" 2.1 ", 210], ["10000", 1000000]])("parses %s exactly", (value, expected) => {
    expect(parseHundredths(String(value), 10000)).toBe(expected);
  });
  it("starts with two distinct discrepancies and a total net of 41800", () => {
    const results = createExample().map((line) => compareLine(line));
    expect(results.map((r) => r.status)).toEqual(["review", "review", "match"]);
    expect(results[0].missingQuantity).toBe(2);
    expect(results.reduce((sum, r) => sum + r.invoiceNet!, 0)).toBe(41800);
  });
  it("all fields match in the matched scenario, net 40000", () => {
    const results = createExample("match").map((line) => compareLine(line));
    expect(results.every((r) => r.status === "match")).toBe(true);
    expect(results.reduce((sum, r) => sum + r.invoiceNet!, 0)).toBe(40000);
  });
  it("partial delivery leaves five units unbacked", () => {
    expect(compareLine(createExample("partial")[0]).missingQuantity).toBe(5);
  });
  it.each([[false, true], [true, false], [false, false]])("never matches without documents: %s / %s", (order, receipt) => {
    expect(compareLine(createExample("match")[0], 0, order, receipt).status).toBe("review");
  });
  it("price tolerance uses the agreed unit price, includes its exact boundary", () => {
    const line = { ...createExample("match")[0], invoicePrice: "1010" };
    expect(compareLine(line, 0).status).toBe("review");
    expect(compareLine(line, 1).status).toBe("match");
    expect(compareLine({ ...line, invoicePrice: "1010.01" }, 1).status).toBe("review");
    expect(compareLine({ ...line, invoicePrice: "990" }, 1).status).toBe("match");
  });
  it("price tolerance never hides quantity discrepancies", () => {
    expect(compareLine({ ...createExample("match")[0], receivedQuantity: "9" }, 2).status).toBe("review");
  });
  it("flags over-receipt and quantity difference from the order", () => {
    expect(compareLine({ ...createExample("match")[0], receivedQuantity: "11" }).reasons.join()).toContain("supera");
    expect(compareLine({ ...createExample("match")[0], invoiceQuantity: "9", receivedQuantity: "9" }).reasons.join()).toContain("orden de compra");
  });
  it("invalid and empty inputs never produce a plausible total", () => {
    const result = compareLine({ ...createExample()[0], invoicePrice: "" });
    expect(result.status).toBe("invalid"); expect(result.invoiceNet).toBeNull();
  });
  it("rejects non-listed tolerance values", () => {
    expect(compareLine(createExample()[0], 100).status).toBe("invalid");
  });
  it("does not ask to fix a disabled receipt field when the document is missing", () => {
    const result = compareLine({ ...createExample("match")[0], receivedQuantity: "" }, 0, true, false);
    expect(result.status).toBe("review");
    expect(result.missingQuantity).toBeNull();
    expect(result.reasons.join()).toContain("Falta registrar la recepción");
  });
  it("rounds line net once to CLP and handles zero agreed price", () => {
    const base = createExample("match")[0];
    expect(compareLine({ ...base, invoiceQuantity: "1,25", invoicePrice: "10" }).invoiceNet).toBe(13);
    expect(compareLine({ ...base, agreedPrice: "0", invoicePrice: "0" }, 2).status).toBe("match");
    expect(compareLine({ ...base, agreedPrice: "0", invoicePrice: "1" }, 2).status).toBe("review");
  });
  it("presets are independent copies", () => {
    const first = createExample(); first[0].invoicePrice = "12";
    expect(createExample()[0].invoicePrice).toBe("1000");
  });
});

describe("interactive comparison", () => {
  it("edits, resets, handles missing documents and does not call a backend", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    render(<MemoryRouter><ReconciliationExample /></MemoryRouter>);
    expect(screen.getByRole("status").textContent).toContain("2 de 3");
    const received = screen.getByLabelText("Cant. recibida: Harina panadera");
    await user.clear(received); await user.type(received, "10");
    const price = screen.getByLabelText("Precio neto c/u: Aceite vegetal");
    await user.clear(price); await user.type(price, "2500");
    expect(screen.getByRole("status").textContent).toContain("Los 3 productos coinciden");
    await user.click(screen.getByLabelText("Tengo la recepción"));
    expect(screen.getByRole("status").textContent).toContain("3 de 3");
    expect((received as HTMLInputElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(screen.getByRole("status").textContent).toContain("2 de 3");
    await user.clear(price);
    expect(screen.getByRole("status").textContent).toContain("Falta un valor válido");
    expect(screen.getByText("Por completar")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Todo coincide" }));
    expect(screen.getByRole("status").textContent).toContain("Los 3 productos coinciden");
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });
});
