import { describe, it, expect } from "vitest";
import { marginMetrics, priceForMargin } from "@/utils/margin";

describe("margin and markup", () => {
  it("distinguishes the denominator", () => { const result = marginMetrics("6000", "10000"); expect(result.ok).toBe(true); if (result.ok) { expect(result.margin).toBe(40); expect(result.markup).toBeCloseTo(66.666667); expect(result.contribution).toBe(4000); } });
  it("shows a loss without clamping it to zero", () => { const result = marginMetrics("200", "100"); if (!result.ok) throw Error("invalid fixture"); expect(result.margin).toBe(-100); expect(result.markup).toBe(-50); });
  it("supports decimal comma and break-even", () => { const result = marginMetrics("60,25", "60.25"); if (!result.ok) throw Error("invalid fixture"); expect(result.margin).toBe(0); });
  it.each(["", "0", "-1", "Infinity", "1e2", "6.000,50", "12a", "1000000000001", "1.1234567"])("rejects ambiguous or unsafe amount %s", value => { expect(marginMetrics(value,"10").ok).toBe(false); expect(marginMetrics("10",value).ok).toBe(false); });
  it("solves price from margin rather than markup", () => { expect(priceForMargin("6000","40")).toBe(10000); expect(priceForMargin("6000","0")).toBe(6000); });
  it.each(["100","101","-2","","NaN"])("rejects unreachable target %s", target => expect(priceForMargin("6000",target)).toBeNull());
  it("requires positive cost for target price", () => expect(priceForMargin("0","40")).toBeNull());
});
