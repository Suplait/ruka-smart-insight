import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const nullableText = (value: unknown, max: number) => text(value, max) || null;
const escapeSlack = (value: unknown) =>
  String(value ?? "No informado")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .slice(0, 3000);

type SupabaseClient = ReturnType<typeof createClient>;

async function notifySlack(supabase: SupabaseClient, leadId: string) {
  const { data: claimedLead, error: claimError } = await supabase
    .from("one_leads")
    .update({ slack_notification_status: "sending" })
    .eq("id", leadId)
    .eq("slack_notification_status", "pending")
    .select("id,name,company,email,landing_path,utm_source,utm_medium,utm_campaign,utm_content,utm_term")
    .maybeSingle();

  if (claimError) throw claimError;
  if (!claimedLead) return false;

  try {
    const slackToken = Deno.env.get("SLACK_BOT_TOKEN");
    if (!slackToken) throw new Error("Missing Slack configuration");

    const utms = [
      claimedLead.utm_source && `source=${escapeSlack(claimedLead.utm_source)}`,
      claimedLead.utm_medium && `medium=${escapeSlack(claimedLead.utm_medium)}`,
      claimedLead.utm_campaign && `campaign=${escapeSlack(claimedLead.utm_campaign)}`,
      claimedLead.utm_content && `content=${escapeSlack(claimedLead.utm_content)}`,
      claimedLead.utm_term && `term=${escapeSlack(claimedLead.utm_term)}`,
    ].filter(Boolean).join(" · ") || "Sin UTM";

    const slackResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { Authorization: `Bearer ${slackToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "ruka-leads",
        text: "Nuevo lead · Ruka One",
        blocks: [
          { type: "header", text: { type: "plain_text", text: "Nuevo lead · Ruka One", emoji: true } },
          { type: "section", fields: [
            { type: "mrkdwn", text: `*Nombre*\n${escapeSlack(claimedLead.name)}` },
            { type: "mrkdwn", text: `*Empresa*\n${escapeSlack(claimedLead.company)}` },
            { type: "mrkdwn", text: `*Email*\n${escapeSlack(claimedLead.email)}` },
            { type: "mrkdwn", text: `*Landing*\n${escapeSlack(claimedLead.landing_path)}` },
          ] },
          { type: "context", elements: [{ type: "mrkdwn", text: `*UTMs:* ${utms}` }] },
        ],
      }),
    });
    const slackResult = await slackResponse.json();
    if (!slackResponse.ok || !slackResult.ok) throw new Error("Slack rejected the message");

    const { error: updateError } = await supabase
      .from("one_leads")
      .update({
        slack_notification_status: "sent",
        slack_notified_at: new Date().toISOString(),
        slack_message_ts: slackResult.ts,
      })
      .eq("id", leadId)
      .eq("slack_notification_status", "sending");
    if (updateError) throw updateError;
    return true;
  } catch (error) {
    console.error("One Slack notification failed", error);
    await supabase
      .from("one_leads")
      .update({ slack_notification_status: "failed" })
      .eq("id", leadId)
      .eq("slack_notification_status", "sending");
    return false;
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await request.json();
    const lead = {
      submission_id: text(body.submission_id, 36),
      name: text(body.name, 120),
      company: text(body.company, 160),
      email: text(body.email, 254).toLowerCase(),
      utm_source: nullableText(body.utm_source, 300),
      utm_medium: nullableText(body.utm_medium, 300),
      utm_campaign: nullableText(body.utm_campaign, 300),
      utm_content: nullableText(body.utm_content, 300),
      utm_term: nullableText(body.utm_term, 300),
      landing_path: text(body.landing_path, 200) || "/one",
    };

    if (
      !uuidPattern.test(lead.submission_id) ||
      lead.name.length < 2 ||
      lead.company.length < 2 ||
      !emailPattern.test(lead.email)
    ) {
      return new Response(JSON.stringify({ error: "invalid_payload" }), { status: 400, headers: jsonHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing server configuration");
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const insertion = await supabase.from("one_leads").insert(lead).select("id").single();
    let leadId = insertion.data?.id as string | undefined;
    let created = Boolean(leadId);

    if (insertion.error?.code === "23505") {
      const existing = await supabase
        .from("one_leads")
        .select("id")
        .eq("submission_id", lead.submission_id)
        .single();
      if (existing.error || !existing.data) throw new Error("Could not resolve One lead retry");
      leadId = existing.data.id;
      created = false;
    } else if (insertion.error || !leadId) {
      throw new Error("Could not create One lead");
    }

    const slackNotified = await notifySlack(supabase, leadId);
    return new Response(JSON.stringify({ lead_id: leadId, created, slack_notified: slackNotified }), {
      status: created ? 201 : 200,
      headers: jsonHeaders,
    });
  } catch (error) {
    console.error("One lead creation failed", error);
    return new Response(JSON.stringify({ error: "lead_creation_failed" }), { status: 500, headers: jsonHeaders });
  }
});
