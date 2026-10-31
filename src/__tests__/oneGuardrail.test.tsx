import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OneContact from "@/pages/OneContact";

const backend = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: backend.invoke } } }));
vi.mock("@/components/one/OneSeo", () => ({ OneContactSeo: () => null }));
vi.mock("@/components/one/field/OneField", () => ({ OneField: () => null }));
vi.mock("@/components/one/OneSuccess", () => ({ OneSuccess: () => <p>Agenda recibida</p> }));
vi.mock("@/components/one/OneContactForm", () => ({ OneContactForm: ({ onContinue }: { onContinue: (lead: unknown) => void }) => <button onClick={() => onContinue({ name: "QA One", company: "Example", email: "qa@example.invalid", whatsapp: "900000000" })}>Continuar prueba</button> }));
vi.mock("@/components/one/OneCalendly", () => ({ OneCalendly: ({ onScheduled }: { onScheduled: (uri: string) => void }) => <button onClick={() => onScheduled("https://api.calendly.com/scheduled_events/example")}>Confirmar prueba</button> }));

beforeEach(() => {
  vi.clearAllMocks();
  window.dataLayer = [];
  sessionStorage.clear();
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
  // Keep the remote request pending: this documents the existing early-success contract.
  backend.invoke.mockImplementation(() => new Promise(() => {}));
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe.each([false, true])("One tracking contract (secure intake: %s)", secure => {
  it("preserves event payloads/order and immediate calendar progression while persistence is pending", async () => {
    vi.stubEnv("VITE_LEAD_TRACEABILITY", String(secure));
    render(<MemoryRouter initialEntries={["/one/contacto"]}><OneContact /></MemoryRouter>);
    await act(async () => { fireEvent.click(screen.getByText("Continuar prueba")); });
    expect(screen.getByText("Confirmar prueba")).toBeTruthy();
    const created = window.dataLayer.find(item => item.event === "one_lead_created");
    const id = created.lead_id;
    expect(backend.invoke).toHaveBeenCalledTimes(1);
    expect(backend.invoke.mock.calls[0][0]).toBe(secure ? "lead-intake" : "notify-one-slack");
    await act(async () => { fireEvent.click(screen.getByText("Confirmar prueba")); });
    const withoutTime = window.dataLayer.map(({ timestamp: _timestamp, ...event }) => event);
    expect(withoutTime).toEqual([
      { event: "one_contact_view", funnel: "ruka_one", page_path: "/one/contacto" },
      { event: "one_form_submit_attempt", funnel: "ruka_one", page_path: "/one/contacto" },
      { event: "one_lead_created", funnel: "ruka_one", page_path: "/one/contacto", lead_id: id },
      { event: "one_calendly_view", funnel: "ruka_one", page_path: "/one/contacto", lead_id: id },
      { event: "one_calendly_scheduled", funnel: "ruka_one", page_path: "/one/contacto", lead_id: id, calendly_event_uri: "https://api.calendly.com/scheduled_events/example" },
      { event: "one_success_view", funnel: "ruka_one", page_path: "/one/contacto", lead_id: id },
    ]);
    expect(screen.getByText("Agenda recibida")).toBeTruthy();
    // The secure path leaves authoritative notification to the webhook/worker.
    expect(backend.invoke).toHaveBeenCalledTimes(secure ? 1 : 2);
  });
});
