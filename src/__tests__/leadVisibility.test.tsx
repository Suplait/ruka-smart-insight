import { describe, expect, it } from "vitest";
import { buildLeadVisibilityBlocks } from "../../supabase/functions/_shared/leadVisibility";

const touch = {
  observed_at: "2026-10-13T12:00:00Z", page: "https://www.ruka.ai/restaurantes?email=private@example.com",
  utm_source: "facebook", utm_medium: "paid", utm_campaign: "octubre", utm_content: "video", utm_term: "restaurantes",
  fbclid: "RAW_CLICK_ID_MUST_NOT_APPEAR",
};
const attribution = { version: 1, first_touch: touch, session_entry: touch, last_non_direct_touch: touch, conversion_page: "/register?token=SECRET", captured_at: touch.observed_at };

describe("enriched Slack projection", () => {
  it("distinguishes expired detail from an acquisition capture failure", () => {
    const rendered = JSON.stringify(buildLeadVisibilityBlocks({ attribution: { version: 1, detail_expired: true } }));
    expect(rendered).toContain("detalle eliminado tras 90 días");
    expect(rendered).not.toContain("Clic Google: no capturado");
  });
  it("stays within Slack text limits even when escaping oversized inputs", () => {
    const large = Object.fromEntries(Object.keys(touch).map(key => [key, "<>&".repeat(1000)]));
    const blocks = buildLeadVisibilityBlocks({ attribution: { ...attribution, first_touch: large, last_non_direct_touch: large } });
    for (const block of blocks) if (block.text) expect(block.text.text.length).toBeLessThanOrEqual(3000);
  });
  it("shows all five UTMs on the initial notice with pending persistence", () => {
    const rendered = JSON.stringify(buildLeadVisibilityBlocks({ attribution }));
    for (const field of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) expect(rendered).toContain(field);
    expect(rendered).toContain("Persistencia pendiente");
    expect(rendered).toContain("Sin agenda confirmada hasta ahora");
    expect(rendered).not.toContain("RAW_CLICK_ID");
    expect(rendered).not.toContain("private@example.com");
    expect(rendered).not.toContain("SECRET");
  });

  it("does not manufacture direct or organic attribution", () => {
    const rendered = JSON.stringify(buildLeadVisibilityBlocks({ attribution: { version: 1 } }));
    expect(rendered).toContain("UTMs no capturadas");
    expect(rendered).toContain("Origen no determinado");
    expect(rendered).not.toContain("Tráfico directo");
    expect(JSON.stringify(buildLeadVisibilityBlocks({}))).toContain("Atribución pendiente");
  });

  it("escapes injected mentions and never builds task links from arbitrary URLs", () => {
    const malicious = { ...touch, utm_campaign: "<!channel> <https://evil.example|click>" };
    const rendered = JSON.stringify(buildLeadVisibilityBlocks({ attribution: { ...attribution, last_non_direct_touch: malicious }, clickupTaskId: "https://evil.example" }));
    expect(rendered).not.toContain("<!channel>");
    expect(rendered).not.toContain("<https://evil");
    expect(rendered).toContain("&lt;!channel&gt;");
    expect(rendered).not.toContain("Ver tarea");
  });

  it("keeps the first campaign separate from the last and updates the existing lead context", () => {
    const next = { ...touch, observed_at: "2026-10-14T12:00:00Z", utm_source: "google", utm_campaign: "search" };
    const rendered = JSON.stringify(buildLeadVisibilityBlocks({
      attribution: { ...attribution, last_non_direct_touch: next }, persisted: true, leadId: 42,
      submissionId: "f220f4b5-81be-4bde-8e73-21dd42a61000", clickupTaskId: "17test",
      confirmedMeetings: [{ status: "active", starts_at: "2026-10-15T15:00:00Z" }],
    }));
    expect(rendered).toContain("Primera entrada");
    expect(rendered).toContain("facebook / paid");
    expect(rendered).toContain("google / paid");
    expect(rendered).toContain("Lead ID: 42");
    expect(rendered).toContain("Confirmada por Calendly");
    expect(rendered).not.toContain("<!channel>");
    expect(rendered).toContain("https://app.clickup.com/t/17test");
  });
});
