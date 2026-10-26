import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Resources from "@/pages/Resources";

afterEach(cleanup);
describe("resource discovery", () => {
  it("finds API and unaccented tasks, provides recovery and keeps category anchors", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><Resources /></MemoryRouter>);
    const search = screen.getByRole("searchbox", { name: "Buscar un recurso" });
    await user.type(search, "api");
    expect(screen.getByRole("heading", { name: "Desarrolladores e integradores" })).toBeTruthy();
    await user.clear(search); await user.type(search, "recepcion");
    expect(screen.getByRole("heading", { name: "Recepción, documentos y SII" })).toBeTruthy();
    await user.clear(search); await user.type(search, "zzzzzz");
    expect(screen.getByText("No encontramos esa tarea.")).toBeTruthy();
    await user.click(screen.getByRole("link", { name: "Calcular", exact: true }));
    expect((search as HTMLInputElement).value).toBe("");
    expect(screen.getByRole("heading", { name: "Costo por kilo, litro o unidad" })).toBeTruthy();
  });
});
