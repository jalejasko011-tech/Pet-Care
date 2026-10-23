import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve('www'),server=createServer(async(req,res)=>{try{const path=resolve(root,'.'+(new URL(req.url,'http://localhost').pathname==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));if(!path.startsWith(root+'/')){res.writeHead(403).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.wav':'audio/wav'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.selectOption('#languageSelect','sr');await page.locator('[data-action=addpet]').click();await page.locator('#petForm [name=name]').fill('Luna');
 await page.evaluate(()=>{window.originalStorageSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===KEY)throw new DOMException('Full storage fixture','QuotaExceededError');return originalStorageSet.call(this,k,v);};});
 await page.locator('#petForm button:not([type=button])').click();await page.waitForFunction(()=>!document.getElementById('petForm').dataset.saving);assert.equal(await page.locator('#petForm [name=name]').inputValue(),'Luna');assert.equal(await page.evaluate(()=>data.pets.length),0);assert.equal(await page.evaluate(()=>formMode),'pet');assert.match(await page.locator('#toast').textContent(),/Nema dovoljno prostora/);
 await page.evaluate(()=>Storage.prototype.setItem=window.originalStorageSet);await page.locator('#petForm button:not([type=button])').click();await page.locator('#petForm').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>data.pets.length),1);
 await page.reload();assert.equal(await page.evaluate(()=>data.pets[0].name),'Luna');
 const rejected=await page.evaluate(async()=>{const before=localStorage.getItem(KEY),bad=JSON.parse(before);bad.pets[0].birth='" autofocus onfocus="window.injectedRecord=true';try{await petCareBackup.importFile(new File([JSON.stringify(bad)],'bad.json',{type:'application/json'}));return false;}catch{return localStorage.getItem(KEY)===before&&!window.injectedRecord;}});assert.equal(rejected,true);
 const original=await page.evaluate(()=>{window.goodRecords=localStorage.getItem(KEY);localStorage.setItem('safety-test-good',goodRecords);localStorage.setItem(KEY,'{"pets":null}');return localStorage.getItem(KEY);});
 await page.reload();await page.locator('#recordRecovery').waitFor();assert.equal(await page.evaluate(()=>localStorage.getItem(KEY)),original);assert.equal(await page.evaluate(()=>save()),false);assert.equal(await page.evaluate(()=>localStorage.getItem(KEY)),original);
 await page.evaluate(async()=>{const good=localStorage.getItem('safety-test-good');await petCareBackup.importFile(new File([good],'valid.json',{type:'application/json'}));});
 await page.locator('#recordRecovery').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>data.pets[0].name),'Luna');assert.equal(await page.evaluate(()=>petCareRecords.isBlocked()),false);await page.reload();assert.equal(await page.evaluate(()=>data.pets.length),1);assert.deepEqual(errors,[]);
 console.log('PASS actual mobile UI: full-storage form/retry/reload, malformed backup rejection without injection, corrupt-original recovery barrier and validated restore.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
