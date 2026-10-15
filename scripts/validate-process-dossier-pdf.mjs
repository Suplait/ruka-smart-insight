import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

export async function validateProcessDossierPdf() {
  const manifest = JSON.parse(await readFile(path.join(root, 'docs/organic-growth/process-dossier-pdf.json'), 'utf8'));
  const sources = ['src/pages/PurchaseProcessDossier.tsx', 'public/assets/process-evidence/recepcion-demo.jpg',
    'public/logo.png', 'scripts/generate-process-dossier-pdf.py'];
  assert.deepEqual(Object.keys(manifest.sources).sort(), [...sources].sort(), 'Unexpected PDF provenance files');
  for (const source of sources) {
    assert.equal(hash(await readFile(path.join(root, source))), manifest.sources[source],
      `PDF is stale after changing ${source}. Rebuild, render and visually inspect the PDF.`);
  }
  assert.equal(manifest.pages, 4, 'Review pagination before changing the accepted PDF page count');
  for (const directory of ['public', 'dist']) {
    const pdf = await readFile(path.join(root, directory, 'expedientes/registrar-compras-toteat.pdf'));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-', `${directory}: not a PDF`);
    assert.equal(hash(pdf), manifest.pdfSha256, `${directory}: PDF differs from the visually reviewed artifact`);
  }
  console.log('Dossier PDF: source freshness, reviewed artifact hash and production build copy verified.');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await validateProcessDossierPdf();
}
