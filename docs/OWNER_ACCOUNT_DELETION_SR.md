# Obrada zahteva za brisanje — Pet Care World

Putanja korisnika: Podešavanja/Porodična briga/Prijava → zahtev za brisanje → www/delete-account.html → podrška. Nije aktivirana plaćena automatska obrada. Vlasnik projekta mora stvarno pregledati i rešavati zahteve.

1. Utvrditi opseg: ceo Auth nalog i povezani podaci, samo određeni server podaci, ili lokalno brisanje koje korisnik izvršava na uređaju. Potvrditi vlasništvo nad adresom naloga; ne tražiti lozinke, OTP kodove ili podatke kartice.
2. Pronaći tačan UID u Authentication. Evidentirati potrebne identifikatore za postupak; ne brisati drugi nalog sa sličnim imenom ili drugu porodicu.
3. Popisati porodična članstva, zapise autora, prijave podnosioca/lične podatke u razlozima i porodice čiji je nalog vlasnik. Ako je vlasnik, jasno potvrditi da brisanje porodice uklanja pristup i dnevnik svim njenim članovima. Verzija nema prenos vlasništva. Obrisati povezane pozivnice, prijave, zapise, članove i roditeljsku porodicu; ne ostaviti napušten ownerId.
4. U tuđim porodicama obraditi njegove povezane zapise/prijave/članstvo, uz zaštitu drugih članova. Ne brisati celu tuđu porodicu ili naloge ostalih članova.
5. Proveriti istorijske chatProfiles/globalMessages/chatReports i eventualnu raniju serversku tehničku pretplatu. Javnim klijentima su putevi zatvoreni, pa pregled i brisanje vrši administrator. Uklanjanje aplikacionog chata nije obrisalo postojeće podatke.
6. Ukloniti Auth nalog tek uz kontrolu da se pridruženi podaci ne zaborave. Samo dugme Delete u Authentication ne briše Firestore kolekcije. Ne koristiti root preview pravila da bi klijent dobio širok pristup.
7. Proveriti dovršenost i poslati stvarnu potvrdu korisniku, uz konkretno objašnjenje eventualnog zakonskog/bezbednosnog zadržavanja i primenljivog perioda. Ne potvrđivati završetak ako je deo radnje odbijen ili prekinut. Ograničiti internu evidenciju na podatke nužne za obradu, bez čuvanja sadržaja obrisanih poruka kao neograničene kopije.

Lokalni profili, Galerija, Uspomene, nacrti, korisnikovi izvozi i tuđe već preuzete kopije nisu dostupni administratoru kroz Firebase. Korisnik briše svoje lokalne podatke/kopije zasebno. Ažuriranje ne uklanja ranije sistemske kopije pružaoca usluge.

## Potvrđena izdvojena proba — 26. oktobar 2026.

`tools/test-account-deletion-rehearsal.mjs` prošao je u lokalnim Auth/Firestore emulatorima, projekat `demo-petcare-ops`, CI 40362563676. Provereni su Auth nalog, cela sopstvena porodica uključujući ugnježdene zapise bez roditeljskog dokumenta, sopstveno članstvo/zapisi/prijave u tuđoj porodici, pozivnice, istorijski chat/push i očuvanje drugog naloga i nepovezanih zapisa. Skripta odbija rad bez oba lokalna emulatora i nije produkcijski alat za masovno brisanje.

Ova proba ne potvrđuje da je primljen i rešen stvaran zahtev za brisanje. To ostaje operativni prihvatni korak vlasnika. Nije aktiviran plaćeni automatski servis.

## Dodatne kontrole pri stvarnoj obradi

Pre brisanja utvrditi vlasništvo i tačan UID; privremeno onemogućiti ciljni nalog i opozvati refresh tokene. To samo po sebi ne poništava odmah već izdate ID tokene u svim servisima: sačekati njihovo isticanje (tipično do jednog sata), ili koristiti prethodno testiranu serversku blokadu za taj UID, pre završnog popisa/brisanja. Ne tvrditi da je korisnik odmah izgubio sve mogućnosti upisa samo zato što je Auth nalog disabled.

Po dogovoru sa vlasnikom zahteva pauzirati porodice koje on poseduje, ukloniti njihove pozivnice i potom obraditi podkolekcije. U tuđim porodicama sačuvati nepovezane naloge i zapise, ali pregledati prijave koje referenciraju njegov članski UID ili obrisane zapise, kao i tekstualne razloge koji mogu sadržati lične podatke. U tuđim pozivnicama očistiti povezani `lastJoined` identifikator bez automatskog brisanja tuđe pozivnice.

Pregledati istorijske `chatPushSubscriptions/{uid}` podkolekcije i `moderators/{uid}` ako postoje. Za moderationAudit (`actorId`, `targetId`) utvrditi povezane podatke i konkretan opravdan period zadržavanja; ne zadržavati ih neograničeno po podrazumevanoj pretpostavci. Uklanjanje Firestore roditelja običnim delete pozivom ne uklanja samo po sebi podkolekcije.

Posle obrade ponoviti ciljane provere povezanih puteva, potvrditi Auth uklanjanje i tek tada poslati stvarnu potvrdu. Ako deo ostane nerešen, ne navoditi da je brisanje potpuno. Lokalni mediji, izvozi i tuđe preuzete kopije ostaju zaseban opseg.

Izvori: https://firebase.google.com/docs/auth/admin/manage-users ; https://firebase.google.com/docs/auth/admin/manage-sessions ; https://firebase.google.com/docs/firestore/manage-data/delete-data
