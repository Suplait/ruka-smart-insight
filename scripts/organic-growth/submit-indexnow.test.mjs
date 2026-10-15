import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { submitIndexNow } from './submit-indexnow.mjs';
const url = 'https://www.ruka.ai/productos/registro-de-compras';
const key = 'de6dcddaf6fbce16124fd9fef4a6b1a3';
const html = `<title>Registro de compras | Ruka</title><link rel="canonical" href="${url}"><meta name="description" content="Registra compras"><main>Información real del producto</main>`;
const options = { urlList: [url], published: [url] };
async function setup(t, overrides = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ruka-indexnow-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const calls = [];
  const request = async (target, init) => {
    calls.push({ target, init });
    if (target.endsWith(`${key}.txt`)) return new Response(overrides.key ?? key, { status: overrides.keyStatus || 200 });
    if (target === url) return new Response(overrides.html ?? html, { status: overrides.pageStatus || 200, headers: overrides.headers });
    assert.equal(target, 'https://api.indexnow.org/indexnow');
    assert.equal(init.method, 'POST');
    return new Response(null, { status: overrides.submitStatus || 200 });
  };
  return { ...options, submit: true, root, request, calls };
}
test('dry run makes no network call and rejects non-production or unlisted URLs', async () => {
  const result = await submitIndexNow({ ...options, request: () => assert.fail('No network in dry run') });
  assert.equal(result.state, 'dry_run');
  for (const bad of ['https://evil.test/', `${url}?email=private`]) {
    await assert.rejects(submitIndexNow({ ...options, urlList: [bad], published: [bad] }), /canonical production/);
  }
  await assert.rejects(submitIndexNow({ ...options, urlList: ['https://www.ruka.ai/unknown'] }), /canonical production/);
});
test('ownership, redirects, canonical, noindex and blank SPA all block submission', async t => {
  for (const overrides of [
    { key: 'wrong' }, { keyStatus: 404 }, { pageStatus: 307 },
    { html: html.replace(url, 'https://www.ruka.ai/') },
    { headers: { 'x-robots-tag': 'noindex' } },
    { html: `${html}<meta name="robots" content="noindex">` },
    { html: html.replace('<main>Información real del producto</main>', '<div id="root"></div>') },
  ]) {
    const config = await setup(t, overrides);
    await assert.rejects(submitIndexNow(config));
    assert.equal(config.calls.some(call => call.init.method === 'POST'), false);
  }
});
test('save verified receipt and skip unchanged content across independent runs', async t => {
  const config = await setup(t);
  const receipt = await submitIndexNow(config);
  assert.equal(receipt.state, 'accepted');
  assert.match(receipt.caveat, /not indexing/);
  const post = config.calls.find(call => call.init.method === 'POST');
  assert.deepEqual(JSON.parse(post.init.body).urlList, [url]);
  const next = await submitIndexNow({ ...config });
  assert.equal(next.state, 'unchanged');
  assert.equal(config.calls.filter(call => call.init.method === 'POST').length, 1);
});
test('202 is verification pending and failed requests are retryable', async t => {
  assert.equal((await submitIndexNow(await setup(t, { submitStatus: 202 }))).state, 'verification_pending');
  const config = await setup(t, { submitStatus: 429 });
  assert.equal((await submitIndexNow(config)).state, 'failed');
  assert.equal((await submitIndexNow(config)).state, 'failed');
  assert.equal(config.calls.filter(call => call.init.method === 'POST').length, 2);
});
