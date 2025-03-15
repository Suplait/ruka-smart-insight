
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

  // Use Promise to handle the async operation but don't wait for it
  const notificationPromise = new Promise<boolean>(async (resolve) => {
    try {
      // First, get the current lead data including the slack_message_ts
      const { data: leadRecord, error: fetchError } = await supabase
        .from('leads')
        .select('slack_message_ts')
        .eq('id', leadId)
        .single();
      
      if (fetchError) {
        console.warn('Failed to fetch lead data for Slack notification:', fetchError);
        resolve(false);
        return;
      }
      
      // Get the thread_ts from the lead record
      const threadTs = leadRecord?.slack_message_ts;
      console.log(`Sending Slack notification for step ${step} and lead ${leadId}`);
      console.log('Lead has slack_message_ts:', threadTs);
      
      if (!threadTs) {
        console.warn('No thread_ts found for this lead, cannot send thread reply');
        resolve(false);
        return;
      }
      
      // Send the notification as a thread reply
      const response = await supabase.functions.invoke('notify-slack', {
        body: {
          lead: leadData,
          isOnboarding: true,
          leadId: leadId,
          step: step,
          threadTs: threadTs
        }
      });
      
      console.log('Slack thread notification response:', response);
      
      if (response.error) {
        console.warn('Slack notification failed, but onboarding continues:', response.error);
        resolve(false);
        return;
      }
      
      resolve(true);
    } catch (error) {
      console.warn('Error in Slack notification, but onboarding continues:', error);
      resolve(false);
    }
  });
  
  // Don't await the promise, let it run in the background
  return true;
}
