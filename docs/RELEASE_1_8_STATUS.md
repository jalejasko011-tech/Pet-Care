# Aktuelni status — 1.8.19 (30), 26. oktobar 2026.

Aplikacioni izvor: `9e499e7e18b2c495e93f2bdf2f31a5b5fe1f5f7a`. Izdanje v1.8.19 je objavljeno, Web/Firebase-rules/Android provere CI 40348097747 i potpisani build 40348097603 su prošli. APK i AAB su pripremljeni. Datum rođenja sada ima odvojene dan/mesec/godina kontrole; godine/meseci ostaju alternativa. Javni chat i plaćena moderacija/oglasi/pretplate nisu aktivirani.

Direktno proverena Firebase konzola: cela aktivna Rules revizija od 23.10 19:51 odgovara testiranom no-chat fajlu (samo završne praznine normalizovane); Spark ostaje bez mesečne naknade. Serverska politika nove lozinke je 12 znakova, Require, bez prinudne promene pri prijavi. Email enumeration zaštita je već uključena; Storage nadogradnja nije pokrenuta. Detalji su u `firebase/ACTIVE_RULES.md`.

Operativna proba brisanja naloga i povezanih podataka u izdvojenim emulatorima je prošla (40362563676). Nije potvrđena obrada stvarnog zahteva ili stvarno brisanje produkcijskog naloga. Procedura je u OWNER_ACCOUNT_DELETION_SR.md.

Play Console je 26.10 otvoren na signup ekranu za kreiranje developerskog naloga. Registracija, identitet, ugovor i uplata nisu završeni. Zato još nema Play aplikacije/test kanala/opt-in linka. Priprema za unos: PLAY_CONSOLE_ANSWERS_1_8_19_SR.md i GOOGLE_PLAY_DATA_SAFETY_REVIEW.md. Testeri: TESTER_GUIDE_1_8_19_SR.md i prazan TESTER_TRACKER_TEMPLATE.csv.

Preostaju stvarni porodični test sa ukućaninom, stvarno operativno prihvatanje zahteva za brisanje, vlasnikova registracija i konačni Console odgovori (uključujući ciljnu publiku/IARC), Play instalacija i, ako je primenljivo, 12 stvarnih kontinuirano prijavljenih testera 14 dana. CI nije zamena za te ljude ili Google pregled. Vlasnik je već potvrdio fizičke alarme posle restarta i instalaciju 1.8.17; ne predstavljati to kao kompletno fizičko prihvatanje 1.8.19.
