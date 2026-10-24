import {_android} from 'playwright';
import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
const adb=(...args)=>execFileSync('adb',args,{encoding:'utf8',timeout:20000});
const wait=ms=>new Promise(r=>setTimeout(r,ms));
let device;
try {
 [device]=await _android.devices();
 adb('shell','am','start','-W','-n','com.petcare.companion/.MainActivity');
 const page=await (await device.webView({pkg:'com.petcare.companion'})).page();
 await page.waitForFunction(()=>window.petCareNative?.exactStatus);
 assert.equal(await page.evaluate(()=>petCareNative.exactStatus()),'granted');
 const at=await page.evaluate(async()=>{
  const at=Date.now()+150000;
  const result=await petCareNative.sync([{id:'reboot-lock-test',petId:data.pets[0]?.id,title:'PETCARE_REBOOT_LOCK_DELIVERY',at}],data.pets);
  if(result.count!==1)throw Error('Reminder not scheduled before reboot');
  return at;
 });
 await device.close();device=null;
 adb('reboot');
 // Use short polls so CI can expose progress and a stuck boot has a deadline.
 let booted=false;for(let i=0;i<60;i++){await wait(2000);try{if(adb('shell','getprop','sys.boot_completed').trim()==='1'){booted=true;break;}}catch{}}
 assert.ok(booted,'Emulator did not reboot');
 adb('shell','input','keyevent','KEYCODE_WAKEUP');adb('shell','wm','dismiss-keyguard');adb('shell','input','keyevent','82');
 await wait(4000);
 adb('shell','input','keyevent','KEYCODE_HOME');adb('shell','input','keyevent','KEYCODE_SLEEP');
 adb('shell','dumpsys','battery','unplug');adb('shell','dumpsys','deviceidle','force-idle');
 let delivered=false;
 while(Date.now()<at+60000){
  const dump=adb('shell','dumpsys','notification','--noredact');
  if(dump.split('NotificationRecord(').slice(1).some(s=>s.includes('pkg=com.petcare.companion')&&s.includes('PETCARE_REBOOT_LOCK_DELIVERY'))){delivered=true;break;}
  await wait(3000);
 }
 assert.ok(delivered,'No reminder after reboot, first unlock, relock and forced Doze without reopening app');
 console.log('PASS Android reminder restored after actual reboot, first unlock and relock; delivered during forced Doze without opening Pet Care. Physical-device and OEM evidence is recorded separately from this emulator test.');
} finally {
 try{adb('shell','dumpsys','deviceidle','unforce');adb('shell','dumpsys','battery','reset');}catch{}
 if(device)await device.close();
}
