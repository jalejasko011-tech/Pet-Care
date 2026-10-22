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
 const context=await browser.newContext({viewport:{width:360,height:800},serviceWorkers:'block',timezoneId:'Europe/Belgrade'});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/`);await unlockAdult(page);
 await page.selectOption('#languageSelect','sr');
 await page.locator('[data-action="addpet"]').click();await page.locator('#petForm [name=name]').fill('Luna');await page.locator('#petForm button').last().click();
 const open=async(tabName='reminders')=>page.evaluate(t=>{tab=t;formMode=t==='reminders'?'reminder':null;render();},tabName);
 const parts=async(y,m,d,h='',min='')=>{for(const [id,value] of Object.entries({Year:y,Day:d,Hour:h,Minute:min}))await page.locator('#reminderForm'+id).fill(value);await page.locator('#reminderFormMonth').selectOption(m);};
 const save=()=>page.locator('#reminderForm button').last().click();
 await open();await page.locator('#reminderForm [name=title]').fill('Leap day');
 await parts('2027','2','29','24','00');await save();assert.equal(await page.evaluate(()=>data.reminders.length),0);
 await parts('2028','2','29','24','00');await save();assert.equal(await page.evaluate(()=>data.reminders.length),0);
 await page.locator('#reminderFormHour').fill('9');await page.locator('#reminderFormMinute').fill('5');
 await page.selectOption('#languageSelect','en');
 assert.equal(await page.locator('#reminderFormYear').inputValue(),'2028');assert.equal(await page.locator('#reminderFormDay').inputValue(),'29');assert.equal(await page.locator('#reminderFormMonth').inputValue(),'2');assert.equal(await page.locator('#reminderFormHour').inputValue(),'9');
 await save();assert.deepEqual(await page.evaluate(()=>({date:data.reminders[0].nextDate,time:data.reminders[0].time})),{date:'2028-02-29',time:'09:05'});
 await page.reload();assert.equal(await page.evaluate(()=>data.reminders[0].time),'09:05');
 await open();await page.locator('#reminderForm [name=title]').fill('Optional time');await parts('2028','4','31');await save();assert.equal(await page.evaluate(()=>data.reminders.length),1);
 await parts('2028','4','30','9','');await save();assert.equal(await page.evaluate(()=>data.reminders.length),1);
 await page.locator('#reminderFormHour').fill('');await save();assert.equal(await page.evaluate(()=>data.reminders.at(-1).time),'');
 await open();await page.clock.setFixedTime(new Date('2028-12-31T22:55:00Z'));
 await page.getByRole('button',{name:'In 10 min',exact:true}).click();
 assert.deepEqual(await page.locator('#reminderForm').evaluate(f=>({date:f.elements.nextDate.value,time:f.elements.time.value})),{date:'2029-01-01',time:'00:05'});
 await page.getByRole('button',{name:'Today',exact:true}).click();assert.equal(await page.locator('#reminderForm [name=nextDate]').inputValue(),'2028-12-31');
 await page.getByRole('button',{name:'Tomorrow',exact:true}).click();assert.equal(await page.locator('#reminderForm [name=nextDate]').inputValue(),'2029-01-01');
 await page.getByText('Choose from calendar',{exact:true}).click();const picker=page.locator('#reminderForm input[type=date]');await picker.fill('2030-05-17');await picker.dispatchEvent('change');
 assert.equal(await page.locator('#reminderFormDay').inputValue(),'17');assert.equal(await page.locator('#reminderFormYear').inputValue(),'2030');
 await page.getByRole('button',{name:'In 1 hour',exact:true}).click();assert.equal(await page.locator('#reminderForm [name=time]').inputValue(),'00:55');
 for(const width of [320,360,390,768]){await page.setViewportSize({width,height:900});for(const lang of ['sr','en','ar']){
  await page.selectOption('#languageSelect',lang);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2),'No horizontal overflow '+width+'/'+lang);
  const boxes=await page.locator('.reminder-date-parts input,.reminder-date-parts select,.reminder-time-parts input,.reminder-date-shortcuts button').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,right:r.right,height:r.height};}));assert.ok(boxes.every(r=>r.x>=0&&r.right<=width+1&&r.height>=44),'Visible 44px controls '+width+'/'+lang);
 }}
 await page.setViewportSize({width:390,height:950});await page.selectOption('#languageSelect','sr');await page.locator('#reminderForm').screenshot({path:'reminder-date-time-preview.png'});
 await open('routine');assert.equal(await page.locator('#routineFormHour').inputValue(),'09');assert.equal(await page.locator('#routineFormMinute').inputValue(),'00');
 await page.locator('#routineForm [name=title]').fill('Walk');await page.getByRole('button',{name:'Za 10 min',exact:true}).click();await page.locator('#routineForm button').last().click();
 assert.equal(await page.evaluate(()=>data.reminders.at(-1).time),'00:05');assert.equal(await page.evaluate(()=>data.reminders.at(-1).nextDate),'2029-01-01');
 assert.deepEqual(errors,[]);await context.close();
 console.log('PASS reminder and routine numeric entry, leap-day/time validation, optional time, language draft preservation, local-midnight/year rollover shortcuts, calendar, persistence and 320–768px SR/EN/RTL targets.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
