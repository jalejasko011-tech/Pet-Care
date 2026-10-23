import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {randomUUID} from 'node:crypto';
const source=await readFile('www/global-chat.js','utf8'),handler=source.slice(source.indexOf('  async function sendMessage(e)'),source.indexOf('  async function myReviews('));
const field={value:'Hello pet owners',dataset:{}},button={disabled:false},file={disabled:false},messages=[],calls=[];
let mode='held';
const c={cfg:{moderation:{enabled:true}},busy:false,selected:null,functions:{},mediaEnabled:false,uploadTask:null,
 crypto:{randomUUID},el:id=>({chatText:field,chatSend:{querySelector:()=>button},chatFile:file}[id]),status:x=>messages.push(x),tr:(a,b)=>b,
 api:{httpsCallable:()=>async data=>{calls.push(data);if(mode==='error')throw Error('offline');return {data:{id:'example',status:mode}};},runTransaction:()=>{throw Error('Legacy direct write MUST NOT be used');}},chooseMedia(){}};
runInNewContext(handler+';this.send=sendMessage;',c);
await c.send({preventDefault(){}});assert.equal(field.value,'');assert.match(messages.at(-1),/not public/);assert.equal(c.busy,false);
field.value='Please keep this draft';mode='error';await c.send({preventDefault(){}});assert.equal(field.value,'Please keep this draft');const id=calls.at(-1).requestId;
mode='published';await c.send({preventDefault(){}});assert.equal(calls.at(-1).requestId,id,'Retry must reuse request ID');assert.equal(field.value,'');assert.equal(messages.at(-1),'Message published.');
field.value='Another message';await c.send({preventDefault(){}});assert.notEqual(calls.at(-1).requestId,id);
c.selected={file:{}};field.value='Attachment';const before=calls.length;await c.send({preventDefault(){}});assert.equal(calls.length,before);assert.equal(field.value,'Attachment');
console.log('PASS moderated client: held is private, no direct-write fallback, offline draft preserved, stable retry ID, new-message ID and unsupported media denied.');
