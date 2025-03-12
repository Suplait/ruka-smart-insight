
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
  sii_connected?: boolean
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
    
    const isOnboarding = lead.meses_datos !== undefined || lead.sistema_facturacion !== undefined || 
                         lead.subdominio !== undefined || lead.sii_connected === true
    
    let blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: isOnboarding 
            ? "🎉 ¡Onboarding Completado!"
            : "🎉 ¡Tenemos un Nuevo Restaurante Interesado!",
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
          text: `<!channel>\n\n*${isOnboarding ? '¡Onboarding Completado!' : '¡Nuevo Lead!'}*\n\n*¡Hola equipo!* ${
            isOnboarding 
              ? `¡${lead.company_name} ha completado el proceso de onboarding!` 
              : `Tenemos un nuevo lead que quiere optimizar sus costos:\n\n🏪 *${lead.company_name}*`
          }`
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
      }
    ]
    
    // Add onboarding information if available
    if (isOnboarding) {
      const onboardingFields = []
      
      if (lead.meses_datos !== undefined) {
        onboardingFields.push({
          type: "mrkdwn",
          text: `📅 *Meses de datos:*\n${lead.meses_datos}`
        })
      }
      
      if (lead.sistema_facturacion) {
        onboardingFields.push({
          type: "mrkdwn",
          text: `🧾 *Sistema de facturación:*\n${
            lead.sistema_facturacion === 'sii' 
              ? 'SII Gratuito' 
              : `${lead.sistema_custom || 'Facturador de Mercado'}`
          }`
        })
      }
      
      if (lead.subdominio) {
        onboardingFields.push({
          type: "mrkdwn",
          text: `🌐 *Subdominio:*\n${lead.subdominio}.ruka.ai`
        })
      }
      
      if (lead.rut) {
        onboardingFields.push({
          type: "mrkdwn",
          text: `🔑 *RUT:*\n${lead.rut}`
        })
      }
      
      if (lead.sii_connected) {
        onboardingFields.push({
          type: "mrkdwn",
          text: `✅ *SII Conectado:*\nSí`
        })
      }
      
      // Add fields in pairs
      for (let i = 0; i < onboardingFields.length; i += 2) {
        const fields = [onboardingFields[i]]
        if (i + 1 < onboardingFields.length) {
          fields.push(onboardingFields[i + 1])
        }
        
        blocks.push({
          type: "section",
          fields
        })
      }
    }
    
    // Add context at the end
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: isOnboarding
            ? "💡 _Recuerda: agenda la llamada de capacitación lo antes posible_"
            : "💡 _Recuerda: mientras más rápido contactemos, más probabilidades de conversión_"
        }
      ]
    })

    const message = {
      channel: SLACK_CHANNEL,
      text: isOnboarding ? "🎉 ¡Onboarding Completado!" : "🎉 ¡Nuevo Lead de Restaurante!",
      icon_emoji: ":money_with_wings:",
      blocks
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
