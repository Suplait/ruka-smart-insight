import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { calendlyRequestUrl, reconcileCalendlyPage, type ReconcileState } from "../_shared/calendlyReconciliation.ts";
import { tokenDigest } from "../_shared/leadValidation.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
class CalendarApiError extends Error {
  constructor(public code: string, public retryAfter = 60) { super(code); }
}
type Checkpoint = { state: ReconcileState; revision: number; lease_id: string; user_uri: string };

export async function handleCalendlyReconciliation(request: Request) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const supplied = request.headers.get("Authorization")?.replace(/^Bearer /, "");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const workerKey = Deno.env.get("LEAD_TRACEABILITY_WORKER_TOKEN");
  if (!supplied || !(await Promise.all([serviceKey, workerKey].map(async key => !!key && await tokenDigest(key) === await tokenDigest(supplied)))).some(Boolean)) return json({ error: "Unauthorized" }, 401);
  let account = "classic";
  try {
    const raw = await request.text();
    if (raw.length > 1024) return json({ error: "Payload too large" }, 413);
    account = raw ? JSON.parse(raw).account ?? "classic" : "classic";
  } catch { return json({ error: "Invalid request" }, 400); }
  if (!["classic", "one"].includes(account)) return json({ error: "Unknown calendar account" }, 400);
  // One uses Lorenzo's separate calendar. Never silently substitute Mauro's token.
  const accessToken = Deno.env.get(account === "one" ? "CALENDLY_ONE_ACCESS_TOKEN" : "CALENDLY_ACCESS_TOKEN");
  const userUri = Deno.env.get(account === "one" ? "LEAD_CALENDLY_ONE_USER_URI" : "LEAD_CALENDLY_USER_URI");
  if (Deno.env.get("LEAD_CALENDLY_RECONCILE_ENABLED") !== "true" || !accessToken || !userUri) return json({ enabled: false });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey!, { auth: { persistSession: false },
    global: { fetch: (input, init) => fetch(input, { ...init, signal: AbortSignal.timeout(10000) }) },
  });
  let checkpoint: Checkpoint | null = null;
  const get = async (url: string) => {
    const parsed = new URL(url);
    if (parsed.origin !== "https://api.calendly.com" || parsed.username || parsed.password) throw new CalendarApiError("invalid_api_destination");
    const response = await fetch(url, { method: "GET", headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json", "User-Agent": "RukaLeadTraceability/1.0" }, redirect: "error", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new CalendarApiError(response.status === 429 ? "calendly_rate_limited" : "calendly_read_failed", Math.min(3600, Math.max(60, Number(response.headers.get("retry-after")) || 60)));
    if (Number(response.headers.get("content-length")) > 2097152) throw new CalendarApiError("calendly_response_too_large");
    const raw = await response.text();
    if (raw.length > 2097152) throw new CalendarApiError("calendly_response_too_large");
    return JSON.parse(raw);
  };
  try {
    const profile = await get("https://api.calendly.com/users/me");
    if (profile?.resource?.uri !== userUri) throw new CalendarApiError("calendar_account_mismatch");
    const claimed = await db.rpc("trace_claim_calendar_reconciliation", { p_user_uri: userUri });
    if (claimed.error) throw new CalendarApiError("checkpoint_claim_failed");
    if (!claimed.data?.lease_id) return json({ waiting: true });
    checkpoint = claimed.data as Checkpoint;
    let pages = 0, receipts = 0;
    // Four bounded API pages per call. Resume from the last atomic checkpoint.
    while (pages < 4 && !checkpoint.state.complete) {
      const url = calendlyRequestUrl(checkpoint.state);
      if (!url) break;
      const projected = await reconcileCalendlyPage(checkpoint.state, await get(url));
      const committed = await db.rpc("trace_commit_calendar_reconciliation", {
        p_user_uri: userUri, p_lease: checkpoint.lease_id, p_revision: checkpoint.revision,
        p_state: projected.state, p_meetings: projected.meetings,
      });
      if (committed.error || committed.data !== true) throw new CalendarApiError("checkpoint_commit_failed");
      checkpoint.state = projected.state; checkpoint.revision++;
      pages++; receipts += projected.meetings.length;
    }
    if (!checkpoint.state.complete) {
      const released = await db.rpc("trace_release_calendar_reconciliation", { p_user_uri: userUri, p_lease: checkpoint.lease_id });
      if (released.error || released.data !== true) throw new CalendarApiError("checkpoint_release_failed");
    }
    return json({ account, pages, receipts, cycle_completed: checkpoint.state.complete });
  } catch (error) {
    const reason = error instanceof CalendarApiError ? error.code : "calendar_reconciliation_failed";
    if (checkpoint) await db.rpc("trace_release_calendar_reconciliation", { p_user_uri: checkpoint.user_uri, p_lease: checkpoint.lease_id,
      p_error: reason, p_retry_after: error instanceof CalendarApiError ? error.retryAfter : 60 });
    await db.from("lead_traceability_health").upsert({ job: `calendly_reconciliation:${userUri}`,
      last_started_at: new Date().toISOString(), result: { account, error: reason } }, { onConflict: "job" });
    // Do not log request bodies, URLs with cursors, profiles, or API responses.
    return json({ error: reason }, reason === "calendar_account_mismatch" ? 409 : 503);
  }
}
