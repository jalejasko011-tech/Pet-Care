# Potvrđen zahtev: svi uzrasti, uključujući najmlađe

Vlasnik Jale je 20. oktobra 2026. izričito potvrdio: „Svi svi da mogu da koriste
i najmlađi“. Prethodni izbor cele aplikacije samo za 18+ više ne važi.

Ovo je prihvaćen obuhvat naredne dorade. Nije potvrda da je izdanje 1.8.3 već
prilagođeno deci, da je dečji režim napravljen ili da su sve uzrasne grupe upisane
u Play Console. Nema novog APK-a u ovoj dokumentacionoj izmeni.

## Pristup po režimima

| Funkcija | Najmlađi, uz roditelja | Starija deca i tinejdžeri | Odrasli |
| --- | --- | --- | --- |
| Lokalni pregled ljubimca i privatnih uspomena | Jednostavne velike ikone, uz pomoć roditelja | Dostupno lokalno | Dostupno |
| Beleženje zajedničke igre i nege | Jednostavne radnje uz roditelja | Dostupno lokalno | Dostupno |
| Podsetnici i obroci | Raspored postavlja roditelj | Lokalno, uz odgovarajuću pomoć | Postojeće mogućnosti |
| Medicinski zapisi i terapije | Upravlja roditelj; nema dečjih uputstava za davanje leka | Evidencija uz odraslu osobu | Postojeća evidencija; ne zamenjuje veterinara |
| Javni anonimni chat | Nedostupan | Nedostupan | 18+, posle odgovarajuće provere i pristanka |
| Spoljne kupovine, AI i javno deljenje | Kontrola roditelja; bez automatskih zahteva | Ograničeno odraslom kontrolom | Izričita radnja korisnika |
| Oglasi i ugrađena naplata | Nisu aktivni | Nisu aktivni | Nisu aktivni u ovom izdanju |

Najmlađima nije namenjeno samostalno upravljanje lekovima, obrocima ili hitnim
veterinarskim odlukama. Roditelj vodi evidenciju i raspored; jednostavniji prikaz
služi zajedničkoj brizi o ljubimcu, uz razvojno primerene radnje.

## Potrebna implementacija

Neutralan unos uzrasta, bez unapred popunjenog datuma i bez nagrade za izbor
starijeg uzrasta. Za nepoznat uzrast primeniti ograničen lokalni režim. Ne slati
datum rođenja deteta u chat, analitiku, evidenciju podrške ili cloud. Sačuvati samo
minimalno potrebno lokalno stanje i predvideti upravljanje od strane roditelja.

Uvesti kontrolu odrasle osobe za promenu režima, deljenje i spoljne funkcije.
Postojeća chat kvačica „imam 18“ sama nije dokaz završene neutralne provere.
Blokada mora prethoditi učitavanju SDK-a, autentikaciji ili otvaranju javne sobe;
samo skrivanje dugmeta nije dovoljno.

Pregledati i ranije sačuvan URL dobavljačkog kataloga, automatsko osvežavanje,
spoljne linkove, sistemsko deljenje i povratak kroz istoriju navigacije. Posebno
proveriti da promena jezika, vraćanje ZIP kopije ili ponovno pokretanje ne zaobilaze
ograničenje režima. Pregledati ponašanje ugrađenih SDK-a na Android-u, ne samo veb.

Lokalni dečji režim ne sme da zahteva Firebase nalog niti javni nadimak. Pozadinski
chat push i javni mediji ostaju neaktivni; ova odluka ne odobrava Blaze naplatu.
Ne obećavati potpunu jezičku, zakonsku ili Google Families usklađenost samo na
osnovu ovog nacrta. Pravno značenje deteta i obaveze zavise od tržišta.

## Provere pre izbora svih uzrasta u Console-u

- Mlađi i nepoznat uzrast ne otvaraju javni chat niti pokreću njegovu mrežnu vezu.
- Roditeljska kontrola ostaje na snazi posle restarta, navigacije i vraćanja kopije.
- Najmlađi prikaz ima dovoljno velike kontrole i razumljive, jednostavne zadatke;
  upotrebljivost proveriti uz odraslu osobu, ne samo automatskim testom.
- Nema automatskog slanja privatnih zapisa ili fotografija niti otvaranja spoljnih
  kupovina/AI iz dečjeg režima.
- Publika, privatnost, Data safety, IARC i opis u prodavnici odgovaraju stvarno
  testiranom buildu. Ne reklamirati Teacher Approved ili Google odobrenje.

## Status

Razvojna grana uvodi početni lokalni porodični prikaz i roditeljski PIN;
pogledati `FAMILY_ACCESS_AUDIT_2026_10_20_SR.md`. Još nije objavljen novi APK
niti potvrđena usklađenost za sve uzraste.

Zahtev publike je potvrđen. Dizajn, kod, provera SDK-a, testovi na telefonu i
završni odgovori u Console-u još nisu završeni. Ne označavati ovu stavku kao
ispunjenu na osnovu testova prethodnog izdanja.

Zvanični izvori provereni 20. oktobra 2026:
https://support.google.com/googleplay/android-developer/answer/9893335?hl=en
https://support.google.com/googleplay/android-developer/answer/9867159?hl=en
