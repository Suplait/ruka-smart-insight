import { afterEach, describe, it, expect, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SupplierProfilePage, { SuppliersIndex } from "@/pages/Suppliers";
import profiles from "../../config/supplier-profiles.json";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe("supplier discovery and recovery", () => {
  it("finds legal names/RUTs and recovers from an empty combined filter", async () => {
    const user = userEvent.setup(); render(<MemoryRouter><SuppliersIndex /></MemoryRouter>);
    const query = screen.getByLabelText("Nombre, marca o RUT");
    await user.type(query, "810941006");
    expect(screen.getByRole("heading", { name: "Colun" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "Agrosuper" })).toBeNull();
    await user.selectOptions(screen.getByLabelText("Rubro"), "Energía y servicios");
    expect(screen.getByText("No encontramos esa empresa.")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Ver todas las empresas" }));
    expect((query as HTMLInputElement).value).toBe("");
    expect(screen.getByRole("heading", { name: "Agrosuper" })).toBeTruthy();
  });
  it("recovers from network error without trusting a wrong profile", async () => {
    const colun = profiles.find(row => row.slug === "colun")!;
    const fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: async () => ({ ...colun, slug: "wrong-profile" }) }).mockResolvedValueOnce({ ok: true, json: async () => colun });
    vi.stubGlobal("fetch", fetch);
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={["/proveedores/colun"]}><Routes><Route path="/proveedores/:slug" element={<SupplierProfilePage />} /></Routes></MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "No pudimos cargar la ficha." })).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Reintentar" }));
    expect(await screen.findByRole("heading", { name: "Colun" })).toBeTruthy();
    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
    expect(screen.getByText("81.094.100-6")).toBeTruthy();
  });
  it("shows not-found for a retired profile instead of a fabricated company", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    render(<MemoryRouter initialEntries={["/proveedores/retired"]}><Routes><Route path="/proveedores/:slug" element={<SupplierProfilePage />} /></Routes></MemoryRouter>);
    expect(await screen.findByRole("heading", { name: "Esta página no existe." })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Copiar RUT" })).toBeNull();
  });
});
