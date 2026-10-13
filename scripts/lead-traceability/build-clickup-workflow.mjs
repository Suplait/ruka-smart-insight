import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const nodeId = name => { const h = createHash('sha256').update(name).digest('hex'); return `${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`; };

const projection = readFileSync(new URL('./clickup-projection.mjs', import.meta.url), 'utf8').replace(/^export /gm, '');
const nodes = [];
const connections = {};
const add = (name, type, parameters, position, extra = {}) => {
  nodes.push({ id: nodeId(name), name, type: `n8n-nodes-base.${type}`, typeVersion: type === 'httpRequest' ? 4.2 : type === 'code' ? 2 : type === 'if' ? 2.2 : 1, position, parameters, ...extra });
};
const connect = (from, to, output = 0) => {
  connections[from] ||= { main: [] };
  connections[from].main[output] ||= [];
  connections[from].main[output].push({ node: to, type: 'main', index: 0 });
};
const supabase = { supabaseApi: { id: 'i80JbcEXhgCsijsU', name: 'Supabase account' } };
const clickup = { clickUpOAuth2Api: { id: 'DNlA3eKMDHk3NI7V', name: 'Clickup ESTE ES (Camilo)' } };
const rpc = (name, body) => ({ method: 'POST', url: `https://rmxzryueysmzksmvpwpv.supabase.co/rest/v1/rpc/${name}`,
  authentication: 'predefinedCredentialType', nodeCredentialType: 'supabaseApi', sendBody: true, specifyBody: 'json', jsonBody: body,
  options: { timeout: 10000, response: { response: { fullResponse: true, responseFormat: 'json' } } } });
const api = { authentication: 'predefinedCredentialType', nodeCredentialType: 'clickUpOAuth2Api',
  options: { timeout: 10000, response: { response: { fullResponse: true, neverError: true, responseFormat: 'json' } } } };
add('Solo prueba aislada autorizada', 'manualTrigger', {}, [0, 0]);
// The manual trigger remains available for controlled delivery checks.
add('Reservar entrega existente', 'httpRequest', rpc('trace_claim_clickup_delivery', '{}'), [220, 0], { credentials: supabase });
add('Preparar trabajo', 'code', { jsCode: "const r = $input.first().json; if (r.statusCode !== 200) throw new Error('clickup_claim_failed'); if (!r.body) return []; return [{json:r.body}];" }, [440, 0]);
add('Leer tarea existente', 'httpRequest', { ...api, url: "=https://api.clickup.com/api/v2/task/{{ $('Preparar trabajo').first().json.task_id }}" }, [660, 0], { credentials: clickup, onError: 'continueRegularOutput' });
add('Validar y proyectar', 'code', { jsCode: projection + "\nreturn [{json:prepareClickupUpdate($('Preparar trabajo').first().json, $input.first().json)}];" }, [880, 0]);
add('Requiere actualizar campo', 'if', { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 }, conditions: [
  { id: nodeId('write-condition'), leftValue: '={{ $json.action }}', rightValue: 'write', operator: { type: 'string', operation: 'equals' } },
], combinator: 'and' }, options: {} }, [1100, 0]);
add('Actualizar solo trazabilidad', 'httpRequest', { ...api, method: 'POST',
  url: '=https://api.clickup.com/api/v2/task/{{ $json.task_id }}/field/{{ $json.field_id }}',
  sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify({value:$json.value}) }}',
}, [1320, -140], { credentials: clickup, onError: 'continueRegularOutput' });
add('Clasificar resultado', 'code', { jsCode: projection + "\nreturn [{json:finishClickupWrite($('Validar y proyectar').first().json, $input.first().json)}];" }, [1540, -140]);
add('Confirmar revision entregada', 'httpRequest', rpc('trace_finish_delivery', '={{ JSON.stringify($json.ack) }}'), [1760, 0], { credentials: supabase });
add('Verificar confirmacion', 'code', { jsCode: "const r=$input.first().json; if(r.statusCode!==200 || r.body!==true) throw new Error('clickup_ack_failed'); return [{json:{acknowledged:true}}];" }, [1980, 0]);
connect('Solo prueba aislada autorizada', 'Reservar entrega existente');
connect('Reservar entrega existente', 'Preparar trabajo');
connect('Preparar trabajo', 'Leer tarea existente');
connect('Leer tarea existente', 'Validar y proyectar');
connect('Validar y proyectar', 'Requiere actualizar campo');
connect('Requiere actualizar campo', 'Actualizar solo trazabilidad');
connect('Requiere actualizar campo', 'Confirmar revision entregada', 1);
connect('Actualizar solo trazabilidad', 'Clasificar resultado');
connect('Clasificar resultado', 'Confirmar revision entregada');
connect('Confirmar revision entregada', 'Verificar confirmacion');

add('Enriquecer Slack confirmado', 'httpRequest', {
  method: 'POST', url: 'https://rmxzryueysmzksmvpwpv.supabase.co/functions/v1/lead-enrichment-worker',
  authentication: 'predefinedCredentialType', nodeCredentialType: 'supabaseApi',
  sendBody: true, specifyBody: 'json', jsonBody: '{}',
  options: { timeout: 65000, response: { response: { fullResponse: true, responseFormat: 'json' } } },
}, [220, 300], { credentials: supabase, onError: 'continueRegularOutput' });
add('Verificar enriquecimiento Slack', 'code', { jsCode: "const r=$input.first().json; if(r.statusCode!==200 || r.body?.error || r.body?.failed>0) throw new Error('slack_enrichment_failed'); return [{json:r.body}];" }, [440, 300]);
connect('Solo prueba aislada autorizada', 'Enriquecer Slack confirmado');
connect('Enriquecer Slack confirmado', 'Verificar enriquecimiento Slack');
add('Schedule Trigger', 'scheduleTrigger', { rule: { interval: [{ field: 'minutes', minutesInterval: 1 }] } }, [0, -220], { typeVersion: 1.4 });
connect('Schedule Trigger', 'Reservar entrega existente');
connect('Schedule Trigger', 'Enriquecer Slack confirmado');

const workflow = { name: 'Trazabilidad leads · Slack y ClickUp', nodes, connections, active: false, pinData: {},
  settings: { executionOrder: 'v1', executionTimeout: 120, saveDataErrorExecution: 'none', saveDataSuccessExecution: 'none', saveManualExecutions: false },
};
const output = fileURLToPath(new URL('../../integrations/n8n/lead-clickup-enrichment.json', import.meta.url));
mkdirSync(fileURLToPath(new URL('../../integrations/n8n/', import.meta.url)), { recursive: true });
writeFileSync(output, JSON.stringify(workflow, null, 2) + '\n');
console.log(output);
