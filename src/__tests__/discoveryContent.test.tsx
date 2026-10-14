import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { vi } from "vitest";
import guides from "@/content/integrationGuides.json";
import registry from "@/content/capabilities.json";
import IntegrationGuide from "@/pages/IntegrationGuide";
import { blogPosts } from "@/content/blog/posts";

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/seo/MarketingSeo", () => ({ MarketingSeo: () => null }));

describe("discovery content contracts", () => {
  it("each guide references conditional, reviewed evidence with explicit limits", () => {
    expect(guides.map((g) => g.slug)).toEqual(expect.arrayContaining(["sii", "toteat", "nubox"]));
    for (const guide of guides) {
      const capability = registry.capabilities.find((entry) => entry.id === guide.capabilityId);
      expect(capability?.assessment).toBe("implemented-conditional");
      expect(capability?.allowedClaims.length).toBeGreaterThan(0);
      expect(guide.requirements.length).toBeGreaterThanOrEqual(3);
      expect(guide.limits.length).toBeGreaterThanOrEqual(3);
      const html = renderToStaticMarkup(<StaticRouter location={`/integraciones/${guide.slug}`}><IntegrationGuide guide={guide} /></StaticRouter>);
      expect(html).toContain(guide.headline);
      expect(html).toContain(guide.direction.replace(/>/g, "&gt;"));
      expect(html).toContain(guide.limits[0]);
      expect(html).toContain('href="/register"');
    }
  });
  it("does not advertise the unimplemented new Defontana posting flow", () => {
    expect(registry.capabilities.find((entry) => entry.id === "defontana-new-posting")?.allowedClaims).toEqual([]);
    expect(guides.some((guide) => guide.slug === "defontana")).toBe(false);
  });
  it("has separate fresh screenshots, honest captions and concrete examples in all three guides", () => {
    const pilotSlugs = ["automatizar-registro-compras-sin-cambiar-erp", "conciliar-facturas-ordenes-compra-recepciones", "nomina-pagos-proveedores-banco"];
    const pilots = blogPosts.filter((post) => pilotSlugs.includes(post.slug));
    expect(pilots).toHaveLength(3);
    expect(new Set(pilots.map((post) => post.heroImage.src)).size).toBe(3);
    for (const post of pilots) {
      expect(post.heroImage.src).toMatch(/^\/blog\/2026-10\//);
      expect(post.heroImage.caption).toContain("demostración");
      expect(post.sections.some((section) => section.example?.rows.length)).toBe(true);
      expect(post.datePublished).toBe("2026-10-09");
    }
  });
});
