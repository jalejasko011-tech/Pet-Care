# Zajednički ljubimac — porodični pozivni kod

Verzija 1.8.8 (19) aktivira deljenje profila i dnevnika preko Firebase-a.
Produkcijska pravila i Anonymous Authentication su provereni u vlasnikovoj
konzoli 21. oktobra 2026. Ceo objavljeni kod odgovara fajlu
`firebase/production-family-candidate.rules`; stara chat pravila su sačuvana.
Tri nezavisna pregledačka identiteta uspešno su proverena na stvarnom serveru:
https://github.com/jalejasko011-tech/Pet-Care/actions/runs/39614002015
Ovo nije test tri fizička telefona. Ulaz u lokalnu aplikaciju ostaje bez koda,
datuma i naloga; porodični kod služi samo dobrovoljnom povezivanju.

## Kako povezati telefone

1. Na prvom telefonu dodajte/izaberite ljubimca i otvorite Porodica.
2. Izaberite Poveži porodičnu brigu, unesite svoje ime i naziv porodice,
   napravite zajednički profil i potvrdite deljenje osnovnih podataka.
3. Izaberite Napravi porodični kod i pošaljite kod samo svojim članovima.
4. Na ostalim telefonima sa verzijom 1.8.8 ili novijom otvorite Porodica,
   povežite brigu, unesite svoje ime i isti kod pa izaberite Poveži se sa ljubimcem.
5. Novi zapisi u zajedničkom dnevniku vidljivi su povezanim članovima.

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

## Objavljena konfiguracija i preostala provera

- Aktivni produkcijski fajl je **firebase/production-family-candidate.rules**.
  Ne objavljivati širi korenski `firestore.rules`: on priprema i medije/push koji
  još nisu aktivirani. Sačuvan povratak je
  `firebase/production-chat-baseline-2026-10-21.rules`.
- Nisu uključeni Functions, Storage, Blaze niti naplata.
- Live provera je potvrdila paralelan ulaz dva člana istim kodom, dnevnik u oba
  smera, izmenu profila, ponovno povezivanje, izolaciju druge porodice, uklanjanje,
  opoziv koda i potpuno brisanje probnih porodica. Probni anonimni identiteti su
  obrisani; postojeći korisnički podaci nisu menjani.
- Politika privatnosti i nacrt Data Safety su ažurirani za opcione podatke.
  Nacrt nije potvrda da je upitnik poslat Google-u.
- Na fizičkim telefonima proveriti povezivanje u novom APK-u, povratak nakon
  zatvaranja i prijem lokalnih podsetnika. Ovo se ne može potvrditi simulatorom.

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
