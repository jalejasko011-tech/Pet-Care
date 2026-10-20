import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {unlockAdult} from './family-test-helper.mjs';
const root=resolve('www'),server=createServer(async(req,res)=>{try{const path=resolve(root,'.'+(req.url==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));if(!path.startsWith(root+'/')){res.writeHead(403).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.webp':'image/webp'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({executablePath:process.env.PETCARE_BROWSER||undefined});
try{
 const context=await browser.newContext({viewport:{width:360,height:800},serviceWorkers:'block'}),page=await context.newPage(),network=[],errors=[];
 await context.addInitScript(()=>localStorage.setItem('petcare_catalog_feed_url','https://supplier.example/catalog.json'));
 page.on('request',r=>{if(!r.url().startsWith('http://127.0.0.1:'))network.push(r.url());});page.on('pageerror',e=>errors.push(e.message));
 const url=`http://127.0.0.1:${server.address().port}/`;await page.goto(url);
 await page.locator('body.family-view').waitFor();assert.equal(await page.locator('#globalChatShortcut').isVisible(),false);
 assert.equal(await page.locator('#settingsShortcut').isVisible(),false);assert.equal(await page.locator('[data-action=addpet]').isVisible(),false);
 // Direct route restoration, programmatic shortcut, sharing and catalog calls fail closed.
 await page.evaluate(async()=>{petCareUI.open('community');petCareChat.open();await refreshCatalog();window.open('https://shop.example');try{await petCareBackup.saveFile(new Uint8Array([1]),'private.zip');}catch{}});
 await page.locator('#parentPanel').waitFor({state:'visible'});await page.locator('#parentCancel').click();assert.equal(await page.evaluate(()=>tab),'home');
 assert.deepEqual(network,[]);
 await unlockAdult(page);await page.locator('[data-action=addpet]').click();await page.locator('#petForm [name=name]').fill('Family pet');await page.locator('#petForm button').last().click();
 const backup=await page.evaluate(async()=>{await petCareBackup.ready;const x=await petCareBackup.build();return [...x.bytes];});
 assert.ok(!(await page.evaluate(()=>JSON.stringify(localStorage))).includes('1980-01-01'));
 await page.locator('#familyModeButton').click();await page.waitForFunction(()=>!petCareFamily.isAdult()&&document.body.classList.contains('family-view'));
 await page.locator('[data-family-activity=play]').click();assert.match(await page.locator('#familyActivityStatus').innerText(),/1/);
 assert.ok(await page.locator('[data-family-activity=play]').evaluate(e=>e.getBoundingClientRect().height>=64));
 for(const lang of ['sr','ar','en']){await page.selectOption('#languageSelect',lang);assert.equal(await page.locator('#globalChatShortcut').isVisible(),false);assert.equal(await page.evaluate(()=>petCareFamily.isAdult()),false);}
 await page.reload();await page.locator('body.family-view').waitFor();assert.match(await page.locator('#familyActivityStatus').innerText(),/1/);
 const result=await page.evaluate(async bytes=>{try{await petCareBackup.apply(petCareBackup.parse(Uint8Array.from(bytes)));return 'unexpected';}catch(e){return e.message;}},backup);assert.equal(result,'PARENT_REQUIRED');
 await page.locator('#parentPanel').waitFor({state:'visible'});await page.locator('#parentCancel').click();
 await unlockAdult(page);await page.evaluate(async bytes=>{await petCareBackup.apply(petCareBackup.parse(Uint8Array.from(bytes)));},backup);
 await page.locator('#familyModeButton').click();await page.waitForFunction(()=>!petCareFamily.isAdult());assert.equal(await page.locator('#globalChatShortcut').isVisible(),false);
 assert.deepEqual(network,[]);assert.deepEqual(errors,[]);
 // A new browsing session cannot reuse the adult session capability.
 const fresh=await browser.newContext({storageState:await context.storageState(),serviceWorkers:'block'}),newPage=await fresh.newPage();await newPage.goto(url);await newPage.locator('body.family-view').waitFor();assert.equal(await newPage.evaluate(()=>petCareFamily.isAdult()),false);await fresh.close();
 console.log('PASS family mobile UI, no external requests, parent setup, large activities, lock/reload/language/route and backup protections.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
