import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const backend = vi.hoisted(() => ({ invoke: vi.fn(), from: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: backend.invoke }, from: backend.from } }));
const lead = { name: "Prueba Local", company_name: "Example", email: "qa@example.invalid", ccity: "Santiago", whatsapp: "" };

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv("VITE_LEAD_TRACEABILITY", "true");
  sessionStorage.clear();
  localStorage.clear();
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe("secure intake transport", () => {
  it("reuses a cryptographic continuation across retries and keeps it out of tracking", async () => {
    const api = await import("@/services/leadIntake");
    const first = api.createLeadSubmission()!;
    const second = api.createLeadSubmission(first.continuation.submission_id)!;
    expect(second.continuation).toEqual(first.continuation);
    expect(first.continuation.continuation_token).toMatch(/^[a-f0-9]{64}$/);
    window.dataLayer = [];
    backend.invoke.mockResolvedValue({ data: { success: true, stored: true, id: 42 }, error: null });
    await api.persistClassicLead(first, lead);
    expect(api.readLeadContinuation(42)).toEqual(first.continuation);
    expect(window.dataLayer).toEqual([]);
    expect(backend.from).not.toHaveBeenCalled();
  });

  it("continues in memory when storage is denied and rejects expired continuations", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("denied"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("denied"); });
    const api = await import("@/services/leadIntake");
    const submission = api.createLeadSubmission()!;
    expect(api.readLeadContinuation(submission.continuation.submission_id)).toEqual(submission.continuation);
    expect(api.readLeadContinuation(1, { ...submission.continuation, expires_at: 1 })).toBeNull();
    expect(api.readLeadContinuation(1, { ...submission.continuation, continuation_token: "bad" })).toBeNull();
  });

  it("never falls back to public writes when a secure request fails or is ambiguous", async () => {
    const api = await import("@/services/leadIntake");
    const submission = api.createLeadSubmission()!;
    backend.invoke.mockRejectedValue(new Error("Network interrupted"));
    expect((await api.persistClassicLead(submission, lead)).error).toBeTruthy();
    await api.finishClassicSlack(submission, lead, lead, 42);
    expect(backend.invoke.mock.calls.every(([endpoint]) => endpoint === "lead-intake")).toBe(true);
    expect(backend.from).not.toHaveBeenCalled();
  });

  it("cannot read or update a numeric lead ID without its continuation", async () => {
    const api = await import("@/services/leadIntake");
    expect((await api.getClassicLead(42, null)).error).toBeTruthy();
    expect((await api.updateClassicLead(42, null, { facturas_compra_mes: 75 })).error).toBeTruthy();
    expect(backend.invoke).not.toHaveBeenCalled();
    expect(backend.from).not.toHaveBeenCalled();
  });

  it("adds the fifth UTM without changing the legacy campaign values", async () => {
    const api = await import("@/services/leadIntake");
    window.history.replaceState({}, "", "/restaurantes?utm_term=restaurant");
    const submission = api.createLeadSubmission()!;
    backend.invoke.mockResolvedValue({ data: { ts: "1.2" }, error: null });
    await api.prepareClassicLead(submission, { ...lead, utm_source: "legacy" }, lead);
    expect(backend.invoke.mock.calls[0][1].body.lead).toMatchObject({ utm_source: "legacy", utm_term: "restaurant" });
  });
});
