import { readFileSync, writeFileSync } from 'node:fs';
const code = readFileSync(new URL('./clickup-link.mjs', import.meta.url), 'utf8').replace(/^export /gm, '');
const prepare = 'Correlacionar tarea con lead';
const link = 'Guardar vinculo privado ClickUp';
const result = 'Resultado de correlacion';
const nodes = [
  { id: '9e0d378b-28e1-440e-a3e3-25709dd0ba18', name: prepare, type: 'n8n-nodes-base.code', typeVersion: 2, position: [-32,1536], parameters: {
    jsCode: code + "\nlet source; try { source=$('Crea/actualiza lead supabase').first().json.body; } catch { return []; }\nconst link=prepareClickupLink($input.all().map(item=>item.json),source); return link?[{json:link}]:[];",
  } },
  { id: '250e410e-bc08-4dca-a59b-26eaecc85ab3', name: link, type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [224,1536],
    credentials: { supabaseApi: { id: 'i80JbcEXhgCsijsU', name: 'Supabase account' } },
    retryOnFail: true, maxTries: 3, waitBetweenTries: 1000, onError: 'continueRegularOutput',
    parameters: { method: 'POST', url: 'https://rmxzryueysmzksmvpwpv.supabase.co/rest/v1/rpc/trace_link_clickup', authentication: 'predefinedCredentialType', nodeCredentialType: 'supabaseApi', sendBody: true, specifyBody: 'json', jsonBody: '={{ JSON.stringify($json) }}',
      options: { timeout: 5000, response: { response: { fullResponse: true, responseFormat: 'json' } } } } },
  { id: '415c178a-9bbc-492d-88cb-13e1a766d645', name: result, type: 'n8n-nodes-base.code', typeVersion: 2, position: [480,1536], parameters: {
    jsCode: "const r=$input.first().json; return [{json:{linked:r.statusCode===200 && typeof r.body==='boolean',changed:r.statusCode===200 && r.body===true}}];",
  } },
];
const connections = { [prepare]: { main: [[{ node: link, type: 'main', index: 0 }]] }, [link]: { main: [[{ node: result, type: 'main', index: 0 }]] } };
writeFileSync(new URL('../../integrations/n8n/lead-clickup-link-nodes.json', import.meta.url), JSON.stringify({ nodes, connections }, null, 2)+'\n');
// Attach these nodes as an additional branch from "Crea el lead" and
// "Guardar ID del lead". All original nodes and connections must remain intact.
