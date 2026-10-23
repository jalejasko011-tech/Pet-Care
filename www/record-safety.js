// Shared validation for private records loaded from this device or a backup.
(() => {
 'use strict';
 const collections=['pets','health','weights','logs','food','costs','reminders','bonding','sos','family','training','events','routineDone','feedings','feedingPlans','adoptionSaved','communityReports'];
 const id=/^[A-Za-z0-9_-]{1,100}$/;
 const dates=new Set(['date','birth','nextDate']),numbers=new Set(['kg','amount','duration','minutes','distanceKm','gapHours','at']);
 const stringFields=new Set(['name','type','breed','sex','chip','passport','title','category','notes','note','vetName','phone','clinic','allergies','medical','mood','appetite','stool','activity','caregiver','kind','repeat','place','details','created','progress','country','city','contact','url','photo','source']);
 const image=/^data:image\/(jpeg|png|webp|gif|bmp|avif|heic|heif);base64,[A-Za-z0-9+/=]+$/;
 const seed=()=>Object.fromEntries(collections.map(k=>[k,[]]));
 function calendar(value){if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value.startsWith('0000-'))return false;const d=new Date(value+'T12:00:00');return Number.isFinite(+d)&&`${String(d.getFullYear()).padStart(4,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`===value;}
 function validate(value){
  if(!value||typeof value!=='object'||Array.isArray(value)||!Array.isArray(value.pets)||value.pets.length>1000)throw Error('Invalid pet records');
  for(const [key,rows] of Object.entries(value)){
   if(!collections.includes(key)||!Array.isArray(rows)||rows.length>100000)throw Error('Invalid record collection');
   const ids=new Set();
   for(const row of rows){
    if(!row||typeof row!=='object'||Array.isArray(row))throw Error('Invalid record');
    for(const [field,v]of Object.entries(row)){
     if(['__proto__','prototype','constructor'].includes(field))throw Error('Unsafe record key');
     if(field==='times'&&key==='feedingPlans'){if(!Array.isArray(v)||v.length>6||v.some(x=>typeof x!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(x)))throw Error('Invalid meal times');continue;}
     if(v!==null&&!['string','number','boolean'].includes(typeof v)||typeof v==='number'&&!Number.isFinite(v))throw Error('Invalid record value');
     if(['id','petId','reminderId'].includes(field)&&(typeof v!=='string'||!id.test(v)))throw Error('Invalid record ID');
     if(stringFields.has(field)&&typeof v!=='string')throw Error('Invalid text field');
     if(dates.has(field)&&v!==''&&!calendar(v))throw Error('Invalid calendar date');
     if(field==='time'&&v!==''&&(typeof v!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(v)))throw Error('Invalid time');
     if(numbers.has(field)&&(typeof v!=='string'&&typeof v!=='number'||v!==''&&(!Number.isFinite(Number(v))||Number(v)<0)))throw Error('Invalid number');
     if(field==='photo'&&v&&!image.test(v))throw Error('Invalid profile photo');
     if(field==='url'&&v){let u;try{u=new URL(v);}catch{}if(!u||!['https:','http:'].includes(u.protocol))throw Error('Invalid saved link');}
    }
    if(key==='pets'&&(typeof row.name!=='string'||!row.name.trim()||typeof row.id!=='string'||!id.test(row.id)))throw Error('Invalid pet profile');
    if(row.id){if(ids.has(row.id))throw Error('Duplicate record ID');ids.add(row.id);}
   }
  }
  return value;
 }
 function recovery(raw){
  if(document.getElementById('recordRecovery'))return;
  const box=document.createElement('section');box.id='recordRecovery';box.className='notice';box.setAttribute('role','alert');
  box.append(document.createTextNode('Records could not be opened. The original data has been kept; saving is paused. / Evidencija se ne može otvoriti. Izvorni podaci su sačuvani; novi upisi su zaustavljeni. '));
  if(typeof raw==='string'){const button=document.createElement('button');button.className='btn secondary';button.textContent='Save original data / Sačuvaj izvorne podatke';button.onclick=()=>{const url=URL.createObjectURL(new Blob([raw],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='Pet-Care-Recovery.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);};box.append(button);}
  document.getElementById('content').before(box);
 }
 window.petCareRecords={seed,validate,calendar,recovery};
})();
