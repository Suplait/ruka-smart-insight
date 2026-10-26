import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { purchaseLinePages, purchaseBookPages, requestPurchaseData } from "../../public/api/examples/ruka-purchases.mjs";
import { verifyRukaWebhook } from "../../public/api/examples/verify-ruka-webhook.mjs";

const token = "example-key-not-a-real-credential";
const collect = async iterator => { const rows = []; for await (const page of iterator) rows.push(...page.data); return rows; };
const response = (data, meta) => new Response(JSON.stringify({ data, meta }), { headers: { "content-type": "application/json" } });

test("line pages retain decimal strings, nulls and notes; they never execute redirects", async () => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push(url.href);
    assert.equal(options.redirect, "error");
    assert.equal(options.headers.Authorization, `Bearer ${token}`);
    return response([{ id: calls.length, amount: "1000.123456", classification: null, dte_type: 61 }], { page: calls.length, total_pages: 2 });
  };
  const rows = await collect(purchaseLinePages({ issued_from: "2026-10-01", issued_to: "2026-10-26", include_credit_notes: true }, { token, fetchImpl }));
  assert.equal(rows.length, 2);
  assert.equal(rows[0].amount, "1000.123456");
  assert.equal(rows[0].classification, null);
  assert.ok(calls[1].includes("page=2"));
  assert.ok(calls.every(url => url.includes("include_credit_notes=true")));
});

test("book uses next_after_id, preserves filters and ends on null", async () => {
  const calls = [];
  const fetchImpl = async url => { calls.push(url); return response([{ id: calls.length * 9 }], { next_after_id: calls.length === 1 ? 9 : null }); };
  const rows = await collect(purchaseBookPages({ start_date: "2026-10-01", end_date: "2026-10-26", date_basis: "updated" }, { token, fetchImpl }));
  assert.equal(rows.length, 2);
  assert.equal(calls[0].searchParams.has("after_id"), false);
  assert.equal(calls[1].searchParams.get("after_id"), "9");
  assert.equal(calls[1].searchParams.get("date_basis"), "updated");
});

test("unexpected shapes, repeated cursor, failed requests and missing access stop the run", async () => {
  await assert.rejects(requestPurchaseData("https://other.example", {}, { token }), /Unsupported/);
  await assert.rejects(requestPurchaseData("/api/v1/reports/purchase_book", {}, {}), /required/);
  await assert.rejects(collect(purchaseBookPages({}, { token, fetchImpl: async () => response([], { next_after_id: 1 }) })), /repeated/);
  await assert.rejects(collect(purchaseLinePages({}, { token, fetchImpl: async () => response([], { page: 9, total_pages: 9 }) })), /metadata/);
  await assert.rejects(collect(purchaseLinePages({}, { token, fetchImpl: async () => new Response("{}") })), /shape/);
  for (const status of [401, 403, 422, 429, 503]) {
    await assert.rejects(requestPurchaseData("/api/v1/reports/purchase_book", {}, { token, fetchImpl: async () => new Response("", { status, headers: { "retry-after": "60" } }) }), error => error.status === status && error.retryAfter === "60");
  }
});

test("HMAC uses timestamp dot raw bytes; rejects tampering, stale requests and malformed signatures", () => {
  const secret = "synthetic-test-secret";
  const rawBody = Buffer.from('{ "id": "event-example", "data": {"name":"Piñón"} }');
  const timestamp = "1793040000";
  const signature = `sha256=${createHmac("sha256", secret).update(`${timestamp}.`).update(rawBody).digest("hex")}`;
  const input = { rawBody, timestamp, signature, secret, nowSeconds: Number(timestamp) };
  assert.equal(verifyRukaWebhook(input), true);
  assert.equal(verifyRukaWebhook({ ...input, rawBody: Buffer.from(JSON.stringify(JSON.parse(rawBody))) }), false);
  assert.equal(verifyRukaWebhook({ ...input, secret: "wrong" }), false);
  assert.equal(verifyRukaWebhook({ ...input, nowSeconds: Number(timestamp) + 301 }), false);
  assert.equal(verifyRukaWebhook({ ...input, nowSeconds: Number(timestamp) - 301 }), false);
  for (const bad of [null, "", "sha256=0", "x".repeat(80)]) assert.equal(verifyRukaWebhook({ ...input, signature: bad }), false);
  assert.equal(verifyRukaWebhook({ ...input, timestamp: "NaN" }), false);
});
