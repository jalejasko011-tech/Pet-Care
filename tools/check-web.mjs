import { existsSync, readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const required = ['www/index.html', 'www/manifest.webmanifest', 'www/icon.svg', 'capacitor.config.json'];
let errors = 0;
for (const path of required) {
  if (!existsSync(path)) {
    console.error('Missing required asset:', path);
    errors++;
  } else {
    console.log('OK:', path);
  }
}
if (existsSync('capacitor.config.json')) {
  try {
    const config = JSON.parse(readFileSync('capacitor.config.json', 'utf8'));
    if (config.webDir !== 'www') {
      console.error('Capacitor webDir must be www.');
      errors++;
    }
  } catch (error) {
    console.error('Invalid capacitor.config.json:', error.message);
    errors++;
  }
}
if (existsSync('www/index.html')) {
  const html = readFileSync('www/index.html', 'utf8');
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  let checked = 0;
  for (const [, attributes, source] of scripts) {
    if (/\bsrc\s*=/i.test(attributes) || /\btype\s*=\s*["'](?:application\/json|importmap)["']/i.test(attributes)) continue;
    if (!source.trim()) continue;
    try {
      new Script(source, { filename: 'www/index.html (inline script)' });
      checked++;
    } catch (error) {
      console.error('Inline JavaScript syntax error:', error.message);
      errors++;
    }
  }
  console.log('Validated', checked, 'inline JavaScript block(s).');
  if (!/<title\b/i.test(html)) {
    console.error('Missing HTML title.');
    errors++;
  }
}
if (errors) {
  console.error('Web checks failed:', errors);
  process.exitCode = 1;
} else {
  console.log('Pet Care web checks passed.');
}
