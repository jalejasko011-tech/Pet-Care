# Automatska moderacija teksta — priprema 23. oktobra 2026.

Status: implementacija i lokalni testovi; produkcijska aktivacija čeka Blaze obračun i stvarni moderatorski nalog. Aktivna pravila nisu promenjena. Automatska moderacija nije uključena ni u izdanju 1.8.15. Ovo nije završena Play objava.

## Šta je dodato

- Dve Firebase callable funkcije u europe-west1. Pristup traži potvrđen email/password identitet; autor i nadimak dolaze iz serverski proverenog profila. Banned profil ne može da šalje.
- Serverski SR/EN filter obrazaca proverava i tekst i nadimak: uvrede/pretnje, deo maskiranih izraza, spam, linkove, kontakt podatke i odabrane rizike pisma/formatiranja. Zadržane poruke nikada se ne upisuju u javnu kolekciju. Nema automatske trajne zabrane naloga.
- Ovo nije AI model, potpuna jezička pokrivenost niti garancija bezbednog sadržaja. Obični tekst bez prepoznatog obrasca objavljuje se automatski. Ljudske prijave, žalbe i odgovorni moderator ostaju potrebni. Porodični privatni dnevnik nije predmet ovog javnog filtera; njegove postojeće prijave/blokiranje ostaju.
- Kandidatska pravila zabranjuju svaki klijentski create javne poruke, uključujući moderatora, i klijentske izmene rezultata provere. Admin servis jedini objavljuje.
- Atomsko ograničenje: 5 sekundi između pokušaja i 60 novih predaja na sat po UID-u. Isto ponovljeno slanje u minutu zadržava se. Ključ zahteva sprečava duple poruke pri ponavljanju posle prekida veze. Ograničenje opstaje posle brisanja chat profila; novi nalozi imaju novi UID.
- Korisnik dobija tačan status, čuva nacrt pri grešci, može da pregleda i briše svoje predaje uz strane od najviše 100 zapisa i kontaktira podršku za žalbu. Neuspeh funkcije nema rezervni direktni upis.
- Moderator vidi najviše 100 zadržanih poruka odjednom; obrađene nestaju iz reda pa naredno osvežavanje prikazuje ostale. Odobravanje/odbijanje proverava trenutnu serversku ulogu i stanje autora, atomskom radnjom beleži privatnu neizmenjivu evidenciju. Odbijena poruka se ne objavljuje.
- Nema posebnog AI provajdera ili AI API ključa. Mediji/push se ne uključuju. Postojeća javna istorija nije retroaktivno skenirana.

## Podaci i brisanje

`chatSubmissions` sadrži autora, nadimak, tekst, vreme, status, razloge i verziju filtera; odluka moderatora dodaje njegov ID i vreme. Autor vidi samo svoje predaje, moderator ceo red. Autor može obrisati predaju. Brisanje sopstvene javne poruke briše i njenu predaju, a potpuno brisanje chat profila briše sve njegove predaje uz javne poruke. Podrška pri potpunom brisanju naloga mora obraditi i ovu kolekciju. Moderatorska evidencija se zadržava za obradu zloupotreba i pregled zahteva za brisanje.

`chatModerationLimits/UID` je samo serverski zapis vremena, sažetka poslednjeg teksta i brojanja u tekućem satu, bez originalnog teksta. Za zahtev za brisanje naloga podrška pregleda i taj zapis. Politika chata opisuje novu obradu i jasno kaže da aktivacija čeka. Stvarni Data safety odgovori moraju odgovarati aktiviranom izdanju.

## Provere

Lokalno prolaze policy/client testovi, učitavanje ograničenih Functions v2 izvozâ, web sintaksa/privatnost i npm audit produkcijskih serverskih zavisnosti (0 nalaza). Firestore emulator proverava stvarne transakcije i pravila: privatnost reda, zabranu direktnog objavljivanja, lažne identitete/podatke, zabranu pristupa, ponavljanje, trku pri slanju, odobravanje/odbijanje, brisanje i privatnu evidenciju.

Potpuna CI provera 39963227505 prošla je za ovu moderaciju, uključujući stvarni mobilni moderatorski ekran preko lokalnog callable adaptera sa proverenim emulator tokenima, postojeće browser/Android/Firebase regresije i restart emulatora. Predlog je usklađen sa ispravkama lokalne evidencije iz 1.8.15; nova zajednička CI provera prati ovu reviziju. Lokalni browser testovi nisu mogli da krenu jer Chromium nije instaliran, a preuzimanje je vraćalo neispravnu ZIP arhivu; to nije označeno kao prolaz. Živi callable transport i stvarni nalog proveravaju se posle aktivacije.

## Konkretna aktivacija posle odluke vlasnika o obračunu

Firebase zahteva Blaze plan za produkcijske Cloud Functions. Spark nije dovoljan. To je obračun po potrošnji odvojen od Play registracije. maxInstances=2, minInstances=0, concurrency=1 i timeout=30s ograničavaju kapacitet, ali **nisu novčani plafon**. Pre uključivanja vlasnik podešava budžetska upozorenja i proverava obračun; upozorenje samo po sebi ne zaustavlja trošak. Novi nalog može zaobići per-UID limit, pa se promet i zloupotrebe moraju pratiti.

1. Vlasnik odobrava/aktivira Blaze i pravi/potvrđuje stvarni moderatorski nalog. Administrator dodeljuje samo njegovu ulogu; ne anonimnom nalogu.
2. Iz prijavljenog administratorskog okruženja objaviti **samo** ove dve funkcije, bez starih medija/push okidača:

   `firebase deploy --project pet-care-world --config firebase.auto-moderation.json --only functions:submitChatMessage,functions:reviewChatSubmission`

3. Proveriti endpoint sa pravim potvrđenim probnim identitetom, predaju obične i zadržane poruke, moderatora, odbijanje/odobravanje i evidenciju. Preostaloj javnoj istoriji potreban je zaseban pregled; filter važi za nove predaje.
4. Objaviti kandidatska pravila tačnim config-om, bez korenskog preview-a:

   `firebase deploy --project pet-care-world --config firebase.auto-moderation.json --only firestore:rules`

5. Promeniti `www/chat-config.js` moderation.enabled u true, objaviti isti klijent i pripremiti potpisano Android ažuriranje. Stari klijenti od koraka 4 neće moći da šalju; ne otvarati direktne upise radi kompatibilnosti. Proveriti u prozoru održavanja i odmah dostaviti ažuriranje. Uvećati verziju/cache novog izdanja pri njegovoj izradi.
6. Proveriti stvarni novi APK, mrežni prekid/ponavljanje, direktan neovlašćen upis, privatnost zadržanog sadržaja, moderaciju, žalbu i potpuno brisanje. Tek tada ažurirati ACTIVE_RULES i Play nalaz kao aktivno.

Izvori: https://firebase.google.com/docs/functions/get-started ; https://firebase.google.com/docs/functions/callable ; https://firebase.google.com/docs/functions/manage-functions ; https://support.google.com/googleplay/android-developer/answer/9876937
