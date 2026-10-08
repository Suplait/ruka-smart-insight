# Organic Growth Engine Operations

## Architecture

- **GitHub Actions** provides durable daily wakeups independent of a laptop or Codex session.
- **Supabase** stores scheduler state, leases, Search Console snapshots, opportunities, experiments, product signals, reports and run logs.
- `claim_organic_growth_job` atomically decides whether work is due and prevents concurrent mutation.
- A successful execution advances the next due time by five real days. Failures retry after six hours. Expired two-hour leases recover automatically.
- Reporting has an independent lease and next-due timestamp; a Job A failure cannot block Job B.
- **Codex Action** edits only a constrained set of public marketing/SEO files. `npm run organic:guard` blocks protected or unrelated paths.
- Every claimed cycle receives the persistent opportunity/experiment context and must emit a private structured manifest. After production verification, the workflow records the deployed experiment and any mature learnings back into Supabase.
- Vercel remains the production deploy mechanism after an approved workflow PR merges to `main`.
- The full repository lint has pre-existing errors outside this system's scope. Automation therefore runs `organic:lint`, which lints every JavaScript/TypeScript file changed in its branch, while build and SEO validation still cover the complete application.
- The one-time infrastructure branch is audited with `ORGANIC_GROWTH_BOOTSTRAP=true npm run organic:guard`. Scheduled cycles never receive that flag, so they cannot edit the scheduler, workflows, Edge Function or migrations.

## Required GitHub Actions secrets

- `AZURE_OPENAI_API_KEY`
- `AZURE_OPENAI_RESPONSES_ENDPOINT`
- `ORGANIC_GROWTH_API_URL`
- `ORGANIC_GROWTH_SHARED_SECRET`
- `GSC_CLIENT_ID`
- `GSC_CLIENT_SECRET`
- `GSC_REFRESH_TOKEN`
- `PRODUCT_REPOS_TOKEN` (read-only access to `Suplait/ruka` and `Suplait/ruka_v3`)

Secrets must never be written to workflow output, committed files or Codex prompts.

## Failure and recovery

- Every claimed job creates a run row.
- Workflow success/failure releases the lease and records the result.
- Critical failures post an incident to the acquisition Slack channel.
- If build, lint, SEO validation or the safety guard fails, no PR is merged.
- Deployment verification checks server HTTP, prerendered canonical/H1, sitemap content type and empty-root regressions.
- Rollback uses a normal revert PR; force pushes and destructive resets are prohibited.

## Protected surfaces

The autonomous action cannot modify homepage, onboarding, pricing, terms, critical forms, Calendly, tracking, lead flows, shared Navbar/Footer or product repositories. Approval-required ideas are stored while the engine continues with other work.
