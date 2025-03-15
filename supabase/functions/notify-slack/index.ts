
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SLACK_CHANNEL = 'ruka-leads'

interface Lead {
  company_name: string
  name: string
  email: string
  ccity: string
  whatsapp?: string
  meses_datos?: number
  sistema_facturacion?: string
  sistema_custom?: string
  subdominio?: string
  rut?: string
  clave_sii?: string
  sii_connected?: boolean
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  console.log('[DEBUG] notify-slack function called');

  try {
    const SLACK_BOT_TOKEN = Deno.env.get('SLACK_BOT_TOKEN')
    if (!SLACK_BOT_TOKEN) {
      console.error('[DEBUG] SLACK_BOT_TOKEN not found in environment variables');
      throw new Error('SLACK_BOT_TOKEN no encontrado')
    }

    console.log('[DEBUG] SLACK_BOT_TOKEN exists:', !!SLACK_BOT_TOKEN);
    
    // Log first few characters of token for debugging (don't log the full token for security)
    if (SLACK_BOT_TOKEN) {
      console.log('[DEBUG] SLACK_BOT_TOKEN starts with:', SLACK_BOT_TOKEN.substring(0, 5) + '...');
    }
    
    const requestBody = await req.json();
    console.log('[DEBUG] Request body received:', JSON.stringify(requestBody));

    const { lead, isOnboarding, leadId, step, threadTs } = requestBody as { 
      lead: Lead, 
      isOnboarding?: boolean,
      leadId?: number,
      step?: string,
      threadTs?: string 
    }
    
    console.log('[DEBUG] Parsed request data:');
    console.log('[DEBUG] Lead data:', JSON.stringify(lead, null, 2));
    console.log('[DEBUG] Is onboarding notification?', isOnboarding);
    console.log('[DEBUG] Lead ID:', leadId);
    console.log('[DEBUG] Step:', step);
    console.log('[DEBUG] Thread TS:', threadTs);

    // If this is an onboarding update for an existing thread
    if (isOnboarding && leadId && step && threadTs) {
      console.log('[DEBUG] Processing onboarding update for thread');
      try {
        // Send reply to thread using the provided threadTs
        let replyText;
        switch(step) {
          case "data-months-selected":
            replyText = `1️⃣ *Actualización de Onboarding:* El restaurante quiere importar *${lead.meses_datos || 0}* meses de datos`;
            break;
          case "billing-system-selected":
            if (lead.sistema_facturacion === 'mercado' && lead.sistema_custom) {
              replyText = `2️⃣ *Actualización de Onboarding:* El restaurante ha seleccionado sistema de facturación *${lead.sistema_facturacion} (${lead.sistema_custom})*`;
            } else {
              replyText = `2️⃣ *Actualización de Onboarding:* El restaurante ha seleccionado sistema de facturación *${lead.sistema_facturacion || lead.sistema_custom || "No especificado"}*`;
            }
            break;
          case "subdomain-selected":
            replyText = `3️⃣ *Actualización de Onboarding:* El restaurante ha seleccionado su subdominio: *${lead.subdominio || "No disponible"}* (https://${lead.subdominio}.ruka.ai)`;
            break;
          case "sii-credentials":
            replyText = `4️⃣ *Actualización de Onboarding:* El restaurante ha ingresado sus credenciales del SII`;
            break;
          case "onboarding-completed":
            replyText = `✅ *Onboarding Completado:* El restaurante ha finalizado el proceso de onboarding`;
            break;
          default:
            replyText = `➡️ *Actualización de Onboarding:* Paso "${step}"`;
        }
        
        const threadMessage = {
          channel: SLACK_CHANNEL,
          text: replyText,
          thread_ts: threadTs // This is crucial for making it a reply
        };
        
        console.log('[DEBUG] Sending thread reply to Slack with payload:', JSON.stringify(threadMessage));
        
        // Call Slack API to post a message in the thread
        console.log('[DEBUG] Making API call to Slack chat.postMessage');
        const threadResponse = await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(threadMessage)
        });
        
        console.log('[DEBUG] Slack API response status:', threadResponse.status);
        console.log('[DEBUG] Slack API response headers:', Object.fromEntries(threadResponse.headers.entries()));
        
        const threadResult = await threadResponse.json();
        console.log('[DEBUG] Slack API response body:', JSON.stringify(threadResult));
        
        if (!threadResult.ok) {
          console.error('[DEBUG] Error sending thread message to Slack:', threadResult);
          
          // Check for specific error types
          if (threadResult.error === 'invalid_auth') {
            console.error('[DEBUG] Authentication error - token may be invalid or expired');
          } else if (threadResult.error === 'channel_not_found') {
            console.error('[DEBUG] Channel not found error - check channel name:', SLACK_CHANNEL);
          } else if (threadResult.error === 'thread_not_found') {
            console.error('[DEBUG] Thread not found error - the threadTs may be invalid');
          }
          
          return new Response(JSON.stringify({ success: false, error: 'Error sending thread message', details: threadResult }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200, // Still return 200 to not interrupt the main flow
          });
        }
        
        console.log('[DEBUG] Thread message sent successfully:', threadResult);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
        
      } catch (threadError) {
        console.error('[DEBUG] Error in thread reply process:', threadError);
        // Return success anyway to not interrupt the main flow
        return new Response(JSON.stringify({ success: false, error: threadError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Still return 200 to not interrupt the main flow
        });
      }
    }

    // If not an onboarding notification, send an initial message
    console.log('[DEBUG] Processing initial notification message');
    let blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🎉 ¡Tenemos un Nuevo Restaurante Interesado!",
          emoji: true
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<!channel>\n\n*¡Nuevo Lead!*\n\n*¡Hola equipo!* Tenemos un nuevo lead que quiere optimizar sus costos:\n\n🏪 *${lead.company_name}*`
        }
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `👤 *Contacto:*\n${lead.name}`
          },
          {
            type: "mrkdwn",
            text: `📍 *Ciudad:*\n${lead.ccity}`
          }
        ]
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `📧 *Email:*\n${lead.email}`
          },
          {
            type: "mrkdwn",
            text: `📱 *WhatsApp:*\n${lead.whatsapp ? lead.whatsapp : "No proporcionado"}`
          }
        ]
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: "💡 _Recuerda: mientras más rápido contactemos, más probabilidades de conversión_"
          }
        ]
      }
    ];

    const message = {
      channel: SLACK_CHANNEL,
      text: "🎉 ¡Nuevo Lead de Restaurante!",
      icon_emoji: ":money_with_wings:",
      blocks
    }
    
    console.log('[DEBUG] Sending initial Slack message with payload:', JSON.stringify(message));

    try {
      console.log('[DEBUG] Making API call to Slack chat.postMessage for initial message');
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      console.log('[DEBUG] Slack API response status for initial message:', response.status);
      console.log('[DEBUG] Slack API response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('[DEBUG] Slack API raw response text:', responseText);
      
      let slackResponse;
      try {
        slackResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.error('[DEBUG] Error parsing Slack API response:', parseError);
        console.log('[DEBUG] Raw response that failed to parse:', responseText);
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Error parsing Slack API response',
          rawResponse: responseText
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      console.log('[DEBUG] Slack API response body for initial message:', JSON.stringify(slackResponse));
      
      if (!slackResponse.ok) {
        console.error('[DEBUG] Error sending message to Slack:', slackResponse);
        
        // Check for specific error types
        if (slackResponse.error === 'invalid_auth') {
          console.error('[DEBUG] Authentication error - token may be invalid or expired');
        } else if (slackResponse.error === 'channel_not_found') {
          console.error('[DEBUG] Channel not found error - check channel name:', SLACK_CHANNEL);
        }
        
        return new Response(JSON.stringify({ success: false, error: 'Error al enviar mensaje a Slack', details: slackResponse }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Still return 200 to not interrupt the main flow
        });
      }
      
      console.log('[DEBUG] Slack message sent successfully with ts:', slackResponse.ts);
      
      // Return the message timestamp which will be used as the thread ID for future replies
      return new Response(JSON.stringify({ 
        success: true, 
        ts: slackResponse.ts 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (slackError) {
      console.error('[DEBUG] Error in Slack API request:', slackError);
      return new Response(JSON.stringify({ success: false, error: 'Error in Slack API request', details: slackError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Still return 200 to not interrupt the main flow
      });
    }
  } catch (error) {
    console.error('[DEBUG] Error in notify-slack function:', error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Still return 200 to not interrupt the main flow
    });
  }
})
