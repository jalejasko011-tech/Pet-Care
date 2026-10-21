# Provera pre registracije — 20. oktobar 2026.

Pregledan izvor: glavni ogranak na `94d98bb9791654b6131813e38b8f839d31ca1883`.
Ove ispravke ne menjaju postojeći potpisani APK/AAB 1.8.3. Novi paket se mora
izgraditi iz prihvaćenih izmena i posebno proveriti.

## Otkriveno i ispravljeno

- Ranije zapamćen URL kataloga izazivao je automatski spoljni zahtev pri
  pokretanju i periodično. Učitavanje sada zahteva izričitu radnju povezivanja
  dobavljača ili osvežavanja. Politika privatnosti opisuje novo ponašanje.
- Zatvaranje chata dok se SDK/autentikacija/profil učitavaju nije zaustavljalo
  naredne korake. Provera aktivnog pokušaja sada prethodi sledećem koraku;
  završetak već poslatog zahteva ne može se opozvati ovom izmenom.
- Sam handler proverava validnost forme i kvačicu pristanka pre SDK-a.
  To nije neutralna provera uzrasta niti završen dečji režim.

## Ponovljiva provera

`node tools/test-startup-privacy.mjs` izvršava stvarni blok kataloga sa već
sačuvanim URL-om i stvarni join handler sa kontrolisanim asinhronim granicama.
Proverava odsustvo automatskih zahteva, eksplicitno osvežavanje, obavezan
pristanak i prekid narednih koraka nakon zatvaranja dijaloga. Dodat je u CI.
Prošli su lokalni web/syntax, reminder reliability, backup codec, push policy i
push client testovi. Ovo su testovi koda sa simuliranim granicama; nisu dokaz
rada Firebase produkcije, fizičkog telefona ili Google odobrenja.

Lokalna puna Functions provera nije izvršena jer nema instaliranog
`firebase-admin`. Novi lokalni browser test nije izvršen: preuzimanje Chromium-a
vratilo je neispravan ZIP. Potpun CI rezultat proveriti na ogranku/PR-u.

## Preostale prepreke javnoj objavi za sve uzraste

1. `FAMILY_MODE_REQUIREMENTS_SR.md` je specifikacija, ne implementacija.
   Nedostaju neutralna provera uzrasta, odgovarajući lokalni prikaz za najmlađe
   i kontrola odrasle osobe nad spoljnim funkcijama. Trenutna chat kvačica 18+
   ovo ne rešava. Politika privatnosti trenutno kaže da aplikacija nije posebno
   namenjena deci; mora se uskladiti sa stvarnim završenim izdanjem.
2. Produkcijska moderatorska uloga i dvouređajni test prijave, blokiranja,
   uklanjanja poruke i zabrane korisnika nisu ovom proverom potvrđeni.
3. Podsetnici na vlasnikovom fizičkom telefonu u zatvorenoj aplikaciji, nakon
   restarta i sa konkretnim sistemskim dozvolama nisu ovom proverom potvrđeni.
4. Završni Data safety, ciljna publika, IARC, provera identiteta i potrebni
   testeri pripadaju Play Console procesu; nisu predati ovom izmenom.

Registracija naloga je odvojena od odobrenja aplikacije. Zvanična jednokratna
naknada je 25 USD, ne fiksnih 25 EUR. Plaćanje ne rešava ove prepreke.

Izvori provereni 20. oktobra 2026:
- https://support.google.com/googleplay/android-developer/answer/6112435?hl=en
- https://support.google.com/googleplay/android-developer/answer/9893335?hl=en
- https://support.google.com/googleplay/android-developer/answer/9867159?hl=en
