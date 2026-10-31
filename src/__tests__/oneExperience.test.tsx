import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import One from "@/pages/One";
import { OneContactForm } from "@/components/one/OneContactForm";
import { emptyOneLead, oneContent, type OneLeadData } from "@/content/oneContent";

vi.mock("@/components/one/field/OneField", () => ({ OneField: () => null }));
vi.mock("@/components/one/OneSeo", () => ({ OneSeo: () => null }));

beforeAll(() => {
  // jsdom has neither; the page must still render complete without them.
  window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  class NoopObserver { observe() {} unobserve() {} disconnect() {} }
  window.IntersectionObserver ??= NoopObserver as unknown as typeof IntersectionObserver;
});
afterEach(() => { cleanup(); window.dataLayer = []; });

const renderOne = () => render(<MemoryRouter initialEntries={["/one"]}><One /></MemoryRouter>);

describe("Ruka One landing", () => {
  it("states the promise in a single H1 and sends every primary action to the contact route", () => {
    renderOne();
    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent?.replace(/\s+/g, " ").trim()).toBe("Tu back office, operado por Ruka.");
    const ctas = Array.from(document.querySelectorAll<HTMLAnchorElement>("a.one-cta"));
    expect(ctas.length).toBeGreaterThanOrEqual(3);
    for (const cta of ctas) expect(cta.getAttribute("href")).toBe("/one/contacto");
  });

  it("keeps the whole narrative and every FAQ answer in the HTML without JS-driven state", () => {
    renderOne();
    for (const text of [oneContent.difference.title, oneContent.split.title, oneContent.scope.title, oneContent.trust.title, oneContent.trust.platform]) {
      expect(document.body.textContent).toContain(text);
    }
    for (const item of oneContent.faq.items) {
      expect(screen.getByText(item.question)).toBeTruthy();
      expect(screen.getByText(item.answer)).toBeTruthy();
    }
    // Areas are labelled as illustrative, never as customer cases.
    expect(screen.getAllByText(oneContent.areas.disclaimer).length).toBe(oneContent.areas.items.length);
  });

  it("lets keyboard users move through the areas as tabs", () => {
    renderOne();
    const tablist = screen.getByRole("tablist", { name: "Áreas de ejemplo" });
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    act(() => { tabs[0].focus(); });
    fireEvent.keyDown(tablist, { key: "ArrowDown" });
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(tabs[1]);
    const panel = document.getElementById("one-area-panel-1")!;
    expect(panel.hidden).toBe(false);
    expect(panel.textContent).toContain(oneContent.areas.items[1].yours);
    fireEvent.keyDown(tablist, { key: "End" });
    expect(tabs[tabs.length - 1].getAttribute("aria-selected")).toBe("true");
  });

  it("tracks one_page_view once", () => {
    window.dataLayer = [];
    renderOne();
    expect(window.dataLayer.filter((event) => event.event === "one_page_view")).toHaveLength(1);
  });
});

describe("Ruka One contact form", () => {
  it("keeps field ids, validation messages and the 9-digit WhatsApp rule", async () => {
    const onContinue = vi.fn(async () => {});
    let value: OneLeadData = { ...emptyOneLead };
    const { rerender } = render(<OneContactForm value={value} onChange={(next) => { value = typeof next === "function" ? next(value) : next; }} onContinue={onContinue} />);
    await act(async () => { fireEvent.submit(document.getElementById("one-contact-form")!); });
    for (const message of ["Ingresa tu nombre.", "Ingresa el nombre de tu empresa.", "Ingresa un email de trabajo válido.", "Ingresa un WhatsApp válido de 9 dígitos."]) {
      expect(screen.getByText(message)).toBeTruthy();
    }
    expect(onContinue).not.toHaveBeenCalled();
    for (const id of ["one-name", "one-company", "one-email", "one-whatsapp"]) expect(document.getElementById(id)?.getAttribute("aria-invalid")).toBe("true");

    value = { name: "Ana", company: "Empresa", email: "ana@empresa.cl", whatsapp: "912345678" };
    rerender(<OneContactForm value={value} onChange={() => {}} onContinue={onContinue} />);
    expect(screen.getByText("4 de 4")).toBeTruthy();
    await act(async () => { fireEvent.submit(document.getElementById("one-contact-form")!); });
    expect(onContinue).toHaveBeenCalledWith(value);
  });
});
