// Keep native cancellation/scheduling in order even when save, resume and settings overlap.
(() => {
 const native=window.petCareNative,api=()=>window.Capacitor?.Plugins?.LocalNotifications;
 const t=(sr,en)=>window.petCareI18n.phrase(sr,en);
 let queue=Promise.resolve();
 const sync=native.sync.bind(native);
 native.lastSchedule={state:'unknown'};
 native.sync=(reminders,pets)=>{
  const snapshot=JSON.parse(JSON.stringify({reminders,pets}));
  const run=queue.catch(()=>{}).then(async()=>{
   native.lastSchedule={state:'scheduling'};
   try{const result=await sync(snapshot.reminders,snapshot.pets);native.lastSchedule={state:result.native&&result.permission?'scheduled':'notScheduled',...result};return result;}
   catch(error){native.lastSchedule={state:'error'};throw error;}
  });queue=run;
  // Report a stalled bridge without starting a competing native mutation. The
  // original run remains the queue barrier until it actually settles.
  let timer;const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>{native.lastSchedule={state:'error',reason:'nativeTimeout',operation:native.lastOperation?.name||'queue'};reject(Error('Notification bridge timeout: '+(native.lastOperation?.name||'queue')));},20000);});
  return Promise.race([run,deadline]).finally(()=>clearTimeout(timer));
 };
 native.exactStatus=async()=>{
  if(window.Capacitor?.getPlatform?.()!=='android'||!api()?.checkExactNotificationSetting)return 'notApplicable';
  try{return (await api().checkExactNotificationSetting()).exact_alarm;}catch{return 'unknown';}
 };
 const resync=()=>native.sync([...data.reminders,...data.health.filter(h=>h.nextDate).map(h=>({...h,title:h.title||h.category||'Health reminder',time:'09:00'}))],data.pets);
 native.requestExact=async()=>{
  if(await native.exactStatus()!=='granted')await api()?.changeExactNotificationSetting?.();
  return resync();
 };
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&document.readyState==='complete')resync().catch(()=>{});});
 const previous=render;
 render=function(){previous();if(!['reminders','diagnostics'].includes(tab)||window.Capacitor?.getPlatform?.()!=='android')return;
  const section=document.createElement('section');section.className='card';section.style.marginBottom='14px';
  const message=document.createElement('p');message.textContent=t('Za podsetnike u izabrano vreme dozvolite „Alarmi i podsetnici“. Bez te dozvole Android može odložiti obaveštenje. Posle restarta prvo jednom otključajte telefon. Huawei može zahtevati i ručno upravljanje radom u pozadini.','Allow “Alarms & reminders” for reminders at your chosen time. Without access Android may delay delivery. Unlock once after restarting the phone. Huawei may also require manual background management.');
  const status=document.createElement('p');status.setAttribute('role','status');
  const button=document.createElement('button');button.className='btn secondary';button.textContent=t('Podesi precizne podsetnike','Set up precise reminders');button.onclick=async()=>{try{await native.requestExact();status.textContent=t('Vratite se iz podešavanja i ponovite proveru.','Return from Settings and run checks again.');}catch{status.textContent=t('Podešavanje nije otvoreno. Proverite Alarme i podsetnike u podešavanjima telefona.','Could not open Settings. Check Alarms & reminders in phone settings.');}};
  section.append(message,status,button);document.getElementById('content').prepend(section);
  native.exactStatus().then(value=>{if(!section.isConnected)return;status.textContent=t('Precizni podsetnici: ','Precise reminders: ')+(value==='granted'?t('dozvoljeni','allowed'):value==='denied'?t('nisu dozvoljeni; moguće kašnjenje','not allowed; delays possible'):value);button.hidden=value==='granted';});
 };
})();
