import { supabase } from "@/integrations/supabase/client";
import type { OneLeadData } from "@/content/oneContent";
import type { OneAttribution } from "@/utils/oneAttribution";

type CreateOneLeadResponse = { lead_id: string };

export async function createOneLead(
  lead: OneLeadData,
  attribution: OneAttribution,
  landingPath: string,
  submissionId: string,
) {
  const { data, error } = await supabase.functions.invoke<CreateOneLeadResponse>("create-one-lead", {
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
