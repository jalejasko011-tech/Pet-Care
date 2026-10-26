import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,extname} from 'node:path';
const root=resolve('www'),server=createServer(async(req,res)=>{try{const name=new URL(req.url,'http://localhost').pathname,path=resolve(root,'.'+(name==='/'?'/index.html':name));if(!path.startsWith(root+'/'))return res.writeHead(403).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.wav':'audio/wav'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:360,height:800},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(`http://127.0.0.1:${server.address().port}/`);await page.selectOption('#languageSelect','en');
 await page.locator('[data-action=addpet]').click();
 const secondary=await page.locator('#content .muted').first().evaluate(e=>({color:getComputedStyle(e).color,background:getComputedStyle(e.closest('.card')).backgroundColor}));
 const luminance=color=>color.match(/\d+/g).slice(0,3).map(Number).map(v=>v/255).reduce((sum,v,i)=>sum+[.2126,.7152,.0722][i]*(v<=.04045?v/12.92:((v+.055)/1.055)**2.4),0);const light=Math.max(luminance(secondary.color),luminance(secondary.background)),dark=Math.min(luminance(secondary.color),luminance(secondary.background));assert.ok((light+.05)/(dark+.05)>=4.5,'Small help text needs readable contrast');
await page.getByLabel('Name *',{exact:true}).fill('Practical test pet');await page.getByLabel('Species *',{exact:true}).selectOption('Pas');await page.getByRole('button',{name:'Save profile',exact:true}).click();
 assert.equal(await page.evaluate(()=>data.pets[0].name),'Practical test pet');assert.equal(await page.evaluate(()=>data.pets[0].birth),'','Birth date and extra details are optional');
 assert.doesNotMatch(await page.locator('#content').innerText(),/Rasa nije uneta|Dodajte svog prvog/);
 for(const [section,mode]of [['pets','pet'],['health','health'],['diary','log'],['diary','weight'],['food','food'],['costs','cost'],['reminders','reminder']]){
  await page.evaluate(([section,mode])=>{tab=section;formMode=mode;render();},[section,mode]);
  assert.ok(await page.locator('#content form').count(),section+' form must be present');
  const unnamed=await page.locator('#content input,#content select,#content textarea').evaluateAll(es=>es.filter(e=>e.type!=='hidden'&&e.getClientRects().length&&!e.labels?.length&&!e.getAttribute('aria-label')&&!e.getAttribute('aria-labelledby')).map(e=>({name:e.name,type:e.type})));assert.deepEqual(unnamed,[],section+' visible controls need names');
 }
 await page.evaluate(()=>editPet(data.pets[0].id));await page.selectOption('#petAgeMode','birth');await page.getByLabel('Day',{exact:true}).fill('15');await page.getByLabel('Month',{exact:true}).selectOption('6');await page.getByLabel('Year',{exact:true}).fill('2020');
 for(const width of [320,360,390,768]){await page.setViewportSize({width,height:800});const small=await page.locator('#content button,#content input,#content select,#settingsShortcut,#familyModeButton,#languageSelect').evaluateAll(es=>es.filter(e=>e.type!=='hidden'&&e.type!=='checkbox'&&e.type!=='radio'&&e.getClientRects().length&&e.getBoundingClientRect().height<47.5).map(e=>({tag:e.tagName,id:e.id,height:e.getBoundingClientRect().height})));assert.deepEqual(small,[],'48px controls at '+width);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2),false);}
 await page.setViewportSize({width:360,height:800});await page.selectOption('#languageSelect','sr');assert.equal(await page.getByLabel('Dan',{exact:true}).inputValue(),'15');assert.equal(await page.getByLabel('Godina',{exact:true}).inputValue(),'2020');assert.equal(await page.getByLabel('Ime *',{exact:true}).inputValue(),'Practical test pet');
 await page.screenshot({path:'practical-form-preview.png',fullPage:true});assert.deepEqual(errors,[]);
 console.log('PASS practical forms: named controls across seven forms, minimum-only pet creation, optional birthday, clear EN fallback, preserved SR date drafts and 48px controls without overflow at 320–768px.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
