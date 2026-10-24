// Durable local pet deletion. Cloud families and independently exported files are separate.
(() => {
 'use strict';
 const key='petcare_pet_delete_v1',t=(s,e)=>window.petCareI18n.phrase(s,e);
 let busy=false;
 function journal(){const raw=localStorage.getItem(key);if(raw===null)return null;const x=JSON.parse(raw);if(x?.v!==1||typeof x.petId!=='string'||!/^[A-Za-z0-9_-]{1,100}$/.test(x.petId))throw Error('Invalid deletion journal');return x;}
 const pending=()=>{try{return localStorage.getItem(key)!==null;}catch{return false;}};
 async function cleanup(id){
  const rows=await galleryAll();await galleryTx('readwrite',s=>{for(const x of rows)if(x.petId===id)s.delete(x.id);});
  await window.petCareMemories.removePet(id);window.petCareMemories.setEditor(null);
  const raw=localStorage.getItem(WORLD_KEY),drafts=raw===null?[]:JSON.parse(raw);
  if(!Array.isArray(drafts))throw Error('Invalid private drafts');
  const remaining=drafts.filter(x=>x.petId!==id);if(remaining.length!==drafts.length)worldSave(remaining);
 }
 async function resume(){
  if(busy)return false;if(window.petCareBackup?.isBusy())return false;
  if(window.petCareRecords.isBlocked())return false;
  busy=true;let success=false;
  try{
   const x=journal();if(!x)return true;
   // A crash before the core save leaves the pet intact: no media has been removed.
   if(data.pets.some(p=>p.id===x.petId)){localStorage.removeItem(key);return true;}
   await cleanup(x.petId);localStorage.removeItem(key);success=true;return true;
  }catch{toast(t('Brisanje nije potpuno završeno. Izaberite „Nastavi brisanje“.','Deletion is incomplete. Choose “Resume deletion”.'));return false;}
  finally{busy=false;render();if(success)toast(t('Profil, lokalna evidencija i pripadajući mediji su obrisani.','Pet profile, local records and attached media deleted.'));}
 }
 async function erase(id){
  if(busy||pending()||window.petCareBackup?.isBusy())return false;
  if(window.petCareRecords.isBlocked()||!data.pets.some(p=>p.id===id))return false;
  if(!confirm(t('Trajno obrisati ovog ljubimca, njegovu lokalnu evidenciju, Galeriju, Uspomene i privatne nacrte? Izvezene kopije i zasebna porodična grupa na serveru ostaju. Pre brisanja sačuvajte kopiju ako vam treba.','Permanently delete this pet, its local records, Gallery, Memories and private drafts? Exported backups and the separate shared family on the server remain. Back up first if needed.')))return false;
  try{localStorage.setItem(key,JSON.stringify({v:1,petId:id}));}catch{toast(t('Brisanje nije pokrenuto. Proverite prostor i pristup memoriji.','Deletion did not start. Check storage space and access.'));return false;}
  const removedReminders=new Set(data.reminders.filter(x=>x.petId===id).map(x=>x.id));
  data={...data,...Object.fromEntries(Object.entries(data).filter(([,v])=>Array.isArray(v)).map(([k,v])=>[k,v.filter(x=>k==='pets'?x.id!==id:x.petId!==id&&(k!=='routineDone'||!removedReminders.has(x.reminderId)))]))};
  if(!save()){try{localStorage.removeItem(key);}catch{}render();return false;}
  if(activePet===id)activePet=data.pets[0]?.id||null;
  render();return resume();
 }
 const previous=render;render=function(){previous();if(!pending())return;const root=document.getElementById('content');if(!root||document.getElementById('petDeletionRecovery'))return;const box=document.createElement('section');box.className='notice';box.id='petDeletionRecovery';const text=document.createElement('p');text.textContent=t('Brisanje lokalnih medija je u toku ili čeka nastavak. Kopije i uvoz su privremeno zaustavljeni.','Local media deletion is running or awaits recovery. Backups and imports are temporarily paused.');const button=document.createElement('button');button.className='btn';button.disabled=busy;button.textContent=t('Nastavi brisanje','Resume deletion');button.onclick=resume;box.append(text,button);root.prepend(box);};
 window.petCarePrivateDelete=Object.freeze({erase,resume,isBusy:()=>busy,isPending:pending});
 Promise.resolve(window.petCareBackup?.ready).then(()=>{if(pending())return resume();}).catch(()=>render());
})();
