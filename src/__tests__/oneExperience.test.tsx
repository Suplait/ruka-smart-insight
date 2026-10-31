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
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    (globalThis as unknown as { CSS: Pick<typeof CSS, "supports"> }).CSS = { supports: () => true } as Pick<typeof CSS, "supports">;
  }
});
afterEach(() => { cleanup(); window.dataLayer = []; });

const renderOne = () => render(<MemoryRouter initialEntries={["/one"]}><One /></MemoryRouter>);

describe("Ruka One landing", () => {
  it("states the promise in a single H1 and sends every primary action to the contact route", () => {
    renderOne();
    const h1 = screen.getAllByRole("heading", { level: 1 });
    expect(h1).toHaveLength(1);
    expect(h1[0].textContent?.replace(/\s+/g, " ").trim()).toBe(oneContent.hero.title);
    // Value leads the H1; the mechanism (and the search intent) is spelled out right below it.
    expect(oneContent.hero.title).not.toMatch(/agente/i);
    expect(oneContent.hero.title).not.toBe(oneContent.seo.title);
    expect(oneContent.seo.title).toMatch(/agentes de IA/i);
    const lead = screen.getByText(oneContent.hero.lead);
    expect(lead.textContent).toMatch(/agentes de IA/);
    expect(lead.textContent).toMatch(/automatización/);
    expect(lead.textContent).toMatch(/supervisión humana/);
    const ctas = Array.from(document.querySelectorAll<HTMLAnchorElement>("a.one-cta"));
    expect(ctas.length).toBeGreaterThanOrEqual(3);
    for (const cta of ctas) expect(cta.getAttribute("href")).toBe("/one/contacto");
  });

  it("keeps the whole narrative and every FAQ answer in the HTML without JS-driven state", () => {
    renderOne();
    for (const text of [oneContent.between.eyebrow, oneContent.difference.title, oneContent.difference.note, oneContent.how.title, oneContent.scope.title, oneContent.impact.title, oneContent.impact.roi.copy, oneContent.impact.platform]) {
      expect(document.body.textContent).toContain(text);
    }
    for (const item of oneContent.faq.items) {
      expect(screen.getByText(item.question)).toBeTruthy();
      expect(screen.getByText(item.answer)).toBeTruthy();
    }
    // Areas are labelled as illustrative, never as customer cases.
    expect(screen.getAllByText(oneContent.areas.disclaimer).length).toBe(oneContent.areas.items.length);
  });

  it("names each beat of «Cómo ocurre» in a few words and follows the field", () => {
    renderOne();
    const section = document.getElementById(oneContent.how.id)!;
    const items = section.querySelectorAll("ol > li");
    expect(items).toHaveLength(oneContent.how.stages.length);
    expect(oneContent.how.stages.length).toBeLessThanOrEqual(4);
    for (const stage of oneContent.how.stages) {
      expect(stage.label.split(" ").length).toBeLessThanOrEqual(3);
      expect(stage.text.split(" ").length).toBeLessThanOrEqual(12);
    }
    const body = Array.from(items).map((item) => item.textContent ?? "").join(" ");
    expect(body.split(/\s+/).filter((word) => /\p{L}/u.test(word)).length).toBeLessThanOrEqual(60);
    // Live (motion allowed): pinned stage, one beat per band, first beat active before the chapter.
    expect(section.classList.contains("is-live")).toBe(true);
    expect(items[0].getAttribute("aria-current")).toBe("step");
  });

  it("keeps «Cómo ocurre» static and on the final beat under reduced motion", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({ matches: query.includes("reduce"), media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
    try {
      renderOne();
      const section = document.getElementById(oneContent.how.id)!;
      expect(section.classList.contains("is-live")).toBe(false);
      const beats = Array.from(section.querySelectorAll("[data-scene]")).map((node) => node.getAttribute("data-scene"));
      expect(new Set(beats)).toEqual(new Set(["how-result"]));
      expect(section.querySelector("[aria-current]")).toBeNull();
    } finally {
      window.matchMedia = original;
    }
  });

  it("does not pin «Cómo ocurre» where the browser cannot undo the global overflow reset", () => {
    const spy = vi.spyOn(CSS, "supports").mockReturnValue(false);
    try {
      renderOne();
      expect(document.getElementById(oneContent.how.id)!.classList.contains("is-live")).toBe(false);
    } finally {
      spy.mockRestore();
    }
  });

  it("lets keyboard users move through the areas as tabs", () => {
    renderOne();
    const tablist = screen.getByRole("tablist", { name: "Ejemplos por área" });
    const tabs = within(tablist).getAllByRole("tab");
    expect(tabs[0].getAttribute("aria-selected")).toBe("true");
    act(() => { tabs[0].focus(); });
    fireEvent.keyDown(tablist, { key: "ArrowDown" });
    expect(tabs[1].getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(tabs[1]);
    const panel = document.getElementById("one-area-panel-1")!;
    expect(panel.hidden).toBe(false);
    expect(panel.textContent).toContain(oneContent.areas.items[1].work);
    expect(panel.textContent).toContain(oneContent.areas.items[1].result);
    fireEvent.keyDown(tablist, { key: "End" });
    expect(tabs[tabs.length - 1].getAttribute("aria-selected")).toBe("true");
  });

  it("leads with outcomes: agents are the means, not the headline", () => {
    renderOne();
    const text = document.body.textContent ?? "";
    for (const stale of ["operado por Ruka", "¿Quién decide?", "La última palabra", "Lo que decides tú", "Las decisiones siguen siendo tuyas", "No prometemos que nada falle", "Ahí ponemos agentes a trabajar", "Poner agentes a trabajar", "Lo que hacen los agentes"]) {
      expect(text).not.toContain(stale);
    }
    // The comparison never answers "Ruka" in its cells; the last row is the outcome.
    for (const row of oneContent.difference.rows) {
      expect(row.one).not.toMatch(/ruka|agente/i);
      expect(row.software).not.toMatch(/ruka|agente/i);
    }
    expect(oneContent.difference.columns[1]).not.toMatch(/agente|IA/);
    // Headings carry benefits; AI shows up where it explains how, not in every title.
    const headings = Array.from(document.querySelectorAll("h1, h2, h3")).map((node) => node.textContent ?? "");
    expect(headings.filter((text) => /agente/i.test(text)).length).toBeLessThanOrEqual(1);
    for (const item of oneContent.areas.items) expect(`${item.example} ${item.work}`).not.toMatch(/agente/i);
    const visible = (document.body.textContent ?? "").match(/\bagentes?\b/gi) ?? [];
    expect(visible.length).toBeGreaterThanOrEqual(2);
    expect(visible.length).toBeLessThanOrEqual(6);
    const rows = document.querySelectorAll(".one-ledger-row");
    expect(rows).toHaveLength(oneContent.difference.rows.length);
    expect(rows[rows.length - 1].classList.contains("one-ledger-row--outcome")).toBe(true);
    // "¿Y tu proceso?" closes the examples.
    expect(oneContent.areas.items[oneContent.areas.items.length - 1].name).toBe("¿Y tu proceso?");
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

describe("Ruka One field scenes", () => {
  it("gives every example tab its own region and keeps chapter scenes in sync with the page", async () => {
    const { areaScopes, resolveScene } = await import("@/components/one/field/fieldScenes");
    expect(areaScopes).toHaveLength(oneContent.areas.items.length);
    expect(resolveScene("areas", "wide", 2).scope).toEqual(areaScopes[2]);
    // "Cómo ocurre" walks one region of the field through need → solution → running → result.
    const beats = oneContent.how.stages.map((stage) => stage.scene);
    expect(beats).toEqual(["how-need", "how-build", "how-run", "how-result"]);
    for (const layout of ["wide", "narrow"] as const) {
      expect(beats.map((beat) => resolveScene(beat, layout).how)).toEqual([0, 1, 2, 3]);
      for (const beat of beats) expect(resolveScene(beat, layout).howOn).toBe(1);
      expect(resolveScene("scope", layout).howOn).toBe(0);
    }
    // The result rises only at the end of the arc; the hero lifts the single result tile.
    expect(resolveScene("how-run", "wide").beacon).toBe(0);
    expect(resolveScene("how-result", "wide").beacon).toBe(1);
    expect(resolveScene("hero", "wide").beacon).toBe(1);
    renderOne();
    const scenes = Array.from(document.querySelectorAll("[data-scene]")).map((node) => node.getAttribute("data-scene"));
    expect(scenes).toEqual(["hero", "friction", "shift", ...beats, "scope", "areas", "impact", "rest", "close"]);
  });
});
