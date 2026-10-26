// Keep visible form captions associated with their controls after every render.
(() => {
 'use strict';
 let sequence=0;
 function connect(root=document.getElementById('content')){
  if(!root)return;
  for(const label of root.querySelectorAll('label:not([for])')){
   if(!label.textContent.trim())continue;
   const next=label.nextElementSibling,control=label.querySelector('input,select,textarea')||(next?.matches('input,select,textarea')?next:null);
   if(!control||control.type==='hidden'||control.labels?.length)continue;
   if(!control.id){do{control.id='petcare-field-'+(++sequence);}while(document.querySelectorAll('#'+control.id).length>1);}
   label.htmlFor=control.id;
  }
 }
 const style=document.createElement('style');
 style.textContent='button,input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]),select{min-height:48px}#settingsShortcut{width:48px!important;height:48px!important;min-height:48px!important}.header-controls{grid-template-columns:minmax(0,1fr) 48px!important}.header-controls #familyModeButton,.header-controls #languageSelect{min-height:48px!important}';
 document.head.append(style);
 const previous=render;render=function(){previous();connect();};
 const content=document.getElementById('content');if(content)new MutationObserver(()=>connect()).observe(content,{childList:true,subtree:true});
 window.petCareFormAccessibility={connect};connect();
})();
