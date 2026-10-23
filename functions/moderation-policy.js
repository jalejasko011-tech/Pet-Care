// Conservative SR/EN text triage. Not an AI classifier or proof that a message is safe.
// Every flagged message stays private until a human reviews it; never auto-ban.
export const POLICY_VERSION = 'sr-en-text-1';
const cyr = Object.fromEntries([... 'абвгдђежзијклљмнњопрстћуфхцчџш'].map((c,i)=>[c,['a','b','v','g','d','dj','e','z','z','i','j','k','l','lj','m','n','nj','o','p','r','s','t','c','u','f','h','c','c','dz','s'][i]]));
export function normalize(text) {
 return text.normalize('NFKC').toLowerCase().replace(/[а-яђјљњћџ]/gu,c=>cyr[c]||c)
  .normalize('NFD').replace(/\p{M}/gu,'').replace(/[\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/gu,'')
  .replace(/[013457@$]/g,c=>({'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','@':'a','$':'s'}[c]));
}
export function classify(text, nickname='') {
 const raw=`${nickname}\n${text}`.normalize('NFKC'),n=normalize(raw),compact=n.replace(/[^a-z]/g,'');
 const reasons=[];
 if(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/u.test(raw)||/<[^>]+>/u.test(raw))reasons.push('formatting-review');
 if(/(?:https?:|www\.|\b[a-z0-9-]+\s*(?:\.|\[dot\]|\(dot\))\s*(?:com|net|org|rs|io|xyz|ru|uk)\b|\b(?:t\.me|wa\.me)\b)/iu.test(raw))reasons.push('link');
 if(/[\w.+-]+\s*@\s*[\w.-]+\.[a-z]{2,}/iu.test(raw)||/(?:\+?\p{Nd}[\s().-]*){7,}/u.test(raw))reasons.push('contact-data');
 if(/\b(?:kill|murder|rape|suicide|nudes?|porn|fuck\w*|bitch\w*|nigger\w*|faggot\w*|jeb\w*|pizd\w*|kurac|kurva\w*|pedofil\w*|silova\w*|ubicu|ubiti|zaklacu|crkni)\b/u.test(n)
  ||['killyou','ubicute','zaklacu','fuckyou','jebem','pizda'].some(x=>compact.includes(x)))reasons.push('abuse-or-threat');
 if(/(.)\1{9,}/u.test(n)||/\b(?:free money|guaranteed profit|buy now|earn money|zaradi odmah|besplatna zarada)\b/u.test(n))reasons.push('spam');
 if(/[^\p{Script=Latin}\p{Script=Cyrillic}\p{N}\p{P}\p{Z}\p{S}\s\p{M}]/u.test(raw))reasons.push('language-review');
 return {status:reasons.length?'held':'published',reasons,policyVersion:POLICY_VERSION};
}
