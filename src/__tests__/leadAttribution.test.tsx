import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

async function collector() {
  return (await import("@/utils/leadAttribution")).captureLeadAttribution;
}

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-10-13T12:00:00Z"));
  localStorage.clear();
  sessionStorage.clear();
  window.history.replaceState({}, "", "/");
  Object.defineProperty(document, "referrer", { value: "", configurable: true });
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe("independent lead acquisition evidence", () => {
  it("captures all five UTMs and click evidence without changing existing tracking", async () => {
    const legacy = '{"utm_source":"legacy"}';
    localStorage.setItem("utm_params", legacy);
    window.dataLayer = [{ event: "existing_conversion", lead_id: 123 }];
    window.history.replaceState({}, "", "/restaurantes?utm_source=facebook&utm_medium=paid&utm_campaign=octubre&utm_content=video&utm_term=restaurantes&fbclid=click-id&email=private@example.com#private");
    const result = (await collector())();
    expect(result.first_touch).toMatchObject({
      utm_source: "facebook", utm_medium: "paid", utm_campaign: "octubre",
      utm_content: "video", utm_term: "restaurantes", fbclid: "click-id",
    });
    expect(result.conversion_page).toBe("https://www.ruka.ai/restaurantes");
    expect(JSON.stringify(result)).not.toContain("private");
    expect(localStorage.getItem("utm_params")).toBe(legacy);
    expect(window.dataLayer).toEqual([{ event: "existing_conversion", lead_id: 123 }]);
    expect(result.ga_client_id).toBeNull();
    expect(result.ga_session_id).toBeNull();
    expect(result.analytics_consent).toBe("unknown");
  });

  it("preserves first touch and last campaign across a return visit without inventing UTMs", async () => {
    const capture = await collector();
    window.history.replaceState({}, "", "/?utm_source=google&utm_campaign=search");
    const first = capture();
    vi.advanceTimersByTime(31 * 60 * 1000);
    window.history.replaceState({}, "", "/one/contacto");
    const returning = capture();
    expect(returning.first_touch).toEqual(first.first_touch);
    expect(returning.last_non_direct_touch).toEqual(first.last_non_direct_touch);
    expect(returning.session_entry.utm_source).toBeNull();
    expect(returning.anonymous_id).toBe(first.anonymous_id);
    expect(returning.session_id).not.toBe(first.session_id);
  });

  it("does not treat a stale document referrer as another acquisition on SPA navigation", async () => {
    Object.defineProperty(document, "referrer", { value: "https://example.org/article?email=private@example.com", configurable: true });
    const capture = await collector();
    const first = capture();
    vi.advanceTimersByTime(1000);
    window.history.replaceState({}, "", "/register");
    const next = capture();
    expect(next.last_non_direct_touch).toEqual(first.last_non_direct_touch);
    expect(next.first_touch.referrer_origin).toBe("https://example.org");
    expect(next.observed_pages).toHaveLength(2);
  });

  it("returns bounded partial history and deduplicates repeated route observation", async () => {
    const capture = await collector();
    for (let n = 0; n < 30; n++) {
      window.history.replaceState({}, "", `/blog/article-${n}`);
      capture();
    }
    const result = capture();
    expect(result.observed_pages).toHaveLength(20);
    expect(result.history_is_partial).toBe(true);
    expect(result.first_touch.page).toBe("https://www.ruka.ai/blog/article-0");
  });

  it("continues when browser storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new DOMException("Denied", "SecurityError"); });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new DOMException("Quota", "QuotaExceededError"); });
    const capture = await collector();
    const first = capture();
    window.history.replaceState({}, "", "/register");
    expect(capture().anonymous_id).toBe(first.anonymous_id);
    expect(capture().observed_pages).toHaveLength(2);
  });

  it("discards corrupt stored evidence and expires attribution after 90 days", async () => {
    localStorage.setItem("ruka_lead_attribution_v1", '{"first_touch":"bad"}');
    sessionStorage.setItem("ruka_lead_session_v1", "invalid JSON");
    const capture = await collector();
    const first = capture();
    vi.advanceTimersByTime(91 * 24 * 60 * 60 * 1000);
    window.history.replaceState({}, "", "/one");
    const expired = capture();
    expect(expired.anonymous_id).not.toBe(first.anonymous_id);
    expect(expired.first_touch.page).toBe("https://www.ruka.ai/one");
  });

  it("never labels missing or internal referrers as a known acquisition source", async () => {
    Object.defineProperty(document, "referrer", { value: "https://ruka.ai/home-anterior", configurable: true });
    const result = (await collector())();
    expect(result.first_touch.referrer_origin).toBeNull();
    expect(result.last_non_direct_touch).toBeNull();
  });

  it("restores a valid session after a reload without new page entries", async () => {
    const first = (await collector())();
    vi.resetModules();
    const reload = (await collector())();
    expect(reload.anonymous_id).toBe(first.anonymous_id);
    expect(reload.session_id).toBe(first.session_id);
    expect(reload.observed_pages).toHaveLength(1);
  });
});
