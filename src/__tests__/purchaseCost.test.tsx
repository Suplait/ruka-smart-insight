import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PurchaseCostTool from "@/pages/PurchaseCostTool";
import { calculatePurchaseCost, comparePurchaseCosts, decimalValue, examplePurchase, purchaseCostCsv, type PurchaseCostInput } from "@/utils/purchaseCost";

function value(overrides: Partial<PurchaseCostInput> = {}) {
  const result = calculatePurchaseCost({ ...examplePurchase, ...overrides });
  if (result.ok === false) throw new Error(JSON.stringify(result.errors));
  return result.value;
}

describe("local purchase cost arithmetic", () => {
  it("exports numeric results as a local semicolon CSV with BOM and no user expressions", () => {
    const csv = purchaseCostCsv([value(), value({ price: "80000", packs: "1", content: "25" })]);
    expect(csv.startsWith("\uFEFFCompra;")).toBe(true);
    expect(csv).toContain("Anterior;CLP;6;kg;18000;3000");
    expect(csv).toContain("Actual;CLP;25;kg;80000;3200");
    expect(csv).not.toContain("=");
  });
  it("normalizes six 1 kg packs and a 25 kg sack without rounding intermediates", () => {
    expect(value().unitCost).toBe(3000);
    expect(value({ price: "80000", packs: "1", content: "25" }).unitCost).toBe(3200);
    const comparison = comparePurchaseCosts(value(), value({ price: "80000", packs: "1", content: "25" }));
    expect(comparison.ok && comparison.percent).toBeCloseTo(6.6666666667);
  });
  it("converts grams and milliliters, but keeps pieces as pieces", () => {
    expect(value({ content: "1000", unit: "g" })).toEqual(value());
    expect(value({ content: "1000", unit: "ml" })).toEqual(value({ unit: "l" }));
    expect(value({ unit: "un" }).unit).toBe("un");
  });
  it("removes included tax and applies discount only once", () => {
    expect(value({ price: "21420", taxIncluded: true }).unitCost).toBeCloseTo(3000);
    expect(value({ price: "21420", taxIncluded: true, discount: "10" }).unitCost).toBeCloseTo(2700);
    expect(value({ discount: "100" }).unitCost).toBe(0);
    expect(value({ taxRate: "", taxIncluded: false }).unitCost).toBe(3000);
  });
  it.each(["", "0", "-1", "Infinity", "NaN", "1e20", "1000000000001", "1.000.000", "1,234.56", "abc", "0.0000001"])("rejects invalid positive inputs: %s", price => {
    expect(calculatePurchaseCost({ ...examplePurchase, price }).ok).toBe(false);
    expect(calculatePurchaseCost({ ...examplePurchase, packs: price }).ok).toBe(false);
    expect(calculatePurchaseCost({ ...examplePurchase, content: price }).ok).toBe(false);
  });
  it.each(["-1", "101", "", "xyz"])("rejects invalid discounts and tax: %s", invalid => {
    expect(calculatePurchaseCost({ ...examplePurchase, discount: invalid }).ok).toBe(false);
    expect(calculatePurchaseCost({ ...examplePurchase, taxIncluded: true, taxRate: invalid }).ok).toBe(false);
  });
  it("accepts comma decimals without silently interpreting thousands", () => {
    expect(decimalValue(" 12,5 ")).toBe(12.5);
    expect(decimalValue("12.5")).toBe(12.5);
    expect(decimalValue("1 000")).toBeNaN();
  });
  it("refuses comparisons across dimensions or currencies or from a zero base", () => {
    expect(comparePurchaseCosts(value(), value({ unit: "l" })).ok).toBe(false);
    expect(comparePurchaseCosts(value(), value({ currency: "USD" })).ok).toBe(false);
    expect(comparePurchaseCosts(value({ discount: "100" }), value()).ok).toBe(false);
    expect(comparePurchaseCosts(value(), value({ price: "9000" }))).toMatchObject({ ok: true, percent: -50 });
    expect(comparePurchaseCosts(value(), value())).toMatchObject({ ok: true, percent: 0 });
  });
});

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/seo/MarketingSeo", () => ({ MarketingSeo: () => null }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("calculator interaction and privacy", () => {
  it("updates, validates, separates tax and restores without a request or persistence", async () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    const storage = vi.spyOn(Storage.prototype, "setItem");
    const user = userEvent.setup();
    render(<MemoryRouter><PurchaseCostTool /></MemoryRouter>);
    expect(screen.getByRole("region", { name: "Resultado del cálculo" }).textContent).toContain("CLP $3.000");
    const price = screen.getByLabelText("Total de la compra");
    await user.clear(price); await user.tab();
    expect(price.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("region", { name: "Resultado del cálculo" }).textContent).toContain("Completa");
    await user.type(price, "21420");
    await user.click(screen.getByText("Descuento e IVA"));
    await user.click(screen.getByLabelText("El precio ingresado incluye IVA"));
    expect(screen.getByRole("region", { name: "Resultado del cálculo" }).textContent).toContain("CLP $3.000");
    await user.click(screen.getByRole("button", { name: "Restablecer ejemplo" }));
    expect((price as HTMLInputElement).value).toBe("18000");
    expect(screen.queryByLabelText("IVA incluido (%)")).toBeNull();
    expect(fetch).not.toHaveBeenCalled(); expect(storage).not.toHaveBeenCalled();
  });
  it("explains non-comparable purchases rather than showing a misleading percentage", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><PurchaseCostTool comparison /></MemoryRouter>);
    expect(screen.getByRole("region", { name: "Resultado del cálculo" }).textContent).toContain("+6,67%");
    const current = within(screen.getByRole("group", { name: "Compra actual" }));
    await user.selectOptions(current.getByLabelText("Unidad del contenido"), "l");
    expect(screen.getByRole("region", { name: "Resultado del cálculo" }).textContent).toContain("No convertimos kilos en litros");
    await user.selectOptions(current.getByLabelText("Unidad del contenido"), "kg");
    await user.selectOptions(current.getByLabelText("Moneda"), "USD");
    expect(screen.getByRole("region", { name: "Resultado del cálculo" }).textContent).toContain("misma moneda");
  });
});
