// Deploy only after owner activates billing, reviews limits, and tests two real devices.
import {initializeApp} from 'firebase-admin/app';
import {getFirestore,FieldPath,FieldValue,Timestamp} from 'firebase-admin/firestore';
import {getMessaging} from 'firebase-admin/messaging';
import {getStorage} from 'firebase-admin/storage';
import {onDocumentCreated,onDocumentDeleted} from 'firebase-functions/v2/firestore';
import {onObjectFinalized} from 'firebase-functions/v2/storage';
import {eligible,payload,ownMedia} from './push-policy.js';
initializeApp();const db=getFirestore(),options={region:'europe-west1',maxInstances:2,concurrency:1,timeoutSeconds:120,memory:'256MiB',retry:true};
async function fanout(id,message){
 if(!message||Date.now()-(message.createdAt?.toMillis?.()||0)>600000)return;
 const ref=db.doc('chatPushDeliveries/'+id),lease=crypto.randomUUID();
 const state=await db.runTransaction(async tx=>{const old=(await tx.get(ref)).data();if(old?.done)return null;if(old?.leaseAt?.toMillis()>Date.now()-180000)throw Error('Delivery is in progress; retry later');tx.set(ref,{lease,leaseAt:Timestamp.now(),cursor:old?.cursor||'',done:false});return {cursor:old?.cursor||''};});if(!state)return;
 let cursor=state.cursor;
 try{while(true){
  let query=db.collection('chatPushSubscriptions').where('enabled','==',true).orderBy(FieldPath.documentId()).limit(100);if(cursor)query=query.startAfter(cursor);const page=await query.get();if(page.empty)break;
  const profiles=await db.getAll(...page.docs.map(d=>db.doc('chatProfiles/'+d.id))),targets=[];
  page.docs.forEach((d,i)=>{const sub={...d.data(),uid:d.id};if(eligible(sub,profiles[i].data(),message))targets.push({ref:d.ref,sub});});
  if(targets.length){const result=await getMessaging().sendEach(targets.map(x=>payload(x.sub,id)));let transient=false;for(let i=0;i<result.responses.length;i++){const error=result.responses[i].error;if(!error)continue;if(['messaging/registration-token-not-registered','messaging/invalid-registration-token','messaging/invalid-argument'].includes(error.code))await targets[i].ref.delete();else transient=true;}if(transient)throw Error('Transient push failure; retry this page');}
  cursor=page.docs.at(-1).id;await db.runTransaction(async tx=>{const current=(await tx.get(ref)).data();if(current?.lease!==lease)throw Error('Delivery lease changed');tx.update(ref,{cursor,leaseAt:Timestamp.now()});});
 }
 await ref.update({done:true,finishedAt:FieldValue.serverTimestamp()});
 }catch(error){await ref.update({leaseAt:Timestamp.fromMillis(0)});throw error;}
}
export const notifyChatText=onDocumentCreated({...options,document:'globalMessages/{messageId}'},async event=>{const message=event.data?.data();if(message&&!message.media)await fanout(event.params.messageId,message);});
export const notifyChatMedia=onObjectFinalized({...options,bucket:'pet-care-world.firebasestorage.app'},async event=>{const parts=event.data.name?.split('/');if(parts?.length!==3||parts[0]!=='chatMedia')return;const message=(await db.doc('globalMessages/'+parts[2]).get()).data();if(ownMedia(message,parts[2])===event.data.name&&Number(event.data.size)===message.media.size)await fanout(parts[2],message);});
export const removeChatMedia=onDocumentDeleted({...options,document:'globalMessages/{messageId}'},async event=>{const path=ownMedia(event.data?.data(),event.params.messageId);if(path)await getStorage().bucket('pet-care-world.firebasestorage.app').file(path).delete({ignoreNotFound:true});});
export const removeChatSubscription=onDocumentDeleted({...options,document:'chatProfiles/{uid}'},async event=>{await db.doc('chatPushSubscriptions/'+event.params.uid).delete();});

// Deploy these callables explicitly; optional media/push triggers remain separate.
import {onCall} from 'firebase-functions/v2/https';
import {moderationService} from './moderation-service.js';
const moderation=moderationService(db);
const moderationOptions={region:'europe-west1',maxInstances:2,minInstances:0,concurrency:1,timeoutSeconds:30,memory:'256MiB'};
export const submitChatMessage=onCall(moderationOptions,request=>moderation.submit(request));
export const reviewChatSubmission=onCall(moderationOptions,request=>moderation.review(request));
