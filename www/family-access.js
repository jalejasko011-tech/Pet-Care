// Run before all app modules. Restricted launches never initialize remote SDKs.
// The local parental PIN is a UI control, not an account or identity verification.
(() => {
 'use strict';
 const key='petcare_family_access_v1',sessionKey='petcare_family_session_v1';
 let saved=null,session=null;
 try{saved=JSON.parse(localStorage.getItem(key));session=JSON.parse(sessionStorage.getItem(sessionKey));}catch{}
 const valid=saved?.version===1 && /^[a-f0-9]{32}$/.test(saved.salt||'') && /^[a-f0-9]{64}$/.test(saved.hash||'');
 // Short-lived adult sessions do not carry across app restarts or into backups.
 const adult=Boolean(valid&&session?.hash===saved.hash&&session?.expires>Date.now()&&session.expires<Date.now()+31*60e3);
 const policy=Object.freeze({adult,key,sessionKey,configured:Boolean(valid)});
 Object.defineProperty(window,'petCareFamily',{value:policy,writable:false,configurable:false});
 if(adult)return;
 const csp=document.createElement('meta');csp.httpEquiv='Content-Security-Policy';
 csp.content="default-src 'self' data: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' data: blob:; connect-src 'self' data: blob:; frame-src 'none'; object-src 'none'; form-action 'self'; base-uri 'self'";
 document.head.append(csp);
 const allowed=raw=>{try{const url=new URL(raw,location.href);return ['data:','blob:'].includes(url.protocol)||url.origin===location.origin&&['http:','https:','capacitor:'].includes(url.protocol);}catch{return false;}};
 const denial=()=>Promise.reject(new DOMException('Parent access required','NotAllowedError'));
 const originalFetch=window.fetch.bind(window);window.fetch=(input,options)=>allowed(typeof input==='string'||input instanceof URL?input:input.url)?originalFetch(input,options):denial();
 window.open=()=>null;
 // Downloads, share sheets, mail/tel and external links can disclose private data.
 document.addEventListener('click',event=>{const a=event.target.closest?.('a');if(a&&(!allowed(a.href)||a.hasAttribute('download'))){event.preventDefault();event.stopImmediatePropagation();}},true);
 try{Object.defineProperty(navigator,'share',{value:denial});}catch{}
 // Hide the adult interface until the separate restricted renderer is ready.
 const style=document.createElement('style');style.textContent='body>.app,body>.chat-shortcut{display:none!important}';document.head.append(style);
})();
