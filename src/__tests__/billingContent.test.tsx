// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { JSDOM } from "jsdom";
import { existsSync } from "node:fs";
import FacturacionElectronica from "@/pages/FacturacionElectronica";
import { billingAccess, billingContent, billingPath } from "@/content/billingContent";

describe("billing product", () => {
  it("makes emission conditions and the real destination visible without JavaScript", () => {
    const document = new JSDOM(renderToStaticMarkup(<StaticRouter location={billingPath}><FacturacionElectronica /></StaticRouter>)).window.document;
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(document.querySelector("h1")?.textContent).toBe(billingContent.h1);
    expect(document.querySelector(`a[href="${billingAccess}"]`)).not.toBeNull();
    expect(document.querySelectorAll("details")).toHaveLength(billingContent.faqs.length);
    for (const faq of billingContent.faqs) expect(document.querySelector("main")?.textContent).toContain(faq.answer);
    expect(document.querySelectorAll("form")).toHaveLength(0);
    for (const img of document.querySelectorAll('main img')) {
      expect(existsSync(`public${img.getAttribute("src")}`)).toBe(true);
      expect(img.getAttribute("alt")).toMatch(/fictici/);
      expect(img.hasAttribute("width") && img.hasAttribute("height")).toBe(true);
    }
    expect(document.querySelector("main")?.textContent).not.toMatch(/99\.990|249\.990|449\.990|48\s*(h|horas)/);
  });
});
