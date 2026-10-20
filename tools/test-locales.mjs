import {unlockAdult} from './family-test-helper.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve('www'),server=createServer(async(req,res)=>{try{const path=resolve(root,'.'+(req.url==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));if(!path.startsWith(root+'/')){res.writeHead(403).end();return;}res.setHeader('Content-Type',({'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.webp':'image/webp'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch({executablePath:process.env.PETCARE_BROWSER||undefined});
try{const page=await browser.newPage({viewport:{width:360,height:800},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/`);await unlockAdult(page);
 const languages=await page.locator('#languageSelect option').evaluateAll(xs=>xs.map(x=>x.value));assert.equal(languages.length,24);for(const code of ['el','ro','hr','bg'])assert.ok(languages.includes(code));assert.equal(await page.locator('html').getAttribute('lang'),'en');
 await page.locator('[data-action=addpet]').click();await page.locator('#petForm [name=name]').fill('Podsetnici');await page.locator('#petForm [name=breed]').fill('My custom breed');
 await page.locator('#petForm [name=photo]').setInputFiles({name:'pet.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aX1cAAAAASUVORK5CYII=','base64')});
 // Returning from phone settings, a photo picker or another app must not replace
 // an unfinished form. Exercise the real visibility handler without navigation.
 await page.locator('#petForm').evaluate(form=>form.dataset.returnTest='keep');
 await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
 assert.equal(await page.locator('#petForm').getAttribute('data-return-test'),'keep');
 assert.equal(await page.locator('#petForm [name=name]').inputValue(),'Podsetnici');
 for(const code of languages){await page.selectOption('#languageSelect',code);assert.equal(await page.locator('html').getAttribute('lang'),code);assert.equal(await page.locator('html').getAttribute('dir'),code==='ar'?'rtl':'ltr');assert.equal(await page.locator('#petForm [name=name]').inputValue(),'Podsetnici');assert.equal(await page.locator('#petForm [name=breed]').inputValue(),'My custom breed');assert.equal(await page.locator('#petForm [name=type]').inputValue(),'Pas');assert.equal(await page.locator('#petForm [name=type] option').first().getAttribute('value'),'Pas');assert.ok(await page.locator('#petBreedSuggestions option').count()>100);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'No horizontal page overflow: '+code);}
 assert.equal(await page.locator('#petForm [name=photo]').evaluate(input=>input.files[0]?.name),'pet.png');
 const catalog=await page.evaluate(()=>({types:Object.keys(PET_EMOJI),catalog:petCareBreeds.catalog}));
 assert.deepEqual(Object.keys(catalog.catalog),catalog.types,'Every pet category has suggestions or a free-text fallback');
 for(const [type,raw] of Object.entries(catalog.catalog)){const values=raw.split('|').filter(Boolean);assert.equal(new Set(values).size,values.length,'No repeated suggestion in '+type);}
 assert.ok(!catalog.catalog.Pas.split('|').includes('Balkan Hound'),'Old breed synonym must not count as a second breed');
 await page.selectOption('#languageSelect','de');assert.equal(await page.locator('#petForm [name=type] option').first().innerText(),'Hund');await page.locator('#petForm [name=type]').selectOption('Mačka');assert.equal(await page.locator('#petForm [name=breed]').inputValue(),'');assert.equal(await page.locator('#petBreedSuggestions option[value="Maine Coon"]').count(),1);assert.equal(await page.locator('#petBreedSuggestions option[value="German Shepherd"]').count(),0);await page.locator('#petForm [name=breed]').fill('Custom cat <text>');await page.locator('#petForm button').last().click();
 await page.waitForFunction(()=>data.pets.length===1);
 assert.equal(await page.evaluate(()=>data.pets[0].type),'Mačka');assert.equal(await page.evaluate(()=>data.pets[0].breed),'Custom cat <text>');
 for(const code of ['en','sr','ar','hr']){await page.selectOption('#languageSelect',code);assert.equal(await page.evaluate(()=>data.pets[0].name),'Podsetnici');assert.ok((await page.locator('#content').innerText()).includes('Podsetnici'));if(code==='ar')assert.ok((await page.locator('#content').innerText()).includes('قطة'));if(code==='en')assert.ok((await page.locator('#content').innerText()).includes('Cat'));await page.evaluate(()=>editPet(data.pets[0].id));assert.equal(await page.locator('#petForm [name=breed]').inputValue(),'Custom cat <text>');await page.locator('#petForm button').last().click();}
 await page.reload();assert.equal(await page.locator('#languageSelect').inputValue(),'hr');await page.evaluate(()=>editPet(data.pets[0].id));assert.equal(await page.locator('#petForm [name=type]').inputValue(),'Mačka');
 // Render the main screens in every locale, including asynchronous local views.
 for(const lang of languages){await page.selectOption('#languageSelect',lang);for(const id of ['home','pets','health','diary','food','costs','reminders','bonding','shop','deals','vets','assistant','sos','passport','routine','family','training','events','community','adoption','gallery','world','memories','settings','diagnostics','feeding']){await page.evaluate(id=>petCareUI.open(id),id);await page.waitForTimeout(10);assert.ok((await page.locator('#content').innerText()).trim(),'Nonempty '+lang+'/'+id);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),'No overflow '+lang+'/'+id+' '+JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('#content *')].filter(el=>el.getBoundingClientRect().right>innerWidth+2).slice(0,3).map(el=>({tag:el.tagName,cls:el.className,text:el.textContent.slice(0,80)})))));}}
 await page.selectOption('#languageSelect','en');
 const decorated=await page.evaluate(()=>['🐾 Dođi: vežbajte u bezbednom prostoru.','🐾 Ostani: počnite sa nekoliko sekundi.','＋ Dodaj aktivnost','Veterinar:'].map(translateText));
 assert.deepEqual(decorated,['🐾 Come: practise in a safe place.','🐾 Stay: start with a few seconds.','＋ Add activity','Veterinarian:']);
 await page.evaluate(()=>petCareUI.open('bonding'));
 assert.ok((await page.locator('#content').innerText()).includes('Add activity'));
 assert.ok(!(await page.locator('#content').innerText()).includes('Nije evidentirano'));
 await page.evaluate(()=>petCareUI.open('shop'));
 assert.ok((await page.locator('#content').innerText()).includes('Connected supplier catalog'));
 assert.ok(!(await page.locator('#content').innerText()).includes('Podaci potiču'));
 await page.evaluate(()=>petCareUI.open('passport'));
 assert.ok((await page.locator('#content').innerText()).includes('Cat'));
 assert.ok((await page.locator('#content').innerText()).includes('Custom cat <text>'));
 assert.ok(!(await page.locator('#content').innerText()).includes('Mačka'));
 await page.evaluate(()=>editPet(data.pets[0].id));
 const coverage=await page.evaluate(()=>{const d=petCareI18n.dictionary,keys=Object.keys(d.en);return Object.fromEntries(petCareI18n.languages.map(lang=>[lang,keys.filter(key=>!d[lang]?.[key]?.trim())]));});assert.ok(Object.values(coverage).every(xs=>xs.length===0),'Every locale covers every source phrase');
 await page.selectOption('#languageSelect','ar');await page.screenshot({path:'languages-arabic-preview.png',fullPage:true});await page.selectOption('#languageSelect','sr');await page.screenshot({path:'breeds-serbian-preview.png',fullPage:true});assert.deepEqual(errors,[]);console.log('PASS 24 locales, RTL, form preservation, stable enum values, species-specific breeds, custom names, saved profiles and reload persistence.');
}finally{await browser.close();server.close();}
