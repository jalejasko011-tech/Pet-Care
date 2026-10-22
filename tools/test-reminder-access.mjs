import {unlockAdult} from './family-test-helper.mjs';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
const root = resolve('www');
const server = createServer(async(req,res)=>{
  try {
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!path.startsWith(root+'/')){res.writeHead(403).end();return;}
    res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.wav':'audio/wav'})[extname(path)]||'application/octet-stream');
    res.end(await readFile(path));
  }catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.PETCARE_BROWSER||undefined});
try {
 const context=await browser.newContext({viewport:{width:320,height:800},serviceWorkers:'block'}),page=await context.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.alarmProbe={mode:'denied',opens:0,pending:[],scheduledModes:[],listeners:{}};
  const p=window.alarmProbe;
  window.Capacitor={getPlatform:()=>'android',Plugins:{App:{getInfo:async()=>({version:'test'}),addListener:(name,fn)=>{p.listeners[name]=fn;return {remove:async()=>{}};}},LocalNotifications:{
   checkPermissions:async()=>({display:'granted'}),requestPermissions:async()=>({display:'granted'}),checkExactNotificationSetting:async()=>({exact_alarm:p.mode}),changeExactNotificationSetting:async()=>{p.opens++;return {exact_alarm:p.mode};},
   createChannel:async()=>{},getPending:async()=>({notifications:p.pending}),cancel:async()=>{p.pending=[];},schedule:async({notifications})=>{p.pending=notifications;p.scheduledModes.push(p.mode);},listChannels:async()=>({channels:[]})
  }}};
 });
 await page.goto(`http://127.0.0.1:${server.address().port}/`);await unlockAdult(page);await page.selectOption('#languageSelect','en');
 await page.evaluate(()=>petCareUI.open('diagnostics'));await page.waitForFunction(()=>document.getElementById('reminderAccess')?.dataset.permission==='denied');
 assert.equal(await page.locator('#reminderAccess').count(),1,'Dedicated diagnostics must include the permission panel');
 await page.getByRole('button',{name:'Allow exact reminders',exact:true}).click();assert.equal(await page.evaluate(()=>alarmProbe.opens),1);assert.equal(await page.locator('[data-alarm-allow]').isVisible(),true);assert.match(await page.locator('[data-alarm-outcome]').innerText(),/still not allowed/);
 await page.evaluate(()=>petCareUI.open('home'));await page.locator('[data-action=addpet]').click();await page.locator('#petForm [name=name]').fill('Luna');await page.locator('#petForm button').last().click();
 await page.evaluate(()=>{tab='reminders';formMode='reminder';render();});await page.locator('#reminderForm [name=title]').fill('Denied access');await page.getByRole('button',{name:'In 10 min',exact:true}).click();await page.locator('#reminderForm button').last().click();
 await page.waitForFunction(()=>petCareNative.lastSchedule?.precision==='approximate');assert.match(await page.locator('#toast').innerText(),/approximate.*delayed/);
 assert.equal(await page.evaluate(()=>data.reminders.length),1);
 await page.evaluate(()=>{tab='reminders';formMode='reminder';render();});await page.locator('#reminderForm [name=title]').fill('Keep my draft');
 await page.evaluate(()=>{alarmProbe.mode='granted';alarmProbe.listeners.appStateChange({isActive:true});});
 await page.waitForFunction(()=>document.getElementById('reminderAccess')?.dataset.permission==='granted'&&petCareNative.lastSchedule?.precision==='exact');
 assert.equal(await page.locator('[data-alarm-allow]').isVisible(),false);assert.equal(await page.locator('#reminderForm [name=title]').inputValue(),'Keep my draft');assert.equal(await page.evaluate(()=>alarmProbe.pending.length),1);assert.equal(await page.evaluate(()=>alarmProbe.scheduledModes.at(-1)),'granted');assert.equal(await page.evaluate(()=>alarmProbe.opens),1,'Resume must never launch a permission dialog');
 await page.evaluate(()=>{alarmProbe.mode='denied';alarmProbe.listeners.appStateChange({isActive:true});});await page.waitForFunction(()=>document.getElementById('reminderAccess')?.dataset.permission==='denied'&&petCareNative.lastSchedule?.precision==='approximate');
 for(const tab of ['diagnostics','reminders','routine','feeding','health','settings']){
  await page.evaluate(id=>petCareUI.open(id),tab);await page.waitForFunction(()=>document.getElementById('reminderAccess')?.dataset.permission==='denied');assert.equal(await page.locator('#reminderAccess').count(),1);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2));
 }
 await page.selectOption('#languageSelect','sr');await page.evaluate(()=>petCareUI.open('diagnostics'));await page.waitForFunction(()=>document.getElementById('reminderAccess')?.dataset.permission==='denied');
 await page.locator('#reminderAccess').screenshot({path:'reminder-access-preview.png'});
 assert.deepEqual(errors,[]);await context.close();console.log('PASS denied/granted/revoked exact-alarm access, honest approximate save feedback, explicit settings action, automatic resume rescheduling without draft loss and permission panel across all notification screens.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
