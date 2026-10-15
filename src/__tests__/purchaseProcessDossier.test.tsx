// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PurchaseProcessDossier from "@/pages/PurchaseProcessDossier";

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
const renderPage = () => render(<MemoryRouter><PurchaseProcessDossier /></MemoryRouter>);

describe("purchase process dossier", () => {
  it("renders scope and unproven external result without interaction or a registration gate", () => {
    renderPage();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByText(/La prueba completa en una cuenta de Toteat sigue pendiente/)).toBeTruthy();
    expect(screen.getByText(/No es una garantía universal contra duplicados/)).toBeTruthy();
    expect(document.querySelector("form")).toBeNull();
    expect(screen.getByRole("link", { name: "Ir a la hoja de decisión" }).getAttribute("href")).toBe("#hoja-decision");
    expect(document.querySelectorAll(".decision-field")).toHaveLength(8);
  });
  it("copies only the public canonical URL, with an accessible confirmation", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Copiar enlace" }));
    await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Puedes compartir"));
    expect(writeText).toHaveBeenCalledWith("https://www.ruka.ai/procesos/registrar-compras-toteat");
  });
  it("offers a selectable URL when clipboard permission is denied", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) } });
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Copiar enlace" }));
    const fallback = await screen.findByRole("textbox", { name: "Enlace para compartir" });
    expect((fallback as HTMLInputElement).readOnly).toBe(true);
    expect((fallback as HTMLInputElement).value).toBe("https://www.ruka.ai/procesos/registrar-compras-toteat");
  });
  it("offers a direct PDF download and a separately accessible full-size demo image", () => {
    renderPage();
    const pdf = screen.getByRole("link", { name: "Descargar PDF" });
    expect(pdf.getAttribute("href")).toBe("/expedientes/registrar-compras-toteat.pdf");
    expect(pdf.hasAttribute("download")).toBe(true);
    expect(screen.getByRole("link", { name: "Abrir captura de recepción en tamaño completo" }).getAttribute("href")).toBe("/assets/process-evidence/recepcion-demo.jpg");
    expect(screen.getByText(/con datos de ejemplo/)).toBeTruthy();
  });
});
