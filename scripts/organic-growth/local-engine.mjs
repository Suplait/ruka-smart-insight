import { randomUUID } from "node:crypto";
import { chmodSync, mkdirSync, readdirSync, unlinkSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { backup as sqliteBackup, DatabaseSync } from "node:sqlite";

const timezone = "America/Santiago";
const allowedKinds = new Set(["execution", "reporting", "monitoring", "measurement", "strategy"]);
const allowedExperimentStatuses = new Set(["measuring", "validated", "inconclusive", "reverted"]);

export const defaultDatabasePath = path.join(os.homedir(), ".codex", "ruka-organic-growth", "state.sqlite");

const json = (value, fallback = {}) => {
  if (value == null || value === "") return fallback;
  if (typeof value !== "string") return value;
  try { return JSON.parse(value); } catch { return fallback; }
};

const iso = (value = Date.now()) => new Date(value).toISOString();

function zonedParts(value, timeZone = timezone) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
}

function zonedDateToUtc({ year, month, day, hour = 0, minute = 0, second = 0 }, timeZone = timezone) {
  let guess = Date.UTC(year, month - 1, day, hour, minute, second);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const actual = zonedParts(guess, timeZone);
    const wantedAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
    const actualAsUtc = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute, actual.second);
    const correction = wantedAsUtc - actualAsUtc;
    if (!correction) break;
    guess += correction;
  }
  return new Date(guess);
}

export function nextReportAt(after = new Date()) {
  const local = zonedParts(after, timezone);
  if (local.day < 15) return zonedDateToUtc({ year: local.year, month: local.month, day: 15, hour: 9 });
  const nextMonth = new Date(Date.UTC(local.year, local.month, 1));
  return zonedDateToUtc({
    year: nextMonth.getUTCFullYear(),
    month: nextMonth.getUTCMonth() + 1,
    day: 1,
    hour: 9,
  });
}

function nextLocalDayAt(after, days, hour, minute = 0) {
  const local = zonedParts(after, timezone);
  const target = new Date(Date.UTC(local.year, local.month - 1, local.day + days));
  return zonedDateToUtc({
    year: target.getUTCFullYear(),
    month: target.getUTCMonth() + 1,
    day: target.getUTCDate(),
    hour,
    minute,
  });
}

export function nextExecutionAt(after = new Date()) {
  return nextLocalDayAt(after, 3, 17, 30);
}

export function nextDailyMonitoringAt(after = new Date()) {
  return nextLocalDayAt(after, 1, 8, 30);
}

export function nextWeeklyMeasurementAt(after = new Date()) {
  const local = zonedParts(after, timezone);
  const weekday = new Date(Date.UTC(local.year, local.month - 1, local.day)).getUTCDay();
  let daysUntilMonday = (8 - weekday) % 7;
  if (daysUntilMonday === 0 && (local.hour > 10 || (local.hour === 10 && (local.minute > 0 || local.second > 0)))) {
    daysUntilMonday = 7;
  }
  const target = new Date(Date.UTC(local.year, local.month - 1, local.day + daysUntilMonday));
  return zonedDateToUtc({
    year: target.getUTCFullYear(),
    month: target.getUTCMonth() + 1,
    day: target.getUTCDate(),
    hour: 10,
  });
}

export function nextMonthlyStrategyAt(after = new Date()) {
  const local = zonedParts(after, timezone);
  const beforeThisMonthReview = local.day === 1 && (local.hour < 11);
  const target = beforeThisMonthReview
    ? new Date(Date.UTC(local.year, local.month - 1, 1))
    : new Date(Date.UTC(local.year, local.month, 1));
  return zonedDateToUtc({
    year: target.getUTCFullYear(),
    month: target.getUTCMonth() + 1,
    day: 1,
    hour: 11,
  });
}

const jobFields = {
  execution: { prefix: "execution", due: "next_execution_at", success: "last_execution_success_at" },
  reporting: { prefix: "reporting", due: "next_report_at", success: "last_report_success_at" },
  monitoring: { prefix: "monitoring", due: "next_monitoring_at", success: "last_monitoring_success_at" },
  measurement: { prefix: "measurement", due: "next_measurement_at", success: "last_measurement_success_at" },
  strategy: { prefix: "strategy", due: "next_strategy_at", success: "last_strategy_success_at" },
};

function nextDueAt(kind, now, success) {
  if (!success) {
    const retryHours = kind === "reporting" || kind === "monitoring" ? 2 : kind === "strategy" ? 24 : 6;
    return new Date(now.getTime() + retryHours * 3600000);
  }
  if (kind === "execution") return nextExecutionAt(now);
  if (kind === "reporting") return nextReportAt(now);
  if (kind === "monitoring") return nextDailyMonitoringAt(now);
  if (kind === "measurement") return nextWeeklyMeasurementAt(now);
  return nextMonthlyStrategyAt(now);
}

function priorityScore(row) {
  if (row.priority_score != null) return Number(row.priority_score);
  const effort = Math.max(1, Number(row.effort || 1));
  return ((Number(row.commercial_intent || 0) * 2) + Number(row.demand_confidence || 0) + Number(row.ruka_advantage || 0) - Number(row.risk || 0)) / effort;
}

function entityFromRow(row) {
  const payload = json(row.payload_json, {});
  const publicColumns = Object.fromEntries(
    Object.entries(row).filter(([key]) => !key.endsWith("_json")),
  );
  return { ...payload, ...publicColumns };
}

export class LocalOrganicGrowthEngine {
  constructor(databasePath = process.env.ORGANIC_GROWTH_DB_PATH || defaultDatabasePath, { now = () => new Date() } = {}) {
    this.databasePath = path.resolve(databasePath);
    this.now = now;
    mkdirSync(path.dirname(this.databasePath), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(this.databasePath);
    this.db.exec("PRAGMA journal_mode = WAL; PRAGMA synchronous = FULL; PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 10000;");
    this.#migrate();
    chmodSync(this.databasePath, 0o600);
  }

  close() { this.db.close(); }

  #migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS metadata (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS state (
        engine_key TEXT PRIMARY KEY CHECK (engine_key = 'ruka'),
        timezone TEXT NOT NULL,
        next_execution_at TEXT NOT NULL,
        next_report_at TEXT NOT NULL,
        execution_lease_run_id TEXT,
        execution_lease_expires_at TEXT,
        reporting_lease_run_id TEXT,
        reporting_lease_expires_at TEXT,
        monitoring_lease_run_id TEXT,
        monitoring_lease_expires_at TEXT,
        measurement_lease_run_id TEXT,
        measurement_lease_expires_at TEXT,
        strategy_lease_run_id TEXT,
        strategy_lease_expires_at TEXT,
        next_monitoring_at TEXT NOT NULL,
        next_measurement_at TEXT NOT NULL,
        next_strategy_at TEXT NOT NULL,
        last_execution_success_at TEXT,
        last_report_success_at TEXT,
        last_monitoring_success_at TEXT,
        last_measurement_success_at TEXT,
        last_strategy_success_at TEXT,
        last_data_through_date TEXT,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS runs (
        id TEXT PRIMARY KEY,
        kind TEXT NOT NULL CHECK (kind IN ('execution', 'reporting', 'monitoring', 'measurement', 'strategy')),
        trigger_source TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'skipped')),
        started_at TEXT NOT NULL,
        finished_at TEXT,
        data_through_date TEXT,
        git_sha TEXT,
        pull_request_url TEXT,
        deployment_url TEXT,
        summary_json TEXT NOT NULL DEFAULT '{}',
        error_message TEXT
      );
      CREATE INDEX IF NOT EXISTS runs_kind_started_idx ON runs(kind, started_at DESC);
      CREATE TABLE IF NOT EXISTS snapshots (
        id TEXT PRIMARY KEY,
        run_id TEXT,
        data_through_date TEXT NOT NULL,
        captured_at TEXT NOT NULL,
        property TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        UNIQUE(run_id, data_through_date)
      );
      CREATE TABLE IF NOT EXISTS opportunities (
        id TEXT PRIMARY KEY,
        fingerprint TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        cluster TEXT NOT NULL,
        status TEXT NOT NULL,
        priority_score REAL NOT NULL,
        target_url TEXT,
        approval_reason TEXT,
        evidence_json TEXT NOT NULL DEFAULT '[]',
        payload_json TEXT NOT NULL,
        first_seen_at TEXT NOT NULL,
        last_seen_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS opportunities_priority_idx ON opportunities(status, priority_score DESC);
      CREATE TABLE IF NOT EXISTS experiments (
        id TEXT PRIMARY KEY,
        opportunity_id TEXT,
        run_id TEXT,
        title TEXT NOT NULL,
        status TEXT NOT NULL,
        evaluate_after TEXT,
        updated_at TEXT NOT NULL,
        payload_json TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS experiments_status_idx ON experiments(status, evaluate_after);
      CREATE TABLE IF NOT EXISTS product_signals (
        id TEXT PRIMARY KEY,
        fingerprint TEXT NOT NULL UNIQUE,
        repository TEXT NOT NULL,
        source_ref TEXT NOT NULL,
        observed_at TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS reports (
        id TEXT PRIMARY KEY,
        run_id TEXT,
        period_end TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        delivery_status TEXT NOT NULL CHECK (delivery_status IN ('pending', 'sent', 'failed')),
        delivery_reference TEXT,
        created_at TEXT NOT NULL,
        delivered_at TEXT
      );
      CREATE TABLE IF NOT EXISTS incidents (
        id TEXT PRIMARY KEY,
        severity TEXT NOT NULL,
        title TEXT NOT NULL,
        details TEXT NOT NULL,
        delivery_status TEXT NOT NULL DEFAULT 'pending',
        delivery_reference TEXT,
        created_at TEXT NOT NULL,
        delivered_at TEXT
      );
    `);
    const current = this.now();
    const previousSchemaVersion = Number(this.db.prepare("SELECT value FROM metadata WHERE key = 'schema_version'").get()?.value || 1);
    const columns = new Map(this.db.prepare("PRAGMA table_info(state)").all().map((row) => [row.name, row]));
    const additions = [
      ["monitoring_lease_run_id", "TEXT"], ["monitoring_lease_expires_at", "TEXT"],
      ["measurement_lease_run_id", "TEXT"], ["measurement_lease_expires_at", "TEXT"],
      ["strategy_lease_run_id", "TEXT"], ["strategy_lease_expires_at", "TEXT"],
      ["next_monitoring_at", "TEXT"], ["next_measurement_at", "TEXT"], ["next_strategy_at", "TEXT"],
      ["last_monitoring_success_at", "TEXT"], ["last_measurement_success_at", "TEXT"], ["last_strategy_success_at", "TEXT"],
    ];
    for (const [name, type] of additions) {
      if (!columns.has(name)) this.db.exec(`ALTER TABLE state ADD COLUMN ${name} ${type}`);
    }

    this.db.prepare(`
      INSERT OR IGNORE INTO state (
        engine_key, timezone, next_execution_at, next_report_at, next_monitoring_at,
        next_measurement_at, next_strategy_at, updated_at
      ) VALUES ('ruka', ?, ?, ?, ?, ?, ?, ?)
    `).run(
      timezone,
      iso(current),
      iso(nextReportAt(current)),
      iso(current),
      iso(nextWeeklyMeasurementAt(current)),
      iso(nextMonthlyStrategyAt(current)),
      iso(current),
    );

    const runsSql = this.db.prepare("SELECT sql FROM sqlite_master WHERE type = 'table' AND name = 'runs'").get()?.sql || "";
    if (!runsSql.includes("'monitoring'")) {
      this.db.exec(`
        DROP INDEX IF EXISTS runs_kind_started_idx;
        ALTER TABLE runs RENAME TO runs_legacy;
        CREATE TABLE runs (
          id TEXT PRIMARY KEY,
          kind TEXT NOT NULL CHECK (kind IN ('execution', 'reporting', 'monitoring', 'measurement', 'strategy')),
          trigger_source TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('running', 'succeeded', 'failed', 'skipped')),
          started_at TEXT NOT NULL,
          finished_at TEXT,
          data_through_date TEXT,
          git_sha TEXT,
          pull_request_url TEXT,
          deployment_url TEXT,
          summary_json TEXT NOT NULL DEFAULT '{}',
          error_message TEXT
        );
        INSERT INTO runs SELECT * FROM runs_legacy;
        DROP TABLE runs_legacy;
        CREATE INDEX runs_kind_started_idx ON runs(kind, started_at DESC);
      `);
    }

    this.db.prepare(`
      UPDATE state SET
        next_monitoring_at = COALESCE(next_monitoring_at, ?),
        next_measurement_at = COALESCE(next_measurement_at, ?),
        next_strategy_at = COALESCE(next_strategy_at, ?),
        updated_at = ?
      WHERE engine_key = 'ruka'
    `).run(
      iso(current),
      iso(nextWeeklyMeasurementAt(current)),
      iso(nextMonthlyStrategyAt(current)),
      iso(current),
    );
    if (previousSchemaVersion < 3) {
      const state = this.db.prepare("SELECT last_execution_success_at FROM state WHERE engine_key = 'ruka'").get();
      if (state?.last_execution_success_at) {
        this.db.prepare("UPDATE state SET next_execution_at = ?, updated_at = ? WHERE engine_key = 'ruka'")
          .run(iso(nextExecutionAt(new Date(state.last_execution_success_at))), iso(current));
      }
    }
    this.db.prepare("INSERT OR REPLACE INTO metadata(key, value) VALUES('schema_version', '3')").run();
  }

  #transaction(callback) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const result = callback();
      this.db.exec("COMMIT");
      return result;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }

  #recoverExpiredLeases(now) {
    const state = this.db.prepare("SELECT * FROM state WHERE engine_key = 'ruka'").get();
    for (const kind of allowedKinds) {
      const { prefix } = jobFields[kind];
      const runField = `${prefix}_lease_run_id`;
      const expiryField = `${prefix}_lease_expires_at`;
      if (state[runField] && state[expiryField] && Date.parse(state[expiryField]) <= now.getTime()) {
        this.db.prepare("UPDATE runs SET status = 'failed', finished_at = ?, error_message = ? WHERE id = ? AND status = 'running'")
          .run(iso(now), `${kind} lease expired before completion`, state[runField]);
        this.db.prepare(`UPDATE state SET ${runField} = NULL, ${expiryField} = NULL, updated_at = ? WHERE engine_key = 'ruka'`)
          .run(iso(now));
      }
    }
  }

  claim({ kind = "execution", triggerSource = "codex_automation", force = false } = {}) {
    if (!allowedKinds.has(kind)) throw new Error(`Invalid organic growth job kind: ${kind}`);
    return this.#transaction(() => {
      const now = this.now();
      this.#recoverExpiredLeases(now);
      const state = this.db.prepare("SELECT * FROM state WHERE engine_key = 'ruka'").get();
      const { prefix, due } = jobFields[kind];
      const leaseRunId = state[`${prefix}_lease_run_id`];
      const leaseExpiresAt = state[`${prefix}_lease_expires_at`];
      const nextDueAt = state[due];
      if (leaseRunId && leaseExpiresAt && Date.parse(leaseExpiresAt) > now.getTime()) {
        return { claimed: false, run_id: null, reason: "active_lease", next_due_at: nextDueAt };
      }
      if (!force && Date.parse(nextDueAt) > now.getTime()) {
        return { claimed: false, run_id: null, reason: "not_due", next_due_at: nextDueAt };
      }
      const runId = randomUUID();
      const startedAt = iso(now);
      const leaseExpires = iso(now.getTime() + 2 * 60 * 60 * 1000);
      this.db.prepare("INSERT INTO runs(id, kind, trigger_source, status, started_at) VALUES(?, ?, ?, 'running', ?)")
        .run(runId, kind, String(triggerSource || "schedule").slice(0, 80), startedAt);
      this.db.prepare(`UPDATE state SET ${prefix}_lease_run_id = ?, ${prefix}_lease_expires_at = ?, updated_at = ? WHERE engine_key = 'ruka'`)
        .run(runId, leaseExpires, startedAt);
      return { claimed: true, run_id: runId, reason: "claimed", next_due_at: nextDueAt };
    });
  }

  complete(body = {}) {
    if (!body.runId) throw new Error("complete requires runId");
    return this.#transaction(() => {
      const now = this.now();
      const run = this.db.prepare("SELECT * FROM runs WHERE id = ?").get(body.runId);
      if (!run) throw new Error(`Unknown run ${body.runId}`);
      if (run.status !== "running") throw new Error(`Run ${body.runId} is already ${run.status}`);
      const { prefix, due: dueField, success: successField } = jobFields[run.kind];
      const state = this.db.prepare("SELECT * FROM state WHERE engine_key = 'ruka'").get();
      if (state[`${prefix}_lease_run_id`] !== body.runId) throw new Error(`Run ${body.runId} no longer owns the ${run.kind} lease`);
      const success = body.success !== false;
      this.db.prepare(`
        UPDATE runs SET status = ?, finished_at = ?, data_through_date = COALESCE(?, data_through_date),
          git_sha = COALESCE(?, git_sha), pull_request_url = COALESCE(?, pull_request_url),
          deployment_url = COALESCE(?, deployment_url), summary_json = ?, error_message = ?
        WHERE id = ?
      `).run(
        success ? "succeeded" : "failed", iso(now), body.dataThroughDate || null, body.gitSha || null,
        body.pullRequestUrl || null, body.deploymentUrl || null, JSON.stringify(body.summary || {}),
        success ? null : String(body.errorMessage || "Unknown failure").slice(0, 8000), body.runId,
      );
      const nextDue = iso(nextDueAt(run.kind, now, success));
      this.db.prepare(`
        UPDATE state SET ${dueField} = ?, ${successField} = CASE WHEN ? THEN ? ELSE ${successField} END,
          last_data_through_date = COALESCE(?, last_data_through_date),
          ${prefix}_lease_run_id = NULL, ${prefix}_lease_expires_at = NULL, updated_at = ?
        WHERE engine_key = 'ruka'
      `).run(nextDue, success ? 1 : 0, iso(now), body.dataThroughDate || null, iso(now));
      return { completed: true, next_due_at: nextDue };
    });
  }

  status() {
    const state = this.db.prepare("SELECT * FROM state WHERE engine_key = 'ruka'").get();
    const runs = this.db.prepare(`
      SELECT id, kind, status, started_at, finished_at, data_through_date, error_message,
        git_sha, pull_request_url, deployment_url, summary_json FROM runs ORDER BY started_at DESC LIMIT 12
    `).all().map((row) => ({ ...row, summary: json(row.summary_json, {}), summary_json: undefined }));
    const opportunities = this.db.prepare("SELECT * FROM opportunities ORDER BY priority_score DESC LIMIT 20").all()
      .map((row) => ({ ...entityFromRow(row), evidence: json(row.evidence_json, []) }));
    const experiments = this.db.prepare("SELECT * FROM experiments ORDER BY updated_at DESC LIMIT 20").all().map(entityFromRow);
    return { state, runs, opportunities, experiments, storage: { type: "sqlite", path: this.databasePath } };
  }

  snapshot(body = {}) {
    if (!body.dataThroughDate) throw new Error("snapshot requires dataThroughDate");
    const id = randomUUID();
    this.db.prepare(`
      INSERT INTO snapshots(id, run_id, data_through_date, captured_at, property, payload_json)
      VALUES(?, ?, ?, ?, ?, ?)
      ON CONFLICT(run_id, data_through_date) DO UPDATE SET captured_at = excluded.captured_at,
        property = excluded.property, payload_json = excluded.payload_json
    `).run(id, body.runId || null, body.dataThroughDate, iso(this.now()), body.property || "sc-domain:ruka.ai", JSON.stringify(body.payload || {}));
    return { snapshotId: id };
  }

  syncOpportunities(rows = []) {
    const statement = this.db.prepare(`
      INSERT INTO opportunities(id, fingerprint, title, cluster, status, priority_score, target_url,
        approval_reason, evidence_json, payload_json, first_seen_at, last_seen_at, updated_at)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(fingerprint) DO UPDATE SET title = excluded.title, cluster = excluded.cluster,
        status = excluded.status, priority_score = excluded.priority_score, target_url = excluded.target_url,
        approval_reason = excluded.approval_reason, evidence_json = excluded.evidence_json,
        payload_json = excluded.payload_json, last_seen_at = excluded.last_seen_at, updated_at = excluded.updated_at
    `);
    const now = iso(this.now());
    this.#transaction(() => {
      for (const row of rows) statement.run(
        row.id || randomUUID(), row.fingerprint, row.title, row.cluster, row.status || "discovered",
        priorityScore(row), row.target_url || null, row.approval_reason || null, JSON.stringify(row.evidence || []),
        JSON.stringify(row), row.first_seen_at || now, now, now,
      );
    });
    return { count: rows.length };
  }

  syncProductSignals(rows = []) {
    const statement = this.db.prepare(`
      INSERT INTO product_signals(id, fingerprint, repository, source_ref, observed_at, payload_json, updated_at)
      VALUES(?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(fingerprint) DO UPDATE SET repository = excluded.repository, source_ref = excluded.source_ref,
        payload_json = excluded.payload_json, updated_at = excluded.updated_at
    `);
    const now = iso(this.now());
    this.#transaction(() => {
      for (const row of rows) statement.run(
        row.id || randomUUID(), row.fingerprint, row.repository, row.source_ref, row.observed_at || now,
        JSON.stringify(row), now,
      );
    });
    return { count: rows.length };
  }

  createExperiment({ opportunityId = null, experiment = {} } = {}) {
    const id = experiment.id || randomUUID();
    const now = iso(this.now());
    const payload = { ...experiment, id, opportunity_id: opportunityId || experiment.opportunity_id || null, updated_at: now };
    this.#transaction(() => {
      this.db.prepare(`
        INSERT INTO experiments(id, opportunity_id, run_id, title, status, evaluate_after, updated_at, payload_json)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, payload.opportunity_id, payload.run_id || null, payload.title, payload.status || "discovered", payload.evaluate_after || null, now, JSON.stringify(payload));
      if (opportunityId) this.db.prepare("UPDATE opportunities SET status = 'measuring', updated_at = ? WHERE id = ?").run(now, opportunityId);
    });
    return { experimentId: id };
  }

  updateExperiments(updates = []) {
    const now = iso(this.now());
    this.#transaction(() => {
      for (const update of updates) {
        if (!update.id || !allowedExperimentStatuses.has(String(update.status))) throw new Error("Invalid experiment update");
        const row = this.db.prepare("SELECT payload_json FROM experiments WHERE id = ?").get(update.id);
        if (!row) throw new Error(`Unknown experiment ${update.id}`);
        const payload = { ...json(row.payload_json, {}), status: update.status, results: update.results || {}, conclusion: update.conclusion || null, updated_at: now };
        this.db.prepare("UPDATE experiments SET status = ?, updated_at = ?, payload_json = ? WHERE id = ?")
          .run(update.status, now, JSON.stringify(payload), update.id);
      }
    });
    return { count: updates.length };
  }

  report(body = {}) {
    const id = randomUUID();
    this.db.prepare(`
      INSERT INTO reports(id, run_id, period_end, payload_json, delivery_status, created_at)
      VALUES(?, ?, ?, ?, 'pending', ?)
    `).run(id, body.runId || null, body.periodEnd, JSON.stringify(body.payload || {}), iso(this.now()));
    return { reportId: id, delivered: false, deliveryRequired: true };
  }

  markReportDelivery(body = {}) {
    if (!body.reportId || !["sent", "failed"].includes(body.status)) throw new Error("Invalid report delivery update");
    const now = iso(this.now());
    const result = this.db.prepare(`
      UPDATE reports SET delivery_status = ?, delivery_reference = ?, delivered_at = CASE WHEN ? = 'sent' THEN ? ELSE delivered_at END
      WHERE id = ?
    `).run(body.status, body.reference || null, body.status, now, body.reportId);
    if (!result.changes) throw new Error(`Unknown report ${body.reportId}`);
    return { reportId: body.reportId, delivered: body.status === "sent" };
  }

  incident(body = {}) {
    const id = randomUUID();
    this.db.prepare("INSERT INTO incidents(id, severity, title, details, created_at) VALUES(?, ?, ?, ?, ?)")
      .run(id, String(body.severity || "warning"), String(body.title || "Incidente del Organic Growth Engine"), String(body.details || "Sin detalles"), iso(this.now()));
    return { incidentId: id, delivered: false, deliveryRequired: true };
  }

  markIncidentDelivery(body = {}) {
    if (!body.incidentId || !["sent", "failed"].includes(body.status)) throw new Error("Invalid incident delivery update");
    const now = iso(this.now());
    const result = this.db.prepare(`
      UPDATE incidents SET delivery_status = ?, delivery_reference = ?, delivered_at = CASE WHEN ? = 'sent' THEN ? ELSE delivered_at END
      WHERE id = ?
    `).run(body.status, body.reference || null, body.status, now, body.incidentId);
    if (!result.changes) throw new Error(`Unknown incident ${body.incidentId}`);
    return { incidentId: body.incidentId, delivered: body.status === "sent" };
  }

  importLegacy({ status, snapshot = null, report = null } = {}) {
    if (!status?.state) throw new Error("Legacy import requires state");
    return this.#transaction(() => {
      const alreadyImported = this.db.prepare("SELECT value FROM metadata WHERE key = 'legacy_supabase_imported_at'").get();
      if (alreadyImported) return { imported: false, reason: "already_imported", importedAt: alreadyImported.value };
      const state = status.state;
      this.db.prepare(`
        UPDATE state SET timezone = ?, next_execution_at = ?, next_report_at = ?,
          execution_lease_run_id = NULL, execution_lease_expires_at = NULL,
          reporting_lease_run_id = NULL, reporting_lease_expires_at = NULL,
          last_execution_success_at = ?, last_report_success_at = ?, last_data_through_date = ?, updated_at = ?
        WHERE engine_key = 'ruka'
      `).run(
        state.timezone || timezone, state.next_execution_at, state.next_report_at,
        state.last_execution_success_at || null, state.last_report_success_at || null,
        state.last_data_through_date || null, iso(this.now()),
      );
      const insertRun = this.db.prepare(`
        INSERT OR IGNORE INTO runs(id, kind, trigger_source, status, started_at, finished_at, data_through_date, error_message)
        VALUES(?, ?, 'supabase_migration', ?, ?, ?, ?, ?)
      `);
      for (const run of status.runs || []) insertRun.run(run.id, run.kind, run.status, run.started_at, run.finished_at || null, run.data_through_date || null, run.error_message || null);
      const now = iso(this.now());
      const insertOpportunity = this.db.prepare(`
        INSERT OR IGNORE INTO opportunities(id, fingerprint, title, cluster, status, priority_score, target_url,
          approval_reason, evidence_json, payload_json, first_seen_at, last_seen_at, updated_at)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const row of status.opportunities || []) insertOpportunity.run(
        row.id || randomUUID(), row.fingerprint, row.title, row.cluster, row.status || "discovered", priorityScore(row),
        row.target_url || null, row.approval_reason || null, JSON.stringify(row.evidence || []), JSON.stringify(row), now, now, now,
      );
      const insertExperiment = this.db.prepare(`
        INSERT OR IGNORE INTO experiments(id, opportunity_id, run_id, title, status, evaluate_after, updated_at, payload_json)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
      `);
      for (const row of status.experiments || []) insertExperiment.run(
        row.id || randomUUID(), row.opportunity_id || null, row.run_id || null, row.title, row.status || "discovered",
        row.evaluate_after || null, now, JSON.stringify(row),
      );
      if (snapshot?.dataThroughDate) this.db.prepare(`
        INSERT OR IGNORE INTO snapshots(id, run_id, data_through_date, captured_at, property, payload_json)
        VALUES(?, NULL, ?, ?, ?, ?)
      `).run(randomUUID(), snapshot.dataThroughDate, snapshot.capturedAt || now, snapshot.property || "sc-domain:ruka.ai", JSON.stringify(snapshot));
      if (report?.dataThroughDate) this.db.prepare(`
        INSERT INTO reports(id, run_id, period_end, payload_json, delivery_status, created_at, delivered_at)
        VALUES(?, NULL, ?, ?, 'sent', ?, ?)
      `).run(randomUUID(), report.dataThroughDate, JSON.stringify(report), now, now);
      this.db.prepare("INSERT INTO metadata(key, value) VALUES('legacy_supabase_imported_at', ?)").run(now);
      return {
        imported: true,
        state: 1,
        runs: status.runs?.length || 0,
        opportunities: status.opportunities?.length || 0,
        experiments: status.experiments?.length || 0,
        snapshots: snapshot?.dataThroughDate ? 1 : 0,
        reports: report?.dataThroughDate ? 1 : 0,
      };
    });
  }

  integrityCheck() {
    const integrity = this.db.prepare("PRAGMA integrity_check").all().map((row) => row.integrity_check);
    const quick = this.db.prepare("PRAGMA quick_check").all().map((row) => row.quick_check);
    return { ok: integrity.every((value) => value === "ok") && quick.every((value) => value === "ok"), integrity, quick, path: this.databasePath };
  }

  async backup() {
    const directory = path.join(path.dirname(this.databasePath), "backups");
    mkdirSync(directory, { recursive: true, mode: 0o700 });
    const stamp = iso(this.now()).replace(/[:.]/g, "-");
    const destination = path.join(directory, `state-${stamp}-${randomUUID().slice(0, 8)}.sqlite`);
    await sqliteBackup(this.db, destination);
    chmodSync(destination, 0o600);
    const backups = readdirSync(directory).filter((name) => /^state-.*\.sqlite$/.test(name)).sort().reverse();
    for (const old of backups.slice(14)) unlinkSync(path.join(directory, old));
    return { path: destination, retained: Math.min(backups.length, 14) };
  }
}

export async function localEngineRequest(action, body = {}) {
  const engine = new LocalOrganicGrowthEngine();
  try {
    if (action === "status") return engine.status();
    if (action === "claim") return engine.claim(body);
    if (action === "complete") {
      const result = engine.complete(body);
      try { return { ...result, backup: await engine.backup() }; }
      catch (error) { return { ...result, backupWarning: error instanceof Error ? error.message : String(error) }; }
    }
    if (action === "snapshot") return engine.snapshot(body);
    if (action === "sync_opportunities") return engine.syncOpportunities(Array.isArray(body.rows) ? body.rows : []);
    if (action === "sync_product_signals") return engine.syncProductSignals(Array.isArray(body.rows) ? body.rows : []);
    if (action === "create_experiment") return engine.createExperiment(body);
    if (action === "update_experiments") return engine.updateExperiments(Array.isArray(body.updates) ? body.updates : []);
    if (action === "report") return engine.report(body);
    if (action === "report_delivery") return engine.markReportDelivery(body);
    if (action === "incident") return engine.incident(body);
    if (action === "incident_delivery") return engine.markIncidentDelivery(body);
    if (action === "import_legacy") return engine.importLegacy(body);
    if (action === "integrity") return engine.integrityCheck();
    if (action === "backup") return engine.backup();
    throw new Error(`Unknown local engine action: ${action}`);
  } finally {
    engine.close();
  }
}
