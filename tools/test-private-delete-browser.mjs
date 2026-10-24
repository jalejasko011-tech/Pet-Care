import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,extname} from 'node:path';
const root=resolve('www'),server=createServer(async(req,res)=>{try{const name=new URL(req.url,'http://localhost').pathname;const path=resolve(root,'.'+(name==='/'?'/index.html':name));if(!path.startsWith(root+'/'))return res.writeHead(403).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.wav':'audio/wav'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.selectOption('#languageSelect','en');
 await page.evaluate(async()=>{
  data=seed();data.pets=[{id:'remove-me',name:'Luna',type:'Dog'},{id:'keep-me',name:'Milo',type:'Cat'}];
  for(const k of Object.keys(data))if(k!=='pets')data[k]=[{id:k+'-remove',petId:'remove-me'},{id:k+'-keep',petId:'keep-me'}];
  activePet='remove-me';save();
  await galleryTx('readwrite',s=>{s.put({id:'g-remove',petId:'remove-me',type:'image/png',name:'Luna',blob:new Blob(['removed'],{type:'image/png'})});s.put({id:'g-keep',petId:'keep-me',type:'image/png',name:'Milo',blob:new Blob(['kept'],{type:'image/png'})});});
  await petCareMemories.addMany([{id:'m-remove',petId:'remove-me',title:'Luna',text:'private',date:today(),media:[]},{id:'m-keep',petId:'keep-me',title:'Milo',text:'private',date:today(),media:[]}]);worldSave([{id:'w-remove',petId:'remove-me'},{id:'w-keep',petId:'keep-me'}]);
  window.realSet=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k===KEY)throw new DOMException('Full','QuotaExceededError');return realSet.call(this,k,v);};
 });
 assert.equal(await page.evaluate(()=>deletePet('remove-me')),false);assert.equal(await page.evaluate(()=>data.pets.length),2);assert.equal(await page.evaluate(()=>petCarePrivateDelete.isPending()),false);assert.equal(await page.evaluate(async()=>(await galleryAll()).length),2);
 await page.evaluate(()=>{Storage.prototype.setItem=realSet;window.realRemove=petCareMemories.removePet;petCareMemories.removePet=async()=>{throw Error('Interrupted media cleanup');};});
 assert.equal(await page.evaluate(()=>deletePet('remove-me')),false);assert.equal(await page.evaluate(()=>petCarePrivateDelete.isPending()),true);
 assert.equal(await page.evaluate(()=>data.pets.length),1);assert.equal(await page.evaluate(()=>Object.values(data).flat().some(x=>x.petId==='remove-me')),false);
 const blocked=await page.evaluate(async()=>{try{await petCareBackup.build();return false;}catch{return true;}});assert.equal(blocked,true);
 await page.reload();await page.waitForFunction(()=>!petCarePrivateDelete.isPending());
 const result=await page.evaluate(async()=>({pets:data.pets.map(x=>x.id),gallery:(await galleryAll()).map(x=>x.id),memories:(await petCareMemories.all()).map(x=>x.id),drafts:worldDrafts().map(x=>x.id),otherRecords:Object.entries(data).filter(([k])=>k!=='pets').every(([,v])=>v.length===1&&v[0].petId==='keep-me')}));
 assert.deepEqual(result,{pets:['keep-me'],gallery:['g-keep'],memories:['m-keep'],drafts:['w-keep'],otherRecords:true});
 await page.evaluate(()=>localStorage.setItem('petcare_pet_delete_v1',JSON.stringify({v:1,petId:'keep-me'})));await page.reload();await page.waitForFunction(()=>!petCarePrivateDelete.isPending());assert.equal(await page.evaluate(async()=>(await petCareMemories.all()).length),1,'Prepared but uncommitted deletion must not remove media');
 await page.locator('#settingsShortcut').click();assert.equal(await page.locator('a[href="moderator.html"]').count(),0);await page.locator('#accountDeletionLink').click();await page.waitForURL('**/delete-account.html');assert.match(await page.locator('body').innerText(),/Request account and associated-data deletion/);assert.equal(await page.locator('script,input[type=password]').count(),0);assert.ok(await page.locator('a[href^="mailto:"]').count());assert.deepEqual(errors,[]);
 console.log('PASS complete local pet deletion: quota rollback, all 17 collections, interrupted cleanup/reload recovery, preserved other pet/media, backup exclusion and accessible account-deletion resource.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
