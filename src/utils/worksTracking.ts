import { pushToDataLayer } from "@/utils/dataLayer";

export type WorksEventName =
  | "works_page_view"
  | "works_contact_view"
  | "works_form_submit_attempt"
  | "works_lead_created"
  | "works_calendly_view"
  | "works_calendly_scheduled"
  | "works_success_view";

export type WorksTrackingPayload = {
  page_path: string;
  lead_id?: string;
  company?: string;
  frequency?: string;
  manual_hours?: string;
  calendly_event_uri?: string;
};

export function trackWorksEvent(event: WorksEventName, payload: WorksTrackingPayload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  pushToDataLayer(event, {
    funnel: "ruka_works",
    page_path: payload.page_path,
    ...(payload.lead_id ? { lead_id: payload.lead_id } : {}),
    ...(payload.company ? { company: payload.company } : {}),
    ...(payload.frequency ? { frequency: payload.frequency } : {}),
    ...(payload.manual_hours ? { manual_hours: payload.manual_hours } : {}),
    ...(payload.calendly_event_uri ? { calendly_event_uri: payload.calendly_event_uri } : {}),
  });
}
