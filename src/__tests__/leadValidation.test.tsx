import { describe, expect, it } from "vitest";
import { continuation, projectAttribution, tokenDigest, validateLead } from "../../supabase/functions/_shared/leadValidation";

describe("intake boundary", () => {
  it("allows only contact fields and campaign fields, never credentials or arbitrary updates", () => {
    const lead = validateLead({ name: "Example", company_name: "Company", email: "qa@example.invalid", ccity: "Santiago", clave_sii: "SECRET", id: 777, page_path: "/restaurantes?token=SECRET", utm_term: "restaurant" }, "classic");
    expect(lead.page_path).toBe("/restaurantes");
    expect(lead.utm_term).toBe("restaurant");
    expect(lead).not.toHaveProperty("id");
    expect(JSON.stringify(lead)).not.toContain("SECRET");
  });

  it("requires valid ownership and lead fields", () => {
    expect(() => continuation({ submission_id: "bad", continuation_token: "a".repeat(64) })).toThrow();
    expect(() => validateLead({ name: "A", company: "B", email: "qa@example.invalid", whatsapp: "1" }, "one")).toThrow();
    expect(() => validateLead({ name: "Example", email: "bad", ccity: "Santiago", company_name: "Company" }, "classic")).toThrow();
  });

  it("drops malformed optional attribution without rejecting the lead", () => {
    expect(projectAttribution([])).toBeNull();
    expect(projectAttribution({ version: 99 })).toBeNull();
    expect(projectAttribution({ version: 1, observed_pages: [[], null, 3] })).toMatchObject({ observed_pages: [{ page: null, observed_at: null }, { page: null, observed_at: null }, { page: null, observed_at: null }] });
  });

  it("redacts URL secrets and does not retain GA IDs without granted consent", () => {
    const projected = projectAttribution({ version: 1, analytics_consent: "denied", ga_client_id: "SECRET", ga_session_id: "SECRET", raw: "SECRET", conversion_page: "https://name:SECRET@www.ruka.ai/restaurantes?email=SECRET#SECRET", first_touch: { page: "javascript:SECRET", referrer_origin: "https://google.com/search?q=SECRET" } });
    expect(projected).toMatchObject({ conversion_page: "https://www.ruka.ai/restaurantes", ga_client_id: null, ga_session_id: null, first_touch: { page: null, referrer_origin: "https://google.com" } });
    expect(JSON.stringify(projected)).not.toContain("SECRET");
  });

  it("hashes the continuation before database persistence", async () => {
    expect(await tokenDigest("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
});
