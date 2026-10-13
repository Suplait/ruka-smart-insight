import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCalendlyObservation } from "@/hooks/useCalendlyObservation";
import { createLeadSubmission } from "@/services/leadIntake";

const backend = vi.hoisted(() => ({ invoke: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { functions: { invoke: backend.invoke } } }));
const eventUri = "https://api.calendly.com/scheduled_events/event-1";
const data = { event: "calendly.event_scheduled", payload: { event: { uri: eventUri }, invitee: { uri: `${eventUri}/invitees/person-1` } } };

beforeEach(() => { vi.clearAllMocks(); vi.stubEnv("VITE_LEAD_TRACEABILITY", "true"); window.dataLayer = []; backend.invoke.mockResolvedValue({ data: { success: true }, error: null }); });
afterEach(() => { cleanup(); document.querySelectorAll("iframe").forEach(frame => frame.remove()); vi.unstubAllEnvs(); });

describe("independent Calendly observation", () => {
  it("rejects spoofed origins and unrelated sources, deduplicates genuine embed messages", async () => {
    const submission = createLeadSubmission()!;
    const frame = document.createElement("iframe");
    frame.src = "https://calendly.com/ruka-ai/calendar";
    document.body.append(frame);
    renderHook(() => useCalendlyObservation(submission.continuation.submission_id));
    const send = (origin: string, source: MessageEventSource | null, body = data) => window.dispatchEvent(new MessageEvent("message", { origin, source, data: body }));
    await act(async () => {
      send("https://calendly.com.evil.example", frame.contentWindow);
      send("https://calendly.com", window);
      send("https://calendly.com", null);
    });
    expect(backend.invoke).not.toHaveBeenCalled();
    await act(async () => { send("https://calendly.com", frame.contentWindow); send("https://calendly.com", frame.contentWindow); });
    expect(backend.invoke).toHaveBeenCalledTimes(1);
    expect(backend.invoke.mock.calls[0][1].body).toMatchObject({ action: "observe_calendar", event_uri: eventUri, invitee_uri: `${eventUri}/invitees/person-1` });
    expect(window.dataLayer).toEqual([]);
  });

  it("does not add a listener for debug/no lead or a disabled rollout", async () => {
    const listener = vi.spyOn(window, "addEventListener");
    renderHook(() => useCalendlyObservation());
    vi.stubEnv("VITE_LEAD_TRACEABILITY", "false");
    renderHook(() => useCalendlyObservation("missing"));
    expect(listener.mock.calls.filter(([name]) => name === "message")).toHaveLength(0);
    listener.mockRestore();
  });

  it("keeps separate invitees of a group event and rejects mismatched references", async () => {
    const submission = createLeadSubmission()!;
    const frame = document.createElement("iframe");
    frame.src = "https://calendly.com/ruka-ai/calendar";
    document.body.append(frame);
    renderHook(() => useCalendlyObservation(submission.continuation.submission_id));
    const send = (uri: string) => window.dispatchEvent(new MessageEvent("message", {
      origin: "https://calendly.com", source: frame.contentWindow,
      data: { ...data, payload: { ...data.payload, invitee: { uri } } },
    }));
    await act(async () => {
      send("https://api.calendly.com/scheduled_events/other-event/invitees/person-1");
      send(`${eventUri}/invitees/person-1?email=private`);
      send(`${eventUri}/invitees/person-1`);
      send(`${eventUri}/invitees/person-2`);
      send(`${eventUri}/invitees/person-2`);
    });
    expect(backend.invoke).toHaveBeenCalledTimes(2);
    expect(window.dataLayer).toEqual([]);
  });
});
