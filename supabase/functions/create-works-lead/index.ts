import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const allowedFrequencies = new Set(["Varias veces al día", "Todos los días", "Todas las semanas", "Todos los meses", "Otro"]);
const allowedManualHours = new Set(["Menos de 5 h / semana", "5-20 h / semana", "20-50 h / semana", "Más de 50 h / semana", "No sé"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const nullableText = (value: unknown, max: number) => text(value, max) || null;

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

  try {
    const body = await request.json();
    const lead = {
      name: text(body.name, 120),
      company: text(body.company, 160),
      email: text(body.email, 254).toLowerCase(),
      whatsapp: nullableText(body.whatsapp, 40),
      process_description: text(body.process_description, 5000),
      systems: nullableText(body.systems, 1000),
      frequency: text(body.frequency, 60),
      manual_hours: text(body.manual_hours, 60),
      utm_source: nullableText(body.utm_source, 300),
      utm_medium: nullableText(body.utm_medium, 300),
      utm_campaign: nullableText(body.utm_campaign, 300),
      utm_content: nullableText(body.utm_content, 300),
      utm_term: nullableText(body.utm_term, 300),
      landing_path: text(body.landing_path, 200) || "/works",
    };

    const invalid =
      lead.name.length < 2 ||
      lead.company.length < 2 ||
      !emailPattern.test(lead.email) ||
      lead.process_description.length < 20 ||
      !allowedFrequencies.has(lead.frequency) ||
      !allowedManualHours.has(lead.manual_hours);

    if (invalid) {
      return new Response(JSON.stringify({ error: "invalid_payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceRoleKey) throw new Error("Missing server configuration");

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const { data, error } = await supabase.from("works_leads").insert(lead).select("id").single();
    if (error || !data) throw new Error("Could not create Works lead");

    return new Response(JSON.stringify({ lead_id: data.id }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "lead_creation_failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
