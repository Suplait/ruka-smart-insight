const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };
const SLACK_CHANNEL = "ruka-leads";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type NotificationType = "lead_created" | "calendly_scheduled";

type OneLead = {
  name: string;
  company: string;
  email: string;
  whatsapp: string;
  landing_path: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
};

const text = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const nullableText = (value: unknown, max: number) => text(value, max) || null;

const escapeSlack = (value: unknown) =>
  String(value ?? "No informado")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .slice(0, 3000);

const phoneDigits = (value: string) => value.replace(/\D/g, "");

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: jsonHeaders });

function attributionLabel(lead: OneLead) {
  const source = [lead.utm_source, lead.utm_medium].filter(Boolean).join(" / ");
  const campaign = lead.utm_campaign ? ` · ${lead.utm_campaign}` : "";
  return source ? `${source}${campaign}` : "Tráfico directo o sin UTM";
}

function contactFields(lead: OneLead) {
  const digits = phoneDigits(lead.whatsapp);
  return [
    { type: "mrkdwn", text: `*Contacto*\n${escapeSlack(lead.name)}` },
    { type: "mrkdwn", text: `*Empresa*\n${escapeSlack(lead.company)}` },
    { type: "mrkdwn", text: `*Email*\n<mailto:${escapeSlack(lead.email)}|${escapeSlack(lead.email)}>` },
    { type: "mrkdwn", text: `*WhatsApp*\n<https://wa.me/${digits}|${escapeSlack(lead.whatsapp)}>` },
  ];
}

function leadMessage(lead: OneLead, submissionId: string) {
  const digits = phoneDigits(lead.whatsapp);
  return {
    channel: SLACK_CHANNEL,
    text: `Ruka One · Nuevo contacto de ${lead.company}`,
    ...(uuidPattern.test(submissionId) ? { client_msg_id: submissionId } : {}),
    blocks: [
      { type: "header", text: { type: "plain_text", text: "Ruka One · Nuevo contacto", emoji: true } },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${escapeSlack(lead.company)}* quiere revisar una parte manual de su operación.`,
        },
      },
      { type: "section", fields: contactFields(lead) },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Abrir WhatsApp", emoji: true },
            url: `https://wa.me/${digits}`,
            action_id: "ruka_one_open_whatsapp",
          },
        ],
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Formulario enviado desde ${escapeSlack(lead.landing_path)} · ${escapeSlack(attributionLabel(lead))} · Calendly pendiente`,
          },
        ],
      },
    ],
  };
}

function scheduledMessage(lead: OneLead, threadTs: string) {
  return {
    channel: SLACK_CHANNEL,
    text: `Ruka One · Reunión agendada con ${lead.company}`,
    ...(threadTs ? { thread_ts: threadTs } : {}),
    blocks: [
      {
        type: "section",
        text: { type: "mrkdwn", text: ":white_check_mark: *Reunión agendada · Ruka One*" },
      },
      { type: "section", fields: contactFields(lead) },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: "Calendly confirmó la reserva." }],
      },
    ],
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ success: false, error: "method_not_allowed" }, 405);

  try {
    const body = await request.json();
    const notificationType = text(body.notification_type, 40) as NotificationType;
    const submissionId = text(body.submission_id, 36);
    const threadTs = text(body.thread_ts, 40);
    const rawLead = body.lead ?? {};
    const lead: OneLead = {
      name: text(rawLead.name, 120),
      company: text(rawLead.company, 160),
      email: text(rawLead.email, 254).toLowerCase(),
      whatsapp: text(rawLead.whatsapp, 32),
      landing_path: text(rawLead.landing_path, 200) || "/one/contacto",
      utm_source: nullableText(rawLead.utm_source, 300),
      utm_medium: nullableText(rawLead.utm_medium, 300),
      utm_campaign: nullableText(rawLead.utm_campaign, 300),
      utm_content: nullableText(rawLead.utm_content, 300),
      utm_term: nullableText(rawLead.utm_term, 300),
    };

    if (
      (notificationType !== "lead_created" && notificationType !== "calendly_scheduled") ||
      lead.name.length < 2 ||
      lead.company.length < 2 ||
      !emailPattern.test(lead.email) ||
      phoneDigits(lead.whatsapp).length < 8 ||
      phoneDigits(lead.whatsapp).length > 15
    ) {
      return json({ success: false, error: "invalid_payload" }, 400);
    }

    const slackToken = Deno.env.get("SLACK_BOT_TOKEN");
    if (!slackToken) throw new Error("Missing Slack configuration");

    const slackResponse = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${slackToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        notificationType === "lead_created"
          ? leadMessage(lead, submissionId)
          : scheduledMessage(lead, threadTs),
      ),
    });
    const slackResult = await slackResponse.json();

    if (!slackResponse.ok || !slackResult.ok) {
      console.error("Ruka One Slack notification rejected", slackResult);
      return json({ success: false, error: "slack_rejected" }, 502);
    }

    return json({ success: true, ts: slackResult.ts });
  } catch (error) {
    console.error("Ruka One Slack notification failed", error);
    return json({ success: false, error: "notification_failed" }, 500);
  }
});
