# Provera za Play Store — 21. oktobar 2026.

Aktuelno pripremljeno izdanje: 1.8.10 (21), com.petcare.companion, target API 36.
Ovo je nalaz, nije završena registracija, popunjen Console upitnik ili Google odobrenje.

## Šta je pripremljeno

- Postojeći potpis za ažuriranje bez deinstalacije, APK i AAB pipeline.
- Privatna lokalna evidencija, kopije, podsetnici, direktna navigacija i jezici.
- Dobrovoljno povezivanje porodice: potvrđena produkcijska pravila/Auth i tri
  nezavisna probna identiteta u verziji 1.8.8. Bez automatskog slanja privatne istorije.
- Moderatorski alat, prijava/blokiranje javnog chata, politika i opisi podataka.
- Automatizovani browser/Android/Firebase testovi i stvarni emulator snimci za listing.

## Pronađeni i ispravljeni tehnički propust

Prethodna porodična pravila nisu dozvoljavala moderationAudit, a moderatorski alat
upisuje tu evidenciju u istoj atomskoj radnji kao zabranu/brisanje. Takva radnja
se odbijala. production-review-current.rules dodaje samo privatnu, neizmenjivu
evidenciju dozvoljenu nalogu sa serverskom ulogom moderatora. Testovi su prošli i
fajl je objavljen u Firebase konzoli 21. oktobra 2026. u 17:48 po vremenu konzole.
Potvrda: aktivna revizija u Rules, uz poređenje celog teksta sa testiranim fajlom.
Potvrđen stvarni moderatorski nalog i dalje nedostaje. Ne objavljivati širi
korenski preview koji uključuje neaktivirane medije/push.

## Šta sprečava tvrdnju da je javna objava spremna

1. Najmlađi korisnici i društvene funkcije: Porodični prikaz nije roditeljska
   zaštita. Korisnik ga može napustiti jednim dodirom. Checkbox 18+ javnog chata
   ne potvrđuje uzrast ni saglasnost roditelja. Za raniji zahtev da aplikacija
   cilja i decu treba projektovati i proveriti odgovarajuću kontrolu društvenih
   funkcija, postupak odrasle osobe i tačne izjave o ciljnoj publici. Ne birati
   sve uzraste samo zato što aplikacija otvara lokalni ekran bez datuma.
   Anonimni chat ima posebna ograničenja za ciljnu dečju publiku. Zajednički
   porodični tekst je takođe korisnički sadržaj: pregledati adekvatan tok prijave
   i blokiranja za tu vrstu zatvorene grupe. Ova verzija to ne potvrđuje kao završeno.
2. Moderacija: potrebno je potvrditi odraslu odgovornu osobu/nalog i serversku
   ulogu, kao i stvarni rad prijave, uklanjanja i zabrane sa aktivnim pravilima.
   Automatski test sa izmišljenim nalogom nije ljudski moderator.
3. Pravi telefon: potvrditi zakazan podsetnik posle zatvaranja aplikacije,
   ugašenog ekrana i ponovnog pokretanja na korisnikovom uređaju. Emulator nije
   dokaz ponašanja konkretnog HONOR/Huawei uređaja i njegovih podešavanja baterije.
4. Play nalog: registracija, stvarni identitet i jednokratnih 25 USD su radnje
   vlasnika. Cena nije 25 EUR i nije godišnja pretplata. Ne plaćati niti prihvatati
   ugovor u ime vlasnika. Zatim se može pripremiti interni test i uneti stvarne
   izjave o podacima, ciljnoj publici, sadržaju i privatnosti.
5. Ako se primenjuje zahtev za novi lični nalog, za javnu produkciju treba
   najmanje 12 stvarnih kontinuirano prijavljenih testera tokom 14 dana, pa
   zahtev za produkcijski pristup. APK van Play-a i CI ne zamenjuju taj period.

## Provereni primarni izvori

- https://support.google.com/googleplay/android-developer/answer/6112435?hl=en
- https://support.google.com/googleplay/android-developer/answer/14151465?hl=en
- https://support.google.com/googleplay/android-developer/answer/11926878?hl=en
- https://support.google.com/googleplay/android-developer/answer/9893335?hl=en
- https://support.google.com/googleplay/android-developer/answer/9876937?hl=en

Sledeći korak: završiti gore navedene tehničke i publika/moderacija uslove;
registracija i interni test nisu isto što i javna objava. Ne menjati ciljnu
publiku niti isključivati tražene funkcije bez dogovora sa vlasnikom.
