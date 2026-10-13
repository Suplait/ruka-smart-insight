import { useEffect } from "react";
import { invokeLeadIntake, leadTraceabilityEnabled, readLeadContinuation, type LeadContinuation } from "@/services/leadIntake";

/** A separate listener: existing analytics handlers and widget options stay intact. */
export function useCalendlyObservation(key?: string | number, continuation?: LeadContinuation) {
  useEffect(() => {
    if (!leadTraceabilityEnabled() || !key) return;
    const seen = new Set<string>();
    const observe = (event: MessageEvent) => {
      if (event.origin !== "https://calendly.com" || event.data?.event !== "calendly.event_scheduled") return;
      const fromEmbed = Array.from(document.querySelectorAll("iframe")).some(frame => {
        try { return new URL(frame.src).origin === event.origin && frame.contentWindow === event.source; } catch { return false; }
      });
      if (!fromEmbed) return;
      const eventUri = event.data?.payload?.event?.uri;
      const inviteeUri = event.data?.payload?.invitee?.uri;
      if (typeof eventUri !== "string" || !/^https:\/\/api.calendly.com\/scheduled_events\/[a-zA-Z0-9-]+$/.test(eventUri)) return;
      if (inviteeUri != null && (typeof inviteeUri !== "string" ||
        !/^https:\/\/api.calendly.com\/scheduled_events\/[a-zA-Z0-9-]+\/invitees\/[a-zA-Z0-9-]+$/.test(inviteeUri) ||
        inviteeUri.split("/invitees/")[0] !== eventUri)) return;
      const reference = inviteeUri ?? eventUri;
      if (seen.has(reference)) return;
      const owner = readLeadContinuation(key, continuation);
      if (!owner) return;
      seen.add(reference);
      void invokeLeadIntake(owner, { action: "observe_calendar", event_uri: eventUri, invitee_uri: inviteeUri });
    };
    window.addEventListener("message", observe);
    return () => window.removeEventListener("message", observe);
  }, [key, continuation]);
}
