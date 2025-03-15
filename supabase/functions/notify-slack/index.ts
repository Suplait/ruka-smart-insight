
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

    const { lead, isOnboarding, leadId, step, threadTs } = await req.json() as { 
      lead: Lead, 
      isOnboarding?: boolean,
      leadId?: number,
      step?: string,
      threadTs?: string 
    }
    
    console.log('Received lead data for Slack notification:', lead);
    console.log('Is onboarding notification?', isOnboarding);
    console.log('Lead ID:', leadId);
    console.log('Step:', step);
    console.log('Thread TS:', threadTs);

    // If this is an onboarding update for an existing thread
    if (isOnboarding && leadId && step) {
      try {
        // Use the passed threadTs or fetch it if not provided
        let messageTs = threadTs;
        
        if (!messageTs) {
          console.log('No threadTs provided, fetching from database');
          // Get the slack_message_ts for this lead
          const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
          const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
          
          if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Supabase credentials not found in environment variables');
            throw new Error('Supabase credentials missing');
          }
          
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          
          const { data: leadData, error: leadError } = await supabase
            .from('leads')
            .select('slack_message_ts')
            .eq('id', leadId)
            .single();
            
          if (leadError || !leadData?.slack_message_ts) {
            console.error('Error retrieving slack_message_ts or value not set:', leadError);
            throw new Error('No thread ID found for this lead');
          }
          
          messageTs = leadData.slack_message_ts;
        }
        
        if (!messageTs) {
          console.error('No valid thread ID available');
          throw new Error('No valid thread ID available');
        }
        
        console.log('Using thread ID:', messageTs);
        
        // Send reply to thread
        let replyText;
        switch(step) {
          case "billing-system-selected":
            replyText = `🔄 *Actualización de Onboarding:* El restaurante ha seleccionado sistema de facturación *${lead.sistema_facturacion || lead.sistema_custom || "No especificado"}*`;
            break;
          case "rut-entered":
            replyText = `🔄 *Actualización de Onboarding:* El restaurante ha ingresado su RUT: *${lead.rut || "No disponible"}*`;
            break;
          case "sii-credentials":
            replyText = `🔄 *Actualización de Onboarding:* El restaurante ha ingresado sus credenciales del SII`;
            break;
          case "subdomain-selected":
            replyText = `🔄 *Actualización de Onboarding:* El restaurante ha seleccionado su subdominio: *${lead.subdominio || "No disponible"}*`;
            break;
          case "data-months-selected":
            replyText = `🔄 *Actualización de Onboarding:* El restaurante quiere importar *${lead.meses_datos || 0}* meses de datos`;
            break;
          case "onboarding-completed":
            replyText = `✅ *Onboarding Completado:* El restaurante ha finalizado el proceso de onboarding`;
            break;
          default:
            replyText = `🔄 *Actualización de Onboarding:* Paso "${step}"`;
        }
        
        const threadMessage = {
          channel: SLACK_CHANNEL,
          text: replyText,
          thread_ts: messageTs
        };
        
        console.log('Sending thread reply to Slack:', threadMessage);
        
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
          console.error('Error sending thread message to Slack:', threadResult);
          // We don't throw here to avoid interrupting the main flow, just log the error
          return new Response(JSON.stringify({ success: false, error: 'Error sending thread message' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200, // Still return 200 to not interrupt the main flow
          });
        }
        
        console.log('Thread message sent successfully:', threadResult);
        
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
        
      } catch (threadError) {
        console.error('Error in thread reply process:', threadError);
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
        return new Response(JSON.stringify({ success: false, error: 'Error al enviar mensaje a Slack' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200, // Still return 200 to not interrupt the main flow
        });
      }
      
      console.log('Slack message sent successfully:', slackResponse);
      
      // Return the message timestamp which will be used as the thread ID
      return new Response(JSON.stringify({ 
        success: true, 
        ts: slackResponse.ts 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    } catch (slackError) {
      console.error('Error in Slack API request:', slackError);
      return new Response(JSON.stringify({ success: false, error: 'Error in Slack API request' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Still return 200 to not interrupt the main flow
      });
    }
  } catch (error) {
    console.error('Error in notify-slack function:', error.message);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200, // Still return 200 to not interrupt the main flow
    });
  }
})
