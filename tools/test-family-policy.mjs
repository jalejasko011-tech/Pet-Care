import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync('www/family-policy.js','utf8');
const storage=()=>{const m=new Map();return {getItem:k=>m.get(k)||null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),dump:()=>[...m]};};
function load(local=storage(),session=storage()){
 let requests=0,opens=0,shares=0;
 const events=new EventTarget(),window={fetch:async()=>{requests++;return {};},open:()=>{opens++;},dispatchEvent:events.dispatchEvent.bind(events),addEventListener:events.addEventListener.bind(events)};
 const navigator={share:async()=>{shares++;}};
 runInNewContext(source,{window,document:{documentElement:{dataset:{}},addEventListener(){}},navigator,localStorage:local,sessionStorage:session,location:{href:'https://app.test/index.html',origin:'https://app.test'},URL,TextEncoder,Uint8Array,Event,Date,crypto:webcrypto});
 return {p:window.petCareFamily,window,navigator,local,session,counts:()=>({requests,opens,shares})};
}
const f=load();assert.equal(f.p.isStandard(),true,'Fresh installs open immediately');assert.equal('setup' in f.p,false);
f.p.lock();assert.equal(f.p.isStandard(),false);
await assert.rejects(f.window.fetch('https://supplier.test/catalog'),/PARENT_REQUIRED/);
assert.equal(f.window.open('https://shop.test'),null);await assert.rejects(f.navigator.share({text:'private'}),/PARENT_REQUIRED/);
assert.deepEqual(f.counts(),{requests:0,opens:0,shares:0});
f.p.open();assert.equal(f.p.isStandard(),true);assert.deepEqual(JSON.parse(f.local.getItem('petcare_parent_control_v1')),{v:3,mode:'standard'});
await f.window.fetch('https://supplier.test/catalog');assert.equal(f.counts().requests,1);
assert.equal(load(f.local).p.isStandard(),true,'A fresh session needs no entry form');
f.p.lock();assert.equal(load(f.local).p.isStandard(),false,'Explicit family selection survives reload');
for(const v of [1,2]){const local=storage(),session=storage();local.setItem('petcare_parent_control_v1',JSON.stringify({v,locked:true,salt:'old',hash:'old'}));session.setItem('petcare_parent_session_v1',Date.now()+900000);const migrated=load(local,session);assert.equal(migrated.p.isStandard(),true);assert.deepEqual(local.dump(),[]);assert.deepEqual(session.dump(),[]);}
// Backup allowlist must never restore parent credentials or an unlocked session.
const backup=readFileSync('www/complete-backup.js','utf8');assert.ok(!backup.includes('petcare_parent_control_v1'));assert.ok(!backup.includes('petcare_parent_session_v1'));
assert.match(readFileSync('www/global-chat.js','utf8'),/async function sdk\(\)\{\s*if\(!window\.petCareFamily\?\.requireStandard\(\)\)/);
console.log('PASS immediate entry, optional family gates, legacy migration and backup exclusion.');
