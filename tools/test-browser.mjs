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
    res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.svg':'image/svg+xml','.png':'image/png'})[extname(path)]||'application/octet-stream');
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
 assert.equal(await page.evaluate(()=>data.health.length),0);
 await page.reload();assert.equal(await page.evaluate(()=>data.pets.length),1);
 assert.deepEqual(errors,[], 'Runtime JavaScript errors');
 assert.deepEqual(network,[], 'Unexpected automatic off-device requests');
 const response=await page.goto(`http://127.0.0.1:${server.address().port}/privacy.html`);assert.equal(response.status(),200);
 assert.ok((await page.locator('body').innerText()).includes('jalejasko011@gmail.com'));
 console.log(`PASS: ${tabs.length} tabs with and without pets; create/edit/delete, records, persistence, export, gallery, SR/EN policy link, startup network.`);
 console.log('Scope: Chromium mobile viewport. This does not certify Android installation, notifications or Play Protect.');
} finally {await browser.close();await new Promise(r=>server.close(r));}
