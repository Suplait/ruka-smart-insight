
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
  industry?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const SLACK_BOT_TOKEN = Deno.env.get('SLACK_BOT_TOKEN')
    if (!SLACK_BOT_TOKEN) {
      throw new Error('SLACK_BOT_TOKEN no encontrado')
    }
    
    const requestBody = await req.json();
    const { lead, isOnboarding, leadId, step, threadTs } = requestBody as { 
      lead: Lead, 
      isOnboarding?: boolean,
      leadId?: number,
      step?: string,
      threadTs?: string 
    }
    
    const isHotel = lead.industry === 'hotel';
    const businessType = isHotel ? 'Hotel' : 'Restaurante';
    const businessTypeLC = isHotel ? 'hotel' : 'restaurante';

    // If this is an onboarding update for an existing thread
    if (isOnboarding && leadId && step && threadTs) {
      try {
        // Send reply to thread using the provided threadTs
        let replyText;
        switch(step) {
          case "data-months-selected":
            replyText = `1️⃣ *Actualización de Onboarding:* El ${businessTypeLC} quiere importar *${lead.meses_datos || 0}* meses de datos`;
            break;
          case "billing-system-selected":
            if (lead.sistema_facturacion === 'mercado' && lead.sistema_custom) {
              replyText = `2️⃣ *Actualización de Onboarding:* El ${businessTypeLC} ha seleccionado sistema de facturación *${lead.sistema_facturacion} (${lead.sistema_custom})*`;
            } else {
              replyText = `2️⃣ *Actualización de Onboarding:* El ${businessTypeLC} ha seleccionado sistema de facturación *${lead.sistema_facturacion || lead.sistema_custom || "No especificado"}*`;
            }
            break;
          case "subdomain-selected":
            replyText = `3️⃣ *Actualización de Onboarding:* El ${businessTypeLC} ha seleccionado su subdominio: *${lead.subdominio || "No disponible"}* (https://${lead.subdominio}.ruka.ai)`;
            break;
          case "sii-credentials":
            replyText = `4️⃣ *Actualización de Onboarding:* El ${businessTypeLC} ha ingresado sus credenciales del SII`;
            break;
          case "onboarding-completed":
            replyText = `✅ *Onboarding Completado:* El ${businessTypeLC} ha finalizado el proceso de onboarding`;
            break;
          default:
            replyText = `➡️ *Actualización de Onboarding:* Paso "${step}"`;
        }
        
        const threadMessage = {
          channel: SLACK_CHANNEL,
          text: replyText,
          thread_ts: threadTs // This is crucial for making it a reply
        };
        
        // Call Slack API to post a message in the thread
        const threadResponse = await fetch('https://slack.com/api/chat.postMessage', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(threadMessage)
        });
        
        const threadResult = await threadResponse.json();
        
        if (!threadResult.ok) {
          return new Response(JSON.stringify({ success: false, error: 'Error sending thread message', details: threadResult }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200, // Still return 200 to not interrupt the main flow
          });
        }
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
        
      } catch (threadError) {
        // Return success anyway to not interrupt the main flow
        return new Response(JSON.stringify({ success: false, error: threadError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Still return 200 to not interrupt the main flow
        });
      }
    }

    // If not an onboarding notification, send an initial message
    let blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `🎉 ¡Tenemos un Nuevo ${businessType} Interesado!`,
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
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `🏢 *Tipo de Negocio:*\n${businessType}`
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
      text: `🎉 ¡Nuevo Lead de ${businessType}!`,
      icon_emoji: ":money_with_wings:",
      blocks
    }
    
    try {
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      const responseText = await response.text();
      
      let slackResponse;
      try {
        slackResponse = JSON.parse(responseText);
      } catch (parseError) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: 'Error parsing Slack API response',
          rawResponse: responseText
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
      
      if (!slackResponse.ok) {
        return new Response(JSON.stringify({ success: false, error: 'Error al enviar mensaje a Slack', details: slackResponse }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Still return 200 to not interrupt the main flow
        });
      }
      
      // Return the message timestamp which will be used as the thread ID for future replies
      return new Response(JSON.stringify({ 
        success: true, 
        ts: slackResponse.ts 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (slackError) {
      return new Response(JSON.stringify({ success: false, error: 'Error in Slack API request', details: slackError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Still return 200 to not interrupt the main flow
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Still return 200 to not interrupt the main flow
    });
  }
})
