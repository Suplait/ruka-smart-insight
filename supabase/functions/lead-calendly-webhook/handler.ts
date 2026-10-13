import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { projectCalendlyEvidence, verifyCalendlySignature } from "../_shared/calendlyEvidence.ts";
import { LeadRequestError } from "../_shared/leadValidation.ts";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
export async function handleCalendlyWebhook(request: Request) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  const secret = Deno.env.get("LEAD_CALENDLY_SIGNING_KEY");
  if (!secret || Deno.env.get("LEAD_CALENDLY_ENABLED") !== "true") return json({ error: "Webhook not enabled" }, 503);
  try {
    if (Number(request.headers.get("content-length")) > 131072) return json({ error: "Payload too large" }, 413);
    const raw = await request.text();
    if (raw.length > 131072) return json({ error: "Payload too large" }, 413);
    if (!await verifyCalendlySignature(raw, request.headers.get("Calendly-Webhook-Signature"), secret)) return json({ error: "Invalid signature" }, 401);
    const evidence = await projectCalendlyEvidence(JSON.parse(raw));
    if (!evidence) return json({ ignored: true });
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
    const { error } = await db.rpc("trace_record_calendly", { p_meeting: evidence, p_source: "calendly" });
    if (error) return json({ error: "Evidence could not be saved" }, 503);
    // Acknowledge only after the meeting, ledger and outbox transaction commits.
    return json({ received: true });
  } catch (error) {
    if (error instanceof LeadRequestError || error instanceof SyntaxError) return json({ error: "Invalid Calendly payload" }, 400);
    console.error("calendly_evidence_failed");
    return json({ error: "Evidence service temporarily unavailable" }, 503);
  }
}
