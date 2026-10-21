# Zajednički ljubimac — porodični pozivni kod

Ova grana priprema stvarno deljenje profila i dnevnika preko Firebase-a.
Produkcijsko povezivanje još nije aktivno: `PETCARE_FAMILY_CONFIG.enabled` je
`false`. Bez objavljenih pravila i provere stvarnih telefona ne prikazivati
funkciju kao gotovu. Ulaz u lokalnu aplikaciju ostaje bez koda, datuma i naloga.

## Ponašanje

- U Porodici vlasnik bira lokalnog ljubimca, svoje ime i naziv porodice, pa
  izričito potvrđuje slanje njegovog osnovnog profila na server. Privatne slike,
  postojeća zdravstvena evidencija, troškovi i ostali lokalni zapisi se ne šalju.
- Isti kod povezuje više članova na isti zajednički profil i novi dnevnik brige.
  Kod ima 16 nasumičnih znakova, prikazanih u četiri grupe. Na serveru je samo
  SHA-256 otisak. Važi najviše 24 sata i za do 10 novih članova. Za nove pozive
  vlasnik može napraviti novi kod. Kod ne otključava glavni ekran aplikacije.
- Članovi vide zajedničke obroke, šetnje, lekove/tretmane i beleške u realnom
  vremenu dok su povezani. Ovo nije automatsko spajanje privatnih istorija,
  sinhronizacija lokalnih alarma ili deljenje fotografija.
- Samo vlasnik menja zajednički profil, pravi/opoziva pozivnice i uklanja druge
  članove. Uklanjanje člana opoziva pozivnicu kojom je ušao; već povezani ostali
  članovi ostaju članovi. Član može da ode i da obriše svoje zapise. Vlasnik
  može da obriše bilo koji zapis.
- „Obriši porodicu sa servera“ prvo zaustavlja nova pridruživanja i upise, pa
  briše dnevnik, članstva, pozivnice i porodicu. Prekinuto brisanje vlasnik može
  da nastavi. Lokalni izvorni profil se ne briše.
- Nema pozadinskog SDK-a ili slanja pri pokretanju. Korisnik izričito bira
  povezivanje. Porodični prikaz prekida slušaoce. Identitet je zaseban od javnog
  chata i vezan je za Firebase anonimnu prijavu ovog uređaja. Brisanje podataka
  aplikacije/identiteta može izgubiti pristup vlasnika; kod nije rezervna kopija
  identiteta. Ne obećavati oporavak naloga između uređaja u ovoj verziji.

## Aktivacija koju treba završiti

1. Povezati vlasnički Firebase nalog i potvrditi projekat `pet-care-world`,
   bazu, stanje Anonymous Authentication i postojeća produkcijska pravila.
2. Pregledati promenu **korenskog** `firestore.rules` (to je putanja iz
   `firebase.json`). Ne objavljivati stari `firebase/firestore.rules` koji nije
   aktivna konfiguracija ovog projekta. Sačuvati prethodnu verziju pravila.
3. Pokrenuti CI sa emulatorima; objaviti pregledana pravila samo za Firestore.
   Ova promena ne traži uključivanje Functions, Storage, Blaze ili naplate.
   Firestore/Auth kvote i stvarno stanje projekta proverava vlasnik.
4. Testirati vlasnika i najmanje dva člana na stvarnim uređajima: isti kod,
   zajednički profil, novi zapis u oba smera, ponovno povezivanje, opoziv koda,
   uklanjanje člana, istekao/potrošen kod, izolacija druge porodice, brisanje.
5. Ažurirati politiku privatnosti, tačne Data Safety odgovore i prevode za
   stvarno aktiviranu verziju. Tek zatim uključiti zastavicu i napraviti novo
   potpisano izdanje. Trenutni PR ne menja javne izjave u tvrdnju da deljenje radi.

## Automatske provere

`tools/test-shared-family-rules.mjs`: atomsko stvaranje porodice i vlasničkog
članstva, konkurentno pridruživanje istim kodom, privatnost, izmena uloga,
lažni autor, uklanjanje, opoziv, istek, ograničenje i brisanje.

`tools/test-shared-family-browser.mjs`: tri odvojena konteksta, stvarni
Auth/Firestore emulatori, prijem zajedničkog dnevnika, bez izvršavanja HTML-a,
opoziv pozivnice, uklanjanje člana i brisanje porodice. To nije produkcijski dokaz.

Firebase primarni izvori:
https://firebase.google.com/docs/firestore/manage-data/transactions
https://firebase.google.com/docs/reference/rules/rules.firestore
