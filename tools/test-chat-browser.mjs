import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const root=resolve('www');
const server=createServer(async(req,res)=>{
 try{
  const pathname=new URL(req.url,'http://localhost').pathname;
  if(pathname==='/chat-config.js'){
   res.setHeader('Content-Type','text/javascript');
   res.end('window.PETCARE_CHAT_CONFIG='+JSON.stringify({enabled:true,emulators:true,firebase:{apiKey:'demo-key',projectId:'demo-petcare-chat',appId:'1:123:web:test'}})+';');return;
  }
  const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!path.startsWith(root+'/')){res.writeHead(403).end();return;}
  res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml'})[extname(path)]||'application/octet-stream');
  res.end(await readFile(path));
 }catch{res.writeHead(404).end();}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await chromium.launch();
try{
 const a=await browser.newContext({viewport:{width:393,height:852}}),b=await browser.newContext({viewport:{width:360,height:800}});
 const alice=await a.newPage(),bob=await b.newPage(),errors=[];
 for(const page of [alice,bob]){page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.type()==='prompt'?d.accept('Automated emulator test report'):d.accept());}
 const url=`http://127.0.0.1:${server.address().port}/`;
 async function join(page,nick){await page.goto(url);await page.selectOption('#languageSelect','en');await page.locator('#globalChatShortcut').click();await page.locator('#chatNickname').fill(nick);await page.locator('#chatConsent').check();await page.locator('#chatJoin button').click();await page.locator('#chatStatus').filter({hasText:'Connected'}).waitFor({timeout:45000});}
 await join(alice,'Chat test A');await join(bob,'Chat test B');
 const text='<img src=x onerror=alert(1)> Emulator greeting';
 await alice.locator('#chatText').fill(text);await alice.locator('#chatSend button').click();
 const received=bob.locator('.chat-message').filter({hasText:text});await received.waitFor({timeout:20000});assert.equal(await received.locator('img').count(),0);
 await alice.locator('#chatText').fill('Rate limit test');await alice.locator('#chatSend button').click();await alice.locator('#chatStatus').filter({hasText:'Message not sent'}).waitFor();
 await bob.locator('#chatText').fill('Hello from B');await bob.locator('#chatSend button').click();await alice.locator('.chat-message').filter({hasText:'Hello from B'}).waitFor();
 await received.getByRole('button',{name:'Report',exact:true}).click();await bob.locator('#chatStatus').filter({hasText:'Report sent'}).waitFor();
 await received.getByRole('button',{name:'Block',exact:true}).click();assert.equal(await received.count(),0);
 await bob.getByRole('button',{name:'Unblock all',exact:true}).click();await received.waitFor();
 await alice.locator('.chat-message').filter({hasText:text}).getByRole('button',{name:'Delete',exact:true}).click();await received.waitFor({state:'detached'});
 await bob.getByRole('button',{name:'Close',exact:true}).click();await bob.locator('#globalChatShortcut').click();await bob.locator('#chatConsent').check();await bob.locator('#chatJoin button').click();await bob.locator('#chatStatus').filter({hasText:'Connected'}).waitFor();
 await bob.getByRole('button',{name:'Delete chat identity and my messages',exact:true}).click();await bob.locator('#chatStatus').filter({hasText:'Chat identity and messages deleted'}).waitFor();
 await alice.getByRole('button',{name:'Delete chat identity and my messages',exact:true}).click();await alice.locator('#chatStatus').filter({hasText:'Chat identity and messages deleted'}).waitFor();
 assert.deepEqual(errors,[]);
 console.log('PASS two isolated chat clients: consent, realtime send/reply, XSS-safe rendering, rate limit, report, block/unblock, own deletion, reconnect and identity deletion. Emulator only.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
