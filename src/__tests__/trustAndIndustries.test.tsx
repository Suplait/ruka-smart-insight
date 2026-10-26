// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { JSDOM } from "jsdom";
import Security from "@/pages/Security";
import Accountants from "@/pages/Accountants";
import { IndustryWorkflow } from "@/components/acquisition/IndustryWorkflow";
import { securitySections } from "@/content/securityContent";

describe("trust and industry journeys", () => {
  it("publishes scoped security information, not infrastructure details or unsupported certifications", () => {
    const document = new JSDOM(renderToStaticMarkup(<StaticRouter location="/seguridad"><Security /></StaticRouter>)).window.document;
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    for (const section of securitySections) {
      expect(document.querySelector(`#${section.id}`)).not.toBeNull();
      for (const p of section.paragraphs) expect(document.querySelector("main")?.textContent).toContain(p);
    }
    expect(document.querySelector('main a[href="mailto:privacidad@ruka.ai"]')).not.toBeNull();
    expect(document.querySelector("main")?.textContent).not.toMatch(/ISO 27001|SOC 2|99[.,]9|TLS 1\.3|pg-ruka|rukadb|PITR|no entren/i);
  });
  it("gives accountants distinct product journeys without another form or pricing", () => {
    const document = new JSDOM(renderToStaticMarkup(<StaticRouter location="/contadores"><Accountants /></StaticRouter>)).window.document;
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    for (const path of ["/productos/registro-de-compras", "/productos/facturacion-electronica", "/desarrolladores/guias/compras-revisadas-erp", "/ayuda/preparar-cierre-contable"]) expect(document.querySelector(`main a[href="${path}"]`)).not.toBeNull();
    expect(document.querySelector("main")?.textContent).toContain("Un borrador F29 no es una declaración presentada o pagada.");
    expect(document.querySelectorAll("form")).toHaveLength(0);
    expect(document.querySelector("main")?.textContent).not.toMatch(/99\.990|249\.990|449\.990|comisión|exclusividad/);
  });
  for (const industry of ["restaurantes", "hoteles", "retail"] as const) it(`${industry}: specific educational example without conversion side effects`, () => {
    const document = new JSDOM(renderToStaticMarkup(<StaticRouter location="/"><IndustryWorkflow industry={industry} /></StaticRouter>)).window.document;
    expect(document.querySelectorAll("h2")).toHaveLength(1);
    expect(document.querySelectorAll("li")).toHaveLength(3);
    expect(document.body.textContent).toContain("Ejemplo");
    expect(document.querySelectorAll("form,button,input")).toHaveLength(0);
    expect(document.querySelector('a[href^="/"]')).not.toBeNull();
  });
});
