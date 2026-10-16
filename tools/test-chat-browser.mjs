import {chromium} from 'playwright';
import {initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
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
   res.end('window.PETCARE_CHAT_CONFIG='+JSON.stringify({enabled:true,emulators:true,media:{enabled:true,bucket:'demo-petcare-chat.appspot.com'},firebase:{apiKey:'demo-key',projectId:'demo-petcare-chat',appId:'1:123:web:test'}})+';');return;
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
 await alice.locator('#chatText').fill(text);await alice.locator('#chatSend button[type=submit]').click();
 const received=bob.locator('.chat-message').filter({hasText:text});await received.waitFor({timeout:20000});assert.equal(await received.locator('img').count(),0);
 await alice.locator('#chatText').fill('Rate limit test');await alice.locator('#chatSend button[type=submit]').click();await alice.locator('#chatStatus').filter({hasText:'Message not sent'}).waitFor();
 await bob.locator('#chatText').fill('Hello from B');await bob.locator('#chatSend button[type=submit]').click();await alice.locator('.chat-message').filter({hasText:'Hello from B'}).waitFor();
 await received.getByRole('button',{name:'Report',exact:true}).click();await bob.locator('#chatStatus').filter({hasText:'Report sent'}).waitFor();
 await received.getByRole('button',{name:'Block',exact:true}).click();assert.equal(await received.count(),0);
 await bob.getByRole('button',{name:'Unblock all',exact:true}).click();await received.waitFor();
 await alice.locator('.chat-message').filter({hasText:text}).getByRole('button',{name:'Delete',exact:true}).click();await received.waitFor({state:'detached'});
 await alice.waitForTimeout(5100);
 await alice.locator('#chatText').fill('Photo attachment');
 await alice.locator('#chatFile').setInputFiles({name:'pet.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1cAAAAASUVORK5CYII=','base64')});
 await alice.locator('#chatSend button[type=submit]').click();await alice.locator('#chatStatus').filter({hasText:'Message sent.'}).waitFor();
 const photo=bob.locator('.chat-message').filter({hasText:'Photo attachment'});await photo.waitFor();await photo.getByRole('button',{name:'Load attachment',exact:true}).click();await photo.locator('img').waitFor();assert.ok(await photo.locator('img').evaluate(i=>i.complete&&i.naturalWidth>0));
 await alice.waitForTimeout(5100);
 const video=await alice.evaluate(async()=>{const c=document.createElement('canvas');c.width=32;c.height=32;const ctx=c.getContext('2d');ctx.fillStyle='green';ctx.fillRect(0,0,32,32);const stream=c.captureStream(5),rec=new MediaRecorder(stream,{mimeType:'video/webm'}),chunks=[];return await new Promise(resolve=>{rec.ondataavailable=e=>chunks.push(e.data);rec.onstop=async()=>{stream.getTracks().forEach(t=>t.stop());resolve(Array.from(new Uint8Array(await new Blob(chunks,{type:'video/webm'}).arrayBuffer())));};rec.start();setTimeout(()=>rec.stop(),500);});});
 await alice.locator('#chatText').fill('Video attachment');await alice.locator('#chatFile').setInputFiles({name:'pet.webm',mimeType:'video/webm',buffer:Buffer.from(video)});await alice.locator('#chatSend button[type=submit]').click();await alice.locator('#chatStatus').filter({hasText:'Message sent.'}).waitFor();const clip=bob.locator('.chat-message').filter({hasText:'Video attachment'});await clip.waitFor();await clip.getByRole('button',{name:'Load attachment',exact:true}).click();await clip.locator('video').waitFor();await clip.locator('video').evaluate(v=>new Promise((resolve,reject)=>{if(v.readyState>=1)return resolve();v.onloadedmetadata=resolve;v.onerror=reject;}));assert.ok(await clip.locator('video').evaluate(v=>v.videoWidth>0));

 // Moderator console: real emulator-issued claims; regular sign-in cannot read the queue.
 const admin=initializeApp({projectId:'demo-petcare-chat'}),adminAuth=getAuth(admin),adminDb=getFirestore(admin);
 const normal=await adminAuth.createUser({email:'viewer@example.test',password:'EmulatorOnlyPassword42',emailVerified:true});
 const mod=await adminAuth.createUser({email:'moderator@example.test',password:'EmulatorOnlyPassword42',emailVerified:true});
 await adminAuth.setCustomUserClaims(mod.uid,{moderator:true});
 const moderation=await browser.newPage();moderation.on('pageerror',e=>errors.push(e.message));moderation.on('dialog',d=>d.accept());
 await moderation.goto(url+'moderator.html');
 async function login(email){await moderation.locator('#moderatorEmail').fill(email);await moderation.locator('#moderatorPassword').fill('EmulatorOnlyPassword42');await moderation.locator('#moderatorLoginForm button[type=submit]').click();}
 await login(normal.email);await moderation.locator('#moderatorApproval').waitFor();assert.equal(await moderation.locator('#moderatorWorkspace').isVisible(),false);
 await moderation.locator('#moderatorSignOut').click();await moderation.locator('#moderatorLogin').waitFor();
 await login(mod.email);await moderation.locator('#moderatorWorkspace').waitFor();
 await moderation.getByRole('button',{name:'Mark reviewed',exact:true}).first().click();
 await moderation.getByText('No reports to review.',{exact:true}).waitFor();
 // Report the uploaded photo, ban its author, unban, then remove message and media.
 await photo.getByRole('button',{name:'Report',exact:true}).click();await bob.locator('#chatStatus').filter({hasText:'Report sent'}).waitFor();
 await moderation.locator('#refreshReports').click();await moderation.getByRole('button',{name:'Ban author',exact:true}).waitFor();
 await moderation.getByRole('button',{name:'Ban author',exact:true}).click();
 const author=await alice.evaluate(()=>petCareChat.getSession().user.uid);
 await moderation.waitForFunction(()=>document.getElementById('moderationStatus').textContent.includes('banned'));
 assert.equal((await adminDb.doc('chatProfiles/'+author).get()).data().banned,true);
 await moderation.locator('#unbanUid').fill(author);await moderation.locator('#unbanForm button').click();
 await moderation.waitForFunction(()=>document.getElementById('moderationStatus').textContent==='Ban removed.');
 assert.equal((await adminDb.doc('chatProfiles/'+author).get()).data().banned,false);
 await moderation.getByRole('button',{name:'Remove message',exact:true}).click();await moderation.getByText('No reports to review.',{exact:true}).waitFor();
 await photo.waitFor({state:'detached'});await moderation.locator('#refreshAudit').click();await moderation.locator('#moderatorAudit').getByText(/remove-message/).waitFor();
 assert.ok((await adminDb.collection('moderationAudit').get()).size>=5);
 await moderation.close();
 console.log('PASS moderator login/role denial, report review, ban/unban, attachment removal and immutable action history.');
 await bob.getByRole('button',{name:'Close',exact:true}).click();await bob.locator('#globalChatShortcut').click();await bob.locator('#chatConsent').check();await bob.locator('#chatJoin button').click();await bob.locator('#chatStatus').filter({hasText:'Connected'}).waitFor();
 await bob.getByRole('button',{name:'Delete chat identity and my messages',exact:true}).click();await bob.locator('#chatStatus').filter({hasText:'Chat identity and messages deleted'}).waitFor();
 await alice.getByRole('button',{name:'Delete chat identity and my messages',exact:true}).click();await alice.locator('#chatStatus').filter({hasText:'Chat identity and messages deleted'}).waitFor();
 assert.deepEqual(errors,[]);
 console.log('PASS two isolated chat clients: consent, realtime send/reply, XSS-safe rendering, rate limit, report, block/unblock, own deletion, reconnect and identity deletion, authenticated photo/video upload and playback. Emulator only.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
