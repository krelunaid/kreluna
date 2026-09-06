import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';
import ts from 'typescript';

const sqlite=new DatabaseSync(':memory:');
sqlite.exec(await readFile('drizzle/0004_dear_the_spike.sql','utf8'));
const db={prepare(sql){return {bind(...args){return {run(){return sqlite.prepare(sql).run(...args);}};}};}};
const exports={};
const compiled=ts.transpileModule(await readFile('app/api/launch-waitlist/route.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
new Function('require','exports',compiled)(()=>({getLaunchStore:()=>db}),exports);
const payload={project:'citybeam',email:'test@example.com',locale:'it',consent:true};
const send=(data,origin='https://www.kreluna.it')=>exports.POST(new Request('https://www.kreluna.it/api/launch-waitlist',{method:'POST',headers:{'content-type':'application/json',origin},body:JSON.stringify(data)}));

test('requires valid project, language, email, explicit consent and same origin',async()=>{
  for(const data of [{...payload,consent:false},{...payload,consent:'yes'},{...payload,email:'not-email'},{...payload,project:'unknown'},{...payload,locale:'xx'},null]) assert.equal((await send(data)).status,400);
  assert.equal((await send(payload,'https://other.example')).status,403);
});
test('stores isolated app lists, consent evidence and idempotent registration',async()=>{
  assert.equal((await send(payload)).status,201);
  assert.equal((await send({...payload,email:'TEST@example.com'})).status,201);
  assert.equal((await send({...payload,project:'velvet-table'})).status,201);
  const rows=sqlite.prepare('SELECT * FROM app_launch_waitlist').all();
  assert.equal(rows.length,2);
  assert.deepEqual(rows.map(x=>x.project).sort(),['citybeam','velvet-table']);
  assert.ok(rows.every(x=>x.consent_version==='2026-09-06'&&x.created_at));
});
test('honeypot never adds a subscriber',async()=>{
  await send({...payload,email:'bot@example.com',website:'spam'});
  assert.equal(sqlite.prepare('SELECT COUNT(*) n FROM app_launch_waitlist').get().n,2);
});
test('all static CityBeam forms retain project and language',async()=>{
  for(const locale of ['it','en','fr','es','de']){
    const h=await readFile(`public/${locale==='it'?'':locale+'/'}citybeam.html`,'utf8');
    assert.ok(h.includes('data-launch-signup'));
    assert.ok(h.includes('name="project" value="citybeam"'));
    assert.ok(h.includes(`name="locale" value="${locale}"`));
    assert.ok(h.includes('/assets/launch-signup.js'));
    assert.ok(h.includes('name="consent"'));
  }
});
