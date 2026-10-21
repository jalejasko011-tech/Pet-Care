# Pet Care World 1.8.4 — provera na vlasnikovom telefonu

Ovo nije završen test: rezultat mora potvrditi vlasnik na fizičkom telefonu.
Ne deinstalirati aplikaciju i ne brisati njene podatke. Pre ažuriranja sačuvati
privatnu ZIP kopiju izvan aplikacije. Instalirati samo provereno potpisano izdanje
sa postojećim ključem; sam GitHub PR ne ažurira instaliranu aplikaciju.

## Podsetnik van aplikacije

U Android aplikaciji otvoriti More / Više → Help and checks / Pomoć i provera.
Izabrati Schedule 10-second test / Pošalji test za 10 sekundi. Odobriti sistemske
dozvole ako su tražene. Posle potvrde zakazivanja otići na početni ekran telefona
i zaključati ekran. Zabeležiti da li se obaveštenje pojavilo i da li se čulo.

Za drugi test postaviti običan podsetnik nekoliko minuta unapred, restartovati
telefon, otključati ga jednom, ponovo zaključati i sačekati bez otvaranja Pet Care.
Navesti model telefona, Android verziju i podešene dozvole/baterijska ograničenja
ako test ne uspe. Prisilno zaustavljanje paketa u sistemskim podešavanjima nije
isto što i zatvaranje ekrana ili sistemsko gašenje procesa.

## Porodični prikaz

Posle ažuriranja proveriti da su prethodni ljubimci i zapisi sačuvani. Prvi ekran
je lokalni porodični prikaz. Odrasla osoba kroz svoj deo unosi datum rođenja i
postavlja privatan kod; datum se odbacuje. Zatim dodaje/uređuje podatke i raspored.
Pre predaje telefona detetu izabrati Family view / Porodični prikaz.

U zaključanom prikazu proveriti izbor ljubimca i veliko dugme za igru/odmor.
Chat, medicinske forme, kupovina i deljenje ne smeju biti dostupni. Restart i
promena jezika ne smeju otključati pristup. Kod i otključana sesija nisu u kopiji.
Novi tekst porodičnog prikaza je na engleskom i srpskom, sa engleskim fallback-om.

## Produkcijska moderacija

Povezan Google/Firebase nalog vlasnika je preduslov za proveru projekta
`pet-care-world`. Uloga moderatora mora biti potvrđena na serveru za tačan
verifikovan nalog. Dva kontrolisana testna naloga proveravaju prijavu sadržaja,
blokadu, uklanjanje poruke, zabranu i povratak pristupa. Provere emulatora nisu
dokaz da je uloga na produkciji dodeljena. Ne slati lozinke ili kodove u chat.
