import assert from 'node:assert/strict';
import {classify,normalize} from '../functions/moderation-policy.js';
for(const text of ['Hello, my dog likes walks.','Moj pas voli šetnju.','Мој пас воли шетњу.','The vet prescribed medication.','Moja mačka je dobro.'])assert.equal(classify(text,'Mila').status,'published',text);
for(const text of ['I will kill you','Убићу те','j.e.b.e.m','f​uck you','Visit https://spam.example','www.test.rs','Email me a@b.com','Pozovi +381 64 123 4567','aaaaaaaaaaaaaaaaaaaa','Earn money now','你好'])assert.equal(classify(text,'Mila').status,'held',text);
assert.equal(classify('Hello','fuckyou').status,'held');
assert.equal(normalize('ШЕТЊА'),'setnja');
console.log('PASS SR/EN triage: ordinary pet care, Cyrillic, abuse/obfuscation, contact details, links, spam, nickname and unsupported-script review.');
