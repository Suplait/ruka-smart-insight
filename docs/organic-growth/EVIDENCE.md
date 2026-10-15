# Reproducible evidence for the organic engine

## Storage and boundaries

Persistent evidence is private, outside Git and outside the website: `~/.codex/ruka-organic-growth/evidence/`. `ORGANIC_GROWTH_DB_PATH` places evidence beside an isolated database; `ORGANIC_EVIDENCE_PATH` overrides that location for tests or an explicitly managed environment. Do not point either at `public` or `dist`.

AI observations are immutable JSON files published atomically with mode `0600`, in directories created with mode `0700`. Reusing an observation ID fails instead of overwriting history. IndexNow receipts are atomically replaced. A malformed evidence file fails visibly; it is not silently discarded to improve reported coverage. The existing SQLite backup does **not** include this directory: copy it with the private local engine backups when migrating machines. Never commit raw response history or commercial source snapshots.

## Commercial source

`npm run organic:commercial` uses the existing authenticated Supabase CLI session (or an explicitly provided read credential), reads only the verified landing project, removes explicit test domains and saves a minimized private snapshot. No customer email is retained in that snapshot. It never inserts, updates, deploys, migrates or invokes a lead function.

`npm run organic:prepare` collects this source and adds summarized evidence to the execution context. A failed or >36-hour-old source is unavailable, never zero. Legacy leads without the new attribution record are a coverage gap. Capture grain is a distinct persisted submission, not a person/company; first-touch page/channel are browser-observed, not causal attribution. Ruka One meeting coverage is explicitly unavailable until its independent source is connected.

CRM evidence, when available, must come from verified task records in the existing Ruka CRM list, with retrieval timestamps and exact source statuses. It must not be inferred from meeting names, email content or public prices. Qualification, current proposal state, customer status and revenue are different measures. No verified billing source is connected, so closed MRR stays unknown.

### Bounded CRM read/import

After collecting the lead source, run `npm run organic:crm -- requests`. This returns the exact distinct `clickup_task_id` values in that source snapshot, not emails or company names. Verify list `901301203866` (CRM empresas, Ruka.ai) through the connected read-only ClickUp tools. Read only those task IDs; do not scan the entire CRM or create/update tasks. Keep a private JSON with `schemaVersion: 1`, `source: "clickup-read-only"`, `listId`, `sourceCapturedAt` (from requests), `capturedAt`, `tasks` and `unavailableTaskIds`. Each observed task needs `id`, `listId`, exact `status`, `observedAt` and `sourceUrl: "https://app.clickup.com/t/<id>"`. A task outside the verified list or inaccessible must be recorded as unavailable, not assigned a guessed stage. No linked IDs means an empty cohort, not zero sales for the company.

Import with `npm run organic:crm -- import /absolute/private/snapshot.json`. The importer rejects stale, unrelated, duplicate or unaccounted-for records and discards personal fields. Evidence persists outside disposable worktrees. Re-run `npm run organic:prepare` to refresh the context; it reads the imported CRM cache but does not itself call ClickUp. If the connector is unavailable, continue with explicit partial/unknown CRM coverage. Each task observation expires after seven days, even if the outer snapshot is newer. Current-state counts only cover observed linked tasks; page cohorts can share a task and must not be summed as unique customers.

## IA observatory

The question set is frozen in `ai-questions.json`. Six discovery questions contain no Ruka brand hint; two branded questions test identity and product accuracy. Version changes start a new cohort. Do not modify prompts based on previous answers to improve the score.

1. Run `npm run organic:ai -- questions` and select the exact question/version.
2. Open a fresh unpersonalized session with no prior conversation, memory, plugins or custom instructions. Verify this in the UI. Record the provider, surface, exposed model label (or `unknown` when undisclosed) and session mode. Do not invent the model behind an effort label.
3. Submit only the frozen public question. Wait for completion, then capture the **entire answer**, its visible citation URLs and retrieval time. Exclude sidebar history and unrelated account information. Save the evidence before closing a temporary chat.
4. Review mention, citation and recommendation independently. Recommendation requires an exact quote from the response. Record whether that quote recommends a product or a resource (such as a guide) in the capture notes: the aggregate includes both and must never be presented as product preference. Accuracy stays `not_evaluated` unless a reviewer checks the relevant claims against authoritative current sources and records those sources and notes.
5. Import a private JSON file with `npm run organic:ai -- import /absolute/path/observation.json`. The importer validates the prompt and preserves an answer hash. Each ID is unique and immutable.
6. Complete all eight questions for a baseline on the same provider/surface/model/mode. Record actual blocked/no-answer runs with their reason rather than treating them as negative recommendations. Do not compare unpersonalized discovery samples with branded or personalized prompts.

Required observation fields: `id`, `questionId`, `questionVersion`, `prompt`, `capturedAt`, `provider`, `surface`, `model`, `sessionMode`, `state`. Completed runs also need `answer`, `citations`, `citationCoverage`, `recommendation` and `accuracy`. Use `citationCoverage: complete` only after inspecting every citation group; `inline_links_only` means collapsed citation popovers remain uninspected. A verified Ruka link proves a citation either way; without that link, incomplete capture yields unknown, never a confirmed absence. A positive recommendation needs `recommendationQuote`; reviewed accuracy needs `accuracyNotes` and `verifiedAgainst`. Blocked/no-answer runs require `reason`. Preserve the visible source conversation URL and capture method as additional evidence metadata when available.

At monthly strategy review, collect one complete fresh set per accessible provider; weekly measurement can inspect the last set without paying for redundant queries. A targeted rerun after a relevant shipped fix must remain labeled as such, not substituted for a complete baseline. Evidence older than 30 days is reported stale. Reports use the latest observation per question/provider/surface/model/mode, including unfavorable results. These are fixed-query observations, **not** recommendation market share, statistical estimates or proof that an edit caused a change.

## Publication notifications

IndexNow validates live production before notifying a search engine. HTTP 200 means accepted; 202 means ownership verification pending; neither means indexed or ranked. Recheck search-engine reporting independently. A dry run makes no requests. No preview, private URL, query-string identifier or unlisted route may be submitted.
