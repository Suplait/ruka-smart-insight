import { legacyLeadAccessResponse } from "../functions/_shared/legacyLeadAccess.ts";

const assert = (value: unknown, message: string) => { if (!value) throw new Error(message); };
const headers = { "Access-Control-Allow-Origin": "*" };
const deadline = "2026-10-14T21:00:00Z";

Deno.test("legacy transport remains available before the configured cutover", () => {
  assert(legacyLeadAccessResponse(headers, "") === null, "No cutover must preserve the current flow");
  assert(legacyLeadAccessResponse(headers, deadline, Date.parse(deadline) - 1) === null, "Grace period remains available");
});

Deno.test("legacy transport expires exactly at cutover without disclosing contact data", async () => {
  const response = legacyLeadAccessResponse(headers, deadline, Date.parse(deadline));
  assert(response?.status === 410, "Expired clients cannot enter the legacy handler");
  assert(response?.headers.get("Cache-Control") === "no-store", "Do not cache a cutover response");
  assert(response?.headers.get("Access-Control-Allow-Origin") === "*", "Clients can read the failure");
  assert((await response!.json()).code === "LEGACY_FLOW_EXPIRED", "Explicit reload reason");
});

Deno.test("a malformed configured cutoff cannot silently reopen legacy access", () => {
  for (const cutoff of ["tomorrow", "2026-10-14", "2026-99-99T21:00:00Z"]) {
    assert(legacyLeadAccessResponse(headers, cutoff)?.status === 503, "Invalid cutover fails closed");
  }
});
