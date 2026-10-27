import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PurchaseCostTool from "@/pages/PurchaseCostTool";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe("purchase comparison workspace", () => {
  it("preserves local calculations, rejects incompatible currencies and resets", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    const user = userEvent.setup();
    render(<MemoryRouter><PurchaseCostTool comparison /></MemoryRouter>);
    const current = screen.getByRole("group", { name: "Compra actual" });
    const output = screen.getByRole("region", { name: "Resultado del cálculo" });
    expect(output.textContent).toContain("6,67");
    await user.selectOptions(within(current).getByLabelText("Moneda"), "USD");
    expect(output.textContent).toContain("Usa la misma moneda");
    expect((screen.getByRole("button", { name: "Descargar resultado CSV" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: "Restablecer ejemplo" }));
    expect(output.textContent).toContain("6,67");
    const price = within(current).getByLabelText("Total de la compra");
    await user.clear(price); await user.tab();
    expect(price.getAttribute("aria-invalid")).toBe("true");
    expect(output.textContent).toContain("Aquí aparecerá tu resultado");
    expect(fetch).not.toHaveBeenCalled();
  });
});
