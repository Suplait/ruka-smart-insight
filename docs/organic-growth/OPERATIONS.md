# Organic Growth Engine Operations

## Architecture

- **Codex Automations** provides the visible local scheduler and the agentic execution environment. GitHub Actions is not used by this engine.
- One hourly Codex coordinator reads `job-control.mjs dispatch`; the five business cadences live only in SQLite. Former individual schedules are paused, and their procedures are versioned under `jobs/`. Follow `COORDINATOR.md`.
- Early wakeups never consume an obligation. A later hourly poll retries due work. Offline periods remain due until Codex runs again.
- **Local SQLite** stores scheduler state, leases, Search Console snapshots, opportunities, experiments, product signals, reports and run logs at `~/.codex/ruka-organic-growth/state.sqlite`.
- `LocalOrganicGrowthEngine.claim()` uses an immediate SQLite transaction to decide atomically whether work is due and prevent concurrent mutation.
- The daily watchdog observes availability, indexation, data freshness and new opportunities without forcing a deployment.
- A successful build cycle advances the next due time by three real days. Failures retry after six hours.
- Experiment measurement runs weekly, strategic prioritization runs monthly, and reporting remains quincenal.
- Monitoring, execution, measurement, strategy and reporting each have an independent lease and next-due timestamp. A failure in one cadence cannot block another. Expired two-hour leases recover automatically.
- The **Codex execution automation** edits only a constrained set of public marketing/SEO files. `npm run organic:guard` blocks protected or unrelated paths.
- Blog posts are structured content under `src/content/blog/posts`. The application discovers, prerenders and adds them to `sitemap.xml` and `llms.txt` during the build. Scheduled cycles never edit the blog renderer or routing infrastructure.
- Every claimed cycle receives the persistent opportunity/experiment context and must emit a private structured manifest. After production verification, the automation records the deployed experiment and any mature learnings back into SQLite.
- Vercel remains the production deploy mechanism after the automation merges a validated PR to `main`.
- The full repository lint has pre-existing errors outside this system's scope. Automation therefore runs `organic:lint`, which lints every JavaScript/TypeScript file changed in its branch, while build and SEO validation still cover the complete application.
- The one-time infrastructure branch is audited with `ORGANIC_GROWTH_BOOTSTRAP=true npm run organic:guard`. Scheduled cycles never receive that flag, so they cannot edit the scheduler or engine infrastructure.
- Scheduled cycles run only from a clean, current `main`. Before editing, snapshot the guard, manifest validator and their relative module dependencies from that baseline outside the worktree. Preserve their directory structure; copying only `register-cycle.mjs` breaks its imports. Run the snapshot with the execution worktree as the working directory. See `BUYER_EVIDENCE.md` for the pending runtime rollout.

## Local Codex runtime and persistence

- The SQLite database and its rotating backups are outside every Git worktree under `~/.codex/ruka-organic-growth/`, with file mode `0600`.
- SQLite runs in WAL mode with full synchronous writes, a 10-second busy timeout and foreign keys enabled.
- A successful job completion writes a consistent SQLite backup. The newest 14 backups are retained under `~/.codex/ruka-organic-growth/backups/`.
- `npm run organic:integrity` validates the live database; `npm run organic:backup` creates an on-demand backup.
- `.organic-growth/shared-secret` is a legacy migration credential only. Scheduling and engine persistence never read it or depend on Supabase. The optional commercial evidence collector makes read-only requests to the existing lead source; failure produces unavailable evidence, not a failed scheduler or zero leads.
- Search Console uses the connected Codex account at `~/.search-console-mcp/credentials.json`. The automation refreshes that connection before collection.
- Product intelligence reads the existing local `ruka-ai` and `ruka_v3` repositories and never writes to them.
- Git push and PR operations use the user's existing local Git/GitHub connection. No PAT is stored in repository files.
- Report and incident delivery uses the connected Slack tool in Codex. SQLite records the pending payload before delivery and its delivery reference afterwards.
- Reporting stores the original scheduled period, reuses its outbox on retries, and cannot complete without a Slack permalink. Reconcile the stable report ID in Slack before retrying an ambiguous send.
- Failures store a separate retry-after time; they preserve the original due date. Expired leases remain reclaimable, including after process termination.

Secrets must never be written to task output, committed files or automation prompts.

## Evidence and distribution

See `EVIDENCE.md` for the frozen AI question set, collection procedure, source freshness and persistent private storage. `organic:prepare` combines the local opportunity context with read-only commercial coverage and saved IA observations; unavailable sources remain explicit. No existing conversion event, lead write or Calendly behavior is changed.

The reporting job runs in a separate clean worktree and does not run `organic:prepare`; `generate-report.mjs` therefore refreshes the optional read-only commercial snapshot itself. CRM and AI observations are loaded from persistent private evidence, not assumed to exist in a previous worktree. The execution prompt reads `AGENT_PROMPT.md`; monthly strategy reads `STRATEGY.md`, which requires the full observation protocol. However, the execution schedule inspected on 2026-10-15 explicitly forbids successful `changed=false` runs. The buyer-evidence policy therefore requires a targeted prompt update after rollout; merging repository instructions alone will not enable it. Preserve the model, cadence and existing publication safeguards.

`organic:indexnow` is a dry run by default. Pass `-- --urls=/absolute/path/to/changed-canonical-urls.json --submit` only after production verification. The production ownership key, each response's HTTP status, canonical, robots and prerendered main content must pass before submission. Receipts live outside worktrees and suppress immediate identical resubmissions.

## Operating cadence

| Cadence | Purpose | May deploy? |
| --- | --- | --- |
| Daily at 08:30 | Detect availability, indexation, Search Console freshness and material anomalies | No |
| Every 3 days at 17:30 | Prioritize and ship at most one safe, evidence-backed growth improvement | Yes |
| Monday at 10:00 | Revisit mature experiments and record evidence-based outcomes | No |
| 1st and 15th at 09:00 | Deliver the operational growth report | No |
| 1st of each month at 11:00 | Re-rank clusters, commercial priorities and larger opportunities | No |

Cadence is an opportunity to advance a buying decision, not a content quota. A cycle without a public change should deliver one useful private evidence artifact through `buyerProgress`; see `BUYER_EVIDENCE.md`. Registration preserves revisions in SQLite without creating a deployed experiment. Identical retries are idempotent. A real access failure must remain visible, not be reported as an invented result.

## Blog publication path

1. Select an existing opportunity from the persistent engine context.
2. Confirm that a guide is a better search result than a product-page change and document cannibalization risk.
3. Research the question and verify every product statement against public product evidence.
4. Add one JSON post following `docs/organic-growth/BLOG.md`. Capture a fresh, article-specific product screenshot from a safe demo/test environment when it clarifies the workflow; otherwise create a new rights-safe Ruka visual. Store it under `public/blog`. Never reuse another post's image.
5. Run blog validation, build, changed-file lint, SEO validation and the safety guard.
6. Inspect the prerendered HTML, internal links, sitemap entry and responsive page before opening the PR.
7. Treat the post as the cycle's single experiment and evaluate it on its configured Search Console window.

## Failure and recovery

- Every claimed job creates a run row.
- Automation success/failure releases the lease and records the result.
- Critical failures are persisted locally before Codex posts the incident to the acquisition Slack channel.
- If build, lint, SEO validation or the safety guard fails, no PR is merged.
- Deployment verification checks server HTTP, prerendered canonical/H1, sitemap content type and empty-root regressions.
- Rollback uses a normal revert PR; force pushes and destructive resets are prohibited.

## Protected surfaces

The autonomous action cannot modify homepage, onboarding, pricing, terms, critical forms, Calendly, tracking, lead flows, shared Navbar/Footer or product repositories. Approval-required ideas are stored while the engine continues with other work.
