# Pet Care World 1.8.3 — priprema odgovora za Play Console

Provereno 20. oktobra 2026. Paket `com.petcare.companion`, verzija 1.8.3,
versionCode 14, target API 36. Odgovori su pripremljeni prema kodu i potpisanom
izdanju; nisu uneti niti predati kroz vlasnički Play Console nalog.

Jale je izabrao sebe kao odgovornog moderatora. Naknadno je promenio izbor
publike: aplikacija treba da bude dostupna i mlađima. Prethodni izbor „samo 18+“
za celu aplikaciju je povučen. Donja granica uzrasta još nije potvrđena; ne
predavati konačne uzrasne grupe pre prilagođavanja za izabranu publiku. Javni
chat ostaje namenjen punoletnima. Ovo nije potvrda aktivne moderatorske uloge
niti automatski dodeljena IARC ocena.
Ovaj dokument ima prednost nad pripremom za ranije verzije.

## Osnovna polja

| Polje | Pripremljen odgovor |
| --- | --- |
| Naziv | Pet Care World |
| Vrsta | Aplikacija, nije igra |
| Primarna namena | Organizacija brige o ljubimcima; predlog kategorije Lifestyle |
| Ciljna publika | Odrasli i mlađi; donja granica i konačne uzrasne grupe čekaju potvrdu i prilagođavanje |
| Oglasi | Ne — nema ugrađene oglasne mreže niti aktivnih plaćenih promocija |
| Kupovine i pretplata | Nisu aktivne u ovoj verziji |
| Privatnost | https://jalejasko011-tech.github.io/Pet-Care/www/privacy.html |
| Brisanje chat identiteta | https://jalejasko011-tech.github.io/Pet-Care/www/delete-chat.html |
| Kontakt | jalejasko011@gmail.com |

Privatnost, pravila chata, brisanje, moderatorska stranica i javna chat
konfiguracija vraćaju HTTP 200 i podudaraju se sa izdanjem pri proveri ovog datuma.
To ne dokazuje da je moderatorski nalog prijavljen ili ovlašćen.

## Data safety — potvrđeno ponašanje

Na pitanje da li se prikupljaju korisnički podaci odgovor je **Da**: opcioni chat
šalje podatke sa uređaja. Ne koristiti staru izjavu „nema prikupljanja podataka“.

| Podatak i predlog kategorije | Kada i zašto | Obrada |
| --- | --- | --- |
| Nadimak — Personal info / Name | Dobrovoljni ulazak u chat; funkcionalnost | Čuva se; javan učesnicima |
| Firebase UID — Personal info / User IDs | Dobrovoljni chat; nalog, funkcionalnost, sprečavanje zloupotrebe | Čuva se; povezuje profil i poruke |
| Poruke — Messages / Other in-app messages | Dobrovoljno slanje; funkcionalnost | Čuvaju se; javne učesnicima |
| Razlog prijave — App activity / Other user-generated content | Dobrovoljna prijava; bezbednost | Privatno ovlašćenom moderatoru |
| Email — Personal info / Email address | Samo moderatorska registracija/prijava i dobrovoljan kontakt podršci | Pregledati obuhvat moderatorskog ekrana u Console obrascu |
| Tehnički podaci veze i autentikacije | Firebase obrada, zaštita i sprečavanje zloupotrebe | Završiti proveru tačnih SDK kategorija pre predaje |

Za sačuvani nadimak, UID, poruke i prijave: nisu samo prolazna obrada u memoriji;
prikupljanje je opciono za aplikaciju jer lokalna evidencija radi bez chata.
Svrhe birati po redu tabele, bez označavanja marketinga ili oglašavanja.

**Deljenje:** Firebase obrađuje podatke kao pružalac usluge, a korisnik izričito
bira javno slanje poruke. To su kandidati za Google izuzetke od formalne oznake
„shared“. Javni karakter poruka ipak ostaje obavezno objašnjen korisniku.
Konačno polje proveriti sa stvarnim uslugama projekta; ne predavati automatsko
„No sharing“ ako je naknadno uključen drugi primalac ili promenjena konfiguracija.

**Zaštita i brisanje:** aplikacione veze koriste HTTPS. To nije end-to-end
šifrovanje. Izvezene ZIP kopije nisu šifrovane. Brisanje sopstvenih chat poruka,
profila i anonimnog naloga postoji u aplikaciji i provereno je na emulatoru;
zahtevi bez pristupa identitetu idu podršci uz proveru autorstva. Ne označavati
nezavisnu bezbednosnu sertifikaciju: takva provera nije sprovedena.

Ne prijavljivati lokalne fotografije ili kartone kao cloud prikupljanje samo zato
što postoje na uređaju. Javne slike/video i push su isključeni; pet-record cloud
sync, oglasni SDK i analitika nisu aktivirani. Ako se to promeni, odgovori se
ponovo pregledaju. Životinjski karton nije dokaz prikupljanja zdravlja korisnika.

### Otvorena SDK provera pre predaje

Chat koristi web Firebase SDK 12.4.0 u WebView-u, ne native Auth/Firestore SDK.
Android uključuje FCM dodatak, ali su messaging auto-init i analitika isključeni.
Dobavljački katalog može biti podešen korisnikovim HTTPS URL-om i tada se
periodično osvežava. Zato potvrditi stvarne mrežne tokove na distribuiranom
Play buildu, Firebase podatke veze/bezbednosti, moderatorski email i kategorije
tehničkih identifikatora. Ne izvoditi zaključak o lokaciji samo iz postojanja IP
adrese; pregledati da li dobavljač zaista izvodi i obrađuje lokaciju.

## Izmenjena publika — blokada završne predaje

Izbor mlađe publike nije samo promena kvačice u Console-u. Potrebno je odrediti
ciljne grupe, proveriti uzrast i ograničiti odrasli chat pre autentikacije/mrežnog
pristupa za neodgovarajući ili nepoznat uzrast. Postojeća potvrda „imam 18“ nije
dokaz uvedenog neutralnog ekrana uzrasta. Za publiku koja uključuje decu pregledati
Families uslove, SDK obradu, spoljne linkove, deljenje i potrebnu saglasnost;
proveriti i regionalno značenje deteta. Ni izbor 13+ sam po sebi ne rešava sve
regionalne obaveze. Verzija 1.8.3 nije ovim dokumentom sertifikovana za sve uzraste.

Izvori: https://support.google.com/googleplay/android-developer/answer/9867159?hl=en
i https://support.google.com/googleplay/android-developer/answer/9893335?hl=en .

## Ocena sadržaja i pristup aplikaciji

Pripremljene činjenice za IARC upitnik:

- Aplikacija omogućava komunikaciju korisnika i javni korisnički tekst: **Da**.
- Nasumični privatni 1:1 razgovori, ugrađeni video-pozivi i prenos uživo: **Ne**.
- Javno slanje fotografija/video u ugrađeni chat ovog izdanja: **Ne**, isključeno.
- Deljenje precizne žive lokacije korisnika: nije ugrađeno; korisnik može sam
  upisati lokaciju u SOS/evidenciju. Razlikovati javni sadržaj od privatnog unosa.
- Kockanje, simulacija kockanja, plaćene nasumične nagrade: nisu ugrađeni.
- Urednički seksualni sadržaj, nasilni prikazi i sadržaj sa drogama: nisu deo
  pregledanih ugrađenih ekrana. Korisnički chat nije urednički pregledan unapred;
  ne poricati korisničku interakciju niti obećavati da neprimerena poruka ne može
  nastati. Primena pravila zavisi od aktivne moderacije.

Ne upisivati izmišljenu oznaku PEGI/ESRB/IARC. Sistem računa regionalne ocene iz
stvarnih odgovora. Uzrasne ciljne grupe su odvojene od tako izračunate ocene.

Lokalni deo nema obaveznu prijavu. Chat zahteva nadimak, prihvatanje pravila i
anonimnu autentikaciju. U App access opisati ovaj put i uslove pristupa; ako se
prikaže „all/some functionality restricted“, objasniti opcioni chat i posebni
administratorski ekran. Nikada davati recenzentu vlasnički administratorski nalog.

## Preostale stvarne radnje

1. Završiti vlasnički Console nalog i pregledati stvarna polja obrasca.
2. Potvrditi SDK stavke iznad i sačuvati stvarne odgovore, ne ovaj dokument kao
   zamenu za predatu izjavu.
3. Odobriti potvrđen moderatorski UID i proveriti ceo postupak na stvarnom projektu.
4. Instalirati preko Play internog testa, pregledati pre-launch report i tek zatim
   pokrenuti zatvoreni test. Predaja i odobrenje još nisu potvrđeni.

## Zvanični izvori

- https://support.google.com/googleplay/android-developer/answer/10787469?hl=en
- https://support.google.com/googleplay/android-developer/answer/9859655?hl=en
- https://support.google.com/googleplay/android-developer/answer/9859455?hl=en
- https://firebase.google.com/support/privacy
- https://firebase.google.com/docs/android/play-data-disclosure

Mapiranje ponašanja u kategorije je priprema zasnovana na kodu; dobavljačka
Android dokumentacija nije potvrda identičnog ponašanja web SDK-a.
