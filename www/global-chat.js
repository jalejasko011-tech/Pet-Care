// Optional public chat. No SDK, authentication or network request before consent.
(() => {
  const sr=()=>document.getElementById('languageSelect')?.value==='sr';
  const tr=(s,e)=>sr()?s:e;
  const cfg=window.PETCARE_CHAT_CONFIG;
  const enabled=cfg?.enabled===true && cfg.firebase?.apiKey && cfg.firebase?.projectId && cfg.firebase?.appId;
  const shortcut=document.createElement('button');
  shortcut.className='chat-shortcut';shortcut.id='globalChatShortcut';shortcut.textContent='💬 Chat';shortcut.type='button';shortcut.setAttribute('aria-haspopup','dialog');
  const dialog=document.createElement('dialog');dialog.className='chat-dialog';dialog.id='globalChatDialog';dialog.setAttribute('aria-labelledby','globalChatTitle');
  document.body.append(shortcut,dialog);
  let api,auth,db,user,stop,storage,rows=[],busy=false,joining=false,generation=0,selected=null,previewURL=null,uploadTask=null;
  const mediaEnabled=cfg?.media?.enabled===true&&Boolean(cfg.media.bucket);
  const loadedMedia=new Map();
  const releaseMedia=()=>{for(const url of loadedMedia.values())URL.revokeObjectURL(url);loadedMedia.clear();};
  let blocked=new Set();
  try{const saved=JSON.parse(localStorage.getItem('petcare_chat_blocked_v1')||'[]');if(Array.isArray(saved))blocked=new Set(saved.filter(x=>typeof x==='string'));}catch{}
  const el=id=>dialog.querySelector('#'+id);
  const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
  const status=text=>{if(el('chatStatus'))el('chatStatus').textContent=text;};
  function shell(){
    releaseMedia();selected=null;if(previewURL)URL.revokeObjectURL(previewURL);previewURL=null;
    dialog.innerHTML='';const box=node('div',null,'chat-shell'),head=node('div',null,'chat-head');
    const title=node('h2',tr('🌍 Globalni chat','🌍 Global chat'));title.id='globalChatTitle';head.append(title);
    const close=node('button',tr('Zatvori','Close'),'btn secondary');close.type='button';close.onclick=()=>{if(!busy)dialog.close();};head.append(close);box.append(head);
    const st=node('div',null,'chat-status');st.id='chatStatus';st.setAttribute('role','status');box.append(st);
    if(!enabled){
      status('');const note=node('div',tr('Chat još nije aktiviran. Povezivanje zajedničkog servera je u pripremi. Poruke se sada ne šalju drugim korisnicima.','Chat is not activated yet. The shared server is being prepared. Messages are not currently sent to other users.'),'notice');note.id='chatUnavailable';box.append(note);
    }else{
      const form=node('form');form.id='chatJoin';
      const label=node('label',tr('Javni nadimak (2–30 znakova)','Public nickname (2–30 characters)'));label.htmlFor='chatNickname';
      const name=node('input');name.id='chatNickname';name.required=true;name.minLength=2;name.maxLength=30;name.autocomplete='nickname';name.value=localStorage.getItem('petcare_chat_nickname_v1')||'';
      const consent=node('label',null,'chat-consent'),check=node('input');check.id='chatConsent';check.type='checkbox';check.required=true;
      consent.append(check,node('span',tr('Imam najmanje 18 godina i prihvatam pravila chata. Razumem da su nadimak i poruke javni svim učesnicima. Neću deliti privatne podatke, pretnje, uvrede, spam ili sadržaj zlostavljanja.','I am at least 18 and accept the chat rules. My nickname and messages are public to all participants. I will not share private information, threats, harassment, spam or abusive content.')));
      const join=node('button',tr('Uđi u chat','Join chat'),'btn');join.type='submit';form.append(label,name,consent,join);form.onsubmit=joinChat;box.append(form);
      const connected=node('section');connected.id='chatConnected';connected.hidden=true;
      const messages=node('div');messages.className='chat-messages';messages.id='chatMessages';messages.setAttribute('aria-label',tr('Poruke','Messages'));connected.append(messages);
      const send=node('form');send.id='chatSend';const msgLabel=node('label',tr('Poruka (najviše 1000 znakova)','Message (up to 1000 characters)'));msgLabel.htmlFor='chatText';const text=node('textarea');text.id='chatText';text.required=true;text.maxLength=1000;
      const submit=node('button',tr('Pošalji','Send'),'btn');submit.type='submit';send.append(msgLabel,text,submit);send.onsubmit=sendMessage;connected.append(send);
      const attachment=node('div',null,'chat-attachment');const fileLabel=node('label',tr('📎 Slika ili snimak','📎 Photo or video'));fileLabel.htmlFor='chatFile';const file=node('input');file.type='file';file.id='chatFile';file.accept='image/jpeg,image/png,image/webp,video/mp4,video/webm';file.disabled=!mediaEnabled;file.onchange=()=>chooseMedia(file.files[0]);const help=node('p',mediaEnabled?tr('Slike do 10 MB; video do 25 MB. Prilog je javan učesnicima.','Images up to 10 MB; video up to 25 MB. Attachments are public to participants.'):tr('Slike i snimci još nisu aktivirani. Tekstualni chat radi.','Photos and videos are not activated yet. Text chat is available.'),'chat-note');const preview=node('div');preview.id='chatAttachmentPreview';const progress=node('progress');progress.id='chatUploadProgress';progress.className='chat-upload-progress';progress.max=100;progress.hidden=true;attachment.append(fileLabel,file,help,preview,progress);send.insertBefore(attachment,submit);
      const tools=node('div',null,'chat-tools');
      for(const [caption,action] of [[tr('Izađi','Leave'),leave],[tr('Odblokiraj sve','Unblock all'),()=>{blocked.clear();localStorage.removeItem('petcare_chat_blocked_v1');paint();window.dispatchEvent(new Event('petcare:chat-blocks-changed'));}],[tr('Obriši chat identitet i moje poruke','Delete chat identity and my messages'),erase]]){const b=node('button',caption,'btn secondary');b.type='button';b.onclick=action;tools.append(b);}connected.append(tools);box.append(connected);
    }
    const note=node('p',tr('Samo za punoletne učesnike (18+). Poruke nisu end-to-end šifrovane. Ne delite adresu, telefon ili brojeve dokumenata. Chat identitet je vezan za ovaj uređaj; nakon brisanja podataka aplikacije pristup starom identitetu se gubi. Podaci o ljubimcima se ne objavljuju.','For adults (18+) only. Messages are not end-to-end encrypted. Do not share addresses, phone numbers or document numbers. Your chat identity belongs to this device; clearing app data loses access to it. Pet records are not published.'),'chat-note');box.append(note);
    const policy=node('a',tr('Privatnost i pravila chata','Privacy and chat rules'));policy.href='chat-privacy.html';policy.target='_blank';policy.rel='noopener noreferrer';box.append(policy);dialog.append(box);
    if(!enabled)status(tr('Nije povezano','Not connected'));
  }
  function leave(){if(busy)return;generation++;stop?.();stop=null;rows=[];shell();status(tr('Izašli ste iz razgovora.','You left the conversation.'));}
  window.petCareChat={getSession:()=>user&&api?{api,auth,db,user,blocked:[...blocked]}:null,open:()=>shortcut.click()};
  shortcut.onclick=()=>{if(!dialog.open){shell();dialog.showModal();}};
  dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
  dialog.addEventListener('close',()=>{releaseMedia();if(previewURL)URL.revokeObjectURL(previewURL);selected=null;generation++;stop?.();stop=null;rows=[];shortcut.focus();});
  async function sdk(){
    if(api)return;const base='https://www.gstatic.com/firebasejs/12.4.0/';
    const [app,a,f]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
    const instance=app.initializeApp(cfg.firebase,'petcare-global-chat');auth=a.getAuth(instance);db=f.getFirestore(instance);
    if(cfg.emulators===true && location.hostname==='127.0.0.1'){a.connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});f.connectFirestoreEmulator(db,'127.0.0.1',8080);}
    api={...a,...f};
    if(mediaEnabled){const st=await import(base+'firebase-storage.js');storage=st.getStorage(instance,'gs://'+cfg.media.bucket);if(cfg.emulators===true&&location.hostname==='127.0.0.1')st.connectStorageEmulator(storage,'127.0.0.1',9199);Object.assign(api,st);}
  }
  async function joinChat(e){
    e.preventDefault();if(joining)return;const nickname=el('chatNickname').value.trim();if(nickname.length<2)return;
    joining=true;const token=++generation;el('chatJoin').querySelector('button').disabled=true;status(tr('Povezivanje…','Connecting…'));
    try{
      await sdk();await auth.authStateReady();user=auth.currentUser||(await api.signInAnonymously(auth)).user;
      const profile=api.doc(db,'chatProfiles',user.uid),snapshot=await api.getDoc(profile);
      if(snapshot.exists())await api.updateDoc(profile,{nickname});
      else await api.setDoc(profile,{nickname,banned:false,lastSent:api.Timestamp.fromMillis(0),sequence:0});
      if(token!==generation)return;
      window.dispatchEvent(new Event('petcare:chat-connected'));
      localStorage.setItem('petcare_chat_nickname_v1',nickname);el('chatJoin').hidden=true;el('chatConnected').hidden=false;
      stop=api.onSnapshot(api.query(api.collection(db,'globalMessages'),api.orderBy('createdAt','desc'),api.limit(100)),snap=>{rows=snap.docs.map(d=>({id:d.id,...d.data()})).reverse();paint();status(tr('Povezano • javni razgovor','Connected • public conversation'));},()=>{status(tr('Veza je prekinuta ili pristup nije dozvoljen. Pokušajte ponovo.','Connection interrupted or access denied. Try again.'));el('chatSend').querySelector('button[type="submit"]').disabled=true;});
    }catch{status(tr('Povezivanje nije uspelo. Proverite internet ili pokušajte kasnije.','Could not connect. Check your connection or try later.'));}
    finally{joining=false;if(el('chatJoin'))el('chatJoin').querySelector('button').disabled=false;}
  }
  function paint(){
    const list=el('chatMessages');if(!list)return;list.replaceChildren();
    const visible=rows.filter(x=>!blocked.has(x.authorId));if(!visible.length)list.append(node('p',tr('Još nema poruka. Započnite razgovor o ljubimcima!','No messages yet. Start a conversation about pets!')));
    for(const x of visible){
      const item=node('article',null,'chat-message'+(x.authorId===user.uid?' is-own':''));item.dataset.messageId=x.id;item.append(node('strong',x.nickname),node('p',x.text));
      if(x.media)renderAttachment(item,x);
      const date=x.createdAt?.toDate?.();if(date)item.append(node('small',date.toLocaleString()));
      const actions=node('div',null,'chat-tools');
      if(x.authorId===user.uid){const b=node('button',tr('Obriši','Delete'),'btn secondary');b.onclick=()=>run(()=>removeMessage(x));actions.append(b);}
      else{
        const report=node('button',tr('Prijavi','Report'),'btn secondary');report.onclick=async()=>{const reason=prompt(tr('Razlog prijave (najviše 300 znakova):','Report reason (up to 300 characters):'));if(!reason?.trim())return;await run(async()=>{await api.setDoc(api.doc(db,'chatReports',user.uid+'_'+x.id),{reporterId:user.uid,messageId:x.id,reason:reason.trim().slice(0,300),createdAt:api.serverTimestamp()});status(tr('Prijava je poslata moderatoru.','Report sent to the moderator.'));});};
        const block=node('button',tr('Blokiraj','Block'),'btn secondary');block.onclick=()=>{blocked.add(x.authorId);localStorage.setItem('petcare_chat_blocked_v1',JSON.stringify([...blocked]));paint();window.dispatchEvent(new Event('petcare:chat-blocks-changed'));};actions.append(report,block);
      }item.append(actions);list.append(item);
    }list.scrollTop=list.scrollHeight;
  }
  async function run(fn){try{await fn();}catch{status(tr('Radnja nije uspela. Proverite vezu i pokušajte ponovo.','Action failed. Check your connection and try again.'));}}
  function chooseMedia(file){
    if(previewURL)URL.revokeObjectURL(previewURL);previewURL=null;selected=null;
    const preview=el('chatAttachmentPreview');preview?.replaceChildren();if(!file){if(el('chatText'))el('chatText').required=true;return;}
    const kind=['image/jpeg','image/png','image/webp'].includes(file.type)?'image':['video/mp4','video/webm'].includes(file.type)?'video':null;
    if(!kind||file.size<=0||file.size>(kind==='image'?10:25)*1024*1024){el('chatFile').value='';el('chatText').required=true;status(tr('Izaberite JPG, PNG ili WebP do 10 MB ili MP4/WebM do 25 MB.','Choose JPG, PNG or WebP up to 10 MB, or MP4/WebM up to 25 MB.'));return;}
    selected={file,kind};el('chatText').required=false;previewURL=URL.createObjectURL(file);const v=node(kind==='image'?'img':'video');v.src=previewURL;v.className='chat-media-preview';if(kind==='image')v.alt=tr('Pregled izabranog priloga','Selected attachment preview');else{v.controls=true;v.preload='metadata';v.playsInline=true;}const cancel=node('button',tr('Ukloni prilog','Remove attachment'),'btn secondary');cancel.type='button';cancel.onclick=()=>{if(busy)return;el('chatFile').value='';chooseMedia(null);};preview.append(v,cancel);
  }
  function validMedia(x){return x.media&&x.media.path==='chatMedia/'+x.authorId+'/'+x.id&&['image','video'].includes(x.media.kind)&&['image/jpeg','image/png','image/webp','video/mp4','video/webm'].includes(x.media.mime)&&Number.isInteger(x.media.size)&&x.media.size>0&&x.media.size<=25*1024*1024;}
  function renderAttachment(item,x){
    const box=node('div'),load=node('button',tr('Učitaj prilog','Load attachment'),'btn secondary');load.type='button';load.disabled=!mediaEnabled||!validMedia(x);box.append(load);item.append(box);
    const show=url=>{const v=node(x.media.kind==='image'?'img':'video');v.src=url;v.className='chat-media-view';if(x.media.kind==='image')v.alt=tr('Fotografija učesnika chata','Chat participant photo');else{v.controls=true;v.preload='metadata';v.playsInline=true;}box.replaceChildren(v);};
    if(loadedMedia.has(x.id)){show(loadedMedia.get(x.id));return;}
    load.onclick=async()=>{const token=generation;load.disabled=true;try{const blob=await api.getBlob(api.ref(storage,x.media.path),x.media.size);if(blob.size!==x.media.size)throw Error('Size mismatch');if(token!==generation||!item.isConnected)return;const url=URL.createObjectURL(blob);loadedMedia.set(x.id,url);show(url);}catch{load.disabled=false;load.textContent=tr('Prilog nije dostupan. Pokušaj ponovo.','Attachment unavailable. Retry.');}};
  }
  async function removeMessage(x){
    if(busy)return;
    if(x.media&&mediaEnabled&&validMedia(x)){try{await api.deleteObject(api.ref(storage,x.media.path));}catch(e){if(e.code!=='storage/object-not-found')throw e;}}
    await api.deleteDoc(api.doc(db,'globalMessages',x.id));const url=loadedMedia.get(x.id);if(url)URL.revokeObjectURL(url);loadedMedia.delete(x.id);
  }
  async function sendMessage(e){
    e.preventDefault();if(busy)return;const text=el('chatText').value.trim(),attachment=selected;if((!text&&!attachment)||text.length>1000)return;busy=true;status(tr('Slanje…','Sending…'));const button=el('chatSend').querySelector('button[type="submit"]');button.disabled=true;if(el('chatFile'))el('chatFile').disabled=true;
    let sentRef=null,mediaPath=null;
    try{
      const message=await api.runTransaction(db,async tx=>{const profile=api.doc(db,'chatProfiles',user.uid),snapshot=await tx.get(profile),next=snapshot.data().sequence+1,id=user.uid+'_'+next;tx.update(profile,{lastSent:api.serverTimestamp(),sequence:next});const entry={authorId:user.uid,nickname:snapshot.data().nickname,text,createdAt:api.serverTimestamp()};if(attachment)entry.media={path:'chatMedia/'+user.uid+'/'+id,kind:attachment.kind,mime:attachment.file.type,size:attachment.file.size};const target=api.doc(db,'globalMessages',id);tx.set(target,entry);return {target,entry};});
      sentRef=message.target;
      if(attachment){mediaPath=message.entry.media.path;const progress=el('chatUploadProgress');progress.hidden=false;progress.value=0;uploadTask=api.uploadBytesResumable(api.ref(storage,mediaPath),attachment.file,{contentType:attachment.file.type});await new Promise((resolve,reject)=>uploadTask.on('state_changed',snap=>{if(progress.isConnected)progress.value=100*snap.bytesTransferred/snap.totalBytes;},reject,resolve));uploadTask=null;}
      if(el('chatText'))el('chatText').value='';if(el('chatFile'))el('chatFile').value='';chooseMedia(null);status(tr('Poruka je poslata.','Message sent.'));
    }catch{
      if(sentRef){try{if(mediaPath)await api.deleteObject(api.ref(storage,mediaPath));}catch{}try{await api.deleteDoc(sentRef);}catch{}}
      status(tr('Poruka nije poslata. Sačekajte 5 sekundi i proverite vezu.','Message not sent. Wait 5 seconds and check your connection.'));
    }finally{busy=false;uploadTask=null;if(button.isConnected)button.disabled=false;if(el('chatFile'))el('chatFile').disabled=!mediaEnabled;if(el('chatUploadProgress'))el('chatUploadProgress').hidden=true;}
  }
  async function erase(){
    if(busy)return;
    if(!confirm(tr('Trajno obrisati sve svoje javne poruke i chat identitet?','Permanently delete all your public messages and chat identity?')))return;
    await run(async()=>{stop?.();stop=null;let snapshot;
      do{snapshot=await api.getDocs(api.query(api.collection(db,'globalMessages'),api.where('authorId','==',user.uid),api.limit(100)));if(snapshot.size){const batch=api.writeBatch(db);for(const d of snapshot.docs){const x={id:d.id,...d.data()};if(x.media&&mediaEnabled&&validMedia(x)){try{await api.deleteObject(api.ref(storage,x.media.path));}catch(e){if(e.code!=='storage/object-not-found')throw e;}}batch.delete(d.ref);}await batch.commit();}}while(snapshot.size===100);
      await window.petCareChatPush?.disable();await api.deleteDoc(api.doc(db,'chatProfiles',user.uid));await api.deleteUser(user);user=null;localStorage.removeItem('petcare_chat_nickname_v1');leave();status(tr('Chat identitet i poruke su obrisani.','Chat identity and messages deleted.'));
    });
  }
})();
