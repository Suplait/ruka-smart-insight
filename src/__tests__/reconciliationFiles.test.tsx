import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ReconciliationFiles } from "@/components/seo/ReconciliationFiles";
import { sampleCsv } from "@/utils/reconciliationCsv";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
describe("local-file reconciliation UI", () => {
  it("teaches an empty state, runs the sample and invalidates results when a rule changes", async () => {
    const user = userEvent.setup(); render(<ReconciliationFiles />);
    expect((screen.getByRole("button", { name: "Comparar archivos" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: /Cargar un caso de ejemplo/ }));
    await user.click(screen.getByRole("button", { name: "Comparar archivos" }));
    expect(screen.getByText("2 de 3 cruces requieren revisión.")).toBeTruthy();
    await user.selectOptions(screen.getByLabelText("Diferencia de precio permitida"), "1");
    expect(screen.queryByText("2 de 3 cruces requieren revisión.")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Comparar archivos" }));
    await user.click(screen.getByRole("button", { name: "Borrar archivos" }));
    expect(screen.queryByText("2 de 3 cruces requieren revisión.")).toBeNull();
    expect(screen.queryByText("invoice-ejemplo.csv")).toBeNull();
  });
  it("rejects broken mappings instead of displaying a false match", async () => {
    const user = userEvent.setup(); render(<ReconciliationFiles />);
    await user.click(screen.getByRole("button", { name: /Cargar un caso de ejemplo/ }));
    await user.selectOptions(screen.getByLabelText("Factura: Unidad"), "codigo");
    await user.click(screen.getByRole("button", { name: "Comparar archivos" }));
    expect(screen.getByRole("alert").textContent).toContain("misma columna");
    expect(screen.queryByRole("button", { name: /Descargar resultado completo/ })).toBeNull();
  });
  it("rejects oversized files and removes the previous document from the comparison", async () => {
    const user = userEvent.setup(); render(<ReconciliationFiles />);
    await user.click(screen.getByRole("button", { name: /Cargar un caso de ejemplo/ }));
    await user.upload(screen.getByLabelText("Elegir CSV: Factura"), new File(["x".repeat(2_000_001)], "large.csv", { type: "text/csv" }));
    expect(screen.getByRole("alert").textContent).toContain("2 MB");
    expect((screen.getByRole("button", { name: "Comparar archivos" }) as HTMLButtonElement).disabled).toBe(true);
  });
  it("performs example comparison without fetch or storage calls", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");
    const user = userEvent.setup(); render(<ReconciliationFiles />);
    await user.click(screen.getByRole("button", { name: /Cargar un caso de ejemplo/ }));
    await user.click(screen.getByRole("button", { name: "Comparar archivos" }));
    expect(fetchSpy).not.toHaveBeenCalled(); expect(storageSpy).not.toHaveBeenCalled();
    await user.click(screen.getByLabelText("Solo los que requieren revisión"));
    expect(screen.getByRole("status").textContent).toContain("2 cruces");
  });
  it("blocks comparing real files against leftover sample documents", async () => {
    const user = userEvent.setup(); render(<ReconciliationFiles />);
    await user.click(screen.getByRole("button", { name: /Cargar un caso de ejemplo/ }));
    const file = new File([sampleCsv.invoice], "mi-factura.csv", { type: "text/csv" });
    Object.defineProperty(file, "arrayBuffer", { value: async () => new TextEncoder().encode(sampleCsv.invoice).buffer });
    await user.upload(screen.getByLabelText("Elegir CSV: Factura"), file);
    expect(screen.getByRole("alert").textContent).toContain("mezclados con datos de ejemplo");
    expect((screen.getByRole("button", { name: "Comparar archivos" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("button", { name: /Cargar un caso de ejemplo/ }));
    expect(screen.queryByRole("alert")).toBeNull();
    expect((screen.getByRole("button", { name: "Comparar archivos" }) as HTMLButtonElement).disabled).toBe(false);
  });
});
