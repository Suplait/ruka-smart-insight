import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApiExplorer } from "@/components/resources/ApiExplorer";
import { apiCatalog, requestExample } from "@/content/developerExperience";

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("developer portal", () => {
  it("switches request language and detail views without making API requests", async () => {
    const user = userEvent.setup();
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    render(<ApiExplorer />);
    await user.click(screen.getByRole("button", { name: "Node.js" }));
    expect(within(document.getElementById("api-panel-request")!).getByText(/process.env.RUKA_API_KEY/)).toBeTruthy();
    const parameters = screen.getByRole("button", { name: /^Parámetros/ });
    parameters.focus(); await user.keyboard("{Enter}");
    expect(parameters.getAttribute("aria-pressed")).toBe("true");
    expect(document.getElementById("api-panel-request")?.hidden).toBe(true);
    expect(document.getElementById("api-panel-parameters")?.hidden).toBe(false);
    await user.click(screen.getByRole("button", { name: /^Respuestas/ }));
    await user.selectOptions(screen.getByLabelText("Respuesta de ejemplo"), "2");
    expect(screen.getByLabelText("Código: Respuesta sintética · HTTP 401")).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("resets language, response and panel on operation change and explains mutations", async () => {
    const user = userEvent.setup(); render(<ApiExplorer />);
    await user.click(screen.getByRole("button", { name: "Node.js" }));
    await user.click(screen.getByRole("button", { name: /^Respuestas/ }));
    await user.selectOptions(screen.getByLabelText("Respuesta de ejemplo"), "2");
    await user.selectOptions(screen.getByLabelText("Operación", { exact: true }), "v1-webhooks-delete");
    expect(screen.getByRole("button", { name: "cURL" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Petición" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByText(/la baja no se puede deshacer/)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /^Respuestas/ }));
    expect(screen.getByLabelText("Código: Respuesta sintética · HTTP 204")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: /PATCH Actualizar webhook/ }));
    expect(screen.getByRole("heading", { name: "Actualizar webhook" })).toBeTruthy();
  });

  it("shows raw XML, not a quoted JSON string, and makes copy failure recoverable", async () => {
    const user = userEvent.setup(); render(<ApiExplorer />);
    await user.selectOptions(screen.getByLabelText("Operación", { exact: true }), "v1-purchase-document");
    await user.click(screen.getByRole("button", { name: /^Respuestas/ }));
    await user.selectOptions(screen.getByLabelText("Respuesta de ejemplo"), "1");
    expect(screen.getByLabelText("Código: Respuesta sintética · HTTP 200").textContent).toMatch(/^<\?xml/);
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("blocked"));
    await user.click(within(document.getElementById("api-panel-responses")!).getByRole("button", { name: "Copiar código" }));
    expect(screen.getByText(/Selecciona el código y cópialo manualmente/)).toBeTruthy();
  });

  it("copies only the selected example", async () => {
    const user = userEvent.setup(); render(<ApiExplorer />);
    const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(undefined);
    await user.click(within(document.getElementById("api-panel-request")!).getByRole("button", { name: "Copiar código" }));
    expect(copy).toHaveBeenCalledWith(requestExample(apiCatalog.entries.find(op => op.id === "v1-purchase-lines")!, "curl"));
    expect(screen.getByText("Código copiado al portapapeles.")).toBeTruthy();
  });
});

describe("catalog-backed examples", () => {
  for (const operation of apiCatalog.entries) it(`${operation.id} keeps the actual route, method and required fields`, () => {
    for (const language of ["curl", "node"] as const) {
      const code = requestExample(operation, language);
      expect(code).toContain("https://api.rukafactura.cl/api/v1/");
      expect(code).not.toContain("undefined");
      expect(code).not.toContain(":id");
      expect(code).toContain("RUKA_API_KEY");
      for (const field of operation.parameters.filter(field => field.required && field.location !== "path")) expect(code).toContain(field.name);
      if (operation.method !== "GET") expect(code).toContain(operation.method);
      if (operation.method === "PATCH") expect(code).toContain("invoice.reviewed");
    }
    if (operation.method === "DELETE") expect(requestExample(operation, "node")).not.toContain("response.json()");
  });
});
