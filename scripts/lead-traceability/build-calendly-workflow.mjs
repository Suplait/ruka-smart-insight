import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const id = name => { const h=createHash('sha256').update(name).digest('hex'); return `${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`; };
const nodes=[{id:id('calendar-manual'),name:'Prueba controlada de conexion',type:'n8n-nodes-base.manualTrigger',typeVersion:1,position:[0,0],parameters:{}}];
const connections={'Prueba controlada de conexion':{main:[[]]}};
for(const [index,account] of ['classic'].entries()) {
  const name=account==='one'?'Reconciliar calendario One':'Reconciliar calendario clasico';
  const summary=account==='one'?'Resultado One':'Resultado clasico';
  nodes.push({id:id(name),name,type:'n8n-nodes-base.httpRequest',typeVersion:4.2,position:[260,index*240],
    credentials:{supabaseApi:{id:'i80JbcEXhgCsijsU',name:'Supabase account'}},
    parameters:{method:'POST',url:'https://rmxzryueysmzksmvpwpv.supabase.co/functions/v1/lead-calendly-reconcile',
      authentication:'predefinedCredentialType',nodeCredentialType:'supabaseApi',sendBody:true,specifyBody:'json',jsonBody:JSON.stringify({account}),
      options:{timeout:110000,response:{response:{fullResponse:true,responseFormat:'json'}}}},onError:'continueRegularOutput'});
  nodes.push({id:id(summary),name:summary,type:'n8n-nodes-base.code',typeVersion:2,position:[520,index*240],
    parameters:{jsCode:`const r=$input.first().json; const ok=r.statusCode===200 && !r.body?.error; return [{json:{account:'${account}',ok,...(ok?r.body:{error:'calendar_reconciliation_failed'})}}];`}});
  connections['Prueba controlada de conexion'].main[0].push({node:name,type:'main',index:0});
  connections[name]={main:[[{node:summary,type:'main',index:0}]]};
}
nodes.push({id:id('calendar-schedule'),name:'Schedule Trigger',type:'n8n-nodes-base.scheduleTrigger',typeVersion:1.4,position:[144,144],
  parameters:{rule:{interval:[{field:'minutes',minutesInterval:15}]}}});
connections['Schedule Trigger']={main:[[{node:'Reconciliar calendario clasico',type:'main',index:0}]]};
const workflow={name:'Trazabilidad leads · Reconciliación Calendly',active:false,nodes,connections,pinData:{},
  settings:{executionOrder:'v1',executionTimeout:120,saveDataErrorExecution:'none',saveDataSuccessExecution:'none',saveManualExecutions:false}};
// Lorenzo / One is deferred at the user's request. Only the classic calendar is scheduled.
const target=fileURLToPath(new URL('../../integrations/n8n/lead-calendly-reconciliation.json',import.meta.url));
mkdirSync(fileURLToPath(new URL('../../integrations/n8n/',import.meta.url)),{recursive:true});
writeFileSync(target,JSON.stringify(workflow,null,2)+'\n');
console.log(target);
