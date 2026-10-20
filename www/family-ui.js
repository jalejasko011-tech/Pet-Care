// A deliberately small local reading mode. All care edits require the parent area.
(() => {
 'use strict';
 const access=window.petCareFamily;
 const t=(sr,en)=>window.petCareI18n.phrase(sr,en);
 const words=()=>window.PETCARE_FAMILY_COPY?.[document.documentElement.lang]||window.PETCARE_FAMILY_COPY.en;
 const button=(text,fn)=>{const b=document.createElement('button');b.type='button';b.className='btn';b.textContent=text;b.onclick=fn;return b;};
 const hex=bytes=>Array.from(bytes,x=>x.toString(16).padStart(2,'0')).join('');
 async function digest(pin,salt){const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(pin),'PBKDF2',false,['deriveBits']);return hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:new TextEncoder().encode(salt),iterations:210000},material,256)));}
 const panel=document.createElement('dialog');panel.id='familyParentDialog';panel.setAttribute('aria-labelledby','familyParentTitle');document.body.append(panel);
 const css=document.createElement('style');css.textContent='#familyParentDialog{width:min(94vw,480px);max-height:90dvh;overflow:auto;border:1px solid #bad3c5;border-radius:18px;padding:22px;background:#f4f8f6;color:#18352d}#familyParentDialog::backdrop{background:#12382caa}#familyParentDialog input,#familyParentDialog select{margin:6px 0 14px;min-height:48px}#familyParentDialog button,#familyReading button{min-height:48px;margin:6px;max-width:100%}#familyReading{max-width:700px;margin:auto;padding:20px;font-size:20px}#familyReading .family-pet{font-size:26px;padding:24px;width:100%;text-align:start}#familyReading img,#familyReading video{max-width:100%;max-height:55dvh;border-radius:14px}#familyReading p{white-space:pre-wrap;overflow-wrap:anywhere}';document.head.append(css);
 let busy=false,readingGeneration=0,mediaURLs=[];
 const revoke=()=>{mediaURLs.forEach(URL.revokeObjectURL);mediaURLs=[];};
 function parent(){
  if(panel.open)return;const w=words();panel.replaceChildren();const title=document.createElement('h2');title.id='familyParentTitle';title.textContent=w.parent;panel.append(title);
  const form=document.createElement('form'),message=document.createElement('p');message.role='status';form.append(message);
  const field=(caption,type,id)=>{const label=document.createElement('label');label.htmlFor=id;label.textContent=caption;const input=document.createElement('input');input.id=id;input.type=type;input.required=true;label.append(input);form.append(label);return input;};
  let age,confirmPin;
  if(!access.configured){
   const label=document.createElement('label');label.textContent=w.age;age=document.createElement('input');age.type='number';age.min=0;age.max=120;age.step=1;age.required=true;age.id='familyAge';label.append(age);form.append(label);
   const note=document.createElement('p');note.textContent=w.setup;form.append(note);
  }
  const pin=field(w.pin,'password','familyPin');pin.inputMode='numeric';pin.pattern='[0-9]{6,12}';pin.minLength=6;pin.maxLength=12;pin.autocomplete=access.configured?'current-password':'new-password';
  if(!access.configured){confirmPin=field(w.repeat,'password','familyPinRepeat');confirmPin.inputMode='numeric';confirmPin.pattern='[0-9]{6,12}';confirmPin.autocomplete='new-password';}
  const submit=document.createElement('button');submit.className='btn';submit.textContent=t('Nastavi','Continue');submit.type='submit';submit.id='familyUnlock';form.append(submit,button(t('Zatvori','Close'),()=>{if(!busy)panel.close();}));panel.append(form);
  form.onsubmit=async event=>{event.preventDefault();if(busy||!form.reportValidity())return;
   if(age&&Number(age.value)<18){message.textContent=w.child;return;}
   if(confirmPin&&pin.value!==confirmPin.value){message.textContent=w.wrong;return;}
   let attempts;try{attempts=JSON.parse(localStorage.getItem('petcare_family_attempts_v1')||'{}');}catch{attempts={};}
   if(attempts.until>Date.now()){message.textContent=w.wait;return;}
   busy=true;submit.disabled=true;
   try{
    let saved;try{saved=JSON.parse(localStorage.getItem(access.key));}catch{}
    if(access.configured){if(await digest(pin.value,saved.salt)!==saved.hash){const count=(attempts.count||0)+1;localStorage.setItem('petcare_family_attempts_v1',JSON.stringify({count,until:count>=5?Date.now()+5*60e3:0}));message.textContent=w.wrong;return;}}
    else {const salt=hex(crypto.getRandomValues(new Uint8Array(16)));saved={version:1,salt,hash:await digest(pin.value,salt)};localStorage.setItem(access.key,JSON.stringify(saved));}
    sessionStorage.setItem(access.sessionKey,JSON.stringify({hash:saved.hash,expires:Date.now()+30*60e3}));localStorage.removeItem('petcare_family_attempts_v1');location.reload();
   }catch{message.textContent=w.error;}finally{pin.value='';if(confirmPin)confirmPin.value='';busy=false;submit.disabled=false;}
  };
  panel.addEventListener('cancel',e=>{if(busy)e.preventDefault();},{once:true});panel.showModal();(age||pin).focus();
 }
 function lock(){sessionStorage.removeItem(access.sessionKey);location.reload();}
 if(access.adult){
  const lockButton=button(words().lock,lock);lockButton.id='familyLock';lockButton.className='petchip';document.querySelector('.toprow>div:last-child').append(lockButton);
  const deadline=JSON.parse(sessionStorage.getItem(access.sessionKey)).expires;
  const expire=()=>{if(Date.now()>=deadline)lock();};setTimeout(expire,Math.max(0,deadline-Date.now()));document.addEventListener('visibilitychange',expire);window.addEventListener('pageshow',expire);
  return;
 }
 // A separate renderer means navigation/history and language changes cannot reveal adult forms.
 const app=document.querySelector('body>.app');app.inert=true;
 const root=document.createElement('main');root.id='familyReading';document.body.append(root);
 render=function(){paint();};
 let selected=null,view='pets';
 function text(tag,value,parent=root){const el=document.createElement(tag);el.textContent=value;el.dir='auto';parent.append(el);return el;}
 async function paint(){
  const generation=++readingGeneration;revoke();root.replaceChildren();const w=words();text('h1','🐾 Pet Care World');text('p',w.child);
  const language=document.createElement('select');language.id='familyLanguage';language.setAttribute('aria-label',t('Jezik aplikacije','App language'));
  for(const option of document.querySelectorAll('#languageSelect option'))language.append(option.cloneNode(true));language.value=currentLang();language.onchange=()=>{localStorage.setItem(LANG_KEY,language.value);translateUI();paint();};root.append(language);
  root.append(button('🐾 '+t('Ljubimci','Pets'),()=>{view='pets';paint();}),button('📖 '+t('Uspomene','Memories'),()=>{view='memories';paint();}));
  if(view==='pets'){
   for(const p of data.pets){const b=button((PET_EMOJI[p.type]||'🐾')+' '+p.name,()=>{selected=p.id;view='memories';paint();});b.classList.add('family-pet');root.append(b);}
   if(!data.pets.length)text('p',w.empty);
  }else{
   let memories=[];try{memories=await window.petCareMemories.all();}catch{}
   if(generation!==readingGeneration)return;
   for(const entry of memories.filter(x=>!selected||x.petId===selected)){
    const card=document.createElement('section');card.className='card';text('h2',entry.title||'',card);text('p',entry.text||'',card);
    for(const item of entry.media||[]){if(!(item.blob instanceof Blob))continue;const kind=item.blob.type.startsWith('image/')?'img':item.blob.type.startsWith('video/')?'video':null;if(!kind)continue;const el=document.createElement(kind),url=URL.createObjectURL(item.blob);mediaURLs.push(url);el.src=url;if(kind==='video')el.controls=true;else el.alt=entry.title||'';card.append(el);}root.append(card);
   }
  }
  root.append(button('🔒 '+w.parent,parent));const policy=document.createElement('a');policy.href='privacy.html';policy.textContent=t('Politika privatnosti','Privacy policy');root.append(policy);
 }
 document.addEventListener('click',event=>{if(event.target.closest?.('.app,#globalChatShortcut,#globalChatDialog,#sectionsDialog')){event.preventDefault();event.stopImmediatePropagation();}},true);
 for(const dialog of document.querySelectorAll('dialog:not(#familyParentDialog)'))if(dialog.open)dialog.close();
 window.addEventListener('pagehide',revoke);paint();
})();
