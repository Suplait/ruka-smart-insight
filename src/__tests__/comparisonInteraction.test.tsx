import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Comparison, { CompareIndex } from "@/pages/Compare";
import comparisons from "@/content/comparisons.json";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const tupana = comparisons.find(item => item.brand === "Tupana")!;
const mount = () => render(<MemoryRouter><Comparison comparison={tupana} /></MemoryRouter>);

describe("comparison interactions", () => {
  it("compares one task and restores all six with keyboard or pointer", async () => {
    const user = userEvent.setup();
    mount();
    const results = document.getElementById("comparison-task-results")!;
    expect(within(results).getAllByRole("article")).toHaveLength(6);
    const task = screen.getByRole("button", { name: "Detalle de la compra" });
    task.focus();
    await user.keyboard("{Enter}");
    expect(task.getAttribute("aria-pressed")).toBe("true");
    expect(within(results).getAllByRole("article")).toHaveLength(1);
    expect(within(results).getByRole("heading", { name: "Detalle de la compra" })).toBeTruthy();
    expect(results.querySelectorAll("article")).toHaveLength(6);
    expect(screen.getByText("Mostrando: Detalle de la compra.")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Volver a la comparación completa" }));
    expect(within(results).getAllByRole("article")).toHaveLength(6);
    expect(screen.getByRole("button", { name: "Todas las tareas" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("resets task selection when the guide changes", async () => {
    const user = userEvent.setup();
    const view = mount();
    await user.click(screen.getByRole("button", { name: "Detalle de la compra" }));
    view.rerender(<MemoryRouter><Comparison comparison={comparisons.find(item => item.brand === "Chipax")!} /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Ruka vs. Chipax" })).toBeTruthy();
    expect(within(document.getElementById("comparison-task-results")!).getAllByRole("article")).toHaveLength(6);
    expect(screen.queryByRole("button", { name: "Saco de 25 kg" })).toBeNull();
    expect(document.querySelector("#ruka-en-operacion img")?.getAttribute("src")).toContain("recepcion-cantidades");
  });

  it("filters by category and search, and recovers from empty results", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><CompareIndex /></MemoryRouter>);
    await user.click(screen.getByRole("button", { name: "ERP y contabilidad" }));
    expect(screen.getByRole("status").textContent).toBe("3 comparativas");
    const input = screen.getByRole("searchbox", { name: "Buscar una alternativa" });
    await user.type(input, "kame");
    expect(screen.getByRole("status").textContent).toBe("1 comparativa");
    expect(screen.getByRole("heading", { name: "Ruka vs. KAME" })).toBeTruthy();
    await user.type(input, "zzzz");
    expect(screen.getByRole("status").textContent).toBe("0 comparativas");
    await user.click(screen.getByRole("button", { name: "Limpiar filtros" }));
    expect(screen.getByRole("status").textContent).toBe("9 comparativas");
    expect((input as HTMLInputElement).value).toBe("");
  });

  it("changes the cost example with pointer or keyboard without touching a form", async () => {
    const user = userEvent.setup();
    mount();
    const sack = screen.getByRole("button", { name: "Saco de 25 kg" });
    expect(sack.getAttribute("aria-pressed")).toBe("false");
    await user.click(sack);
    expect(sack.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(/Esta presentación cuesta 6,67%/)).toBeTruthy();
    const box = screen.getByRole("button", { name: "Caja de 6 kg" });
    box.focus();
    await user.keyboard("{Enter}");
    expect(box.getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText("El total de la factura no basta para comparar costos.")).toBeTruthy();
  });

  it("opens the product detail and closes with Escape", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Ampliar detalle de compra en Ruka" }));
    expect(within(screen.getByRole("dialog")).getByRole("heading", { name: "Detalle de compra en Ruka" })).toBeTruthy();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("copies the optional implementation checklist", async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole("button", { name: "Copiar lista" }));
    expect(await navigator.clipboard.readText()).toContain("https://www.ruka.ai/comparar/ruka-vs-tupana");
    expect(screen.getByRole("status").textContent).toContain("Puedes pegarla");
  });

  it("shows a usable fallback when clipboard is unavailable", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("blocked"));
    mount();
    await user.click(screen.getByRole("button", { name: "Copiar lista" }));
    expect(screen.getByRole("status").textContent).toContain("Puedes seleccionar el texto");
  });

  it("does not silently serve a valid comparison for an unknown slug", () => {
    render(<MemoryRouter initialEntries={["/comparar/not-a-guide"]}><Routes><Route path="/comparar/:slug" element={<Comparison />} /></Routes></MemoryRouter>);
    expect(screen.queryByRole("heading", { name: "Ruka vs. Tupana" })).toBeNull();
    expect(document.querySelector("main")?.textContent).toMatch(/404|encontr/i);
  });
});
