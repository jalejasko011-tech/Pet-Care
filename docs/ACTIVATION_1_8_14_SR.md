# Aktivacija 1.8.14 (25) — 22. oktobar 2026.

Zabeleženo 2026-10-22T15:19:59+00:00. Ovo nije Play registracija, predaja ili Google odobrenje.

## Ažuriranje — 23. oktobar 2026.

Vlasnik je potvrdio da alarmi rade i posle restarta telefona. Provera podsetnika/restarta je prošla prema njegovoj potvrdi i više nije otvorena prepreka. Raniji nalaz kašnjenja ispod ostaje istorijski. Ostale operativne i Play provere nisu time potvrđene.

## Potvrđeno

- PR 28 je spojen; aplikacioni izvor izdanja je `951ab3a08facee51f7ea7dd9c892153a5b04f79a`.
- Provera grane `39800138565`: completed/success. Provera glavne grane `39801837898`: completed/success. Testirani su web tokovi, Android 36, podsetnik posle stvarnog restarta emulatora/otključavanja/zaključavanja/Doze, Auth prelazak uz isti UID, porodične prijave i blokiranje, sve pozivnice pri uklanjanju člana, oblikovani identifikatori i moderacija uz aktivne kandidatske server-uslove.
- Potpisano izdanje `39801837830`: completed/success. Potpisani APK/AAB su sačuvani. APK v2 potpis i digest su kriptografski provereni, manifest potvrđuje `com.petcare.companion`, 1.8.14 (25), a svih 38 web resursa u oba paketa odgovara izvoru.
- Firebase: aktivna revizija 22. oktobra u 17:07 po vremenu konzole. Ceo objavljeni tekst je jednak testiranom `firebase/production-adult-access.rules`, bez neobjavljenih izmena. SHA-256 fajla: `217e1841b48157731fce4b1956c8a441fc025b058659f2d7c25040762ebe500e`.
- GitHub Pages je objavio isti izvor. HTTP 200 i podudaranje sadržaja potvrđeni su za adult-access.js, shared-family.js, moderator.js, privacy.html i delete-chat.html. Proveren je direktan ulazak i stvarni novi dijalog odrasle osobe; probna produkcijska prijava/nalog nije pravljen.
- Firebase Email/Password je omogućen. Spark plan je zadržan; nema uključenog novog obračuna, medija ili chat push-a.

## Potpisani fajlovi

| Fajl | SHA-256 |
| --- | --- |
| Pet-Care-World-1.8.14.apk | f74491a7fa2c45ed871c53b28386a289372021aaee26293d01a2b2ac7d26127d |
| Pet-Care-World-1.8.14.aab | 17650693650f6691e9a4aee5760d927f3b04eb762c7f3ac9e974350f849a411d |

Sertifikat ažuriranja: `e8cdb78355aa5a08d5327dd07c050b92168e8afef6c4aa2d3c8c7f25c5736990`. Instalacija preko postojeće aplikacije, bez deinstalacije.

## Preostale lične i operativne provere

Poslednja stvarna provera Authentication prikazuje samo jedan anonimni nalog. Pravi moderatorski email nalog nije napravljen/potvrđen i uloga mu nije dodeljena. Google prijava vlasnika projekta nije aplikacioni moderatorski nalog. Korisnik lično postavlja novu lozinku i potvrđuje email. Administrator zatim dodeljuje njegov privatni moderatorski dokument i proverava stvarne prijave, uklanjanje, zabranu, podršku i postupak brisanja naloga. Nijednom anonimnom nalogu nije dodeljena uloga.

Na korisnikovom HONOR/Huawei telefonu test restarta je kasnio 3–4 minuta, uz kasnije potvrđen status exact alarms `denied`. Kratko obaveštenje ranije jeste stiglo. Fizički test preciznog podsetnika ostaje nepotvrđen do ličnog uključivanja Alarms & reminders, statusa `granted` i ponavljanja dužeg testa posle restarta. Emulator ne potvrđuje ponašanje tog uređaja.

Play registracija/identitet/ugovor/plaćanje, stvarni Console odgovori i eventualni obavezni 12-tester/14-dnevni zatvoreni test nisu završeni. Ciljna publika nije automatski promenjena. Za trenutno ponašanje i odluke koristiti GOOGLE_PLAY_DATA_SAFETY_REVIEW.md i PLAY_STORE_RELEASE_CHECKLIST.md, ne stare anonimne deklaracije.
