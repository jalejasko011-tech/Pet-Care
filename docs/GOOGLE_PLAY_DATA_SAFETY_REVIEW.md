# Data Safety — radni odgovori za 1.8.17 (28)

Ovo je inventar implementiranog ponašanja za vlasnika, ne poslat ili odobren Play Console upitnik. Izjave moraju odgovarati i aplikaciji i stvarnom radu Firebase projekta/podrške.

| Podaci | Skladištenje i vidljivost | Svrha i kontrola |
| --- | --- | --- |
| Email i identifikator Auth naloga | Dobrovoljna porodična prijava kroz Firebase Auth; email nije objavljen članovima | Upravljanje nalogom, potvrda emaila, zaštita pristupa; zahtev za brisanje u aplikaciji i na javnoj stranici |
| Ime člana i njegov UID | Firestore, članovi odgovarajuće porodice | Prikaz autora i kontrola članstva; izlazak/uklanjanje i zahtev za brisanje |
| Deljeni osnovni profil ljubimca, naziv porodice, dnevnik i vreme | Firestore, samo odgovarajuća porodica | Dobrovoljna porodična funkcija; lokalna istorija i mediji se ne šalju automatski |
| Prijava člana ili zapisa, razlog, identifikatori i vreme | Firestore, vlasnik porodice; podnosilac može pristupiti sopstvenoj prijavi | Bezbednost korisničkog sadržaja, obrada prijave |
| Tehnički podaci mrežne veze/prijave | Firebase/Google kao dobavljač; proveriti aktuelnu dokumentaciju i konfiguraciju | Bezbednost i sprečavanje zloupotrebe; ne tvrditi da email predstavlja svu obradu dobavljača |
| Privatni profili/zdravlje ljubimca, alarmi, Galerija, Uspomene i nacrti | Lokalno, dok korisnik izričito ne izveze/podeli ili izabere osnovni deljeni profil | Organizacija brige i kopije; ne tretirati zdravlje životinje automatski kao zdravstveni profil čoveka |
| Istorijski chat podaci | Raniji server podaci nisu automatski obrisani uklanjanjem funkcije; nova aplikacija ih ne čita/piše | Vlasnik obrađuje proverene zahteve za brisanje; ne navoditi da ranijih podataka nema bez provere |

Android automatski cloud backup i sistemski device-transfer isključeni su u 1.8.17. Ručne kopije i njihov prenos su korisnički izbor. Ranije sistemske kopije nisu automatski obrisane ažuriranjem.

## Unos u Console

- Aplikacija ima dobrovoljnu online obradu podataka i kreiranje naloga: ne birati „nikakvi podaci se ne prikupljaju“ samo zato što je osnovna evidencija lokalna.
- Pregledati Email address, Name, User IDs i Other user-generated content u odnosu na gornju tabelu. Profil životinje i beleška pripadaju sadržaju koji korisnik izričito deli; ne objavljuju se javno.
- Obrada za funkcionalnost aplikacije, upravljanje nalogom i bezbednost. Nema aktivnog oglasnog/analitičkog SDK-a, prodaje podataka ili personalizacije oglasa u implementiranom izdanju.
- Za „shared“ odvojeno primeniti Google definiciju i izuzetke za obradu dobavljača/uslugu i korisnički pokrenuto deljenje; ne obećavati univerzalan odgovor bez pregleda stvarnog pružaoca i konfiguracije.
- Prenos online funkcija koristi HTTPS/TLS. Ne tvrditi end-to-end enkripciju; lokalne i izvezene kopije nisu šifrovane ovom aplikacijom.
- Prikupljanje za porodicu je opciono; lokalna evidencija radi bez naloga. Podrška obrađuje zahtev za brisanje uz potvrdu vlasništva. Vlasnik mora ispuniti stvarni postupak, uključujući povezane zapise; samo brisanje Auth UID-a nije dovoljno.
- Javna stranica: https://jalejasko011-tech.github.io/Pet-Care/www/delete-account.html ; privatnost: https://jalejasko011-tech.github.io/Pet-Care/www/privacy.html . URL-ove proveriti nakon objave 1.8.17.

Firebase JS Auth/Firestore SDK učitava se tek pri izričitom porodičnom povezivanju. Android paket ima native push bridge, ali registracija tokena i automatsko prikupljanje su isključeni. Android SDK dokumentacija ne sme se bez razlike predstaviti kao potpuna JS SDK deklaracija; završno uporediti konkretne biblioteke i pružaočeve tehničke podatke.

## Izvori, provereni 24. oktobra 2026.

- https://support.google.com/googleplay/android-developer/answer/10787469?hl=en
- https://support.google.com/googleplay/android-developer/answer/13327111?hl=en
- https://firebase.google.com/docs/android/play-data-disclosure
