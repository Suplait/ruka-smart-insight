// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BlogArticle from "@/pages/BlogArticle";

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
vi.mock("@/components/blog/ReadingProgress", () => ({ ReadingProgress: () => null }));
const originalScrollIntoView = Element.prototype.scrollIntoView;
const scrollIntoView = vi.fn();
beforeEach(() => {
  Element.prototype.scrollIntoView = scrollIntoView;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => { callback(0); return 1; });
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
});
afterEach(() => {
  cleanup(); vi.restoreAllMocks(); scrollIntoView.mockClear();
  Element.prototype.scrollIntoView = originalScrollIntoView;
});
const open = (hash = "") => render(<MemoryRouter initialEntries={[`/blog/actualizar-costos-precios-proveedores${hash}`]}><Routes><Route path="/blog/:slug" element={<BlogArticle />} /></Routes></MemoryRouter>);

describe("article deep links", () => {
  it("resolves the section after article rendering", () => {
    open("#presentacion-desconocida");
    expect(scrollIntoView).toHaveBeenCalledOnce();
    expect(scrollIntoView.mock.instances[0]).toBe(document.getElementById("presentacion-desconocida"));
    expect(scrollIntoView).toHaveBeenCalledWith({ block: "start", behavior: "instant" });
  });
  it("does not alter navigation to an article without a fragment", () => {
    open(); expect(scrollIntoView).not.toHaveBeenCalled();
  });
  it("ignores malformed and missing fragments", () => {
    const page = open("#%invalid");
    expect(scrollIntoView).not.toHaveBeenCalled(); page.unmount();
    open("#does-not-exist"); expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
