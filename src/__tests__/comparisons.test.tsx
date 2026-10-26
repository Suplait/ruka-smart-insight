// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { JSDOM } from "jsdom";
import Comparison from "@/pages/Compare";
import comparisons from "@/content/comparisons.json";

describe("honest task comparisons", () => {
  it("has primary sources, distinct questions and no price claims", () => {
    for (const comparison of comparisons) {
      expect(comparison.rows).toHaveLength(6);
      expect(new Set(comparison.rows.map(row => row.question)).size).toBe(6);
      expect(comparison.rows.every(row => comparison.sources.some(source => source.url === row.source))).toBe(true);
      expect(comparison.profiles.some(profile => profile.external && profile.href.startsWith("https://www.tupana.ai/"))).toBe(true);
      expect(JSON.stringify(comparison)).not.toMatch(/\$\d|\d+[.,]\d+ UF/);
    }
  });
  it("renders both alternatives and ownership disclosure in initial HTML", () => {
    const comparison = comparisons[0];
    const html = renderToStaticMarkup(<StaticRouter location={`/comparar/${comparison.slug}`}><Comparison comparison={comparison} /></StaticRouter>);
    const document = new JSDOM(html).window.document;
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(document.querySelector("time")?.getAttribute("datetime")).toBe(comparison.reviewedAt);
    expect(document.querySelector("main")?.textContent).toContain("Esta comparación está escrita por Ruka");
    expect(document.querySelector("main")?.textContent).toContain("Puede que no necesites cambiar de software");
    expect(document.querySelector('a[href="https://www.tupana.ai/cobranza"]')).not.toBeNull();
    for (const row of comparison.rows) {
      expect(document.querySelector("main")?.textContent).toContain(row.ruka);
      expect(document.querySelector("main")?.textContent).toContain(row.tupana);
    }
  });
});
