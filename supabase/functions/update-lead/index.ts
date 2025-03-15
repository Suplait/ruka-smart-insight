
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.43.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('[DEBUG] update-lead function called');

  try {
    const requestData = await req.json();
    console.log('[DEBUG] Request data received:', JSON.stringify(requestData));

    const { leadId, updateData } = requestData;
    
    if (!leadId || typeof leadId !== 'number') {
      console.error('[DEBUG] Invalid leadId:', leadId);
      return new Response(
        JSON.stringify({ error: 'Lead ID is required and must be a number' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!updateData || typeof updateData !== 'object') {
      console.error('[DEBUG] Invalid updateData:', updateData);
      return new Response(
        JSON.stringify({ error: 'Update data is required and must be an object' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    console.log('[DEBUG] Supabase URL exists:', !!supabaseUrl);
    console.log('[DEBUG] Supabase Key exists:', !!supabaseKey);
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('[DEBUG] Missing Supabase credentials');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Execute update with retries
    let retries = 3;
    let data;
    let error;
    
    console.log('[DEBUG] Attempting update for lead ID:', leadId);
    console.log('[DEBUG] Update data:', JSON.stringify(updateData));
    
    while (retries > 0) {
      console.log(`[DEBUG] Update attempt, retries left: ${retries}`);
      const result = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', leadId)
        .select();
      
      data = result.data;
      error = result.error;
      
      console.log('[DEBUG] Update result:', result);
      console.log('[DEBUG] Update data result:', data);
      console.log('[DEBUG] Update error:', error);
      
      if (!error) break;
      
      retries--;
      // Wait a short time before retrying
      console.log(`[DEBUG] Retry in 500ms`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (error) {
      console.error('[DEBUG] All update attempts failed:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Double-check that the update was successful by retrieving the record again
    console.log('[DEBUG] Verifying update by fetching lead data again');
    const { data: verifyData, error: verifyError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    console.log('[DEBUG] Verification data:', verifyData);
    console.log('[DEBUG] Verification error:', verifyError);

    if (verifyError) {
      console.error('[DEBUG] Could not verify update');
      return new Response(
        JSON.stringify({ error: 'Could not verify update' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Verify that the update was successful by checking the values
    console.log('[DEBUG] Verifying all fields were updated correctly');
    let updateSuccessful = true;
    const failures = [];
    
    Object.keys(updateData).forEach(key => {
      // Handle special case for boolean values where null might be converted to false
      if (typeof updateData[key] === 'boolean' && updateData[key] === true && verifyData[key] === false) {
        updateSuccessful = false;
        failures.push({key, expected: updateData[key], actual: verifyData[key]});
        return;
      }
      
      // For all other cases, check if the values match or if the updateData key exists in verifyData
      if (!(key in verifyData) || verifyData[key] !== updateData[key]) {
        updateSuccessful = false;
        failures.push({key, expected: updateData[key], actual: verifyData[key]});
      }
    });

    console.log('[DEBUG] Update verification successful:', updateSuccessful);
    if (!updateSuccessful) {
      console.error('[DEBUG] Update verification failures:', failures);
    }

    if (!updateSuccessful) {
      return new Response(
        JSON.stringify({ error: 'Update did not persist correctly', details: failures }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    console.log('[DEBUG] Update completed successfully for lead ID:', leadId);
    return new Response(
      JSON.stringify({ success: true, data: verifyData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[DEBUG] Unexpected error in update-lead function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
