import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ApiExplorer } from "@/components/resources/ApiExplorer";
import { ApiPaths, ApiStart } from "@/components/resources/ApiPaths";
import { ApiReadiness, ApiErrorGuide } from "@/components/resources/ApiReadiness";
import { ApiDeliveryGuide } from "@/components/resources/ApiDeliveryGuide";
import { apiCatalog, requestExample } from "@/content/developerExperience";
import { editableParameters, operationGroup, requestIssues } from "@/utils/developerWorkbench";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const op = (id: string) => apiCatalog.entries.find(item => item.id === id)!;

describe("API workspace controls", () => {
  it("searches accent-insensitively, combines family filters and recovers from no matches", async () => {
    const user = userEvent.setup(); render(<ApiExplorer />);
    await user.type(screen.getByLabelText("Buscar operación"), "clasificacion");
    expect(screen.getByText("1 de 10 operaciones")).toBeTruthy();
    await user.selectOptions(screen.getByLabelText("Familia"), "Webhooks");
    expect(screen.getByText("0 de 10 operaciones")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Líneas de compra" })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Limpiar filtros" }));
    expect(screen.getByText("10 de 10 operaciones")).toBeTruthy();
    await user.type(screen.getByLabelText("Buscar operación"), "PATCH");
    expect(screen.getByText("1 de 10 operaciones")).toBeTruthy();
  });
  it("shows types, defaults and accepted values for searched optional parameters", async () => {
    const user = userEvent.setup(); render(<ApiExplorer />);
    await user.click(screen.getByRole("button", { name: /^Parámetros/ }));
    await user.type(screen.getByLabelText("Buscar un parámetro"), "reviewed");
    const panel = within(document.getElementById("api-panel-parameters")!);
    expect(panel.getByText("1 parámetros encontrados")).toBeTruthy();
    expect(panel.getByText("all · yes · no")).toBeTruthy();
    expect(panel.getByText('"all"')).toBeTruthy();
    await user.clear(screen.getByLabelText("Buscar un parámetro"));
    await user.type(screen.getByLabelText("Buscar un parámetro"), "no-existe");
    await user.click(screen.getByRole("button", { name: "Limpiar búsqueda de parámetros" }));
    expect(panel.getByRole("heading", { name: "Parámetros obligatorios" })).toBeTruthy();
  });
  it("edits a request, prevents invalid copy/download and restores original examples", async () => {
    const user = userEvent.setup(); render(<ApiExplorer />);
    await user.click(screen.getByText(/Ajustar parámetros del ejemplo/));
    const perPage = screen.getByLabelText(/per_page/);
    await user.clear(perPage); await user.type(perPage, "101");
    expect(perPage.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("button", { name: "Descargar ejemplo" }).hasAttribute("disabled")).toBe(true);
    expect(screen.queryByRole("button", { name: "Copiar código" })).toBeNull();
    await user.clear(perPage); await user.type(perPage, "25");
    expect(screen.getByLabelText(/Código: GET/).textContent).toContain("per_page=25");
    await user.click(screen.getByRole("button", { name: "Node.js" }));
    expect(screen.getByLabelText(/Código: GET/).textContent).toContain("per_page=25");
    await user.click(screen.getByRole("button", { name: "Restablecer valores de ejemplo" }));
    expect(screen.getByLabelText(/Código: GET/).textContent).toContain("per_page=50");
  });
  it("keeps document folios as text with leading zeroes", async () => {
    const user = userEvent.setup(); render(<ApiExplorer />);
    await user.selectOptions(screen.getByLabelText("Operación", { exact: true }), "v1-purchase-document");
    await user.click(screen.getByText(/Ajustar parámetros del ejemplo/));
    await user.clear(screen.getByLabelText(/folio/)); await user.type(screen.getByLabelText(/folio/), "00017");
    expect(screen.getByLabelText(/Código: GET/).textContent).toContain("folio=00017");
    await user.selectOptions(screen.getByLabelText("Operación", { exact: true }), "v1-purchase-lines");
    expect(screen.getByLabelText(/Código: GET/).textContent).not.toContain("folio=");
  });
  it("labels observed response types without inventing a response schema", async () => {
    const user = userEvent.setup(); render(<ApiExplorer />);
    await user.click(screen.getByRole("button", { name: /^Respuestas/ }));
    await user.click(screen.getByText("Leer los campos de este ejemplo"));
    expect(screen.getByText(/Primer registro de data/)).toBeTruthy();
    expect(screen.getAllByText("string · texto").length).toBeGreaterThan(0);
    expect(screen.getByText(/no reemplazan el esquema del contrato/)).toBeTruthy();
  });
  it("downloads only the selected script and makes download failure recoverable", async () => {
    const user = userEvent.setup(); render(<ApiExplorer />);
    vi.stubGlobal("URL", class extends URL { static createObjectURL = vi.fn(() => "blob:qa"); static revokeObjectURL = vi.fn(); });
    let filename = "";
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function () { filename = this.download; });
    await user.click(screen.getByRole("button", { name: "Node.js" }));
    await user.click(screen.getByRole("button", { name: "Descargar ejemplo" }));
    expect(filename).toBe("ruka-v1-purchase-lines.mjs");
    vi.spyOn(URL, "createObjectURL").mockImplementation(() => { throw new Error("blocked"); });
    await user.click(screen.getByRole("button", { name: "Descargar ejemplo" }));
    expect(screen.getByText("No pudimos descargar. Puedes copiar el código.")).toBeTruthy();
  });
  it("does not request credentials, send requests or edit mutations", async () => {
    const user = userEvent.setup(); const fetch = vi.fn(); vi.stubGlobal("fetch", fetch); render(<ApiExplorer />);
    for (const id of ["v1-webhooks-create", "v1-webhooks-update", "v1-webhooks-delete"]) {
      await user.selectOptions(screen.getByLabelText("Operación", { exact: true }), id);
      expect(screen.queryByText(/Ajustar parámetros del ejemplo/)).toBeNull();
      expect(screen.getByText("Modifica configuración")).toBeTruthy();
    }
    expect(document.querySelector('input[type="password"]')).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("local API integration guidance", () => {
  it("connects each use case to the right operation and guide", async () => {
    const user = userEvent.setup(); const select = vi.fn(); render(<MemoryRouter><ApiPaths onSelect={select} /></MemoryRouter>);
    for (const [label, id, guide] of [["Construir un dashboard", "v1-purchase-lines", "dashboard-costos"], ["Conectar un ERP", "v1-purchase-book", "compras-revisadas-erp"], ["Recibir cambios", "v1-webhooks-create", "recibir-webhooks"]]) {
      await user.click(screen.getByRole("button", { name: label }));
      await user.click(screen.getByRole("link", { name: "Ver esta operación" }));
      expect(select).toHaveBeenLastCalledWith(id);
      expect(screen.getByRole("link", { name: "Guía paso a paso" }).getAttribute("href")).toBe(`/desarrolladores/guias/${guide}`);
    }
  });
  it("makes access, first request and next operation separately actionable", async () => {
    const user = userEvent.setup(); render(<ApiStart />);
    await user.click(screen.getByRole("button", { name: "1. Habilita el acceso" }));
    expect(screen.getByRole("link", { name: "Revisar acceso con mi cuenta" }).getAttribute("href")).toBe(`${apiCatalog.reference}/login`);
    await user.click(screen.getByRole("button", { name: "3. Consulta tus datos" }));
    expect(screen.getByRole("link", { name: "Elegir una operación" }).getAttribute("href")).toBe("#explorar-api");
  });
  it("copies the personal checklist, resets it and never claims a completed integration", async () => {
    const user = userEvent.setup(); render(<ApiReadiness />);
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    await user.click(screen.getByRole("checkbox", { name: /Acceso y empresas confirmados/ }));
    await user.click(screen.getByRole("button", { name: "Copiar pauta" }));
    expect(copy.mock.calls[0][0]).toContain("- [x] Acceso y empresas confirmados");
    expect(copy.mock.calls[0][0]).toContain("no validación automática");
    expect(screen.getByLabelText("Puntos revisados por ti").getAttribute("value")).toBe("1");
    await user.click(screen.getByRole("button", { name: "Restablecer la pauta" }));
    expect(screen.getByLabelText("Puntos revisados por ti").getAttribute("value")).toBe("0");
  });
  it("recovers from checklist copy failures", async () => {
    const user = userEvent.setup(); render(<ApiReadiness />);
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("blocked"));
    await user.click(screen.getByRole("button", { name: "Copiar pauta" }));
    expect(screen.getByText("No pudimos copiar. Puedes descargar la pauta.")).toBeTruthy();
  });
  it("maps HTTP errors to real catalog operation links", async () => {
    const user = userEvent.setup(); render(<ApiErrorGuide />);
    await user.click(screen.getByRole("button", { name: "HTTP 409" }));
    expect(screen.getByText("ambiguous_document")).toBeTruthy();
    expect(screen.getByText("webhook_exists")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "HTTP 503" }));
    expect(screen.getByText("pdf_unavailable")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Documento de compra/ }).getAttribute("href")).toBe(`${apiCatalog.reference}#v1-purchase-document`);
  });
  it("explains duplicate and invalid webhook treatment without sending events", async () => {
    const user = userEvent.setup(); const fetch = vi.fn(); vi.stubGlobal("fetch", fetch); render(<ApiDeliveryGuide />);
    await user.click(screen.getByRole("button", { name: "Evento repetido" }));
    expect(screen.getByRole("heading", { name: "Mismo evento, un solo efecto." })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Firma inválida" }));
    expect(screen.getByRole("heading", { name: "Sin autenticidad, no hay trabajo que ejecutar." })).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });
});

describe("request validation and generation", () => {
  for (const operation of apiCatalog.entries) it(`accepts the reviewed defaults: ${operation.id}`, () => {
    expect(requestIssues(operation, {})).toEqual({});
    if (operation.method !== "GET") expect(editableParameters(operation)).toEqual([]);
    expect(["Acceso", "Compras", "Webhooks"]).toContain(operationGroup(operation));
  });
  it.each([
    [{ per_page: "101" }, "per_page"], [{ page: "0" }, "page"], [{ page: "1.5" }, "page"], [{ page: "9007199254740993" }, "page"],
    [{ issued_from: "" }, "issued_from"], [{ issued_from: "2026-02-30" }, "issued_from"], [{ issued_from: "bad" }, "issued_from"],
    [{ issued_from: "2026-08-20", issued_to: "2026-08-19" }, "issued_to"], [{ issued_from: "2026-08-01", issued_to: "2026-09-02" }, "issued_to"],
  ])("rejects invalid input %j", (values, field) => { expect(requestIssues(op("v1-purchase-lines"), values)[field]).toBeTruthy(); });
  it("distinguishes inclusive 31-day differences from a purchase book month", () => {
    expect(requestIssues(op("v1-purchase-lines"), { issued_from: "2026-08-01", issued_to: "2026-09-01" })).toEqual({});
    expect(requestIssues(op("v1-purchase-book"), { start_date: "2026-01-31", end_date: "2026-02-27" })).toEqual({});
    expect(requestIssues(op("v1-purchase-book"), { start_date: "2026-01-31", end_date: "2026-02-28" }).end_date).toBeTruthy();
    expect(requestIssues(op("v1-purchase-book"), { start_date: "2024-01-31", end_date: "2024-02-28" })).toEqual({});
    expect(requestIssues(op("v1-purchase-book"), { start_date: "2024-01-31", end_date: "2024-02-29" }).end_date).toBeTruthy();
  });
  it("ignores unknown parameter overrides and preserves fixed hosts and auth variables", () => {
    const code = requestExample(op("v1-purchase-lines"), "node", { evil: "pwn", host: "https://evil.test", per_page: "25" });
    expect(code).not.toContain("evil"); expect(code).toContain("api.rukafactura.cl"); expect(code).toContain("per_page=25"); expect(code).toContain("process.env.RUKA_API_KEY");
    const path = requestExample(op("v1-product-classification"), "node", { id: "../bad?x=1" });
    expect(path).not.toContain("/../"); expect(path).toContain("%2F");
  });
});
