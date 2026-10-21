import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

// Execute the actual catalog block with a supplier URL saved by a previous session.
const html=readFileSync('www/index.html','utf8');
const catalog=html.slice(html.indexOf("const CATALOG_URL_KEY="),html.indexOf('function shopView()'));
const startup=[],timers=[];let fetches=0;
const context={localStorage:{getItem:()=> 'https://supplier.example/catalog.json'},URL,Date,
 window:{petCareFamily:{requireStandard:()=>true},addEventListener:(name,fn)=>{if(name==='load')startup.push(fn);}},setInterval:fn=>timers.push(fn),render(){},
 fetch:async()=>{fetches++;return {ok:true,json:async()=>[{title:'Food',url:'https://supplier.example/food'}]};}};
runInNewContext(catalog,context);
for(const fn of [...startup,...timers])await fn();
assert.equal(fetches,0,'A saved catalog must not make startup or periodic requests');
await runInNewContext('refreshCatalog()',context);
assert.equal(fetches,1,'Explicit refresh must remain available');

// Run the actual async join handler, suspending each network boundary in turn.
const chat=readFileSync('www/global-chat.js','utf8');
const handler=chat.slice(chat.indexOf('async function joinChat(e)'),chat.indexOf('  function paint()'));
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
async function check({checked=true,open=true,valid=true,pause=null}={}){
 const reached=deferred(),resume=deferred(),calls=[];
 const step=async name=>{calls.push(name);if(pause===name){reached.resolve();await resume.promise;}};
 const elements={chatNickname:{value:'Tester'},chatJoin:{reportValidity:()=>valid,querySelector:()=>({disabled:false})},chatConsent:{checked},chatConnected:{}};
 const c={dialog:{open},joining:false,generation:0,user:null,auth:{currentUser:null,authStateReady:()=>step('authReady')},db:{},
  el:id=>elements[id],status(){},tr:(s,e)=>e,sdk:()=>step('sdk'),
  window:{petCareFamily:{requireStandard:()=>true},dispatchEvent(){}},Event:class {},localStorage:{setItem(){calls.push('remember');}},paint(){},
  api:{signInAnonymously:async()=>{await step('signIn');return {user:{uid:'tester'}};},
   doc:()=>({}),getDoc:async()=>{await step('profileRead');return {exists:()=>false};},
   setDoc:async()=>step('profileWrite'),Timestamp:{fromMillis:x=>x},
   onSnapshot:()=>()=>{},query(){},collection(){},orderBy(){},limit(){}}};
 runInNewContext(handler+';this.start=joinChat;',c);
 const joining=c.start({preventDefault(){}});
 if(pause){await reached.promise;c.dialog.open=false;c.generation++;resume.resolve();}
 await joining;
 return calls;
}
assert.deepEqual(await check({checked:false}),[],'No SDK without consent, including synthetic submission');
assert.deepEqual(await check({valid:false}),[],'Invalid form must not start SDK');
assert.deepEqual(await check({open:false}),[],'A closed dialog cannot connect');
for(const [pause,forbidden]of [['sdk','authReady'],['authReady','signIn'],['signIn','profileRead'],['profileRead','profileWrite']]){
 const calls=await check({pause});assert.ok(!calls.includes(forbidden),`Closing during ${pause} must prevent ${forbidden}`);
}
assert.ok((await check()).includes('remember'),'A valid, uninterrupted join still works');
console.log('PASS remembered catalog stays offline until refresh; consent, closed dialog and cancellation at SDK/auth/profile boundaries.');
