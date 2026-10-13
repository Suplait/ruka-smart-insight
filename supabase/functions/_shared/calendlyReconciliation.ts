import { projectCalendlyEvidence } from "./calendlyEvidence.ts";
import { LeadRequestError, record } from "./leadValidation.ts";

type Status = "active" | "canceled";
type CalendarEvent = { uri: string; status: Status; start_time: string; updated_at: string };
export type ReconcileState = {
  user_uri: string; min_start_time: string; event_status: Status; event_page_token: string | null;
  event_pages_done: boolean; events: CalendarEvent[]; invitee_status: Status;
  invitee_page_token: string | null; complete: boolean;
};
const eventPattern = /^https:\/\/api.calendly.com\/scheduled_events\/[a-zA-Z0-9-]+$/;
const validDate = (v: unknown) => typeof v === "string" && Number.isFinite(Date.parse(v));

export function calendlyRequestUrl(state: ReconcileState) {
  if (!/^https:\/\/api.calendly.com\/users\/[a-zA-Z0-9-]+$/.test(state.user_uri) || !validDate(state.min_start_time)) throw new LeadRequestError("Invalid reconciliation scope");
  if (state.complete) return null;
  const event = state.events[0];
  if (event && !eventPattern.test(event.uri)) throw new LeadRequestError("Invalid event URL");
  // Never follow the arbitrary next_page URL from a remote response.
  const url = new URL(event ? `${event.uri}/invitees` : "https://api.calendly.com/scheduled_events");
  url.searchParams.set("count", event ? "100" : "20");
  url.searchParams.set("status", event ? state.invitee_status : state.event_status);
  if (!event) {
    url.searchParams.set("user", state.user_uri);
    url.searchParams.set("min_start_time", state.min_start_time);
    url.searchParams.set("sort", "start_time:asc");
  }
  const cursor = event ? state.invitee_page_token : state.event_page_token;
  if (cursor) url.searchParams.set("page_token", cursor);
  return url.toString();
}

function nextCursor(body: Record<string, unknown>, previous: string | null) {
  const cursor = record(body.pagination).next_page_token;
  if (cursor == null || cursor === "") return null;
  if (typeof cursor !== "string" || cursor.length > 2048 || cursor === previous) throw new LeadRequestError("Invalid pagination cursor");
  return cursor;
}

function advance(state: ReconcileState) {
  if (!state.events.length && state.event_pages_done) {
    if (state.event_status === "active") {
      state.event_status = "canceled"; state.event_page_token = null; state.event_pages_done = false;
    } else state.complete = true;
  }
  return state;
}

/** Return the next cursor and hashed evidence together; the database commits both atomically. */
export async function reconcileCalendlyPage(current: ReconcileState, input: unknown) {
  const body = record(input);
  if (!Array.isArray(body.collection) || body.collection.length > (current.events.length ? 100 : 20)) throw new LeadRequestError("Invalid Calendly collection");
  const state = structuredClone(current);
  const meetings: NonNullable<Awaited<ReturnType<typeof projectCalendlyEvidence>>>[] = [];
  const event = state.events[0];
  if (!event) {
    state.events = body.collection.map(item => {
      const value = record(item);
      if (typeof value.uri !== "string" || !eventPattern.test(value.uri) || !["active", "canceled"].includes(String(value.status)) || !validDate(value.start_time) || !validDate(value.updated_at)) throw new LeadRequestError("Invalid Calendly event");
      return { uri: value.uri, status: value.status as Status, start_time: value.start_time as string, updated_at: value.updated_at as string };
    });
    state.event_page_token = nextCursor(body, current.event_page_token);
    state.event_pages_done = !state.event_page_token;
  } else {
    for (const item of body.collection) {
      const invitee = record(item);
      if (invitee.event !== event.uri || !["active", "canceled"].includes(String(invitee.status))) throw new LeadRequestError("Invitee does not belong to event");
      const canceled = event.status === "canceled" || invitee.status === "canceled";
      const updatedAt = event.status === "canceled" && validDate(invitee.updated_at) && Date.parse(event.updated_at) > Date.parse(invitee.updated_at as string)
        ? event.updated_at : invitee.updated_at;
      const evidence = await projectCalendlyEvidence({ event: canceled ? "invitee.canceled" : "invitee.created", payload: {
        ...invitee, updated_at: updatedAt, scheduled_event: { start_time: event.start_time },
      } });
      if (evidence) meetings.push(evidence);
    }
    state.invitee_page_token = nextCursor(body, current.invitee_page_token);
    if (!state.invitee_page_token) {
      if (state.invitee_status === "active") state.invitee_status = "canceled";
      else { state.events.shift(); state.invitee_status = "active"; }
    }
  }
  return { state: advance(state), meetings };
}
