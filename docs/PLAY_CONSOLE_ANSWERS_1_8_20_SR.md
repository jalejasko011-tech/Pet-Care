# Play Console — pripremljeni podaci za 1.8.20

Ovo je priprema za unos i proveru vlasnika. Nije potvrda registracije, sadržaja naloga, odobrene publike ili Google objave.

| Stavka | Pripremljen unos |
| --- | --- |
| Naziv | Pet Care World |
| Paket | com.petcare.companion |
| Izdanje | 1.8.20, versionCode 31, target API 36 |
| Model upotrebe | Besplatna osnovna evidencija; nema aktivne pretplate, naplate ili oglasne mreže |
| Kategorija | Lifestyle / životni stil — proveriti konačan izbor sa vlasnikom |
| Kratak/pun opis EN/SR | store-listing/short-en.txt, short-sr.txt, full-en.txt, full-sr.txt |
| Ikona i feature slika | store-listing/assets/ |
| Kontakt podrške | jalejasko011@gmail.com |
| Privatnost | https://jalejasko011-tech.github.io/Pet-Care/www/privacy.html |
| Brisanje naloga | https://jalejasko011-tech.github.io/Pet-Care/www/delete-account.html |
| Oglasi | Nema aktivnih oglasa u ovom izdanju; buduća monetizacija nije aktivna funkcija |
| Naplata | Nema ugrađene kupovine/pretplate u ovom izdanju |
| Pristup aplikaciji | Osnovna evidencija bez prijave; porodično povezivanje zahteva potvrđen email i lozinku |
| Korisnički sadržaj | Nema javnog chata/feed-a; postoji zatvoreni porodični dnevnik, imena i prijave |

## Uputstvo za pregled aplikacije

1. Aplikacija se otvara bez koda i datuma rođenja. Dodati probnog ljubimca i koristiti lokalne sekcije, medije i podsetnike bez naloga.
2. Porodična briga zahteva odraslu osobu, potvrdu emaila, lozinku i prihvatanje pravila. Pre pregleda vlasnik mora obezbediti stvaran provereni nalog/porodični pristup ili odgovarajuće jasne instrukcije koje Play Console zahteva. Nikakve izmišljene lozinke ili nepostojeća potvrda naloga ne predstavljaju završen reviewer pristup. Akreditive unositi isključivo u namensko bezbedno Console polje.
3. Vlasnik kreira porodicu, pravi kod; drugi potvrđeni nalog pristupa kodom. Postojeći član može vratiti pristup porodičnim ID-em. ID nije javni poziv za novog člana.
4. Prijava/blokiranje/uklanjanje i brisanje porodice nalaze se u porodičnoj sekciji. Podešavanja i prijava imaju jasan link za zahtev za brisanje naloga i podataka.

## Ciljna publika i IARC

Vlasnik je tražio dostupnost i mlađima. Ne menjati taj zahtev prećutno u „samo odrasli“ radi lakše objave. Ne označavati sve uzraste samo zato što osnovni ekran nema datum. Potrebno je pregledati stvarnu primerenost za izabrane grupe, uključujući spoljne pretrage/prodavnice/AI linkove, porodični tekst i ulogu odraslog. Lokalni Porodični prikaz je pojednostavljen prikaz, a ne roditeljska brava. Online povezivanje traži ponovni unos lozinke i potvrđen email; ne tvrditi da to dokazuje uzrast ili roditeljski odnos.

U IARC i sadržaju navesti zatvoreno deljenje korisničkog teksta i spoljne interakcije u skladu sa stvarnim pitanjem. Ne odgovarati da „nema korisničkog sadržaja“ samo zato što je javni chat uklonjen. Konačna ocena dobija se kroz IARC; ne izmišljati PEGI/ESRB oznaku.

## Šta se unosi kasnije

Stvarni Play nalog i identitet, država/distribucija, autentičan pristup za pregled, izabrane starosne grupe, konačna Data Safety prijava, stvarni testeri i rezultati njihovog korišćenja. Google pregled i proizvodni pristup nisu obavljeni automatizovanim CI testovima.

## Ostale Console deklaracije

Pregledati i Health apps declaration prema stvarnim ponuđenim stavkama. Aplikacija vodi evidenciju zdravlja i ishrane životinja, nema Health Connect, ne obrađuje dijagnostičke senzore i ne daje dijagnozu ili doziranje terapije. Ne označavati automatski kategorije za ljudsko zdravlje ili „nema zdravstvenih funkcija“ bez odgovarajućeg pregleda pitanja i opisa namene. Ovo je organizator za ljubimce i ne zamenjuje veterinara.

## Potpisivanje i prelazak sa direktnog APK-a na Play

Postojeći sertifikat direktnog APK-a je SHA256 `e8cdb78355aa5a08d5327dd07c050b92168e8afef6c4aa2d3c8c7f25c5736990`. Novi APK je proveren istim potpisom i može da ažurira prethodni direktni APK bez deinstalacije.

Pri prvom Play App Signing podešavanju pregledati izbor app signing key-a. Ako je potrebno da se postojeća direktna instalacija ažurira Play izdanjem bez deinstalacije, app signing key koji Play koristi za dostavu mora odgovarati postojećem sertifikatu ili podržanoj rotaciji; upload key sam po sebi nije dovoljan. Ne potvrđivati izbor novog Google-generated app signing key-a uz obećanje nastavka direktnih instalacija istim potpisom.

Za korišćenje postojećeg ključa pratiti namenski Play postupak za bezbedan šifrovan izvoz/PEPK iz vlasnikovog originalnog keystore-a. Privatni ključ i lozinke ne objavljivati u repozitorijumu, opisu ili razgovoru. Ne izvoziti ključ pre stvarnog Console zahteva i provere tačnog projekta. Ako se ipak koristi drugi delivery ključ, unapred planirati ručnu kopiju/prenos i jasno obavestiti korisnika o ograničenju nadogradnje. Pre deinstalacije sačuvati ZIP izvan podataka aplikacije.

Izvor: https://support.google.com/googleplay/android-developer/answer/9842756?hl=en

## Provera Firebase konzole — 26. oktobar 2026.

Potvrđen je direktan pristup projektu. Ceo tekst aktivnih pravila od 23.10 u 19:51 kopiran je iz Rules editora. Posle uklanjanja isključivo završnih praznina i dodavanja jednog završnog novog reda, SHA-256 je `fc18d041949e36917f2b03474dfa65c67c5d0736edc1095fc3f502aa780097d7`, jednak testiranom `firebase/production-no-public-chat.rules`. Nije bilo potrebe za ponovnom objavom pravila.

Email/Password je uključen, passwordless email-link isključen, email enumeration zaštita uključena. Serverska politika je usklađena na minimum 12 znakova, Require enforcement; Force upgrade on sign-in ostaje isključen. Stari korisnici nisu naterani na promenu pri prijavi. Anonymous provajder ostaje uključen za istorijske identitete; nova aplikacija ne poziva anonimnu prijavu, a pravila porodice zahtevaju potvrđen email/password i chat ostaje zatvoren. Nalozi i istorijski podaci nisu brisani.

Spark / No cost ($0/month) potvrđen je u konzoli. Storage ekran traži nadogradnju na Blaze; nadogradnja nije pokrenuta. Ne obećavati aktivno serversko skladištenje medija ili push.

Osam produkcijskih kolekcija odbija neprijavljeni REST pristup sa 403 PERMISSION_DENIED. Rules playground vraća Simulated read denied za globalMessages uz simulirani potvrđeni password identitet. Ovo nisu realni korisnički podaci, niti dokaz da su dva prava telefona povezana. Taj prihvatni test ostaje u PRODUCTION_FAMILY_ACCEPTANCE_1_8_20_SR.md.
