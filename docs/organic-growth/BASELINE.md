# Organic Growth Baseline

Baseline captured on 2026-10-08 using finalized Search Console data through 2026-10-05.

## Search performance

| Window | Clicks | Impressions | CTR | Average position |
| --- | ---: | ---: | ---: | ---: |
| Last 7 days | 56 | 1,678 | 3.34% | 6.40 |
| Previous 7 days | 38 | 1,420 | 2.68% | 6.16 |
| Last 28 days | 194 | 6,303 | 3.08% | 6.02 |
| Previous 28 days | 209 | 7,159 | 2.92% | 6.70 |
| Last 90 days | 575 | 20,413 | 2.82% | 6.58 |
| Previous 90 days | 436 | 18,746 | 2.33% | 6.52 |

Search Console's domain property includes tenant subdomains. Query-level data omits anonymized searches and must not be summed to reproduce property totals. Average position is impression-weighted and is not treated as a rank tracker.

## Initial findings

- Public marketing traffic is highly concentrated on the homepage.
- Visible commercial non-branded query volume is still small relative to branded/ambiguous demand.
- Mobile generates more impressions than desktop but materially lower observed CTR; this is a diagnostic signal, not proof of a UX cause.
- The production site already provides prerendered HTML, valid robots, sitemap, llms.txt, route-specific metadata and true 404 responses.
- Search Console's Chrome UX report currently has no URL groups for mobile or desktop (0 poor, 0 need-improvement and 0 good URLs), so there is not yet enough field data to claim Core Web Vitals performance from GSC.
- The sitemap existed publicly but had never been submitted in Search Console before this goal.
- At baseline, Google reported seven recent public pages as unknown: five product pages, `/integraciones` and `/about`.

Detailed snapshots, query data and product intelligence are stored privately in Supabase rather than committed to this public repository.
