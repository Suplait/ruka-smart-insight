import { test } from "node:test";
import assert from "node:assert/strict";
import { contentDigest, publicationIssues, reviewedContentIssues } from "./validate-publications.mjs";

const record = { path: "/comparar/ruka-vs-tupana", kind: "comparison", intent: "Compare", capabilities: ["purchases"], owner: "Ruka", author: "Camilo Silva", reviewer: "Review", reviewedAt: "2026-10-26", reviewWithinDays: 30, status: "approved", sources: ["https://www.tupana.ai/"] };
const options = { now: new Date("2026-10-26T12:00:00Z"), indexed: true };
test("approved metadata passes while published drafts fail", () => {
  assert.deepEqual(publicationIssues(record, options), []);
  assert.ok(publicationIssues({ ...record, status: "draft" }, options).includes("unapproved content is indexed"));
});
test("expiry and future/invalid dates fail closed", () => {
  assert.ok(publicationIssues({ ...record, reviewedAt: "2026-09-01" }, options).includes("review has expired"));
  assert.ok(publicationIssues({ ...record, reviewedAt: "2026-10-27" }, options).includes("review date is in the future"));
  assert.ok(publicationIssues({ ...record, reviewedAt: "2026-02-30" }, options).includes("invalid review date"));
});
test("tax and supplier pages need their own evidence, not just editorial approval", () => {
  assert.ok(publicationIssues({ ...record, kind: "tax" }, options).includes("tax content requires dated official-source verification and exact facts"));
  assert.ok(publicationIssues({ ...record, kind: "supplier" }, options).includes("supplier identity and publication basis required"));
});
test("tax verification must match the review date and identify substantive facts", () => {
  const tax = { ...record, kind: "tax", sources: ["https://www.sii.cl/destacados/f29/clasificacompras.htm"], taxReview: { method: "official-source-verification", checkedAt: record.reviewedAt, scope: "Classification", verifiedFacts: ["La clasificación operativa no determina por sí sola el tratamiento tributario."] } };
  assert.deepEqual(publicationIssues(tax, options), []);
  assert.ok(publicationIssues({ ...tax, taxReview: { ...tax.taxReview, checkedAt: "2027-01-01" } }, options).length);
  assert.ok(publicationIssues({ ...tax, taxReview: { ...tax.taxReview, verifiedFacts: [""] } }, options).length);
  assert.ok(publicationIssues({ ...tax, sources: ["https://sii.cl.example.com/fake"] }, options).length);
});
test("unsafe sources, filesystem paths and long competitor review windows fail", () => {
  assert.ok(publicationIssues({ ...record, path: "/../secret", sources: ["https://user:pass@host.example"] }, options).length >= 2);
  assert.ok(publicationIssues({ ...record, reviewWithinDays: 365 }, options).includes("comparison review window exceeds 30 days"));
});

test("a changed claim, link or source invalidates the previous content review", () => {
  const content = { reviewedAt: record.reviewedAt, answer: "Example reviewed answer", sections: [{ paragraphs: ["Exact reviewed claim"] }], sources: [{ url: "https://www.sii.cl/example" }], related: { href: "/recursos" } };
  const reviewed = { ...record, sources: content.sources.map(source => source.url), reviewedContentSha256: contentDigest(content), taxReview: { verifiedFacts: ["Exact reviewed claim"] } };
  assert.deepEqual(reviewedContentIssues(reviewed, content), []);
  assert.deepEqual(contentDigest(JSON.parse(JSON.stringify(content, null, 2))), contentDigest(content));
  for (const change of [{ answer: "A new unreviewed claim" }, { related: { href: "/wrong" } }, { sources: [{ url: "https://example.com" }] }]) {
    assert.ok(reviewedContentIssues(reviewed, { ...content, ...change }).includes("content changed since its review"));
  }
  assert.ok(reviewedContentIssues(reviewed, undefined).includes("reviewed content is missing"));
  assert.ok(reviewedContentIssues({ ...reviewed, taxReview: { verifiedFacts: ["Absent claim"] } }, content).includes("verified fact is not present in reviewed content"));
});
