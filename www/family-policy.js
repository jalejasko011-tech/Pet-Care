// Loaded before application code. Unknown age always uses the local family view.
(() => {
 'use strict';
 const key='petcare_parent_control_v1',sessionKey='petcare_parent_session_v1';
 const read=()=>{try{return JSON.parse(localStorage.getItem(key)||'{}');}catch{return {};}};
 const valid=x=>x?.v===1&&/^[a-f0-9]{32}$/.test(x.salt)&&/^[a-f0-9]{64}$/.test(x.hash);
 let state=read();
 function isAdult(){try{return valid(state)&&state.locked===false&&Number(sessionStorage.getItem(sessionKey))>Date.now();}catch{return false;}}
 const mark=()=>document.documentElement.dataset.petcareMode=isAdult()?'adult':'family';mark();
 const requireAdult=()=>{if(isAdult())return true;window.dispatchEvent(new Event('petcare:parent-required'));return false;};
 const store=x=>{localStorage.setItem(key,JSON.stringify(x));state=x;};
 const hex=bytes=>Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
 async function hash(pin,salt){const k=await crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveBits']);return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:Uint8Array.from(salt.match(/../g),x=>parseInt(x,16)),iterations:150000,hash:'SHA-256'},k,256)));}
 function adultDate(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;const d=new Date(value+'T12:00:00'),now=new Date();if(!Number.isFinite(+d)||d.getFullYear()!==Number(value.slice(0,4))||d.getMonth()+1!==Number(value.slice(5,7))||d.getDate()!==Number(value.slice(8,10))||d>now||d.getFullYear()<now.getFullYear()-120)return false;let age=now.getFullYear()-d.getFullYear();if(now.getMonth()<d.getMonth()||(now.getMonth()===d.getMonth()&&now.getDate()<d.getDate()))age--;return age>=18;}
 function admit(){sessionStorage.setItem(sessionKey,String(Date.now()+15*60*1000));store({...state,locked:false,failures:0,retryAt:0});mark();window.dispatchEvent(new Event('petcare:parent-unlocked'));}
 async function setup(birth,pin,repeat){if(valid(state))throw Error('ALREADY_SET');if(!adultDate(birth))throw Error('FAMILY_VIEW');if(!/^\d{6,12}$/.test(pin)||pin!==repeat)throw Error('INVALID_CODE');const salt=hex(crypto.getRandomValues(new Uint8Array(16))),digest=await hash(pin,salt);store({v:1,salt,hash:digest,locked:true});admit();}
 async function unlock(pin){state=read();if(!valid(state))throw Error('NOT_SET');if(Number(state.retryAt)>Date.now())throw Error('WAIT');if(await hash(String(pin),state.salt)!==state.hash){const failures=(Number(state.failures)||0)+1;store({...state,locked:true,failures,retryAt:failures>=5?Date.now()+30000:0});throw Error('WRONG_CODE');}admit();}
 function lock(){sessionStorage.removeItem(sessionKey);if(valid(state))store({...state,locked:true});mark();window.dispatchEvent(new Event('petcare:family-locked'));}
 window.petCareFamily=Object.freeze({isAdult,requireAdult,setup,unlock,lock,hasCode:()=>valid(state)});
 // Defense in depth for third-party fetches and browser/system sharing. SDK imports
 // have an additional explicit gate in global-chat.js; native APIs are gated at use.
 const originalFetch=window.fetch.bind(window);window.fetch=function(input,options){const url=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);if(!['data:','blob:'].includes(url.protocol)&&url.origin!==location.origin&&!requireAdult())return Promise.reject(Error('PARENT_REQUIRED'));return originalFetch(input,options);};
 const originalOpen=window.open.bind(window);window.open=function(...args){if(!requireAdult())return null;return originalOpen(...args);};
 if(navigator.share){const share=navigator.share.bind(navigator);navigator.share=function(...args){if(!requireAdult())return Promise.reject(Error('PARENT_REQUIRED'));return share(...args);};}
 document.addEventListener('click',e=>{if(isAdult())return;const a=e.target.closest?.('a');if(!a)return;const url=new URL(a.href,location.href);if(url.origin===location.origin&&/\/(?:privacy|index)\.html$/.test(url.pathname))return;e.preventDefault();e.stopImmediatePropagation();requireAdult();},true);
 window.addEventListener('storage',e=>{if(e.key===key){state=read();mark();if(!isAdult()){window.dispatchEvent(new Event('petcare:family-locked'));location.reload();}}});
})();
