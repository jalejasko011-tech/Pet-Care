// Real console UI + Auth/Firestore emulators + real service transactions.
// The callable transport adapter is a local fixture; deployed callable transport is a live gate.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,extname} from 'node:path';
import {createRequire} from 'node:module';
import {chromium} from 'playwright';
import {moderationService} from '../functions/moderation-service.js';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {initializeApp}=require('firebase-admin/app'),{getFirestore,Timestamp}=require('firebase-admin/firestore'),{getAuth}=require('firebase-admin/auth');
if(!process.env.FIRESTORE_EMULATOR_HOST||!process.env.FIREBASE_AUTH_EMULATOR_HOST)throw Error('Emulators required');
const projectId='demo-petcare-auto',app=initializeApp({projectId},'auto-browser'),db=getFirestore(app),auth=getAuth(app),service=moderationService(db);
const password='EmulatorOnlyReview123!',mod=await auth.createUser({email:'auto-reviewer@example.test',password,emailVerified:true});
await db.doc('moderators/'+mod.uid).set({active:true});
await db.doc('chatProfiles/uiAuthor').set({nickname:'Pet owner',banned:false,lastSent:Timestamp.fromMillis(0),sequence:0});
const authRequest={auth:{uid:'uiAuthor',token:{email_verified:true,firebase:{sign_in_provider:'password'}}},data:{text:'Contact https://example.org',requestId:'request-ui-review1'}};
const item=await service.submit(authRequest);
const root=resolve('www'),errors=[],server=createServer(async(req,res)=>{res.setHeader('Access-Control-Allow-Origin','*');try{
 const path=new URL(req.url,'http://localhost').pathname;
 if(path==='/test-call/reviewChatSubmission'){
  const token=await auth.verifyIdToken((req.headers.authorization||'').replace('Bearer ',''));let body='';for await(const chunk of req)body+=chunk;
  const data=await service.review({auth:{uid:token.uid,token},data:JSON.parse(body)});res.setHeader('Content-Type','application/json');res.end(JSON.stringify({data}));return;
 }
 if(path==='/chat-config.js'){res.setHeader('Content-Type','text/javascript');res.end('window.PETCARE_CHAT_CONFIG='+JSON.stringify({enabled:true,emulators:true,moderation:{enabled:true,region:'europe-west1'},firebase:{apiKey:'demo-key',projectId,appId:'1:123:web:auto'}})+';');return;}
 if(path==='/test-functions.js'){res.setHeader('Content-Type','text/javascript');res.end(`import {getAuth} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';export const getFunctions=app=>({app});export function connectFunctionsEmulator(){};export const httpsCallable=(f,name)=>async data=>{const token=await getAuth(f.app).currentUser.getIdToken();const response=await fetch('/test-call/'+name,{method:'POST',headers:{'Authorization':'Bearer '+token},body:JSON.stringify(data)});if(!response.ok)throw Error('call failed');return response.json();};`);return;}
 const file=resolve(root,'.'+path);if(!file.startsWith(root+'/')){res.writeHead(403).end();return;}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch{res.writeHead(500).end('fixture error');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'});page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.route('**/firebase-functions.js',route=>route.fulfill({status:200,contentType:'text/javascript',headers:{'Access-Control-Allow-Origin':'*'},body:`export * from 'http://127.0.0.1:${server.address().port}/test-functions.js';`}));
 await page.goto(`http://127.0.0.1:${server.address().port}/moderator.html`);
 await page.locator('#moderatorEmail').fill(mod.email);await page.locator('#moderatorPassword').fill(password);await page.locator('#moderatorLoginForm button[type=submit]').click();
 await page.locator('#automaticModeration').waitFor();await page.locator('#heldMessages').getByText('Contact https://example.org',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Approve publication',exact:true}).first().click();await page.locator('#moderationStatus').filter({hasText:'Decision saved.'}).waitFor();
 assert.equal((await db.doc('globalMessages/'+item.id).get()).exists,true);
 await db.doc('chatModerationLimits/uiAuthor').delete();const rejected=await service.submit({...authRequest,data:{text:'Another https://example.org',requestId:'request-ui-review2'}});
 await page.locator('#refreshHeld').click();await page.locator('#heldMessages').getByText('Another https://example.org',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Reject message',exact:true}).first().click();await page.locator('#heldMessages').getByText('No held messages.',{exact:true}).waitFor();
 assert.equal((await db.doc('globalMessages/'+rejected.id).get()).exists,false);assert.equal((await db.doc('chatSubmissions/'+rejected.id).get()).data().status,'rejected');
 await page.locator('#moderatorSignOut').click();assert.equal(await page.locator('#automaticModeration').isVisible(),false);assert.equal(await page.locator('#heldMessages').textContent(),'');assert.deepEqual(errors,[]);
 console.log('PASS actual mobile moderator UI: verified role, private queue, approval/publication, rejection/nonpublication, sign-out clearing; local callable adapter with token verification.');
}finally{await browser.close();await new Promise(r=>server.close(r));await auth.deleteUser(mod.uid);}
