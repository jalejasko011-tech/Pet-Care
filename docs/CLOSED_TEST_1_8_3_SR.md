# Telefon, prevodi i zatvoreni test — Pet Care World 1.8.3

Status 20. oktobra 2026: plan pripremljen. Testeri nisu upisani; Play test,
datumi pristupanja i provera Jaletovog telefona nisu potvrđeni.

## Prvo proveriti Jaletov telefon

Instalirati 1.8.3 preko postojeće aplikacije i proveriti verziju u „Pomoć i
provera“. Sačuvati ranije napravljenu privatnu ZIP kopiju izvan aplikacije.
Ne deinstalirati radi testiranja nadogradnje.

| Provera | Očekivano | Rezultat vlasnika |
| --- | --- | --- |
| Postojeći ljubimci i rase | Ostaju sačuvani | Čeka |
| Nova rasa i sopstveni naziv | Čuvaju se posle ponovnog otvaranja | Čeka |
| Unos bez čuvanja, druga aplikacija, povratak | Unos ostaje | Čeka |
| Promena jezika sa izabranom fotografijom | Tekst i fotografija ostaju | Čeka |
| Podsetnik za 3–5 minuta, zaključan ekran | Dostavlja se bez otvaranja aplikacije | Čeka |
| Podsetnik, restart, prvo otključavanje, ponovno zaključavanje | Dostavlja se u planirano vreme | Čeka |
| Privatna uspomena sa fotografijom | Dostupna posle ponovnog otvaranja | Čeka |
| Potpuna ZIP kopija sa medijima | Izvoz uspeva; vraćanje proveriti na drugom test uređaju | Čeka |

Posle instalacije iz Play internog testa ponoviti ove provere zbog Play potpisa,
dozvola i ponašanja na stvarnom uređaju. Emulator nije provera fizičkog Honor-a.

## Planirani pristup za mlađe — nije potvrđen u izdanju

Vlasnik želi i mlađe korisnike. Pre objave proveriti tačne uzrasne grupe i
usklađenost za decu, ako su uključena. Testirati da mlađi/nepoznat uzrast ne
pristupa javnom odraslom chatu niti pokreće njegovu autentikaciju. Trenutna
potvrda punoletstva nije dokaz takvog razdvajanja. Ne označavati ovu stavku
prošlom na osnovu prethodnih Android testova: novi režim nije implementiran
i prihvaćen ovim dokumentom.

## Preostala provera prevoda

Svih 24 rečnika pokriva 801 izvorni izraz. Tehnički testovi pokrivaju promenu
jezika, RTL, obrasce i stabilne vrednosti. U 22 dodatna jezika ciljano su popravljene
komande, obroci i privatnost; to nije potpuna stručna jezička recenzija svih rečenica.

Pregled traži govornike tih jezika. Za svaki jezik proveriti profile/rase, zdravlje,
podsetnike, obroke, uspomene, kopije, navigaciju i chat. Zabeležiti jezik, ekran,
ključ/rečenicu, predlog ispravke i snimak bez ličnih podataka. Posebno proveriti
značenje „sačuvaj/vrati/obriši“, dozvole, javno/privatno i vremenske rokove.
Nazivi međunarodnih rasa mogu ostati vlastita imena. Pravni tekstovi trenutno
ostaju u postojećoj engleskoj/srpskoj verziji.

Ne označavati jezik recenziranim bez stvarnog pregleda. Dodatne jezike ne reklamirati
kao profesionalno prevedene dok ovaj korak nije završen.

## Postavljanje testa u Play Console-u

Najpre završiti vlasnički nalog, App content, pristup i potpisivanje. AAB se nalazi
u `Play-Submission-1.8.3.zip`; nije fajl za direktnu instalaciju. Pregledati Play
pre-launch report i proveriti pristup običnom korisniku. Moderator mora biti
operativan pre širenja javnog tekstualnog chata.

Za pogođeni novi lični nalog koristiti zatvorenu test traku sa najmanje 12 stvarnih
testera koji ostaju prijavljeni neprekidno najmanje 14 dana. Po ispunjenju uslova
traži se pristup produkciji; on nije automatski. Direktni APK i interno testiranje
ne računati kao završeni zatvoreni Play test.

Dogovoriti saglasne odrasle testere i uneti njihove Google naloge u privatnu tester
listu/grupu u Console-u. Ne stavljati njihove adrese u javni repozitorijum. Sačuvati
stvarni opt-in link tek kada ga Console napravi; ne izmišljati URL.

Ovde nema upisanih osoba ni poslatih poziva. Primeri T01–T12 su prazna mesta za
privatnu evidenciju, a ne potvrđeni testeri:

| Oznaka | Datum/vreme opt-in | Uređaj / Android | Jezik | Povratne informacije | Neprekidno prijavljen |
| --- | --- | --- | --- | --- | --- |
| T01 | — | — | — | — | Nije potvrđeno |
| T02 | — | — | — | — | Nije potvrđeno |
| T03 | — | — | — | — | Nije potvrđeno |
| T04 | — | — | — | — | Nije potvrđeno |
| T05 | — | — | — | — | Nije potvrđeno |
| T06 | — | — | — | — | Nije potvrđeno |
| T07 | — | — | — | — | Nije potvrđeno |
| T08 | — | — | — | — | Nije potvrđeno |
| T09 | — | — | — | — | Nije potvrđeno |
| T10 | — | — | — | — | Nije potvrđeno |
| T11 | — | — | — | — | Nije potvrđeno |
| T12 | — | — | — | — | Nije potvrđeno |

Ne računati rok od dana pripreme ovog dokumenta. Konzervativnu kontrolnu tačku
postaviti 14 dana nakon stvarnog pristupanja poslednjeg od izabranih 12 testera,
ako svi ostanu prijavljeni; status potvrditi u Console-u. Odjava prekida taj niz.

## Raspored aktivnosti nakon stvarnog početka

- Dani 1–3: instalacija, postojeći podaci, profili/rase, obroci i unos zapisa.
- Dani 4–7: zaključavanje, restart, različiti telefoni, jezičke ispravke i RTL.
- Dani 8–10: kopije sa medijima, privatne uspomene, prijava/blok u chatu.
- Dani 11–14: ponoviti prijavljene kvarove i nadogradnju, prikupiti konačne utiske.

Za kvar zapisati stvarni uređaj, verziju, korake, očekivano i dobijeno ponašanje,
učestalost i ishod popravke. Ne tražiti pristup ličnim fotografijama ili lozinkama.
Posle ispunjenog roka sažeti stvarne povratne informacije za production-access
upitnik. Ne predavati unapred izmišljenu priču o angažovanju ili rezultatima.

Zvanični postupak:
https://support.google.com/googleplay/android-developer/answer/14151465?hl=en
