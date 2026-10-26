import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { ResourceLoading } from "@/components/resources/ResourceLoading";

vi.mock("@/components/Navbar", () => ({ default: () => <nav aria-label="Navegación principal" /> }));
afterEach(cleanup);

it("preserves navigation and announces loading without fake content or animated placeholders", () => {
  render(<ResourceLoading />);
  expect(screen.getByRole("navigation", { name: "Navegación principal" })).toBeTruthy();
  expect(screen.getByRole("main").getAttribute("aria-busy")).toBe("true");
  expect(screen.getByRole("status").textContent).toBe("Cargando recurso…");
  expect(document.querySelector('[aria-hidden="true"]')).toBeTruthy();
  expect(document.querySelector('[class*="animate-"]')).toBeNull();
  expect(document.querySelector("form, input")).toBeNull();
});
