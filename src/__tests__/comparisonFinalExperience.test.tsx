import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Comparison from "@/pages/Compare";
import comparisons from "@/content/comparisons.json";
import { comparisonDecisions } from "@/content/comparisonDecisions";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const tupana = comparisons.find(guide => guide.brand === "Tupana")!;
const mount = (guide = tupana) => render(<MemoryRouter><Comparison comparison={guide} /></MemoryRouter>);

describe("comparison final decision experience", () => {
  it("has a specific decision and three inspection points for every competitor", () => {
    expect(Object.keys(comparisonDecisions).sort()).toEqual(comparisons.map(guide => guide.brand).sort());
    for (const field of ["question", "manual", "outcome"] as const) expect(new Set(Object.values(comparisonDecisions).map(item => item[field])).size).toBe(9);
    expect(Object.values(comparisonDecisions).every(item => item.inspect.length === 3)).toBe(true);
  });

  it.each(comparisons)("preserves honest choices and all task evidence for $brand", async guide => {
    const user = userEvent.setup();
    mount(guide);
    expect(document.querySelector("header + div")).toBeTruthy();
    expect(document.querySelector("#encaje")?.textContent).toContain(guide.otherFit);
    await user.click(screen.getByRole("radio", { name: `Evaluar ${guide.brand}` }));
    expect(document.querySelector("#fit-alternative")?.hasAttribute("hidden")).toBe(false);
    expect(document.querySelector("#fit-ruka")?.hasAttribute("hidden")).toBe(true);
    await user.click(screen.getByRole("radio", { name: "Conservar y conectar" }));
    expect(within(document.getElementById("fit-together")!).getByRole("link", { name: "Conocer Ruka One" }).getAttribute("href")).toBe("/one");
    const task = guide.rows[2];
    await user.click(screen.getByRole("button", { name: `Priorizar ${task.task}`, exact: true }));
    await user.click(screen.getByRole("button", { name: "Mis prioridades (1)" }));
    const results = document.getElementById("comparison-task-results")!;
    expect(within(results).getAllByRole("article")).toHaveLength(1);
    expect(results.querySelectorAll("article")).toHaveLength(6);
    expect(results.textContent).toContain(task.ruka);
    await user.click(screen.getByRole("button", { name: "Copiar prioridades" }));
    const copy = await navigator.clipboard.readText();
    expect(copy).toContain(task.alternative);
    expect(copy).toContain(guide.sources[task.source].url);
    expect(copy).toContain("no prueba del servicio del competidor");
    await user.click(screen.getByRole("button", { name: "Copiar lista" }));
    const brief = await navigator.clipboard.readText();
    expect(brief).toContain(`### ${task.task}`);
    expect(brief).toContain(task.ruka);
    expect(brief).toContain(task.alternative);
  });

  it("recovers from empty priorities without losing the full comparison", async () => {
    const user = userEvent.setup(); mount();
    await user.click(screen.getByRole("button", { name: "Mis prioridades (0)" }));
    expect(screen.getByText("Todavía no marcaste una prioridad.")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Ver las seis tareas" }));
    expect(within(document.getElementById("comparison-task-results")!).getAllByRole("article")).toHaveLength(6);
  });

  it("filters from the compact mobile selector", async () => {
    const user = userEvent.setup(); mount();
    await user.selectOptions(screen.getByRole("combobox", { name: "Mostrar una tarea" }), "Detalle de la compra");
    expect(within(document.getElementById("comparison-task-results")!).getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Mostrando: Detalle de la compra.")).toBeTruthy();
    await user.selectOptions(screen.getByRole("combobox", { name: "Mostrar una tarea" }), "");
    expect(within(document.getElementById("comparison-task-results")!).getAllByRole("article")).toHaveLength(6);
  });

  it("opens evidence in place, exposes the official URL and returns focus", async () => {
    const user = userEvent.setup(); mount();
    const row = tupana.rows[0];
    const trigger = screen.getByRole("button", { name: `Fuente sobre ${row.task}: ${tupana.sources[row.source].label}` });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    const external = within(dialog).getByRole("link", { name: /Abrir fuente oficial/ });
    expect(external.getAttribute("href")).toBe(tupana.sources[row.source].url);
    expect(external.getAttribute("rel")).toContain("noopener");
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("includes reviewed points and notes in copy without submitting a form", async () => {
    const user = userEvent.setup(); mount();
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.type(screen.getByRole("textbox", { name: /Qué necesitas resolver tú/ }), "Conservar ERP. Revisar insumos.");
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("1");
    await user.click(screen.getByRole("button", { name: "Copiar lista" }));
    const copy = await navigator.clipboard.readText();
    expect(copy).toContain(`- [x] ${tupana.migration[0]}`);
    expect(copy).toContain("Conservar ERP. Revisar insumos.");
    expect(copy).toContain(tupana.otherFit);
    expect(copy).toContain(tupana.sources[0].url);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(document.querySelector("#antes-de-cambiar form")).toBeNull();
  });

  it("requires confirmation to clear notes and allows canceling", async () => {
    const user = userEvent.setup(); mount();
    const input = screen.getByRole("textbox", { name: /Qué necesitas resolver tú/ }) as HTMLTextAreaElement;
    await user.type(input, "No perder esta nota");
    await user.click(screen.getByRole("button", { name: "Limpiar revisión y notas" }));
    await user.click(screen.getByRole("button", { name: "Conservar notas" }));
    expect(input.value).toBe("No perder esta nota");
    await user.click(screen.getByRole("button", { name: "Limpiar revisión y notas" }));
    await user.click(screen.getByRole("button", { name: "Sí, limpiar" }));
    expect(input.value).toBe("");
    expect(screen.getByRole("status").textContent).toBe("Revisión y notas borradas. Tus prioridades se conservan.");
  });

  it("creates a correctly labeled local Markdown download with sources", async () => {
    const user = userEvent.setup(); mount();
    const create = vi.fn(() => "blob:comparison-qa");
    vi.stubGlobal("URL", Object.assign(URL, { createObjectURL: create, revokeObjectURL: vi.fn() }));
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe("ruka-vs-tupana-mi-pauta.md");
      expect(this.href).toBe("blob:comparison-qa");
    });
    await user.click(screen.getByRole("button", { name: "Descargar pauta (.md)" }));
    expect(create).toHaveBeenCalledOnce(); expect(click).toHaveBeenCalledOnce();
    expect((create.mock.calls[0] as unknown as [Blob])[0].type).toBe("text/markdown;charset=utf-8");
  });

  it("expands and collapses FAQs while all answers stay in the document", async () => {
    const user = userEvent.setup(); mount();
    await user.click(screen.getByRole("button", { name: "Ver todas las respuestas" }));
    expect(document.querySelectorAll("#preguntas details[open]")).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: "Cerrar respuestas" }));
    expect(document.querySelectorAll("#preguntas details[open]")).toHaveLength(0);
    for (const faq of tupana.faqs) expect(document.querySelector("#preguntas")?.textContent).toContain(faq.answer);
  });

  it("resets private workspace and decision mode on another competitor", async () => {
    const user = userEvent.setup(); const view = mount();
    await user.type(screen.getByRole("textbox", { name: /Qué necesitas resolver tú/ }), "Nota privada de esta comparación");
    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.click(screen.getByRole("radio", { name: "Evaluar Tupana" }));
    view.rerender(<MemoryRouter><Comparison comparison={comparisons[0]} /></MemoryRouter>);
    expect((screen.getByRole("textbox", { name: /Qué necesitas resolver tú/ }) as HTMLTextAreaElement).value).toBe("");
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
    expect((screen.getByRole("radio", { name: "Automatizar con Ruka" }) as HTMLInputElement).checked).toBe(true);
  });
});
