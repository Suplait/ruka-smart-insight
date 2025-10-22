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
  facturas_compra_mes?: number
  codigo_promocional?: string
  page_path?: string
}

// Function to convert invoice count to descriptive range
function getInvoiceRangeText(count: number): string {
  if (count <= 75) {
    return "Menos de 150 facturas";
  } else if (count <= 225) {
    return "Entre 150 y 300 facturas";
  } else if (count <= 450) {
    return "Entre 300 y 600 facturas";
  } else {
    return "Más de 600 facturas";
  }
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
    
    console.log("Received notification request:", { lead, isOnboarding, leadId, step });
    
    // Detect if it's a product lead based on page_path
    const isProductLead = lead.page_path && lead.page_path.startsWith('/productos/');
    const isHotel = lead.industry === 'hotel';
    const businessType = isProductLead ? 'Producto' : (isHotel ? 'Hotel' : 'Restaurante');
    const businessTypeLC = isProductLead ? 'producto' : (isHotel ? 'hotel' : 'restaurante');

    // If this is an onboarding update for an existing thread
    if (isOnboarding && leadId && step && threadTs) {
      try {
        console.log("Processing onboarding update for thread:", threadTs);
        // Send reply to thread using the provided threadTs
        let replyText;
        switch(step) {
          case "invoice-count-selected":
            replyText = `1️⃣ *Actualización de Onboarding:* El ${businessTypeLC} recibe *${getInvoiceRangeText(lead.facturas_compra_mes || 0)}* al mes`;
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
        
        console.log("Sending thread message:", threadMessage);
        
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
        
        console.log("Thread message response:", threadResult);
        
        if (!threadResult.ok) {
          console.error('Error sending thread message:', threadResult);
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
        console.error('Thread error:', threadError);
        // Return success anyway to not interrupt the main flow
        return new Response(JSON.stringify({ success: false, error: threadError.message }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Still return 200 to not interrupt the main flow
        });
      }
    }

    // If not an onboarding notification, send an initial message
    const leadEmoji = isProductLead ? '🚀' : (isHotel ? '🏨' : '🍽️');
    const hasPromoCode = lead.codigo_promocional && lead.codigo_promocional.trim() !== '';
    const titleSuffix = hasPromoCode ? ' (webinar)' : '';
    
    // Extract product name from page_path if it's a product lead
    let productName = '';
    if (isProductLead && lead.page_path) {
      const pathParts = lead.page_path.split('/');
      productName = pathParts[pathParts.length - 1] || 'Producto';
      // Capitalize and format the product name
      productName = productName.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
    
    let blocks = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: isProductLead 
            ? `${leadEmoji} ¡Tenemos un Nuevo Lead Interesado en ${productName}!${titleSuffix}`
            : `${leadEmoji} ¡Tenemos un Nuevo ${businessType} Interesado!${titleSuffix}`,
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
          text: isProductLead
            ? `<!channel>\n\n*¡Nuevo Lead de Producto!*\n\n*¡Hola equipo!* Tenemos un nuevo lead interesado en nuestro producto:\n\n💼 *${lead.company_name}*\n🎯 *Producto de interés:* ${productName}`
            : `<!channel>\n\n*¡Nuevo Lead!*\n\n*¡Hola equipo!* Tenemos un nuevo lead que quiere optimizar sus costos:\n\n${isHotel ? '🏨' : '🏪'} *${lead.company_name}*`
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
      }
    ];

    // Add promotional code field if present
    if (hasPromoCode) {
      blocks.push({
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `🎫 *Código Promocional:*\n${lead.codigo_promocional}`
          }
        ]
      });
    }

    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: "💡 _Recuerda: mientras más rápido contactemos, más probabilidades de conversión_"
        }
      ]
    });

    const message = {
      channel: SLACK_CHANNEL,
      text: isProductLead 
        ? `${leadEmoji} ¡Nuevo Lead de Producto: ${productName}!${titleSuffix}`
        : `${leadEmoji} ¡Nuevo Lead de ${businessType}!${titleSuffix}`,
      icon_emoji: isProductLead ? ":rocket:" : (isHotel ? ":hotel:" : ":money_with_wings:"),
      blocks
    }
    
    try {
      console.log('Sending message to Slack:', JSON.stringify(message));
      const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SLACK_BOT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      });

      const responseText = await response.text();
      console.log('Slack API response:', responseText);
      
      let slackResponse;
      try {
        slackResponse = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing Slack API response:', parseError, 'Raw response:', responseText);
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
        console.error('Error sending message to Slack:', slackResponse);
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
      console.error('Error in Slack API request:', slackError);
      return new Response(JSON.stringify({ success: false, error: 'Error in Slack API request', details: slackError.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Still return 200 to not interrupt the main flow
      });
    }
  } catch (error) {
    console.error('General error in notify-slack:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Still return 200 to not interrupt the main flow
    });
  }
})
