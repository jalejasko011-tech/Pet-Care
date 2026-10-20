"""Compile checked-in locale dictionaries into the offline app bundle."""
import json,pathlib,sys
root=pathlib.Path(__file__).resolve().parents[1]
source=json.loads((root/'locales/source-en.json').read_text())
terms=json.loads((root/'locales/reviewed-terms.json').read_text())
codes=['en','sr','de','fr','es','it','pt','tr','ru','zh','ja','ar','hi','nl','pl','el','ro','hr','bg','ko','id','th','vi','sv']
result={};missing=[]
for code in codes:
 if code=='sr':result[code]={k:k for k in source};continue
 if code=='en':result[code]=source.copy()
 else:
  path=root/'locales'/f'{code}.json'
  if not path.exists():
   if '--preview' not in sys.argv:raise SystemExit(f'Missing locale: {code}')
   result[code]=source.copy();missing.append(code)
  else:result[code]=json.loads(path.read_text())
 result[code].update(terms.get(code,{}))
 for key in source:
  if not isinstance(result[code].get(key),str) or not result[code][key].strip():
   if '--preview' in sys.argv:
    result[code][key]=source[key]
    if code not in missing:missing.append(code)
   else:raise SystemExit(f'Empty translation: {code}: {key}')
 # No untranslated identifiers or model control tokens enter the app.
 for key,text in result[code].items():
  if '<unk>' in text or '__en__' in text:raise SystemExit(f'Invalid translation token: {code}: {key}')
(root/'www/locale-data.js').write_text('// Offline UI dictionaries. Additional locales include machine-translated copy; see docs/LANGUAGES.md.\nwindow.PETCARE_LOCALES='+json.dumps(result,ensure_ascii=False,separators=(',',':'))+';\n')
print('Compiled',len(codes),'locales;',len(source),'source phrases.', 'PREVIEW missing: '+','.join(missing) if missing else '')
