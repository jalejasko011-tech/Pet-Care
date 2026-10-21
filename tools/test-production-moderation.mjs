import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {resolve,extname} from 'node:path';
import {chromium} from 'playwright';
import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc,updateDoc,deleteDoc,serverTimestamp} from 'firebase/firestore';
import {initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
if(!process.env.FIRESTORE_EMULATOR_HOST||!process.env.FIREBASE_AUTH_EMULATOR_HOST)throw Error('Emulators required');
const baseline=await readFile('firebase/production-family-candidate.rules','utf8'),rules=await readFile('firebase/production-review-current.rules','utf8'),preview=await readFile('firestore.rules','utf8');
const audit=preview.slice(preview.indexOf('    match /moderationAudit/'),preview.indexOf('    // Family profiles'));
assert.equal(rules,baseline.replace('    // Family profiles',()=>audit+'    // Family profiles'),'Only the existing moderator audit block may be added');
const env=await initializeTestEnvironment({projectId:'demo-petcare-chat',firestore:{rules}});
await env.clearFirestore();
const root=resolve('www'),server=createServer(async(req,res)=>{try{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname==='/chat-config.js'){res.setHeader('Content-Type','text/javascript');res.end('window.PETCARE_CHAT_CONFIG='+JSON.stringify({enabled:true,emulators:true,media:{enabled:false},push:{enabled:false},firebase:{apiKey:'demo-key',projectId:'demo-petcare-chat',appId:'1:123:web:productionreview'}})+';');return;}
 const path=resolve(root,'.'+pathname);if(!path.startsWith(root+'/')){res.writeHead(403).end();return;}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));
}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
try{
 const mod=env.authenticatedContext('reviewMod',{moderator:true}).firestore(),ordinary=env.authenticatedContext('ordinary').firestore(),anon=env.unauthenticatedContext().firestore();
 const entry={actorId:'reviewMod',action:'ban',targetId:'fictional-author',createdAt:serverTimestamp()};
 await assertSucceeds(setDoc(doc(mod,'moderationAudit','permission-test'),entry));
 await assertFails(setDoc(doc(ordinary,'moderationAudit','forbidden'),{...entry,actorId:'ordinary'}));
 await assertFails(setDoc(doc(mod,'moderationAudit','forged-actor'),{...entry,actorId:'ordinary'}));
 await assertFails(setDoc(doc(mod,'moderationAudit','invalid-action'),{...entry,action:'grant-admin'}));
 await assertFails(getDoc(doc(ordinary,'moderationAudit','permission-test')));await assertFails(getDoc(doc(anon,'moderationAudit','permission-test')));
 await assertFails(updateDoc(doc(mod,'moderationAudit','permission-test'),{targetId:'altered'}));await assertFails(deleteDoc(doc(mod,'moderationAudit','permission-test')));
 const app=initializeApp({projectId:'demo-petcare-chat'}),admin=getFirestore(app),auth=getAuth(app),password='EmulatorOnlyPassword42';
 const owner=await auth.createUser({email:'review-moderator@example.test',password,emailVerified:true}),normal=await auth.createUser({email:'review-ordinary@example.test',password,emailVerified:true});
 await auth.setCustomUserClaims(owner.uid,{moderator:true});
 await admin.doc('chatProfiles/reviewAuthor').set({nickname:'Fictional author',banned:false,lastSent:new Date(0),sequence:1});
 await admin.doc('globalMessages/reviewAuthor_1').set({authorId:'reviewAuthor',nickname:'Fictional author',text:'Fictional reported text',createdAt:new Date()});
 await admin.doc('chatReports/reviewReporter_reviewAuthor_1').set({reporterId:'reviewReporter',messageId:'reviewAuthor_1',reason:'Production rules acceptance report',createdAt:new Date()});
 const page=await browser.newPage({viewport:{width:390,height:844},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
 await page.goto(`http://127.0.0.1:${server.address().port}/moderator.html`);
 async function login(email){await page.locator('#moderatorEmail').fill(email);await page.locator('#moderatorPassword').fill(password);await page.locator('#moderatorLoginForm button[type=submit]').click();}
 await login(normal.email);await page.locator('#moderatorApproval').waitFor();assert.equal(await page.locator('#moderatorWorkspace').isVisible(),false);
 await page.locator('#moderatorSignOut').click();await page.locator('#moderatorLogin').waitFor();
 await login(owner.email);await page.locator('#moderatorWorkspace').waitFor();
 await page.getByRole('button',{name:'Ban author',exact:true}).click();await page.locator('#moderationStatus').filter({hasText:'Author is banned'}).waitFor();assert.equal((await admin.doc('chatProfiles/reviewAuthor').get()).data().banned,true);
 await page.locator('#unbanUid').fill('reviewAuthor');await page.locator('#unbanForm button').click();await page.locator('#moderationStatus').filter({hasText:'Ban removed'}).waitFor();assert.equal((await admin.doc('chatProfiles/reviewAuthor').get()).data().banned,false);
 await page.getByRole('button',{name:'Remove message',exact:true}).click();await page.locator('#moderatorReports').getByText('No reports to review.',{exact:true}).waitFor();
 assert.equal((await admin.doc('globalMessages/reviewAuthor_1').get()).exists,false);assert.equal((await admin.doc('chatReports/reviewReporter_reviewAuthor_1').get()).exists,false);
 await page.locator('#refreshAudit').click();await page.locator('#moderatorAudit').getByText(/remove-message/).waitFor();assert.ok((await admin.collection('moderationAudit').get()).size>=5);assert.deepEqual(errors,[]);
 console.log('PASS actual production candidate: ordinary-user denial, moderator ban/unban, message/report removal and private immutable audit through the real console UI.');
}finally{await browser.close();await new Promise(r=>server.close(r));await env.cleanup();}
