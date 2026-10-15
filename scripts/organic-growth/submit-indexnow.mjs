import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { JSDOM } from 'jsdom';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { readEvidence, writeEvidence } from './evidence-store.mjs';

const origin = 'https://www.ruka.ai';
const key = 'de6dcddaf6fbce16124fd9fef4a6b1a3';
const keyLocation = `${origin}/${key}.txt`;
export async function submitIndexNow({ urlList, published, submit = false, request = fetch, root, now = Date.now() }) {
  if (!Array.isArray(urlList) || !urlList.length || urlList.length > 100 || urlList.some(url => {
    try { const parsed = new URL(url); return !published.includes(url) || parsed.origin !== origin || parsed.search || parsed.hash || parsed.username || parsed.password; } catch { return true; }
  })) throw new Error('Only 1–100 canonical production URLs in the built sitemap may be submitted');
  const unique = [...new Set(urlList)].sort();
  if (!submit) return { state: 'dry_run', host: 'www.ruka.ai', keyLocation, urlList: unique };
  const keyResponse = await request(keyLocation, { redirect: 'manual', signal: AbortSignal.timeout(15_000) });
  if (keyResponse.status !== 200 || (await keyResponse.text()).trim() !== key) throw new Error('Ownership key is not deployed');
  const fingerprints = [];
  for (const url of unique) {
    const response = await request(url, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
    if (response.status !== 200) throw new Error(`Page not live: ${url} (${response.status})`);
    const html = await response.text(); const doc = new JSDOM(html).window.document;
    if (doc.querySelector('link[rel="canonical"]')?.href !== url || /noindex/i.test(`${doc.querySelector('meta[name="robots"]')?.content || ''} ${response.headers.get('x-robots-tag') || ''}`)) throw new Error(`Page not canonical/indexable: ${url}`);
    if (!doc.title.trim() || !doc.querySelector('main')?.textContent?.trim()) throw new Error(`Prerendered page content missing: ${url}`);
    // Stable content, not build asset hashes; do not ping unchanged content each run.
    fingerprints.push({ url, title: doc.title, description: doc.querySelector('meta[name="description"]')?.content, text: doc.querySelector('main')?.textContent });
  }
  const hash = createHash('sha256').update(JSON.stringify(fingerprints)).digest('hex');
  const previous = await readEvidence('indexnow-receipt.json', root).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
  const elapsed = now - Date.parse(previous?.submittedAt);
  if (previous?.hash === hash && ['accepted', 'verification_pending'].includes(previous.state) && elapsed >= 0 && elapsed < 7 * 86400_000) {
    return { state: 'unchanged', previousReceipt: previous.submittedAt };
  } else {
    const response = await request('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ host: 'www.ruka.ai', key, keyLocation, urlList: unique }), signal: AbortSignal.timeout(30_000) });
    const receipt = { submittedAt: new Date(now).toISOString(), httpStatus: response.status, hash, urlList: unique, state: response.status === 200 ? 'accepted' : response.status === 202 ? 'verification_pending' : 'failed', caveat: 'Receipt is not indexing or ranking confirmation.' };
    await writeEvidence('indexnow-receipt.json', receipt, { root });
    return receipt;
  }
}

async function main() {
  const input = process.argv.find(arg => arg.startsWith('--urls='))?.slice(7);
  const sitemap = new JSDOM(await readFile('dist/sitemap.xml', 'utf8'), { contentType: 'application/xml' });
  const published = [...sitemap.window.document.querySelectorAll('loc')].map(node => node.textContent);
  const urlList = input ? JSON.parse(await readFile(input, 'utf8')) : published;
  const result = await submitIndexNow({ urlList, published, submit: process.argv.includes('--submit') });
  console.log(JSON.stringify(result, null, 2));
  if (result.state === 'failed') process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) await main();
