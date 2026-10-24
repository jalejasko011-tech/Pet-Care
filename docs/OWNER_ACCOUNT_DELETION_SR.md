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

Postupak prvo proveriti stvarnim namenskim probnim nalogom i probnim podacima. Nije potvrđeno da je vlasnik već izvršio takvu operativnu proveru.
