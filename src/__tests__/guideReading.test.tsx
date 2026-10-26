import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import HelpGuide from "@/pages/Help";
import guides from "@/content/helpGuides.json";

vi.mock("@/components/Navbar", () => ({ default: () => null }));
vi.mock("@/components/Footer", () => ({ default: () => null }));
afterEach(cleanup);

describe("guided help reading", () => {
  it.each(guides.filter(guide => guide.image))("places $slug screenshot in the relevant step and retains its full dimensions", guide => {
    render(<MemoryRouter><HelpGuide guide={guide} /></MemoryRouter>);
    const image = screen.getByAltText(guide.image!.alt);
    expect(image.closest("li")?.id).toBe("paso-3");
    expect(image.getAttribute("width")).toBe(String(guide.image!.width));
    expect(image.getAttribute("height")).toBe(String(guide.image!.height));
    expect(screen.getByRole("heading", { name: "Cómo comprobar el resultado" })).toBeTruthy();
  });
  it("retains native section anchors, updates current location and closes the mobile index", async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><HelpGuide guide={guides[0]} /></MemoryRouter>);
    const index = document.querySelector("details")!;
    await user.click(index.querySelector("summary")!);
    expect(index.open).toBe(true);
    const link = index.querySelector('a[href="#paso-2"]')!;
    await user.click(link);
    expect(index.open).toBe(false);
    expect(link.getAttribute("aria-current")).toBe("location");
    expect(document.getElementById("paso-2")).toBeTruthy();
  });
});
