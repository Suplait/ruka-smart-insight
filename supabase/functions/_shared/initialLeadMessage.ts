import { buildLeadVisibilityBlocks, escapeSlack, type LeadVisibility, type SlackBlock } from "./leadVisibility.ts";
import type { LeadInput, Funnel } from "./leadValidation.ts";

/** Preserve the existing human/bot contact labels; append acquisition evidence. */
export function initialLeadMessage(lead: LeadInput, funnel: Funnel, visibility: LeadVisibility) {
  const company = escapeSlack(lead.company_name || lead.company);
  const isProduct = funnel === "classic" && lead.page_path?.startsWith("/productos/");
  const product = isProduct ? (lead.page_path?.split("/").pop() || "").split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ").slice(0, 80) : "";
  const emoji = isProduct ? "🚀" : "🍽️";
  const blocks: SlackBlock[] = funnel === "classic" ? [
    { type: "header", text: { type: "plain_text", emoji: true, text: isProduct ? `${emoji} ¡Tenemos un Nuevo Lead Interesado en ${product}!` : `${emoji} ¡Tenemos un Nuevo Restaurante Interesado!` } },
    { type: "divider" },
    { type: "section", text: { type: "mrkdwn", text: isProduct
      ? `<!channel>\n\n*¡Nuevo Lead de Producto!*\n\n*¡Hola equipo!* Tenemos un nuevo lead interesado en nuestro producto:\n\n💼 *${company}*\n🎯 *Producto de interés:* ${escapeSlack(product)}`
      : `<!channel>\n\n*¡Nuevo Lead!*\n\n*¡Hola equipo!* Tenemos un nuevo lead que quiere optimizar sus costos:\n\n🏪 *${company}*` } },
    { type: "section", fields: [{ type: "mrkdwn", text: `👤 *Contacto:*\n${escapeSlack(lead.name)}` }, { type: "mrkdwn", text: `📍 *Ciudad:*\n${escapeSlack(lead.ccity)}` }] },
    { type: "section", fields: [{ type: "mrkdwn", text: `📧 *Email:*\n${escapeSlack(lead.email)}` }, { type: "mrkdwn", text: `📱 *WhatsApp:*\n${escapeSlack(lead.whatsapp) || "No proporcionado"}` }] },
  ] : [
    { type: "header", text: { type: "plain_text", text: ":large_blue_circle: Ruka One · Nuevo proceso para evaluar", emoji: true } },
    { type: "divider" },
    { type: "section", text: { type: "mrkdwn", text: `*${company}* quiere revisar qué parte de su operación todavía depende de trabajo manual.` }, accessory: { type: "image", image_url: "https://www.ruka.ai/logo.png", alt_text: "Ruka.ai" } },
    { type: "section", fields: [{ type: "mrkdwn", text: `:bust_in_silhouette: *Contacto*\n${escapeSlack(lead.name)}` }, { type: "mrkdwn", text: `:office: *Empresa*\n${company}` }] },
    { type: "section", fields: [{ type: "mrkdwn", text: `:email: *Email*\n<mailto:${escapeSlack(lead.email)}|${escapeSlack(lead.email)}>` }, { type: "mrkdwn", text: `:speech_balloon: *WhatsApp*\n<https://wa.me/${(lead.whatsapp || "").replace(/\D/g, "")}|${escapeSlack(lead.whatsapp)}>` }] },
    { type: "actions", elements: [{ type: "button", text: { type: "plain_text", text: "Contactar por WhatsApp", emoji: true }, style: "primary", url: `https://wa.me/${(lead.whatsapp || "").replace(/\D/g, "")}`, action_id: "ruka_one_open_whatsapp" }] },
  ];
  if (funnel === "classic" && lead.codigo_promocional) blocks.push({ type: "section", fields: [{ type: "mrkdwn", text: `🎫 *Código Promocional:*\n${escapeSlack(lead.codigo_promocional)}` }] });
  return {
    channel: "C08DUJ6V2G6",
    text: funnel === "one" ? `Ruka One · Nuevo proceso para evaluar · ${lead.company}` : isProduct ? `${emoji} ¡Nuevo Lead de Producto: ${product}!` : `${emoji} ¡Nuevo Lead de Restaurante!`,
    icon_emoji: funnel === "one" ? ":gem:" : isProduct ? ":rocket:" : ":money_with_wings:",
    client_msg_id: visibility.submissionId,
    metadata: { event_type: "ruka_lead_submission", event_payload: { submission_id: visibility.submissionId } },
    unfurl_links: false,
    unfurl_media: false,
    blocks: [...blocks, ...buildLeadVisibilityBlocks(visibility)],
  };
}
