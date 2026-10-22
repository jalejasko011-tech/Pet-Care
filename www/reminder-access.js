// Runs after all screen renderers, including the dedicated diagnostics renderer.
(() => {
 const native=window.petCareNative,t=(sr,en)=>window.petCareI18n.phrase(sr,en);
 if(window.Capacitor?.getPlatform?.()!=='android')return;
 const style=document.createElement('style');style.textContent='.reminder-access{margin-bottom:14px}.reminder-access .btn{min-height:44px}.reminder-access p{overflow-wrap:anywhere}';document.head.append(style);
 let generation=0;
 async function refresh(){
  const token=++generation,section=document.getElementById('reminderAccess');if(!section)return;
  const value=await native.exactStatus();if(token!==generation||!section.isConnected)return;
  const status=section.querySelector('[data-alarm-status]'),button=section.querySelector('[data-alarm-allow]');
  status.textContent=value==='granted'?t('Precizni alarmi: dozvoljeni.','Exact alarms: allowed.'):value==='denied'?t('Precizni alarmi nisu dozvoljeni. Podsetnici mogu kasniti.','Exact alarms are not allowed. Reminders may be delayed.'):t('Dozvola za precizne alarme nije potvrđena. Proverite je u podešavanjima telefona.','Exact alarm access could not be confirmed. Check it in phone settings.');
  if(section.dataset.permission!==value)section.querySelector('[data-alarm-outcome]').textContent='';
  button.hidden=value==='granted';section.dataset.permission=value;
  if(tab==='diagnostics')window.petCareDiagnostics?.refresh?.();
 }
 function update(){
  if(window.petCareFamily?.isStandard()===false)return;
  const relevant=['reminders','diagnostics','routine','feeding','health','settings'].includes(tab)||tab==='home'&&(data.reminders.length||data.health.some(x=>x.nextDate)||data.feedingPlans?.some(x=>x.enabled));
  if(!relevant)return;
  let section=document.getElementById('reminderAccess');
  if(!section){
   section=document.createElement('section');section.id='reminderAccess';section.className='card reminder-access';
   const title=document.createElement('h3');title.textContent=t('Tačnost podsetnika','Reminder timing');
   const status=document.createElement('p');status.dataset.alarmStatus='';status.setAttribute('role','status');status.textContent=t('Proveravam dozvolu…','Checking access…');
   const info=document.createElement('p');info.className='small';info.textContent=t('Dozvolu uključujete sami u podešavanjima telefona. Posle restarta jednom otključajte telefon. Ako i dalje kasni, proverite ograničenja baterije i rada u pozadini za Pet Care.','You grant access in phone settings. Unlock once after restarting. If reminders are still delayed, check Pet Care battery and background restrictions.');
   const row=document.createElement('div');row.className='btnrow';
   const button=document.createElement('button');button.type='button';button.className='btn';button.dataset.alarmAllow='';button.textContent=t('Dozvoli precizne podsetnike','Allow exact reminders');
   const retry=document.createElement('button');retry.type='button';retry.className='btn secondary';retry.textContent=t('Proveri dozvolu','Check access');retry.onclick=refresh;
   const outcome=document.createElement('p');outcome.className='small';outcome.dataset.alarmOutcome='';outcome.setAttribute('role','status');
   button.onclick=async()=>{button.disabled=true;outcome.textContent='';try{await native.requestExact();await refresh();outcome.textContent=section.dataset.permission==='granted'?t('Dozvola je uključena. Raspored je ponovo proveren. Proverite prijem na telefonu.','Access is allowed. The schedule was checked again. Test delivery on your phone.'):t('Dozvola još nije uključena. U podešavanjima izaberite Pet Care i dozvolite Alarme i podsetnike.','Access is still not allowed. In settings select Pet Care and allow Alarms & reminders.');}catch{outcome.textContent=t('Podešavanje nije završeno. U podešavanjima telefona potražite Alarmi i podsetnici → Pet Care.','Setup did not finish. In phone settings search for Alarms & reminders → Pet Care.');}finally{button.disabled=false;await refresh();}};
   row.append(button,retry);section.append(title,status,info,row,outcome);document.getElementById('content').prepend(section);
  }
  refresh();
 }
 const previous=render;render=function(){previous();update();};update();
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});
 // Native resumes do not always produce a WebView visibility event on OEM devices.
 (async()=>{try{await window.Capacitor.Plugins.App?.addListener('appStateChange',state=>{if(state.isActive&&document.readyState==='complete'){native.resync().catch(()=>{});refresh();}});}catch{}})();
})();
