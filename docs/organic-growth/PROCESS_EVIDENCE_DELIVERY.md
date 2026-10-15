# Process evidence initiative — delivery ledger

Started 2026-10-15. Work in progress, not a release or an external validation.

## Latest human approvals and implementation state

The user explicitly approved commit/push/PR/merge/publication after QA, confirmed
the existing Ruka visual direction, and requested candidate lists and messages
for approval before any outreach. Earlier design/publication gates below are
historical and now resolved. No person has been contacted.

Implemented `/procesos/registrar-compras-toteat`, linked from the Toteat guide;
added missing-detail guidance to the existing SII page and presentation/unit
guidance to the existing cost article. No duplicate blog URL was created. The
new route is included in routing, server prerender, discovery and Vercel rewrites.

Captured the public demo's receipt-quantity UI on 2026-10-15. The cropped asset
contains two illustrative product rows, no account/contact details. Its caption
identifies a demo, not a real client transaction or a Toteat-write test. The public
test-method TXT states exact source revision, test boundary and pending work.

### UI review after implementation

1. Desktop 1280px: inspected heading, scope/limit prominence and action hierarchy.
   Retained the restrained editorial layout; no artificial product simulation.
2. Sharing and navigation: clicked copy and checked the accessible confirmation;
   clicked the decision-sheet anchor and verified its final 112px top offset.
   Added clipboard-rejection fallback tests and a source-method link after review.
3. Mobile 390px: inspected the full introduction and actions; document width equals
   viewport width, no broken images. Full-size image remains available separately.
4. PDF: replaced the unreliable native-print action with a static download generated
   from the same prerendered content. Inspected all five rendered pages; embedded
   fonts after discovering substitution in the first render, made the screenshot
   clickable, and kept eight genuinely blank writing areas on the final page.
   Clicked the download in the browser and verified its SHA-256 matches the asset.
   Native browser printing is not claimed as verified; the downloadable PDF is.
5. Cross-page review: found direct article fragments did not reliably scroll after
   React mounted. Fixed only the blog behavior, with three regression tests. On
   mobile the target now starts at 112px below the top; width is 390px without
   horizontal overflow. Added PDF freshness/source/build hash validation to prevent
   publishing an outdated copy. Production review remains pending.

Current tests: 143 frontend tests, 38 engine tests (including artifact backup and
snapshot recovery), 1,587 SEO assertions, 168 discovery checks; production build
generates 32 routes and 30 Markdown documents. Later edits require a final rerun.

The user excluded subdomain deindexation from this work. No Cloudflare, DNS,
origin configuration or Search Console removal was changed. Local rollout notes
and the draft verifier were removed; they are not part of this delivery.

## Five deliverables and acceptance gates

| Deliverable | Must demonstrate | Current state |
| --- | --- | --- |
| Process dossier | Clear scope, inputs, responsibilities, actual evidence, limitations, printable/shareable version; comprehension by real evaluators | Implemented web and five-page PDF, editorial and UI reviews complete; production and real evaluators pending |
| Adverse-case evidence | Reproducible inputs, observed result, exact version and evidence level; no simulated result presented as real external operation | Isolated actual-service tests pass; external-system and operator evaluation pending |
| Situation-led content | Two distinct buyer problems, useful manual answer, verified support, no duplicate search intent | Two researched additions implemented in existing pages, reviewed on desktop/mobile; publication and user feedback pending |
| Collaborator pilot | Qualification kit, approved outreach, three real conversations and one permitted eligible case | Private kit with five methodological reviews, three researched candidates and draft invitation; no outreach, participants or conversations |
| Evidence-driven engine | Useful private output can be persisted without a fake deployment; safe retry, history, freshness, reporting | Implemented and tested locally; runtime rollout and execution still pending |

## Engine: initial build, then critical iterations

| Pass | Critique | Change | Verification |
| --- | --- | --- | --- |
| Initial | Publishing history cannot represent non-public progress. | Separate private question records from deployed experiments. | Basic persistence and rejection of missing evidence tests. |
| 1 | A question could be labeled answered; future dates and unapproved participant claims were accepted. | Pending-only owner questions, privacy attestation, observation timestamps, permission reference for human/external evidence. | Rejection tests and valid participant-record shape. Permissions remain a human responsibility, not automatically verified by a string. |
| 2 | Updating a finding erased history; retries could inflate activity. | Transactional append-only revisions and content-hash idempotency. | Replay produces no revision; contradiction preserves earlier finding. |
| 3 | A manifest could point to a nonexistent or out-of-scope artifact. | Local file containment, realpath checks, size checks and SHA-256 verification. | Missing file, escaping symlink and changed artifact fail. |
| 4 | The storage helper passing did not prove the cycle could use it. | Optional private `buyerProgress` integrated into the actual manifest CLI, incompatible with simultaneous public deployment/experiment changes. | CLI validation makes no database write; registration and replay tested with isolated SQLite; no deployed experiment created. |
| 5 | Rewriting a summary could make old evidence seem fresh; reporting could imply commercial success. | Source-age review reminders and separate period-limited question counts. | Old observations remain review-needed and are excluded from current supported count; outside-period updates excluded. |
| Follow-up | A worktree can disappear after a cycle. | Content-addressed private artifact archive beside SQLite. | CLI test verifies bytes, `0600` mode, and survival after the working artifact is removed. |
| Runtime audit | Repository policy can be overridden by the saved schedule prompt. | Document the actual `changed=false` prohibition and dependency-complete validator snapshot needed for rollout. | Read all five local schedule configurations; all ACTIVE with `gpt-6-astra-camilo`; no live configuration or database mutation. Runtime enablement remains pending, not assumed from unit tests. |

These are engineering reviews of one deliverable. They do not count as five completed iterations of the other four deliverables, user testing, production QA or an entire engine rollout.

## Dossier: initial draft, then five editorial reviews

Source: `PROCESS_DOSSIER_DRAFT.md`. These revisions improve the draft but do not replace the still-pending visual, print and participant validation.

| Pass | Before | After | Why / inspection |
| --- | --- | --- | --- |
| 1 | “La factura ya llegó” could blur document arrival and physical receipt. | The opening explicitly distinguishes having the invoice from receiving goods. | Re-read all receipt references; no document is offered as proof of delivery. |
| 2 | “Blocks an incompatible unit” could imply full detection from original input. | State that the service receives an already-classified resolution; separate internal test, demo and external validation. | Cross-check against actual harness boundary and evidence report. |
| 3 | The evaluation assumed automation was desirable. | Add a manual-baseline decision, including when a documented routine may suffice. | No fabricated saving, volume threshold or mandatory software recommendation. |
| 4 | Retry limitation lacked an operational implication. | Do not infer non-delivery from timeout; inspect before retry and stop if indeterminate. | Match observed partial-result semantics; no rollback/idempotency guarantee. |
| 5 | Long material was hard to forward; default One CTA implied custom scope. | Add a self-contained internal summary with pending evidence and no implied authorization; use existing registration path. | Summary preserves uncertainty even when copied separately; no live funnel changed. |

## Additional material prepared

- `PROCESS_ACCEPTANCE_PROTOCOL.md`: safe test authorization, fixture, six minimum scenarios, per-attempt evidence and stop criteria. External execution remains pending.
- `SITUATION_CONTENT_DRAFTS.md`: missing invoice detail → existing SII integration guide; ambiguous units → existing cost article. Primary SII and Toteat sources inspected; no invented search volume, new keyword-page quota or duplicate URL.
- Private `PILOT_KIT.md` under the dated audit directory: public-source candidate rationale, disqualifiers, draft invitation, neutral interview, responsibilities, consent and five-reader comprehension protocol. Three names on a research list are not three qualified participants. No outreach occurred.

## Acceptance protocol: five sequential reviews after the initial draft

These are protocol reviews, not external test executions or participant feedback.

| Pass | Critique | Change | Verification |
| --- | --- | --- | --- |
| 1 | Service success might be mistaken for complete line coverage. | Added a nonblocking-exclusion scenario and explicit acceptance condition; corrected the dossier too. | New test against the actual service: 10 tests / 57 assertions pass, seed 23720. Sent IDs exclude the unresolved line; success, warning and summary are checked separately. |
| 2 | “Correct quantities/dates” had no fixed comparison record. | Added pre-execution expectations per line/local, both dates, split conservation and separately agreed financial scope. | Cross-checked the service's two date fields; table cannot be treated as proof the destination interprets them correctly. No blank expectations allowed. |
| 3 | Absence in a UI search could be mistaken for absence of writes. | Added account/local/filter/access checks, agreed observation window and indeterminate outcome for insufficient evidence. | Re-read blocking/timeout criteria: no message or failed lookup alone permits a no-write claim. |
| 4 | Recreating or editing the invoice could invalidate a retry test. | Freeze identity/configuration between attempts; stop for changed mappings or unknown prior effects. | Cross-checked recovery code's group/line matching; protocol does not extend the isolated unchanged-fixture result to concurrent edits. |
| 5 | Evidence existed without a reviewable acceptance handoff. | Added scope, original expectations, per-case evidence, unresolved differences, explicit decision and separate publication permission. | Re-read closure against all seven scenarios; unexecuted/indeterminate cases stay visible and no author signature is fabricated. |

The dossier now states that nonblocking exclusions can coexist with a successful service result. This is a bounded observation, not a claim about live UI or the entire product.

## Situation content: five sequential editorial reviews

| Pass | Before | After | Check performed |
| --- | --- | --- | --- |
| 1 | Page-level placement could still duplicate existing content. | Exact existing SII entry and cost-article insertion identified; preserve URLs, intent and existing calculation. | Read `integrationGuides.json` and the complete cost article; source material already covers generic integration/method questions. |
| 2 | Diagnosis said what was missing but not how to request or record it. | Add safe request wording, responsible-person column and backed-equivalence sentence. | Re-read both paths: an unresolved source/unit remains pending, not implicitly ready to send. |
| 3 | “Should understand” had no concrete observation criteria. | Add fictitious comprehension tasks and facilitator criteria, with unaided vs assisted answers separated. | Arithmetic checked (2 × 4 × 2 = 16); quantities and dimensions do not infer product capability. No participant result claimed. |
| 4 | Some phrases were abstract or sounded like policy copy. | Concrete box-weight heading, missing-backup action and the “2 kilos vs two boxes” error. | Read revised paragraphs in context; source, receipt and destination remain distinct. |
| 5 | Internal research/rubric text could leak into public copy; repeated caveat added density. | Remove repeated receipt sentence; specify public-only copy extraction, semantic tables, unchanged intent and actual publication/QA gates. | Review handoff against both target pages; no new page, fake freshness date or duplicated CTA proposed. |

## Collaborator kit: five sequential methodological reviews

The kit remains private in the dated audit directory. These are preparation iterations, not five pilot rounds.

| Pass | Before | After | Check performed |
| --- | --- | --- | --- |
| 1 | Third candidate's page was only partly inspected; candidates looked equivalent. | Complete HENTECH page read; distinguish advisor, tool-owning consultant and implementer, with overlap risks. | Public page supports a systems/restaurant offering, not Toteat expertise or partnership. No third-party promises imported. |
| 2 | Interview presumed manual pain. | Ask the full recent process, what already works automatically and grounds for rejecting a trial. | No question requires a positive problem report; recollection/estimate/interviewer inference separated. |
| 3 | Group reading and prior familiarity could inflate comprehension. | Individual first readings, relationship/version history, assistance labels and critical-misunderstanding rule. | No average score can erase a false guarantee; repeat readers distinguished from new readers. |
| 4 | Privacy instructions lacked custody and handling of unexpected customer data. | Require custody/access/retention agreement; stop capture, request anonymized description and minimize engine record. | No raw interview, client document or spontaneous screenshot automatically enters repo/engine/public report. |
| 5 | Preparation could be presented as an active channel. | Explicit handoff, separate contact/account permissions, negative/inconclusive outcome and zero-activity status. | 3 researched candidates, 0 contacts, 0 participants, 0 interviews, 0 authorized cases for this initiative. |

## Historical continuation gate audit (before the approvals above)

The same unanswered design/publication and external-participation gates have persisted across at least three consecutive goal turns. Independent preparation continued during those turns: runtime conflict found, actual-service exclusion test added, protocol and editorial/pilot materials revised. There is no live deployment, test session or participant conversation to poll. Automatic goal continuations are not answers or approvals.

Further substantive implementation now needs the confirmed task-specific visual brief required by Impeccable; publication/runtime rollout needs authorization; external acceptance/pilot needs an authorized account and participants. Additional internal prose edits do not substitute for these gates. Keep the full five-part objective incomplete until they are resolved.

## Historical verification before UI implementation

- Production build passes: 31 prerendered routes and 29 public Markdown documents generated. Existing bundle-size and outdated-browser-data warnings remain.
- Changed engine JavaScript files pass ESLint.
- All 38 Node engine tests pass; all 136 frontend tests pass. SEO: 1,552 assertions. Discovery: 164 checks. Existing tracking contract: 31 calls unchanged.
- Isolated cycle/storage tests run without touching the live scheduler database.
- Product repository remains unchanged; isolated service tests load its actual classes, with fictitious in-memory data, controlled HTTP responses and socket guards. They are not Rails UI, database or live Toteat tests.
- No home, pricing, navigation, funnel, tracking, customer data or CSV conciliator changes.
- No commit, push, merge, publication, external outreach or new automation.

## Visual brief — subsequently approved and implemented

- Audience: operations/finance people evaluating one process and sharing it with an internal approver, usually on a workday desktop and sometimes on mobile. Bright, calm reading surface.
- Direction: existing Ruka home/product visual system; white/cool-neutral backgrounds, existing blue and typography. Restrained color. Reference the current home and product purchase-registration page, not a new design language. Design dials: variance 5, motion 2, density 4.
- Structure: outcome and scope first; real evidence alongside its interpretation; responsibilities and limits; a practical acceptance sheet. A generous editorial document, not a dashboard or repeated card wall.
- Interactions: accessible source links, copy/share and printable view; no mandatory form, decorative motion or fake interactive product. Mobile and print are first-class states.
- Fidelity: production-ready. Product screenshots only from safe authorized demo/test data, clearly labeled. No generated imagery presented as product evidence. The user approved this direction; the current implementation is described above.

## Open gates

1. Complete production publication/QA and saved runtime-prompt rollout under the existing authorization.
2. Obtain participants and approved outreach for real comprehension/collaborator pilots. The user requested a candidate/message shortlist for approval; no outreach is authorized yet.
3. Obtain a safe, authorized destination account and acceptance owner for external E2E verification. Until then, keep published claims at the demonstrated level; do not call the whole five-part goal complete.
