import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RegistrationForm from "@/components/restaurant/RegistrationForm";

const backend = vi.hoisted(() => ({ invoke: vi.fn(), insert: vi.fn(), single: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: backend.invoke },
    from: () => ({ insert: backend.insert }),
  },
}));
vi.mock("@/components/ui/use-toast", () => ({ toast: vi.fn() }));

function eventNames() {
  return window.dataLayer.map(item => item.event);
}

function fillAndSubmit() {
  render(<MemoryRouter initialEntries={["/restaurantes"]}>
    <Routes>
      <Route path="/restaurantes" element={<RegistrationForm highlightForm={false} timeLeft="" />} />
      <Route path="/onboarding-success" element={<p>Onboarding disponible</p>} />
    </Routes>
  </MemoryRouter>);
  for (const [placeholder, value] of [
    ["Nombre", "Prueba"], ["Apellido", "Local"], ["Email", "lead@example.invalid"],
    ["Ciudad", "Santiago"], ["Nombre de tu Empresa", "QA local"],
  ]) fireEvent.change(screen.getByPlaceholderText(placeholder, { exact: true }), { target: { value } });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Agendar Llamada" }));
}

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  });
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-13T12:00:00Z"));
  vi.clearAllMocks();
  vi.stubEnv("VITE_LEAD_TRACEABILITY", "false");
  window.dataLayer = [];
  localStorage.clear();
  backend.invoke.mockResolvedValue({ data: { success: true, ts: "1234.5678" }, error: null });
  backend.single.mockResolvedValue({ data: { id: 42 }, error: null });
  backend.insert.mockImplementation(() => ({ select: () => ({ single: backend.single }) }));
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.useRealTimers();
});

describe.each([false, true])("restaurant conversion contract (secure intake: %s)", secure => {
  const invoke = (_endpoint: string, options: { body: { action?: string } }) => {
    if (options.body.action === "submit") return backend.single().then(result => ({ ...result, data: result.data ? { ...result.data, stored: true, success: true } : null }));
    return Promise.resolve({ data: { success: true, ts: "1234.5678" }, error: null });
  };
  beforeEach(() => {
    vi.stubEnv("VITE_LEAD_TRACEABILITY", String(secure));
    backend.invoke.mockImplementation(invoke);
  });
  it("retains pre-persistence submission events and emits success only after the insert", async () => {
    let persist: (value: unknown) => void;
    backend.single.mockImplementation(() => new Promise(resolve => { persist = resolve; }));
    fillAndSubmit();
    await act(async () => {});
    expect(eventNames()).toEqual(["registration_form_submit_attempt", "form_submission_success"]);
    expect(backend.single).toHaveBeenCalledTimes(1);
    await act(async () => persist({ data: { id: 42 }, error: null }));
    expect(window.dataLayer).toEqual([
      { event: "registration_form_submit_attempt", has_terms_accepted: true, timestamp: "2026-10-13T12:00:00.000Z" },
      { event: "form_submission_success", form_name: "restaurant_registration", form_data: {
        email_domain: "example.invalid", has_whatsapp: false, city: "Santiago", company_name: "QA local", has_promo_code: false,
      }, timestamp: "2026-10-13T12:00:00.000Z" },
      { event: "lead_created", lead_id: 42, company_name: "QA local", timestamp: "2026-10-13T12:00:00.000Z" },
      { event: "registration_success", lead_id: 42, restaurant_name: "QA local", timestamp: "2026-10-13T12:00:00.000Z" },
    ]);
    expect(screen.getByText("Onboarding disponible")).toBeTruthy();
  });

  it("still persists and navigates after the existing Slack timeout with blocked storage", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("Denied"); });
    backend.invoke.mockImplementation((endpoint, options) => options.body.action === "submit" ? invoke(endpoint, options) : new Promise(() => {}));
    fillAndSubmit();
    await act(async () => { await vi.advanceTimersByTimeAsync(9999); });
    expect(backend.single).not.toHaveBeenCalled();
    await act(async () => { await vi.advanceTimersByTimeAsync(1); });
    expect(backend.single).toHaveBeenCalledTimes(1);
    expect(eventNames()).toEqual(["registration_form_submit_attempt", "form_submission_success", "lead_created", "registration_success"]);
    expect(screen.getByText("Onboarding disponible")).toBeTruthy();
  });

  it("does not emit a successful lead or navigate if persistence fails", async () => {
    backend.single.mockResolvedValue({ data: null, error: new Error("Persistence unavailable") });
    fillAndSubmit();
    await act(async () => {});
    expect(eventNames()).toEqual(["registration_form_submit_attempt", "form_submission_success", "registration_error"]);
    expect(screen.queryByText("Onboarding disponible")).toBeNull();
  });
});
