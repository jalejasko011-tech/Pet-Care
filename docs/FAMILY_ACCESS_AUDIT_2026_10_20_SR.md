# Provera pre registracije — razvojna grana, 20. oktobar 2026.

Ovo nisu potvrda spremnosti za Play niti izmene već instaliranog APK-a 1.8.3.
Ne spajati ovu granu u main dok nove browser/Android provere nisu uspešne.

## Pronađeno i popravljeno u ovoj grani

- Samo chat checkbox 18+ nije odvajao decu od internet usluga. Novi početni
  prikaz je lokalni režim za čitanje profila i uspomena uz roditelja. Ne postoji
  automatski ulazak u odrasli deo na osnovu stare chat saglasnosti.
- Povezan katalog je slao zahteve na pokretanju. Ograničen režim sada blokira
  katalog pre fetch-a, Firebase uvoz/prijavu i registraciju push tokena. CSP
  zabranjuje udaljene slike, medije, skripte i konekcije u ograničenom prikazu.
- Roditeljski deo traži nepripremljeno polje uzrasta pri postavljanju i privatni
  PIN od 6–12 cifara sa potvrdom; čuva samo nasumičnu so i PBKDF2 SHA-256
  verifikator (210.000 iteracija). Uzrast se ne čuva i ne šalje. Pet grešaka
  uvodi čekanje od pet minuta. PIN nije provera pravnog identiteta.
- Roditelj zaključava pre predaje telefona; sesija najduže 30 minuta, ne prenosi
  se rezervnom kopijom. Novi proces/prozor bez sesije ostaje ograničen.
- U dečjem prikazu nema uređivanja terapija, kontakata, deljenja, kupovine,
  spoljnog AI-ja, javnog chata, niti dugmeta za uklanjanje PIN-a. Privatni
  sadržaj koji roditelj unese i dalje mora roditelj da pregleda za dete.
- Poruke roditeljske zaštite imaju 24 jezičke varijante. Jezička revizija
  izvornih govornika i dalje nije završena.
- Upis evidencije je prijavljivao uspeh i kada je skladište bilo puno. Sada
  neuspeh vraća poslednje sačuvane zapise i zaustavlja nastavak obrasca i
  zakazivanje obaveštenja; popunjen obrazac ostaje za ponovni pokušaj.
- Podešen dir=auto za korisnički tekst i sprečeno lomljenje glavne navigacije
  unutar reči. Veoma dugi nazivi imaju skraćen vizuelni prikaz.

## Provere

Dodati su stvarni browser tokovi za sva 24 jezika, odbijanje maloletnog unosa,
PIN, neprenošenje autorizacije kopijom, ponovno pokretanje/prozor/istek sesije,
privatne uspomene, odsustvo udaljenih zahteva i neuspeh usled pune memorije.
Postojeći testovi prolaze kroz stvarno roditeljsko otključavanje; produkcija
nema testni prekidač. Rezultat CI-a gledati na PR-u, ne pretpostavljati prolaz.

## Preostalo pre javne objave

1. Završiti sve CI i Android provere ove grane, fizički Honor test, pregled
   pedagoške primerenosti najmlađima i svih prevoda. Read-only porodični prikaz
   nije sam po sebi potvrda ispunjenja Google Families uslova.
2. Aktivirati i proveriti stvarnu moderaciju (Jale, verifikovan moderatorski
   nalog, server uloga, produkciona pravila, dve korisničke sesije). Bez toga
   ne predstavljati javni chat kao operativno moderiran.
3. Uskladiti objavljene politike, Data safety, sadržaj/IARC i sve uzrasne grupe
   sa konačnim proverenim APK/AAB-om. Stari Play odgovori 1.8.3 nisu konačni
   odgovori novog porodičnog izdanja.
4. Registrovati lični Play nalog i proći proveru vlasnika/uređaja; naknada je
   jednokratno 25 USD (iznos konverzije prikazuje Google/banka), ne 25 EUR.
5. Stvarni zatvoreni test: najmanje 12 prijavljenih testera 14 uzastopnih dana,
   pa zahtev za produkcioni pristup. Uplata ne zamenjuje ove korake.

Cloud Billing/Blaze, Storage, plaćene Functions i serverski push nisu uključeni.
