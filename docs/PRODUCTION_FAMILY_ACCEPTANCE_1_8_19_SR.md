# Provera porodice na stvarnim uređajima — 1.8.19

Ovaj test još čeka vlasnika i ukućanina. Firebase administratorska prijava, Rules playground i emulator nisu dva stvarna porodična korisnika. Koristiti zasebne email/password naloge odraslih, potvrditi email preko stvarno primljene poruke i koristiti samo izmišljene podatke o ljubimcu.

1. Na prvom uređaju dodati probnog ljubimca „Probni ljubimac“. U Porodičnoj brizi povezati potvrđen nalog, uneti ime člana i napraviti porodicu „Proba povezivanja“.
2. Napraviti pozivni kod. Na drugom uređaju prijaviti drugi potvrđen nalog i pristupiti tim kodom. Oba uređaja treba da vide isti profil i oba člana. Kod prima najviše 10 novih članova i traje do 24 sata; ne objavljivati ga javno.
3. Drugi član doda obrok, prvi šetnju. Proveriti da se oba zapisa vide na oba uređaja, sa ispravnim autorom. Proveriti ponovo nakon zatvaranja/otvaranja i privremenog gubitka mreže. Ne tumačiti lokalni nacrt ili poruku „čeka se potvrda“ kao potvrđen server zapis.
4. Vlasnik promeni ime zajedničkog ljubimca. Drugi član vidi promenu. Privatni zdravstveni karton, Galerija, Uspomene i lokalni alarmi ne treba da se automatski prenesu.
5. Sačuvati ID porodice privatno. Isti nalog na drugom probnom uređaju može vratiti postojeće članstvo tim ID-em. Nečlan ne može ući samo pomoću ID-a.
6. Prijaviti izmišljeni probni zapis vlasniku; proveriti prijavu, blokiranje autora i uklanjanje probnog zapisa. Uklanjanje člana treba da prekine njegov pristup i opozove aktivne pozivnice; drugi članovi ostaju.
7. Vlasnik može obrisati samo ovu izmišljenu probnu porodicu kada završi test. Brisanje je nepovratno i uklanja zajednički dnevnik svim članovima; pre potvrde proveriti naziv. Ne brisati stvarnu porodicu radi testiranja.

Zabeležiti verziju aplikacije, uređaj/Android, vreme, korake, očekivano i stvarno ponašanje. Privatne email adrese, kodove i ID-eve čuvati van javnog repozitorijuma. Ako nešto ne prođe, poslati opis i snimak bez lozinki ili privatnog sadržaja.

Rezultat: **čeka stvarna dva naloga/uređaja**. Vlasnik je već rekao da mora sačekati ukućanina; ne tražiti izmišljene naloge ili označiti test kao završen unapred.
