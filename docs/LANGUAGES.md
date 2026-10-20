# Languages and breed suggestions — 1.8.3

The requested languages are English, Serbian, German, French, Spanish, Italian,
Portuguese, Turkish, Russian, Chinese, Japanese, Arabic, Hindi, Dutch, Polish,
Greek, Romanian, Croatian, Bulgarian and Korean. Indonesian, Thai, Vietnamese and
Swedish remain available for installations that already used those four options.
English remains the initial default. The selected locale is saved on the device.

The catalog currently covers 801 source phrases per locale.

Dictionaries are bundled in `www/locale-data.js`; runtime translation does not
call a translation service or transmit pet records. `locales/source-en.json`
contains Serbian keys and English source copy. `locales/<language>.json` contains
additional translations. Run `python tools/build-locales.py` after changes.
`locales/reviewed-terms.json` supplies manually checked terminology and selected
privacy text which take precedence over generated translations.

Croatian copy also uses adapted Serbian source text with Croatian terminology.
Other additional copy was machine translated locally using the MIT-licensed Meta
M2M100-418M model in CTranslate2 format. Translation coverage is a technical check,
not certification of fluent or legally reviewed copy. Native-speaker review of
additional languages remains required before advertising professional translation.
The existing legal policy pages retain their English/Serbian authoritative text.
User-entered records, public chat messages and private memories are not translated.
International breed names are used as suggestions, with Serbian aliases for common
breeds. Users can enter any other name. For fish, reptiles and similar pets these
are species suggestions, not a claim that each entry is a breed. The catalog is
not exhaustive and does not give advice about breeding or keeping protected species.

Form option values remain stable Serbian identifiers while visible captions are
translated. Existing profiles and custom breed strings are preserved. Date and
currency formatting follow the selected locale; recorded amounts remain RSD.
Arabic uses RTL layout, with numeric/date fields kept readable in LTR direction.

No Firebase billing or deferred paid cloud feature is activated by this change.

The 1.8.3 audit corrects navigation, action, health-record, meal and notification
terminology in all 22 additional locale dictionaries. It adds 16 missing source
phrases, preserves sentence punctuation after emoji prefixes, and separates
localized interface captions from user-entered record values. Backup and support
report privacy copy is explicitly corrected. This is not a full native-speaker
review of every sentence; untranslated legal pages remain English/Serbian.

Breed catalog spot-checks: FCI English Foxhound (159), Serbian Tricolour Hound
(229), Serbian Hound (150), and CFA Maine Coon / British Shorthair. Balkan Hound
is an older name for Serbian Hound and is kept as a Serbian search alias, not a
second dog breed entry. International breed names and free text remain supported.
Sources: https://www.fci.be/en/nomenclature/ENGLISH-FOXHOUND-159.html ;
https://www.fci.be/en/nomenclature/SERBIAN-TRICOLOUR-HOUND-229.html ;
https://ksrs.rs/en/srpske-rase/serbian-hound/ ; https://cfa.org/breeds/ .
