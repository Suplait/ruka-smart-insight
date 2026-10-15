# Customer content and internal evidence

Internal test reports, source revisions, harness details, maintenance source lists,
outreach drafts and incomplete validation plans belong in repository documentation,
never in `public`, customer pages, PDFs or generated discovery content.

Use internal evidence to bound claims, not as a substitute for customer guidance.
Explain relevant prerequisites and limitations in the buyer's language. Do not
turn simulated tests into claims about production results, customer savings or
universal integration coverage.

Before publication, inspect the rendered page, every download and generated
Markdown. Customer links should open a useful page or a designed download, not an
engineering report. `robots.txt`, IndexNow verification and machine-readable
discovery files remain valid public assets; they are not customer CTAs.

The production build runs `validate-public-content.mjs` as a regression guard.
It supplements, but does not replace, editorial and visual review.
