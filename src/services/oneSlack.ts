import { supabase } from "@/integrations/supabase/client";
import type { OneLeadData } from "@/content/oneContent";
import type { OneAttribution } from "@/utils/oneAttribution";

type OneSlackResponse = {
  success?: boolean;
  stored?: boolean;
  ts?: string;
};

type OneSlackNotification = {
  lead: OneLeadData;
  attribution: OneAttribution;
  landingPath: string;
  submissionId: string;
  notificationType: "lead_created" | "calendly_scheduled";
  threadTs?: string | null;
  calendlyEventUri?: string;
};

const chileWhatsapp = (value: string) => `+56${value.replace(/^\+?56/, "").replace(/\D/g, "").slice(0, 9)}`;

async function sendOneSlackNotification({
  lead,
  attribution,
  landingPath,
  submissionId,
  notificationType,
  threadTs,
  calendlyEventUri,
}: OneSlackNotification) {
  const { data, error } = await supabase.functions.invoke<OneSlackResponse>("notify-one-slack", {
    body: {
      notification_type: notificationType,
      submission_id: submissionId,
      thread_ts: threadTs || undefined,
      calendly_event_uri: calendlyEventUri || undefined,
      lead: {
        name: lead.name.trim(),
        company: lead.company.trim(),
        email: lead.email.trim(),
        whatsapp: chileWhatsapp(lead.whatsapp),
        landing_path: landingPath,
        ...attribution,
      },
    },
  });

  if (error || !data?.success) return null;
  return data;
}

export async function notifyOneLead(
  lead: OneLeadData,
  attribution: OneAttribution,
  landingPath: string,
  submissionId: string,
) {
  const result = await sendOneSlackNotification({
    lead,
    attribution,
    landingPath,
    submissionId,
    notificationType: "lead_created",
  });

  return result?.ts ?? null;
}

export async function notifyOneCalendlyScheduled(
  lead: OneLeadData,
  attribution: OneAttribution,
  landingPath: string,
  submissionId: string,
  threadTs: string | null,
  calendlyEventUri?: string,
) {
  await sendOneSlackNotification({
    lead,
    attribution,
    landingPath,
    submissionId,
    notificationType: "calendly_scheduled",
    threadTs,
    calendlyEventUri,
  });
}
