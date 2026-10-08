# Organic Growth Engine Operations

## Architecture

- **Codex Automations** provides the visible local scheduler and the agentic execution environment. GitHub Actions is not used by this engine.
- **Supabase** stores scheduler state, leases, Search Console snapshots, opportunities, experiments, product signals, reports and run logs.
- `claim_organic_growth_job` atomically decides whether work is due and prevents concurrent mutation.
- A successful execution advances the next due time by five real days. Failures retry after six hours. Expired two-hour leases recover automatically.
- Reporting has an independent lease and next-due timestamp; a Job A failure cannot block Job B.
- The **Codex execution automation** edits only a constrained set of public marketing/SEO files. `npm run organic:guard` blocks protected or unrelated paths.
- Every claimed cycle receives the persistent opportunity/experiment context and must emit a private structured manifest. After production verification, the automation records the deployed experiment and any mature learnings back into Supabase.
- Vercel remains the production deploy mechanism after the automation merges a validated PR to `main`.
- The full repository lint has pre-existing errors outside this system's scope. Automation therefore runs `organic:lint`, which lints every JavaScript/TypeScript file changed in its branch, while build and SEO validation still cover the complete application.
- The one-time infrastructure branch is audited with `ORGANIC_GROWTH_BOOTSTRAP=true npm run organic:guard`. Scheduled cycles never receive that flag, so they cannot edit the scheduler, engine documentation, Edge Function or migrations.
- Scheduled cycles run only from a clean, current `main`. The automation must copy the guard and manifest validator to a temporary directory before making changes, then use those immutable copies for final validation.

## Local Codex runtime

- The engine API secret lives in the ignored, mode-`0600` file `.organic-growth/shared-secret`.
- Search Console uses the connected Codex account at `~/.search-console-mcp/credentials.json`. The automation refreshes that connection before collection.
- Product intelligence reads the existing local `ruka-ai` and `ruka_v3` repositories and never writes to them.
- Git push and PR operations use the user's existing local Git/GitHub connection. No PAT is stored in repository files.

Secrets must never be written to task output, committed files or automation prompts.

## Failure and recovery

- Every claimed job creates a run row.
- Automation success/failure releases the lease and records the result.
- Critical failures post an incident to the acquisition Slack channel.
- If build, lint, SEO validation or the safety guard fails, no PR is merged.
- Deployment verification checks server HTTP, prerendered canonical/H1, sitemap content type and empty-root regressions.
- Rollback uses a normal revert PR; force pushes and destructive resets are prohibited.

## Protected surfaces

The autonomous action cannot modify homepage, onboarding, pricing, terms, critical forms, Calendly, tracking, lead flows, shared Navbar/Footer or product repositories. Approval-required ideas are stored while the engine continues with other work.
