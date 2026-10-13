/** Configure only after the public frontend uses the private continuation. */
export function legacyLeadAccessResponse(
  corsHeaders: Record<string, string>,
  cutoff = Deno.env.get("LEAD_LEGACY_ACCESS_ENDS_AT"),
  now = Date.now(),
): Response | null {
  if (!cutoff) return null;
  const deadline = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(cutoff) ? Date.parse(cutoff) : NaN;
  if (Number.isFinite(deadline) && now < deadline) return null;
  return new Response(JSON.stringify({
    error: Number.isFinite(deadline) ? "Reload the page to start a new lead submission" : "Lead service temporarily unavailable",
    code: Number.isFinite(deadline) ? "LEGACY_FLOW_EXPIRED" : "LEGACY_CUTOFF_INVALID",
  }), {
    status: Number.isFinite(deadline) ? 410 : 503,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
