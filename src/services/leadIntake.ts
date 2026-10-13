import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { captureLeadAttribution, type LeadAttribution } from "@/utils/leadAttribution";

// The deployed intake and both delivery adapters passed real-destination QA.
// Explicit false is retained for compatibility tests and pre-cutover rollback.
export const leadTraceabilityEnabled = () => import.meta.env.VITE_LEAD_TRACEABILITY !== "false";
export type LeadContinuation = { submission_id: string; continuation_token: string; expires_at: number };
export type LeadSubmission = { continuation: LeadContinuation; attribution: LeadAttribution | null };
type LeadInput = Record<string, string | null | undefined>;
export type ClassicLeadInput = LeadInput & { name: string; company_name: string; email: string; ccity: string };
type ClassicLead = Pick<Tables<"leads">, "first_name" | "last_name" | "email" | "ccity" | "whatsapp" | "company_name" | "name">;
type IntakeResponse = { success?: boolean; stored?: boolean; ts?: string; id?: number; lead?: ClassicLead };
const continuations = new Map<string, LeadContinuation>();
const TOKEN_LIFETIME = 7 * 24 * 60 * 60 * 1000;

function store(key: string, continuation: LeadContinuation) {
  continuations.set(key, continuation);
  try { sessionStorage.setItem(`ruka_lead_continuation:${key}`, JSON.stringify(continuation)); } catch { /* Memory and route state still work. */ }
}

export function readLeadContinuation(key: string | number, candidate?: unknown): LeadContinuation | null {
  let value = candidate ?? continuations.get(String(key));
  try { value ??= JSON.parse(sessionStorage.getItem(`ruka_lead_continuation:${key}`) || "null"); } catch { /* Storage can be unavailable. */ }
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<LeadContinuation>;
  if (!/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(item.submission_id || "") ||
    !/^[a-f0-9]{64}$/.test(item.continuation_token || "") || typeof item.expires_at !== "number" || item.expires_at <= Date.now()) return null;
  return item as LeadContinuation;
}

export function createLeadSubmission(submissionId?: string): LeadSubmission | null {
  if (!leadTraceabilityEnabled()) return null;
  const id = submissionId || crypto.randomUUID();
  const existing = readLeadContinuation(id);
  // Never fall back to Math.random for an authorization capability.
  const continuation = existing || {
    submission_id: id,
    continuation_token: Array.from(crypto.getRandomValues(new Uint8Array(32)), value => value.toString(16).padStart(2, "0")).join(""),
    expires_at: Date.now() + TOKEN_LIFETIME,
  };
  store(id, continuation);
  return { continuation, attribution: captureLeadAttribution() };
}

export async function invokeLeadIntake(continuation: LeadContinuation, body: Record<string, unknown>) {
  try {
    return await supabase.functions.invoke<IntakeResponse>("lead-intake", {
      body: { ...body, submission_id: continuation.submission_id, continuation_token: continuation.continuation_token },
    });
  } catch {
    return { data: null, error: new Error("Lead service temporarily unavailable") };
  }
}

function withTerm(lead: LeadInput, submission: LeadSubmission) {
  // The legacy store and independent attribution record can describe different
  // visits. Only complete the fifth UTM from a touch whose other four match.
  const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
  const normalize = (value: string | null | undefined) => value?.trim() || null;
  const attribution = submission.attribution;
  const matchingTouch = [attribution?.last_non_direct_touch, attribution?.session_entry, attribution?.first_touch]
    .find(touch => touch && campaignKeys.every(key => normalize(touch[key]) === normalize(lead[key])));
  return { ...lead, utm_term: lead.utm_term ?? matchingTouch?.utm_term ?? null };
}

export function prepareClassicLead(submission: LeadSubmission | null, lead: LeadInput, legacySlackLead: LeadInput) {
  return submission
    ? invokeLeadIntake(submission.continuation, { action: "prepare", funnel: "classic", lead: withTerm(lead, submission), attribution: submission.attribution })
    : supabase.functions.invoke<IntakeResponse>("notify-slack", { body: { lead: legacySlackLead, isOnboarding: false } });
}

export async function persistClassicLead(submission: LeadSubmission | null, lead: ClassicLeadInput) {
  if (!submission) return supabase.from("leads").insert([lead]).select().single();
  const result = await invokeLeadIntake(submission.continuation, { action: "submit", funnel: "classic", lead: withTerm(lead, submission), attribution: submission.attribution });
  if (result.error || !result.data?.stored || !result.data.id) {
    void invokeLeadIntake(submission.continuation, { action: "persistence_failed" });
    return { data: null, error: result.error || new Error("Lead could not be saved") };
  }
  store(String(result.data.id), submission.continuation);
  return { data: { id: result.data.id }, error: null };
}

export async function finishClassicSlack(submission: LeadSubmission | null, lead: LeadInput, legacySlackLead: LeadInput, leadId: number) {
  try {
    // Reusing the same submission lets the server reconcile an ambiguous send.
    const result = await prepareClassicLead(submission, lead, legacySlackLead);
    if (!submission && !result.error && result.data?.ts) {
      await supabase.functions.invoke("update-lead", { body: { leadId, updateData: { slack_message_ts: result.data.ts } } });
    }
  } catch { /* Notification delivery never blocks form progression. */ }
}

export function getClassicLead(leadId: number, continuation: LeadContinuation | null) {
  if (!leadTraceabilityEnabled()) return supabase.from("leads").select("first_name, last_name, email, ccity, whatsapp, company_name, name").eq("id", leadId).single();
  return (async () => {
    if (!continuation) return { data: null, error: new Error("Missing continuation") };
    const result = await invokeLeadIntake(continuation, { action: "get" });
    return { data: result.data?.lead ?? null, error: result.error };
  })();
}

export function updateClassicLead(leadId: number, continuation: LeadContinuation | null, update: Record<string, unknown>) {
  if (!leadTraceabilityEnabled()) return supabase.functions.invoke<IntakeResponse>("update-lead", { body: { leadId, updateData: update } });
  if (!continuation) return Promise.resolve({ data: null, error: new Error("Missing continuation") });
  return invokeLeadIntake(continuation, { action: "update", update });
}
