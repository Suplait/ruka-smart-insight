import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SupplierProfileView } from "@/components/suppliers/SupplierProfileView";
import { supplierFaqs, supplierIdentityText, supplierSourceMonth } from "@/utils/supplierPresentation";
import records from "../../config/supplier-profiles.json";
import type { SupplierProfile } from "@/types/supplier";

const agrosuper = records.find(row => row.slug === "agrosuper")!;
const basic = records.find(row => !row.channel && !row.website)!;
const show = (profile: SupplierProfile = agrosuper) => render(<MemoryRouter><SupplierProfileView profile={profile} /></MemoryRouter>);
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("supplier profile task experience", () => {
  it("copies the legal identity, not just a trading name", async () => {
    const user = userEvent.setup(); const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue(); show();
    await user.click(screen.getByRole("button", { name: "Copiar identificación" }));
    expect(copy).toHaveBeenLastCalledWith(`${agrosuper.legalName}\nRUT: ${agrosuper.rut}`);
    expect(screen.getByText("Razón social y RUT copiados.")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Copiar RUT" }));
    expect(copy).toHaveBeenLastCalledWith(agrosuper.rut);
  });
  it("gives manual recovery if the clipboard is denied", async () => {
    const user = userEvent.setup(); vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("denied")); show();
    await user.click(screen.getByRole("button", { name: "Copiar identificación" }));
    expect(screen.getByText(/No pudimos copiar/)).toBeTruthy();
    expect(screen.getByText(agrosuper.legalName)).toBeTruthy();
  });
  it("keeps the personal review explicit, reversible and non-certifying", async () => {
    const user = userEvent.setup(); show();
    expect((screen.getByRole("button", { name: "Reiniciar" }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(screen.getByRole("checkbox", { name: `Revisado: ${agrosuper.checks[0].title}` }));
    expect(screen.getByText("1 de 3 revisados")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(screen.getByText("0 de 3 revisados")).toBeTruthy();
    expect(screen.getByText(/No certifica al proveedor ni autoriza un pago/)).toBeTruthy();
  });
  it("does not invent contact channels for basic records", () => {
    show(basic);
    expect(screen.getByText(/Esta ficha no tiene un canal comercial verificado/)).toBeTruthy();
    expect(screen.queryByText("Continúa en su canal oficial")).toBeNull();
    expect(supplierFaqs(basic).some(faq => faq.answer.includes("No hay un canal comercial verificado"))).toBe(true);
  });
  it("uses the source month rather than a hardcoded review date", () => {
    expect(supplierSourceMonth("2025-12")).toBe("diciembre de 2025");
    expect(supplierFaqs({ ...agrosuper, registry: { ...agrosuper.registry, sourceDate: "2025-12" } })[1].answer).toContain("diciembre de 2025");
  });
  it("keeps all names, optional records and real tool navigation usable", () => {
    const longest = records.reduce((a, b) => a.name.length > b.name.length ? a : b);
    show({ ...longest, registry: undefined });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(longest.name);
    expect(screen.getByText("Sin antecedente publicado en esta ficha")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Comparar costo por unidad/ }).getAttribute("href")).toBe("/herramientas/costo-unitario");
    expect(screen.getByRole("link", { name: /Ver empresas de/ }).getAttribute("href")).toContain("/proveedores?rubro=");
    expect(supplierIdentityText(longest)).toContain(longest.legalName);
  });
});
