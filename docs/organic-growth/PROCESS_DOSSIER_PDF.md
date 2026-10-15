# Process dossier PDF

The public page offers a direct static PDF download. It does not require a form,
native browser print dialog, external document service or access to customer data.
The HTML remains the canonical version through the PDF response's Link header.

## Regenerate after changing the dossier

1. Run `npm run build`.
2. Run `python3 scripts/generate-process-dossier-pdf.py` with Python containing
   reportlab, lxml and pypdf. The Codex PDF runtime provides these. Font files
   `Arial.ttf` and `Arial Bold.ttf` must be available; on another OS provide their
   directory through `RUKA_PDF_FONT_DIR`. Fonts are embedded in the PDF; no system
   font dependency exists for readers or deployment.
3. Render `output/pdf/registrar-compras-toteat.pdf` with Poppler and inspect **all
   five pages**. Confirm the actual logo, Spanish glyphs, legible screenshot,
   clickable image/evidence links, honest external-test limitation, eight blank
   decision fields, page numbers, margins and no clipped text.
4. Copy the reviewed PDF to `public/expedientes/registrar-compras-toteat.pdf` and
   its generated JSON manifest to `docs/organic-growth/process-dossier-pdf.json`.
5. Build again, then run `npm run validate:seo`. This checks source freshness,
   PDF signature, reviewed hash and the built copy. CI does not need Python.
6. Click **Descargar PDF** in desktop/mobile QA and compare the downloaded bytes.
   After deployment repeat the HTTP/content-type/hash and canonical checks.

The generator extracts the public content from prerendered HTML rather than
maintaining a second copy. It strips web actions and accessibility-only blank-field
placeholders. It does not turn internal service tests into external validation.
The final sheet is for printing/writing; it is not advertised as a fillable form.

The manifest is a freshness/integrity check, not proof of visual quality. Changing
the page count or layout requires a new complete visual review.
