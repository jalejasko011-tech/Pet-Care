import assert from 'node:assert/strict';
import {initializeTestEnvironment,assertSucceeds,assertFails} from '@firebase/rules-unit-testing';
import {readFile} from 'node:fs/promises';
import {doc,setDoc,getDoc,getDocs,collection,query,where,limit,writeBatch,serverTimestamp,Timestamp,deleteDoc,updateDoc,runTransaction,increment} from 'firebase/firestore';
const env=await initializeTestEnvironment({projectId:'demo-petcare-chat',firestore:{rules:await readFile('firestore.rules','utf8')}});
const pet={name:'Shared test dog',type:'Dog',breed:'Mixed',sex:'',birth:''},hash='a'.repeat(64),fid='sharedRulesFamily';
try{
 const owner=env.authenticatedContext('familyOwner').firestore(),alice=env.authenticatedContext('familyAlice').firestore(),bob=env.authenticatedContext('familyBob').firestore(),outsider=env.authenticatedContext('familyOutsider').firestore(),anon=env.unauthenticatedContext().firestore();
 const member=(name,role='member',inviteHash=hash)=>({name,role,inviteHash,joinedAt:serverTimestamp()});
 const group={name:'Test family',pet,ownerId:'familyOwner',active:true,createdAt:serverTimestamp()};
 await assertFails(setDoc(doc(owner,'petFamilies','noOwnerMember'),group));
 const batch=writeBatch(owner);batch.set(doc(owner,'petFamilies',fid),group);batch.set(doc(owner,'petFamilies',fid,'members','familyOwner'),member('Owner','owner',''));await assertSucceeds(batch.commit());
 await assertFails(getDoc(doc(outsider,'petFamilies',fid)));await assertFails(getDoc(doc(anon,'petFamilies',fid)));await assertFails(getDocs(collection(owner,'petFamilies')));
 const invitation={familyId:fid,ownerId:'familyOwner',createdAt:serverTimestamp(),expiresAt:Timestamp.fromMillis(Date.now()+3600000),uses:0,maxUses:10,lastJoined:'',lastUsedAt:Timestamp.fromMillis(0)};
 await assertFails(setDoc(doc(alice,'petFamilyInvites',hash),invitation));
 await assertSucceeds(setDoc(doc(owner,'petFamilyInvites',hash),invitation));
 await assertFails(getDocs(query(collection(outsider,'petFamilyInvites'),limit(100))));
 await assertSucceeds(getDocs(query(collection(owner,'petFamilyInvites'),where('ownerId','==','familyOwner'),limit(100))));
 await assertFails(setDoc(doc(alice,'petFamilies',fid,'members','familyAlice'),member('Alice')));
 await assertFails(updateDoc(doc(alice,'petFamilyInvites',hash),{uses:1,lastJoined:'familyAlice',lastUsedAt:serverTimestamp()}));
 const join=(db,uid,name,code=hash)=>runTransaction(db,async tx=>{const ref=doc(db,'petFamilyInvites',code),snap=await tx.get(ref);tx.set(doc(db,'petFamilies',fid,'members',uid),member(name,'member',code));tx.update(ref,{uses:increment(1),lastJoined:uid,lastUsedAt:serverTimestamp()});});
 // One family code admits multiple people, including concurrent joins.
 await Promise.all([assertSucceeds(join(alice,'familyAlice','Alice')),assertSucceeds(join(bob,'familyBob','Bob'))]);
 assert.equal((await getDoc(doc(owner,'petFamilyInvites',hash))).data().uses,2);
 await assertSucceeds(getDoc(doc(alice,'petFamilies',fid)));await assertSucceeds(getDoc(doc(bob,'petFamilies',fid)));
 await assertFails(updateDoc(doc(alice,'petFamilies',fid),{ownerId:'familyAlice'}));
 await assertFails(updateDoc(doc(alice,'petFamilies',fid,'members','familyAlice'),{role:'owner'}));
 await assertFails(join(alice,'familyAlice','Alice'));
 const entry={kind:'meal',text:'Meal given once',authorId:'familyAlice',authorName:'Alice',createdAt:serverTimestamp()};
 await assertSucceeds(setDoc(doc(alice,'petFamilies',fid,'entries','meal'),entry));
 await assertSucceeds(getDocs(query(collection(bob,'petFamilies',fid,'entries'),limit(100))));
 await assertFails(setDoc(doc(bob,'petFamilies',fid,'entries','forged'),entry));
 await assertFails(getDoc(doc(outsider,'petFamilies',fid,'entries','meal')));
 await assertFails(updateDoc(doc(alice,'petFamilies',fid,'entries','meal'),{text:'Rewrite'}));
 await assertFails(deleteDoc(doc(bob,'petFamilies',fid,'entries','meal')));
 await assertSucceeds(updateDoc(doc(owner,'petFamilies',fid),{pet:{...pet,name:'Updated shared dog'}}));
 await assertSucceeds(deleteDoc(doc(owner,'petFamilies',fid,'members','familyAlice')));
 await assertFails(getDoc(doc(alice,'petFamilies',fid)));await assertFails(setDoc(doc(alice,'petFamilies',fid,'entries','removed'),entry));
 await assertSucceeds(deleteDoc(doc(owner,'petFamilyInvites',hash)));await assert.rejects(join(outsider,'familyOutsider','Outsider'),e=>['permission-denied','invalid-argument'].includes(e.code));assert.equal((await getDoc(doc(owner,'petFamilies',fid,'members','familyOutsider'))).exists(),false);
 for(const [key,patch] of [['b'.repeat(64),{expiresAt:Timestamp.fromMillis(Date.now()-10000)}],['c'.repeat(64),{uses:10}]]){
  await env.withSecurityRulesDisabled(async c=>setDoc(doc(c.firestore(),'petFamilyInvites',key),{...invitation,createdAt:Timestamp.now(),...patch}));
  await assertFails(join(outsider,'familyOutsider','Outsider',key));
 }
 // With one invitation slot left, concurrent joins cannot exceed its cap.
 const last='d'.repeat(64),dana=env.authenticatedContext('familyDana').firestore();
 await env.withSecurityRulesDisabled(async c=>setDoc(doc(c.firestore(),'petFamilyInvites',last),{...invitation,createdAt:Timestamp.now(),uses:9}));
 const outcomes=await Promise.allSettled([join(outsider,'familyOutsider','Outsider',last),join(dana,'familyDana','Dana',last)]);assert.equal(outcomes.filter(x=>x.status==='fulfilled').length,1);assert.equal((await getDoc(doc(owner,'petFamilyInvites',last))).data().uses,10);
 await assertFails(deleteDoc(doc(owner,'petFamilies',fid,'members','familyOwner')));
 await assertFails(deleteDoc(doc(owner,'petFamilies',fid)));
 await assertSucceeds(updateDoc(doc(owner,'petFamilies',fid),{active:false}));
 await assertFails(setDoc(doc(bob,'petFamilies',fid,'entries','afterDeleting'),{...entry,authorId:'familyBob',authorName:'Bob'}));
 await assertSucceeds(deleteDoc(doc(owner,'petFamilies',fid,'entries','meal')));
 const members=await getDocs(query(collection(owner,'petFamilies',fid,'members'),limit(100)));for(const m of members.docs)await assertSucceeds(deleteDoc(m.ref));
 for(const key of ['b'.repeat(64),'c'.repeat(64),'d'.repeat(64)])await assertSucceeds(deleteDoc(doc(owner,'petFamilyInvites',key)));
 await assertSucceeds(deleteDoc(doc(owner,'petFamilies',fid)));
 console.log('PASS shared family atomic creation, concurrent reusable-code joins, isolation, roles, forged entries, removal, revocation, expiry, exhaustion and deletion.');
}finally{await env.cleanup();}
