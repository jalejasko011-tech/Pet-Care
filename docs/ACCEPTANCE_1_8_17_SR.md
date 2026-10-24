# Stvarno prihvatno testiranje — 1.8.17 (28)

Ovo je pripremljen plan za fizičke uređaje/Play i produkcijski Firebase. Prazno polje nije uspešan test. Automatizovani CI nalazi su u ACTIVATION_1_8_17_SR.md; ne upisivati izmišljene uređaje, naloge, testere ili rezultate.

| Tok | Provera | Stvarni rezultat / uređaj |
| --- | --- | --- |
| Play instalacija | Instalirati iz internog testa; potvrditi 1.8.17, zadržavanje stare lokalne evidencije i odsustvo javnog chata | Čeka stvarni Play test |
| Ulazak i izgled | Otvaranje bez datuma/PIN-a; Pregled/Ljubimci/Zdravlje/Uspomene/Porodica/Više; zupčanik desno; osnovne aktivnosti u Porodičnom prikazu | Čeka |
| Privatni zapisi | Dodati dva probna ljubimca, zdravstveni zapis, obrok i podsetnik; zatvoriti/otvoriti, proveriti čuvanje | Čeka |
| Kopija | Izvesti ZIP van aplikacije; vratiti na probnom uređaju; proveriti medije i izbegavanje duplikata | Čeka |
| Brisanje ljubimca | Obrisati jednog probnog ljubimca sa medijima i dovršenom rutinom; drugi ljubimac ostaje; nema lažnog uspeha pri punoj memoriji | Čeka |
| Podsetnici | Dozvole i precizni alarmi; zakazan trenutak, zvuk/tišina i pozadina. Vlasnik je već potvrdio alarm posle restarta 23. oktobra; ponoviti samo za drugi uređaj ili novi problem | Potvrda vlasnika 23.10; ostali uređaji čekaju |
| Produkcijska porodica | Dva ili tri prava potvrđena naloga: kreiranje, višekratni kod, live zapis, prikaz drugom članu | Čeka |
| Oporavak porodice | Sačuvati porodični ID; ista prijava na drugom probnom uređaju; vratiti postojeći pristup. Nečlan sa istim ID-em nema pristup | Čeka |
| Prijava i blokiranje | Član prijavi probni sadržaj; vlasnik vidi prijavu i uklanja sadržaj/člana; blokiranje skriva autora; opozvani kod više ne prima člana | Čeka |
| Porodično brisanje | Obrisan samo namenski probni server prostor i članstva; privatna istorija na uređajima ostaje | Čeka |
| Nalog i privatnost | Otvoriti privatnost i zahtev za brisanje iz Podešavanja i bez prijave. Stvaran probni zahtev vlasnik obrađuje proverom pripadajućih podataka | Čeka operativnu proveru |
| Jezici i pristupačnost | Izabrani stvarni jezici, duži tekst, veći font, srpski/engleski, RTL i čitač ekrana. Automatizovani prikaz 24 jezika nije potvrda ljudske lekture | Čeka ljudski pregled |
| Objavljena pravila | Kopirati ceo aktivni tekst i uporediti sa firebase/production-no-public-chat.rules; testirati i prijavljenog klijenta. Snimak 23.10 potvrđuje vidljive no-chat blokove, ne ceo tekst | Čeka puni produkcijski dokaz |

Za svaki pad zabeležiti verziju aplikacije, model/Android verziju, tačne korake, očekivano i viđeno ponašanje. Koristiti probne podatke. Privatne email adrese testera i kredencijale čuvati u namenskim Console poljima, ne u javnom repozitorijumu.

Ako Play zahteva 12 testera/14 dana, svi moraju biti stvarni i neprekidno prijavljeni. Ovaj dokument i CI nisu zamena za taj period ili produkcijski pristup.
