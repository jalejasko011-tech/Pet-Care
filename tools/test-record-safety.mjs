import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
const helper=await readFile('www/record-safety.js','utf8'),html=await readFile('www/index.html','utf8');
const core=html.slice(html.indexOf("const KEY="),html.indexOf('function pet()'));
const wire=html.slice(html.indexOf('function wireForms()'),html.indexOf('function del('));
function setup(raw=null){
 const stored=new Map(raw===null?[]:[['petcare_data_v1',raw]]),messages=[];let quota=false,writes=0,renders=0,native=0;
 const form={dataset:{},elements:{photo:{files:[]}},querySelector:()=>({disabled:false}),values:{id:'',name:'Luna',type:'Pas',kg:'5'}};
 const c={URL,Date,Math,Blob,setTimeout,console:{error(){},warn(){}},localStorage:{getItem:k=>stored.get(k)??null,setItem(k,v){if(quota)throw Object.assign(Error('Full'),{name:'QuotaExceededError'});writes++;stored.set(k,v);}},document:{getElementById:id=>id==='petForm'?form:null},window:{petCareNative:{sync:async()=>{native++;}}},toast:s=>messages.push(s),render(){renders++;},FormData:class{constructor(f){return new Map(Object.entries(f.values));}}};
 c.window.petCareAge={wire(){},prepare:()=>true,clean:o=>o};
 runInNewContext(helper,c);c.window.petCareRecords.recovery=()=>{};runInNewContext(core+wire,c);
 return {c,stored,form,messages,quota:v=>quota=v,counts:()=>({writes,renders,native}),eval:s=>runInNewContext(s,c)};
}
const f=setup(),validate=f.c.window.petCareRecords.validate,good={pets:[{id:'pet1',name:'Luna',birth:'2020-02-29',photo:'data:image/png;base64,AA=='}],feedingPlans:[{petId:'pet1',times:['08:00','18:00'],enabled:true,gapHours:12}]};
assert.doesNotThrow(()=>validate(good));
for(const patch of [{pets:null},{pets:[{id:'bad\" id',name:'Luna'}]},{pets:[{id:'pet1',name:'Luna',birth:'2026-02-31'}]},{pets:[{id:'pet1',name:'Luna',birth:'\" autofocus onfocus=alert(1) x=\"'}]},{pets:[{id:'pet1',name:'Luna',kg:'\" onerror=alert(1)'}]},{pets:[],communityReports:[{id:'r',photo:'https://tracker.example/photo'}]},{pets:[],logs:[{date:{html:'bad'}}]},{pets:[],adoptionSaved:[{id:'x',url:'javascript:alert(1)'}]},{pets:[],feedingPlans:[{petId:'p',times:['99:99']}]},{pets:[],weights:[{id:'a',kg:1},{id:'a',kg:2}]}])assert.throws(()=>validate(patch));
for(const raw of ['{"pets":null}','{"pets":[],"health":{}}','{"pets":[{"id":"x","name":"Luna","photo":"https://tracker.example"}]}','broken JSON']){const x=setup(raw);assert.equal(x.eval('save()'),false);assert.equal(x.stored.get('petcare_data_v1'),raw);assert.equal(x.counts().writes,0);}
f.eval("formMode='pet';wireForms()");f.quota(true);await f.form.onsubmit({preventDefault(){}});assert.equal(f.eval('data.pets.length'),0);assert.equal(f.eval('formMode'),'pet');assert.equal(f.form.values.name,'Luna');assert.equal(f.counts().renders,0);assert.equal(f.counts().native,0);assert.ok(!f.messages.includes('Profil je sačuvan.'));
f.quota(false);await f.form.onsubmit({preventDefault(){}});assert.equal(f.eval('data.pets.length'),1);assert.equal(JSON.parse(f.stored.get('petcare_data_v1')).pets.length,1);assert.equal(f.eval('formMode'),null);assert.equal(f.messages.at(-1),'Profil je sačuvan.');assert.equal(f.counts().native,1);
// Reopening uses the actual committed record, rather than a successful-looking draft.
assert.equal(setup(f.stored.get('petcare_data_v1')).eval('data.pets[0].name'),'Luna');
console.log('PASS private records: malicious/invalid backups rejected, corrupt originals preserved, quota rollback, unchanged form, honest status, no scheduling on failure and single successful retry surviving reload.');
