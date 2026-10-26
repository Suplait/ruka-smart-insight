// @vitest-environment node
import { describe, expect, it } from "vitest";
import { Helmet } from "react-helmet";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { matchesSupplier, normalizeSupplierSearch, validCompanyRut } from "@/utils/supplierDirectory";
import { SupplierProfileView, SuppliersIndex } from "@/pages/Suppliers";
import records from "../../config/supplier-profiles.json";

describe("supplier directory", () => {
  it("validates check digits and rejects malformed values", () => {
    records.forEach(row => expect(validCompanyRut(row.rut)).toBe(true));
    expect(validCompanyRut("93.178.000-1")).toBe(false);
    expect(validCompanyRut("00000000-0")).toBe(false);
  });
  it("finds accents, legal names and RUT formats without merging companies", () => {
    expect(normalizeSupplierSearch("  Nestlé ")).toBe("nestle");
    expect(matchesSupplier(records.find(r => r.slug === "gourmet")!, "Good Food")).toBe(true);
    const colun = records.find(r => r.slug === "colun")!;
    expect(matchesSupplier(colun, "810941006")).toBe(true);
    expect(matchesSupplier(colun, "colun", "Carnes y cecinas")).toBe(false);
  });
  it("renders all identities and source links without JavaScript", () => {
    for (const profile of records) {
      const html = renderToString(<StaticRouter location={`/proveedores/${profile.slug}`}><SupplierProfileView profile={profile} /></StaticRouter>);
      expect(html).toContain(profile.rut);
      expect(html).toContain(profile.legalName);
      expect(html).toContain("No son requisitos comerciales impuestos por el proveedor.");
      expect(html).toContain("No envíes facturas, datos personales ni información bancaria.");
      expect(Helmet.renderStatic().script.toString()).toContain("supplier-profile-data");
    }
  });
  it("index has real search labels, unambiguous identity and crawlable profile links", () => {
    const html = renderToString(<StaticRouter location="/proveedores"><SuppliersIndex /></StaticRouter>);
    expect(html).toContain('id="supplier-search"');
    expect(html).toContain('href="/proveedores/colun"');
    expect(html).not.toContain("placeholder-logo");
  });
});
