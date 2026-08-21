import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };
const SLACK_CHANNEL = "ruka-leads";
const RUKA_LOGO_URL = "https://www.ruka.ai/logo.png";
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

type StoredLead = {
  id: number;
  slack_thread_ts: string | null;
  slack_notified_at: string | null;
  calendly_slack_notified_at: string | null;
};

const storedLeadColumns =
  "id, slack_thread_ts, slack_notified_at, calendly_slack_notified_at";

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

function leadRecord(lead: OneLead, submissionId: string) {
  return {
    submission_id: submissionId,
    name: lead.name,
    company: lead.company,
    email: lead.email,
    whatsapp: lead.whatsapp,
    landing_path: lead.landing_path,
    utm_source: lead.utm_source,
    utm_medium: lead.utm_medium,
    utm_campaign: lead.utm_campaign,
    utm_content: lead.utm_content,
    utm_term: lead.utm_term,
    updated_at: new Date().toISOString(),
  };
}

function contactFields(lead: OneLead) {
  const digits = phoneDigits(lead.whatsapp);
  return [
    { type: "mrkdwn", text: `:bust_in_silhouette: *Contacto*\n${escapeSlack(lead.name)}` },
    { type: "mrkdwn", text: `:office: *Empresa*\n${escapeSlack(lead.company)}` },
    {
      type: "mrkdwn",
      text: `:email: *Email*\n<mailto:${escapeSlack(lead.email)}|${escapeSlack(lead.email)}>`,
    },
    {
      type: "mrkdwn",
      text: `:speech_balloon: *WhatsApp*\n<https://wa.me/${digits}|${escapeSlack(lead.whatsapp)}>`,
    },
  ];
}

function leadMessage(lead: OneLead, submissionId: string) {
  const digits = phoneDigits(lead.whatsapp);
  return {
    channel: SLACK_CHANNEL,
    text: `Ruka One · Nuevo proceso para evaluar · ${lead.company}`,
    client_msg_id: submissionId,
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: ":large_blue_circle: Ruka One · Nuevo proceso para evaluar", emoji: true },
      },
      { type: "divider" },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${escapeSlack(lead.company)}* quiere revisar qué parte de su operación todavía depende de trabajo manual.`,
        },
        accessory: {
          type: "image",
          image_url: RUKA_LOGO_URL,
          alt_text: "Ruka.ai",
        },
      },
      { type: "section", fields: contactFields(lead) },
      {
        type: "section",
        fields: [
          { type: "mrkdwn", text: ":hourglass_flowing_sand: *Estado*\nHorario pendiente" },
          { type: "mrkdwn", text: `:link: *Origen*\n${escapeSlack(lead.landing_path)}` },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "Contactar por WhatsApp", emoji: true },
            style: "primary",
            url: `https://wa.me/${digits}`,
            action_id: "ruka_one_open_whatsapp",
          },
        ],
      },
      { type: "divider" },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `:dart: *Atribución:* ${escapeSlack(attributionLabel(lead))}  ·  *ID:* \`${submissionId.slice(0, 8)}\``,
          },
        ],
      },
    ],
  };
}

function scheduledMessage(lead: OneLead, threadTs: string) {
  return {
    channel: SLACK_CHANNEL,
    text: `Ruka One · Reunión agendada · ${lead.company}`,
    ...(threadTs ? { thread_ts: threadTs } : {}),
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: ":white_check_mark: Ruka One · Reunión agendada", emoji: true },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${escapeSlack(lead.company)}* ya eligió una hora. El lead quedó listo para preparar la conversación.`,
        },
      },
      { type: "section", fields: contactFields(lead) },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: ":calendar: Calendly confirmó la reserva." }],
      },
    ],
  };
}

function adminClient() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing Supabase configuration");

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function storeSubmittedLead(
  supabase: ReturnType<typeof createClient>,
  lead: OneLead,
  submissionId: string,
) {
  const { data, error } = await supabase
    .from("leads_one")
    .insert({ ...leadRecord(lead, submissionId), status: "submitted" })
    .select(storedLeadColumns)
    .single<StoredLead>();

  if (!error) return data;
  if (error.code !== "23505") throw error;

  const { data: existing, error: selectError } = await supabase
    .from("leads_one")
    .select(storedLeadColumns)
    .eq("submission_id", submissionId)
    .single<StoredLead>();

  if (selectError) throw selectError;
  return existing;
}

async function storeScheduledLead(
  supabase: ReturnType<typeof createClient>,
  lead: OneLead,
  submissionId: string,
  eventUri: string | null,
) {
  const scheduledAt = new Date().toISOString();
  const { data, error } = await supabase
    .from("leads_one")
    .upsert(
      {
        ...leadRecord(lead, submissionId),
        status: "calendly_scheduled",
        calendly_event_uri: eventUri,
        calendly_scheduled_at: scheduledAt,
      },
      { onConflict: "submission_id" },
    )
    .select(storedLeadColumns)
    .single<StoredLead>();

  if (error) throw error;
  return data;
}

async function updateStoredLead(
  supabase: ReturnType<typeof createClient>,
  submissionId: string,
  values: Record<string, unknown>,
) {
  const { error } = await supabase
    .from("leads_one")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("submission_id", submissionId);
  if (error) throw error;
}

async function postSlack(token: string, message: Record<string, unknown>) {
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(`Slack rejected message: ${result.error ?? response.status}`);
  return result as { ts: string };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ success: false, error: "method_not_allowed" }, 405);

  try {
    const body = await request.json();
    const notificationType = text(body.notification_type, 40) as NotificationType;
    const submissionId = text(body.submission_id, 36);
    const threadTs = text(body.thread_ts, 40);
    const eventUri = nullableText(body.calendly_event_uri, 1000);
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
      !uuidPattern.test(submissionId) ||
      lead.name.length < 2 ||
      lead.company.length < 2 ||
      !emailPattern.test(lead.email) ||
      phoneDigits(lead.whatsapp).length < 8 ||
      phoneDigits(lead.whatsapp).length > 15
    ) {
      return json({ success: false, error: "invalid_payload" }, 400);
    }

    const supabase = adminClient();
    const slackToken = Deno.env.get("SLACK_BOT_TOKEN");
    if (!slackToken) throw new Error("Missing Slack configuration");

    if (notificationType === "lead_created") {
      const storedLead = await storeSubmittedLead(supabase, lead, submissionId);
      if (storedLead.slack_thread_ts && storedLead.slack_notified_at) {
        return json({ success: true, stored: true, deduplicated: true, ts: storedLead.slack_thread_ts });
      }

      const slackResult = await postSlack(slackToken, leadMessage(lead, submissionId));
      await updateStoredLead(supabase, submissionId, {
        slack_thread_ts: slackResult.ts,
        slack_notified_at: new Date().toISOString(),
      });
      return json({ success: true, stored: true, ts: slackResult.ts });
    }

    const storedLead = await storeScheduledLead(supabase, lead, submissionId, eventUri);
    if (storedLead.calendly_slack_notified_at) {
      return json({ success: true, stored: true, deduplicated: true, ts: storedLead.slack_thread_ts });
    }

    const parentThreadTs = threadTs || storedLead.slack_thread_ts || "";
    const slackResult = await postSlack(slackToken, scheduledMessage(lead, parentThreadTs));
    await updateStoredLead(supabase, submissionId, {
      calendly_slack_notified_at: new Date().toISOString(),
      ...(storedLead.slack_thread_ts ? {} : { slack_thread_ts: slackResult.ts }),
    });
    return json({ success: true, stored: true, ts: slackResult.ts });
  } catch (error) {
    console.error("Ruka One lead flow failed", error);
    return json({ success: false, error: "lead_flow_failed" }, 500);
  }
});
