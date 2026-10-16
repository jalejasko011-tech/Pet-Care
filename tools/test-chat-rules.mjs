import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {readFile} from 'node:fs/promises';
import {doc,setDoc,getDoc,getDocs,collection,query,limit,writeBatch,serverTimestamp,Timestamp,deleteDoc,updateDoc} from 'firebase/firestore';
const env=await initializeTestEnvironment({projectId:'demo-petcare-chat',firestore:{rules:await readFile('firestore.rules','utf8')}});
try{
 const alice=env.authenticatedContext('alice').firestore(),bob=env.authenticatedContext('bob').firestore(),anon=env.unauthenticatedContext().firestore(),mod=env.authenticatedContext('mod',{moderator:true}).firestore();
 for(const [db,id] of [[alice,'alice'],[bob,'bob']])await assertSucceeds(setDoc(doc(db,'chatProfiles',id),{nickname:id,banned:false,lastSent:Timestamp.fromMillis(0)}));
 const send=(db,uid,id,text='Hello',authorId=uid)=>{const b=writeBatch(db);b.update(doc(db,'chatProfiles',uid),{lastSent:serverTimestamp()});b.set(doc(db,'globalMessages',id),{authorId,nickname:uid,text,createdAt:serverTimestamp()});return b.commit();};
 await assertFails(send(bob,'bob','spoof','Hello','alice'));
 await assertFails(send(bob,'bob','long','x'.repeat(1001)));
 await assertSucceeds(send(alice,'alice','first','Hello pets'));
 await assertSucceeds(getDocs(query(collection(bob,'globalMessages'),limit(100))));
 await assertFails(getDocs(collection(bob,'globalMessages')));
 await assertFails(getDoc(doc(anon,'globalMessages','first')));
 await assertFails(getDoc(doc(bob,'chatProfiles','alice')));
 await assertFails(send(alice,'alice','too-fast'));
 await assertFails(deleteDoc(doc(bob,'globalMessages','first')));
 await assertFails(updateDoc(doc(alice,'globalMessages','first'),{text:'Edited'}));
 await assertSucceeds(setDoc(doc(bob,'chatReports','bob_first'),{reporterId:'bob',messageId:'first',reason:'Spam',createdAt:serverTimestamp()}));
 await assertFails(getDoc(doc(alice,'chatReports','bob_first')));
 await assertSucceeds(getDoc(doc(mod,'chatReports','bob_first')));
 await assertSucceeds(updateDoc(doc(mod,'chatProfiles','bob'),{banned:true}));
 await assertFails(updateDoc(doc(bob,'chatProfiles','bob'),{banned:false}));
 await assertFails(send(bob,'bob','banned'));
 await assertSucceeds(deleteDoc(doc(alice,'globalMessages','first')));
 await assertFails(setDoc(doc(bob,'users','alice','backups','current'),{data:'stolen'}));
 console.log('Chat rules: authentication, identity, length, rate limit, moderation and private records verified.');
}finally{await env.cleanup();}
