import { pushToDataLayer } from "@/utils/dataLayer";

export type OneEventName =
  | "one_page_view"
  | "one_contact_view"
  | "one_form_submit_attempt"
  | "one_lead_created"
  | "one_calendly_view"
  | "one_calendly_scheduled"
  | "one_success_view";

export type OneTrackingPayload = {
  page_path: string;
  lead_id?: string;
  calendly_event_uri?: string;
};

export function trackOneEvent(event: OneEventName, payload: OneTrackingPayload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  pushToDataLayer(event, {
    funnel: "ruka_one",
    page_path: payload.page_path,
    ...(payload.lead_id ? { lead_id: payload.lead_id } : {}),
    ...(payload.calendly_event_uri ? { calendly_event_uri: payload.calendly_event_uri } : {}),
  });
}
