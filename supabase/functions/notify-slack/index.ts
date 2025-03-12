
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

  try {
    const SLACK_BOT_TOKEN = Deno.env.get('SLACK_BOT_TOKEN')
    if (!SLACK_BOT_TOKEN) {
      console.error('SLACK_BOT_TOKEN not found in environment variables');
      throw new Error('SLACK_BOT_TOKEN no encontrado')
    }

    const { lead, isOnboarding } = await req.json() as { lead: Lead, isOnboarding?: boolean }
    
    console.log('Received lead data for Slack notification:', lead);
    console.log('Is onboarding notification?', isOnboarding);

    // Solo enviar notificación inicial (no para actualizaciones de onboarding)
    if (isOnboarding) {
      console.log('Skipping Slack notification for onboarding update');
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

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
    
    console.log('Sending Slack message:', JSON.stringify(message, null, 2));

    try {
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      const slackResponse = await response.json();
      
      if (!slackResponse.ok) {
        console.error('Error sending message to Slack:', slackResponse);
        throw new Error('Error al enviar mensaje a Slack: ' + JSON.stringify(slackResponse));
      }
      
      console.log('Slack message sent successfully:', slackResponse);
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (slackError) {
      console.error('Error in Slack API request:', slackError);
      throw new Error('Error in Slack API request: ' + slackError.message);
    }
  } catch (error) {
    console.error('Error in notify-slack function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
