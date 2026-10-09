import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import {
  LocalOrganicGrowthEngine,
  nextDailyMonitoringAt,
  nextExecutionAt,
  nextMonthlyStrategyAt,
  nextReportAt,
  nextWeeklyMeasurementAt,
} from "./local-engine.mjs";

function fixture() {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ruka-organic-growth-"));
  let current = new Date("2026-10-08T12:00:00.000Z");
  const engine = new LocalOrganicGrowthEngine(path.join(directory, "state.sqlite"), { now: () => new Date(current) });
  return {
    engine,
    setNow(value) { current = new Date(value); },
    close() { engine.close(); rmSync(directory, { recursive: true, force: true }); },
  };
}

test("next report uses 09:00 America/Santiago on the 1st and 15th", () => {
  assert.equal(nextReportAt(new Date("2026-10-08T12:00:00Z")).toISOString(), "2026-10-15T12:00:00.000Z");
  assert.equal(nextReportAt(new Date("2026-10-15T13:00:00Z")).toISOString(), "2026-11-01T12:00:00.000Z");
});

test("weekly measurement and monthly strategy use their Santiago cadences", () => {
  assert.equal(nextWeeklyMeasurementAt(new Date("2026-10-08T12:00:00Z")).toISOString(), "2026-10-12T13:00:00.000Z");
  assert.equal(nextWeeklyMeasurementAt(new Date("2026-10-12T14:00:00Z")).toISOString(), "2026-10-19T13:00:00.000Z");
  assert.equal(nextMonthlyStrategyAt(new Date("2026-10-08T12:00:00Z")).toISOString(), "2026-11-01T14:00:00.000Z");
});

test("daily monitoring and three-day execution stay anchored to their Santiago cron times", () => {
  assert.equal(nextDailyMonitoringAt(new Date("2026-10-08T12:00:00Z")).toISOString(), "2026-10-09T11:30:00.000Z");
  assert.equal(nextExecutionAt(new Date("2026-10-08T12:00:00Z")).toISOString(), "2026-10-11T20:30:00.000Z");
});

test("claim is atomic, jobs are independent and success advances execution three days", () => {
  const subject = fixture();
  try {
    const execution = subject.engine.claim({ kind: "execution", force: true });
    assert.equal(execution.claimed, true);
    assert.deepEqual(subject.engine.claim({ kind: "execution", force: true }).reason, "active_lease");

    const reporting = subject.engine.claim({ kind: "reporting", force: true });
    assert.equal(reporting.claimed, true);
    subject.engine.complete({ runId: reporting.run_id, success: true });

    const completed = subject.engine.complete({ runId: execution.run_id, success: true, dataThroughDate: "2026-10-06" });
    assert.equal(completed.next_due_at, "2026-10-11T20:30:00.000Z");
    assert.equal(subject.engine.claim({ kind: "execution" }).reason, "not_due");

    subject.setNow("2026-10-11T20:30:01.000Z");
    assert.equal(subject.engine.claim({ kind: "execution" }).claimed, true);
  } finally { subject.close(); }
});

test("monitoring, measurement and strategy have independent leases", () => {
  const subject = fixture();
  try {
    const monitoring = subject.engine.claim({ kind: "monitoring", force: true });
    const measurement = subject.engine.claim({ kind: "measurement", force: true });
    const strategy = subject.engine.claim({ kind: "strategy", force: true });
    assert.equal(monitoring.claimed, true);
    assert.equal(measurement.claimed, true);
    assert.equal(strategy.claimed, true);
    assert.equal(subject.engine.claim({ kind: "monitoring", force: true }).reason, "active_lease");

    assert.equal(subject.engine.complete({ runId: monitoring.run_id, success: true }).next_due_at, "2026-10-09T11:30:00.000Z");
    assert.equal(subject.engine.complete({ runId: measurement.run_id, success: true }).next_due_at, "2026-10-12T13:00:00.000Z");
    assert.equal(subject.engine.complete({ runId: strategy.run_id, success: true }).next_due_at, "2026-11-01T14:00:00.000Z");
  } finally { subject.close(); }
});

test("version one databases migrate without losing history and adopt the three-day execution cadence", () => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "ruka-organic-growth-v1-"));
  const databasePath = path.join(directory, "state.sqlite");
  const legacy = new DatabaseSync(databasePath);
  legacy.exec(`
    CREATE TABLE state (
      engine_key TEXT PRIMARY KEY,
      timezone TEXT NOT NULL,
      next_execution_at TEXT NOT NULL,
      next_report_at TEXT NOT NULL,
      execution_lease_run_id TEXT,
      execution_lease_expires_at TEXT,
      reporting_lease_run_id TEXT,
      reporting_lease_expires_at TEXT,
      last_execution_success_at TEXT,
      last_report_success_at TEXT,
      last_data_through_date TEXT,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE runs (
      id TEXT PRIMARY KEY,
      kind TEXT NOT NULL CHECK (kind IN ('execution', 'reporting')),
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
    INSERT INTO state VALUES (
      'ruka', 'America/Santiago', '2026-10-13T20:21:53.429Z', '2026-10-15T12:00:00.000Z',
      NULL, NULL, NULL, NULL, '2026-10-08T20:21:53.429Z', NULL, '2026-10-06', '2026-10-08T20:21:53.429Z'
    );
    INSERT INTO runs(id, kind, trigger_source, status, started_at, finished_at)
    VALUES('legacy-run', 'execution', 'migration-test', 'succeeded', '2026-10-08T20:00:00.000Z', '2026-10-08T20:21:53.429Z');
  `);
  legacy.close();

  const engine = new LocalOrganicGrowthEngine(databasePath, { now: () => new Date("2026-10-09T00:00:00.000Z") });
  try {
    const status = engine.status();
    assert.equal(status.state.next_execution_at, "2026-10-11T20:30:00.000Z");
    assert.equal(status.runs.some((run) => run.id === "legacy-run"), true);
    assert.equal(engine.claim({ kind: "monitoring", force: true }).claimed, true);
  } finally {
    engine.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("expired leases are failed and safely reclaimed", () => {
  const subject = fixture();
  try {
    const first = subject.engine.claim({ kind: "execution", force: true });
    subject.setNow("2026-10-08T14:00:01.000Z");
    const second = subject.engine.claim({ kind: "execution", force: true });
    assert.equal(second.claimed, true);
    assert.notEqual(second.run_id, first.run_id);
    const expired = subject.engine.status().runs.find((run) => run.id === first.run_id);
    assert.equal(expired.status, "failed");
    assert.match(expired.error_message, /lease expired/i);
  } finally { subject.close(); }
});

test("report delivery and incidents are persisted locally", () => {
  const subject = fixture();
  try {
    const report = subject.engine.report({ periodEnd: "2026-10-06", payload: { executiveSummary: [] } });
    assert.equal(report.deliveryRequired, true);
    assert.equal(subject.engine.markReportDelivery({ reportId: report.reportId, status: "sent", reference: "slack:test" }).delivered, true);

    const incident = subject.engine.incident({ severity: "warning", title: "Test", details: "Controlled" });
    assert.equal(incident.deliveryRequired, true);
    assert.equal(subject.engine.markIncidentDelivery({ incidentId: incident.incidentId, status: "sent", reference: "slack:test" }).delivered, true);
    assert.equal(subject.engine.integrityCheck().ok, true);
  } finally { subject.close(); }
});
