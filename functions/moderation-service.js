import {createHash} from 'node:crypto';
import {FieldValue,Timestamp} from 'firebase-admin/firestore';
import {HttpsError} from 'firebase-functions/v2/https';
import {classify} from './moderation-policy.js';
const fail=(code,message)=>{throw new HttpsError(code,message);};
function identity(request){const a=request.auth;if(!a||a.token.email_verified!==true||a.token.firebase?.sign_in_provider!=='password')fail('unauthenticated','Verified email/password sign-in required.');return a.uid;}
const validId=x=>typeof x==='string'&&/^[A-Za-z0-9_-]{16,64}$/.test(x);
export function moderationService(db) {
 return {
 async submit(request) {
  const uid=identity(request),data=request.data;
  if(!data||Object.keys(data).some(k=>!['text','requestId'].includes(k))||!validId(data.requestId)||typeof data.text!=='string'||!data.text.trim()||data.text.length>1000)fail('invalid-argument','Text and request ID required.');
  const text=data.text.trim(),id=uid+'_'+data.requestId,ref=db.doc('chatSubmissions/'+id),profile=db.doc('chatProfiles/'+uid),limit=db.doc('chatModerationLimits/'+uid);
  const hash=createHash('sha256').update(text.normalize('NFKC').toLowerCase()).digest('hex');
  return db.runTransaction(async tx=>{
   const [p,s,l]=await Promise.all([tx.get(profile),tx.get(ref),tx.get(limit)]);
   if(!p.exists||p.data().banned!==false)fail('permission-denied','Chat access unavailable.');
   if(s.exists){if(s.data().text!==text)fail('already-exists','Request ID already used.');return {id,status:s.data().status};}
   const now=Date.now(),old=l.data()||{},hour=Math.floor(now/3600000),count=old.hour===hour?old.count:0;
   if(now-(old.lastAt?.toMillis()||0)<5000||count>=60)fail('resource-exhausted','Please wait before sending.');
   const decision=classify(text,p.data().nickname);
   if(old.hash===hash&&now-(old.lastAt?.toMillis()||0)<60000){decision.status='held';decision.reasons.push('duplicate');}
   tx.set(limit,{lastAt:Timestamp.fromMillis(now),hour,count:count+1,hash});
   const entry={authorId:uid,nickname:p.data().nickname,text,createdAt:FieldValue.serverTimestamp()};
   tx.create(ref,{...entry,...decision});
   if(decision.status==='published')tx.create(db.doc('globalMessages/'+id),entry);
   return {id,status:decision.status};
  });
 },
 async review(request) {
  const uid=identity(request),{id,decision}=request.data||{};
  if(typeof id!=='string'||! /^[A-Za-z0-9_-]{1,200}$/.test(id)||!['approve','reject'].includes(decision))fail('invalid-argument','Invalid review.');
  return db.runTransaction(async tx=>{
   const role=await tx.get(db.doc('moderators/'+uid));
   if(request.auth.token.moderator!==true&&role.data()?.active!==true)fail('permission-denied','Moderator role required.');
   const ref=db.doc('chatSubmissions/'+id),s=await tx.get(ref);
   if(!s.exists)fail('not-found','Submission unavailable.');
   const item=s.data(),p=await tx.get(db.doc('chatProfiles/'+item.authorId));
   if(item.status!=='held')fail('failed-precondition','Submission already reviewed.');
   if(decision==='approve'&&(!p.exists||p.data().banned!==false))fail('failed-precondition','Author no longer active.');
   const status=decision==='approve'?'published':'rejected';
   if(status==='published')tx.create(db.doc('globalMessages/'+id),{authorId:item.authorId,nickname:item.nickname,text:item.text,createdAt:FieldValue.serverTimestamp()});
   tx.update(ref,{status,reviewedBy:uid,reviewedAt:FieldValue.serverTimestamp()});
   tx.create(db.collection('moderationAudit').doc(),{actorId:uid,action:decision==='approve'?'approve-submission':'reject-submission',targetId:id,createdAt:FieldValue.serverTimestamp()});
   return {id,status};
  });
 }
 };
}
