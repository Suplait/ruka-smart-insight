import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { renderToString } from "react-dom/server";
import guides from "@/content/purchaseGuides.json";
import PurchaseGuide, { PurchaseGuidesIndex, purchaseGuidesPath } from "@/pages/PurchaseGuides";

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/seo/MarketingSeo", () => ({ MarketingSeo: () => null }));
vi.mock("@/pages/NotFound", () => ({ default: () => <h1>Recurso no encontrado</h1> }));
afterEach(cleanup);

describe("source-backed purchase guides", () => {
  it.each(guides)("renders $slug with complete content before interaction", guide => {
    render(<MemoryRouter><PurchaseGuide guide={guide} /></MemoryRouter>);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(guide.title);
    expect(screen.getByText(guide.answer)).toBeTruthy();
    for (const section of guide.sections) {
      expect(screen.getByRole("heading", { name: section.title })).toBeTruthy();
      for (const paragraph of section.paragraphs) expect(screen.getByText(paragraph)).toBeTruthy();
      expect(document.getElementById(section.id)).not.toBeNull();
    }
    for (const source of guide.sources) expect(screen.getByRole("link", { name: `${source.title} (abre otra pestaña)` }).getAttribute("href")).toBe(source.url);
    expect(screen.getByRole("link", { name: "Camilo Silva · CEO y Founder de Ruka" })).toBeTruthy();
    expect(document.querySelector("time")?.getAttribute("datetime")).toBe(guide.reviewedAt);
    const html = renderToString(<MemoryRouter><PurchaseGuide guide={guide} /></MemoryRouter>);
    expect(html).toContain(guide.answer);
    expect(html).toContain(guide.sources[0].url);
    expect(html).not.toMatch(/\.txt(?:"|<)/);
  });
  it("lists all guides with distinct canonical destinations", () => {
    render(<MemoryRouter><PurchaseGuidesIndex /></MemoryRouter>);
    for (const guide of guides) expect(screen.getByRole("link", { name: guide.title }).getAttribute("href")).toBe(`${purchaseGuidesPath}/${guide.slug}`);
    expect(new Set(guides.map(guide => guide.slug)).size).toBe(guides.length);
  });
  it("does not render another guide or the home for an unknown slug", () => {
    render(<MemoryRouter initialEntries={[`${purchaseGuidesPath}/no-existe`]}><Routes><Route path={`${purchaseGuidesPath}/:slug`} element={<PurchaseGuide />} /></Routes></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Recurso no encontrado");
  });
});
