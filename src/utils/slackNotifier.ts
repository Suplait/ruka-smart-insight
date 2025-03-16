
import { supabase } from "@/integrations/supabase/client";

/**
 * Send a notification to Slack about an onboarding step completion
 * This function runs independently and won't block the main flow
 */
export async function notifySlackOnboardingStep(leadId: number, step: string, leadData: any) {
  if (!leadId || !step) {
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
        resolve(false);
        return;
      }
      
      // Get the thread_ts from the lead record
      const threadTs = leadRecord?.slack_message_ts;
      
      if (!threadTs) {
        // Attempt to check if leadRecord exists but just doesn't have the slack_message_ts
        if (leadRecord) {
          // Attempt to send an initial notification since we don't have a thread to reply to
          try {
            const initialResponse = await supabase.functions.invoke('notify-slack', {
              body: {
                lead: leadData,
                isOnboarding: false
              }
            });
            
            if (initialResponse.data?.ts) {
              // Use edge function to store the new thread ts
              const updateResponse = await supabase.functions.invoke('update-lead', {
                body: {
                  leadId: leadId,
                  updateData: { slack_message_ts: initialResponse.data.ts }
                }
              });
              
              if (updateResponse.error) {
                // Error handling
              }
            }
          } catch (initialError) {
            // Error handling
          }
        }
        
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
      
      if (response.error) {
        resolve(false);
        return;
      }
      
      resolve(true);
    } catch (error) {
      resolve(false);
    }
  });
  
  // Don't await the promise, let it run in the background
  return true;
}
