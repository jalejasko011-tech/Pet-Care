// Direct numeric entry without scrolling through years or a clock face.
(() => {
 const t=(sr,en)=>window.petCareI18n.phrase(sr,en),pad=n=>String(n).padStart(2,'0');
 const iso=d=>`${String(d.getFullYear()).padStart(4,'0')}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
 function enhance(form){
  if(form.dataset.easyDateTime)return;
  form.dataset.easyDateTime='true';
  const date=form.elements.nextDate,time=form.elements.time;
  if(!date||!time)return;
  const number=(label,size)=>{
   const wrap=document.createElement('label');wrap.textContent=label;
   const input=document.createElement('input');input.type='text';input.inputMode='numeric';input.pattern=`[0-9]{1,${size}}`;input.maxLength=size;input.autocomplete='off';input.dir='ltr';
   wrap.append(input);return {wrap,input};
  };
  const day=number(t('Dan','Day'),2),year=number(t('Godina','Year'),4);
  const monthLabel=document.createElement('label');monthLabel.textContent=t('Mesec','Month');
  const month=document.createElement('select');month.dir='ltr';
  day.input.id=form.id+'Day';month.id=form.id+'Month';year.input.id=form.id+'Year';
  const lang=document.getElementById('languageSelect')?.value||'en';
  for(let m=1;m<=12;m++){
   const o=document.createElement('option');o.value=String(m);
   o.textContent=`${pad(m)} · ${new Intl.DateTimeFormat(lang==='sr'?'sr-Latn':lang,{month:'long'}).format(new Date(2024,m-1,15))}`;month.append(o);
  }
  monthLabel.append(month);
  const dateGroup=document.createElement('div');dateGroup.className='reminder-date-parts';dateGroup.dir='ltr';
  dateGroup.append(day.wrap,monthLabel,year.wrap);
  date.before(dateGroup);date.type='hidden';
  day.input.required=true;year.input.required=true;
  const validDate=()=>{
   const d=day.input.value,m=month.value,y=year.input.value;
   const candidate=`${y}-${pad(m)}-${pad(d)}`;
   const parsed=new Date(`${candidate}T12:00:00`);
   const ok=/^\d{1,2}$/.test(d)&&/^\d{4}$/.test(y)&&+y>=1&&Number.isFinite(+parsed)&&iso(parsed)===candidate;
   day.input.setCustomValidity(ok?'':t('Unesite važeći dan, mesec i četvorocifrenu godinu.','Enter a valid day, month and four-digit year.'));
   date.value=ok?candidate:'';return ok;
  };
  const setDate=value=>{const [y,m,d]=value.split('-');day.input.value=String(+d);month.value=String(+m);year.input.value=y;validDate();};
  setDate(date.value||iso(new Date()));
  [day.input,month,year.input].forEach(i=>i.addEventListener('input',validDate));
  const buttons=document.createElement('div');buttons.className='btnrow reminder-date-shortcuts';
  const button=(text,fn)=>{const b=document.createElement('button');b.type='button';b.className='btn secondary';b.textContent=text;b.onclick=fn;buttons.append(b);};
  button(t('Danas','Today'),()=>setDate(iso(new Date())));
  button(t('Sutra','Tomorrow'),()=>{const d=new Date();d.setDate(d.getDate()+1);setDate(iso(d));});
  date.after(buttons);
  const hour=number(t('Sat (0–23)','Hour (0–23)'),2),minute=number(t('Minut (0–59)','Minute (0–59)'),2);
  hour.input.id=form.id+'Hour';minute.input.id=form.id+'Minute';
  hour.input.placeholder='09';minute.input.placeholder='00';
  const timeGroup=document.createElement('div');timeGroup.className='reminder-time-parts';timeGroup.dir='ltr';timeGroup.append(hour.wrap,minute.wrap);
  time.before(timeGroup);time.type='hidden';
  const validTime=()=>{
   const h=hour.input.value,m=minute.input.value,empty=!h&&!m;
   const ok=empty||(/^\d{1,2}$/.test(h)&&/^\d{1,2}$/.test(m)&&+h<=23&&+m<=59);
   (h?minute.input:hour.input).setCustomValidity(ok?'':t('Unesite sat od 0 do 23 i minut od 0 do 59, ili ostavite oba prazna.','Enter an hour from 0 to 23 and a minute from 0 to 59, or leave both blank.'));
   if(ok){hour.input.setCustomValidity('');minute.input.setCustomValidity('');}
   time.value=ok&&!empty?`${pad(h)}:${pad(m)}`:'';return ok;
  };
  const setTime=value=>{const [h='',m='']=value.split(':');hour.input.value=h;minute.input.value=m;validTime();};
  setTime(time.value);
  [hour.input,minute.input].forEach(i=>i.addEventListener('input',validTime));
  const timeButtons=document.createElement('div');timeButtons.className='btnrow reminder-date-shortcuts';time.after(timeButtons);
  for(const [minutes,label] of [[10,t('Za 10 min','In 10 min')],[60,t('Za 1 sat','In 1 hour')]]){
   const b=document.createElement('button');b.type='button';b.className='btn secondary';b.textContent=label;
   b.onclick=()=>{const d=new Date(Date.now()+minutes*60000);setDate(iso(d));setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);};timeButtons.append(b);
  }
  // Keep a native calendar available as an optional alternative.
  const details=document.createElement('details'),summary=document.createElement('summary'),picker=document.createElement('input');
  details.className='reminder-calendar';summary.textContent=t('Izaberi iz kalendara','Choose from calendar');picker.type='date';picker.value=date.value;picker.setAttribute('aria-label',t('Datum podsetnika','Reminder date'));
  picker.onchange=()=>{if(picker.value)setDate(picker.value);};
  details.append(summary,picker);buttons.after(details);
  details.addEventListener('toggle',()=>{if(details.open)picker.value=date.value;});
  form.addEventListener('submit',event=>{if(!validDate()||!validTime()){event.preventDefault();event.stopImmediatePropagation();form.reportValidity();}},true);
 }
 const update=()=>document.querySelectorAll('#reminderForm,#routineForm').forEach(enhance);
 const previous=render;render=function(){previous();update();};
 // Route history can restore a form before this deferred enhancement loads.
 update();
})();
