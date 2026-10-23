import {adultAccount,onlineLogin} from './online-test-helper.mjs';
import {initializeTestEnvironment} from '@firebase/rules-unit-testing';
import {chromium} from 'playwright';
import {initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const rulesEnv=await initializeTestEnvironment({projectId:'demo-petcare-chat',firestore:{rules:await readFile('firebase/production-no-public-chat.rules','utf8')}});
const root=resolve('www'),server=createServer(async(req,res)=>{try{
 const pathname=new URL(req.url,'http://localhost').pathname;
 if(pathname==='/chat-config.js'){res.setHeader('Content-Type','text/javascript');res.end('window.PETCARE_CHAT_CONFIG='+JSON.stringify({enabled:true,media:{enabled:false},push:{enabled:false},firebase:{apiKey:'demo-key',projectId:'demo-petcare-chat',appId:'1:123:web:familytest'}})+';window.PETCARE_FAMILY_CONFIG={enabled:true,emulators:true};');return;}
 const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!path.startsWith(root+'/')){res.writeHead(403).end();return;}
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'})[extname(path)]||'application/octet-stream');res.end(await readFile(path));
}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
try{
 const admin=getFirestore(initializeApp({projectId:'demo-petcare-chat'}));
 const contexts=await Promise.all([1,2,3].map(()=>browser.newContext({viewport:{width:360,height:800},serviceWorkers:'block'}))),pages=await Promise.all(contexts.map(c=>c.newPage())),[owner,alice,bob]=pages,errors=[];
 const url=`http://127.0.0.1:${server.address().port}/`;
 for(const page of pages){page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.type()==='prompt'?d.accept('Please review this family entry'):d.accept());await page.goto(url);await page.selectOption('#languageSelect','en');}
 await owner.locator('[data-action=addpet]').click();await owner.locator('#petForm [name=name]').fill('Family browser pet');await owner.locator('#petForm button').last().click();
 async function family(page,name){const account=await adultAccount(name.replaceAll(' ','-'));await page.evaluate(()=>petCareUI.open('family'));await page.locator('#familyConnect').click();await onlineLogin(page,account.email);await page.locator('#familyPersonName').waitFor({timeout:45000});await page.locator('#familyPersonName').fill(name);}
 await family(owner,'Caregiver A');await owner.locator('#familyName').fill('Our shared pet');await owner.locator('#sharedFamilyCreate button').click();
 await owner.locator('#sharedPetName').filter({hasText:'Family browser pet'}).waitFor({timeout:30000});
 await owner.locator('#familyNewInvite').click();const code=await owner.locator('#familyInviteCode').innerText();assert.match(code,/^[A-Z2-9]{4}(?:-[A-Z2-9]{4}){3}$/);
 for(const [page,name] of [[alice,'Caregiver B'],[bob,'Caregiver C']]){await family(page,name);await page.locator('#familyInviteInput').fill(code);await page.locator('#sharedFamilyJoin button').click();await page.locator('#sharedPetName').filter({hasText:'Family browser pet'}).waitFor({timeout:30000});}
 await owner.locator('#sharedFamilyMembers').getByText('Caregiver C',{exact:true}).waitFor();
 const text='<img src=x onerror=alert(1)> Meal served';await alice.locator('#sharedCareText').fill(text);await alice.locator('#sharedCareForm button').click();
 for(const page of [owner,bob]){const record=page.locator('#sharedCareEntries article').filter({hasText:text});await record.waitFor({timeout:30000});assert.equal(await record.locator('img').count(),0);}
 // Firestore document IDs are untrusted text too, including inside HTML attributes.
 const probeId='probe"><img src=x onerror=window.identifierXss=true><x y="',probeFamily=await owner.evaluate(()=>petCareSharedFamily.status().selected),probeAuthor=await alice.evaluate(()=>petCareSharedFamily.status().uid);
 await admin.doc(`petFamilies/${probeFamily}/entries/${probeId}`).set({kind:'note',text:'Identifier XSS probe',authorId:probeAuthor,authorName:'Caregiver B',createdAt:new Date()});
 const probe=owner.locator('#sharedCareEntries article').filter({hasText:'Identifier XSS probe'});await probe.waitFor();assert.equal(await probe.locator('img').count(),0);assert.equal(await owner.evaluate(()=>window.identifierXss===true),false);assert.equal(await probe.locator('[data-remove-entry]').getAttribute('data-remove-entry'),probeId);await probe.locator('[data-remove-entry]').click();await probe.waitFor({state:'detached'});assert.equal((await admin.doc(`petFamilies/${probeFamily}/entries/${probeId}`).get()).exists,false);
 // A family report is delivered only to its owner; blocking hides the author locally.
 await bob.locator('#sharedCareEntries article').filter({hasText:text}).locator('[data-report-entry]').click();
 await owner.locator('#familyReports').getByText('Please review this family entry',{exact:true}).waitFor();
 const aliceBlockUid=await alice.evaluate(()=>petCareSharedFamily.status().uid);
 await bob.locator(`[data-block-member="${aliceBlockUid}"]`).click();assert.equal(await bob.locator('#sharedCareEntries article').filter({hasText:text}).count(),0);
 await bob.locator(`[data-block-member="${aliceBlockUid}"]`).click();await bob.locator('#sharedCareEntries article').filter({hasText:text}).waitFor();
 await owner.locator('[data-resolve-report]').click();await owner.locator('[data-resolve-report]').waitFor({state:'detached'});
 await bob.locator(`[data-report-member="${aliceBlockUid}"]`).click();await owner.locator('#familyReports').getByText('Please review this family entry',{exact:true}).waitFor();await owner.locator('[data-resolve-report]').click();await owner.locator('[data-resolve-report]').waitFor({state:'detached'});
 // A revoked invitation cannot admit a fourth device, while existing members keep access.
 await owner.locator('[data-revoke-invite]').first().click();await owner.locator('[data-revoke-invite]').waitFor({state:'detached'});
 const fourth=await browser.newContext({serviceWorkers:'block'}),stranger=await fourth.newPage();await stranger.goto(url);await stranger.selectOption('#languageSelect','en');await family(stranger,'No invitation');await stranger.locator('#familyInviteInput').fill(code);await stranger.locator('#sharedFamilyJoin button').click();await stranger.locator('#familyShareStatus').filter({hasText:/code expired|server did not confirm/}).waitFor();assert.equal(await stranger.locator('#sharedPetName').count(),0);await fourth.close();
 // Member removal terminates access and clears the shared view on that phone.
 await owner.locator('#familyNewInvite').click();const alternateCode=await owner.locator('#familyInviteCode').innerText();await owner.locator('#familyNewInvite').click();
 const aliceUid=await alice.evaluate(()=>petCareSharedFamily.status().uid);await owner.locator(`[data-remove-member="${aliceUid}"]`).click();await alice.locator('#sharedPetName').waitFor({state:'detached',timeout:30000});await owner.locator('[data-revoke-invite]').waitFor({state:'detached'});
 await alice.locator('#familyInviteInput').fill(alternateCode);await alice.locator('#sharedFamilyJoin button').click();await alice.locator('#familyShareStatus').filter({hasText:/code expired|server did not confirm/}).waitFor();
 // Resume a paused deletion and remove old entries beyond the 100-row feed.
 const familyId=await owner.evaluate(()=>petCareSharedFamily.status().selected),ownerUid=await owner.evaluate(()=>petCareSharedFamily.status().uid);
 const seed=admin.batch();for(let i=0;i<103;i++)seed.set(admin.doc(`petFamilies/${familyId}/entries/old-${i}`),{kind:'note',text:'Old diary '+i,authorId:ownerUid,authorName:'Caregiver A',createdAt:new Date()});await seed.commit();
 await admin.doc(`petFamilies/${familyId}`).update({active:false});await owner.getByText('Family deletion has started.',{exact:false}).waitFor();
 await owner.locator('#familyDelete').click();await owner.locator('#sharedPetName').waitFor({state:'detached',timeout:30000});await bob.locator('#sharedPetName').waitFor({state:'detached',timeout:30000});
 await owner.locator('#familyShareStatus').filter({hasText:'Confirmed by the server.'}).waitFor();assert.equal((await admin.doc(`petFamilies/${familyId}`).get()).exists,false);assert.equal((await admin.collection(`petFamilies/${familyId}/entries`).get()).empty,true);assert.equal((await admin.collection(`petFamilies/${familyId}/members`).get()).empty,true);
 assert.equal((await admin.collection(`petFamilies/${familyId}/reports`).get()).empty,true);
 assert.deepEqual(errors,[]);console.log('PASS three phones: shared code, live pet/diary, safe text, revoked invite, removed member and complete family deletion.');
}finally{await browser.close();await new Promise(r=>server.close(r));await rulesEnv.cleanup();}
