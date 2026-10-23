# Potvrde izdanja 1.8.15 (26) — 23. oktobar 2026.

Aplikacija: Pet Care World, `com.petcare.companion`, target API 36. Ovo je završena tehnička provera i objava preuzimanja; nije Play registracija, popunjen Console upitnik ili Google odobrenje.

## Izvor i provere

- Ispravke iz PR 30 spojene su u `ea73382b02f8764f023bb9b1ae9bcfda1e90f034`.
- Oznake i materijali izdanja ispravljeni su u `ed1d05296c75e9c0ec399e5669ca509898020776`. Taj commit je izvor objavljenog izdanja v1.8.15.
- CI predloga `39965555530`: success. Browser/uvoz/oporavak i Firebase provere prošli su; samo prvi neuspešan Android posao ponovljen je posle zabeleženog problema emulatorovog pokretača/WebView povezivanja, pa je prošao bez preskakanja tvrdnji.
- Završni CI izvora `39968991675`: sva tri posla (validate, chat-rules, android-smoke) success. Potpisana gradnja i objava `39968991803`: release i publish success. Pages `39968991814`: success.
- Javni index.html, record-safety.js, complete-backup.js, family-policy.js, reminder-reliability.js i sw.js vratili su HTTP 200 i bajt po bajt odgovaraju testiranom izvoru.
- APK v2 RSA potpis i sadržajni digest su kriptografski provereni, manifest potvrđuje paket, 1.8.15 i versionCode 26. AAB JAR potpis i svih 544 potpisanih zapisa su nezavisno provereni. Svih 39 aplikacionih web resursa u oba fajla odgovara izvoru.
- Sertifikat ostaje `e8cdb78355aa5a08d5327dd07c050b92168e8afef6c4aa2d3c8c7f25c5736990`.

## Fajlovi

| Fajl | Bajtova | SHA-256 |
| --- | ---: | --- |
| Pet-Care-World-1.8.15.apk | 9062538 | 0778f5849124d53fa20c0c6bfae987b40f9c308764948b84df5ac65a0775cc41 |
| Pet-Care-World-1.8.15.aab | 8698392 | 74068ef8ba53dc792c81e7d2dd25ab6a9c520c786c76606971ad2981ee9509b1 |

Isti APK je objavljen u GitHub izdanju v1.8.15 uz kontrolne sume, ZIP alternativu i Play paket sa stvarnim emulator snimcima. Instalacija ide preko postojeće aplikacije, bez deinstalacije. AAB je za Play Console, ne za direktnu instalaciju.

## Šta je rešeno i šta još zahteva aktivaciju/vlasnika

Detaljan nalaz i ispravke čuvanja, uvoza, oporavka, režima i materijala su u `RELEASE_1_8_15.md`. Vlasnik je 23. oktobra potvrdio da alarmi rade i posle restarta njegovog telefona. Ta fizička provera je završena; model, precizno izmereno kašnjenje i instalirana verzija nisu izmišljeni. Emulator test ne zamenjuje njegovu potvrdu.

Automatska moderacija je implementirana i usklađena sa 1.8.15 u odvojenom PR 29. Kompletni CI `39968380183` za zajednički izvor je prošao, uključujući serverske transakcije/pravila i stvarni moderatorski ekran preko lokalnog callable adaptera. Ovo je osnovni filter SR/EN obrazaca, ne AI niti potpuna jezička zaštita. Nije objavljen na produkcijski server. Potrebni su vlasnikova odluka o Blaze obračunu, stvarni potvrđeni moderatorski nalog/uloga i živa provera objavljenog callable transporta, postupaka prijave/žalbe i brisanja. Plan je u `AUTO_MODERATION_SR.md` na grani tog predloga. Ovo izdanje 1.8.15 ne uključuje aktivnu automatsku moderaciju.

Aktivna Firebase pravila ostaju `firebase/production-adult-access.rules`, poslednji put potvrđena 22. oktobra u 17:07 po vremenu konzole. Širi korenski preview, mediji, push i novi obračun nisu uključeni.

Za Play ostaju stvarne izjave o ciljnoj publici/društvenim funkcijama, sadržaju i Data safety, odgovorna moderacija i podrška/brisanje, vlasnikova registracija/identitet/ugovor i jednokratna naknada 25 USD, a kada se primenjuje uslov za novi lični nalog i najmanje 12 stvarnih testera tokom 14 uzastopnih dana, pa zahtev za pristup produkciji i Google odluka. Ne birati sve uzraste ili izmišljati ispunjene lične/vremenske uslove na osnovu CI-ja.
