// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { JSDOM } from "jsdom";
import { existsSync } from "node:fs";
import HelpGuide, { HelpIndex } from "@/pages/Help";
import { searchHelp } from "@/utils/helpSearch";
import guides from "@/content/helpGuides.json";

describe("help center", () => {
  it("searches accents and case without creating filter URLs", () => {
    expect(searchHelp("  NOMINA ").some(item => item.slug === "preparar-nomina-banco")).toBe(true);
    expect(searchHelp("recepcion").length).toBeGreaterThan(1);
    expect(searchHelp("no-existe-xyz")).toHaveLength(0);
    expect(searchHelp("")).toHaveLength(guides.length);
  });
  it("serves every guide and the API journey without JavaScript", () => {
    const document = new JSDOM(renderToStaticMarkup(<StaticRouter location="/ayuda"><HelpIndex /></StaticRouter>)).window.document;
    for (const guide of guides) expect(document.querySelector(`main a[href="/ayuda/${guide.slug}"]`)).not.toBeNull();
    expect(document.querySelector('main a[href="/desarrolladores"]')).not.toBeNull();
    expect(document.querySelectorAll("h1")).toHaveLength(1);
  });
  for (const guide of guides) it(`${guide.slug}: visible steps, limits, recovery and safe assets`, () => {
    const document = new JSDOM(renderToStaticMarkup(<StaticRouter location={`/ayuda/${guide.slug}`}><HelpGuide guide={guide} /></StaticRouter>)).window.document;
    const main = document.querySelector("main")!;
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(main.textContent).toContain(guide.permission);
    expect(main.textContent).toContain(guide.check);
    for (const [index, step] of guide.steps.entries()) {
      expect(main.querySelector(`#paso-${index + 1}`)?.textContent).toContain(step.text);
      expect(main.querySelector(`a[href="#paso-${index + 1}"]`)).not.toBeNull();
    }
    for (const problem of guide.problems) expect(main.textContent).toContain(problem.text);
    expect(main.querySelectorAll("form")).toHaveLength(0);
    for (const img of main.querySelectorAll("img")) {
      expect(existsSync(`public${img.getAttribute("src")}`)).toBe(true);
      expect(img.hasAttribute("width") && img.hasAttribute("height")).toBe(true);
      expect(img.getAttribute("alt")?.length).toBeGreaterThan(30);
      expect(img.closest("figure")?.textContent).toMatch(/demo/i);
    }
    expect(main.textContent).not.toMatch(/AIza|sk_live|portal_token|SHA-256|pruebas internas|garantizado/);
    expect(new Set([...main.querySelectorAll("[id]")].map(element => element.id)).size).toBe(main.querySelectorAll("[id]").length);
  });
});
