// Run only as the verified project owner with Application Default Credentials.
// No credentials, passwords or service-account keys are stored by this script.
import {createRequire} from 'node:module';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
const {initializeApp,applicationDefault}=require('firebase-admin/app');
const {getAuth}=require('firebase-admin/auth');
const [uid]=process.argv.slice(2);if(!uid||!/^[A-Za-z0-9_-]{1,128}$/.test(uid))throw Error('Usage: node tools/grant-moderator.mjs FIREBASE_AUTH_UID');
initializeApp({credential:applicationDefault(),projectId:'pet-care-world'});const auth=getAuth(),user=await auth.getUser(uid);if(!user.emailVerified)throw Error('Moderator email must be verified first');await auth.setCustomUserClaims(uid,{...user.customClaims,moderator:true});console.log('Moderator role assigned. Sign out and sign in again to refresh the role.');
