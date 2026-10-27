import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { BillingDocumentGuide } from "@/components/resources/BillingDocumentGuide";
import { BillingStatusGuide } from "@/components/resources/BillingStatusGuide";
import { BillingPreparation } from "@/components/resources/BillingPreparation";
import { BillingCapture } from "@/components/resources/BillingCapture";
import {
  billingDocuments,
  billingStates,
  billingPreparation,
  billingPreparationText,
} from "@/content/billingExperience";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("billing document guide", () => {
  for (const group of billingDocuments) {
    it(`explains ${group.id} without hiding other documents from the HTML`, async () => {
      const user = userEvent.setup();
      render(<BillingDocumentGuide />);
      await user.click(
        screen.getByRole("tab", { name: group.label }),
      );
      const panel = within(screen.getByRole("tabpanel"));
      expect(panel.getByRole("heading", { name: group.title })).toBeTruthy();
      for (const document of group.documents)
        expect(
          panel.getByRole("heading", { name: document.name }),
        ).toBeTruthy();
      expect(panel.getByText(group.note)).toBeTruthy();
      expect(
        screen
          .getByRole("tab", { name: group.label })
          .getAttribute("aria-selected"),
      ).toBe("true");
      expect(document.querySelectorAll('[role="tabpanel"]')).toHaveLength(4);
    });
  }
  it("supports arrow-key navigation and selected focus", async () => {
    const user = userEvent.setup();
    render(<BillingDocumentGuide />);
    screen.getByRole("tab", { name: "Vender" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(
      screen
        .getByRole("tab", { name: "Despachar" })
        .getAttribute("aria-selected"),
    ).toBe("true");
    await user.keyboard("{End}");
    expect(
      screen
        .getByRole("tab", { name: "Otros documentos" })
        .getAttribute("aria-selected"),
    ).toBe("true");
    await user.keyboard("{Home}");
    expect(
      screen
        .getByRole("tab", { name: "Vender" })
        .getAttribute("aria-selected"),
    ).toBe("true");
  });
});

describe("billing state guidance", () => {
  for (const state of billingStates) {
    it(`explains ${state.id} and its boundary`, async () => {
      const user = userEvent.setup();
      render(<BillingStatusGuide />);
      await user.click(
        screen.getByRole("tab", { name: state.label }),
      );
      const panel = within(screen.getByRole("tabpanel"));
      expect(panel.getByRole("heading", { name: state.title })).toBeTruthy();
      expect(panel.getByText(state.limit)).toBeTruthy();
      expect(screen.getByText(/no una consulta al SII/)).toBeTruthy();
    });
  }
});

describe("personal preparation", () => {
  it("counts independently, unchecks and resets without submitting anything", async () => {
    const user = userEvent.setup();
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(
      <MemoryRouter>
        <BillingPreparation />
      </MemoryRouter>,
    );
    expect(
      screen
        .getByRole("button", { name: "Reiniciar" })
        .hasAttribute("disabled"),
    ).toBe(true);
    for (const box of screen.getAllByRole("checkbox")) await user.click(box);
    expect(screen.getByRole("status").textContent).toContain(
      "4 de 4 puntos identificados",
    );
    expect(screen.getByText(/no verifica ni certifica/)).toBeTruthy();
    await user.click(screen.getAllByRole("checkbox")[0]);
    expect(screen.getByRole("status").textContent).toContain("3 de 4");
    await user.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(screen.getByRole("status").textContent).toContain("0 de 4");
    expect(document.querySelector("form")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
  });
  it("does not persist preparation between visits", async () => {
    const user = userEvent.setup();
    const view = render(
      <MemoryRouter>
        <BillingPreparation />
      </MemoryRouter>,
    );
    await user.click(screen.getAllByRole("checkbox")[0]);
    view.unmount();
    render(
      <MemoryRouter>
        <BillingPreparation />
      </MemoryRouter>,
    );
    expect(screen.getByRole("status").textContent).toContain("0 de 4");
  });
  it("downloads the actual selection and clears stale success on edits", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "URL",
      class extends URL {
        static createObjectURL = vi.fn(() => "blob:qa");
        static revokeObjectURL = vi.fn();
      },
    );
    let filename = "";
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(
      function () {
        filename = this.download;
      },
    );
    render(
      <MemoryRouter>
        <BillingPreparation />
      </MemoryRouter>,
    );
    await user.click(screen.getAllByRole("checkbox")[0]);
    await user.click(
      screen.getByRole("button", { name: "Descargar mi pauta" }),
    );
    expect(filename).toBe("ruka-preparar-facturacion.txt");
    expect(
      screen.getByRole("button", { name: "Pauta descargada" }),
    ).toBeTruthy();
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(document.querySelector("a[download]")).toBeNull();
    await user.click(screen.getAllByRole("checkbox")[1]);
    expect(
      screen.getByRole("button", { name: "Descargar mi pauta" }),
    ).toBeTruthy();
  });
  it("recovers when downloading is blocked", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "URL",
      class extends URL {
        static createObjectURL = vi.fn(() => {
          throw new Error("blocked");
        });
        static revokeObjectURL = vi.fn();
      },
    );
    render(
      <MemoryRouter>
        <BillingPreparation />
      </MemoryRouter>,
    );
    await user.click(
      screen.getByRole("button", { name: "Descargar mi pauta" }),
    );
    expect(screen.getByRole("alert").textContent).toContain(
      "No pudimos descargar",
    );
    expect(
      (
        screen.getByRole("textbox", {
          name: "Pauta para copiar",
        }) as HTMLTextAreaElement
      ).value,
    ).toBe(billingPreparationText([]));
    await user.click(screen.getByRole("button", { name: "Reiniciar" }));
    expect(screen.queryByRole("alert")).toBeNull();
  });
  it("exports a personal checklist, not approval or a tax certificate", () => {
    const text = billingPreparationText(["company"]);
    expect(text).toContain("[x] Empresa y permisos");
    expect(text).toContain("[ ] Certificado y folios");
    expect(text).toContain("No compartas contraseñas");
    expect(text).toContain("No verifica");
    expect(
      billingPreparationText(billingPreparation.map((item) => item.id)).match(
        /\[x\]/g,
      ),
    ).toHaveLength(4);
  });
});

describe("real product captures", () => {
  for (const [kind, name] of [
    ["preview", "revisión de importes"],
    ["book", "libro de compras"],
  ] as const) {
    it(`opens ${kind} without leaving the page and restores focus`, async () => {
      const user = userEvent.setup();
      render(<BillingCapture kind={kind} />);
      const trigger = screen.getByRole("button", { name: `Ampliar ${name}` });
      await user.click(trigger);
      expect(screen.getByRole("dialog")).toBeTruthy();
      expect(
        within(screen.getByRole("dialog")).getByRole("img").getAttribute("alt"),
      ).toMatch(/fictici/);
      expect(
        screen
          .getByRole("region", { name: /Captura ampliada/ })
          .getAttribute("tabindex"),
      ).toBe("0");
      await user.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });
  }
});
