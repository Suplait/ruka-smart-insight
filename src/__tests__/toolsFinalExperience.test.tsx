import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PurchaseCostTool from "@/pages/PurchaseCostTool";
import MarginTool from "@/pages/MarginTool";
import Resources from "@/pages/Resources";
import { ReconciliationFiles } from "@/components/seo/ReconciliationFiles";
import { sampleCsv } from "@/utils/reconciliationCsv";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const mount = (node: React.ReactNode) =>
  render(<MemoryRouter>{node}</MemoryRouter>);
const purchaseOutput = () =>
  screen.getByRole("region", { name: "Resultado del cálculo" });
function csvFile(text: string, name = "datos.csv") {
  const file = new File([text], name, { type: "text/csv" });
  Object.defineProperty(file, "arrayBuffer", {
    value: async () => new TextEncoder().encode(text).buffer,
  });
  return file;
}

describe("final tool workspace", () => {
  it("guides a task without navigating or hiding other tools", async () => {
    const user = userEvent.setup();
    mount(<Resources />);
    const region = screen.getByRole("region", {
      name: "Una pregunta. Una herramienta.",
    });
    const task = within(region).getByRole("button", {
      name: "Comparar dos compras",
    });
    await user.click(task);
    expect(task.getAttribute("aria-pressed")).toBe("true");
    expect(within(region).getByRole("status").textContent).toContain(
      "tamaño del envase",
    );
    expect(within(region).getAllByRole("link")).toHaveLength(4);
    await user.click(task);
    expect(task.getAttribute("aria-pressed")).toBe("false");
  });
  it.each([
    ["rentabilidad", "Margen y markup"],
    ["kilos", "Costo por kilo, litro o unidad"],
    ["conciliacion", "Factura, orden y recepción"],
  ])("finds %s using customer language", async (query, heading) => {
    const user = userEvent.setup();
    mount(<Resources />);
    await user.type(
      screen.getByRole("searchbox", { name: "Buscar un recurso" }),
      query,
    );
    expect(screen.getByRole("heading", { name: heading })).toBeTruthy();
  });
  it("shows all four tool destinations with an explicit current page", () => {
    mount(<PurchaseCostTool />);
    const nav = screen.getByRole("navigation", { name: "Herramientas" });
    expect(within(nav).getAllByRole("link")).toHaveLength(4);
    expect(
      within(nav)
        .getByRole("link", { name: "Costo unitario" })
        .getAttribute("aria-current"),
    ).toBe("page");
  });
  it("clears purchases without inventing a zero result and recovers both values", async () => {
    const user = userEvent.setup();
    mount(<PurchaseCostTool comparison />);
    await user.click(screen.getByRole("button", { name: "Usar mis datos" }));
    expect(purchaseOutput().textContent).toContain(
      "Aquí aparecerá tu resultado",
    );
    expect(
      (
        screen.getByRole("button", {
          name: "Copiar resumen",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    await user.click(
      screen.getByRole("button", { name: "Recuperar datos anteriores" }),
    );
    expect(purchaseOutput().textContent).toContain("6,67%");
    expect(
      (screen.getAllByLabelText("Total de la compra")[1] as HTMLInputElement)
        .value,
    ).toBe("80000");
  });
  it("swaps baseline and current purchase with the correct denominator", async () => {
    const user = userEvent.setup();
    mount(<PurchaseCostTool comparison />);
    await user.click(
      screen.getByRole("button", { name: "Intercambiar compras" }),
    );
    expect(purchaseOutput().textContent).toContain("-6,25%");
    await user.click(
      screen.getByRole("button", { name: "Intercambiar compras" }),
    );
    expect(purchaseOutput().textContent).toContain("6,67%");
  });
  it("validates only the field the person left, and explains hidden tax errors", async () => {
    const user = userEvent.setup();
    mount(<PurchaseCostTool />);
    const price = screen.getByLabelText("Total de la compra");
    const packs = screen.getByLabelText("Cantidad de envases");
    await user.clear(price);
    await user.tab();
    expect(price.getAttribute("aria-invalid")).toBe("true");
    expect(packs.getAttribute("aria-invalid")).toBe("false");
    await user.click(screen.getByText("Descuento e IVA", { exact: true }));
    await user.clear(screen.getByLabelText("Descuento (%)"));
    await user.type(screen.getByLabelText("Descuento (%)"), "101");
    await user.click(screen.getByText("Descuento e IVA", { exact: true }));
    expect(screen.getByRole("alert").textContent).toContain(
      "Abre «Descuento e IVA»",
    );
  });
  it("copies a contextual result only on request and invalidates copied feedback after editing", async () => {
    const user = userEvent.setup();
    const write = vi.spyOn(navigator.clipboard, "writeText");
    mount(<PurchaseCostTool />);
    expect(write).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Copiar resumen" }));
    expect(write.mock.calls[0][0]).toContain("CLP $3.000 / kg");
    expect(write.mock.calls[0][0]).toContain("Sin flete ni merma");
    expect(
      screen.getByRole("button", { name: "Resultado copiado" }),
    ).toBeTruthy();
    await user.type(screen.getByLabelText("Total de la compra"), "0");
    expect(screen.getByRole("button", { name: "Copiar resumen" })).toBeTruthy();
  });
  it("recovers gracefully from blocked clipboard access", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("denied"),
    );
    mount(<PurchaseCostTool />);
    await user.click(screen.getByRole("button", { name: "Copiar resumen" }));
    expect(screen.getByText(/Tu navegador no permitió copiar/)).toBeTruthy();
    expect(purchaseOutput().textContent).toContain("3.000");
  });
  it("applies and undoes a target price without changing cost", async () => {
    const user = userEvent.setup();
    mount(<MarginTool />);
    await user.click(screen.getByRole("button", { name: "50%" }));
    await user.click(
      screen.getByRole("button", { name: "Aplicar a mi precio de venta" }),
    );
    expect(
      (
        screen.getByLabelText(
          "Precio de venta neto por unidad",
        ) as HTMLInputElement
      ).value,
    ).toBe("12000");
    expect(
      (screen.getByLabelText("Costo neto por unidad") as HTMLInputElement)
        .value,
    ).toBe("6000");
    expect(
      screen.getByRole("region", { name: "Resultado del margen y markup" })
        .textContent,
    ).toContain("50%");
    await user.click(screen.getByRole("button", { name: "Deshacer" }));
    expect(
      (
        screen.getByLabelText(
          "Precio de venta neto por unidad",
        ) as HTMLInputElement
      ).value,
    ).toBe("10000");
  });
  it("does not apply an unreachable price or download incomplete margin data", async () => {
    const user = userEvent.setup();
    mount(<MarginTool />);
    const target = screen.getByLabelText("Margen objetivo sobre venta (%)");
    await user.clear(target);
    await user.type(target, "100");
    expect(
      screen.queryByRole("button", { name: "Aplicar a mi precio de venta" }),
    ).toBeNull();
    await user.clear(screen.getByLabelText("Costo neto por unidad"));
    expect(
      (
        screen.getByRole("button", {
          name: "Descargar CSV",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
  });
  it("reports a margin download failure without losing edits", async () => {
    const user = userEvent.setup();
    vi.stubGlobal("URL", {
      createObjectURL: () => {
        throw new Error("no download");
      },
    });
    mount(<MarginTool />);
    await user.click(screen.getByRole("button", { name: "Descargar CSV" }));
    expect(screen.getByRole("alert").textContent).toContain(
      "Tus datos siguen aquí",
    );
  });
});

describe("guided local CSV review", () => {
  it("paginates a real 51-row upload without losing the last row", async () => {
    const user = userEvent.setup();
    render(<ReconciliationFiles />);
    const csv =
      "referencia;codigo;unidad;cantidad;precio_neto\n" +
      Array.from({ length: 51 }, (_, i) => `OC-${i};SKU-${i};un;10;1000`).join(
        "\n",
      );
    for (const label of ["Orden de compra", "Factura", "Recepción"])
      await user.upload(
        screen.getByLabelText("Elegir CSV: " + label),
        csvFile(csv, label + ".csv"),
      );
    await user.click(screen.getByRole("button", { name: "Comparar archivos" }));
    expect(screen.getAllByRole("article")).toHaveLength(25);
    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(screen.getByRole("status").textContent).toContain("Página 2 de 3");
    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByRole("article").textContent).toContain("SKU-50");
    await user.selectOptions(
      screen.getByLabelText("Resultados por página"),
      "100",
    );
    expect(screen.getAllByRole("article")).toHaveLength(51);
    expect(screen.getByRole("status").textContent).toContain("Página 1 de 1");
  });
  it("collapses valid mappings, previews rows, and blocks a duplicate mapping before comparison", async () => {
    const user = userEvent.setup();
    render(<ReconciliationFiles />);
    await user.click(
      screen.getByRole("button", { name: /Cargar un caso de ejemplo/ }),
    );
    const mappings = screen.getAllByText("Revisar columnas");
    expect(mappings[1].closest("details")?.open).toBe(false);
    await user.click(mappings[1]);
    await user.selectOptions(
      screen.getByLabelText("Factura: Unidad"),
      "codigo",
    );
    expect(
      (
        screen.getByRole("button", {
          name: "Comparar archivos",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(screen.getByRole("alert").textContent).toContain("misma columna");
    await user.selectOptions(
      screen.getByLabelText("Factura: Unidad"),
      "unidad",
    );
    expect(
      (
        screen.getByRole("button", {
          name: "Comparar archivos",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false);
    await user.click(
      screen.getAllByText("Vista previa de las primeras filas")[1],
    );
    expect(
      screen.getByRole("table", { name: "Primeras tres filas de Factura" }),
    ).toBeTruthy();
  });
  it("removes one file, explains what is missing and can undo", async () => {
    const user = userEvent.setup();
    render(<ReconciliationFiles />);
    await user.click(
      screen.getByRole("button", { name: /Cargar un caso de ejemplo/ }),
    );
    await user.click(screen.getByRole("button", { name: "Quitar Factura" }));
    expect(screen.getByText("Falta cargar: Factura.")).toBeTruthy();
    expect(screen.queryByText("invoice-ejemplo.csv")).toBeNull();
    await user.click(
      screen.getByRole("button", { name: "Recuperar archivos anteriores" }),
    );
    expect(screen.getByText("invoice-ejemplo.csv")).toBeTruthy();
  });
  it("processes a dropped file locally and rejects multiple files per document", async () => {
    render(<ReconciliationFiles />);
    const zone = screen.getByLabelText("Elegir CSV: Factura").closest("label")!;
    const file = csvFile(sampleCsv.invoice, "factura-real.csv");
    fireEvent.dragOver(zone);
    expect(screen.getByText("Suelta el archivo aquí")).toBeTruthy();
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(await screen.findByText("factura-real.csv")).toBeTruthy();
    fireEvent.drop(zone, { dataTransfer: { files: [file, file] } });
    expect(screen.getByRole("alert").textContent).toContain("un solo archivo");
  });
  it("filters, recovers from no results and resets pagination when changing filters", async () => {
    const user = userEvent.setup();
    render(<ReconciliationFiles />);
    await user.click(
      screen.getByRole("button", { name: /Cargar un caso de ejemplo/ }),
    );
    await user.click(screen.getByRole("button", { name: "Comparar archivos" }));
    await user.click(screen.getByLabelText("Solo los que requieren revisión"));
    expect(
      screen.getByRole("button", { name: "Descargar selección (2)" }),
    ).toBeTruthy();
    await user.type(
      screen.getByRole("searchbox", { name: "Buscar en los resultados" }),
      "inexistente",
    );
    expect(
      (
        screen.getByRole("button", {
          name: "Descargar selección (0)",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    await user.click(
      screen.getByRole("button", { name: "Mostrar todos los cruces" }),
    );
    expect(
      screen.getByRole("button", { name: "Descargar selección (3)" }),
    ).toBeTruthy();
    await user.selectOptions(
      screen.getByLabelText("Resultados por página"),
      "50",
    );
    expect(screen.getByRole("status").textContent).toContain("Página 1 de 1");
  });
  it("never leaves a stale result after editing rules", async () => {
    const user = userEvent.setup();
    render(<ReconciliationFiles />);
    await user.click(
      screen.getByRole("button", { name: /Cargar un caso de ejemplo/ }),
    );
    await user.click(screen.getByRole("button", { name: "Comparar archivos" }));
    await user.selectOptions(
      screen.getByLabelText("Diferencia de precio permitida"),
      "2",
    );
    expect(screen.getByText(/Cambiaste los datos o las reglas/)).toBeTruthy();
    expect(
      screen.queryByRole("button", { name: "Descargar resultado completo" }),
    ).toBeNull();
    await user.click(screen.getByRole("button", { name: "Comparar archivos" }));
    expect(screen.queryByText(/Cambiaste los datos o las reglas/)).toBeNull();
  });
});
