import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { prepareClickupLink } from './clickup-link.mjs';
const task = { id: 'task123', list: { id: '901301203866' } };
const source = { type: 'INSERT', schema: 'public', table: 'leads', record: { submission_id: 'f220f4b5-81be-4bde-8e73-21dd42a61000', email: 'private@example.invalid', clave_sii: 'private' } };
test('links one task from either existing or created result without contact data',()=>{
  assert.deepEqual(prepareClickupLink([task],source),{p_submission:source.record.submission_id,p_task_id:task.id,p_list_id:task.list.id});
  assert.deepEqual(prepareClickupLink([{...task,leadTaskId:task.id}],source),prepareClickupLink([task],source));
});
test('skips ambiguous tasks, foreign lists, legacy leads and unrelated source events',()=>{
  for (const tasks of [[],[task,task],[{...task,list:{id:'other'}}],[{...task,id:'../other'}]]) assert.equal(prepareClickupLink(tasks,source),null);
  for (const body of [null,{}, {...source,type:'UPDATE'},{...source,table:'leads_one'},{...source,schema:'other'},{...source,record:{id:2}},{...source,record:{submission_id:'foreign'}}]) assert.equal(prepareClickupLink([task],body),null);
});
test('actual n8n code is inert for Calendly and emits only the private RPC arguments',()=>{
  const w=JSON.parse(readFileSync(new URL('../../integrations/n8n/lead-clickup-link-nodes.json',import.meta.url)));
  const run=(available)=>vm.runInNewContext('(function(){'+w.nodes[0].parameters.jsCode+'})()',{
    $input:{all:()=>[{json:task}]},$:()=>{if(!available) throw Error('source not executed');return {first:()=>({json:{body:source}})};},
  });
  assert.equal(JSON.stringify(run(false)),'[]');
  assert.equal(JSON.stringify(run(true)),JSON.stringify([{json:prepareClickupLink([task],source)}]));
  assert.equal(w.nodes.filter(n=>n.type==='n8n-nodes-base.httpRequest').length,1);
  assert.equal(w.nodes[1].parameters.url,'https://rmxzryueysmzksmvpwpv.supabase.co/rest/v1/rpc/trace_link_clickup');
  assert.equal(w.nodes[1].onError,'continueRegularOutput');
});
