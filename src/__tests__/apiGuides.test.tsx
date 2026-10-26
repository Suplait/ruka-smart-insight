// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { JSDOM } from "jsdom";
import ApiGuide from "@/pages/ApiGuide";
import guides from "@/content/apiGuides.json";

describe("API task guides", () => {
  for (const guide of guides) {
    it(`${guide.slug} renders its task, code, source and download without JavaScript`, () => {
      const html = renderToStaticMarkup(<StaticRouter location={`/desarrolladores/guias/${guide.slug}`}><ApiGuide guide={guide} /></StaticRouter>);
      const document = new JSDOM(html).window.document;
      expect(document.querySelectorAll("h1")).toHaveLength(1);
      expect(document.querySelector("h1")?.textContent).toBe(guide.title);
      expect(document.querySelector("time")?.getAttribute("dateTime")).toBe("2026-10-26");
      expect(document.querySelector("a[download]")?.getAttribute("href")).toBe(`/api/examples/${guide.download}`);
      expect([...document.querySelectorAll("pre")].every(pre => pre.tabIndex === 0 && pre.hasAttribute("aria-label"))).toBe(true);
      const anchors = [...document.querySelectorAll<HTMLAnchorElement>('main a[href^="#"]')];
      for (const anchor of anchors) expect(document.getElementById(anchor.getAttribute("href")!.slice(1))).not.toBeNull();
      expect(document.querySelector("main")?.textContent).toContain(guide.result);
      expect(document.querySelectorAll(`a[href="https://api.rukafactura.cl/api_docs#${guide.reference}"]`)).toHaveLength(1);
    });
  }
  it("uses distinct stable slugs and public example downloads", () => {
    expect(new Set(guides.map(guide => guide.slug)).size).toBe(3);
    expect(guides.every(guide => /^[a-z-]+\.mjs$/.test(guide.download))).toBe(true);
    expect(guides.every(guide => guide.sections.length >= 4 && guide.checks.length >= 4)).toBe(true);
  });
});
