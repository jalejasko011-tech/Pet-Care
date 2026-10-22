// Emulator-only account fixtures; no production identities or real email are used.
import {getApps,initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
export const adultPassword='EmulatorOnlyPassword42';
export async function adultAccount(label,verified=true){
 if(!process.env.FIREBASE_AUTH_EMULATOR_HOST)throw Error('Auth emulator required');
 const admin=getAuth(getApps()[0]||initializeApp({projectId:'demo-petcare-chat'}));
 return admin.createUser({email:label+'-'+Date.now()+'-'+Math.random().toString(36).slice(2)+'@example.test',password:adultPassword,emailVerified:verified});
}
export async function onlineLogin(page,email){
 await page.locator('#adultEmail').waitFor({timeout:45000});await page.locator('#adultEmail').fill(email);await page.locator('#adultPassword').fill(adultPassword);await page.locator('#adultAcknowledgement').check();await page.locator('#adultSignIn').click();
}
