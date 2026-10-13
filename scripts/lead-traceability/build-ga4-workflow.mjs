import { writeFileSync } from 'node:fs';
const nodes = [
  { id: 'ga4-schedule', name: 'Diario 09 Santiago', type: 'n8n-nodes-base.scheduleTrigger', typeVersion: 1.4, position: [0, 0],
    parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 9 * * *' }] } } },
  { id: 'ga4-manual', name: 'Comprobar lectura GA4', type: 'n8n-nodes-base.manualTrigger', typeVersion: 1, position: [0, 180], parameters: {} },
  { id: 'ga4-read', name: 'Conciliar agregados maduros', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [260, 0],
    credentials: { supabaseApi: { id: 'i80JbcEXhgCsijsU', name: 'Supabase account' } },
    parameters: { method: 'POST', url: 'https://rmxzryueysmzksmvpwpv.supabase.co/functions/v1/lead-ga4-reconcile',
      authentication: 'predefinedCredentialType', nodeCredentialType: 'supabaseApi', sendBody: true, specifyBody: 'json', jsonBody: '{}',
      options: { timeout: 90000, response: { response: { responseFormat: 'json' } } } } },
];
const connections = Object.fromEntries(nodes.slice(0, 2).map(node => [node.name, { main: [[{ node: nodes[2].name, type: 'main', index: 0 }]] }]));
const workflow = { name: 'Trazabilidad leads · Conciliación GA4', active: false, nodes, connections, pinData: {},
  settings: { executionOrder: 'v1', timezone: 'America/Santiago', executionTimeout: 100,
    saveDataErrorExecution: 'none', saveDataSuccessExecution: 'none', saveManualExecutions: false } };
writeFileSync(new URL('../../integrations/n8n/lead-ga4-reconciliation.json', import.meta.url), JSON.stringify(workflow, null, 2) + '\n');
