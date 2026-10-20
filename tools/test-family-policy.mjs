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
 runInNewContext(source,{window,document:{addEventListener(){}},navigator,localStorage:local,sessionStorage:session,location:{href:'https://app.test/index.html',origin:'https://app.test'},URL,TextEncoder,Uint8Array,Event,Date,crypto:webcrypto});
 return {p:window.petCareFamily,window,navigator,local,session,counts:()=>({requests,opens,shares})};
}
const f=load();assert.equal(f.p.isAdult(),false);assert.equal(f.p.hasCode(),false);
await assert.rejects(f.window.fetch('https://supplier.test/catalog'),/PARENT_REQUIRED/);
assert.equal(f.window.open('https://shop.test'),null);await assert.rejects(f.navigator.share({text:'private'}),/PARENT_REQUIRED/);
assert.deepEqual(f.counts(),{requests:0,opens:0,shares:0});
await assert.rejects(f.p.setup('2020-01-01','73194628','73194628'),/FAMILY_VIEW/);
await assert.rejects(f.p.setup('1980-02-31','73194628','73194628'),/FAMILY_VIEW/);
await assert.rejects(f.p.setup('1980-01-01','12','12'),/INVALID_CODE/);
assert.deepEqual(f.local.dump(),[],'Neither child date nor invalid setup is persisted');
await f.p.setup('1980-01-01','73194628','73194628');assert.equal(f.p.isAdult(),true);
assert.ok(!JSON.stringify(f.local.dump()).includes('1980-01-01'));assert.ok(!JSON.stringify(f.local.dump()).includes('73194628'));
await f.window.fetch('https://supplier.test/catalog');f.window.open('https://shop.test');await f.navigator.share({text:'chosen'});
assert.deepEqual(f.counts(),{requests:1,opens:1,shares:1});
const restarted=load(f.local);assert.equal(restarted.p.isAdult(),false,'A fresh session must be locked');
await restarted.p.unlock('73194628');assert.equal(restarted.p.isAdult(),true);restarted.p.lock();assert.equal(restarted.p.isAdult(),false);
assert.equal(load(f.local,f.session).p.isAdult(),false,'Family lock overrides an older unlocked tab');
for(let i=0;i<5;i++)await assert.rejects(restarted.p.unlock('000000'),/WRONG_CODE/);
await assert.rejects(restarted.p.unlock('73194628'),/WAIT/);
// Backup allowlist must never restore parent credentials or an unlocked session.
const backup=readFileSync('www/complete-backup.js','utf8');assert.ok(!backup.includes('petcare_parent_control_v1'));assert.ok(!backup.includes('petcare_parent_session_v1'));
assert.match(readFileSync('www/global-chat.js','utf8'),/async function sdk\(\)\{\s*if\(!window\.petCareFamily\?\.requireAdult\(\)\)/);
console.log('PASS child/unknown age offline gates, invalid DOB, hashed parent code, restart/lock, throttling and backup exclusion.');
