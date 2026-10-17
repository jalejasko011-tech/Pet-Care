import assert from 'node:assert/strict';
process.env.GCLOUD_PROJECT='demo-petcare-chat';
const handlers=await import('../functions/index.js');
assert.deepEqual(Object.keys(handlers).sort(),['notifyChatMedia','notifyChatText','removeChatMedia','removeChatSubscription']);
for(const fn of Object.values(handlers)){assert.equal(fn.__endpoint.platform,'gcfv2');assert.equal(fn.__endpoint.maxInstances,2);assert.equal(fn.__endpoint.concurrency,1);assert.equal(fn.__endpoint.region[0],'europe-west1');}
console.log('PASS optional Functions SDK loads and exports bounded v2 trigger configuration. No deployment or live message delivery.');
