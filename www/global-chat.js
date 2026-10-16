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
  let api,auth,db,user,stop,rows=[],busy=false,joining=false,generation=0;
  let blocked=new Set();
  try{const saved=JSON.parse(localStorage.getItem('petcare_chat_blocked_v1')||'[]');if(Array.isArray(saved))blocked=new Set(saved.filter(x=>typeof x==='string'));}catch{}
  const el=id=>dialog.querySelector('#'+id);
  const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
  const status=text=>{if(el('chatStatus'))el('chatStatus').textContent=text;};
  function shell(){
    dialog.innerHTML='';const box=node('div',null,'chat-shell'),head=node('div',null,'chat-head');
    const title=node('h2',tr('🌍 Globalni chat','🌍 Global chat'));title.id='globalChatTitle';head.append(title);
    const close=node('button',tr('Zatvori','Close'),'btn secondary');close.type='button';close.onclick=()=>dialog.close();head.append(close);box.append(head);
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
      const tools=node('div',null,'chat-tools');
      for(const [caption,action] of [[tr('Izađi','Leave'),leave],[tr('Odblokiraj sve','Unblock all'),()=>{blocked.clear();localStorage.removeItem('petcare_chat_blocked_v1');paint();}],[tr('Obriši chat identitet i moje poruke','Delete chat identity and my messages'),erase]]){const b=node('button',caption,'btn secondary');b.type='button';b.onclick=action;tools.append(b);}connected.append(tools);box.append(connected);
    }
    const note=node('p',tr('Samo za punoletne učesnike (18+). Poruke nisu end-to-end šifrovane. Ne delite adresu, telefon ili brojeve dokumenata. Chat identitet je vezan za ovaj uređaj; nakon brisanja podataka aplikacije pristup starom identitetu se gubi. Podaci o ljubimcima se ne objavljuju.','For adults (18+) only. Messages are not end-to-end encrypted. Do not share addresses, phone numbers or document numbers. Your chat identity belongs to this device; clearing app data loses access to it. Pet records are not published.'),'chat-note');box.append(note);
    const policy=node('a',tr('Privatnost i pravila chata','Privacy and chat rules'));policy.href='chat-privacy.html';policy.target='_blank';policy.rel='noopener noreferrer';box.append(policy);dialog.append(box);
    if(!enabled)status(tr('Nije povezano','Not connected'));
  }
  function leave(){generation++;stop?.();stop=null;rows=[];shell();status(tr('Izašli ste iz razgovora.','You left the conversation.'));}
  shortcut.onclick=()=>{if(!dialog.open){shell();dialog.showModal();}};
  dialog.addEventListener('close',()=>{generation++;stop?.();stop=null;rows=[];shortcut.focus();});
  async function sdk(){
    if(api)return;const base='https://www.gstatic.com/firebasejs/12.4.0/';
    const [app,a,f]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
    const instance=app.initializeApp(cfg.firebase,'petcare-global-chat');auth=a.getAuth(instance);db=f.getFirestore(instance);
    if(cfg.emulators===true && location.hostname==='127.0.0.1'){a.connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});f.connectFirestoreEmulator(db,'127.0.0.1',8080);}
    api={...a,...f};
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
      localStorage.setItem('petcare_chat_nickname_v1',nickname);el('chatJoin').hidden=true;el('chatConnected').hidden=false;
      stop=api.onSnapshot(api.query(api.collection(db,'globalMessages'),api.orderBy('createdAt','desc'),api.limit(100)),snap=>{rows=snap.docs.map(d=>({id:d.id,...d.data()})).reverse();paint();status(tr('Povezano • javni razgovor','Connected • public conversation'));},()=>{status(tr('Veza je prekinuta ili pristup nije dozvoljen. Pokušajte ponovo.','Connection interrupted or access denied. Try again.'));el('chatSend').querySelector('button').disabled=true;});
    }catch{status(tr('Povezivanje nije uspelo. Proverite internet ili pokušajte kasnije.','Could not connect. Check your connection or try later.'));}
    finally{joining=false;if(el('chatJoin'))el('chatJoin').querySelector('button').disabled=false;}
  }
  function paint(){
    const list=el('chatMessages');if(!list)return;list.replaceChildren();
    const visible=rows.filter(x=>!blocked.has(x.authorId));if(!visible.length)list.append(node('p',tr('Još nema poruka. Započnite razgovor o ljubimcima!','No messages yet. Start a conversation about pets!')));
    for(const x of visible){
      const item=node('article',null,'chat-message');item.append(node('strong',x.nickname),node('p',x.text));
      const date=x.createdAt?.toDate?.();if(date)item.append(node('small',date.toLocaleString()));
      const actions=node('div',null,'chat-tools');
      if(x.authorId===user.uid){const b=node('button',tr('Obriši','Delete'),'btn secondary');b.onclick=()=>run(()=>api.deleteDoc(api.doc(db,'globalMessages',x.id)));actions.append(b);}
      else{
        const report=node('button',tr('Prijavi','Report'),'btn secondary');report.onclick=async()=>{const reason=prompt(tr('Razlog prijave (najviše 300 znakova):','Report reason (up to 300 characters):'));if(!reason?.trim())return;await run(async()=>{await api.setDoc(api.doc(db,'chatReports',user.uid+'_'+x.id),{reporterId:user.uid,messageId:x.id,reason:reason.trim().slice(0,300),createdAt:api.serverTimestamp()});status(tr('Prijava je poslata moderatoru.','Report sent to the moderator.'));});};
        const block=node('button',tr('Blokiraj','Block'),'btn secondary');block.onclick=()=>{blocked.add(x.authorId);localStorage.setItem('petcare_chat_blocked_v1',JSON.stringify([...blocked]));paint();};actions.append(report,block);
      }item.append(actions);list.append(item);
    }list.scrollTop=list.scrollHeight;
  }
  async function run(fn){try{await fn();}catch{status(tr('Radnja nije uspela. Proverite vezu i pokušajte ponovo.','Action failed. Check your connection and try again.'));}}
  async function sendMessage(e){
    e.preventDefault();if(busy)return;const text=el('chatText').value.trim();if(!text||text.length>1000)return;busy=true;const button=el('chatSend').querySelector('button');button.disabled=true;
    try{await api.runTransaction(db,async tx=>{const profile=api.doc(db,'chatProfiles',user.uid),snapshot=await tx.get(profile),next=snapshot.data().sequence+1;tx.update(profile,{lastSent:api.serverTimestamp(),sequence:next});tx.set(api.doc(db,'globalMessages',user.uid+'_'+next),{authorId:user.uid,nickname:snapshot.data().nickname,text,createdAt:api.serverTimestamp()});});if(el('chatText'))el('chatText').value='';}
    catch{status(tr('Poruka nije poslata. Sačekajte 5 sekundi i proverite vezu.','Message not sent. Wait 5 seconds and check your connection.'));}
    finally{busy=false;if(button.isConnected)button.disabled=false;}
  }
  async function erase(){
    if(!confirm(tr('Trajno obrisati sve svoje javne poruke i chat identitet?','Permanently delete all your public messages and chat identity?')))return;
    await run(async()=>{stop?.();stop=null;let snapshot;
      do{snapshot=await api.getDocs(api.query(api.collection(db,'globalMessages'),api.where('authorId','==',user.uid),api.limit(100)));if(snapshot.size){const batch=api.writeBatch(db);snapshot.docs.forEach(d=>batch.delete(d.ref));await batch.commit();}}while(snapshot.size===100);
      await api.deleteDoc(api.doc(db,'chatProfiles',user.uid));await api.deleteUser(user);user=null;localStorage.removeItem('petcare_chat_nickname_v1');leave();status(tr('Chat identitet i poruke su obrisani.','Chat identity and messages deleted.'));
    });
  }
})();
