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
