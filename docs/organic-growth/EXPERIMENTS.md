# Organic Growth Experiments

The authoritative experiment register lives in the private `organic_growth_experiments` table. States are:

`DISCOVERED → PRIORITIZED → IN_PROGRESS → DEPLOYED → MEASURING → VALIDATED / INCONCLUSIVE / REVERTED`

## Bootstrap experiments

### OG-2026-001 — Search Console sitemap submission

- Problem: the public sitemap was not submitted in Search Console.
- Hypothesis: official sitemap discovery will make the new public route inventory easier for Google to discover and revisit.
- Baseline: zero submitted sitemaps; seven recent public routes unknown to Google.
- Change: submitted `https://www.ruka.ai/sitemap.xml` on 2026-10-08.
- Current state: deployed / waiting for Google processing.
- Success signal: sitemap status succeeds and unknown URLs move into discovered/crawled states.
- Evaluation: next execution cycle and again after 14 days.

The supplier-payment opportunity remains in the backlog. It becomes an experiment only after a concrete change is deployed; backlog status is not presented as experimental evidence.
