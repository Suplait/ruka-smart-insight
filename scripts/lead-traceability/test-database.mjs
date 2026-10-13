import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync } from "node:fs";
import { tmpdir, userInfo } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../", import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), "ruka-lead-db-test-"));
const data = join(temporary, "data");
const socket = join(temporary, "socket");
mkdirSync(socket, { mode: 0o700 });
const env = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith("PG")));
const run = (program, args) => execFileSync(program, args, { cwd: root, env, stdio: "pipe" });
let started = false;
try {
  run("initdb", ["-D", data, "-A", "trust", "--no-locale", "--encoding=UTF8"]);
  // Unix socket inside our private temporary directory; no TCP listener.
  run("pg_ctl", ["-D", data, "-l", join(temporary, "server.log"), "-o", `-k '${socket.replaceAll("'", "'\\''")}' -h '' -p 60432`, "start"]);
  started = true;
  const result = run("psql", ["-h", socket, "-p", "60432", "-U", userInfo().username, "-d", "postgres", "-v", "ON_ERROR_STOP=1",
    "-f", "supabase/tests/lead_traceability_fixture.sql",
    "-f", "supabase/migrations/20260821022000_create_leads_one.sql",
    "-f", "supabase/migrations/20261013180000_add_lead_traceability.sql",
    "-f", "supabase/migrations/20261013181000_add_calendly_evidence.sql",
    "-f", "supabase/migrations/20261013190000_add_clickup_delivery.sql",
    "-f", "supabase/migrations/20261013200000_add_calendar_reconciliation.sql",
    "-f", "supabase/migrations/20261013210000_add_slack_recovery.sql",
    "-f", "supabase/migrations/20261013220000_simplify_slack_visibility.sql",
    "-f", "supabase/migrations/20261013230000_remove_unused_public_lead_privileges.sql",
    "-f", "supabase/migrations/20261014000000_add_lead_monitor.sql",
    "-f", "supabase/migrations/20261014010000_expire_lead_attribution_detail.sql",
    "-f", "supabase/migrations/20261014020000_add_external_lead_watchdog.sql",
    "-f", "supabase/tests/lead_traceability.sql",
    "-f", "supabase/tests/calendly_evidence.sql",
    "-f", "supabase/tests/clickup_delivery.sql",
    "-f", "supabase/tests/calendar_reconciliation.sql",
    "-f", "supabase/tests/persistence_failure.sql",
    "-f", "supabase/tests/lead_monitor.sql",
    "-f", "supabase/tests/attribution_retention.sql",
    "-f", "supabase/tests/external_watchdog.sql"]);
  console.log(result.toString().trim().split("\n").slice(-6).join("\n"));
  console.log("Lead traceability SQL assertions passed in a disposable PostgreSQL instance.");
} catch (error) {
  console.error(error.stderr?.toString() || error.message);
  process.exitCode = 1;
} finally {
  if (started) run("pg_ctl", ["-D", data, "-m", "fast", "stop"]);
  rmSync(temporary, { recursive: true, force: true });
}
