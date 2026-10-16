import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {readFile} from 'node:fs/promises';
import {doc,setDoc,getDoc,getDocs,collection,query,limit,writeBatch,serverTimestamp,Timestamp,deleteDoc,updateDoc} from 'firebase/firestore';
const env=await initializeTestEnvironment({projectId:'demo-petcare-chat',firestore:{rules:await readFile('firestore.rules','utf8')}});
try{
 const alice=env.authenticatedContext('alice').firestore(),bob=env.authenticatedContext('bob').firestore(),anon=env.unauthenticatedContext().firestore(),mod=env.authenticatedContext('mod',{moderator:true}).firestore();
 for(const [db,id] of [[alice,'alice'],[bob,'bob']])await assertSucceeds(setDoc(doc(db,'chatProfiles',id),{nickname:id,banned:false,lastSent:Timestamp.fromMillis(0),sequence:0}));
 const send=(db,uid,id,text='Hello',authorId=uid,sequence=1)=>{const b=writeBatch(db);b.update(doc(db,'chatProfiles',uid),{lastSent:serverTimestamp(),sequence});b.set(doc(db,'globalMessages',id),{authorId,nickname:uid,text,createdAt:serverTimestamp()});return b.commit();};
 await assertFails(send(bob,'bob','bob_1','Hello','alice'));
 await assertFails(send(bob,'bob','bob_1','x'.repeat(1001)));
 await assertSucceeds(send(alice,'alice','alice_1','Hello pets'));
 await assertSucceeds(getDocs(query(collection(bob,'globalMessages'),limit(100))));
 await assertFails(getDocs(collection(bob,'globalMessages')));
 await assertFails(getDoc(doc(anon,'globalMessages','alice_1')));
 await assertFails(getDoc(doc(bob,'chatProfiles','alice')));
 await assertFails(send(alice,'alice','alice_2','Too fast','alice',2));
 await assertFails(deleteDoc(doc(bob,'globalMessages','alice_1')));
 await assertFails(updateDoc(doc(alice,'globalMessages','alice_1'),{text:'Edited'}));
 await assertSucceeds(setDoc(doc(bob,'chatReports','bob_alice_1'),{reporterId:'bob',messageId:'alice_1',reason:'Spam',createdAt:serverTimestamp()}));
 await assertFails(getDoc(doc(alice,'chatReports','bob_alice_1')));
 await assertSucceeds(getDoc(doc(mod,'chatReports','bob_alice_1')));
 await assertSucceeds(updateDoc(doc(mod,'chatProfiles','bob'),{banned:true}));
 await assertFails(updateDoc(doc(bob,'chatProfiles','bob'),{banned:false}));
 await assertFails(send(bob,'bob','bob_1'));
 await assertSucceeds(deleteDoc(doc(alice,'globalMessages','alice_1')));
 await assertFails(setDoc(doc(bob,'users','alice','backups','current'),{data:'stolen'}));
 console.log('Chat rules: authentication, identity, length, rate limit, moderation and private records verified.');
}finally{await env.cleanup();}
