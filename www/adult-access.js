// Online-only adult action. Local care never needs an account or an entry code.
(() => {
 'use strict';
 const t=(sr,en)=>window.petCareI18n?.phrase(sr,en)||en;
 let pending=false;
 async function authorize(auth,api){
  if(pending)throw Error('ADULT_ACCESS_BUSY');pending=true;
  const dialog=document.createElement('dialog');dialog.id='adultAccessDialog';dialog.className='chat-dialog';dialog.setAttribute('aria-labelledby','adultAccessTitle');
  const n=(tag,text)=>{const el=document.createElement(tag);if(text)el.textContent=text;return el;};
  const box=n('div');box.className='chat-shell';box.append(n('h2',t('Pristup za odraslu osobu','Adult access')));box.lastChild.id='adultAccessTitle';
  box.append(n('p',t('Samo odrasla osoba uključuje internet deljenje. Ne delite svoju lozinku sa decom. Osnovnu brigu možete koristiti bez prijave.','Only an adult enables online sharing. Keep your password away from children. Local care works without signing in.')));
  box.append(n('p',t('Ne objavljujte adresu, telefon, školu, lokaciju ili druge privatne podatke. Porodične zapise vide članovi grupe, javni chat svi učesnici.','Do not share addresses, phone numbers, schools, locations or other private information. Family records are visible to group members; public chat to all participants.')));
  const form=n('form'),email=n('input'),password=n('input'),ack=n('input'),info=n('p');info.id='adultAccessStatus';info.setAttribute('role','status');
  email.id='adultEmail';email.type='email';email.autocomplete='username';email.required=true;email.value=auth.currentUser?.email||'';
  password.id='adultPassword';password.type='password';password.autocomplete='current-password';password.required=true;password.minLength=12;
  for(const [input,label]of [[email,t('Email odrasle osobe','Adult email')],[password,t('Lozinka odrasle osobe','Adult password')]]){const l=n('label',label);l.htmlFor=input.id;form.append(l,input);}
  ack.id='adultAcknowledgement';ack.type='checkbox';ack.required=true;ack.style.width='auto';const label=n('label');label.append(ack,document.createTextNode(t(' Ja sam odrasla osoba, upravljam povezivanjem i prihvatam pravila: bez privatnih podataka, pretnji, uznemiravanja, nezakonitog sadržaja i spama.',' I am an adult, control this connection and accept the rules: no private information, threats, harassment, illegal content or spam.')));form.append(label);const policy=n('a',t('Pravila i privatnost deljenja','Sharing rules and privacy'));policy.href='privacy.html';policy.target='_blank';policy.rel='noopener noreferrer';form.append(policy);
  const button=(id,label,fn)=>{const b=n('button',label);b.id=id;b.type='button';b.className='btn secondary';b.onclick=fn;form.append(b);return b;};
  let working=false,finished=false,resolveResult;
  const result=new Promise(resolve=>resolveResult=resolve);
  const finish=value=>{if(finished)return;finished=true;password.value='';dialog.close();dialog.remove();resolveResult(value);};
  async function run(fn){if(working||finished)return;working=true;form.querySelectorAll('button').forEach(b=>b.disabled=true);try{await fn();}catch{info.textContent=t('Pristup nije potvrđen. Proverite podatke, potvrdu emaila i vezu. Nalog se ne menja automatski.','Access was not confirmed. Check your details, email verification and connection. Your account is not changed automatically.');}finally{working=false;if(!finished)form.querySelectorAll('button').forEach(b=>b.disabled=false);}}
  const credential=()=>api.EmailAuthProvider.credential(email.value.trim(),password.value);
  async function login(){
   if(!form.reportValidity())return;
   const previous=auth.currentUser;
   if(previous?.isAnonymous){info.textContent=t('Ovaj uređaj ima stari identitet. Za očuvanje porodičnog pristupa prvo izaberite „Napravi nalog / sačuvaj identitet“. Prijava drugim postojećim nalogom ne prenosi stare porodice.','This device has a legacy identity. Use “Create account / preserve identity” first to retain family access. Signing in with another existing account does not transfer old families.');return;}
   let user;
   if(previous){if(previous.email?.toLowerCase()!==email.value.trim().toLowerCase())throw Error('ACCOUNT_MISMATCH');user=(await api.reauthenticateWithCredential(previous,credential())).user;}
   else user=(await api.signInWithEmailAndPassword(auth,email.value.trim(),password.value)).user;
   await api.reload(user);await api.getIdToken(user,true);
   if(!user.emailVerified){password.value='';info.textContent=t('Potvrdite email preko poruke, zatim ponovo unesite lozinku i pritisnite Poveži.','Verify your email using the message, then enter your password again and press Connect.');return;}
   finish(user);
  }
  const submit=button('adultSignIn',t('Poveži','Connect'),()=>run(login));submit.type='submit';submit.onclick=null;form.onsubmit=e=>{e.preventDefault();run(login);};
  button('adultCreate',t('Napravi nalog / sačuvaj identitet','Create account / preserve identity'),()=>run(async()=>{
   if(!form.reportValidity())return;
   if(auth.currentUser&&!auth.currentUser.isAnonymous)throw Error('ALREADY_REGISTERED');
   const user=auth.currentUser?.isAnonymous?(await api.linkWithCredential(auth.currentUser,credential())).user:(await api.createUserWithEmailAndPassword(auth,email.value.trim(),password.value)).user;
   password.value='';await api.sendEmailVerification(user);info.textContent=t('Nalog je sačuvan. Poslata je potvrda emaila. Potvrdite email, ponovo unesite lozinku i povežite se.','Account saved. Verification email sent. Verify your email, enter your password again and connect.');
  }));
  button('adultVerify',t('Pošalji potvrdu emaila','Send verification email'),()=>run(async()=>{if(!auth.currentUser||auth.currentUser.isAnonymous)throw Error('SIGN_IN_FIRST');await api.sendEmailVerification(auth.currentUser);info.textContent=t('Poslata je potvrda emaila.','Verification email sent.');}));
  button('adultReset',t('Zaboravljena lozinka','Reset password'),()=>run(async()=>{if(!email.reportValidity())return;await api.sendPasswordResetEmail(auth,email.value.trim());info.textContent=t('Ako nalog postoji, proverite email za vraćanje lozinke.','If the account exists, check your email for reset instructions.');}));
  button('adultCancel',t('Nazad u aplikaciju','Back to app'),()=>finish(null));
  dialog.addEventListener('cancel',e=>{e.preventDefault();finish(null);});dialog.addEventListener('close',()=>finish(null));
  box.append(form,info);dialog.append(box);document.body.append(dialog);dialog.showModal();(email.value?password:email).focus();
  try{const user=await result;if(!user)throw Error('ADULT_ACCESS_CANCELLED');return user;}finally{pending=false;}
 }
 window.petCareAdult=Object.freeze({authorize});
})();
