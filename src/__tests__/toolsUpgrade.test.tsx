import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import PurchaseCostTool from "@/pages/PurchaseCostTool";
import MarginTool from "@/pages/MarginTool";
import Resources from "@/pages/Resources";
import { ReconciliationFiles } from "@/components/seo/ReconciliationFiles";
import { costFaqs, marginFaqs, variationFaqs } from "@/content/toolGuides";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const mount = (element: React.ReactNode) => render(<MemoryRouter>{element}</MemoryRouter>);
const output = () => screen.getByRole("region", { name: "Resultado del cálculo" });

describe("tool experience upgrade", () => {
  it("explains normalized costs and impact for weight, volume and tax scenarios", async () => {
    const user = userEvent.setup(); mount(<PurchaseCostTool comparison />);
    expect(output().textContent).toContain("5.000 más");
    await user.click(screen.getByRole("button", { name: "Botellas y bidones" }));
    expect(output().textContent).toContain("-10%");
    expect(output().textContent).toContain("2.000 menos");
    await user.click(screen.getByRole("button", { name: "Precio con IVA" }));
    expect(output().textContent).toContain("5,56%");
    expect(output().textContent).toContain("1.000 más");
    expect(screen.getByRole("region", { name: "Desglose del cálculo" }).textContent).toContain("18.000 netos");
  });
  it("does not compare kilograms with litres or offer an invalid download", async () => {
    const user = userEvent.setup(); mount(<PurchaseCostTool comparison />);
    await user.selectOptions(within(screen.getByRole("group", { name: "Compra actual" })).getByLabelText("Unidad del contenido"), "l");
    expect(output().textContent).toContain("No convertimos kilos en litros");
    expect(screen.queryByText("Impacto en esta compra")).toBeNull();
    expect((screen.getByRole("button", { name: "Descargar resultado CSV" }) as HTMLButtonElement).disabled).toBe(true);
  });
  it("keeps both purchases when switching the mobile editor", async () => {
    const user = userEvent.setup(); mount(<PurchaseCostTool comparison />);
    await user.click(screen.getByRole("button", { name: "Editar actual" }));
    const input = within(screen.getByRole("group", { name: "Compra actual" })).getByLabelText("Total de la compra");
    await user.clear(input); await user.type(input, "75000");
    await user.click(screen.getByRole("button", { name: "Editar anterior" }));
    expect((input as HTMLInputElement).value).toBe("75000");
    expect(output().textContent).toContain("El costo se mantiene");
  });
  it("recovers from failed CSV download without losing values", async () => {
    vi.stubGlobal("URL", { createObjectURL: () => { throw new Error("unavailable"); } });
    const user = userEvent.setup(); mount(<PurchaseCostTool />);
    await user.click(screen.getByRole("button", { name: "Descargar resultado CSV" }));
    expect(screen.getByRole("alert").textContent).toContain("Tus datos siguen aquí");
    expect((screen.getByLabelText("Total de la compra") as HTMLInputElement).value).toBe("18000");
  });
  it("explains loss instead of painting a negative margin as success", async () => {
    const user = userEvent.setup(); mount(<MarginTool />);
    await user.click(screen.getByRole("button", { name: "Venta bajo costo" }));
    const result = screen.getByRole("region", { name: "Resultado del margen y markup" });
    expect(result.textContent).toContain("-20%");
    expect(result.textContent).toContain("pierdes 20");
    expect(screen.queryByText("Así se reparte tu precio de venta")).toBeNull();
    await user.click(screen.getByRole("button", { name: "40% de recargo" }));
    expect(result.textContent).toContain("28,57%");
    await user.click(screen.getByRole("button", { name: "50%" }));
    expect(screen.getByText("Precio neto orientativo: 12.000")).toBeTruthy();
  });
  it.each([[costFaqs], [variationFaqs], [marginFaqs]])("has four distinct, substantive educational answers", faqs => {
    expect(faqs).toHaveLength(4);
    expect(new Set(faqs.map(faq => faq.question)).size).toBe(4);
    for (const faq of faqs) expect(faq.answer.length).toBeGreaterThan(100);
  });
  it("places all four tools together and counts search results consistently", async () => {
    const user = userEvent.setup(); mount(<Resources />);
    const section = screen.getByRole("region", { name: "Una pregunta. Una herramienta." });
    expect(within(section).getAllByRole("link")).toHaveLength(4);
    await user.type(screen.getByRole("searchbox", { name: "Buscar un recurso" }), "margen");
    expect(screen.getByRole("status").textContent).toContain("1 recurso encontrado");
    expect(within(section).getAllByRole("link")).toHaveLength(1);
  });
  it("shows file preparation and clears it when a sample is loaded", async () => {
    const user = userEvent.setup(); mount(<ReconciliationFiles />);
    await user.click(screen.getByText("Qué preparar antes de cargar tus CSV"));
    expect(screen.getByRole("table", { name: /clave compartida/ })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /Cargar un caso de ejemplo/ }));
    expect(screen.queryByRole("table", { name: /clave compartida/ })).toBeNull();
    expect(screen.getByText(/3 de 3 archivos cargados/)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Comparar archivos" }));
    expect(screen.getByText("2 de 3 cruces requieren revisión.")).toBeTruthy();
    expect(screen.getByText("Por revisar")).toBeTruthy();
  });
});
