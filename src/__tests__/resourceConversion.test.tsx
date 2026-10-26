import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ResourceNextStep } from "@/components/resources/ResourceNextStep";
import { resourceJourney } from "@/utils/resourceJourney";
import { resourceParents } from "@/utils/resourceBreadcrumbs";

afterEach(cleanup);

describe("resource next steps", () => {
  it.each([
    ["/herramientas/costo-unitario", "/productos/panel-control"],
    ["/herramientas/variacion-costos", "/productos/panel-control"],
    ["/herramientas/margen-markup", "/productos/panel-control"],
    ["/herramientas/conciliar-factura-orden-recepcion", "/productos/cuentas-por-pagar"],
    ["/proveedores/example", "/productos/registro-de-compras"],
    ["/desarrolladores/guias/example", "/one"],
    ["/guias/compras/example", "/productos/registro-de-compras"],
    ["/recursos", "/"],
  ])("connects %s to relevant product and an optional conversation", (path, href) => {
    render(<MemoryRouter><ResourceNextStep path={path} /></MemoryRouter>);
    const aside = screen.getByRole("complementary");
    expect(aside.querySelector("[data-resource-product]")?.getAttribute("href")).toBe(href);
    expect(within(aside).getByRole("link", { name: "Agendar 30 min" }).getAttribute("href")).toBe("/register");
    expect(aside.querySelector("form, input, button")).toBeNull();
    expect(within(aside).getByText(/sin registrarte/)).toBeTruthy();
  });

  it("keeps support separate from acquisition and preserves supplier disclaimers", () => {
    const view = render(<MemoryRouter><ResourceNextStep path="/ayuda/revisar-factura-compra" /></MemoryRouter>);
    expect(screen.getByText("¿Aún no usas Ruka?")).toBeTruthy();
    view.rerender(<MemoryRouter><ResourceNextStep path="/proveedores" /></MemoryRouter>);
    expect(screen.getByText(/no se presentan como clientes ni partners/)).toBeTruthy();
    expect(resourceJourney("/ayuda/homologar-insumos")).toBe("costs");
  });
});

describe("resource breadcrumb hierarchy", () => {
  it("uses existing parent pages, not nonexistent intermediate directories", () => {
    expect(resourceParents("/desarrolladores/guias/compras").map(p => p.path)).toEqual(["/recursos", "/desarrolladores"]);
    expect(resourceParents("/guias/compras/revisar").map(p => p.path)).toEqual(["/recursos", "/guias/compras"]);
    expect(resourceParents("/herramientas/margen-markup").map(p => p.path)).toEqual(["/recursos"]);
  });
  it("leaves home, product and conversion route breadcrumbs unchanged", () => {
    for (const path of ["/", "/register", "/one", "/productos/stock", "/recursos"]) expect(resourceParents(path)).toEqual([]);
  });
});
