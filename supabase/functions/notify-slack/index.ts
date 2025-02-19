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

    const { lead } = await req.json() as { lead: Lead }
    
    const message = {
      channel: SLACK_CHANNEL,
      text: "🎉 ¡Nuevo Lead de Restaurante!",
      icon_emoji: ":money_with_wings:",
      blocks: [
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
      ]
    }

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })

    const slackResponse = await response.json()
    
    if (!slackResponse.ok) {
      console.error('Error al enviar mensaje a Slack:', slackResponse)
      throw new Error('Error al enviar mensaje a Slack')
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
