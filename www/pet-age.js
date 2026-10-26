// Calendar-month age entry. An estimated age never invents a birthday.
(() => {
 'use strict';
 const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
 const parse=s=>window.petCareRecords.calendar(s)?new Date(s+'T12:00:00'):null;
 function shifted(d,months){const first=new Date(d.getFullYear(),d.getMonth()+months,1,12);first.setDate(Math.min(d.getDate(),new Date(first.getFullYear(),first.getMonth()+1,0).getDate()));return first;}
 function elapsed(from,to){if(to<from)return 0;let n=(to.getFullYear()-from.getFullYear())*12+to.getMonth()-from.getMonth();if(shifted(from,n)>to)n--;return Math.max(0,n);}
 function total(p,now=new Date()){
  now=new Date(now.getFullYear(),now.getMonth(),now.getDate(),12);
  const birth=parse(p?.birth);if(birth)return birth>now?null:elapsed(birth,now);
  const ref=parse(p?.ageAsOf);if(!ref||!Number.isInteger(p?.ageTotalMonths)||p.ageTotalMonths<0||p.ageTotalMonths>11999)return null;
  return p.ageTotalMonths+elapsed(ref,now);
 }
 const phrase=(sr,en)=>window.petCareI18n?.phrase(sr,en)||(document.documentElement.lang==='sr'?sr:en);
 function label(p){const n=total(p);if(n===null)return '';const locale=window.petCareI18n?.locale?.()||document.documentElement.lang||'en';const unit=(v,u)=>new Intl.NumberFormat(locale,{style:'unit',unit:u,unitDisplay:'long'}).format(v);return [Math.floor(n/12)?unit(Math.floor(n/12),'year'):'',n%12||!n?unit(n%12,'month'):''].filter(Boolean).join(' ');}
 function birthValue(day,month,year,now=iso(new Date())){
  const parts=[day,month,year].map(String);if(parts.every(x=>x===''))return '';
  if(parts.some(x=>!/^\d+$/.test(x)))return null;
  const [d,m,y]=parts.map(Number);if(d<1||d>31||m<1||m>12||y<1000||y>9999)return null;
  const value=`${String(y).padStart(4,'0')}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  return parse(value)&&value<=now?value:null;
 }
 function birthFields(p){
  const [year='',month='',day='']=(p?.birth||'').split('-');
  const locale=window.petCareI18n?.locale?.()||document.documentElement.lang||'en';
  const months=Array.from({length:12},(_,i)=>`<option value="${i+1}" ${Number(month)===i+1?'selected':''}>${i+1} · ${new Intl.DateTimeFormat(locale,{month:'long'}).format(new Date(2020,i,1))}</option>`).join('');
  return `<div class="reminder-date-parts" style="margin-top:10px"><div><label for="petBirthDay">${phrase('Dan','Day')}</label><input id="petBirthDay" name="birthDay" type="number" inputmode="numeric" min="1" max="31" step="1" placeholder="DD" value="${Number(day)||''}"></div><div><label for="petBirthMonth">${phrase('Mesec','Month')}</label><select id="petBirthMonth" name="birthMonth"><option value="">—</option>${months}</select></div><div><label for="petBirthYear">${phrase('Godina rođenja','Birth year')}</label><input id="petBirthYear" name="birthYear" type="number" inputmode="numeric" min="1000" max="${new Date().getFullYear()}" step="1" placeholder="YYYY" value="${year}"></div></div><p class="small muted">${phrase('Upišite dan i godinu, a mesec izaberite sa liste. Starost se računa automatski.','Enter the day and year, then choose a month. Age is calculated automatically.')}</p><details class="reminder-calendar"><summary>${phrase('Izaberi iz kalendara','Choose from calendar')}</summary><label for="petBirthDate">${phrase('Datum rođenja','Date of birth')}</label><input id="petBirthDate" type="date" name="birth" max="${iso(new Date())}" value="${p?.birth||''}"></details>`;
 }
 function syncBirth(f){
  const e=f.elements,exact=e.ageMode.value==='birth',day=e.birthDay;
  for(const name of ['birth','birthDay','birthMonth','birthYear'])e[name].disabled=!exact;
  day.setCustomValidity('');if(!exact)return;
  const value=birthValue(day.value,e.birthMonth.value,e.birthYear.value);
  if(value===null){e.birth.value='';day.setCustomValidity(phrase('Unesite ceo, ispravan datum rođenja koji nije u budućnosti.','Enter a complete, valid date of birth that is not in the future.'));}
  else e.birth.value=value;
 }
 function fields(p){
  const n=total(p),exact=!!p?.birth,esc=window.esc||((s)=>String(s).replace(/[&<>"']/g,''));
  return `<div class="field full"><label for="petAgeMode">${phrase('Starost ljubimca','Pet age')}</label><select id="petAgeMode" name="ageMode"><option value="age" ${!exact?'selected':''}>${phrase('Godine i meseci','Years and months')}</option><option value="birth" ${exact?'selected':''}>${phrase('Tačan datum rođenja','Exact date of birth')}</option></select><div data-age-parts style="display:${exact?'none':'grid'};grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:10px"><div><label for="petAgeYears">${phrase('Godine','Years')}</label><input id="petAgeYears" name="ageYears" type="number" inputmode="numeric" min="0" max="999" step="1" placeholder="0" value="${n===null?'':Math.floor(n/12)}"></div><div><label for="petAgeMonths">${phrase('Meseci (0–11)','Months (0–11)')}</label><input id="petAgeMonths" name="ageMonths" type="number" inputmode="numeric" min="0" max="11" step="1" placeholder="0" value="${n===null?'':n%12}"></div><p class="small muted" style="grid-column:1/-1;margin:0">${phrase('Na primer: 2 godine i 3 meseca. Ako ne znate starost, ostavite oba polja prazna.','For example: 2 years and 3 months. Leave both fields empty if the age is unknown.')}</p></div><div data-age-birth style="display:${exact?'block':'none'};margin-top:10px">${birthFields(p)}</div><input type="hidden" name="ageTotalMonths" value="${Number.isInteger(p?.ageTotalMonths)?p.ageTotalMonths:''}"><input type="hidden" name="ageAsOf" value="${esc(p?.ageAsOf||'')}"></div>`;
 }
 function wire(f){if(!f)return;f.petAgeInitial={total:f.elements.ageTotalMonths.value,asOf:f.elements.ageAsOf.value,shown:Number(f.elements.ageYears.value||0)*12+Number(f.elements.ageMonths.value||0)};const mode=f.elements.ageMode;const sync=()=>{const exact=mode.value==='birth';f.querySelector('[data-age-parts]').style.display=exact?'none':'grid';f.querySelector('[data-age-birth]').style.display=exact?'block':'none';f.elements.ageYears.disabled=exact;f.elements.ageMonths.disabled=exact;syncBirth(f);};mode.onchange=sync;for(const name of ['birthDay','birthMonth','birthYear']){f.elements[name].oninput=()=>syncBirth(f);f.elements[name].onchange=()=>syncBirth(f);}f.elements.birth.oninput=f.elements.birth.onchange=()=>{const [year='',month='',day='']=f.elements.birth.value.split('-');f.elements.birthYear.value=year;f.elements.birthMonth.value=month?String(Number(month)):'';f.elements.birthDay.value=day?String(Number(day)):'';syncBirth(f);};sync();}
 function prepare(f){
  if(f.elements.ageMode.value==='birth'){syncBirth(f);if(!f.reportValidity())return false;f.elements.ageTotalMonths.value='';f.elements.ageAsOf.value='';return true;}
  const y=f.elements.ageYears,m=f.elements.ageMonths;if(!f.reportValidity())return false;
  f.elements.birth.disabled=false;f.elements.birth.value='';
  const n=Number(y.value||0)*12+Number(m.value||0),keep=f.petAgeInitial?.asOf&&n===f.petAgeInitial.shown;
  f.elements.ageTotalMonths.value=y.value===''&&m.value===''?'':keep?f.petAgeInitial.total:String(n);
  f.elements.ageAsOf.value=f.elements.ageTotalMonths.value===''?'':keep?f.petAgeInitial.asOf:iso(new Date());return true;
 }
 function clean(o){delete o.ageMode;delete o.ageYears;delete o.ageMonths;delete o.birthDay;delete o.birthMonth;delete o.birthYear;if(o.ageTotalMonths===''){delete o.ageTotalMonths;delete o.ageAsOf;}else o.ageTotalMonths=Number(o.ageTotalMonths);return o;}
 window.petCareAge={total,label,fields,wire,prepare,clean,elapsed,birthValue,refresh(f){f?.elements.ageMode?.onchange?.();}};
})();
