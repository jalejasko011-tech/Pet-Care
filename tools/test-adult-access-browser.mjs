import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
// A real emulator-issued token must change provider without changing the legacy UID.
import {initializeApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,signInAnonymously,linkWithCredential,EmailAuthProvider,reauthenticateWithCredential,getIdTokenResult,signOut} from 'firebase/auth';
import {initializeApp as adminApp} from 'firebase-admin/app';
import {getAuth as adminAuth} from 'firebase-admin/auth';
if(!process.env.FIREBASE_AUTH_EMULATOR_HOST)throw Error('Auth emulator required');
const migrationAuth=getAuth(initializeApp({apiKey:'demo-key',projectId:'demo-petcare-chat'},'legacy-adult-migration'));
connectAuthEmulator(migrationAuth,'http://'+process.env.FIREBASE_AUTH_EMULATOR_HOST,{disableWarnings:true});
const legacy=(await signInAnonymously(migrationAuth)).user,originalUid=legacy.uid;
const migrationCredential=EmailAuthProvider.credential('legacy-migration-'+Date.now()+'@example.test','EmulatorOnlyPassword42');
await linkWithCredential(legacy,migrationCredential);assert.equal(legacy.uid,originalUid);
await adminAuth(adminApp({projectId:'demo-petcare-chat'})).updateUser(originalUid,{emailVerified:true});
await reauthenticateWithCredential(legacy,migrationCredential);const migratedToken=await getIdTokenResult(legacy,true);
assert.equal(migratedToken.claims.email_verified,true);assert.equal(migratedToken.claims.firebase.sign_in_provider,'password');assert.equal(legacy.uid,originalUid);await signOut(migrationAuth);
console.log('PASS real Auth emulator: legacy UID retained and verified-password token issued after linking and reauthentication.');
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:320,height:740}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setContent('<!doctype html><html><body><main>Local care</main></body></html>');
 await page.addScriptTag({path:resolve('www/adult-access.js')});
 await page.evaluate(()=>{
  window.calls=[];window.auth={currentUser:null};window.mock={
   EmailAuthProvider:{credential:(email,password)=>({email,password})},
   signInWithEmailAndPassword:async(a,email,password)=>{calls.push('signIn');if(password==='WrongPassword42')throw Error('bad password');return {user:a.currentUser={uid:'test-adult',email,emailVerified:false,isAnonymous:false}};},
   reauthenticateWithCredential:async(u,c)=>{calls.push('reauth');if(c.password==='WrongPassword42')throw Error('bad password');return {user:u};},
   reload:async()=>{},getIdToken:async()=>{},sendEmailVerification:async()=>calls.push('verification'),sendPasswordResetEmail:async()=>calls.push('reset'),
   linkWithCredential:async(u,c)=>{calls.push('link');u.email=c.email;u.isAnonymous=false;return {user:u};}
  };window.start=()=>{window.result='pending';petCareAdult.authorize(auth,mock).then(u=>window.result=u.uid).catch(()=>window.result='cancelled');};start();
 });
 async function fill(password='EmulatorOnlyPassword42'){await page.locator('#adultEmail').fill('adult@example.test');await page.locator('#adultPassword').fill(password);await page.locator('#adultAcknowledgement').check();}
 assert.deepEqual(await page.evaluate(()=>calls),[]);
 await fill();await page.locator('#adultSignIn').click();await page.getByText('Verify your email using the message, then enter your password again and press Connect.').waitFor();assert.equal(await page.evaluate(()=>result),'pending');
 await page.locator('#adultVerify').click();await page.getByText('Verification email sent.',{exact:true}).waitFor();
 await page.evaluate(()=>auth.currentUser.emailVerified=true);await fill('WrongPassword42');await page.locator('#adultSignIn').click();await page.getByText(/Access was not confirmed/).waitFor();assert.equal(await page.evaluate(()=>result),'pending');
 await fill();await page.locator('#adultSignIn').click();await page.waitForFunction(()=>result==='test-adult');assert.equal(await page.locator('input[type=password]').count(),0);
 await page.evaluate(()=>start());await fill('short7');await page.locator('#adultSignIn').click();await page.waitForFunction(()=>result==='test-adult');
 // Persisted auth never opens online access without entering the adult password again.
 await page.evaluate(()=>start());await page.locator('#adultPassword').waitFor();assert.equal(await page.locator('#adultPassword').inputValue(),'');await page.locator('#adultCancel').click();await page.waitForFunction(()=>result==='cancelled');
 // Preserve an existing anonymous family owner's UID when upgrading the account.
 await page.evaluate(()=>{auth.currentUser={uid:'legacy-owner',isAnonymous:true,emailVerified:false};start();});await fill();page.once('dialog',d=>d.dismiss());await page.locator('#adultSignIn').click();assert.equal(await page.evaluate(()=>auth.currentUser.uid),'legacy-owner');await page.locator('#adultCreate').click();await page.getByText(/Account saved/).waitFor();assert.equal(await page.evaluate(()=>auth.currentUser.uid),'legacy-owner');assert.ok((await page.evaluate(()=>calls)).includes('link'));await page.locator('#adultCancel').click();
 assert.deepEqual(errors,[]);console.log('PASS adult gate: no passive authentication, unverified/invalid password denial, explicit verification, password reentry, cancellation, legacy UID preservation and credential cleanup.');
}finally{await browser.close();}
