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
 for(const tab of tabs){await page.locator(`[data-tab="${tab}"]`).click();assert.ok((await page.locator('#content').innerText()).trim());}
 assert.equal(await page.locator('#footerNote a').count(),1);
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
 assert.deepEqual(errors,[]);
 console.log(`PASS: Android WebView create/edit/persist, ${tabs.length} tabs, privacy link, native notification schedule/query/cancel.`);
 console.log('Notification delivery in background and physical-device Play Protect acceptance remain outside this test.');
} finally {await device.close();}
