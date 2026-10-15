import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Partners from "@/pages/Partners";
import { createPartnerBrief, partnerFaqs } from "@/content/partnersContent";

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const renderPage = () => render(<MemoryRouter><Partners /></MemoryRouter>);

describe("consulting partner experience", () => {
  it("renders a POS-independent proposition and clear roles, without internal artifacts", () => {
    renderPage();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { name: "El restaurante mantiene el control" })).toBeTruthy();
    expect(document.body.textContent).not.toMatch(/BG Asesores|Faster|HENTECH|SHA-256|57 verificaciones|APPROVAL_HANDOFF|pruebas internas/);
    expect(document.querySelector('a[href$=".txt"], a[href^="/evidencia/"]')).toBeNull();
    expect(document.querySelector("form")).toBeNull();
    for (const link of screen.getAllByRole("link", { name: "Conversemos" })) expect(link.getAttribute("href")).toBe("/one/contacto");
    expect(screen.getByText(/no ofrece comisiones ni exige exclusividad/)).toBeTruthy();
    expect(screen.getByText(/La lectura y la escritura disponibles dependen/)).toBeTruthy();
  });
  it("keeps all FAQ answers in the initial HTML without JavaScript", () => {
    const html = renderToString(<MemoryRouter><Partners /></MemoryRouter>);
    for (const faq of partnerFaqs) expect(html).toContain(faq.answer);
    expect(html.match(/<details/g)).toHaveLength(6);
  });
  it("changes and copies the brief locally without network, storage or a form submission", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    renderPage();
    fireEvent.change(screen.getByLabelText("Trabajo a revisar"), { target: { value: "Conciliaciones" } });
    fireEvent.change(screen.getByLabelText("Fuentes o sistemas"), { target: { value: "Varios sistemas" } });
    fireEvent.click(screen.getByRole("button", { name: "Copiar resumen" }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("No se envió a Ruka"));
    expect(writeText).toHaveBeenCalledWith(createPartnerBrief("Conciliaciones", "Varios sistemas"));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(storageSpy).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText("Trabajo a revisar"), { target: { value: "Otro proceso recurrente" } });
    expect(screen.getByRole("button", { name: "Copiar resumen" })).toBeTruthy();
  });
  it("provides a selectable complete summary if clipboard access is denied", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Copiar resumen" }));
    const fallback = await screen.findByRole("textbox", { name: "Resumen para copiar manualmente" });
    expect((fallback as HTMLTextAreaElement).readOnly).toBe(true);
    expect((fallback as HTMLTextAreaElement).value).toBe(createPartnerBrief("Registro de compras", "POS y facturas"));
  });
  it("offers a selectable summary when clipboard API is absent", async () => {
    vi.stubGlobal("navigator", {});
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Copiar resumen" }));
    expect(await screen.findByRole("textbox", { name: "Resumen para copiar manualmente" })).toBeTruthy();
  });
});
