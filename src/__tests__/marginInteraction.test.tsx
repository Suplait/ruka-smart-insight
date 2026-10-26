import { afterEach, describe, it, expect, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import MarginTool from "@/pages/MarginTool";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
describe("margin interaction", () => {
  it("explains unreachable target, exposes validation and resets locally", async () => {
    const fetch = vi.fn(); vi.stubGlobal("fetch", fetch);
    const user = userEvent.setup();
    render(<MemoryRouter><MarginTool /></MemoryRouter>);
    const target = screen.getByLabelText("Margen objetivo sobre venta (%)");
    await user.clear(target); await user.type(target, "100"); await user.tab();
    expect(target.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("Revisa el costo y el margen objetivo.")).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Restablecer ejemplo" }));
    expect(target.getAttribute("aria-invalid")).toBe("false");
    expect((target as HTMLInputElement).value).toBe("40");
    expect(screen.getByText("Precio neto orientativo: 10.000")).toBeTruthy();
    expect(fetch).not.toHaveBeenCalled();
  });
});
