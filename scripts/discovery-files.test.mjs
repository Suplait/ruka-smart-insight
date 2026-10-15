import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { htmlToMarkdown, createRss, wrapPreviewTitle } from "./generate-discovery-files.mjs";

test("reader output preserves FAQ answers, headings and real links; removes controls and hidden content", () => {
  const text = htmlToMarkdown('<title>Title</title><main><h1>Compra</h1><p>Una <a href="/blog">guía</a>.</p><details><summary>¿Qué hace?</summary><p>Compara cantidades.</p></details><button>Enviar</button><script>secret()</script><div hidden>Hidden</div><a href="javascript:alert(1)">Unsafe</a></main>', "https://www.ruka.ai/example");
  assert.match(text, /# Compra/); assert.match(text, /Compara cantidades/); assert.match(text, /\[guía\]\(https:\/\/www.ruka.ai\/blog\)/);
  for (const forbidden of ["secret()", "Enviar", "Hidden", "javascript:"]) assert.ok(!text.includes(forbidden));
});
test("noindex pages cannot be exported", () => assert.throws(() => htmlToMarkdown('<meta name="robots" content="noindex"><main>Private</main>', "https://www.ruka.ai/private"), /noindex/));
test("reader preserves comparison-table headers, cell boundaries and ordered steps", () => {
  const text = htmlToMarkdown('<main><ol start="2"><li>Revisar</li><li>Exportar</li></ol><table><caption>Ejemplo, no resultado de cliente</caption><thead><tr><th>Fuente</th><th>Valor</th></tr></thead><tbody><tr><td>OC | Factura</td><td>10</td></tr><tr><td>Recepción</td><td>8</td></tr></tbody></table></main>', "https://www.ruka.ai/example");
  assert.match(text, /2\. Revisar\s+3\. Exportar/);
  assert.ok(text.includes("| Fuente | Valor |\n| --- | --- |\n| OC \\| Factura | 10 |\n| Recepción | 8 |"));
  assert.match(text, /Ejemplo, no resultado de cliente/);
});
test("headerless reader tables do not invent headers", () => {
  const text = htmlToMarkdown('<main><table><tr><td>Factura</td><td>10</td></tr><tr><td>Recepción</td><td>8</td></tr></table></main>', "https://www.ruka.ai/example");
  assert.match(text, /Factura \| 10\nRecepción \| 8/);
  assert.ok(!text.includes("---"));
});
test("reader keeps CSS-separated metadata and labels readable without styles", () => {
  const text = htmlToMarkdown('<main><div><span>Equipo Ruka</span><time>15 de octubre</time><span>5 min</span></div><dl><dt>Factura</dt><dd>10 unidades</dd></dl></main>', "https://www.ruka.ai/example");
  assert.match(text, /Equipo Ruka\s+15 de octubre\s+5 min/);
  assert.match(text, /Factura\s+10 unidades/);
});
test("RSS is valid XML, escapes content and uses stable canonical identifiers", () => {
  const xml = createRss([{ title: 'A & B < C', excerpt: 'A "quote"', slug: "example", datePublished: "2026-10-15" }]);
  const doc = new JSDOM(xml, { contentType: "application/xml" }).window.document;
  assert.equal(doc.querySelector("item title").textContent, "A & B < C");
  assert.equal(doc.querySelector("guid").textContent, "https://www.ruka.ai/blog/example");
  assert.equal(doc.querySelector("pubDate").textContent, "Thu, 15 Oct 2026 12:00:00 GMT");
});
test("social title wraps wide words without dropping text", async () => {
  const title = "Cómo preparar una nómina de pagos a proveedores para el banco";
  const result = await wrapPreviewTitle(title);
  assert.equal(result.lines.join(" "), title);
  assert.ok(!result.lines.includes("Cómo preparar una nómina"));
  assert.ok(result.lines.length <= 7);
  await assert.rejects(() => wrapPreviewTitle("W".repeat(100)), /editorial review/);
  await assert.rejects(() => wrapPreviewTitle("Una guía " + "W".repeat(100)), /editorial review/);
  await assert.rejects(() => wrapPreviewTitle("  "), /editorial review/);
});
