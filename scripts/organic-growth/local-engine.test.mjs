import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { LocalOrganicGrowthEngine, nextReportAt } from "./local-engine.mjs";

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

test("claim is atomic, jobs are independent and success advances execution five days", () => {
  const subject = fixture();
  try {
    const execution = subject.engine.claim({ kind: "execution", force: true });
    assert.equal(execution.claimed, true);
    assert.deepEqual(subject.engine.claim({ kind: "execution", force: true }).reason, "active_lease");

    const reporting = subject.engine.claim({ kind: "reporting", force: true });
    assert.equal(reporting.claimed, true);
    subject.engine.complete({ runId: reporting.run_id, success: true });

    const completed = subject.engine.complete({ runId: execution.run_id, success: true, dataThroughDate: "2026-10-06" });
    assert.equal(completed.next_due_at, "2026-10-13T12:00:00.000Z");
    assert.equal(subject.engine.claim({ kind: "execution" }).reason, "not_due");

    subject.setNow("2026-10-13T12:00:01.000Z");
    assert.equal(subject.engine.claim({ kind: "execution" }).claimed, true);
  } finally { subject.close(); }
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
