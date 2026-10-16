import { _android } from 'playwright';
import assert from 'node:assert/strict';
const [device]=await _android.devices();
assert.ok(device,'Android emulator missing');
const webview=await device.webView({pkg:'com.petcare.companion'});
try {
 const page=await webview.page();
 assert.ok(page,'Android WebView page missing');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.locator('#content').waitFor();
 await page.selectOption('#languageSelect','en');
 const tabs=await page.locator('#nav [data-tab]').evaluateAll(bs=>bs.map(b=>b.dataset.tab));
 await page.locator('[data-action="addpet"]').click();
 await page.locator('#petForm [name=name]').fill('Android test pet');
 await page.locator('#petForm button').last().click();
 assert.equal(await page.evaluate(()=>data.pets.length),1);
 await page.evaluate(()=>editPet(data.pets[0].id));
 await page.locator('#petForm [name=name]').fill('Android edited pet');
 await page.locator('#petForm button').last().click();
 await page.reload();
 assert.equal(await page.evaluate(()=>data.pets[0].name),'Android edited pet');
 assert.equal(await page.evaluate(()=>petCareNavigation.ready),true,'Native Android Back listener missing');
 await page.locator('[data-tab="home"]').click();await page.locator('#settingsShortcut').click();await page.locator('#settingsMemories').click();await page.locator('#memoryForm').waitFor();
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>tab==='settings');
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>tab==='home');

 await page.locator('#settingsShortcut').click();await page.locator('#content a[href="privacy.html"]').click();await page.waitForURL('**/privacy.html');
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>typeof petCareNavigation!=='undefined'&&tab==='settings');
 assert.equal(await page.evaluate(()=>petCareNavigation.ready),true);
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>tab==='home');
 await page.locator('[data-tab="health"]').click();await page.evaluate(()=>{formMode='health';render();});
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>tab==='health'&&formMode===null);
 await page.locator('#globalChatShortcut').click();await page.locator('#globalChatDialog').waitFor({state:'visible'});
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>!document.getElementById('globalChatDialog').open);assert.equal(await page.evaluate(()=>tab),'health');
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>tab==='home');
 // Return to the first history entry, then one Back must keep the app open.
 while(await page.evaluate(()=>petCareNavigation.getState().depth)>0){const before=await page.evaluate(()=>petCareNavigation.getState().depth);await page.evaluate(()=>petCareNavigation.back());await page.waitForFunction(n=>petCareNavigation.getState().depth<n,before);}
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>document.getElementById('toast').textContent.includes('Press Back again'));
 assert.match((await device.shell('pidof com.petcare.companion')).toString().trim(),/^\d+$/);
 console.log('PASS physical Android Back key: previous tab, close form, close chat first, root exit protection.');

 for(const tab of tabs){await page.locator(`[data-tab="${tab}"]`).click();assert.ok((await page.locator('#content').innerText()).trim());}
 assert.equal(await page.locator('#footerNote a').count(),1);
 await page.locator('#settingsShortcut').click();await page.selectOption('#appWallpaper','lavender');
 await page.locator('[data-tab="memories"]').click();await page.locator('#memoryForm').waitFor();
 await page.locator('#memoryForm [name=title]').fill('Private Android memory');await page.locator('#memoryForm [name=story]').fill('Saved on this device');
 await page.locator('#saveMemory').click();await page.locator('[data-memory]').waitFor();await page.reload();
 assert.equal(await page.evaluate(async()=>(await petCareMemories.all())[0].title),'Private Android memory');
 assert.equal(await page.evaluate(()=>petCarePreferences.get().app),'lavender');
 console.log('PASS Android private memory and appearance survive WebView reload.');

 const result=await page.evaluate(async()=>{
  const api=window.Capacitor?.Plugins?.LocalNotifications;
  if(!api)throw Error('Native notifications plugin missing');
  const at=new Date(Date.now()+3600000);
  await api.schedule({notifications:[{id:1900000001,title:'Pet Care test',body:'Scheduled reminder check',schedule:{at},extra:{petCare:true}}]});
  const pending=await api.getPending();
  const exists=pending.notifications.some(n=>n.id===1900000001);
  await api.cancel({notifications:[{id:1900000001}]});
  return exists;
 });
 assert.equal(result,true,'Native reminder was not scheduled');
 const chime=await page.evaluate(async()=>{await window.petCareNative.sync([],[]);const channels=await window.Capacitor.Plugins.LocalNotifications.listChannels();return channels.channels.find(c=>c.id==='petcare_cheerful_v1');});
 assert.ok(chime,'Pet Care sound channel missing');assert.match(chime.sound,/petcare_cheerful/);
 console.log('PASS native Pet Care notification channel uses bundled custom chime. Audible volume/DND behavior needs a physical phone.');
 assert.deepEqual(errors,[]);
 console.log(`PASS: Android WebView create/edit/persist, ${tabs.length} tabs, privacy link, native notification schedule/query/cancel.`);
 // Exercise the app's reminder bridge, then terminate its background process.
 const scheduled=await page.evaluate(async()=>{
  const when=new Date(Date.now()+90000);when.setSeconds(0,0);
  const date=[when.getFullYear(),String(when.getMonth()+1).padStart(2,'0'),String(when.getDate()).padStart(2,'0')].join('-');
  const time=[when.getHours(),when.getMinutes()].map(x=>String(x).padStart(2,'0')).join(':');
  const outcome=await window.petCareNative.sync([{id:'closed-app-delivery',petId:data.pets[0].id,title:'PETCARE_CLOSED_APP_DELIVERY',nextDate:date,time}],data.pets);
  if(!outcome.permission||outcome.count!==1)throw Error('App reminder sync did not schedule');
  return when.getTime();
 });
 await device.shell('input keyevent KEYCODE_HOME');
 const pid=(await device.shell('pidof com.petcare.companion')).toString().trim();
 assert.match(pid,/^\d+$/,'Expected a single Android app process');
 // run-as is available only for this debuggable test APK; SIGKILL models OS process eviction without package force-stop.
 await device.shell('run-as com.petcare.companion kill -9 '+pid);
 await new Promise(r=>setTimeout(r,1000));
 assert.equal((await device.shell('pidof com.petcare.companion')).toString().trim(),'','App process remained alive after process termination');
 let delivered=false;
 const deadline=scheduled+180000;
 while(Date.now()<deadline){
  const output=(await device.shell('dumpsys notification --noredact')).toString();
  // NotificationRecord is an active system notification, not a queued alarm.
  const active=output.split('NotificationRecord(').slice(1).some(x=>x.includes('pkg=com.petcare.companion')&&x.includes('PETCARE_CLOSED_APP_DELIVERY'));
  if(active){delivered=true;break;}
  await new Promise(r=>setTimeout(r,5000));
 }
 assert.equal(delivered,true,'Reminder was not delivered after app moved to background and its process was killed');
 console.log('PASS: Android posted the scheduled app reminder after HOME and confirmed process termination (not force-stop).');
 console.log('Physical phone, OEM battery restrictions, force-stop and Play Protect remain outside this emulator test.');
} finally {await device.close();}
