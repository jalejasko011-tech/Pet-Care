# Završna provera Android izdanja 1.8.17 (28) — 24. oktobar 2026.

Završeno je tehničko sređivanje postojećeg izdanja za sledeću fazu stvarnih testova. Nije završena registracija/deklaracija u Play Console niti Google pregled. Ne obećavati nula svih mogućih grešaka na svim uređajima ili potvrdu svih starosnih grupa.

## Ispravljeno u ovom pregledu

- Brisanje ljubimca više ne uklanja medije pre uspešnog čuvanja evidencije. Jedan tok obuhvata sve povezane kolekcije, dovršene rutine preko reminderId, Galeriju, Uspomene i nacrte. Durable lokalni zapis nastavlja prekinuto čišćenje; drugi ljubimci i njihovi mediji ostaju. Puna memorija ne prikazuje lažan uspeh.
- Gallery transakcija se prekida i poništava ranije upise ako callback baci grešku; abort je obrađen.
- Istaknuti zahtev za brisanje naloga i povezanih podataka u Podešavanjima, Porodičnoj brizi i prijavi. Javna stranica radi bez prijave. Stara moderatorska prečica uklonjena.
- Porodični ID vraća postojeće članstvo istom potvrđenom nalogu posle gubitka lokalnih veza. ID ne prima novog člana; server proverava postojeću ulogu. Validni pozivni kodovi ostaju put za nove članove.
- Prijava postojećim nalogom ne nameće dužinu nove lozinke. Kreiranje novog naloga i dalje traži najmanje 12 znakova.
- Pripremljeni Functions paket ažurira body-parser na 2.4.0 za GHSA-27r3-jxmh-p828. Nije raspoređen ili aktiviran.
- Android automatski cloud backup i device-transfer su isključeni; ručni ZIP izvoz i porodični oporavak ostaju. Ranije sistemske kopije nisu obrisane ažuriranjem.
- Dokumentacija za Play konsolidovana bez zastarelih zahteva za javnog moderatora. Pripremljeni stvarni test-plan, zahtevi za brisanje, podaci za Console i objašnjenje signing/upload ključa pri prelasku sa direktnog APK-a na Play.

## Objavljen izvor i provere

- GitHub PR #32, izvor izdanja `afa05ba56ecebaf1057b9f7cc4b043bbab694670`.
- PR kvalitet `40084746436`: validate, chat-rules i android-smoke uspešni.
- Kvalitet istog objavljenog izvora `40085323707`: sva tri posla uspešna.
- Potpisivanje/objavljivanje `40085323721`: release i publish uspešni; tag `v1.8.17` pokazuje isti izvor.
- Pages `40085323476`: uspešno; osam ključnih javnih fajlova HTTP 200 i byte-exact poređenje, uključujući account-deletion resurs, oporavak porodice i lokalno brisanje.
- Browser: 27 sekcija sa/bez ljubimaca, lokalno čuvanje, pogrešni/veliki uvozi, oporavak posle pune memorije i prekida brisanja, očuvanje drugog profila/medija, blokiranje kopije tokom nedovršenog čišćenja, galerijska transakcija i dostupnost zahteva za brisanje.
- 24 jezika: prikaz na uskim ekranima, RTL, očuvanje obrazaca i stabilne vrednosti vrsta/rasa. Ovo je funkcionalni test, ne ljudska lektura svih prevoda; noviji porodični tekstovi imaju SR/EN i engleski fallback.
- Firebase emulator: nečlan/anonimni/moderator ne mogu koristiti penzionisani chat; tri potvrđena naloga dele porodicu, prijavljuju/blokiraju, opozivaju kodove i brišu grupu. Oporavak sopstvenog članstva uspeva, oporavak tuđe porodice se odbija.
- Android 36 emulator: instalacija, Back, offline i native ZIP povratak, privatne uspomene, unos datuma/vremena, zakazivanje/zvuk i dostava alarma posle ubijenog procesa i stvarnog restarta/Doze. Dva stvarna emulator snimka (home/settings) pregledana su i vizuelno. Fizički alarm posle restarta vlasnik je već potvrdio 23. oktobra; ne izmišljati model ili izmereno kašnjenje.

## Nezavisna provera potpisanih paketa

- Paket `com.petcare.companion`, 1.8.17 (28), min API 23, target API 36.
- APK v2 potpis i sadržaj kriptografski provereni. AAB JAR potpis i svih 547 potpisanih sadržaja provereni. Svih 41 korisnih web fajlova u oba paketa odgovara izvoru.
- Postojeći cert SHA256 `e8cdb78355aa5a08d5327dd07c050b92168e8afef6c4aa2d3c8c7f25c5736990`, važi do 2. marta 2054. Novi direktni APK može ažurirati prethodni istim potpisom. Play delivery ključ bira se zasebno; upload cert nije dovoljan dokaz takve nadogradnje.
- Compiled manifest: allowBackup=false, fullBackupContent=false, dataExtractionRules referenca; izvezeno je pet cloud i pet device-transfer isključenja.
- Nema AD_ID, SMS/kontakta, precizne lokacije, READ_MEDIA_IMAGES/VIDEO, QUERY_ALL_PACKAGES ili REQUEST_INSTALL_PACKAGES dozvole. Nema privatnog keystore fajla u paketu.
- Nema upakovanih native .so biblioteka; nema njihove ELF kompatibilnosti za 16 KB stranice koju bi trebalo popravljati. Ovo nije potvrda svih mogućih Play pre-launch nalaza.

- `Pet-Care-World-1.8.17.apk`: 9050462 bajtova, SHA256 `fe68ac2dbe1db8b1cc1a24964fcc72ebbcb9d3b61d9c3788b1fb6997dedd7c09`.
- `Pet-Care-World-1.8.17.aab`: 8687467 bajtova, SHA256 `d87cc1de2cfb88f447cfe162003b18a8c9afd88e2f120b945098201037d719a9`.

## Zavisnosti — opseg zaključka

CI audit produkcijskih root i Functions zavisnosti prolazi bez prijavljenih ranjivosti. Dodatni odvojeni npm audit univerzalnog `firebase@12.4.0` paketa prijavljuje četiri izvedena high nalaza kroz Node-only `@grpc/grpc-js` i njegove server getAuthContext/error-handler putanje. Taj zaseban npm paket nije Android/browser distribucija koja se učitava u aplikaciji; ne navoditi njegov rezultat kao „0“.

Procena primenljivosti: direktno pregledan vendorov browser Firestore bundle `https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js` (SHA256 `4a95db389e17d90aea274793a031528ca0b2101d75c05413b530821cf0e8d067`) sadrži WebChannel transport, ne sadrži Node gRPC modul, http2/node import ili getAuthContext, i spoljno uvozi samo odgovarajući firebase-app browser modul. Ovi nalazi ne pokazuju ranjivu gRPC server putanju u objavljenom WebView kodu. Node emulatorski test nije javni Node server; Functions zavisnosti imaju zaseban uspešan audit. Ako se univerzalni Node Firestore paket kasnije koristi za produkcijski server, prethodno ažurirati njegov gRPC lanac i ponoviti proveru. Nije izvršeno naslepo npm audit fix --force vraćanje na stari Firebase 9.

Izvori: https://github.com/grpc/grpc-node/security/advisories/GHSA-m9gg-hp2v-232j ; https://github.com/grpc/grpc-node/security/advisories/GHSA-f596-whhp-79r4 ; https://github.com/advisories/GHSA-27r3-jxmh-p828

## Šta nije predstavljeno kao završeno

- Produkcijski Firebase: korisnikova slika od 23. oktobra u 19:51 potvrđuje novu aktivnu reviziju i vidljive no-chat zabrane. Ceo aktivni tekst i prijavljeni live porodični tok nisu neposredno upoređeni/provereni. Pravila nisu menjana u 1.8.17, nova objava rules-a nije potrebna za uvedene funkcije. Nije uključen Blaze ili plaćeni servis.
- Stvaran Play Console nalog, identitet, ugovor i naknada, reviewer pristup, konačne starosne grupe, Data Safety/IARC/Health deklaracije, stvarni testeri i Google odobrenje.
- Operativni zahtev za brisanje naloga: resurs je dostupan i testiran, ali vlasnik mora stvarno obraditi potvrđeni zahtev i povezane server podatke. Automatsko brisanje svih admin kolekcija nije aktivirano.

Dalji rad ide po `ACCEPTANCE_1_8_17_SR.md`, `PLAY_STORE_RELEASE_CHECKLIST.md`, `PLAY_CONSOLE_ANSWERS_1_8_17_SR.md` i `OWNER_ACCOUNT_DELETION_SR.md`. Test-only ispravka poruke o modelu telefona i dokumenti posle izdanja ne menjaju objavljeni web/APK/AAB kod.
