import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { labels, monitorObservation, monitorDecision, monitorAcknowledge } from './monitor-projection.mjs';
const id = name => { const h=createHash('sha256').update(name).digest('hex'); return `${h.slice(0,8)}-${h.slice(8,12)}-5${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`; };
const node = (name,type,parameters,x,y=0,typeVersion=1) => ({id:id(name),name,type:`n8n-nodes-base.${type}`,typeVersion,position:[x,y],parameters});
const nodes = [
  node('Cada cinco minutos','scheduleTrigger',{rule:{interval:[{field:'minutes',minutesInterval:5}]}},0,0,1.4),
  node('Comprobar monitor','manualTrigger',{},0,180),
  {...node('Leer salud de trazabilidad','httpRequest',{
    method:'POST',url:'https://rmxzryueysmzksmvpwpv.supabase.co/rest/v1/rpc/trace_monitor_snapshot',
    authentication:'predefinedCredentialType',nodeCredentialType:'supabaseApi',sendBody:true,specifyBody:'json',jsonBody:'{}',
    options:{timeout:15000,response:{response:{fullResponse:true,responseFormat:'json'}}},
  },260,0,4.2),credentials:{supabaseApi:{id:'i80JbcEXhgCsijsU',name:'Supabase account'}},onError:'continueRegularOutput'},
  node('Decidir aviso','code',{jsCode:`const labels=${JSON.stringify(labels)};\n${monitorObservation}\n${monitorDecision}\nconst state=$getWorkflowStaticData('global'); const now=Date.now(); state.lastCheckedAt=now; const notification=monitorDecision($input.first().json,state,now); return notification ? [{json:notification}] : [];`},520,0,2),
  {...node('Avisar en Slack','slack',{
    resource:'message',operation:'post',authentication:'accessToken',select:'channel',
    channelId:{__rl:true,mode:'id',value:'C08DUJ6V2G6'},messageType:'text',text:'={{ $json.text }}',
    otherOptions:{includeLinkToWorkflow:true,unfurl_links:false,unfurl_media:false,link_names:false},
  },780,0,2.3),credentials:{slackApi:{id:'xVJhrlL8hV1pNKmC',name:'slack-as-bot'}},onError:'continueRegularOutput'},
  node('Confirmar aviso','code',{jsCode:`${monitorAcknowledge}\nconst state=$getWorkflowStaticData('global'); return [{json:monitorAcknowledge($input.first().json,$('Decidir aviso').first().json,state,Date.now())}];`},1040,0,2),
];
const connections = {};
for (const [from,to] of [['Cada cinco minutos','Leer salud de trazabilidad'],['Comprobar monitor','Leer salud de trazabilidad'],
  ['Leer salud de trazabilidad','Decidir aviso'],['Decidir aviso','Avisar en Slack'],['Avisar en Slack','Confirmar aviso']]) {
  connections[from]={main:[[{node:to,type:'main',index:0}]]};
}
const workflow={name:'Trazabilidad leads · Alertas',active:false,nodes,connections,pinData:{},settings:{executionOrder:'v1',timezone:'America/Santiago',executionTimeout:60,
  saveDataErrorExecution:'none',saveDataSuccessExecution:'none',saveManualExecutions:false}};
for (const n of nodes) if (n.type==='n8n-nodes-base.code') n.parameters.mode='runOnceForAllItems';
writeFileSync(new URL('../../integrations/n8n/lead-monitor.json',import.meta.url),JSON.stringify(workflow,null,2)+'\n');
const samples=[{timestamp:'2026-10-13T22:00:00Z'},{},{statusCode:200,body:{version:1,observed_at:'2026-10-13T22:00:00Z',counts:{}}},
  {fingerprint:'slack_overdue',text:'Revisar trazabilidad',recovery:false,observedAt:'2026-10-13T22:00:00Z'},
  {ok:true,message_timestamp:'1.2',channel:'C08DUJ6V2G6'},{delivered:true,retryAfter:null}];
const declarations=nodes.map((n,i)=>{
  const config={name:n.name,parameters:n.parameters,...(n.credentials?{credentials:n.credentials}:{}),...(n.onError?{onError:n.onError}:{})};
  let literal=JSON.stringify({type:n.type,version:n.typeVersion,config,output:[samples[i]]},null,2);
  literal=literal.replace(JSON.stringify('={{ $json.text }}'),`expr('{{ $json.text }}')`);
  return `const step${i} = ${i<2?'trigger':'node'}(${literal});`;
});
writeFileSync(new URL('../../integrations/n8n/lead-monitor.sdk.js',import.meta.url),declarations.join('\n')+`\nexport default workflow('lead-traceability-monitor', 'Trazabilidad leads · Alertas')
  .add(step0).to(step2).to(step3).to(step4).to(step5)
  .add(step1).to(step2);\n`);
