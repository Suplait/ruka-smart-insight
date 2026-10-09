# Organic Growth Engine Operations

## Architecture

- **Codex Automations** provides the visible local scheduler and the agentic execution environment. GitHub Actions is not used by this engine.
- **Local SQLite** stores scheduler state, leases, Search Console snapshots, opportunities, experiments, product signals, reports and run logs at `~/.codex/ruka-organic-growth/state.sqlite`.
- `LocalOrganicGrowthEngine.claim()` uses an immediate SQLite transaction to decide atomically whether work is due and prevent concurrent mutation.
- The daily watchdog observes availability, indexation, data freshness and new opportunities without forcing a deployment.
- A successful build cycle advances the next due time by three real days. Failures retry after six hours.
- Experiment measurement runs weekly, strategic prioritization runs monthly, and reporting remains quincenal.
- Monitoring, execution, measurement, strategy and reporting each have an independent lease and next-due timestamp. A failure in one cadence cannot block another. Expired two-hour leases recover automatically.
- The **Codex execution automation** edits only a constrained set of public marketing/SEO files. `npm run organic:guard` blocks protected or unrelated paths.
- Every claimed cycle receives the persistent opportunity/experiment context and must emit a private structured manifest. After production verification, the automation records the deployed experiment and any mature learnings back into SQLite.
- Vercel remains the production deploy mechanism after the automation merges a validated PR to `main`.
- The full repository lint has pre-existing errors outside this system's scope. Automation therefore runs `organic:lint`, which lints every JavaScript/TypeScript file changed in its branch, while build and SEO validation still cover the complete application.
- The one-time infrastructure branch is audited with `ORGANIC_GROWTH_BOOTSTRAP=true npm run organic:guard`. Scheduled cycles never receive that flag, so they cannot edit the scheduler or engine infrastructure.
- Scheduled cycles run only from a clean, current `main`. The automation must copy the guard and manifest validator to a temporary directory before making changes, then use those immutable copies for final validation.

## Local Codex runtime and persistence

- The SQLite database and its rotating backups are outside every Git worktree under `~/.codex/ruka-organic-growth/`, with file mode `0600`.
- SQLite runs in WAL mode with full synchronous writes, a 10-second busy timeout and foreign keys enabled.
- A successful job completion writes a consistent SQLite backup. The newest 14 backups are retained under `~/.codex/ruka-organic-growth/backups/`.
- `npm run organic:integrity` validates the live database; `npm run organic:backup` creates an on-demand backup.
- `.organic-growth/shared-secret` is a legacy migration credential only. Normal execution never reads it or calls Supabase.
- Search Console uses the connected Codex account at `~/.search-console-mcp/credentials.json`. The automation refreshes that connection before collection.
- Product intelligence reads the existing local `ruka-ai` and `ruka_v3` repositories and never writes to them.
- Git push and PR operations use the user's existing local Git/GitHub connection. No PAT is stored in repository files.
- Report and incident delivery uses the connected Slack tool in Codex. SQLite records the pending payload before delivery and its delivery reference afterwards.

Secrets must never be written to task output, committed files or automation prompts.

## Operating cadence

| Cadence | Purpose | May deploy? |
| --- | --- | --- |
| Daily monitoring | Detect availability, indexation, Search Console freshness and material anomalies | No |
| Every 3 days | Prioritize and ship at most one safe, evidence-backed growth improvement | Yes |
| Weekly measurement | Revisit mature experiments and record evidence-based outcomes | No |
| 1st and 15th | Deliver the operational growth report | No |
| Monthly strategy | Re-rank clusters, commercial priorities and larger opportunities | No |

Cadence is an opportunity to act, not a content quota. A job may complete successfully with no public change when evidence is insufficient.

## Failure and recovery

- Every claimed job creates a run row.
- Automation success/failure releases the lease and records the result.
- Critical failures are persisted locally before Codex posts the incident to the acquisition Slack channel.
- If build, lint, SEO validation or the safety guard fails, no PR is merged.
- Deployment verification checks server HTTP, prerendered canonical/H1, sitemap content type and empty-root regressions.
- Rollback uses a normal revert PR; force pushes and destructive resets are prohibited.

## Protected surfaces

The autonomous action cannot modify homepage, onboarding, pricing, terms, critical forms, Calendly, tracking, lead flows, shared Navbar/Footer or product repositories. Approval-required ideas are stored while the engine continues with other work.
