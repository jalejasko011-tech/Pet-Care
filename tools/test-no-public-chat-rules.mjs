import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {initializeTestEnvironment,assertFails} from '@firebase/rules-unit-testing';
import {doc,getDoc,getDocs,collection,query,limit,setDoc,updateDoc,deleteDoc} from 'firebase/firestore';
const rules=await readFile('firebase/production-no-public-chat.rules','utf8');
const previous=await readFile('firebase/production-adult-access.rules','utf8');
assert.equal(rules.slice(rules.indexOf('    function familyOwner(')),previous.slice(previous.indexOf('    function familyOwner(')),'Every family rule must remain unchanged');
assert.equal(rules.slice(0,rules.indexOf('    // Public chat retired.')),previous.slice(0,previous.indexOf('    function moderator()')),'Preserve verified adult password authentication');
const env=await initializeTestEnvironment({projectId:'demo-petcare-chat',firestore:{rules}});
const adult={email_verified:true,firebase:{sign_in_provider:'password'}};
try{
 await env.clearFirestore();
 const paths=['chatProfiles/retired-user','globalMessages/retired-message','chatReports/retired-report','moderationAudit/retired-audit','moderators/retired-user','chatSubscriptions/retired-user','chatChannels/global/messages/retired-message'];
 await env.withSecurityRulesDisabled(async c=>{for(const path of paths)await setDoc(doc(c.firestore(),path),{text:'historical fixture',active:true});});
 for(const context of [env.unauthenticatedContext(),env.authenticatedContext('retired-user',adult),env.authenticatedContext('retired-user',{...adult,moderator:true}),env.authenticatedContext('legacy-anonymous')]){
  const db=context.firestore();
  for(const path of paths){const ref=doc(db,path);await assertFails(getDoc(ref));await assertFails(getDocs(query(collection(db,path.split('/').slice(0,-1).join('/')),limit(10))));await assertFails(setDoc(doc(db,path+'-new'),{text:'new'}));await assertFails(setDoc(ref,{text:'new'}));await assertFails(updateDoc(ref,{text:'changed'}));await assertFails(deleteDoc(ref));}
 }
 console.log('PASS retired public chat: read/list/create/update/delete denied for anonymous, adult and moderator clients; family and adult-auth rules preserved byte-exact.');
}finally{await env.cleanup();}
