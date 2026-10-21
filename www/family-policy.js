// Loaded before application code. Unknown age always uses the local family view.
(() => {
 'use strict';
 const key='petcare_parent_control_v1',sessionKey='petcare_parent_session_v1';
 const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}');}catch{return {};}};
 // Retire previously configured PIN credentials; they are no longer used.
 let state=read();if(state.v===1){localStorage.removeItem(key);sessionStorage.removeItem(sessionKey);state={};}
 const valid=x=>x?.v===2&&typeof x.locked==='boolean';
 function isAdult(){try{return valid(state)&&state.locked===false&&Number(sessionStorage.getItem(sessionKey))>Date.now();}catch{return false;}}
 const mark=()=>document.documentElement.dataset.petcareMode=isAdult()?'adult':'family';mark();
 const requireAdult=()=>{if(isAdult())return true;window.dispatchEvent(new Event('petcare:parent-required'));return false;};
 const store=x=>{localStorage.setItem(key,JSON.stringify(x));state=x;};
 function adultDate(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+'T12:00:00'),now=new Date();if(!Number.isFinite(+d)||d.getFullYear()!==Number(value.slice(0,4))||d.getMonth()+1!==Number(value.slice(5,7))||d.getDate()!==Number(value.slice(8,10))||d>now||d.getFullYear()<now.getFullYear()-120)return false;let age=now.getFullYear()-d.getFullYear();if(now.getMonth()<d.getMonth()||(now.getMonth()===d.getMonth()&&now.getDate()<d.getDate()))age--;return age>=18;}
 function admit(){sessionStorage.setItem(sessionKey,String(Date.now()+15*60*1000));store({v:2,locked:false});mark();window.dispatchEvent(new Event('petcare:parent-unlocked'));}
 async function setup(birth){if(!adultDate(birth))throw Error('FAMILY_VIEW');admit();}
 function lock(){sessionStorage.removeItem(sessionKey);if(valid(state))store({...state,locked:true});mark();window.dispatchEvent(new Event('petcare:family-locked'));}
 window.petCareFamily=Object.freeze({isAdult,requireAdult,setup,lock});
 // Defense in depth for third-party fetches and browser/system sharing. SDK imports
 // have an additional explicit gate in global-chat.js; native APIs are gated at use.
 const originalFetch=window.fetch.bind(window);window.fetch=function(input,options){const url=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);if(!['data:','blob:'].includes(url.protocol)&&url.origin!==location.origin&&!requireAdult())return Promise.reject(Error('PARENT_REQUIRED'));return originalFetch(input,options);};
 const originalOpen=window.open.bind(window);window.open=function(...args){if(!requireAdult())return null;return originalOpen(...args);};
 if(navigator.share){const share=navigator.share.bind(navigator);navigator.share=function(...args){if(!requireAdult())return Promise.reject(Error('PARENT_REQUIRED'));return share(...args);};}
 document.addEventListener('click',e=>{if(isAdult())return;const a=e.target.closest?.('a');if(!a)return;const url=new URL(a.href,location.href);if(url.origin===location.origin&&/\/(?:privacy|index)\.html$/.test(url.pathname))return;e.preventDefault();e.stopImmediatePropagation();requireAdult();},true);
 window.addEventListener('storage',e=>{if(e.key===key){state=read();mark();if(!isAdult()){window.dispatchEvent(new Event('petcare:family-locked'));location.reload();}}});
})();
