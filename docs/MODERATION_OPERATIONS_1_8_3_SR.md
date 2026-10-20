# Moderacija javnog chata — postupak aktivacije

Odgovorna osoba: Jale, po izboru vlasnika od 20. oktobra 2026. Javni chat: 18+. Sama aplikacija se priprema i za mlađe; tačne ciljne grupe čekaju prilagođavanje.
Status: alat i postupak pripremljeni; stvarni moderatorski UID i ovlašćenje nisu
potvrđeni. Ovaj dokument sam po sebi ne aktivira moderaciju.

## Pripremljeno i provereno

U izdanju 1.8.3 postoje prihvatanje pravila, prijava poruke, blokiranje autora,
brisanje sopstvenih poruka/identiteta i moderatorski ekran. Testovi sa izolovanim
Firebase emulatorima potvrđuju odbijanje običnog naloga, čitanje prijava od strane
moderatora, zabranu/uklanjanje zabrane, uklanjanje poruke i evidenciju radnji.
Izvor: quality run 39430220493 za commit
`551f2d323810cdeef4488864d1018195173d6890`.

Prijava i blokiranje su alati; za javnu objavu potrebni su stvarno ovlašćen nalog
i redovna obrada prijava. To nije dokaz već uspostavljene službe niti Google
odobrenja. Ne objavljivati tvrdnju da je chat bezbedan za decu.

## Prvi korak na vlasnikovom uređaju

1. Otvori https://jalejasko011-tech.github.io/Pet-Care/www/moderator.html.
2. Izaberi SR. Napravi poseban nalog za moderaciju dugmetom „Napravi nalog za
   odobrenje“, ili se prijavi ako taj nalog već postoji.
3. Potvrdi email preko poruke koju Firebase pošalje. Na ekranu za odobrenje
   pročitaj Firebase UID. UID se može dostaviti za identifikaciju naloga;
   ne slati lozinku, pristupni token, karticu ni kod za prijavu.
4. Potrebno je da vlasnik projekta uporedi UID sa potvrđenim nalogom u Firebase
   Authentication pre dodele uloge. Isto ime ili vlasništvo nad Play nalogom nisu
   zamena za tu proveru.

## Dodela uloge uz vlasnički pristup

Alat `tools/grant-moderator.mjs` koristi Application Default Credentials i dodeljuje
server-side `moderator:true` samo email-potvrđenom nalogu. Izvršava ga verifikovani
vlasnik u svom prijavljenom okruženju, tek posle provere tačnog UID-a. Ne koristiti
izmišljeni UID, ne ugrađivati ključeve u aplikaciju i ne slati service-account JSON
u razgovor. Ne dodeljivati administratorske IAM uloge običnom učesniku chata.

Posle dodele moderator se odjavljuje/prijavljuje, otvara prijave i potvrđuje da
običan učesnik to ne može. Proveriti i koja Firestore pravila su stvarno postavljena;
prolazak emulatora ne potvrđuje produkcijsko postavljanje. Naplata Blaze/Storage i
slike/video nisu potrebni za moderaciju postojećeg tekstualnog chata.

## Operativni dogovor pre javnog testa

Jale treba da uspostavi svakodnevni pregled reda i kanala podrške. Ne obećavati
24/7 dostupnost niti rok odgovora koji nije obezbeđen. Ako nema pokrivanja reda,
ne širiti javni test chata dok vlasnik ne obezbedi zamenu ili novu konfiguraciju.

Za svaku prijavu proveriti poruku i kontekst, bezbedno ukloniti sadržaj koji krši
pravila, po potrebi zabraniti identitet, zatim označiti prijavu obrađenom. Za spam
primeniti srazmernu meru; za pretnje, eksploataciju, privatne podatke i drugi
ozbiljan sadržaj postupiti prioritetno i prema primenljivim obavezama. Ne kopirati
osetljiv sadržaj u javni chat, testne izveštaje ili ovaj repozitorijum.

Red prikazuje do 100 prijava. Nakon obrade osvežavati dok se ne pregleda zaostali
red. Pregledati audit radnje i odjavljivati se sa deljenih uređaja. Anonimna zabrana
važi za identitet i može se zaobići novim identitetom; ne obećavati trajnu zabranu
osobe ili uređaja.

Pre predaje vlasnik određuje i dokumentuje minimalnu opravdanu politiku čuvanja
prijava i audit podataka. Ne označavati da se sve odmah briše: audit je u postojećim
pravilima neizmenjiv za klijenta. Administrativno čišćenje, zakonski izuzeci i
dobavljačke kopije nisu provereni ovim postupkom.

## Stvarni završni test — još nije izvršen

Dva saglasna odrasla testera koriste sopstvene uređaje. Pošalju bezazlenu označenu
test poruku, prijave je kao TEST, provere blokiranje i obradu na Jaletovom nalogu.
Proveriti uklanjanje, zabranu, vraćanje pristupa i brisanje test identiteta. Ne
koristiti stvarne uvrede, lične podatke ili nezakonite materijale za test.

| Dokaz | Status |
| --- | --- |
| Potvrđen email i UID moderatora | Čeka |
| Dodeljena server-side uloga | Čeka |
| Produkcijska pravila proverena | Čeka |
| Dva uređaja: prijava, blok, uklanjanje, zabrana | Čeka |
| Redovan pregled i pravilo čuvanja uspostavljeni | Čeka |

Zvanično pravilo za korisnički sadržaj:
https://support.google.com/googleplay/android-developer/answer/9876937?hl=en
