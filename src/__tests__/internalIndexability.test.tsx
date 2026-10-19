// @vitest-environment node
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";
import { InternalRouteSeo } from "@/components/seo/InternalRouteSeo";
import internalRoutes from "@/content/internalRouteSeo.json";
import home from "@/content/landingV2Seo.json";
import handler from "../../api/webinar.js";

describe("internal routes are crawlable but not indexable", () => {
  for (const [path, metadata] of Object.entries(internalRoutes)) {
    it.each([path, `${path}/`, `${path}?onboardingDebug=1&utm_source=qa`])("has its own metadata for %s", (url) => {
      renderToString(<StaticRouter location={url}><InternalRouteSeo /></StaticRouter>);
      const seo = Helmet.renderStatic();
      expect(seo.title.toString()).toContain(metadata.title);
      expect(seo.meta.toString()).toContain('content="noindex, nofollow, noarchive"');
      expect(seo.meta.toString()).toContain(`content="https://www.ruka.ai${path}"`);
      expect(seo.link.toString()).toContain(`href="https://www.ruka.ai${path}"`);
      expect(seo.script.toString()).toBe("");
      expect(seo.meta.toString()).not.toContain("utm_source");
    });
  }
  it.each(["/", "/register", "/restaurantes", "/hoteles", "/retail", "/one", "/blog"])("does not change public route %s", (path) => {
    renderToString(<StaticRouter location={path}><InternalRouteSeo /></StaticRouter>);
    const seo = Helmet.renderStatic();
    expect(seo.meta.toString()).toBe("");
    expect(seo.link.toString()).toBe("");
  });
  it("allows crawlers to read the exclusions, without adding them to the sitemap dates", () => {
    const robots = readFileSync("public/robots.txt", "utf8");
    const dates = JSON.parse(readFileSync("src/content/pageModified.json", "utf8"));
    for (const path of Object.keys(internalRoutes)) {
      expect(robots).not.toContain(`Disallow: ${path}`);
      expect(dates[path]).toBeUndefined();
    }
  });
  it("adds a product definition rather than targeting unrelated meanings of Ruka", () => {
    expect(home.title.endsWith("Ruka.ai")).toBe(true);
    expect(home.faq[0].question).toBe("¿Qué es Ruka.ai?");
    expect(home.faq).toHaveLength(10);
  });
});

describe("retired webinar", () => {
  it.each(["GET", "HEAD"])("returns HTTP 410 for %s without running the old registration flow", (method) => {
    const headers: Record<string, string> = {};
    let body: string | undefined;
    const response = {
      statusCode: 200,
      setHeader: (key: string, value: string) => { headers[key] = value; },
      end: (value?: string) => { body = value; },
    };
    handler({ method }, response);
    expect(response.statusCode).toBe(410);
    expect(headers["Content-Type"]).toContain("text/html");
    expect(headers["X-Robots-Tag"]).toContain("noindex");
    expect(headers.Location).toBeUndefined();
    if (method === "HEAD") expect(body).toBeUndefined();
    else {
      expect(body).toContain("Este webinar ya terminó.");
      expect(body).toContain('href="/blog"');
      expect(body).not.toMatch(/<form|supabase|webinar_registration|application\/ld\+json/i);
    }
  });
});
