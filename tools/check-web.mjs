import { existsSync, readFileSync } from 'node:fs';
const required = ['www/index.html', 'capacitor.config.json'];
for (const path of required) {
  if (!existsSync(path)) {
    console.error('Missing required file:', path);
    process.exitCode = 1;
  } else {
    console.log('OK:', path);
  }
}
if (existsSync('capacitor.config.json')) {
  const config = JSON.parse(readFileSync('capacitor.config.json', 'utf8'));
  if (config.webDir !== 'www') {
    console.error('Incorrect Capacitor webDir:', config.webDir);
    process.exitCode = 1;
  }
}
if (!process.exitCode) console.log('Web assets check passed.');
