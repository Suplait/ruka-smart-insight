import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escapeSlack = (value: unknown) =>
  String(value ?? "No informado")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .slice(0, 3000);

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const { lead_id: leadId } = await request.json();
    if (typeof leadId !== "string" || !/^[0-9a-f-]{36}$/i.test(leadId)) {
      return new Response(JSON.stringify({ error: "invalid_lead_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const slackToken = Deno.env.get("SLACK_BOT_TOKEN");
    if (!supabaseUrl || !serviceRoleKey || !slackToken) throw new Error("Missing server configuration");

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data: lead, error } = await supabase.from("works_leads").select("*").eq("id", leadId).single();
    if (error || !lead) throw new Error("Works lead not found");

    const utms = [
      lead.utm_source && `source=${escapeSlack(lead.utm_source)}`,
      lead.utm_medium && `medium=${escapeSlack(lead.utm_medium)}`,
      lead.utm_campaign && `campaign=${escapeSlack(lead.utm_campaign)}`,
      lead.utm_content && `content=${escapeSlack(lead.utm_content)}`,
      lead.utm_term && `term=${escapeSlack(lead.utm_term)}`,
    ].filter(Boolean).join(" · ") || "Sin UTM";

    const message = {
      channel: "ruka-leads",
      text: "Nuevo lead · Ruka Works",
      blocks: [
        { type: "header", text: { type: "plain_text", text: "Nuevo lead · Ruka Works", emoji: true } },
        { type: "section", fields: [
          { type: "mrkdwn", text: `*Nombre*\n${escapeSlack(lead.name)}` },
          { type: "mrkdwn", text: `*Empresa*\n${escapeSlack(lead.company)}` },
          { type: "mrkdwn", text: `*Email*\n${escapeSlack(lead.email)}` },
          { type: "mrkdwn", text: `*WhatsApp*\n${escapeSlack(lead.whatsapp)}` },
        ] },
        { type: "section", text: { type: "mrkdwn", text: `*Proceso*\n${escapeSlack(lead.process_description)}` } },
        { type: "section", fields: [
          { type: "mrkdwn", text: `*Sistemas*\n${escapeSlack(lead.systems)}` },
          { type: "mrkdwn", text: `*Frecuencia*\n${escapeSlack(lead.frequency)}` },
          { type: "mrkdwn", text: `*Horas manuales*\n${escapeSlack(lead.manual_hours)}` },
          { type: "mrkdwn", text: `*Landing*\n${escapeSlack(lead.landing_path)}` },
        ] },
        { type: "context", elements: [{ type: "mrkdwn", text: `*UTMs:* ${utms}` }] },
      ],
    };

    const slackResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { Authorization: `Bearer ${slackToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });
    const slackResult = await slackResponse.json();
    if (!slackResult.ok) throw new Error("Slack rejected the message");

    await supabase.from("works_leads").update({ slack_message_ts: slackResult.ts }).eq("id", leadId);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ success: false }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
