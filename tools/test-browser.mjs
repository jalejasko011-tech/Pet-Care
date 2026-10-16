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
const browser=await chromium.launch();
try {
 const context=await browser.newContext({viewport:{width:360,height:800},acceptDownloads:true,serviceWorkers:'block'});
 const page=await context.newPage(),errors=[],network=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'))network.push(r.url());});
 page.on('dialog',d=>d.accept());
 await page.goto(`http://127.0.0.1:${server.address().port}/`);
 await page.selectOption('#languageSelect','en');
 await page.screenshot({path:'pet-care-background-preview.png',fullPage:true});
 assert.equal(await page.locator('#footerNote a').getAttribute('href'),'privacy.html');
 assert.equal(await page.locator('#globalChatShortcut').evaluate(e=>getComputedStyle(e).position),'fixed');
 await page.locator('#globalChatShortcut').click();
 await page.locator('#globalChatDialog').waitFor({state:'visible'});
 assert.equal(await page.locator('#chatUnavailable').count(),0);
 assert.equal(await page.locator('#chatJoin').count(),1);
 assert.equal(await page.locator('#chatConnected').isVisible(),false);
 await page.locator('#globalChatDialog button').first().click();
 assert.equal(await page.locator('#globalChatDialog').isVisible(),false);
 assert.equal(network.length,0,'Chat before consent must make no external requests');

 await page.locator('#globalChatShortcut').click();await page.screenshot({path:'chat-wallpaper-preview.png',fullPage:true});await page.locator('#globalChatDialog button').first().click();
 const tabs=await page.locator('#nav [data-tab]').evaluateAll(bs=>bs.map(b=>b.dataset.tab));
 for(const tab of tabs){await page.locator(`[data-tab="${tab}"]`).click();assert.ok((await page.locator('#content').innerText()).trim());}
 for(const name of ['Luna','Max']){
  await page.locator('[data-action="addpet"]').click();
  await page.locator('#petForm [name=name]').fill(name);
  await page.locator('#petForm [name=kg]').fill('12.5');
  await page.locator('#petForm button').last().click();
 }
 assert.equal(await page.evaluate(()=>data.pets.length),2);
 await page.evaluate(()=>editPet(data.pets[0].id));
 await page.locator('#petForm [name=name]').fill('Luna updated');
 await page.locator('#petForm button').last().click();
 assert.equal(await page.evaluate(()=>data.pets[0].name),'Luna updated');
 // Meal records distinguish unknown history from a recorded missed interval.
 await page.locator('[data-tab="feeding"]').click();assert.match(await page.locator('[data-feeding-elapsed]').innerText(),/No meal recorded/);
 await page.locator('#feedingPlanForm [name=enabled]').check();await page.locator('#feedingPlanForm [name=times]').fill('08:00, 18:00');await page.locator('#feedingPlanForm [name=gapHours]').fill('12');await page.locator('#feedingPlanForm button').first().click();
 await page.evaluate(()=>petCareFeeding.mark(Date.now()-13*3600000));assert.match(await page.locator('#content').innerText(),/No new meal has been recorded/);
 await page.locator('[data-fed-now]').click();assert.match(await page.locator('[data-feeding-elapsed]').innerText(),/0 min/);assert.doesNotMatch(await page.locator('#content').innerText(),/No new meal has been recorded/);
 await page.reload();await page.locator('[data-tab="feeding"]').click();assert.equal(await page.locator('#feedingPlanForm [name=times]').inputValue(),'08:00, 18:00');
 const reminderPlan=await page.evaluate(async()=>{const captured=[];window.Capacitor={getPlatform:()=>'android',Plugins:{LocalNotifications:{checkPermissions:async()=>({display:'granted'}),createChannel:async c=>captured.push({channel:c}),getPending:async()=>({notifications:[]}),cancel:async()=>{},schedule:async n=>captured.push(n)}}};await window.petCareNative.sync([],data.pets);delete window.Capacitor;return captured;});
 assert.equal(reminderPlan[0].channel.sound,'petcare_cheerful.wav');assert.equal(reminderPlan[1].notifications.filter(n=>n.schedule.on).length,2);assert.equal(reminderPlan[1].notifications.filter(n=>n.schedule.at).length,1);assert.ok(reminderPlan[1].notifications.every(n=>n.channelId==='petcare_cheerful_v1'));
 await page.evaluate(()=>{activePet=data.pets[1].id;render();});await page.locator('[data-tab="feeding"]').click();assert.match(await page.locator('[data-feeding-elapsed]').innerText(),/No meal recorded/);
 await page.evaluate(()=>{activePet=data.pets[0].id;render();});
 // Independent, persistent appearance preferences and the selected notification sound.
 await page.locator('#settingsShortcut').click();
 assert.equal(await page.locator('#settingSound').inputValue(),'cheerful');
 await page.selectOption('#appWallpaper','ocean');await page.selectOption('#chatWallpaper','lavender');
 await page.selectOption('#settingFont','large');await page.reload();await page.locator('#settingsShortcut').click();
 assert.equal(await page.locator('#appWallpaper').inputValue(),'ocean');assert.equal(await page.locator('#chatWallpaper').inputValue(),'lavender');
 assert.equal(await page.locator('#settingFont').inputValue(),'large');
 await page.locator('#resetAppearance').click();
 await page.locator('[data-tab="memories"]').click();await page.locator('#memoryForm').waitFor();
 await page.locator('#memoryForm [name=title]').fill('First walk <img src=x onerror=alert(1)>');
 await page.locator('#memoryForm [name=story]').fill('A private story about Luna.');
 await page.locator('#memoryForm [name=files]').setInputFiles([{name:'pet.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j4GQAAAAASUVORK5CYII=','base64')},{name:'walk.mp4',mimeType:'video/mp4',buffer:Buffer.from('local-video-test')}]);
 await page.locator('#saveMemory').click();await page.locator('[data-memory]').waitFor();
 assert.equal(await page.locator('[data-memory] img').count(),1);assert.equal(await page.locator('[data-memory] video').count(),1);
 assert.equal(await page.locator('[data-memory] img[onerror]').count(),0);
 await page.locator('[data-memory-edit]').click();await page.locator('#memoryForm [name=story]').fill('Updated private story');await page.locator('#saveMemory').click();
 await page.waitForFunction(async()=>(await petCareMemories.all())[0]?.text==='Updated private story');
 await page.locator('[data-memory-favorite]').click();await page.waitForFunction(async()=>(await petCareMemories.all())[0]?.favorite===true);
 await page.reload();await page.locator('[data-tab="memories"]').click();await page.locator('[data-memory]').waitFor();
 const memoryDownload=page.waitForEvent('download');await page.evaluate(()=>petCareMemories.backup());
 const backupPath=await (await memoryDownload).path();const backupData=JSON.parse(await readFile(backupPath,'utf8'));
 assert.equal(backupData.records[0].media.length,2);assert.equal(Buffer.from(backupData.records[0].media[1].base64,'base64').toString(),'local-video-test');
 await page.locator('[data-memory-delete]').click();await page.waitForFunction(async()=>(await petCareMemories.all()).length===0);
 await page.locator('#settingsShortcut').click();await page.locator('#memoryBackupFile').setInputFiles(backupPath);
 await page.waitForFunction(async()=>(await petCareMemories.all()).length===1);
 await page.evaluate(()=>{activePet=data.pets[1].id;tab='memories';render();});await page.locator('#memoryForm').waitFor();assert.equal(await page.locator('[data-memory]').count(),0);
 await page.locator('#memoryForm [name=title]').fill('Max story');await page.locator('#memoryForm [name=story]').fill('Text only');await page.locator('#saveMemory').click();await page.locator('[data-memory]').waitFor();
 assert.equal(await page.evaluate(async()=>(await petCareMemories.all()).length),2);
 await page.evaluate(()=>{activePet=data.pets[0].id;render();});

 for(const [tab,mode,form,values,key] of [
  ['health','health','healthForm',{title:'Vaccine',nextDate:'2027-01-15'},'health'],
  ['diary','log','logForm',{note:'Normal appetite'},'logs'],
  ['diary','weight','weightForm',{kg:'13.2'},'weights'],
  ['food','food','foodForm',{name:'Dry food',grams:'100'},'food'],
  ['costs','cost','costForm',{amount:'1500',note:'Vet visit'},'costs'],
  ['reminders','reminder','reminderForm',{title:'Annual visit',nextDate:'2027-01-15'},'reminders']
 ]){
  const before=await page.evaluate(k=>data[k].length,key);
  await page.evaluate(([t,m])=>{tab=t;formMode=m;render()},[tab,mode]);
  for(const [field,value] of Object.entries(values))await page.locator(`#${form} [name="${field}"]`).fill(value);
  await page.locator(`#${form} button`).last().click();
  assert.equal(await page.evaluate(k=>data[k].length,key),before+1,form);
 }
 for(const tab of tabs){await page.locator(`[data-tab="${tab}"]`).click();assert.ok((await page.locator('#content').innerText()).trim());}
 for(const lang of ['sr','en']){await page.selectOption('#languageSelect',lang);assert.equal(await page.locator('#footerNote a').count(),1);}
 await page.reload();
 assert.equal(await page.evaluate(()=>data.pets.length),2);
 assert.equal(await page.evaluate(()=>data.health.length),1);
 const download=page.waitForEvent('download');await page.locator('#exportBtn').click();assert.ok((await download).suggestedFilename().endsWith('.json'));
 await page.evaluate(async()=>{
  await galleryPut({id:'test-media',petId:data.pets[0].id,type:'image/png',name:'test.png',blob:new Blob(['test'],{type:'image/png'})});
  if((await galleryAll()).length!==1)throw Error('Gallery write failed');
  await galleryRemove('test-media');
  if((await galleryAll()).length!==0)throw Error('Gallery deletion failed');
 });
 await page.evaluate(async()=>{await galleryPut({id:'delete-with-pet',petId:data.pets[0].id,type:'image/png',blob:new Blob(['test'],{type:'image/png'})});worldSave([{id:'draft',petId:data.pets[0].id}]);});
 await page.evaluate(()=>deletePet(data.pets[0].id));
 assert.equal(await page.evaluate(async()=>(await galleryAll()).length),0);
 assert.equal(await page.evaluate(()=>worldDrafts().length),0);
 assert.equal(await page.evaluate(()=>data.pets.length),1);
 assert.equal(await page.evaluate(async()=>(await petCareMemories.all()).length),1);
 assert.equal(await page.evaluate(()=>data.health.length),0);
 await page.reload();assert.equal(await page.evaluate(()=>data.pets.length),1);
 assert.deepEqual(errors,[], 'Runtime JavaScript errors');
 assert.deepEqual(network,[], 'Unexpected automatic off-device requests');
 const response=await page.goto(`http://127.0.0.1:${server.address().port}/privacy.html`);assert.equal(response.status(),200);
 assert.ok((await page.locator('body').innerText()).includes('jalejasko011@gmail.com'));
 console.log(`PASS: ${tabs.length} tabs with and without pets; create/edit/delete, records, persistence, export, gallery, SR/EN policy link, startup network.`);
 console.log('Scope: Chromium mobile viewport. This does not certify Android installation, notifications or Play Protect.');
} finally {await browser.close();await new Promise(r=>server.close(r));}
