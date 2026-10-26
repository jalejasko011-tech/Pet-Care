# Paket za pokretanje Play testa — 1.8.20 (31)

Ovo je pripremljen paket za vlasnika. Nije otvoren Play test, potvrđen nalog, izabrana ciljna publika ili Google odobrenje.

## Gotovo

- Potpisani AAB, paket com.petcare.companion, versionCode 31, target API 36. Objavljeno v1.8.20 iz d0e858f6170fcb23c00b3ad274df3911b2536b95; quality CI 40367272490 i potpisani build/publish 40367272553 prošli. Nezavisno su provereni potpisi i 43 upakovana web fajla.
- Opisi EN/SR, ikona, feature slika i četiri stvarna Android emulator snimka sa izmišljenim probnim sadržajem. Nisu dokaz testiranja stvarnih korisnika.
- Neposredna Firebase provera celih aktivnih pravila, Spark plana i Auth konfiguracije. Server za nove lozinke sada traži minimum 12 znakova, bez Force upgrade on sign-in. Detalji u FIREBASE_REVIEW_2026_10_26_SR.md.
- Izolovana proba brisanja Auth naloga i povezanih podataka prošla je u emulatorima (40362563676), uz očuvanje nepovezanog naloga. Nije brisan produkcijski nalog ili stvarna porodica.
- Uputstvo za testere, prazan tracker T01–T12 i nacrt poziva. Ti redovi nisu stvarni testeri. Nacrt nije poslat.

## Redosled nastavka

1. Završiti Play Console registraciju. Dana 26.10 za vlasnikov Google nalog prikazan je Creating a developer account / signup. Vlasnik bira odgovarajući lični/organizacijski nalog, unosi tačne pravne podatke, potvrđuje identitet i lično završava potrebne ugovore/uplatu. Jednokratna naknada je 25 USD; konačan iznos/valutu prikazuje Google. Ne unositi izmišljene pravne podatke ili slati lozinke, karticu ili dokumenta kroz javni repozitorijum/razgovor.
2. Kreirati aplikaciju i prvo pripremiti interni test. Koristiti Pet-Care-World-1.8.20.aab, ne APK. Pratiti PLAY_CONSOLE_ANSWERS_1_8_20_SR.md i GOOGLE_PLAY_DATA_SAFETY_REVIEW.md; konačni odgovori treba da opišu stvarnu uslugu, ciljnu publiku, zatvoreni porodični UGC i pristup za Google pregled. Ne izmišljati ocenu sadržaja ili reviewer akreditive.
3. Pri Play App Signing izboru uskladiti delivery signing ključ sa postojećim direktnim APK potpisom ako se zahteva ažuriranje bez deinstalacije. Upload potpis sam po sebi ne garantuje isti delivery ključ. Postojeći sertifikat: e8cdb78355aa5a08d5327dd07c050b92168e8afef6c4aa2d3c8c7f25c5736990. Bezbedan postojeći-keystore/PEPK postupak izvršiti tek u konkretnom Console toku; privatni ključ i lozinke ne objavljivati. Pre bilo kakvog potrebnog prenosa/deinstalacije napraviti ručnu ZIP kopiju van aplikacije.
4. Sa ukućaninom proveriti produkcijsku porodicu po PRODUCTION_FAMILY_ACCEPTANCE_1_8_20_SR.md. Zatim izvršiti stvarnu operativnu probu zahteva za brisanje uz potvrdu vlasništva i OWNER_ACCOUNT_DELETION_SR.md. Ne koristiti stvarne privatne zapise kao potrošne test podatke.
5. Proveriti prvu instalaciju preko internog Play testa i prihvatne tokove iz ACCEPTANCE_1_8_20_SR.md. Vlasnik je već potvrdio fizičke alarme posle restarta i instalaciju 1.8.17; to nije dokaz svih Play/1.8.20 tokova. Bez novog problema ne ponavljati bespotrebno već potvrđen alarm na istom telefonu.
6. Kada postoji stvaran zatvoreni test, vlasnik dodaje Google naloge testera privatno u Console i šalje njegov pravi opt-in link. Za novi lični nalog na koji se uslov odnosi: najmanje 12 stvarnih kontinuirano uključenih testera najmanje 14 dana, zatim zahtev za produkcijski pristup. Ne računati direktne APK instalacije ili CI kao ovaj period.

Osnovni lokalni ulazak ostaje bez koda i datuma korisnika. Dostupnost mlađima nije automatski završena deklaracija za sve uzraste: Porodični prikaz nije roditeljska brava, a provereni email/password ne dokazuje sam po sebi roditeljski odnos. Pripremu publike/IARC završiti prema stvarnim kontrolama, sadržaju i Google pitanjima; ne menjati vlasnikov zahtev tiho u adults-only.

## Javne stranice i podrška

- Privatnost: https://jalejasko011-tech.github.io/Pet-Care/www/privacy.html
- Zahtev za brisanje: https://jalejasko011-tech.github.io/Pet-Care/www/delete-account.html
- Podrška: jalejasko011@gmail.com

## Provereni izvori — 26.10.2026.

- https://support.google.com/googleplay/android-developer/answer/6112435?hl=en
- https://support.google.com/googleplay/android-developer/answer/14151465?hl=en
- https://support.google.com/googleplay/android-developer/answer/13327111?hl=en
- https://support.google.com/googleplay/android-developer/answer/9893335?hl=en
- https://support.google.com/googleplay/android-developer/answer/10787469?hl=en
- https://firebase.google.com/docs/auth/web/password-auth

## Trenutni korak registracije

U pripremi je odabran lični tok (može se vratiti nazad pre završetka), a promenljiv javni developer name upisan je kao Pet Care World. Prijava je stigla do Link a payments profile to verify your identity. Nisu birani/kreirani payments profil, unošeni pravno ime/adresa/kartica, prihvaćeni završni ugovori ili naplaćena naknada. Vlasnik treba da proveri tip naloga i nastavi taj lični deo.
