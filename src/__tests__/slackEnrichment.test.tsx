import { describe, expect, it } from "vitest";
import { initialLeadMessage } from "../../supabase/functions/_shared/initialLeadMessage";
import { slackEnrichmentMessage } from "../../supabase/functions/_shared/slackEnrichment";

const id = "f220f4b5-81be-4bde-8e73-21dd42a61000";
const lead = { name: "Example", email: "qa@example.invalid", company_name: "Restaurant", ccity: "Santiago", whatsapp: "+56900000000", page_path: "/restaurantes", utm_source: "facebook", utm_medium: "paid", utm_campaign: "October", utm_content: "video", utm_term: "restaurant" };

describe("initial Slack and subsequent updates", () => {
  it("preserves contact markers and puts all available UTMs on the first message", () => {
    const message = initialLeadMessage(lead, "classic", { submissionId: id, legacyUtms: lead });
    const rendered = JSON.stringify(message);
    expect(rendered).toContain("<!channel>");
    expect(rendered).toContain("*Contacto:*");
    expect(rendered).toContain("*Email:*");
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) expect(rendered).toContain(key);
    expect(message.metadata.event_payload.submission_id).toBe(id);
  });

  it("updates the same root, retains contact data and removes repeat channel mentions", () => {
    const message = initialLeadMessage(lead, "classic", { submissionId: id, legacyUtms: lead });
    const next = slackEnrichmentMessage(message, message.channel, "1234.5678", 2, { submissionId: id, persisted: true, leadId: 42, legacyUtms: lead });
    expect(next).toMatchObject({ channel: message.channel, ts: "1234.5678" });
    expect(JSON.stringify(next)).toContain("qa@example.invalid");
    expect(JSON.stringify(next)).not.toContain("<!channel>");
    expect(JSON.stringify(next)).not.toContain("Persistencia pendiente");
    expect(JSON.stringify(next)).toContain("Lead guardado");
    expect(next.blocks.filter(block => block.block_id?.startsWith("ruka_visibility_")).length).toBe(message.blocks.filter(block => block.block_id?.startsWith("ruka_visibility_")).length);
    expect(slackEnrichmentMessage(message, message.channel, "1234.5678", 2, { submissionId: id, persisted: true, leadId: 42, legacyUtms: lead })).toEqual(next);
  });

  it("preserves the One contact link/button and classic promotional context", () => {
    const one = initialLeadMessage({ ...lead, company: "One Company" }, "one", { submissionId: id });
    expect(JSON.stringify(one)).toContain("ruka_one_open_whatsapp");
    expect(JSON.stringify(one)).toContain("mailto:qa@example.invalid");
    const promo = initialLeadMessage({ ...lead, codigo_promocional: "WEBINAR" }, "classic", {});
    expect(JSON.stringify(promo)).toContain("Código Promocional");
    expect(JSON.stringify(promo)).toContain("WEBINAR");
  });
});
