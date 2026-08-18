import { supabase } from "@/integrations/supabase/client";
import type { WorksLeadData } from "@/content/worksContent";
import type { WorksAttribution } from "@/utils/worksAttribution";

type CreateWorksLeadResponse = { lead_id: string };

export async function createWorksLead(
  lead: WorksLeadData,
  attribution: WorksAttribution,
  landingPath: string,
) {
  const { data, error } = await supabase.functions.invoke<CreateWorksLeadResponse>("create-works-lead", {
    body: {
      name: lead.name.trim(),
      company: lead.company.trim(),
      email: lead.email.trim(),
      whatsapp: lead.whatsapp.trim() || null,
      process_description: lead.processDescription.trim(),
      systems: lead.systems.trim() || null,
      frequency: lead.frequency,
      manual_hours: lead.manualHours,
      landing_path: landingPath,
      ...attribution,
    },
  });

  if (error || !data?.lead_id) throw new Error("No pudimos guardar el proceso. Inténtalo nuevamente.");
  return data.lead_id;
}

export async function notifyWorksLead(leadId: string) {
  const { error } = await supabase.functions.invoke("notify-works-slack", { body: { lead_id: leadId } });
  if (error) throw error;
}
