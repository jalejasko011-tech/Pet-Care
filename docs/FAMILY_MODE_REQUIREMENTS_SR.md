> Verzija 1.8.7 na zahtev vlasnika otvara glavni ekran bez koda, datuma i godine.
> Porodični prikaz je opciona prezentacija, sa povratkom jednim dodirom; nije
> roditeljska brava. Punoletstvo se ne zaključuje iz pristupa aplikaciji. Javni
> chat zasebno traži izričito prihvatanje pravila i izjavu 18+ pre povezivanja.
> RELEASE_1_8_7.md zamenjuje ranije zahteve za ulaz ispod.

> Izmena u verziji 1.8.6 na zahtev vlasnika: obavezni privatni kod je uklonjen.
> Stari sačuvani kodovi se uklanjaju pri pokretanju. Deo za odrasle koristi samo
> lokalnu proveru unetog datuma rođenja; to nije roditeljska brava sa lozinkom.
> Detalji: RELEASE_1_8_6.md. Ranije zahteve za kod ispod zamenjuje ova odluka.

# Potvrđen zahtev: svi uzrasti, uključujući najmlađe

Vlasnik Jale je 20. oktobra 2026. izričito potvrdio: „Svi svi da mogu da koriste
i najmlađi“. Prethodni izbor cele aplikacije samo za 18+ više ne važi.

Lokalni režim implementiran je u pripremi izdanja 1.8.4; testovi ovog izdanja moraju se proveriti u CI. Nije potvrda da je izdanje 1.8.3 već
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

Zahtev publike je potvrđen. Kod 1.8.4 sada sadrži podrazumevani lokalni prikaz, neutralan unos datuma pri podešavanju odrasle osobe, hash roditeljskog koda sa solju, ograničavanje pokušaja i zaključavanje spoljnih funkcija. Datum se odbacuje. Dečji prikaz nudi velike kontrole za igru i odmor; medicinske podatke i rasporede uređuje odrasla osoba. Novi tekst ovog prikaza za sada je na engleskom i srpskom. Ne tvrditi da je dodatak preveden na sva 24 jezika.

Odrasla sesija traje najviše 15 minuta; eksplicitno zaključavanje vraća lokalni prikaz i ponovo učitava aplikaciju da zaustavi SDK veze. Novi browser session zahteva kod. Na deljenom telefonu obavezno izabrati Porodični prikaz pre predaje detetu. Lokalni kod nije dokaz identiteta, srodstva niti zamena za pravno potreban verifikovani roditeljski pristanak. Brisanje podataka aplikacije uklanja lokalno podešavanje.

CI, provera ugrađenih SDK-a u stvarnom paketu, upotrebljivost uz dete i odraslu osobu, fizički telefon i završni odgovori u Console-u ostaju zasebne provere. Ne označavati ih kao ispunjene na osnovu prethodnog izdanja.

Zvanični izvori provereni 20. oktobra 2026:
https://support.google.com/googleplay/android-developer/answer/9893335?hl=en
https://support.google.com/googleplay/android-developer/answer/9867159?hl=en
