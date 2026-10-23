// Keep native cancellation/scheduling in order even when save, resume and settings overlap.
(() => {
 const native=window.petCareNative,api=()=>window.Capacitor?.Plugins?.LocalNotifications;
 const t=(sr,en)=>window.petCareI18n.phrase(sr,en);
 let queue=Promise.resolve();
 const sync=native.sync.bind(native);
 native.lastSchedule={state:'unknown'};
 native.sync=(reminders,pets)=>{
  if(window.petCareRecords?.isBlocked?.()){native.lastSchedule={state:'error',reason:'recordRecovery'};return Promise.reject(Error('Record recovery required before changing alarms'));}
  const snapshot=JSON.parse(JSON.stringify({reminders,pets}));
  const run=queue.catch(()=>{}).then(async()=>{
   if(window.petCareRecords?.isBlocked?.())throw Error('Record recovery required before changing alarms');
   native.lastSchedule={state:'scheduling'};
   try{const before=await native.exactStatus(),result=await sync(snapshot.reminders,snapshot.pets),after=await native.exactStatus();const precision=!result.native||!result.permission||!result.count?'notScheduled':before==='granted'&&after==='granted'?'exact':after==='denied'?'approximate':after==='notApplicable'?'notApplicable':'unknown';const outcome={...result,exactAlarms:after,precision};native.lastSchedule={state:result.native&&result.permission&&result.count>0?'scheduled':'notScheduled',...outcome};return outcome;}
   catch(error){native.lastSchedule={state:'error'};throw error;}
  });queue=run;
  // Report a stalled bridge without starting a competing native mutation. The
  // original run remains the queue barrier until it actually settles.
  let timer;const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>{native.lastSchedule={state:'error',reason:'nativeTimeout',operation:native.lastOperation?.name||'queue'};reject(Error('Notification bridge timeout: '+(native.lastOperation?.name||'queue')));},20000);});
  return Promise.race([run,deadline]).finally(()=>clearTimeout(timer));
 };
 native.exactStatus=async()=>{
  if(window.Capacitor?.getPlatform?.()!=='android')return 'notApplicable';
  if(!api()?.checkExactNotificationSetting)return 'unknown';
  try{return (await api().checkExactNotificationSetting()).exact_alarm;}catch{return 'unknown';}
 };
 const resync=()=>native.sync([...data.reminders,...data.health.filter(h=>h.nextDate).map(h=>({...h,title:h.title||h.category||'Health reminder',time:'09:00'}))],data.pets);
 native.requestExact=async()=>{
  if(await native.exactStatus()!=='granted'){if(!api()?.changeExactNotificationSetting)throw Error('Exact alarm settings unavailable');await api().changeExactNotificationSetting();}
  return resync();
 };
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&document.readyState==='complete')resync().catch(()=>{});});
 native.resync=resync;
 native.scheduleNotice=result=>{
  if(!result.native||!result.permission||!result.count)return t('Sačuvano. Obaveštenje na telefonu nije zakazano; otvorite Pomoć i provere.','Saved. Phone notification not scheduled; open Help and device checks.');
  if(result.limited)return t('Sačuvano. Zakazano je prvih 64 budućih podsetnika; nisu svi zakazani. Smanjite broj aktivnih podsetnika.','Saved. Only the first 64 upcoming reminders were scheduled. Reduce the number of active reminders.');
  if(result.precision==='approximate')return t('Sačuvano. Podsetnik je približan i može kasniti. Dozvolite precizne alarme.','Saved. Reminder timing is approximate and may be delayed. Allow exact alarms.');
  if(result.precision!=='exact')return t('Sačuvano. Tačnost podsetnika nije potvrđena; proverite dozvolu za precizne alarme.','Saved. Reminder timing is not confirmed; check exact alarm access.');
  return t('Sačuvano i zakazano uz dozvolu za precizne alarme.','Saved and scheduled with exact alarm access.');
 };
})();
