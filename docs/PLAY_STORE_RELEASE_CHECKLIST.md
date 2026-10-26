# Play Store — aktuelna provera 1.8.20 (31), 26. oktobar 2026.

Paket `com.petcare.companion`, Android target API 36. Aktuelno izdanje uklanja javni chat i zadržava dobrovoljnu porodičnu brigu. Prethodna izdanja i nalazi su u verzionisanim RELEASE/ACTIVATION dokumentima; ne primenjivati njihove stare chat/moderator preduslove.

## Tehnički obuhvat

- Privatna evidencija, 24 upakovana jezika, izbor rase, numerički podsetnici, lokalni mediji, kopije i direktna navigacija.
- Brisanje ljubimca obuhvata sve povezane lokalne kolekcije i medije, sa nastavkom posle prekida i bez lažne potvrde pri punoj memoriji.
- Istaknuti zahtev za brisanje Auth naloga i povezanih serverskih podataka: Podešavanja, Porodična briga i ekran prijave; javni resurs `www/delete-account.html`.
- Porodični ID vraća već postojeći pristup istom nalogu na drugom uređaju. Ne daje pravo novom članu. Kod za poziv i ID za oporavak imaju različite svrhe.
- Javni chat i moderatorski ekran nemaju vezu sa SDK-om; plaćeni backend, oglasi, pretplate, automatska moderacija i push nisu aktivirani.
- Alarm posle restarta stvarnog telefona vlasnik je potvrdio 23. oktobra. Ne tražiti ponavljanje bez novog razloga.

## Dokazi i granice

Izdanje 1.8.20: izvor d0e858f6170fcb23c00b3ad274df3911b2536b95, quality CI 40367272490 (web, pravila, Android/restart) i potpisani build/publish 40367272553 su prošli. Dana 26.10 ceo tekst aktivne Rules revizije od 23.10 19:51 poređen je sa testiranim fajlom: SHA-256 fc18d041949e36917f2b03474dfa65c67c5d0736edc1095fc3f502aa780097d7 posle normalizacije samo završnih praznina. Nema ponovne objave ili root preview-a. Spark je neposredno potvrđen. Stvarni prijavljeni porodični klijenti i fizički Play test još čekaju prihvatanje.

## Radnje vlasnika i stvarni Play test

1. Ceo aktivni Rules tekst je poređen 26.10 i odgovara testiranom kandidatu posle normalizacije samo završnih praznina. Stvaran porodični test sa dva potvrđena naloga još čeka ukućanina; koristiti PRODUCTION_FAMILY_ACCEPTANCE_1_8_20_SR.md.
2. Potvrditi podršku i stvarno postupanje po zahtevima za brisanje. Stranica je put do zahteva; nije automatsko brisanje Admin naloga. Ne brisati nalog pre obrade njegovih članstava, zapisa, prijava, istorijskog chata i porodica čiji je vlasnik.
3. Završiti Play nalog/identitet/ugovor i naknadu od 25 USD ako još nisu završeni. Ne postoji potvrda da je registracija već obavljena.
4. Uneti stvarne Console odgovore prema `PLAY_CONSOLE_ANSWERS_1_8_20_SR.md` i `GOOGLE_PLAY_DATA_SAFETY_REVIEW.md`, uključujući ciljnu publiku i porodični korisnički sadržaj. Ne birati sve uzraste automatski i ne menjati vlasnikovu publiku bez dogovora.
5. Interni test: instalacija preko Play-a, ulazak bez datuma/koda, čuvanje i kopija, porodično povezivanje/oporavak/prijava/blokiranje/brisanje, zahtev za brisanje naloga, dostupnost pravila privatnosti i osnovni pregled jezika.
6. Ako je nalog novi lični nalog: najmanje 12 stvarnih testera neprekidno prijavljenih 14 dana, zatim zahtev za produkcijski pristup. CI i APK van Play-a ne zamenjuju ovaj postupak.
7. Google pregled i odobrenje. Ne tvrditi da javna objava može odmah dok navedeno nije potvrđeno.

## Primarni izvori

- https://support.google.com/googleplay/android-developer/answer/6112435?hl=en
- https://support.google.com/googleplay/android-developer/answer/14151465?hl=en
- https://support.google.com/googleplay/android-developer/answer/13327111?hl=en
- https://support.google.com/googleplay/android-developer/answer/9893335?hl=en
- https://support.google.com/googleplay/android-developer/answer/10787469?hl=en
- https://support.google.com/googleplay/android-developer/answer/11926878?hl=en

## Najnoviji neposredni nalaz

Dana 26.10 potvrđen je pristup Firebase konzoli, Spark plan, ceo Rules tekst i email/password podešavanja. Server minimum lozinke usklađen je na 12, uz Require i isključen Force upgrade on sign-in. Osam javnih REST kolekcija odbija čitanje. Proba brisanja u izolovanim emulatorima je prošla; nije obrisan stvaran nalog.

Play Console je neposredno otvoren i prikazuje Creating a developer account / signup za vlasnikov Google nalog. Registracija zato još nije dovršena: nema kreirane Play aplikacije, test kanala ili opt-in linka za deljenje. Podaci za unos, uputstvo za testere, prazan tracker i potpisani 1.8.19 AAB su pripremljeni.
