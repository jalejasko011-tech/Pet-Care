# Aktuelno — 1.8.16 (27), bez javnog chata

23. oktobar 2026: vlasnik je odložio javni chat kako bi izbegao njegove troškove i operativnu moderaciju. Chat, njegovi push/mediji i moderatorska prijava uklonjeni su iz ovog izdanja. Automatsku moderaciju ne aktivirati, Blaze ne uključivati. Porodična briga, potvrđen email/lozinka, prijava/blokiranje članova i kontrola vlasnika ostaju.

Serverski kandidat: `firebase/production-no-public-chat.rules`. Objavljivanje u produkciji još nije potvrđeno jer je Firebase konzola odjavljena. Do tada starije instalacije mogu imati pristup prethodnom chatu. Raniji podaci nisu obrisani; zahtevi za brisanje ostaju preko `jalejasko011@gmail.com`, uz potvrdu vlasništva. Ne slati lozinke. Brisanje Auth naloga može prekinuti pristup porodici.

Data Safety: email/identifikator za dobrovoljni porodični nalog, osnovni deljeni profil ljubimca, naziv porodice, imena/identifikatori članova, dnevnik brige i privatne prijave i dalje se obrađuju na Firebase-u. Privatna evidencija i mediji ostaju lokalni dok ih korisnik sam ne izveze/podeli. Odsustvo javnog chata ne znači odsustvo svih korisničkih sadržaja niti odobrenje za sve uzraste. Konačnu publiku i stvarne izjave vlasnik proverava u Play Console.

Ostaju: objavljivanje/provera serverskih pravila, Play nalog/identitet/ugovor i jednokratna naknada od 25 USD, interni test i uslovni zatvoreni test za novi lični nalog (12 stvarnih testera 14 neprekidnih dana), zahtev za produkciju i Google pregled. Vlasnik je već potvrdio alarme na telefonu posle restarta; ne tražiti ponavljanje bez novog problema. Detalji ovog izdanja: `docs/RELEASE_1_8_16.md`.

---
## Istorijska dokumentacija pre uklanjanja javnog chata

Sledeći tekst opisuje ranije izdanje; njegove chat funkcije i preduslovi nisu aktuelan plan.

# Pet Care World 1.8.10 — počni ovde

Ovaj paket je pripremljen za predaju na Google Play. Aplikacija još nije objavljena niti odobrena na Play Store-u.

## Za telefon

Preuzmi `Pet-Care-World-1.8.10.apk` sa stranice izdanja i instaliraj preko postojeće aplikacije. Nemoj brisati staru instalaciju radi ažuriranja. APK u alternativnom ZIP-u je isti fajl. AAB iz ovog paketa se predaje Play Console-u; nije fajl za direktnu instalaciju na telefon.

U aplikaciji otvori Podešavanja → Potpuna rezervna kopija. ZIP uključuje evidenciju, Galeriju i Uspomene. Sačuvaj ga u bezbednom mestu izvan podataka aplikacije. Kopija nije šifrovana; ograničenja veličine su prikazana pre izvoza.

U Više → Pomoć i provera možeš zakazati test obaveštenja za 10 sekundi. Na pravom telefonu treba proveriti zvuk, režim baterije, ponovno pokretanje i ponašanje posle instalacije preko Play-a. Testovi na emulatoru nisu zamena za to.

## Šta je u paketu za Play

- `Pet-Care-World-1.8.10.aab`: potpisana aplikacija za predaju.
- `store-listing/title.txt`, `short-sr.txt` i `full-sr.txt`: naziv i opisi na srpskom. Tu su i engleski opisi.
- `store-listing/assets/`: ikona 512×512 i promotivna slika 1024×500.
- `store-listing/screenshots/`: stvarni snimci aplikacije na Android emulatoru, sa izmišljenim testnim zapisima.
- `docs/PLAY_STORE_RELEASE_CHECKLIST.md`: koraci za vlasnika naloga.
- `docs/GOOGLE_PLAY_DATA_SAFETY_REVIEW.md`: priprema za pitanja o podacima, nije već predata izjava.

## Šta zahteva vlasnički nalog

Javni tekstualni chat radi. Slanje slika/snimaka u njemu i chat obaveštenja u pozadini su pripremljeni, ali ostaju isključeni do podešavanja Firebase Storage/Functions servera, odobrenja eventualne naplate i provere dva prava telefona. Nije automatski aktivirana plaćena usluga. Za moderatorski ekran vlasnik projekta mora da odobri moderatorski nalog; sama prijava ne daje ovlašćenje.

Za Play su potrebni vlasnički Play Console nalog, provera identiteta, eventualna registraciona uplata, potrebna testiranja i Google-ovo odobrenje. Ne isključuj Play Protect. Pregledaj opise, sadržaj, privatnost i podatke o aplikaciji pre slanja. Za pogođene nove lične naloge Google zahteva zatvoreno testiranje; tačan postupak proveri u Console-u.

Politika privatnosti: https://jalejasko011-tech.github.io/Pet-Care/www/privacy.html
Brisanje chat podataka: https://jalejasko011-tech.github.io/Pet-Care/www/delete-chat.html
Podrška: jalejasko011@gmail.com

## Porodično povezivanje

U Porodici izaberite Poveži porodičnu brigu. Prvi član napravi zajednički profil i kod, a ostali unesu isti kod i svoje ime. Kod važi do 24 sata za do 10 novih članova. Novi zajednički dnevnik deli se preko interneta; privatna istorija, slike i lokalni alarmi se ne prenose automatski. Identitet je vezan za uređaj i nije u lokalnoj kopiji. Čuvajte pristup vlasničkom telefonu.
