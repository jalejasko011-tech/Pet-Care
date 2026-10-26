// Read-only production perimeter check. No login, writes, user creation or SDK.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
const project='pet-care-world',collections=['globalMessages','chatProfiles','chatReports','moderationAudit','moderators','chatPushSubscriptions','petFamilies','petFamilyInvites'];
const results=[];
for(const collection of collections){
 const res=await fetch(`https://firestore.googleapis.com/v1/projects/${project}/databases/(default)/documents/${collection}?pageSize=1`,{signal:AbortSignal.timeout(30000)});
 const body=await res.json();assert.equal(res.status,403,collection+' must not be public');assert.equal(body.error?.status,'PERMISSION_DENIED');assert.match(body.error?.message||'',/Missing or insufficient permissions/i);
 results.push({collection,http:res.status,result:body.error.status});
}
const rulesSha256=createHash('sha256').update(readFileSync('firebase/production-no-public-chat.rules')).digest('hex');
const result={checkedAt:new Date().toISOString(),project,mode:'unauthenticated read-only',results,rulesCandidateSha256:rulesSha256,limits:'Does not read active Rules text, prove signed-in access control, verify billing or exercise production family/account deletion.'};
if(process.env.PETCARE_PUBLIC_REPORT)writeFileSync(process.env.PETCARE_PUBLIC_REPORT,JSON.stringify(result,null,2));
console.log(JSON.stringify(result));
