# Ruka blog publication standard

## Purpose

The blog helps an operations or finance buyer understand a concrete workflow before evaluating a product. It is not a news feed, an SEO volume channel or a place for generic AI commentary.

## Decision gate

Publish only when all answers are yes:

- Is there evidence of a real buyer question or search opportunity?
- Is an educational article the best format for that intent?
- Does the topic differ clearly from existing product and blog URLs?
- Can every Ruka claim be verified from public product evidence?
- Is there a natural internal path to a relevant product or Ruka One?
- Can the article be useful without invented numbers or filler?

If any answer is no, improve another safe surface or submit a no-change manifest.

## Content format

Create exactly one file at `src/content/blog/posts/<slug>.json` using an existing post as the schema reference. The filename and `slug` must match. Do not edit the router, sitemap generator or rendering components.

Required editorial elements:

- one Chilean Spanish title that answers a specific intent;
- an accurate meta title and description;
- a descriptive, real image with useful alt text;
- a short introduction that names the operational problem;
- at least three substantive sections;
- concrete takeaways, FAQ and one product relationship;
- source links for the claims and internal links to adjacent Ruka content;
- publication and modification dates;
- target query, intent and audience for measurement.

## Quality and safety

- Write for an operator or finance leader, not for a crawler.
- Prefer concrete nouns and actions over abstractions such as efficiency, transformation or innovation.
- Do not invent customers, integrations, outcomes, savings, adoption numbers or capabilities.
- Do not imply that Ruka executes an action when public product evidence only shows that it prepares or supports it.
- Do not pad the article to reach a word count. The validator enforces a range, not a target.
- Do not generate lookalike brand marks or use third-party imagery without clear rights.
- Reuse a relevant product screenshot when it explains the workflow. Otherwise create an original Ruka-owned visual and store it in `public/blog`.
- Avoid duplicate or near-duplicate topics. Check titles, target queries and search intent across all existing posts.

## Required checks

```bash
npm run organic:blog:validate
npm run build
npm run organic:lint
npm run validate:seo
npm run organic:guard
```

Inspect the article at desktop and mobile widths. Confirm the H1, body, image, table of contents, FAQ, related product and next-article links. Confirm that View Source includes the full article, canonical, BlogPosting schema and FAQ schema.
