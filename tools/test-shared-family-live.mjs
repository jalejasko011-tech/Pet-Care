// Explicit production acceptance using disposable fictional families only.
// Retired: this historical runner predates verified-adult access. It must not
// create anonymous production identities or claim to test the current app.
throw Error('Historical anonymous-family runner retired. Use docs/PRODUCTION_FAMILY_ACCEPTANCE_1_8_19_SR.md with verified adult accounts.');
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
if(process.env.PETCARE_LIVE_FAMILY!=='pet-care-world')throw Error('Explicit production test opt-in required');
const root=resolve('www'),server=createServer(async(req,res)=>{try{
 const pathname=new URL(req.url,'http://localhost').pathname;
 const path=resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!path.startsWith(root+'/')){res.writeHead(403).end();return;}
 let body=await readFile(path);if(pathname==='/chat-config.js')body=body.toString()+'\nwindow.PETCARE_FAMILY_CONFIG={enabled:true};';
 res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'})[extname(path)]||'application/octet-stream');res.end(body);
}catch{res.writeHead(404).end();}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();
let pages=[],familyId='',otherId='',complete=false;
try{
 const contexts=await Promise.all([1,2,3].map(()=>browser.newContext({viewport:{width:360,height:800},serviceWorkers:'block'})));
 pages=await Promise.all(contexts.map(c=>c.newPage()));const [owner,alice,bob]=pages,errors=[];
 const url=`http://127.0.0.1:${server.address().port}/`;
 for(const page of pages){page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());await page.goto(url);await page.selectOption('#languageSelect','en');await page.evaluate(()=>petCareUI.open('family'));await page.locator('#familyConnect').click();await page.locator('#familyPersonName').waitFor({timeout:60000});}
 const testPet={name:'Acceptance test pet',type:'dog',breed:'',sex:'',birth:''};
 familyId=await owner.evaluate(p=>petCareSharedFamily.create('Disposable acceptance family',p,'Test owner'),testPet);
 await owner.locator('#sharedPetName').waitFor({timeout:30000});
 const code=await owner.evaluate(id=>petCareSharedFamily.makeInvite(id),familyId);
 // One reusable code admits two independent browser/device identities.
 await Promise.all([[alice,'Test member A'],[bob,'Test member B']].map(([p,n])=>p.evaluate(([c,name])=>petCareSharedFamily.join(c,name),[code,n])));
 for(const p of pages)await p.locator('#sharedFamilyMembers').getByText('Test member B',{exact:true}).waitFor({timeout:30000});
 await alice.evaluate(id=>petCareSharedFamily.addEntry(id,'meal','Disposable meal acceptance record'),familyId);
 for(const p of [owner,bob])await p.locator('#sharedCareEntries').getByText('Disposable meal acceptance record',{exact:true}).waitFor({timeout:30000});
 await owner.evaluate(([id,p])=>petCareSharedFamily.updatePet(id,{...p,name:'Updated acceptance pet'}),[familyId,testPet]);
 for(const p of [alice,bob])await p.locator('#sharedPetName').filter({hasText:'Updated acceptance pet'}).waitFor({timeout:30000});
 await bob.reload();await bob.evaluate(()=>petCareUI.open('family'));await bob.locator('#familyConnect').click();await bob.locator('#sharedPetName').filter({hasText:'Updated acceptance pet'}).waitFor({timeout:30000});
 // A member cannot read or join another family without its invitation.
 otherId=await owner.evaluate(p=>petCareSharedFamily.create('Isolated acceptance family',p,'Test owner'),testPet);
 const isolation=await alice.evaluate(async id=>{const a=await import('https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js'),f=await import('https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js');try{await f.getDoc(f.doc(f.getFirestore(a.getApp('petcare-family')),'petFamilies',id));return 'unexpected-access';}catch(e){return e.code;}},otherId);
 assert.equal(isolation,'permission-denied');
 // Remove one member and revoke the used invitation. The other member stays.
 const aliceUid=await alice.evaluate(()=>petCareSharedFamily.status().uid);
 await owner.evaluate(([id,uid])=>petCareSharedFamily.removeMember(id,uid),[familyId,aliceUid]);
 await alice.locator('#sharedPetName').waitFor({state:'detached',timeout:30000});
 const revoked=await alice.evaluate(async c=>{try{await petCareSharedFamily.join(c,'Removed test member');return false;}catch(e){return e.message==='UNAVAILABLE_CODE';}},code);assert.equal(revoked,true);
 await bob.evaluate(id=>petCareSharedFamily.addEntry(id,'walk','Disposable walk acceptance record'),familyId);
 await owner.locator('#sharedFamilySelect').selectOption(familyId);
 await owner.locator('#sharedCareEntries').getByText('Disposable walk acceptance record',{exact:true}).waitFor({timeout:30000});
 await owner.evaluate(id=>petCareSharedFamily.erase(id),otherId);otherId='';
 await owner.evaluate(id=>petCareSharedFamily.erase(id),familyId);familyId='';
 await bob.locator('#sharedPetName').waitFor({state:'detached',timeout:30000});assert.deepEqual(errors,[]);
 complete=true;console.log('PASS production Firebase: three separate identities, concurrent shared-code joins, bidirectional live diary, profile update, reconnect, family isolation, removal, revocation and family deletion.');
}finally{
 // Cleanup uses only the owner of these fictional test records, never admin access.
 for(const id of [otherId,familyId].filter(Boolean)){try{await pages[0].evaluate(id=>petCareSharedFamily.erase(id),id);}catch{console.error('Test-family cleanup needs follow-up');process.exitCode=1;}}
 for(const page of pages){try{await page.evaluate(async()=>{petCareSharedFamily.disconnect();const a=await import('https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js'),u=await import('https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js'),auth=u.getAuth(a.getApp('petcare-family'));if(auth.currentUser)await u.deleteUser(auth.currentUser);});}catch{console.error('Disposable test-identity cleanup needs follow-up');process.exitCode=1;}}
 await browser.close();await new Promise(r=>server.close(r));if(!complete)process.exitCode=1;
}
