
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
        .select('slack_message_ts, company_name')
        .eq('id', leadId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching lead data:', fetchError);
        resolve(false);
        return;
      }
      
      // Get the thread_ts from the lead record
      const threadTs = leadRecord?.slack_message_ts;
      
      // Determine industry type based on company name or other indicators
      const industryType = determineIndustryType(leadRecord?.company_name || leadData.company_name);
      
      if (!threadTs) {
        // No thread exists yet, attempt to create a new one
        if (leadRecord) {
          try {
            const initialResponse = await supabase.functions.invoke('notify-slack', {
              body: {
                lead: {
                  ...leadData,
                  company_name: leadRecord.company_name
                },
                isOnboarding: false,
                industryType
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
                console.error('Error updating lead with slack timestamp:', updateResponse.error);
              }
            }
          } catch (initialError) {
            console.error('Error sending initial slack notification:', initialError);
          }
        }
        
        resolve(false);
        return;
      }
      
      // Send the notification as a thread reply
      try {
        const response = await supabase.functions.invoke('notify-slack', {
          body: {
            lead: leadData,
            isOnboarding: true,
            leadId: leadId,
            step: step,
            threadTs: threadTs,
            industryType
          }
        });
        
        if (response.error) {
          console.error('Error replying to thread:', response.error);
          resolve(false);
          return;
        }
        
        resolve(true);
      } catch (error) {
        console.error('Exception in slack notification process:', error);
        resolve(false);
      }
    } catch (error) {
      console.error('Exception in slack notification process:', error);
      resolve(false);
    }
  });
  
  // Don't await the promise, let it run in the background
  return true;
}

/**
 * Determine industry type based on company name
 */
function determineIndustryType(companyName: string | undefined): 'hotel' | 'restaurant' {
  if (!companyName) return 'restaurant';
  
  const lowerCaseName = companyName.toLowerCase();
  
  // Check for hotel-related keywords in the company name
  if (
    lowerCaseName.includes('hotel') || 
    lowerCaseName.includes('hostal') || 
    lowerCaseName.includes('hospedaje') || 
    lowerCaseName.includes('posada') ||
    lowerCaseName.includes('alojamiento') ||
    lowerCaseName.includes('hostería') ||
    lowerCaseName.includes('lodge')
  ) {
    return 'hotel';
  }
  
  // Default to restaurant if no hotel keywords found
  return 'restaurant';
}
