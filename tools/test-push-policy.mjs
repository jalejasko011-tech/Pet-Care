import assert from 'node:assert/strict';
import {eligible,payload,ownMedia} from '../functions/push-policy.js';
const s={uid:'bob',enabled:true,token:'a'.repeat(100),channelId:'petcare_chat_cheerful_v1',sound:'petcare_cheerful.wav',blockedAuthors:[],language:'sr'},message={authorId:'alice'};
assert.equal(eligible(s,{banned:false},message),true);assert.equal(eligible({...s,enabled:false},{banned:false},message),false);assert.equal(eligible(s,{banned:true},message),false);assert.equal(eligible({...s,uid:'alice'},{banned:false},message),false);assert.equal(eligible({...s,blockedAuthors:['alice']},{banned:false},message),false);assert.equal(eligible({...s,channelId:'arbitrary'},{banned:false},message),false);
const p=payload(s,'alice_1');assert.equal(p.android.notification.sound,'petcare_cheerful');assert.equal(p.android.notification.channelId,s.channelId);assert.equal(p.data.kind,'petcare-chat');assert.ok(!JSON.stringify(p).includes('private message text'));
assert.equal(ownMedia({authorId:'alice',media:{path:'chatMedia/alice/alice_1'}},'alice_1'),'chatMedia/alice/alice_1');assert.equal(ownMedia({authorId:'alice',media:{path:'private/bob/file'}},'alice_1'),null);
console.log('PASS push opt-in, bans, self exclusion, blocking, selected sound, privacy and media path ownership.');
