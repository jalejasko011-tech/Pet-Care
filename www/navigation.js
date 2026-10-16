// One shared route history for Android Back and browser Back/Forward.
(() => {
 const key='petcareRouteV1',api=window.Capacitor?.getPlatform?.()==='android'?window.Capacitor?.Plugins?.App:null;
 const validTabs=new Set([...document.querySelectorAll('#nav [data-tab]')].map(b=>b.dataset.tab));
 let restoring=false,pending=false,lastRootBack=0;
 function normalize(s){const active=data.pets.some(p=>p.id===s?.activePet)?s.activePet:data.pets[0]?.id||null;let mode=typeof s?.formMode==='string'?s.formMode:null;if(mode?.startsWith('editpet:')&&!data.pets.some(p=>'editpet:'+p.id===mode))mode=null;return {tab:validTabs.has(s?.tab)?s.tab:'home',formMode:mode,activePet:active,memoryEditor:typeof s?.memoryEditor==='string'?s.memoryEditor:null};}
 const snapshot=()=>normalize({tab,formMode,activePet,memoryEditor:window.petCareMemories?.getEditor?.()});
 const signature=s=>JSON.stringify(normalize(s));
 const initial=history.state?.[key];let depth=Number.isInteger(initial?.depth)&&initial.depth>=0?initial.depth:0,current=normalize(initial?.screen||snapshot());
 function apply(s){s=normalize(s);tab=s.tab;formMode=s.formMode;activePet=s.activePet;window.petCareMemories?.setEditor?.(s.memoryEditor);}
 function state(screen,scrollY=0){return {[key]:{depth,screen,scrollY}};}
 function record(){if(restoring)return;const next=snapshot(),old=normalize(current);if(signature(next)===signature(old)){current=next;history.replaceState(state(next,scrollY),'');return;}
  history.replaceState(state(old,scrollY),'');
  // Saving/canceling a form replaces the editor instead of reopening it on Back.
  const closedEditor=old.tab===next.tab&&((old.formMode&&!next.formMode)||(old.memoryEditor&&!next.memoryEditor));
  current=next;lastRootBack=0;if(!closedEditor){depth++;history.pushState(state(next),'');}else history.replaceState(state(next),'');
 }
 const previousRender=render;render=function(){record();return previousRender();};
 apply(current);history.replaceState(state(current,initial?.scrollY||0),'');restoring=true;render();restoring=false;
 window.addEventListener('petcare:screen-updated',record);
 window.addEventListener('popstate',event=>{
  const saved=event.state?.[key];if(!saved){pending=false;return;}
  const next=normalize(saved.screen),same=signature(next)===signature(current);depth=saved.depth;current=next;apply(next);lastRootBack=0;
  if(same&&depth>0){history.back();return;}
  restoring=true;render();restoring=false;pending=false;
  document.querySelector(`#nav [data-tab="${tab}"]`)?.scrollIntoView({block:'nearest',inline:'nearest'});
  requestAnimationFrame(()=>window.scrollTo(0,Number(saved.scrollY)||0));
 });
 function closeOverlay(){const dialog=[...document.querySelectorAll('dialog[open]')].pop();if(!dialog)return false;const cancel=new Event('cancel',{cancelable:true});if(dialog.dispatchEvent(cancel))dialog.close();return true;}
 async function back(event={}){
  if(closeOverlay()){lastRootBack=0;return;}
  if(pending)return;
  if(depth>0||event.canGoBack){pending=true;history.back();setTimeout(()=>pending=false,500);return;}
  if(tab!=='home'||formMode){tab='home';formMode=null;window.petCareMemories?.setEditor?.(null);restoring=true;current=snapshot();history.replaceState(state(current),'');render();restoring=false;return;}
  if(!api)return;
  if(Date.now()-lastRootBack<2000){lastRootBack=0;await api.exitApp();return;}
  lastRootBack=Date.now();toast(currentLang()==='sr'?'Pritisnite Nazad još jednom za izlaz.':'Press Back again to exit.');
 }
 const ready=(async()=>{if(!api)return false;try{await api.addListener('backButton',back);return true;}catch(e){console.warn('Back navigation registration failed',e);return false;}})();
 window.petCareNavigation={back,ready,getState:()=>({depth,screen:snapshot()})};
})();
