# Direktna provera konzole — 26. oktobar 2026.

Pristup je uspešno potvrđen Google prijavom vlasnika. Aktivna zvezdicom označena revizija ostaje **23. oktobar 2026. u 19:51 po vremenu konzole**. Nije objavljena nova Rules revizija.

Kopiran je ceo tekst iz aktivnog Rules editora: 9.981 znak, uključujući dodatne praznine na kraju. Nakon uklanjanja samo završnih belina i dodavanja jednog završnog novog reda, SHA-256 je **fc18d041949e36917f2b03474dfa65c67c5d0736edc1095fc3f502aa780097d7**, jednak celom testiranom fajlu `production-no-public-chat.rules`. Nije korišćen širi root preview.

Produkcijski REST bez prijave: osam kolekcija vraća 403 PERMISSION_DENIED / Missing or insufficient permissions. Rules playground sa simuliranim potvrđenim password identitetom: globalMessages read denied. Simulacija nije stvarna Auth prijava niti end-to-end porodični test.

Auth: Email/Password uključen, passwordless email-link isključen, email enumeration zaštita uključena. Minimum nove lozinke promenjen je sa 6 na **12**, Require enforcement, Force upgrade on sign-in **isključen**; maksimum 4096. Anonymous provajder ostaje uključen radi istorijskog pristupa, ali nova aplikacija ne stvara anonimne naloge i oni ne ispunjavaju family signedIn pravilo.

Spark / No cost ($0/month) potvrđen je neposredno. Storage traži Blaze nadogradnju; nije nadograđen. Podaci/nalozi nisu brisani, postojeće porodice nisu menjane. Stvarni višekorisnički porodični test i stvaran zahtev za brisanje ostaju otvoreni.

Prethodni nalazi ispod predstavljaju istoriju i više nisu dokaz da puni Rules tekst nije poređen.

---

# Firestore pravila — javni chat uklonjen

## Potvrda korisnikove konzole — 23. oktobar 2026. u 19:51

Snimak `Screenshot 2026-10-23 195106.png` prikazuje aktivnu, zvezdicom označenu reviziju od danas u 19:51 po vremenu konzole. Vidljivi početak odgovara testiranom fajlu `firebase/production-no-public-chat.rules`: potvrđen email/password uslov, pet blokova `allow read, write: if false` za chatProfiles, globalMessages, chatReports, moderationAudit i moderators, pa početak familyOwner funkcije. Prethodna revizija je juče u 17:07.

**Potvrđena je objava revizije sa vidljivim zabranama javnog chata.** Snimak ne obuhvata ceo tekst: potpuno byte-exact poređenje aktivnih pravila, provera svih preklapajućih allow uslova i produkcijski test prijavljenog klijenta još nisu urađeni. Ne predstavljati ovu potvrdu kao potpunu Firebase reviziju. Testirani lokalni kandidat i svi porodični/emulatorski testovi ostaju isti. Fotografija od 19:43 prikazuje Spark plan i No cost ($0/month); nije uključena nova naplata ili plaćeni backend.

Pristup kroz zvanični dodatak i kontrolisani preglednik i dalje nije potvrđen. Istorijski podaci nisu obrisani. Izvor aplikacije, APK/AAB i prethodno provereni potpisi nisu menjani.

## Prethodni nalaz pre korisnikove objave

# Public chat removal — 23 October 2026

Candidate: **production-no-public-chat.rules**. This keeps the adult password/email gate and all family blocks byte-exact, denies all client access to retired public-chat collections and retains default denial for unused media/push paths.

**Not yet published:** the Firebase Console session was signed out on 23 October. A fresh signed-in Console publication and full-text comparison remain required. Do not claim old installed chat clients are blocked until that is verified. No data has been deleted, billing has not been upgraded, and no Functions have been deployed.

Deploy only this candidate using `firebase.no-chat.json` (Firestore only), or paste the entire candidate into Firestore Rules and publish. Do not deploy root `firestore.rules` or an automatic moderation branch.

## Previously verified production revision

# Aktivna Firestore pravila — 22. oktobar 2026.

Projekat: `pet-care-world`. Aktivni fajl: **production-adult-access.rules**.
Objavljen u Firebase konzoli 22. oktobra 2026. u **17:07 po vremenu konzole**.
Zvezdicom označena nova revizija je potvrđena, bez neobjavljenih izmena; ceo kopirani objavljeni tekst jednak je pripremljenom i testiranom kandidatu.

Tekst ima 14.776 znakova; bez belina 11.943, FNV-1a `8af0d049`. Fajl sadrži samo tekstualni chat, porodice, prijave, privatnu moderatorsku evidenciju i uloge. Ne aktivira medije ili push.

`production-review-current.rules` ima istorijsko ime i predstavlja reviziju od 21. oktobra, ne ovu aktivnu reviziju. Ostaje kao istorijski regresioni test. **Ne objavljivati korenski firestore.rules preview niti vratiti stara anonimna pravila umesto aktivnog fajla.**

Moderatorska uloga može biti serverski claim ili dokument `moderators/UID` sa boolean poljem `active: true`. Klijentske izmene tih dokumenata su zabranjene svim korisnicima, uključujući moderatore. Dokument dodeljuje isključivo administrator projekta kroz Firebase konzolu/Admin SDK. Potvrđen email i password prijava zahtevaju se i moderatoru.

Ne dodeljivati ulogu postojećem anonimnom nalogu. Identifikovati tačan pravi nalog odraslog vlasnika u Authentication, potvrditi da je email njegov, dodeliti dokument tom UID-u, pa proveriti stvarni moderatorski pristup i postupke. Trenutna aktivacija pravila ne znači da je stvarni moderator već napravljen ili potvrđen.
