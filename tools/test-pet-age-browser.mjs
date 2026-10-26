import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,extname} from 'node:path';
const root=resolve('www'),server=createServer(async(req,res)=>{try{const name=new URL(req.url,'http://localhost').pathname,path=resolve(root,'.'+(name==='/'?'/index.html':name));if(!path.startsWith(root+'/'))return res.writeHead(403).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.wav':'audio/wav'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:360,height:800},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.selectOption('#languageSelect','sr');
 await page.evaluate(()=>{data=seed();tab='pets';formMode='pet';render();});
 await page.locator('#petForm [name=name]').fill('Luna');await page.locator('#petAgeYears').fill('2');await page.locator('#petAgeMonths').fill('3');await page.selectOption('#languageSelect','en');assert.equal(await page.locator('#petAgeYears').inputValue(),'2');assert.equal(await page.locator('#petAgeMonths').inputValue(),'3');await page.locator('#petForm button:not([type=button])').click();
 let p=await page.evaluate(()=>data.pets[0]);assert.equal(p.ageTotalMonths,27);assert.equal(p.birth,'');assert.match(p.ageAsOf,/^\d{4}-\d{2}-\d{2}$/);assert.equal(p.ageYears,undefined);assert.equal(p.ageMode,undefined);
 await page.reload();assert.equal(await page.evaluate(()=>data.pets[0].ageTotalMonths),27);
 await page.evaluate(()=>editPet(data.pets[0].id));assert.equal(await page.locator('#petAgeYears').inputValue(),'2');assert.equal(await page.locator('#petAgeMonths').inputValue(),'3');
 await page.locator('#petAgeMonths').fill('12');await page.locator('#petForm button:not([type=button])').click();assert.equal(await page.locator('#petForm').count(),1);assert.equal(await page.evaluate(()=>data.pets[0].ageTotalMonths),27);
 await page.locator('#petAgeYears').fill('0');await page.locator('#petAgeMonths').fill('5');await page.locator('#petForm button:not([type=button])').click();assert.equal(await page.evaluate(()=>data.pets[0].ageTotalMonths),5);
 await page.evaluate(()=>editPet(data.pets[0].id));await page.selectOption('#petAgeMode','birth');await page.locator('#petBirthDate').fill('2020-02-29');await page.locator('#petForm button:not([type=button])').click();p=await page.evaluate(()=>data.pets[0]);assert.equal(p.birth,'2020-02-29');assert.equal(p.ageTotalMonths,undefined);assert.equal(p.ageAsOf,undefined);
 await page.evaluate(()=>editPet(data.pets[0].id));assert.equal(await page.locator('#petAgeMode').inputValue(),'birth');await page.locator('#petForm [name=name]').fill('Luna exact');await page.locator('#petForm button:not([type=button])').click();assert.equal(await page.evaluate(()=>data.pets[0].birth),'2020-02-29');
 await page.evaluate(()=>editPet(data.pets[0].id));await page.selectOption('#petAgeMode','age');await page.locator('#petAgeYears').fill('');await page.locator('#petAgeMonths').fill('');await page.locator('#petForm button:not([type=button])').click();p=await page.evaluate(()=>data.pets[0]);assert.equal(p.birth,'');assert.equal(p.ageTotalMonths,undefined);
 await page.evaluate(()=>{data.pets[0].ageTotalMonths=27;data.pets[0].ageAsOf='2024-01-31';save();editPet(data.pets[0].id);});await page.locator('#petForm [name=name]').fill('Name only');await page.locator('#petForm button:not([type=button])').click();assert.equal(await page.evaluate(()=>data.pets[0].ageAsOf),'2024-01-31','Unrelated edits retain the age anniversary');
 await page.selectOption('#languageSelect','en');await page.evaluate(()=>editPet(data.pets[0].id));assert.match(await page.locator('#petForm').innerText(),/Years and months/);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:'pet-age-preview.png',fullPage:true});assert.doesNotMatch(await page.locator('#footerNote').innerText(),/Chat messages|Chat poruke/);assert.deepEqual(errors,[]);
 console.log('PASS pet age mobile: create/edit/reload, months validation, infants, exact birthdays preserved, optional age, stable aging anchor and 360px layout.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
