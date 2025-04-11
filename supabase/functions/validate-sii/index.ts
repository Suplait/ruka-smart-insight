
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the request body to get RUT and password
    const { rut, password } = await req.json()
    
    if (!rut || !password) {
      return new Response(JSON.stringify({
        success: false,
        error: 'RUT y contraseña son requeridos'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      })
    }
    
    // Prepare the request to the SII validation endpoint
    const headers = {
      'Content-Type': 'application/json'
    }
    
    const params = JSON.stringify({
      rut: rut,
      password: password
    })
    
    try {
      // Call the external validation service
      const response = await fetch('https://scraper.ruka.ai/api/validate_sii_credentials', {
        method: 'POST',
        headers: headers,
        body: params
      })
      
      // Get raw response text for debugging
      const responseText = await response.text()
      console.log('Raw response from SII validation:', responseText)
      
      // Try to parse the response
      let validationResult
      try {
        validationResult = JSON.parse(responseText)
      } catch (e) {
        // Check if it's a plain text "success: true" or "success: false"
        if (responseText.includes('success: true')) {
          validationResult = { success: true }
        } else if (responseText.includes('success: false')) {
          validationResult = { success: false }
        } else {
          throw new Error(`Invalid response format: ${responseText}`)
        }
      }
      
      // Return the validation result
      return new Response(JSON.stringify(validationResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    } catch (validationError) {
      console.error('Validation error:', validationError)
      return new Response(JSON.stringify({
        success: false,
        error: `Error en la validación: ${validationError.message}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      })
    }
  } catch (error) {
    console.error('General error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: `Error general: ${error.message}`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})
