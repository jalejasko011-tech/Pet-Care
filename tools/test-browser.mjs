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
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:')&&!r.url().startsWith('blob:http://127.0.0.1:'))network.push(r.url());});
 page.on('dialog',d=>d.accept());
 await page.goto(`http://127.0.0.1:${server.address().port}/`);
 await page.selectOption('#languageSelect','en');
 await page.screenshot({path:'pet-care-background-preview.png',fullPage:true});
 assert.equal(await page.locator('#footerNote a').getAttribute('href'),'privacy.html');
 assert.equal(await page.locator('.top #exportBtn').count(),0);
 assert.equal(await page.locator('#settingsShortcut').evaluate(e=>getComputedStyle(e).backgroundColor),await page.locator('[data-action=addpet]').evaluate(e=>getComputedStyle(e).backgroundColor));
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
 // Browser Back/Forward follows in-app routes and closes one form at a time.
 await page.locator('#settingsShortcut').click();await page.locator('#settingsMemories').click();
 await page.goBack();assert.equal(await page.evaluate(()=>tab),'settings');
 await page.goBack();assert.equal(await page.evaluate(()=>tab),'home');
 await page.locator('[data-action="addpet"]').click();assert.equal(await page.locator('#petForm').count(),1);
 await page.goBack();assert.equal(await page.evaluate(()=>tab),'home');assert.equal(await page.evaluate(()=>data.pets.length),0);
 await page.locator('#settingsShortcut').click();await page.goBack();await page.goForward();assert.equal(await page.evaluate(()=>tab),'settings');await page.goBack();

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
 await page.screenshot({path:'settings-preview.png',fullPage:true});
 await page.locator('#resetAppearance').click();
 await page.locator('[data-tab="memories"]').click();await page.locator('#memoryForm').waitFor();
 await page.locator('#memoryForm [name=title]').fill('First walk <img src=x onerror=alert(1)>');
 await page.locator('#memoryForm [name=story]').fill('A private story about Luna.');
 await page.locator('#memoryForm [name=files]').setInputFiles([{name:'pet.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j4GQAAAAASUVORK5CYII=','base64')},{name:'walk.mp4',mimeType:'video/mp4',buffer:Buffer.from('AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAN2bW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAAfQAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAqB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAAfQAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAEAAAABAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAH0AAAIAAABAAAAAAIYbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAAoAAAAFABVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABw21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAYNzdGJsAAAAv3N0c2QAAAAAAAAAAQAAAK9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAEAAQABIAAAASAAAAAAAAAABFUxhdmM2MC4zMS4xMDIgbGlieDI2NAAAAAAAAAAAAAAAGP//AAAANWF2Y0MBZAAK/+EAGGdkAAqs2UQmwEQAAAMABAAAAwBQPEiWWAEABmjr48siwP34+AAAAAAQcGFzcAAAAAEAAAABAAAAFGJ0cnQAAAAAAAAw8AAAMPAAAAAYc3R0cwAAAAAAAAABAAAABQAABAAAAAAUc3RzcwAAAAAAAAABAAAAAQAAADhjdHRzAAAAAAAAAAUAAAABAAAIAAAAAAEAABQAAAAAAQAACAAAAAABAAAAAAAAAAEAAAQAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAAFAAAAAQAAAChzdHN6AAAAAAAAAAAAAAAFAAAC3QAAAA4AAAAMAAAADAAAAAwAAAAUc3RjbwAAAAAAAAABAAADpgAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNjAuMTYuMTAwAAAACGZyZWUAAAMXbWRhdAAAAq4GBf//qtxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxNjQgcjMxMDggMzFlMTlmOSAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMjMgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0xIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDM6MHgxMTMgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTEgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz0yIGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MyBiX3B5cmFtaWQ9MiBiX2FkYXB0PTEgYl9iaWFzPTAgZGlyZWN0PTEgd2VpZ2h0Yj0xIG9wZW5fZ29wPTAgd2VpZ2h0cD0yIGtleWludD0yNTAga2V5aW50X21pbj0xMCBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAACdliIQAEP/+5sD5llUNV3/2YjwHgLSLlJeKSOrCiJeV3ezaG+F4beEAAAAKQZokbEN//qePiAAAAAhBnkJ4h38FvQAAAAgBnmF0Q38HfAAAAAgBnmNqQ38HfQ==','base64')}]);
 await page.locator('#saveMemory').click();await page.locator('[data-memory]').waitFor();
 assert.equal(await page.locator('[data-memory] img').count(),1);assert.equal(await page.locator('[data-memory] video').count(),1);
 assert.equal(await page.locator('[data-memory] img[onerror]').count(),0);
 await page.waitForFunction(()=>document.querySelector('[data-memory] video').readyState>=1);
 assert.ok(await page.locator('[data-memory] video').evaluate(v=>v.duration>0));
 await page.screenshot({path:'private-memories-preview.png',fullPage:true});
 await page.locator('[data-memory-edit]').click();await page.locator('#memoryForm [name=story]').fill('Updated private story');await page.locator('#saveMemory').click();
 await page.waitForFunction(async()=>(await petCareMemories.all())[0]?.text==='Updated private story');
 await page.locator('[data-memory-favorite]').click();await page.waitForFunction(async()=>(await petCareMemories.all())[0]?.favorite===true);
 await page.reload();await page.locator('[data-tab="memories"]').click();await page.locator('[data-memory]').waitFor();
 const memoryDownload=page.waitForEvent('download');await page.evaluate(()=>petCareMemories.backup());
 const backupPath=await (await memoryDownload).path();const backupData=JSON.parse(await readFile(backupPath,'utf8'));
 assert.equal(backupData.records[0].media.length,2);assert.equal(backupData.records[0].media[1].base64,'AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAN2bW9vdgAAAGxtdmhkAAAAAAAAAAAAAAAAAAAD6AAAAfQAAQAAAQAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAqB0cmFrAAAAXHRraGQAAAADAAAAAAAAAAAAAAABAAAAAAAAAfQAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAEAAAABAAAAAAAAkZWR0cwAAABxlbHN0AAAAAAAAAAEAAAH0AAAIAAABAAAAAAIYbWRpYQAAACBtZGhkAAAAAAAAAAAAAAAAAAAoAAAAFABVxAAAAAAALWhkbHIAAAAAAAAAAHZpZGUAAAAAAAAAAAAAAABWaWRlb0hhbmRsZXIAAAABw21pbmYAAAAUdm1oZAAAAAEAAAAAAAAAAAAAACRkaW5mAAAAHGRyZWYAAAAAAAAAAQAAAAx1cmwgAAAAAQAAAYNzdGJsAAAAv3N0c2QAAAAAAAAAAQAAAK9hdmMxAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAEAAQABIAAAASAAAAAAAAAABFUxhdmM2MC4zMS4xMDIgbGlieDI2NAAAAAAAAAAAAAAAGP//AAAANWF2Y0MBZAAK/+EAGGdkAAqs2UQmwEQAAAMABAAAAwBQPEiWWAEABmjr48siwP34+AAAAAAQcGFzcAAAAAEAAAABAAAAFGJ0cnQAAAAAAAAw8AAAMPAAAAAYc3R0cwAAAAAAAAABAAAABQAABAAAAAAUc3RzcwAAAAAAAAABAAAAAQAAADhjdHRzAAAAAAAAAAUAAAABAAAIAAAAAAEAABQAAAAAAQAACAAAAAABAAAAAAAAAAEAAAQAAAAAHHN0c2MAAAAAAAAAAQAAAAEAAAAFAAAAAQAAAChzdHN6AAAAAAAAAAAAAAAFAAAC3QAAAA4AAAAMAAAADAAAAAwAAAAUc3RjbwAAAAAAAAABAAADpgAAAGJ1ZHRhAAAAWm1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAALWlsc3QAAAAlqXRvbwAAAB1kYXRhAAAAAQAAAABMYXZmNjAuMTYuMTAwAAAACGZyZWUAAAMXbWRhdAAAAq4GBf//qtxF6b3m2Ui3lizYINkj7u94MjY0IC0gY29yZSAxNjQgcjMxMDggMzFlMTlmOSAtIEguMjY0L01QRUctNCBBVkMgY29kZWMgLSBDb3B5bGVmdCAyMDAzLTIwMjMgLSBodHRwOi8vd3d3LnZpZGVvbGFuLm9yZy94MjY0Lmh0bWwgLSBvcHRpb25zOiBjYWJhYz0xIHJlZj0zIGRlYmxvY2s9MTowOjAgYW5hbHlzZT0weDM6MHgxMTMgbWU9aGV4IHN1Ym1lPTcgcHN5PTEgcHN5X3JkPTEuMDA6MC4wMCBtaXhlZF9yZWY9MSBtZV9yYW5nZT0xNiBjaHJvbWFfbWU9MSB0cmVsbGlzPTEgOHg4ZGN0PTEgY3FtPTAgZGVhZHpvbmU9MjEsMTEgZmFzdF9wc2tpcD0xIGNocm9tYV9xcF9vZmZzZXQ9LTIgdGhyZWFkcz0yIGxvb2thaGVhZF90aHJlYWRzPTEgc2xpY2VkX3RocmVhZHM9MCBucj0wIGRlY2ltYXRlPTEgaW50ZXJsYWNlZD0wIGJsdXJheV9jb21wYXQ9MCBjb25zdHJhaW5lZF9pbnRyYT0wIGJmcmFtZXM9MyBiX3B5cmFtaWQ9MiBiX2FkYXB0PTEgYl9iaWFzPTAgZGlyZWN0PTEgd2VpZ2h0Yj0xIG9wZW5fZ29wPTAgd2VpZ2h0cD0yIGtleWludD0yNTAga2V5aW50X21pbj0xMCBzY2VuZWN1dD00MCBpbnRyYV9yZWZyZXNoPTAgcmNfbG9va2FoZWFkPTQwIHJjPWNyZiBtYnRyZWU9MSBjcmY9MjMuMCBxY29tcD0wLjYwIHFwbWluPTAgcXBtYXg9NjkgcXBzdGVwPTQgaXBfcmF0aW89MS40MCBhcT0xOjEuMDAAgAAAACdliIQAEP/+5sD5llUNV3/2YjwHgLSLlJeKSOrCiJeV3ezaG+F4beEAAAAKQZokbEN//qePiAAAAAhBnkJ4h38FvQAAAAgBnmF0Q38HfAAAAAgBnmNqQ38HfQ==');
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
 await page.locator('#settingsShortcut').click();const download=page.waitForEvent('download');await page.locator('#settingsExport').click();assert.ok((await download).suggestedFilename().endsWith('.json'));
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
