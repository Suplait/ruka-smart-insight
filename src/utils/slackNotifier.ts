
import { supabase } from "@/integrations/supabase/client";

/**
 * Send a notification to Slack about an onboarding step completion
 * This function runs independently and won't block the main flow
 */
export async function notifySlackOnboardingStep(leadId: number, step: string, leadData: any) {
  if (!leadId || !step) {
    console.error('[DEBUG] Missing required parameters for Slack notification');
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
        
        // Attempt to check if leadRecord exists but just doesn't have the slack_message_ts
        if (leadRecord) {
          console.log('[DEBUG] Lead record exists but slack_message_ts is missing or null');
          
          // Attempt to send an initial notification since we don't have a thread to reply to
          console.log('[DEBUG] Attempting to send an initial notification instead');
          try {
            const initialResponse = await supabase.functions.invoke('notify-slack', {
              body: {
                lead: leadData,
                isOnboarding: false
              }
            });
            
            console.log('[DEBUG] Initial notification response:', initialResponse);
            
            if (initialResponse.data?.ts) {
              console.log('[DEBUG] Received new ts, storing it:', initialResponse.data.ts);
              
              // Store the new thread ts
              const { error: updateError } = await supabase
                .from('leads')
                .update({ slack_message_ts: initialResponse.data.ts })
                .eq('id', leadId);
                
              if (updateError) {
                console.error('[DEBUG] Failed to store new Slack thread ts:', updateError);
              } else {
                console.log('[DEBUG] Successfully stored new Slack thread ts');
                
                // Verification step
                const { data: verifyData, error: verifyError } = await supabase
                  .from('leads')
                  .select('slack_message_ts')
                  .eq('id', leadId)
                  .single();
                  
                if (verifyError) {
                  console.error('[DEBUG] Error verifying Slack message ts storage:', verifyError);
                } else {
                  console.log('[DEBUG] Verification result, stored ts:', verifyData?.slack_message_ts);
                  
                  if (verifyData?.slack_message_ts !== initialResponse.data.ts) {
                    console.error('[DEBUG] Verification failed: ts was not stored correctly', {
                      expected: initialResponse.data.ts,
                      actual: verifyData?.slack_message_ts
                    });
                  }
                }
              }
            }
          } catch (initialError) {
            console.error('[DEBUG] Error sending initial notification:', initialError);
          }
        }
        
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
