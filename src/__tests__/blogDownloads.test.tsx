// @vitest-environment jsdom
import { render, cleanup, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import BlogArticle from "@/pages/BlogArticle";
import { getBlogPost } from "@/content/blog/posts";
import samples from "@/content/reconciliationSample.json";

afterEach(cleanup);

describe("reproducible blog downloads", () => {
  it("offers native downloads for all three generated CSV files, not SPA routes", () => {
    const post = getBlogPost("conciliar-facturas-ordenes-compra-recepciones")!;
    render(<MemoryRouter><BlogArticle post={post} /></MemoryRouter>);
    const links = screen.getAllByRole("link").filter(link => link.hasAttribute("download"));
    expect(links.map(link => link.getAttribute("href")).sort()).toEqual(
      Object.keys(samples).map(kind => `/ejemplos/conciliacion/${kind}.csv`).sort(),
    );
    expect(screen.getByRole("link", { name: "Comparar archivos y descargar el resultado" }).hasAttribute("download")).toBe(false);
  });
});
