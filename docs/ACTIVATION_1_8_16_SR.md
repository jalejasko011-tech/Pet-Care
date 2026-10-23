## Potvrda korisnikove konzole — 23. oktobar 2026. u 19:51

Snimak `Screenshot 2026-10-23 195106.png` prikazuje aktivnu, zvezdicom označenu reviziju od danas u 19:51 po vremenu konzole. Vidljivi početak odgovara testiranom fajlu `firebase/production-no-public-chat.rules`: potvrđen email/password uslov, pet blokova `allow read, write: if false` za chatProfiles, globalMessages, chatReports, moderationAudit i moderators, pa početak familyOwner funkcije. Prethodna revizija je juče u 17:07.

**Potvrđena je objava revizije sa vidljivim zabranama javnog chata.** Snimak ne obuhvata ceo tekst: potpuno byte-exact poređenje aktivnih pravila, provera svih preklapajućih allow uslova i produkcijski test prijavljenog klijenta još nisu urađeni. Ne predstavljati ovu potvrdu kao potpunu Firebase reviziju. Testirani lokalni kandidat i svi porodični/emulatorski testovi ostaju isti. Fotografija od 19:43 prikazuje Spark plan i No cost ($0/month); nije uključena nova naplata ili plaćeni backend.

Pristup kroz zvanični dodatak i kontrolisani preglednik i dalje nije potvrđen. Istorijski podaci nisu obrisani. Izvor aplikacije, APK/AAB i prethodno provereni potpisi nisu menjani.

---

## Prethodno zabeležen nalaz

# Provera 1.8.16 (27) — 23. oktobar 2026.

Javni chat je uklonjen na zahtev vlasnika zbog troškova i operativne moderacije. Porodična briga, privatna lokalna evidencija i podsetnici ostaju. Ovo nije Play registracija niti Google odobrenje.

## Objavljeno i provereno

- Izvor: `7d75418d6e8e513784c5f1610aa0c37b4466feaf`, PR #31.
- PR kvalitet `39990823275`: sva tri posla uspešna.
- Kvalitet tačnog objavljenog izvora `39992285410`: sva tri posla uspešna.
- Potpisivanje i objavljivanje `39992285622`: oba posla uspešna.
- Web/Pages `39992285017`: uspešno. Osam javnih fajlova HTTP 200 i byte-exact poređenje sa testiranim izvorom, uključujući uklonjene chat entry point fajlove i sačuvanu porodičnu brigu.
- GitHub izdanje `v1.8.16`, target isti izvor; APK/AAB iz istog potpisanog builda.
- Paket `com.petcare.companion`, verzija 1.8.16 (27), target API 36.
- Postojeći sertifikat: `e8cdb78355aa5a08d5327dd07c050b92168e8afef6c4aa2d3c8c7f25c5736990`. APK v2 potpis i sadržaj kriptografski provereni. AAB JAR potpis i 544 potpisa sadržaja provereni. Svih 39 korisnih web fajlova u oba paketa odgovara izvoru.
- Android WebView: odsustvo javnog chata, navigacija, lokalno čuvanje, kopije i mediji, numerički unos vremena/datuma, native obaveštenja posle prekida procesa i stvarnog restarta emulatora. Vlasnik je ranije 23. oktobra potvrdio alarm posle restarta svog telefona; to ostaje korisnička potvrda, bez izmišljanja modela ili merenja.

## Firebase — šta je provereno

- Kandidat `firebase/production-no-public-chat.rules`, SHA256 `fc18d041949e36917f2b03474dfa65c67c5d0736edc1095fc3f502aa780097d7`. Svaki porodični blok i zahtev za potvrđen email/password provider ostaju byte-exact.
- Emulator: čitanje/listanje/kreiranje/izmena/brisanje penzionisanog chata odbijeni običnim, anonimnim i moderatorskim klijentima; neaktivni push/media putevi ostaju pod podrazumevanom zabranom.
- Tri nezavisna porodična klijenta sa javnim chat flagom false: zajednički kod, live dnevnik, bezbedan tekst, prijava/blokiranje, uklanjanje člana, opoziv i potpuno brisanje porodice. Pravila potvrđuju izolaciju, uloge, konkurentne prijave i ograničenje pozivnice, istek i brisanje.
- Produkcijski anonimni REST zahtevi za listanje `globalMessages`, `chatProfiles`, `petFamilies` i `moderators`: HTTP 403, Firebase `PERMISSION_DENIED`, poruka “Missing or insufficient permissions.” Bez kreiranja naloga, čitanja privatnog sadržaja ili produkcijskih upisa.

## Firebase — stvarno ograničenje pristupa

**Nova pravila nisu objavljena/potvrđena u produkciji.** Konzola je prikazala odjavljen Google nalog. Bezbedna prijava i kasniji pristup pregledniku nisu vratili potvrdu i završili su istekom vremena. Zvanični Firebase dodatak je pronađen, ali nije instaliran/povezan; ranije je već predlagan, pa se ista preporuka ne ponavlja automatski.

Poslednja potpuno upoređena aktivna revizija ostaje ona od 22. oktobra, `production-adult-access.rules`. Anonimni HTTP 403 nije dokaz da su stari prijavljeni chat klijenti ugašeni. Objaviti samo testirani novi kandidat i porediti ceo tekst. Namenski `firebase.no-chat.json` obuhvata samo Firestore; ne objavljivati korenski preview niti Functions.

Trenutni plan/naplata, potrošnja/kvote, aktivni Auth provideri/nalozi, App Check/IAM i lista eventualno raspoređenih Functions ne mogu se potvrditi bez administratorskog pristupa. Poslednja ranija provera plana bila je Spark; u ovom poslu nije uključen Blaze, billing, mediji, push ili automatska moderacija i nisu brisani istorijski podaci/Auth nalozi. PR #29 je zatvoren kao zamenjen uklanjanjem javnog chata. Ne obećavati potpunu produkcijsku Firebase proveru ili nula troškova na osnovu emulatora.

## Potpisani fajlovi

- `Pet-Care-World-1.8.16.apk` — 9042058 bajtova, SHA256 `47e62bd9ebf2037f53449caec2861dbe0cc66f44d3a948091ed8e6f97b313c63`.
- `Pet-Care-World-1.8.16.aab` — 8681370 bajtova, SHA256 `b127a96a343624b418714c4208691a63475780fccec6371ccdfc9693c010bb25`.
