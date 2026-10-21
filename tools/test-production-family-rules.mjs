import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc,getDocs,collection,query,limit,writeBatch,serverTimestamp,Timestamp,updateDoc,deleteDoc} from 'firebase/firestore';
const baseline=await readFile('firebase/production-chat-baseline-2026-10-21.rules','utf8'),candidate=await readFile('firebase/production-family-candidate.rules','utf8'),full=await readFile('firestore.rules','utf8');
const family=full.slice(full.indexOf('    // Family profiles'),full.indexOf('    match /{document=**}'));
assert.equal(candidate,baseline.replace('    match /{document=**}',()=>family+'    match /{document=**}'),'The supplied chat rules remain byte-for-byte intact');
const env=await initializeTestEnvironment({projectId:'demo-petcare-chat',firestore:{rules:candidate}});
try{
 const a=env.authenticatedContext('productionAlice').firestore(),b=env.authenticatedContext('productionBob').firestore(),anon=env.unauthenticatedContext().firestore(),mod=env.authenticatedContext('productionMod',{moderator:true}).firestore();
 for(const [db,uid] of [[a,'productionAlice'],[b,'productionBob']])await assertSucceeds(setDoc(doc(db,'chatProfiles',uid),{nickname:uid,banned:false,lastSent:Timestamp.fromMillis(0),sequence:0}));
 const batch=writeBatch(a);batch.update(doc(a,'chatProfiles','productionAlice'),{sequence:1,lastSent:serverTimestamp()});batch.set(doc(a,'globalMessages','productionAlice_1'),{authorId:'productionAlice',nickname:'productionAlice',text:'Existing text chat remains usable',createdAt:serverTimestamp()});await assertSucceeds(batch.commit());
 await assertSucceeds(getDocs(query(collection(b,'globalMessages'),limit(100))));await assertFails(getDocs(collection(b,'globalMessages')));await assertFails(getDoc(doc(anon,'globalMessages','productionAlice_1')));
 await assertFails(updateDoc(doc(b,'globalMessages','productionAlice_1'),{text:'Unauthorized edit'}));await assertFails(deleteDoc(doc(b,'globalMessages','productionAlice_1')));
 await assertSucceeds(setDoc(doc(b,'chatReports','productionBob_productionAlice_1'),{reporterId:'productionBob',messageId:'productionAlice_1',reason:'Test report',createdAt:serverTimestamp()}));
 await assertFails(getDoc(doc(a,'chatReports','productionBob_productionAlice_1')));await assertSucceeds(getDoc(doc(mod,'chatReports','productionBob_productionAlice_1')));
 await assertSucceeds(updateDoc(doc(mod,'chatProfiles','productionBob'),{banned:true}));await assertFails(updateDoc(doc(b,'chatProfiles','productionBob'),{banned:false}));
 await assertFails(setDoc(doc(a,'chatPushSubscriptions','productionAlice'),{enabled:true}));await assertFails(setDoc(doc(a,'unrelated','anything'),{public:true}));
 console.log('PASS production candidate preserves supplied text-chat, reports, moderation and default-deny rules without enabling media or push.');
}finally{await env.cleanup();}
