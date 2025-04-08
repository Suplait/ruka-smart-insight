
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { lead, threadTs, isOnboarding, leadId, step, industryType = 'restaurant' } = await req.json();

    const SLACK_BOT_TOKEN = Deno.env.get('SLACK_BOT_TOKEN');
    if (!SLACK_BOT_TOKEN) {
      throw new Error('Missing SLACK_BOT_TOKEN');
    }

    // Use the correct Slack channel ID
    const SLACK_CHANNEL_ID = "C07TNCYA66L"; // This should be a valid channel ID

    // Format industry-specific message parts
    const industryName = industryType === 'hotel' ? 'Hotel' : 'Restaurante';
    const industryItemType = industryType === 'hotel' ? 'suministros' : 'insumos';

    let text = '';

    if (isOnboarding) {
      // This is a follow-up message in a thread
      switch (step) {
        case 'data-months-selected':
          text = `:calendar: *Actualización de Onboarding*\nSeleccionó ${lead.meses_datos} meses de datos para importar.`;
          break;
        case 'billing-system-selected':
          text = `:receipt: *Actualización de Onboarding*\nSeleccionó ${lead.sistema_facturacion} como sistema de facturación${lead.sistema_custom ? ` (${lead.sistema_custom})` : ''}.`;
          break;
        case 'subdomain-selected':
          text = `:link: *Actualización de Onboarding*\nSeleccionó el subdominio: ${lead.subdominio}.ruka.ai`;
          break;
        case 'sii-credentials':
          text = `:key: *Actualización de Onboarding*\nIngresó credenciales de SII para: ${lead.rut}`;
          break;
        case 'onboarding-completed':
          text = `:white_check_mark: *Onboarding Completado*\nEl cliente ha finalizado el proceso de onboarding.`;
          break;
        default:
          text = `:information_source: *Actualización de Onboarding*\nPaso completado: ${step}`;
      }
    } else {
      // This is an initial notification message
      text = `:tada: *¡Nuevo registro de ${industryName}!*\n` +
        `*Nombre:* ${lead.name}\n` +
        `*Email:* ${lead.email}\n` +
        `*${industryName}:* ${lead.company_name}\n` +
        `*Ciudad:* ${lead.ccity}\n` +
        (lead.whatsapp ? `*WhatsApp:* ${lead.whatsapp}\n` : '') +
        `\n:rocket: Este cliente quiere automatizar el control de ${industryItemType} con Ruka.ai\n` +
        `\n:calendar: Asigna este lead para contactarlo dentro de las próximas 24 horas.`;
    }

    // Prepare the request to Slack API
    const slackApiUrl = "https://slack.com/api/chat.postMessage";

    const requestBody: Record<string, any> = {
      channel: SLACK_CHANNEL_ID,
      text,
    };

    // If this is a thread reply, include the thread_ts
    if (isOnboarding && threadTs) {
      requestBody.thread_ts = threadTs;
    }

    console.log(`Sending message to Slack: ${JSON.stringify(requestBody)}`);

    const slackResponse = await fetch(slackApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(requestBody)
    });

    const slackData = await slackResponse.json();

    if (!slackData.ok) {
      console.error("Error sending message to Slack:", slackData.error);
      throw new Error(`Slack API error: ${slackData.error}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        ts: slackData.ts || slackData.message?.ts
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error in notify-slack function:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
})
