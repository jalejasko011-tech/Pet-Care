import {unlockAdult} from './family-test-helper.mjs';
import { _android } from 'playwright';
import assert from 'node:assert/strict';
const [device]=await _android.devices();
assert.ok(device,'Android emulator missing');
const webview=await device.webView({pkg:'com.petcare.companion'});
try {
 const page=await webview.page();
 assert.ok(page,'Android WebView page missing');
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const openSection=async id=>{const button=page.locator(`[data-tab="${id}"]`);if(!await button.isVisible())await page.locator('#moreSectionsShortcut').click();await button.click();};

 await page.locator('#content').waitFor();
 const familyRequests=[];const appOrigin=new URL(page.url()).origin;
 page.on('request',r=>{if(!['data:','blob:'].includes(new URL(r.url()).protocol)&&new URL(r.url()).origin!==appOrigin)familyRequests.push(r.url());});
 await page.reload();assert.equal(await page.evaluate(()=>petCareFamily.isStandard()),true);assert.equal(await page.locator('#parentPanel,#parentBirth,#parentCode').count(),0);
 await Promise.all([page.waitForEvent('load'),page.locator('#familyModeButton').click()]);await page.locator('body.family-view').waitFor();
 assert.equal(await page.evaluate(()=>petCareFamily.isStandard()),false);
 assert.equal(await page.locator('#globalChatShortcut').isVisible(),false);
 await page.evaluate(async()=>{await refreshCatalog();});
 assert.deepEqual(familyRequests,[],'Restricted Android WebView must not load chat or supplier SDK/network');
 console.log('PASS Android direct entry without date/code; optional family view makes no external requests.');
 await unlockAdult(page);
 await page.selectOption('#languageSelect','en');
 await page.locator('#nav > button[data-tab="family"]').click();assert.equal(await page.locator('#familyConnect').isVisible(),true);assert.equal(await page.locator('#nav > button[data-tab="family"]').getAttribute('aria-current'),'page');await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>tab==='home');
 const tabs=await page.locator('#nav [data-tab]').evaluateAll(bs=>bs.map(b=>b.dataset.tab));
 await page.locator('[data-action="addpet"]').click();
 await page.locator('#petForm [name=name]').fill('Android test pet');
 await page.locator('#petAgeYears').fill('2');await page.locator('#petAgeMonths').fill('3');
 await page.locator('#petForm button').last().click();
 assert.equal(await page.evaluate(()=>data.pets.length),1);
 await page.evaluate(()=>editPet(data.pets[0].id));
 await page.locator('#petForm [name=name]').fill('Android edited pet');
 await page.locator('#petForm button').last().click();
 await page.reload();
 assert.equal(await page.evaluate(()=>data.pets[0].name),'Android edited pet');
 assert.equal(await page.evaluate(()=>data.pets[0].ageTotalMonths),27);assert.equal(await page.evaluate(()=>data.pets[0].birth),'');
 assert.equal(await page.evaluate(()=>petCareNavigation.ready),true,'Native Android Back listener missing');
 await openSection('diagnostics');await page.waitForFunction(()=>document.getElementById('reminderAccess')?.dataset.permission==='granted');assert.equal(await page.locator('[data-alarm-allow]').isVisible(),false);
 await openSection('home');await page.locator('#settingsShortcut').click();await page.locator('#settingsMemories').click();await page.locator('#memoryForm').waitFor();
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>tab==='settings');
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>tab==='home');

 await page.locator('#settingsShortcut').click();await page.locator('#content a[href="privacy.html"]').click();await page.waitForURL('**/privacy.html');
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>typeof petCareNavigation!=='undefined'&&tab==='settings');
 assert.equal(await page.evaluate(()=>petCareNavigation.ready),true);
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>tab==='home');
 await openSection('health');await page.evaluate(()=>{formMode='health';render();});
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>tab==='health'&&formMode===null);
 assert.equal(await page.locator('#globalChatShortcut,#globalChatDialog').count(),0,'Public chat must be absent from Android');
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>tab==='home');
 // Return to the first history entry, then one Back must keep the app open.
 while(await page.evaluate(()=>petCareNavigation.getState().depth)>0){const before=await page.evaluate(()=>petCareNavigation.getState().depth);await page.evaluate(()=>petCareNavigation.back());await page.waitForFunction(n=>petCareNavigation.getState().depth<n,before);}
 await device.shell('input keyevent KEYCODE_BACK');await page.waitForFunction(()=>document.getElementById('toast').textContent.includes('Press Back again'));
 assert.match((await device.shell('pidof com.petcare.companion')).toString().trim(),/^\d+$/);
 console.log('PASS physical Android Back key: previous tab, close form, public chat absence, root exit protection.');

 for(const tab of tabs){await openSection(tab);assert.ok((await page.locator('#content').innerText()).trim());}
 assert.equal(await page.locator('#footerNote a').count(),1);
 await page.locator('#settingsShortcut').click();await page.selectOption('#appWallpaper','lavender');
 await openSection('memories');await page.locator('#memoryForm').waitFor();
 await page.locator('#memoryForm [name=title]').fill('Private Android memory');await page.locator('#memoryForm [name=story]').fill('Saved on this device');
 await page.locator('#saveMemory').click();await page.locator('[data-memory]').waitFor();await page.reload();
 assert.equal(await page.evaluate(async()=>(await petCareMemories.all())[0].title),'Private Android memory');
 assert.equal(await page.evaluate(()=>petCarePreferences.get().app),'lavender');
 console.log('PASS Android private memory and appearance survive WebView reload.');


 await device.shell('svc wifi disable');await device.shell('svc data disable');
 try{
  await page.reload();await page.locator('#content').waitFor();await unlockAdult(page);
  assert.equal(await page.evaluate(()=>data.pets[0].name),'Android edited pet');
 assert.equal(await page.evaluate(()=>data.pets[0].ageTotalMonths),27);assert.equal(await page.evaluate(()=>data.pets[0].birth),'');
  const backup=await page.evaluate(async()=>{await petCareBackup.ready;const built=await petCareBackup.build(),fs=window.Capacitor.Plugins.Filesystem;const base64=await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(new Blob([built.bytes]));});await fs.writeFile({path:'petcare-backup-test.zip',data:base64,directory:'CACHE'});const file=await fs.readFile({path:'petcare-backup-test.zip',directory:'CACHE'}),bytes=Uint8Array.from(atob(file.data),c=>c.charCodeAt(0));const parsed=petCareBackup.parse(bytes);await fs.deleteFile({path:'petcare-backup-test.zip',directory:'CACHE'});return {same:bytes.length===built.bytes.length,pets:parsed.data.pets.length,memories:parsed.memories.length};});
  assert.deepEqual(backup,{same:true,pets:1,memories:1});
  console.log('PASS offline Android reload, native Filesystem complete-backup roundtrip and private-memory persistence.');
 }finally{await device.shell('svc wifi enable');await device.shell('svc data enable');}
 // Capture only synthetic test records for store review, not real user content.
 await openSection('home');await page.screenshot({path:'android-test-evidence/store-home.png'});
 await openSection('feeding');await page.screenshot({path:'android-test-evidence/store-feeding.png'});
 await openSection('memories');await page.screenshot({path:'android-test-evidence/store-memories.png'});
 await page.locator('#settingsShortcut').click();await page.screenshot({path:'android-test-evidence/store-settings.png'});
 await page.evaluate(()=>{tab='reminders';formMode='reminder';render();});
 await page.locator('#reminderForm [name=title]').fill('PETCARE_EASY_TIME_UI');
 await page.getByRole('button',{name:'In 10 min',exact:true}).click();
 const selected=await page.locator('#reminderForm').evaluate(f=>({date:f.elements.nextDate.value,time:f.elements.time.value}));
 await page.locator('#reminderForm button').last().click();
 await page.waitForFunction(()=>window.petCareNative.lastSchedule?.state==='scheduled');
 assert.deepEqual(await page.evaluate(()=>({date:data.reminders.at(-1).nextDate,time:data.reminders.at(-1).time})),selected);
 const easyPending=await page.evaluate(()=>Capacitor.Plugins.LocalNotifications.getPending());
 assert.ok(easyPending.notifications.some(n=>n.body?.includes('PETCARE_EASY_TIME_UI')||n.title?.includes('PETCARE_EASY_TIME_UI')),'Reminder from numeric form did not reach native scheduler');
 await page.evaluate(()=>{tab='reminders';formMode='reminder';render();});
 await page.reload();await page.locator('#reminderFormDay').waitFor();
 await page.waitForFunction(()=>window.petCareNative.lastSchedule?.state==='scheduled');
 await page.locator('#reminderForm').screenshot({path:'android-test-evidence/reminder-date-time.png'});
 console.log('PASS Android numeric date/time form and quick shortcut save the selected local date/time and reach native notification scheduling.');
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
