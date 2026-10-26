# Firebase — neposredna provera 26. oktobra 2026.

Projekat Pet Care World (`pet-care-world`) otvoren je u administratorskoj konzoli vlasnika posle bezbedne Google prijave. Ovo nije samo raniji snimak ili emulator.

| Stavka | Stvarno utvrđeno / urađeno |
| --- | --- |
| Plan | Spark, No cost ($0/month); nadogradnja nije pokrenuta |
| Storage | Konzola zahteva Blaze; nije aktivirano novo serversko skladištenje |
| Aktivna pravila | Revizija 23.10.2026 u 19:51, sa zvezdicom; nije menjana |
| Puni tekst | 9.981 znak iz editora. Posle trimovanja samo krajnjih belina i dodavanja jednog novog reda: SHA-256 fc18d041949e36917f2b03474dfa65c67c5d0736edc1095fc3f502aa780097d7, jednak celom testiranom no-chat fajlu |
| Javni pristup | Osam kolekcija odbija neprijavljeni REST read: 403 PERMISSION_DENIED |
| Prijavljeni chat | Rules playground, simulirani email_verified=true / provider=password, globalMessages get: Simulated read denied; nije pravljen stvarni nalog ili poruka |
| Prijava | Email/Password uključen, email-link/passwordless isključen |
| Lozinka | Server promenjen sa minimuma 6 na 12; Require enforcement; Force upgrade on sign-in ostaje isključen, maksimum 4096 |
| Zaštita emaila | Email enumeration protection već uključena |
| Istorijski anonimni identiteti | Anonymous provajder ostaje uključen; nova aplikacija ne kreira anonimne naloge, family pravila ih ne prihvataju |
| Brisanje | Izolovana Auth/Firestore proba je prošla (CI 40362563676). Nije obrisan nijedan stvaran nalog ili porodični podatak |

Pravila i postojeći podaci nisu prepisivani. Plaćene Functions, automatska moderacija, push i Storage nisu aktivirani ovom proverom. Stara anonimna produkcijska test-skripta je penzionisana da ne bi simulirala završetak sadašnjeg verified-adult toka. Novi javni smoke je samo read-only, bez kreiranja naloga ili podataka.

Ostaje stvarni test povezivanja porodice sa dve odrasle osobe i obrada jednog pravog probnog zahteva za brisanje uz proveru vlasništva. Otvorena administratorska konzola i Rules playground ne zamenjuju te tokove. Postojeći anonimni nalozi i istorijski chat nisu masovno obrisani.

Play Console je takođe otvoren: za vlasnikov nalog prikazuje Creating a developer account / signup, tako da Play registracija, app entry, test kanal i opt-in link još nisu završeni.
