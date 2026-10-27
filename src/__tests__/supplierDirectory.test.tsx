// @vitest-environment node
import { describe, expect, it } from "vitest";
import { Helmet } from "react-helmet";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { matchesSupplier, normalizeSupplierSearch, validCompanyRut } from "@/utils/supplierDirectory";
import { SupplierProfileView, SuppliersIndex } from "@/pages/Suppliers";
import records from "../../config/supplier-profiles.json";
import manifest from "@/content/supplierManifest.json";
import { supplierPagination, supplierFaqs } from "@/utils/supplierPresentation";

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
      expect(html).toContain(profile.legalName.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
      expect(html).toContain("Consejos de Ruka, no condiciones comerciales del proveedor.");
      expect(html).toContain("No envíes facturas ni datos bancarios.");
      expect(Helmet.renderStatic().script.toString()).toContain("supplier-profile-data");
    }
  });
  it("index has real search labels, unambiguous identity and crawlable profile links", () => {
    const html = renderToString(<StaticRouter location="/proveedores"><SuppliersIndex /></StaticRouter>);
    expect(html).toContain('id="supplier-search"');
    expect(html).toContain(`href="/proveedores/${manifest.initial[0].slug}"`);
    expect(html).toContain('href="/proveedores/pagina/2"');
    expect(html).not.toContain("placeholder-logo");
  });
  it("has 1000 unique legal identities and paginates every result", () => {
    expect(records).toHaveLength(1000);
    expect(new Set(records.map(row => row.rut)).size).toBe(1000);
    expect(manifest.initial).toHaveLength(25);
    expect(supplierPagination(20, 40)).toEqual([1, "gap", 19, 20, 21, "gap", 40]);
    expect(supplierPagination(1, 40)).toEqual([1, 2, "gap", 40]);
    expect(supplierPagination(40, 40)).toEqual([1, "gap", 39, 40]);
    records.forEach(row => {
      expect(row.registry.activities.length).toBeGreaterThan(0);
      expect(supplierFaqs(row).length).toBeGreaterThanOrEqual(3);
    });
  });
});
