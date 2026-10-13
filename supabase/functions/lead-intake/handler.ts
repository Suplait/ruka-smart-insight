import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { continuation, LeadRequestError, projectAttribution, record, tokenDigest, validateLead, type Funnel, type LeadInput } from "../_shared/leadValidation.ts";
import { initialLeadMessage } from "../_shared/initialLeadMessage.ts";

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" } });
const safeLeadColumns = "id,first_name,last_name,name,company_name,email,ccity,whatsapp,facturas_compra_mes,requires_calendly";

export async function handleLeadIntake(request: Request) {
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (Deno.env.get("LEAD_INTAKE_ENABLED") !== "true") return json({ error: "Lead intake is not enabled" }, 503);
  try {
    if (Number(request.headers.get("content-length")) > 65536) return json({ error: "Payload too large" }, 413);
    const raw = await request.text();
    if (raw.length > 65536) return json({ error: "Payload too large" }, 413);
    let input: Record<string, unknown>;
    try { input = record(JSON.parse(raw)); } catch { return json({ error: "Invalid request" }, 400); }
    const { submissionId, token } = continuation(input);
    const digest = await tokenDigest(token);
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const action = input.action;

    if (action === "prepare" || action === "submit") {
      const funnel: Funnel = input.funnel === "one" ? "one" : input.funnel === "classic" ? "classic" : (() => { throw new LeadRequestError("Invalid funnel"); })();
      const lead = validateLead(input.lead, funnel);
      const attribution = projectAttribution(input.attribution);
      const { data: submission, error: prepareError } = await db.rpc("trace_prepare_submission", {
        p_id: submissionId, p_token_hash: digest, p_funnel: funnel, p_attribution: attribution,
        p_contact: { name: lead.name, company_name: lead.company_name || lead.company, email: lead.email, whatsapp: lead.whatsapp, ccity: lead.ccity, page_path: lead.page_path || lead.landing_path },
      });
      if (prepareError) return json({ error: "Submission could not be authorized" }, prepareError.code === "28000" ? 401 : 503);

      if (action === "submit") {
        const { data: id, error } = await db.rpc("trace_submit_lead", { p_id: submissionId, p_token_hash: digest, p_lead: lead });
        if (error) return json({ error: "Lead could not be saved" }, error.code === "28000" ? 401 : 503);
        return json({ success: true, stored: true, id, submission_id: submissionId });
      }

      if (funnel === "one" && !submission.one_lead_id) {
        const { data: id, error } = await db.rpc("trace_submit_lead", { p_id: submissionId, p_token_hash: digest, p_lead: lead });
        if (error) return json({ error: "Lead could not be saved" }, 503);
        submission.one_lead_id = id;
        submission.status = "persisted";
      }

      if (submission.slack_message_ts) return json({ success: true, ts: submission.slack_message_ts });
      const slackToken = Deno.env.get("SLACK_BOT_TOKEN");
      // Slack availability never determines whether the subsequent submit can persist.
      if (!slackToken) return json({ success: false, prepared: true });
      const { data: claimed, error: claimError } = await db.rpc("trace_claim_initial_slack", { p_id: submissionId });
      if (claimError || !claimed) return json({ success: false, prepared: true, pending: true });
      const message = initialLeadMessage(lead as LeadInput, funnel, {
        attribution: submission.attribution, legacyUtms: lead, submissionId,
        leadId: submission.lead_id || submission.one_lead_id,
        persisted: submission.status === "persisted", conversionPage: lead.page_path || lead.landing_path || undefined,
      });
      const { error: snapshotError } = await db.from("lead_submissions").update({ slack_initial_message: { text: message.text, blocks: message.blocks } }).eq("id", submissionId);
      if (snapshotError) {
        await db.from("lead_submissions").update({ slack_initial_state: "failed" }).eq("id", submissionId);
        return json({ success: false, prepared: true });
      }
      try {
        const response = await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST", headers: { Authorization: `Bearer ${slackToken}`, "Content-Type": "application/json" },
          body: JSON.stringify(message), signal: AbortSignal.timeout(15000),
        });
        // An ambiguous transport result is never retried as a new message. A
        // reconciliation worker must first locate the submission in Slack metadata.
        const result = await response.json();
        if (!result.ok) {
          await db.from("lead_submissions").update({ slack_initial_state: response.ok ? "failed" : "uncertain" }).eq("id", submissionId);
          return json({ success: false, prepared: true });
        }
        const { error: referenceError } = await db.rpc("trace_confirm_initial_slack", { p_id: submissionId, p_channel: result.channel, p_ts: result.ts });
        if (referenceError) {
          await db.from("lead_submissions").update({ slack_initial_state: "uncertain" }).eq("id", submissionId);
          return json({ success: false, prepared: true });
        }
        return json({ success: true, ts: result.ts });
      } catch {
        await db.from("lead_submissions").update({ slack_initial_state: "uncertain" }).eq("id", submissionId);
        return json({ success: false, prepared: true });
      }
    }

    const { data: submission, error: authError } = await db.rpc("trace_authorize_submission", { p_id: submissionId, p_token_hash: digest });
    if (authError || !submission) return json({ error: "Invalid continuation token" }, 401);
    if (action === "get") {
      if (!submission.lead_id) return json({ error: "Lead not available" }, 404);
      const { data, error } = await db.from("leads").select(safeLeadColumns).eq("id", submission.lead_id).single();
      return error ? json({ error: "Lead not available" }, 503) : json({ success: true, lead: data });
    }
    if (action === "update") {
      if (!submission.lead_id) return json({ error: "Lead not available" }, 404);
      const changes = record(input.update);
      if (Object.keys(changes).some(key => !["facturas_compra_mes", "requires_calendly"].includes(key))) throw new LeadRequestError("Unsupported lead update");
      if (![75, 225, 450, 750].includes(Number(changes.facturas_compra_mes)) || typeof changes.requires_calendly !== "boolean") throw new LeadRequestError("Invalid qualification");
      if (changes.requires_calendly !== (Number(changes.facturas_compra_mes) >= 150)) throw new LeadRequestError("Inconsistent qualification");
      const { error } = await db.rpc("trace_qualify_lead", { p_id: submissionId, p_token_hash: digest, p_invoice_count: Number(changes.facturas_compra_mes) });
      if (error) return json({ error: "Lead could not be updated" }, 503);
      return json({ success: true });
    }
    if (action === "observe_calendar") {
      const eventUri = typeof input.event_uri === "string" ? input.event_uri : "";
      const inviteeUri = typeof input.invitee_uri === "string" ? input.invitee_uri : null;
      if (!/^https:\/\/api.calendly.com\/scheduled_events\/[a-zA-Z0-9-]+$/.test(eventUri)) throw new LeadRequestError("Invalid calendar reference");
      const { error } = await db.rpc("trace_observe_calendar", { p_id: submissionId, p_token_hash: digest, p_event_uri: eventUri, p_invitee_uri: inviteeUri });
      return error ? json({ error: "Observation could not be saved" }, 503) : json({ success: true });
    }
    if (action === "persistence_failed") {
      const { error } = await db.rpc("trace_mark_persistence_failed", { p_id: submissionId, p_token_hash: digest });
      return error ? json({ error: "Failure could not be recorded" }, 503) : json({ success: true });
    }
    return json({ error: "Unknown action" }, 400);
  } catch (error) {
    if (error instanceof LeadRequestError) return json({ error: error.message }, error.status);
    // No contacts, raw requests, tokens, or provider responses enter logs.
    console.error("lead_intake_request_failed");
    return json({ error: "Lead service temporarily unavailable" }, 503);
  }
}
