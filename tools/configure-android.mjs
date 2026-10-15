import { readFileSync, writeFileSync } from 'node:fs';
const vars='android/variables.gradle';
let text=readFileSync(vars,'utf8');
for(const key of ['compileSdkVersion','targetSdkVersion']) {
 if(!new RegExp(key+'\\s*=\\s*\\d+').test(text))throw Error('Missing Android SDK setting: '+key);
 text=text.replace(new RegExp(key+'\\s*=\\s*\\d+'),key+' = 36');
}
writeFileSync(vars,text);
const build='android/build.gradle';
text=readFileSync(build,'utf8').replace(/com\.android\.tools\.build:gradle:[\d.]+/,'com.android.tools.build:gradle:8.9.1');
writeFileSync(build,text);
console.log('Android compile/target API 36 configured with AGP 8.9.1 for Google Play.');
