# Data safety pregled — 1.8.14 (25), 22. oktobar 2026.

Ovo je pregled stvarnog ponašanja za vlasnika, ne popunjen ili poslat Play Console upitnik. Ranije izjave o anonimnom chatu nisu važeće za nove prijave u ovoj verziji.

| Podaci | Kada se obrađuju i kome su dostupni | Svrha |
| --- | --- | --- |
| Email i Firebase identifikator naloga | Dobrovoljna prijava odrasle osobe za online funkcije; Firebase Authentication. Email nije javan učesnicima. | Upravljanje nalogom i pristupom |
| Javni nadimak, tekst poruke, autorov ID i vreme | Posle prihvatanja pravila i otključavanja chata potvrđenim emailom i lozinkom; vide učesnici i ovlašćeni moderator. | Razgovor i bezbednost zajednice |
| Naziv porodice, izabrani osnovni profil ljubimca, prikazna imena i ID članova, novi zajednički zapisi i vreme | Posle zasebnog povezivanja i namerne radnje deljenja; vide članovi te porodice i administrator projekta. Ne šalje se automatski privatna istorija. | Porodična briga |
| Hash pozivnice, porodica/vlasnik, rok i broj korišćenja, poslednji novi član i vreme | Pri pravljenju i korišćenju pozivnog koda; upravljanje pozivnicama je vlasničko. | Kontrola članstva |
| Javna chat prijava: prijavilac, poruka, razlog i vreme | Dobrovoljna prijava moderatoru; nije javna. | Obrada zloupotrebe |
| Porodična prijava: prijavilac, ID zapisa ili člana, razlog i vreme | Dobrovoljna prijava vlasniku te porodice; drugi članovi ne mogu da listaju prijave. | Moderacija zatvorene grupe |
| Moderatorska evidencija: izvršilac, radnja, ciljni ID i vreme | Pri moderatorskim radnjama; privatna, neizmenjiva kroz klijentsku aplikaciju. | Bezbednosna evidencija |
| Tehnički podaci o vezi | Firebase/Google obrađuje podatke neophodne za servis. Pre predaje proveriti aktuelna SDK obelodanjivanja i projektna podešavanja. | Funkcionisanje i bezbednost servisa |

Osnovna lokalna evidencija radi bez naloga, koda ili datuma rođenja korisnika. Privatni zdravstveni zapisi ljubimaca, slike, uspomene, troškovi i lokalni alarmi ne šalju se automatski u Firebase. Korisnik zasebno bira izvoz/deljenje kopije. Porodični profil može sadržati opcioni datum rođenja ljubimca, ne korisnika. Lozinka se koristi kroz Firebase Authentication, ne upisuje se u aplikacionu kopiju ili korisnički profil.

Nema aktivnih oglasa, Analytics inicijalizacije, chat medija ili pozadinskog chat push-a. Transport je HTTPS; chat i porodica nisu end-to-end šifrovani. Blokiranje sakriva autora na uređaju, ne sprečava njegovo čitanje grupe.

## Brisanje

U chatu se samostalno brišu javne poruke i chat profil. Email nalog namerno ostaje zbog mogućeg porodičnog pristupa. Potpuno brisanje email naloga i povezanih serverskih podataka traži se preko veze iz aplikacije ili javne stranice `www/delete-chat.html`, emailom vlasniku. Vlasnik proverava vlasništvo i mora stvarno obraditi zahtev; slanje zahteva nije trenutno automatsko brisanje. Porodice imaju zasebne kontrole za brisanje zapisa, napuštanje i vlasničko brisanje cele grupe. Deinstalacija ne briše serverske podatke.

Pre predaje vlasnik mora proveriti obradu stvarnog probnog zahteva, obuhvat povezanih podataka, postupak za vlasničke porodice, rok odgovora i opravdano zadržavanje bezbednosnih prijava/evidencije. Javno objavljena politika opisuje moguće zadržavanje prijava i evidencije; ne tvrditi automatsko brisanje ili izmišljen rok.

## Console odluke koje vlasnik još proverava

- Označiti email, korisničke identifikatore i odgovarajuće kategorije poruka/drugog korisničkog sadržaja prema tačnim aktuelnim definicijama forme. Ne birati „nema prikupljanja podataka“.
- Proveriti definiciju deljenja za namerno javno objavljivanje i obradu od strane provajdera. Javna vidljivost mora ostati jasno obelodanjena.
- Online funkcije su dobrovoljne; nisu uslov za lokalnu brigu. Potvrda emaila je radnja odrasle osobe, ne dokaz hronološkog uzrasta ili roditeljskog odnosa.
- Odgovori o ciljnoj publici, društvenim funkcijama i oceni sadržaja moraju odgovarati stvarnom izdanju. Ne birati sve uzraste samo zato što ulazak nema datum.

Primarni izvori: https://support.google.com/googleplay/android-developer/answer/10787469 ; https://support.google.com/googleplay/android-developer/answer/13327111 ; https://support.google.com/googleplay/android-developer/answer/10144311 ; https://support.google.com/googleplay/android-developer/answer/9893335
