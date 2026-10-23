import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const code=readFileSync('www/reminder-reliability.js','utf8');
let active=0,max=0,mode='denied',calls=[],release;
const listeners={};
const context=vm.createContext({setTimeout,clearTimeout,currentLang:()=> 'en',tab:'home',render:()=>{},data:{reminders:[],health:[],pets:[]},document:{addEventListener:(n,f)=>listeners[n]=f},window:{petCareI18n:{phrase:(sr,en)=>en},Capacitor:{getPlatform:()=> 'android',Plugins:{LocalNotifications:{checkExactNotificationSetting:async()=>({exact_alarm:mode}),changeExactNotificationSetting:async()=>{mode='granted';}}}},petCareNative:{sync:async(rs)=>{active++;max=Math.max(max,active);calls.push(rs.map(r=>r.id));await new Promise(r=>setTimeout(r,10));active--;if(rs[0]?.id==='fail')throw Error('Native failed');return {native:true,permission:true,count:rs.length};}}}});
vm.runInContext(code,context);
const n=context.window.petCareNative;
const input=[{id:'first'}];const first=n.sync(input,[]);input[0].id='mutated';const second=n.sync([{id:'second'}],[]);await Promise.all([first,second]);
assert.equal((await n.sync([{id:'approximate'}],[])).precision,'approximate');assert.match(n.scheduleNotice({native:true,permission:true,count:1,precision:'approximate'}),/approximate/);
assert.equal(max,1);assert.equal(calls[0][0],'first');assert.equal(calls[1][0],'second');
await assert.rejects(n.sync([{id:'fail'}],[]));assert.equal(n.lastSchedule.state,'error');await n.sync([{id:'recovered'}],[]);assert.equal(n.lastSchedule.state,'scheduled');
assert.equal(await n.exactStatus(),'denied');await n.requestExact();assert.equal(await n.exactStatus(),'granted');assert.equal((await n.sync([{id:'exact'}],[])).precision,'exact');
context.window.Capacitor.Plugins.LocalNotifications.checkExactNotificationSetting=async()=>{throw Error('Unsupported');};assert.equal(await n.exactStatus(),'unknown');assert.equal((await n.sync([{id:'unknown'}],[])).precision,'unknown');delete context.window.Capacitor.Plugins.LocalNotifications.checkExactNotificationSetting;assert.equal(await n.exactStatus(),'unknown');
const manifest=readFileSync('tools/configure-android.mjs','utf8');assert.ok(manifest.includes('android.permission.SCHEDULE_EXACT_ALARM'));assert.ok(!manifest.includes('android.permission.USE_EXACT_ALARM'));assert.ok(manifest.includes('android.app.action.SCHEDULE_EXACT_ALARM_PERMISSION_STATE_CHANGED'));
// A deadline must report a stalled bridge while preserving its mutation barrier.
let unblock,started=0;const timers=[];
const stalled=vm.createContext({render(){},tab:'home',data:{reminders:[],health:[],pets:[]},
 setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout(){},
 document:{addEventListener(){}},window:{petCareI18n:{phrase:(s,e)=>e},petCareNative:{lastOperation:{name:'createChannel'},sync:async()=>{started++;if(started===1)await new Promise(r=>unblock=r);return {native:true,permission:true,count:0};}}}});
vm.runInContext(code,stalled);const ns=stalled.window.petCareNative;
const pending=ns.sync([],[]),rejection=assert.rejects(pending,/Notification bridge timeout/);
await new Promise(setImmediate);timers[0]();await rejection;
assert.equal(ns.lastSchedule.reason,'nativeTimeout');assert.equal(ns.lastSchedule.operation,'createChannel');
const following=ns.sync([],[]);await new Promise(setImmediate);assert.equal(started,1,'A timed-out call must remain the native mutation barrier');
unblock();await following;assert.equal(started,2);assert.equal(ns.lastSchedule.state,'notScheduled','An empty schedule must not claim a phone notification exists');
const before=calls.length;context.document.readyState='loading';listeners.visibilitychange();await new Promise(setImmediate);assert.equal(calls.length,before,'Do not schedule through a bridge while the document is loading');
console.log('PASS serialized sync, immutable snapshots, native-failure recovery, stalled-bridge deadline without overlap, startup readiness and exact-alarm access.');

const beforeRecovery=calls.length;context.window.petCareRecords={isBlocked:()=>true};await assert.rejects(n.sync([],[]),/Record recovery/);assert.equal(calls.length,beforeRecovery,'Unreadable records must not cancel existing native alarms');context.window.petCareRecords.isBlocked=()=>false;
