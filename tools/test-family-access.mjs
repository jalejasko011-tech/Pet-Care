import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {unlockParent} from './family-test-helper.mjs';
const root=resolve('www'),server=createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname,path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!path.startsWith(root+'/'))return res.writeHead(403).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.wav':'audio/wav'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const url=`http://127.0.0.1:${server.address().port}/`,browser=await chromium.launch({executablePath:process.env.PETCARE_BROWSER||undefined});
try{
 const context=await browser.newContext({viewport:{width:360,height:800},serviceWorkers:'block'}),page=await context.newPage(),errors=[],network=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(url)&&!r.url().startsWith('blob:')&&!r.url().startsWith('data:'))network.push(r.url());});
 await page.addInitScript(()=>localStorage.setItem('petcare_catalog_feed_url','https://example.invalid/products.json'));
 await page.goto(url);await page.locator('#familyReading').waitFor();
 assert.equal(await page.evaluate(()=>petCareFamily.adult),false);assert.equal(await page.locator('#globalChatShortcut').isVisible(),false);assert.equal(await page.locator('.app').isVisible(),false);
 assert.equal(await page.evaluate(async()=>{try{await fetch('https://example.invalid/send');return false;}catch{return true;}}),true);
 assert.equal(await page.evaluate(()=>window.open('https://example.invalid/')),null);
 // Navigation APIs, stored routes and language changes do not expose adult screens.
 for(const target of ['health','shop','assistant','settings','world','community']){await page.evaluate(id=>{petCareUI.open(id);petCareChat.open();petCareNavigation.back();},target);assert.equal(await page.locator('.app').isVisible(),false);assert.equal(await page.locator('#globalChatDialog').isVisible(),false);}
 for(const code of await page.locator('#familyLanguage option').evaluateAll(xs=>xs.map(x=>x.value))){await page.selectOption('#familyLanguage',code);assert.equal(await page.locator('.app').isVisible(),false);assert.equal(await page.locator('#familyLanguage').inputValue(),code);assert.equal(await page.locator('#familyReading').evaluate(el=>el.scrollWidth<=window.innerWidth),true,code);}
 await page.selectOption('#familyLanguage','en');
 await page.locator('#familyReading').getByRole('button',{name:/18\+/}).click();assert.equal(await page.locator('#familyAge').inputValue(),'');await page.locator('#familyAge').fill('12');await page.locator('#familyPin').fill('246810');await page.locator('#familyPinRepeat').fill('246810');await page.locator('#familyUnlock').click();assert.equal(await page.evaluate(()=>petCareFamily.adult),false);await page.locator('#familyParentDialog').getByRole('button',{name:'Close',exact:true}).click();
 assert.deepEqual(network,[],'Restricted startup, catalogs, chat and links must make no external requests');
 await page.evaluate(()=>localStorage.removeItem('petcare_catalog_feed_url'));
 // Prevent the test init script re-adding a supplier URL after adult setup.
 await page.route('https://example.invalid/**',route=>route.fulfill({status:200,body:'[]',contentType:'application/json'}));
 await unlockParent(page);assert.equal(await page.locator('#familyReading').count(),0);
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem(petCareFamily.key)));assert.equal(stored.hash.length,64);assert.ok(!JSON.stringify(stored).includes('246810'));assert.ok(!('age' in stored));
 await page.locator('[data-action=addpet]').click();await page.locator('#petForm [name=name]').fill('Family pet');await page.locator('#petForm button').last().click();
 await page.evaluate(async()=>{await petCareMemories.addMany([{id:'family-test',petId:data.pets[0].id,title:'Private title',text:'Private story <script>',date:'2026-10-20',media:[],favorite:false}]);});
 const backup=await page.evaluate(async()=>{await petCareBackup.ready;const backup=await petCareBackup.build();return new TextDecoder().decode(backup.bytes);});assert.ok(!backup.includes(stored.hash),'Backup must not carry parent authorization');
 // User explicitly locks; a previous anonymous identity/catalog must not resume.
 await page.locator('#familyLock').click();await page.locator('#familyReading').waitFor();network.length=0;
 await page.locator('#familyReading .family-pet').click();await page.getByText('Private story <script>',{exact:true}).waitFor();assert.equal(await page.locator('#familyReading script').count(),0);
 await page.screenshot({path:'family-reading-preview.png',fullPage:true});
 await page.locator('#familyReading').getByRole('button',{name:/18\+/}).click();assert.equal(await page.locator('#familyAge').count(),0);await page.locator('#familyPin').fill('111111');await page.locator('#familyUnlock').click();await page.getByText('Check your PIN.',{exact:true}).waitFor();assert.equal(await page.evaluate(()=>petCareFamily.adult),false);await page.locator('#familyParentDialog').getByRole('button',{name:'Close',exact:true}).click();
 await page.reload();assert.equal(await page.evaluate(()=>petCareFamily.adult),false);assert.deepEqual(network,[]);
 await unlockParent(page);
 // A separate new window/process starts restricted even with a configured PIN.
 const other=await context.newPage();await other.goto(url);assert.equal(await other.evaluate(()=>petCareFamily.adult),false);await other.close();
 // Expired parent sessions cannot survive a reload.
 await page.evaluate(()=>{const value=JSON.parse(sessionStorage.getItem(petCareFamily.sessionKey));value.expires=Date.now()-1;sessionStorage.setItem(petCareFamily.sessionKey,JSON.stringify(value));});await page.reload();assert.equal(await page.evaluate(()=>petCareFamily.adult),false);
 assert.deepEqual(errors,[]);console.log('PASS restricted network/catalog/SDK/chat, all 24 languages, neutral age, PIN, local memories, backup exclusion, lock, reload, new window and session expiry.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
