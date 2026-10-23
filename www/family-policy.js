// Loaded before application code. Open the app directly; family view is optional.
(() => {
 'use strict';
 const key='petcare_parent_control_v1',sessionKey='petcare_parent_session_v1';
 const read=()=>{try{const x=JSON.parse(localStorage.getItem(key)||'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{};}catch{return {};}};
 let state=read();
 // Older entry gates must not block an update. No PIN, birthday or age is stored.
 if(state.v!==3){try{localStorage.removeItem(key);}catch{}state={};}try{sessionStorage.removeItem(sessionKey);}catch{}
 const isStandard=()=>state.mode!=='family';
 const mark=()=>document.documentElement.dataset.petcareMode=isStandard()?'standard':'family';mark();
 const requireStandard=()=>{if(isStandard())return true;window.dispatchEvent(new Event('petcare:full-view-required'));return false;};
 const setMode=mode=>{const next={v:3,mode};localStorage.setItem(key,JSON.stringify(next));state=next;mark();window.dispatchEvent(new Event(mode==='family'?'petcare:family-locked':'petcare:full-view-opened'));};
 const open=()=>setMode('standard'),lock=()=>setMode('family');
 window.petCareFamily=Object.freeze({isStandard,requireStandard,open,lock});
 // Defense in depth for third-party fetches and browser/system sharing. SDK imports
 // have an additional explicit gate in global-chat.js; native APIs are gated at use.
 const originalFetch=window.fetch.bind(window);window.fetch=function(input,options){const url=new URL(typeof input==='string'||input instanceof URL?input:input.url,location.href);if(!['data:','blob:'].includes(url.protocol)&&url.origin!==location.origin&&!requireStandard())return Promise.reject(Error('PARENT_REQUIRED'));return originalFetch(input,options);};
 const originalOpen=window.open.bind(window);window.open=function(...args){if(!requireStandard())return null;return originalOpen(...args);};
 if(navigator.share){const share=navigator.share.bind(navigator);navigator.share=function(...args){if(!requireStandard())return Promise.reject(Error('PARENT_REQUIRED'));return share(...args);};}
 document.addEventListener('click',e=>{if(isStandard())return;const a=e.target.closest?.('a');if(!a)return;const url=new URL(a.href,location.href);if(url.origin===location.origin&&/\/(?:privacy|index)\.html$/.test(url.pathname))return;e.preventDefault();e.stopImmediatePropagation();requireStandard();},true);
 window.addEventListener('storage',e=>{if(e.key===key){state=read();mark();location.reload();}});
})();
