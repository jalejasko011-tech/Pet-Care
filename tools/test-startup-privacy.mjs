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

// Retired entry points must stay inert even if an older page loads them.
for(const path of ['www/global-chat.js','www/chat-push.js','www/moderator.js']){
 const forbidden=new Proxy({}, {get(){throw Error('Retired chat attempted a side effect');}});
 runInNewContext(readFileSync(path,'utf8'),{window:forbidden,document:forbidden,navigator:forbidden,fetch(){throw Error('Retired chat network request');}});
}
assert.doesNotMatch(html,/<script[^>]+src=["'](?:global-chat|chat-push)\.js/);
const config={window:{}};runInNewContext(readFileSync('www/chat-config.js','utf8'),config);
assert.equal(config.window.PETCARE_CHAT_CONFIG.enabled,false);
assert.equal(config.window.PETCARE_FAMILY_CONFIG.enabled,true);
console.log('PASS supplier startup privacy, inert retired chat entry points, disabled chat and preserved family sharing.');
