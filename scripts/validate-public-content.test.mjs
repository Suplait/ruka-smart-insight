import test from 'node:test';
import assert from 'node:assert/strict';
import { publicContentViolations } from './validate-public-content.mjs';

test('blocks internal test reports even inside rendered markup',()=> {
  assert(publicContentViolations('<p>10 <strong>pruebas internas</strong>, 57 verificaciones</p>').length);
  assert(publicContentViolations('Entorno: Ruby 3.3.3, ActiveSupport 7.0.8.4, Minitest 5.25.5').length);
  assert(publicContentViolations('/Users/example/Downloads/source.png').length);
  assert(publicContentViolations('<a href="/evidencia/compra-toteat-2026-10-15.txt">Ficha</a>').length);
});
test('keeps useful customer boundaries and machine discovery formats',()=> {
  assert.deepEqual(publicContentViolations('Confirmamos acceso, productos, unidades y locales para tu operación. Demo con datos de ejemplo.'),[]);
  assert.deepEqual(publicContentViolations('User-agent: *\nSitemap: https://www.ruka.ai/sitemap.xml\n[Guía](https://www.ruka.ai/integraciones/toteat.md)'),[]);
});
