import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const sandbox={window:{},Uint8Array,Uint32Array,DataView,TextEncoder,TextDecoder,Map,Set};vm.runInNewContext(readFileSync('www/backup-zip.js','utf8'),sandbox);
const {pack,unpack}=sandbox.window.petCareZip,bytes=new TextEncoder().encode('Private pet memory');const zip=pack([{name:'manifest.json',bytes},{name:'media/1.bin',bytes:Uint8Array.from([0,255,5,9])}]);
assert.equal(new TextDecoder().decode(unpack(zip).get('manifest.json')),'Private pet memory');assert.deepEqual([...unpack(zip).get('media/1.bin')],[0,255,5,9]);
const damaged=zip.slice();damaged[45]^=1;assert.throws(()=>unpack(damaged));assert.throws(()=>unpack(zip.subarray(0,zip.length-1)));assert.throws(()=>pack([{name:'../private',bytes}]));assert.throws(()=>pack([{name:'a',bytes},{name:'a',bytes}]));
console.log('PASS ZIP backup roundtrip, binary bytes, corruption, truncation, unsafe paths and duplicate entries.');
