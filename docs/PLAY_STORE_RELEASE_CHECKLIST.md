# Play Store — aktuelna provera 1.8.17 (28), 24. oktobar 2026.

Paket `com.petcare.companion`, Android target API 36. Aktuelno izdanje uklanja javni chat i zadržava dobrovoljnu porodičnu brigu. Prethodna izdanja i nalazi su u verzionisanim RELEASE/ACTIVATION dokumentima; ne primenjivati njihove stare chat/moderator preduslove.

## Tehnički obuhvat

- Privatna evidencija, 24 upakovana jezika, izbor rase, numerički podsetnici, lokalni mediji, kopije i direktna navigacija.
- Brisanje ljubimca obuhvata sve povezane lokalne kolekcije i medije, sa nastavkom posle prekida i bez lažne potvrde pri punoj memoriji.
- Istaknuti zahtev za brisanje Auth naloga i povezanih serverskih podataka: Podešavanja, Porodična briga i ekran prijave; javni resurs `www/delete-account.html`.
- Porodični ID vraća već postojeći pristup istom nalogu na drugom uređaju. Ne daje pravo novom članu. Kod za poziv i ID za oporavak imaju različite svrhe.
- Javni chat i moderatorski ekran nemaju vezu sa SDK-om; plaćeni backend, oglasi, pretplate, automatska moderacija i push nisu aktivirani.
- Alarm posle restarta stvarnog telefona vlasnik je potvrdio 23. oktobra. Ne tražiti ponavljanje bez novog razloga.

## Dokazi i granice

Pogledati `ACTIVATION_1_8_17_SR.md` za provereni izvor, CI, potpise i fajlove. Snimak korisnikove konzole od 23. oktobra 19:51 potvrđuje novu aktivnu reviziju sa vidljivim zabranama chata; to nije potpuno poređenje svih pravila ili test prijavljenog produkcijskog klijenta. Plan Spark je vidljiv na korisnikovom snimku. Novi rules fajl za 1.8.17 nije potreban.

## Radnje vlasnika i stvarni Play test

1. Proveriti ceo objavljeni tekst `firebase/production-no-public-chat.rules` i izvršiti porodični test u produkciji potvrđenim pravim nalozima. Ne vraćati stari root preview.
2. Potvrditi podršku i stvarno postupanje po zahtevima za brisanje. Stranica je put do zahteva; nije automatsko brisanje Admin naloga. Ne brisati nalog pre obrade njegovih članstava, zapisa, prijava, istorijskog chata i porodica čiji je vlasnik.
3. Završiti Play nalog/identitet/ugovor i naknadu od 25 USD ako još nisu završeni. Ne postoji potvrda da je registracija već obavljena.
4. Uneti stvarne Console odgovore prema `PLAY_CONSOLE_ANSWERS_1_8_17_SR.md` i `GOOGLE_PLAY_DATA_SAFETY_REVIEW.md`, uključujući ciljnu publiku i porodični korisnički sadržaj. Ne birati sve uzraste automatski i ne menjati vlasnikovu publiku bez dogovora.
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
