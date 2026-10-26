// Isolated operations rehearsal, never an executable production deletion tool.
import assert from 'node:assert/strict';
import {initializeApp,deleteApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore} from 'firebase-admin/firestore';
const local=host=>/^127\.0\.0\.1:\d+$/.test(host||'');
assert.ok(local(process.env.FIRESTORE_EMULATOR_HOST)&&local(process.env.FIREBASE_AUTH_EMULATOR_HOST),'Local Auth and Firestore emulators are mandatory');
const projectId='demo-petcare-ops',app=initializeApp({projectId},'deletion-rehearsal'),db=getFirestore(app),auth=getAuth(app);
const uid='rehearsal-delete-user',other='rehearsal-keep-user',owned='rehearsal-owned-family',foreign='rehearsal-other-family';
const exists=async path=>(await db.doc(path).get()).exists;
const put=(path,value)=>db.doc(path).set(value);
const eraseWhere=async(collection,field,value)=>{const snap=await db.collection(collection).where(field,'==',value).get();for(const doc of snap.docs)await db.recursiveDelete(doc.ref);return snap.docs.map(d=>d.id);};
try{
 await auth.createUser({uid,email:'delete@rehearsal.example',emailVerified:true});await auth.createUser({uid:other,email:'keep@rehearsal.example',emailVerified:true});
 await put(`petFamilies/${owned}`,{ownerId:uid,active:true});await put(`petFamilies/${foreign}`,{ownerId:other,active:true});
 for(const id of [owned,foreign]){await put(`petFamilies/${id}/members/${uid}`,{name:'Delete fixture',role:id===owned?'owner':'member'});await put(`petFamilies/${id}/members/${other}`,{name:'Keep fixture',role:id===owned?'member':'owner'});}
 await put(`petFamilies/${owned}/entries/mine`,{authorId:uid});await put(`petFamilies/${owned}/entries/other`,{authorId:other});
 // Recursive cleanup must remove nested data even without its parent document.
 await put(`petFamilies/${owned}/orphan/absent/nested/record`,{fixture:true});
 await put(`petFamilies/${foreign}/entries/mine`,{authorId:uid});await put(`petFamilies/${foreign}/entries/keep`,{authorId:other});
 await put(`petFamilies/${foreign}/reports/by-me`,{reporterId:uid,entryId:'keep'});await put(`petFamilies/${foreign}/reports/about-me`,{reporterId:other,memberId:uid});await put(`petFamilies/${foreign}/reports/about-my-entry`,{reporterId:other,entryId:'mine'});await put(`petFamilies/${foreign}/reports/keep`,{reporterId:other,entryId:'keep'});
 await put('petFamilyInvites/owned',{ownerId:uid,familyId:owned,lastJoined:other});await put('petFamilyInvites/keep',{ownerId:other,familyId:foreign,lastJoined:uid});
 for(const collection of ['chatProfiles','moderators','chatPushSubscriptions'])await put(`${collection}/${uid}`,{fixture:true});
 await put(`chatPushSubscriptions/${uid}/devices/old`,{fixture:true});
 await put('globalMessages/mine',{authorId:uid});await put('globalMessages/keep',{authorId:other});await put('chatReports/by-me',{reporterId:uid,messageId:'keep'});await put('chatReports/about-mine',{reporterId:other,messageId:'mine'});await put('chatReports/keep',{reporterId:other,messageId:'keep'});
 await put('moderationAudit/mine',{actorId:uid,action:'ban',targetId:other});await put('moderationAudit/about-me',{actorId:other,action:'ban',targetId:uid});await put('moderationAudit/keep',{actorId:other,action:'ban',targetId:'unrelated'});

 // Rehearse the documented operator sequence on these fixed fixtures only.
 await auth.updateUser(uid,{disabled:true});await auth.revokeRefreshTokens(uid);assert.equal((await auth.getUser(uid)).disabled,true);
 // Production must additionally allow already-issued ID tokens to expire, or
 // deploy a tested per-UID write lock. This fixture has no issued client tokens.
 await db.doc(`petFamilies/${owned}`).update({active:false});await eraseWhere('petFamilyInvites','ownerId',uid);await db.recursiveDelete(db.doc(`petFamilies/${owned}`));
 await db.doc(`petFamilies/${foreign}/members/${uid}`).delete();
 const entries=await eraseWhere(`petFamilies/${foreign}/entries`,'authorId',uid);
 const reports=await db.collection(`petFamilies/${foreign}/reports`).get();for(const report of reports.docs){const r=report.data();if(r.reporterId===uid||r.memberId===uid||entries.includes(r.entryId))await report.ref.delete();}
 await db.doc('petFamilyInvites/keep').update({lastJoined:''});
 const messages=await eraseWhere('globalMessages','authorId',uid);await eraseWhere('chatReports','reporterId',uid);for(const id of messages)await eraseWhere('chatReports','messageId',id);
 await eraseWhere('moderationAudit','actorId',uid);await eraseWhere('moderationAudit','targetId',uid);
 for(const collection of ['chatProfiles','moderators','chatPushSubscriptions'])await db.recursiveDelete(db.doc(`${collection}/${uid}`));
 await auth.deleteUser(uid);

 for(const path of [`petFamilies/${owned}`,`petFamilies/${owned}/members/${other}`,`petFamilies/${owned}/orphan/absent/nested/record`,`petFamilies/${foreign}/members/${uid}`,`petFamilies/${foreign}/entries/mine`,`petFamilies/${foreign}/reports/by-me`,`petFamilies/${foreign}/reports/about-me`,`petFamilies/${foreign}/reports/about-my-entry`,'petFamilyInvites/owned','globalMessages/mine','chatReports/by-me','chatReports/about-mine','moderationAudit/mine','moderationAudit/about-me',`chatProfiles/${uid}`,`moderators/${uid}`,`chatPushSubscriptions/${uid}/devices/old`])assert.equal(await exists(path),false,path);
 for(const path of [`petFamilies/${foreign}`,`petFamilies/${foreign}/members/${other}`,`petFamilies/${foreign}/entries/keep`,`petFamilies/${foreign}/reports/keep`,'petFamilyInvites/keep','globalMessages/keep','chatReports/keep','moderationAudit/keep'])assert.equal(await exists(path),true,path);
 assert.equal((await db.doc('petFamilyInvites/keep').get()).data().lastJoined,'');await assert.rejects(auth.getUser(uid),e=>e.code==='auth/user-not-found');assert.equal((await auth.getUser(other)).disabled,false);
 console.log('PASS emulator-only account deletion rehearsal: Auth, owned family descendants/orphans, foreign membership/entries/reports, invitations, historical chat and push; unrelated account and records preserved. This is not production deletion or support acceptance.');
}finally{
 await db.terminate();await deleteApp(app);
}
