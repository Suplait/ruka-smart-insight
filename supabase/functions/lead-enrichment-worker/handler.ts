import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { tokenDigest } from "../_shared/leadValidation.ts";
import { slackEnrichmentMessage } from "../_shared/slackEnrichment.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
type Delivery = { id: number; submission_id: string; destination: string; lease_id: string; revision: number };

export async function handleLeadEnrichment(request: Request) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const token = Deno.env.get("LEAD_TRACEABILITY_WORKER_TOKEN");
  const supplied = request.headers.get("Authorization")?.replace(/^Bearer /, "");
  if (!token || !supplied || await tokenDigest(token) !== await tokenDigest(supplied)) return json({ error: "Unauthorized" }, 401);
  if (Deno.env.get("LEAD_SLACK_ENRICHMENT_ENABLED") !== "true") return json({ enabled: false });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const result = { delivered: 0, waiting: 0, failed: 0 };
  try {
    await db.from("lead_traceability_health").upsert({ job: "enrichment", last_started_at: new Date().toISOString() }, { onConflict: "job" });
    // Each request is bounded below the lease duration; another worker skips leased rows.
    const { data: deliveries, error } = await db.rpc("trace_claim_slack_deliveries", { p_limit: 4 });
    if (error) throw new Error("claim_failed");
    await Promise.all(((deliveries || []) as Delivery[]).map(async delivery => {
      const finish = async (reason: string | null, retryAfter?: number) => {
        const { data: finished, error } = await db.rpc("trace_finish_delivery", { p_id: delivery.id, p_lease: delivery.lease_id, p_revision: delivery.revision, p_error: reason, p_retry_after: retryAfter ?? null });
        if (error || !finished) result.failed++; else if (reason) result.failed++; else result.delivered++;
      };
      const defer = async (reason: string) => {
        const { error } = await db.rpc("trace_defer_delivery", { p_id: delivery.id, p_lease: delivery.lease_id, p_reason: reason });
        if (error) result.failed++; else result.waiting++;
      };
      try {
        if (delivery.destination !== "slack_enrichment") {
          await defer("clickup_adapter_not_configured");
          return;
        }
        const { data: submission, error } = await db.from("lead_submissions").select("*").eq("id", delivery.submission_id).single();
        if (error || !submission) { await finish("submission_unavailable"); return; }
        if (!submission.slack_message_ts || !submission.slack_channel_id || !submission.slack_initial_message) {
          await defer(submission.slack_initial_state === "uncertain" ? "initial_slack_requires_reconciliation" : "initial_slack_reference_missing");
          return;
        }
        const slackToken = Deno.env.get("SLACK_BOT_TOKEN");
        if (!slackToken) { await defer("slack_credential_missing"); return; }
        const { data: lead, error: leadError } = submission.lead_id
          ? await db.from("leads").select("facturas_compra_mes,utm_source,utm_medium,utm_campaign,utm_content,utm_term").eq("id", submission.lead_id).single()
          : { data: null, error: null };
        const { data: meetings, error: meetingError } = await db.from("lead_meetings").select("status,starts_at").eq("submission_id", submission.id).order("starts_at", { ascending: false });
        if (leadError || meetingError) { await finish("evidence_unavailable"); return; }
        const message = slackEnrichmentMessage(submission.slack_initial_message, submission.slack_channel_id, submission.slack_message_ts, delivery.revision, {
          attribution: submission.attribution, legacyUtms: lead, conversionPage: submission.contact_snapshot?.page_path,
          submissionId: submission.id, leadId: submission.lead_id || submission.one_lead_id,
          persisted: submission.status === "persisted", failed: submission.status === "failed",
          clickupTaskId: submission.clickup_task_id, invoiceCount: lead?.facturas_compra_mes, confirmedMeetings: meetings || [],
        });
        const response = await fetch("https://slack.com/api/chat.update", {
          method: "POST", headers: { Authorization: `Bearer ${slackToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(message), signal: AbortSignal.timeout(10000),
        });
        const body = await response.json();
        // HTTP success alone does not confirm Slack accepted the update.
        await finish(response.ok && body.ok ? null : response.status === 429 ? "slack_rate_limited" : "slack_update_rejected", response.status === 429 ? Math.min(3600, Math.max(0, Number(response.headers.get("retry-after")) || 60)) : undefined);
      } catch { await finish("delivery_transport_failed"); }
    }));
    await db.from("lead_traceability_health").upsert({ job: "enrichment", last_started_at: new Date().toISOString(), last_completed_at: new Date().toISOString(), result });
    return json(result);
  } catch {
    console.error("lead_enrichment_worker_failed");
    return json({ error: "Worker temporarily unavailable" }, 503);
  }
}
