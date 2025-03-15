
import { supabase } from "@/integrations/supabase/client";

/**
 * Send a notification to Slack about an onboarding step completion
 * This function runs independently and won't block the main flow
 */
export async function notifySlackOnboardingStep(leadId: number, step: string, leadData: any) {
  if (!leadId || !step) {
    console.error('Missing required parameters for Slack notification');
    return;
  }

  console.log(`[DEBUG] Starting notifySlackOnboardingStep for lead ${leadId} and step ${step}`);

  // Use Promise to handle the async operation but don't wait for it
  const notificationPromise = new Promise<boolean>(async (resolve) => {
    try {
      // First, get the current lead data including the slack_message_ts
      console.log(`[DEBUG] Fetching lead data for ID: ${leadId}`);
      const { data: leadRecord, error: fetchError } = await supabase
        .from('leads')
        .select('slack_message_ts')
        .eq('id', leadId)
        .single();
      
      if (fetchError) {
        console.error('[DEBUG] Failed to fetch lead data:', fetchError);
        resolve(false);
        return;
      }
      
      // Get the thread_ts from the lead record
      const threadTs = leadRecord?.slack_message_ts;
      console.log(`[DEBUG] Lead ${leadId} slack_message_ts from DB:`, threadTs);
      
      if (!threadTs) {
        console.warn('[DEBUG] No thread_ts found for this lead, cannot send thread reply');
        console.log('[DEBUG] Lead record data:', leadRecord);
        resolve(false);
        return;
      }
      
      // Send the notification as a thread reply
      console.log(`[DEBUG] Invoking notify-slack function with threadTs: ${threadTs}`);
      console.log('[DEBUG] Function payload:', {
        lead: leadData,
        isOnboarding: true,
        leadId: leadId,
        step: step,
        threadTs: threadTs
      });
      
      const response = await supabase.functions.invoke('notify-slack', {
        body: {
          lead: leadData,
          isOnboarding: true,
          leadId: leadId,
          step: step,
          threadTs: threadTs
        }
      });
      
      console.log('[DEBUG] Slack thread notification response:', response);
      
      if (response.error) {
        console.error('[DEBUG] Slack notification error details:', response.error);
        resolve(false);
        return;
      }
      
      resolve(true);
    } catch (error) {
      console.error('[DEBUG] Unexpected error in Slack notification:', error);
      resolve(false);
    }
  });
  
  // Don't await the promise, let it run in the background
  return true;
}
