# Aktuelni status — 1.8.20 (31), 26. oktobar 2026.

Aplikacioni izvor: `d0e858f6170fcb23c00b3ad274df3911b2536b95`. Objavljeno izdanje: https://github.com/jalejasko011-tech/Pet-Care/releases/tag/v1.8.20 . Quality CI 40367272490: validate, chat-rules i android-smoke SUCCESS. Potpisani build/publish 40367272553 SUCCESS. Android provera uključuje restart emulatora. APK/AAB potpis i svih 43 upakovanih web fajlova nezavisno su provereni; sertifikat je isti kao prethodno izdanje.

Praktičnost: direktan unos dana/meseca/godine ili godina/meseci starosti ljubimca, pravilne oznake polja, najmanje 48 px relevantne kontrole, čitljiviji pomoćni tekst, sedam obrazaca bez prelivanja na proveravanim širinama 320–768 px. Profil zahteva samo ime i vrstu. Osnovni ulazak ostaje bez koda/datuma korisnika. Javni chat je uklonjen. Detalji: USABILITY_REVIEW_1_8_20_SR.md.

Firebase: ceo aktivni Rules tekst odgovara testiranom no-chat fajlu posle normalizacije završnih praznina; osam neprijavljenih REST pristupa odbijeno. Spark / No cost potvrđen. Require password policy minimum 12 sačuvana; Force upgrade on sign-in isključen. Email enumeration zaštita uključena. Nije uključena naplata, Storage, plaćena moderacija ili push. Nije brisan stvarni nalog ili istorija. Detalji: FIREBASE_REVIEW_2026_10_26_SR.md.

Operativna proba brisanja naloga/povezanih podataka u izdvojenim emulatorima prošla je (40362563676), uz očuvanje nepovezanog naloga. Nije potvrđena obrada stvarnog zahteva ili brisanje produkcijskog naloga.

Play Console: pripremljen lični tok i promenljiv javni naziv Pet Care World; zaustavljeno na Link a payments profile to verify your identity. Vlasnik mora proveriti tip naloga i lično uneti pravne/payment podatke, završiti identitet, ugovore i uplatu. Nema Play aplikacije, test kanala ili opt-in linka. START_PLAY_TEST_1_8_20_SR.md navodi redosled.

Preostaju stvarni porodični test sa ukućaninom, operativno prihvatanje zahteva za brisanje, konačni Console odgovori/publika/IARC, Play instalacija i, ako je primenljivo, 12 stvarnih kontinuirano prijavljenih testera 14 dana, pa zahtev za produkcijski pristup. CI nije zamena za ljude ili Google pregled. Vlasnik je ranije potvrdio fizičke alarme posle restarta i instalaciju 1.8.17; ne predstavljati to kao kompletno fizičko prihvatanje 1.8.20.
