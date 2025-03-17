
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

  try {
    const requestData = await req.json();
    const { leadId, updateData } = requestData;
    
    if (!leadId || typeof leadId !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Lead ID is required and must be a number' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!updateData || typeof updateData !== 'object') {
      return new Response(
        JSON.stringify({ error: 'Update data is required and must be an object' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) {
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
    
    while (retries > 0) {
      const result = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', leadId)
        .select();
      
      data = result.data;
      error = result.error;
      
      if (!error) break;
      
      retries--;
      // Wait a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Double-check that the update was successful by retrieving the record again
    const { data: verifyData, error: verifyError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (verifyError) {
      return new Response(
        JSON.stringify({ error: 'Could not verify update' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Verify that the update was successful by checking the values
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

    if (!updateSuccessful) {
      return new Response(
        JSON.stringify({ error: 'Update did not persist correctly', details: failures }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: verifyData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
