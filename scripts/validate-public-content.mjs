import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Internal research is evidence for editorial decisions, not customer-facing copy.
export function publicContentViolations(content) {
  const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  return [
    [/\/(?:Users|home)\/[^\s<]+/i, 'local filesystem path'],
    [/(?:Minitest|ActiveSupport|semilla 23720|arnés aislado)/i, 'internal test implementation'],
    [/(?:10 pruebas internas|57 verificaciones|Controles internos revisados|Pendiente: comprobarlo de punta a punta)/i, 'internal QA report'],
    [/\/evidencia\/compra-toteat-2026-10-15\.txt/i, 'retired internal report link'],
    [/\b(?:b5255d76ec3a4af592f44603eb74d00018a30d97|5066b9a1fc56fb1355f88776bfe37fe29fea02f06632c288bcb7f9e4563e91dc)\b/, 'internal source revision'],
  ].filter(([pattern]) => pattern.test(text) || pattern.test(content)).map(([,label]) => label);
}

export async function validatePublicContent(root) {
  let checked = 0;
  const failures = [];
  async function scan(directory, generated = false) {
    for (const entry of await readdir(directory, {withFileTypes:true})) {
      const file = path.join(directory,entry.name);
      if (entry.isDirectory()) { await scan(file,generated); continue; }
      if (entry.name === 'SOURCES.md' || /[/\\]evidencia[/\\]/.test(file)) failures.push(`${file}: internal document in public output`);
      if (!/\.(?:html|md|txt|json)$/i.test(entry.name)) continue;
      let content = await readFile(file,'utf8');
      if (generated && entry.name.endsWith('.html')) content = content.replace(/<script\b[\s\S]*?<\/script>/gi,'');
      for (const reason of publicContentViolations(content)) failures.push(`${file}: ${reason}`);
      checked++;
    }
  }
  await scan(path.join(root,'public'));
  await scan(path.join(root,'dist'),true);
  if (failures.length) throw new Error(`Public content boundary failed:\n${failures.join('\n')}`);
  console.log(`Public content boundary passed: ${checked} text assets; no internal reports or maintenance documents.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await validatePublicContent(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
}
