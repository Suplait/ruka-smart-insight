
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
    const { leadId, updateData } = await req.json();
    
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
    const updateSuccessful = Object.keys(updateData).every(key => {
      // Handle special case for boolean values where null might be converted to false
      if (typeof updateData[key] === 'boolean' && updateData[key] === true && verifyData[key] === false) {
        return false;
      }
      
      // For all other cases, check if the values match or if the updateData key exists in verifyData
      return verifyData[key] === updateData[key] || !(key in verifyData);
    });

    if (!updateSuccessful) {
      return new Response(
        JSON.stringify({ error: 'Update did not persist correctly' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: verifyData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
