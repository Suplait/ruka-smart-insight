import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const jsonHeaders = { "Content-Type": "application/json" };
const slackChannel = Deno.env.get("ORGANIC_GROWTH_SLACK_CHANNEL") || "C073N8S9TB4";

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

const json = (body: Json, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: jsonHeaders });

function adminClient() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Missing Supabase configuration");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function authorized(request: Request) {
  const expected = Deno.env.get("ORGANIC_GROWTH_SHARED_SECRET");
  const actual = request.headers.get("x-organic-growth-secret");
  return Boolean(expected && actual && expected === actual);
}

function compactNumber(value: unknown) {
  return new Intl.NumberFormat("es-CL", { maximumFractionDigits: 1 }).format(Number(value || 0));
}

function percent(value: unknown) {
  return `${(Number(value || 0) * 100).toFixed(1)}%`;
}

function delta(value: unknown) {
  const number = Number(value || 0);
  return `${number > 0 ? "+" : ""}${number.toFixed(1)}%`;
}

function metricLine(label: string, metric: Record<string, unknown>) {
  return `*${label}:* ${compactNumber(metric.current)} vs ${compactNumber(metric.previous)} · ${delta(metric.changePercent)}`;
}

function reportBlocks(payload: Record<string, unknown>) {
  const executive = Array.isArray(payload.executiveSummary) ? payload.executiveSummary : [];
  const performance = (payload.performance || {}) as Record<string, Record<string, unknown>>;
  const winners = Array.isArray(payload.winners) ? payload.winners : [];
  const losers = Array.isArray(payload.losers) ? payload.losers : [];
  const changes = Array.isArray(payload.changes) ? payload.changes : [];
  const bets = Array.isArray(payload.nextBets) ? payload.nextBets : [];
  const blockers = Array.isArray(payload.blockers) ? payload.blockers : [];
  const dataThrough = String(payload.dataThroughDate || "sin fecha");

  const lines15 = performance.days15 || {};
  const lines30 = performance.days30 || {};
  const renderWindow = (title: string, item: Record<string, unknown>) => {
    const metrics = (item.metrics || {}) as Record<string, Record<string, unknown>>;
    const output = [`*${title}*`];
    if (metrics.clicks) output.push(metricLine("Clics", metrics.clicks));
    if (metrics.impressions) output.push(metricLine("Impresiones", metrics.impressions));
    if (metrics.ctr) {
      output.push(`*CTR:* ${percent(metrics.ctr.current)} vs ${percent(metrics.ctr.previous)} · ${delta(metrics.ctr.changePercent)}`);
    }
    if (metrics.position) output.push(`*Posición media:* ${Number(metrics.position.current || 0).toFixed(1)} vs ${Number(metrics.position.previous || 0).toFixed(1)}`);
    return output.join("\n");
  };

  const bullets = (items: unknown[]) => items.length ? items.slice(0, 6).map((item) => `• ${String(item)}`).join("\n") : "• Sin novedades relevantes.";

  return [
    { type: "header", text: { type: "plain_text", text: "RUKA ORGANIC GROWTH | Reporte quincenal", emoji: true } },
    { type: "context", elements: [{ type: "mrkdwn", text: `:mag: Datos finalizados hasta *${dataThrough}* · Search Console` }] },
    { type: "divider" },
    { type: "section", text: { type: "mrkdwn", text: `*1. Resumen ejecutivo*\n${bullets(executive)}` } },
    { type: "section", fields: [
      { type: "mrkdwn", text: `*2. Performance orgánica*\n${renderWindow("Últimos 15 días", lines15)}` },
      { type: "mrkdwn", text: `*Últimos 30 días*\n${renderWindow("", lines30).replace(/^\*\*\n/, "")}` },
    ] },
    { type: "section", fields: [
      { type: "mrkdwn", text: `*3. Ganadores*\n${bullets(winners)}` },
      { type: "mrkdwn", text: `*Atención*\n${bullets(losers)}` },
    ] },
    { type: "section", text: { type: "mrkdwn", text: `*4. Cambios implementados*\n${bullets(changes)}` } },
    { type: "section", text: { type: "mrkdwn", text: `*5. Pipeline SEO*\n${String(payload.pipelineSummary || "Sin datos de pipeline.")}` } },
    { type: "section", text: { type: "mrkdwn", text: `*6. Próximas apuestas*\n${bullets(bets)}` } },
    ...(blockers.length ? [{ type: "section", text: { type: "mrkdwn", text: `*7. Bloqueos o decisiones requeridas*\n${bullets(blockers)}` } }] : []),
    { type: "context", elements: [{ type: "mrkdwn", text: "Las variaciones describen movimiento observado; no atribuyen causalidad sin evidencia suficiente." }] },
  ];
}

async function postSlack(blocks: unknown[], text: string) {
  const token = Deno.env.get("SLACK_BOT_TOKEN");
  if (!token) throw new Error("Missing SLACK_BOT_TOKEN");
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ channel: slackChannel, icon_emoji: ":mag:", username: "Ruka Organic Growth", text, blocks }),
  });
  const result = await response.json();
  if (!response.ok || !result.ok) throw new Error(`Slack delivery failed: ${result.error || response.status}`);
  return result as { ts: string; channel: string };
}

Deno.serve(async (request) => {
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (!authorized(request)) return json({ error: "unauthorized" }, 401);

  try {
    const body = await request.json() as Record<string, unknown>;
    const action = String(body.action || "");
    const supabase = adminClient();

    if (action === "status") {
      const [state, runs, opportunities, experiments] = await Promise.all([
        supabase.from("organic_growth_state").select("*").eq("engine_key", "ruka").single(),
        supabase.from("organic_growth_runs").select("id,kind,status,started_at,finished_at,data_through_date,error_message").order("started_at", { ascending: false }).limit(12),
        supabase.from("organic_growth_opportunities").select("id,fingerprint,title,cluster,status,priority_score,target_url,evidence,approval_reason").order("priority_score", { ascending: false }).limit(20),
        supabase.from("organic_growth_experiments").select("id,title,status,affected_urls,hypothesis,baseline,success_metrics,evaluate_after,results,conclusion,git_sha,deployment_url").order("updated_at", { ascending: false }).limit(20),
      ]);
      for (const result of [state, runs, opportunities, experiments]) if (result.error) throw result.error;
      return json({ state: state.data, runs: runs.data, opportunities: opportunities.data, experiments: experiments.data });
    }

    if (action === "claim") {
      const { data, error } = await supabase.rpc("claim_organic_growth_job", {
        p_kind: body.kind,
        p_trigger_source: body.triggerSource || "schedule",
        p_force: Boolean(body.force),
      });
      if (error) throw error;
      return json((data?.[0] || { claimed: false, reason: "empty_response" }) as Json);
    }

    if (action === "complete") {
      const { data, error } = await supabase.rpc("finish_organic_growth_job", {
        p_run_id: body.runId,
        p_success: body.success !== false,
        p_summary: body.summary || {},
        p_error_message: body.errorMessage || null,
        p_data_through_date: body.dataThroughDate || null,
        p_git_sha: body.gitSha || null,
        p_pull_request_url: body.pullRequestUrl || null,
        p_deployment_url: body.deploymentUrl || null,
      });
      if (error) throw error;
      return json({ completed: data });
    }

    if (action === "snapshot") {
      const { data, error } = await supabase.from("organic_growth_snapshots").upsert({
        run_id: body.runId || null,
        data_through_date: body.dataThroughDate,
        property: body.property || "sc-domain:ruka.ai",
        payload: body.payload || {},
      }, { onConflict: "run_id,data_through_date" }).select("id").single();
      if (error) throw error;
      return json({ snapshotId: data.id });
    }

    if (action === "sync_opportunities") {
      const rows = Array.isArray(body.rows) ? body.rows : [];
      if (rows.length === 0) return json({ count: 0 });
      const stamped = rows.map((row) => ({ ...(row as Record<string, unknown>), last_seen_at: new Date().toISOString(), updated_at: new Date().toISOString() }));
      const { error } = await supabase.from("organic_growth_opportunities").upsert(stamped, { onConflict: "fingerprint" });
      if (error) throw error;
      return json({ count: stamped.length });
    }

    if (action === "sync_product_signals") {
      const rows = Array.isArray(body.rows) ? body.rows : [];
      if (rows.length === 0) return json({ count: 0 });
      const stamped = rows.map((row) => ({ ...(row as Record<string, unknown>), updated_at: new Date().toISOString() }));
      const { error } = await supabase.from("organic_growth_product_signals").upsert(stamped, { onConflict: "fingerprint" });
      if (error) throw error;
      return json({ count: stamped.length });
    }

    if (action === "create_experiment") {
      const { data, error } = await supabase.from("organic_growth_experiments").insert(body.experiment).select("id").single();
      if (error) throw error;
      if (body.opportunityId) {
        const { error: opportunityError } = await supabase.from("organic_growth_opportunities")
          .update({ status: "measuring", updated_at: new Date().toISOString() })
          .eq("id", body.opportunityId);
        if (opportunityError) throw opportunityError;
      }
      return json({ experimentId: data.id });
    }

    if (action === "update_experiments") {
      const updates = Array.isArray(body.updates) ? body.updates : [];
      for (const update of updates) {
        const row = update as Record<string, unknown>;
        const allowedStatuses = ["measuring", "validated", "inconclusive", "reverted"];
        if (!row.id || !allowedStatuses.includes(String(row.status))) throw new Error("Invalid experiment update");
        const { error } = await supabase.from("organic_growth_experiments").update({
          status: row.status,
          results: row.results || {},
          conclusion: row.conclusion || null,
          updated_at: new Date().toISOString(),
        }).eq("id", row.id);
        if (error) throw error;
      }
      return json({ count: updates.length });
    }

    if (action === "report") {
      const payload = (body.payload || {}) as Record<string, unknown>;
      const { data: report, error: insertError } = await supabase.from("organic_growth_reports").insert({
        run_id: body.runId || null,
        period_end: body.periodEnd,
        payload,
        slack_channel_id: slackChannel,
      }).select("id").single();
      if (insertError) throw insertError;

      try {
        const sent = await postSlack(reportBlocks(payload), "Ruka Organic Growth · Reporte quincenal");
        const { error: updateError } = await supabase.from("organic_growth_reports").update({
          delivery_status: "sent", slack_timestamp: sent.ts, delivered_at: new Date().toISOString(),
        }).eq("id", report.id);
        if (updateError) throw updateError;
        return json({ reportId: report.id, delivered: true, slackTimestamp: sent.ts });
      } catch (error) {
        await supabase.from("organic_growth_reports").update({ delivery_status: "failed" }).eq("id", report.id);
        throw error;
      }
    }

    if (action === "incident") {
      const severity = String(body.severity || "warning");
      const title = String(body.title || "Incidente del Organic Growth Engine");
      const details = String(body.details || "Sin detalles");
      const blocks = [
        { type: "header", text: { type: "plain_text", text: `Organic Growth · ${severity.toUpperCase()}`, emoji: true } },
        { type: "section", text: { type: "mrkdwn", text: `*${title}*\n${details}` } },
      ];
      const sent = await postSlack(blocks, `${title}: ${details}`);
      return json({ delivered: true, slackTimestamp: sent.ts });
    }

    return json({ error: "unknown_action" }, 400);
  } catch (error) {
    console.error(error);
    return json({ error: error instanceof Error ? error.message : "unknown_error" }, 500);
  }
});
