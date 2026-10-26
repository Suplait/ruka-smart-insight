import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeExample } from "@/components/resources/CodeExample";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
it("copies the exact example without executing it and announces success", async () => {
  const user = userEvent.setup();
  const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  render(<CodeExample code="curl example.test" label="cURL" />);
  await user.click(screen.getByRole("button", { name: "Copiar código" }));
  expect(copy).toHaveBeenCalledWith("curl example.test");
  expect(screen.getByRole("status").textContent).toContain("Código copiado");
});
it("keeps code selectable and explains a clipboard failure", async () => {
  const user = userEvent.setup();
  vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(new Error("Denied"));
  render(<CodeExample code="curl example.test" label="cURL" />);
  await user.click(screen.getByRole("button", { name: "Copiar código" }));
  expect(screen.getByRole("status").textContent).toContain("manualmente");
  expect(screen.getByLabelText("Código: cURL").textContent).toBe("curl example.test");
});

it("resets copy feedback when the displayed example changes", async () => {
  const user = userEvent.setup();
  const copy = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  const view = render(<CodeExample code="curl first.test" label="cURL" />);
  await user.click(screen.getByRole("button", { name: "Copiar código" }));
  expect(screen.getByRole("button", { name: "Copiado" })).toBeTruthy();
  view.rerender(<CodeExample code="curl second.test" label="cURL" />);
  expect(screen.getByRole("status").textContent).toBe("");
  await user.click(screen.getByRole("button", { name: "Copiar código" }));
  expect(copy).toHaveBeenLastCalledWith("curl second.test");
});

it("does not apply a late clipboard response to a different example", async () => {
  const user = userEvent.setup();
  let resolveCopy!: () => void;
  vi.spyOn(navigator.clipboard, "writeText").mockImplementation(() => new Promise<void>(resolve => { resolveCopy = resolve; }));
  const view = render(<CodeExample code="curl first.test" label="cURL" />);
  await user.click(screen.getByRole("button", { name: "Copiar código" }));
  view.rerender(<CodeExample code="curl second.test" label="cURL" />);
  resolveCopy();
  expect(screen.getByRole("status").textContent).toBe("");
  expect(screen.getByRole("button", { name: "Copiar código" })).toBeTruthy();
});
