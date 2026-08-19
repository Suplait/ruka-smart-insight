import { supabase } from "@/integrations/supabase/client";
import type { WorksLeadData } from "@/content/worksContent";
import type { WorksAttribution } from "@/utils/worksAttribution";

type CreateWorksLeadResponse = { lead_id: string };

export async function createWorksLead(
  lead: WorksLeadData,
  attribution: WorksAttribution,
  landingPath: string,
  submissionId: string,
) {
  const { data, error } = await supabase.functions.invoke<CreateWorksLeadResponse>("create-works-lead", {
    body: {
      name: lead.name.trim(),
      company: lead.company.trim(),
      email: lead.email.trim(),
      submission_id: submissionId,
      landing_path: landingPath,
      ...attribution,
    },
  });

  if (error || !data?.lead_id) throw new Error("No pudimos guardar el proceso. Inténtalo nuevamente.");
  return data.lead_id;
}
