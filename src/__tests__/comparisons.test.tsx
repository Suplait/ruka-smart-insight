// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { JSDOM } from "jsdom";
import { Helmet } from "react-helmet";
import Comparison, { CompareIndex } from "@/pages/Compare";
import comparisons from "@/content/comparisons.json";
import { comparisonExperience } from "@/content/comparisonExperience";

describe("source-backed comparison guides", () => {
  it("covers nine distinct alternatives, not repeated pricing or demo questions", () => {
    expect(comparisons.map(item => item.brand)).toEqual(["Emisso", "Tupana", "Wasabil", "Nubox", "Defontana", "Chipax", "KAME", "Bsale", "Clay"]);
    expect(new Set(comparisons.map(item => item.title)).size).toBe(9);
    expect(new Set(comparisons.map(item => item.scenario.text)).size).toBe(9);
    expect(new Set(comparisons.map(item => comparisonExperience[item.brand].question)).size).toBe(9);
    expect(new Set(comparisons.map(item => comparisonExperience[item.brand].proofTitle)).size).toBe(9);
    for (const guide of comparisons) {
      expect(guide.rows).toHaveLength(6);
      expect(new Set(guide.rows.map(row => row.task)).size).toBe(6);
      expect(guide.rows.every(row => guide.sources[row.source]?.url.startsWith("https://"))).toBe(true);
      expect(guide.sources.length).toBeGreaterThanOrEqual(2);
      expect(guide.faqs).toHaveLength(4);
      expect(JSON.stringify(guide)).not.toMatch(/\$\d|\d+[.,]\d+ UF|pregunta en la demo|fuente de tupana/i);
    }
  });

  it.each(comparisons)("renders $brand completely in initial HTML with consistent SEO", guide => {
    const path = `/comparar/${guide.slug}`;
    const html = renderToStaticMarkup(<StaticRouter location={path}><Comparison comparison={guide} /></StaticRouter>);
    const seo = Helmet.renderStatic();
    const document = new JSDOM(`${seo.title.toString()}${seo.meta.toString()}${seo.link.toString()}${seo.script.toString()}${html}`).window.document;
    expect(document.querySelectorAll("h1")).toHaveLength(1);
    expect(document.querySelector("h1")?.textContent).toBe(`Ruka vs. ${guide.brand}`);
    expect(document.title).toBe(guide.title);
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe(`https://www.ruka.ai${path}`);
    expect(document.querySelector('meta[name="description"]')?.getAttribute("content")).toBe(guide.description);
    expect(document.querySelector('meta[property="og:url"]')?.getAttribute("content")).toBe(`https://www.ruka.ai${path}`);
    expect(document.querySelector("time")?.getAttribute("datetime")).toBe(guide.reviewedAt);
    const experience = comparisonExperience[guide.brand];
    expect(document.querySelector("header")?.textContent).not.toContain("Caja de 6 kg");
    expect(document.querySelector("main")?.textContent).toContain(experience.distinction.text);
    expect(document.querySelector("#ruka-en-operacion")?.textContent).toContain(experience.proofLead);
    expect(document.querySelectorAll("#comparacion [hidden]")).toHaveLength(0);
    expect(document.querySelectorAll("#comparacion article")).toHaveLength(6);
    expect(document.querySelectorAll("#comparacion details")).toHaveLength(0);
    for (const row of guide.rows) {
      expect(document.querySelector("main")?.textContent).toContain(row.ruka);
      expect(document.querySelector("main")?.textContent).toContain(row.alternative);
      expect(document.getElementById(`fuente-${row.source + 1}`)).not.toBeNull();
    }
    expect(document.querySelector("main")?.textContent).toContain("Esta comparación está escrita por Ruka");
    expect(document.querySelectorAll("main a[href$='.txt']")).toHaveLength(0);
    expect(document.querySelector('main [data-resource-next-step] a[href="/register"]')).not.toBeNull();
    const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]')!.textContent!)["@graph"];
    const article = graph.find((item: Record<string, unknown>) => item["@type"] === "Article");
    expect(article.author.name).toBe("Camilo Silva");
    expect(article.dateModified).toBe(guide.reviewedAt);
    expect(article.isAccessibleForFree).toBe(true);
    expect(article.citation.map((item: { url: string }) => item.url)).toEqual(guide.sources.map(item => item.url));
    const faq = graph.find((item: Record<string, unknown>) => item["@type"] === "FAQPage");
    expect(faq.mainEntity.map((item: { acceptedAnswer: { text: string } }) => item.acceptedAnswer.text)).toEqual(guide.faqs.map(item => item.answer));
    for (const item of guide.faqs) expect(document.querySelector("#preguntas")?.textContent).toContain(item.answer);
  });

  it("links every guide from the server-rendered directory", () => {
    const document = new JSDOM(renderToStaticMarkup(<StaticRouter location="/comparar"><CompareIndex /></StaticRouter>)).window.document;
    for (const guide of comparisons) expect(document.querySelector(`main a[href="/comparar/${guide.slug}"]`)).not.toBeNull();
  });
});
