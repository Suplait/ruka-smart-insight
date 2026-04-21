import { supabase } from "@/integrations/supabase/client";

type SlackLeadData = Record<string, unknown>;

/**
 * Runs in the background so lead progression never blocks on Slack.
 */
export function notifySlackOnboardingStep(leadId: number, step: string, leadData: SlackLeadData) {
  if (!leadId || !step) {
    return false;
  }

  void (async () => {
    try {
      const {
        data: leadRecord,
        error: fetchError
      } = await supabase.from("leads").select("slack_message_ts").eq("id", leadId).single();

      if (fetchError) {
        return;
      }

      const threadTs = leadRecord?.slack_message_ts;

      if (!threadTs) {
        const initialResponse = await supabase.functions.invoke("notify-slack", {
          body: {
            lead: leadData,
            isOnboarding: false
          }
        });

        if (initialResponse.error || !initialResponse.data?.ts) {
          return;
        }

        await supabase.functions.invoke("update-lead", {
          body: {
            leadId,
            updateData: {
              slack_message_ts: initialResponse.data.ts
            }
          }
        });

        return;
      }

      await supabase.functions.invoke("notify-slack", {
        body: {
          lead: leadData,
          isOnboarding: true,
          leadId,
          step,
          threadTs
        }
      });
    } catch {
      // Slack notifications are best-effort only.
    }
  })();

  return true;
}
