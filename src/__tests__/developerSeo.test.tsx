// @vitest-environment node
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";
import { JSDOM } from "jsdom";
import { Script } from "node:vm";
import { spawnSync } from "node:child_process";
import Developers from "@/pages/Developers";
import { apiCatalog, developerFaqs, requestExample } from "@/content/developerExperience";

describe("developer portal server HTML", () => {
  it("generates valid Node.js and shell syntax without executing API requests", () => {
    for (const operation of apiCatalog.entries) {
      expect(() => new Script(`(async function () {\n${requestExample(operation, "node")}\n})`), operation.id).not.toThrow();
      const result = spawnSync("bash", ["-n"], { input: requestExample(operation, "curl"), encoding: "utf8" });
      expect(result.status, result.stderr).toBe(0);
    }
  });
  it("includes all operations, real links and the FAQ before JavaScript runs", () => {
    const html = renderToStaticMarkup(<StaticRouter location="/desarrolladores"><Developers /></StaticRouter>);
    const doc = new JSDOM(html).window.document;
    expect(doc.querySelectorAll("h1")).toHaveLength(1);
    expect(doc.querySelector("h1")?.textContent).toBe("Tus datos operativos. En lo que quieras construir.");
    for (const op of apiCatalog.entries) expect(doc.querySelector(`a[href="${apiCatalog.reference}#${op.id}"]`)).not.toBeNull();
    for (const a of doc.querySelectorAll('main a[href^="#"]')) expect(doc.getElementById(a.getAttribute("href")!.slice(1))).not.toBeNull();
    for (const faq of developerFaqs) expect(doc.querySelector("#preguntas")?.textContent).toContain(faq.answer);
    expect(doc.querySelector('[data-resource-product]')?.getAttribute("href")).toBe("/one");
    expect(doc.querySelector('a[download][href="/api/openapi.json"]')).not.toBeNull();
    const seo = Helmet.renderStatic();
    expect(seo.title.toString()).toContain("API de Ruka: compras, documentos y webhooks | Ruka");
    expect(seo.link.toString()).toContain('href="https://www.ruka.ai/desarrolladores"');
    expect(seo.script.toString()).toContain('"@type":"FAQPage"');
    const graph = JSON.parse(new JSDOM(seo.script.toString()).window.document.querySelector("script")!.textContent!)["@graph"];
    expect(graph.find((node: { "@type": string }) => node["@type"] === "FAQPage").mainEntity).toHaveLength(6);
    const ids = [...doc.querySelectorAll("[id]")].map(el => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
