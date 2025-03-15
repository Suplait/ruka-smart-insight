
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

  try {
    // Send the notification in a non-blocking way
    setTimeout(async () => {
      try {
        // First, get the current lead data including the slack_message_ts
        const { data: leadRecord, error: fetchError } = await supabase
          .from('leads')
          .select('slack_message_ts')
          .eq('id', leadId)
          .single();
        
        if (fetchError || !leadRecord) {
          console.warn('Failed to fetch lead data for Slack notification:', fetchError);
          return;
        }
        
        console.log(`Sending Slack notification for step ${step} and lead ${leadId}`);
        console.log('Lead has slack_message_ts:', leadRecord.slack_message_ts);
        
        const response = await supabase.functions.invoke('notify-slack', {
          body: {
            lead: leadData,
            isOnboarding: true,
            leadId: leadId,
            step: step,
            threadTs: leadRecord.slack_message_ts // Pass the existing thread ts
          }
        });
        
        console.log('Slack thread notification response:', response);
      } catch (error) {
        console.warn('Failed to send Slack thread notification, but onboarding continues:', error);
        // This is intentionally isolated so errors here don't affect the main flow
      }
    }, 100); // Small timeout to ensure it runs async
    
    return true;
  } catch (error) {
    console.warn('Error setting up Slack notification, but onboarding continues:', error);
    return false;
  }
}
