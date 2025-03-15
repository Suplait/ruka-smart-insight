
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
        console.log(`Sending Slack notification for step ${step} and lead ${leadId}`);
        const response = await supabase.functions.invoke('notify-slack', {
          body: {
            lead: leadData,
            isOnboarding: true,
            leadId: leadId,
            step: step
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
