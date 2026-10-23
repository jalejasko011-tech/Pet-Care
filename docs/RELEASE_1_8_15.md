# Pet Care World 1.8.15 (26) — pregled 23. oktobra 2026.

Izvor ispravki lokalne evidencije je spojen u PR 30 i objavljen za web. Potpisana gradnja, provera sertifikata/sadržaja i objava su završene; potvrde su u `ACTIVATION_1_8_15_SR.md`. Paket `com.petcare.companion`, target API 36, isti postojeći potpis. Produkcijska pravila, naplata i instalirani APK nisu promenjeni samom pripremom izvora.

## Potvrđeni i ispravljeni propusti

1. **Lažan uspeh pri punoj memoriji.** Prethodni `save()` je progutao grešku upisa, dok su obrasci prikazivali uspeh i zatvarali se. Nepersistirani podaci ostajali su samo u RAM-u i nestajali posle restarta aplikacije. Sada neuspešan upis vraća poslednju uspešno sačuvanu evidenciju, čuva obrazac i nacrt, nema poruke o uspehu, cloud slanja ni ponovnog zakazivanja. Ponovni pokušaj pravi jedan zapis.
2. **Nedovoljna provera uvoza.** Rezervna kopija je propuštala neispravne datume, numeričke vrednosti i neke vrednosti slika. Neka polja su zatim korišćena u HTML atributima. Zajednička provera odbija takav uvoz pre upisa, a atributi su dodatno escapovani. Remote URL slike u privatnoj evidenciji se odbijaju; podržane profilne slike ostaju lokalni data URL-ovi.
3. **Nečitljiva sačuvana evidencija.** Neispravan JSON ili oblik kolekcije mogao je da obori početni ekran ili se tiho zameni praznom evidencijom. Sada se original zadržava, prikazuje se trajno obaveštenje sa izvozom izvornog sadržaja i novi upisi su blokirani do vraćanja validne kopije. U tom stanju sinhronizacija alarma ne otkazuje postojeći raspored na telefonu.
4. **Neispravni metapodaci porodičnog prikaza.** `null`, skalar ili niz više ne zaustavljaju inicijalizaciju. Promena režima potvrđuje čuvanje pre promene stanja.
5. **Prilozi koji sprečavaju potpunu kopiju.** Novi SVG/HTML prilozi se odbijaju u Galeriji i lokalnim objavama, u skladu sa postojećom proverom potpunog ZIP izvoza. Postojeći prilozi se ne brišu.

Obrađeni su profili, zdravlje, beleške/težina, ishrana, troškovi, podsetnici, aktivnosti, SOS, lokalna porodica, treninzi, događaji, obroci, lokalne prijave i udomljavanje. Uspomene i Galerija i dalje čekaju potvrdu IndexedDB transakcije pre uspeha. Provera nepodržanog tipa i greške FileReader-a više ne ostavljaju beskonačno slanje profila; dvostruko slanje obrasca se sprečava.

## Provere i granice nalaza

Lokalno prolaze regresioni testovi za čuvanje/uvoz, sintaksu i privatnost, redosled zakazivanja i porodični režim. Novi browser test proverava stvarni obrazac pri punoj memoriji, ponavljanje, restart stranice, odbijanje oblikovane JSON kopije i oporavak nečitljivog originala validnom kopijom. Puni postojeći browser/Android/Firebase CI `39965555530` je prošao pre spajanja. Prvi Android posao je zastao pri povezivanju testnog WebView-a posle zabeleženog pada emulatorovog pokretača; snimak je pokazao zdrav početni ekran. Ponovljen je samo neuspešan posao, koji je zatim prošao i iste tvrdnje nisu preskočene. Lokalni Chromium nije bio dostupan; njegov download je vraćao neispravan ZIP, pa lokalni browser prolaz nije izmišljen.

Alarmi su prema potvrdi vlasnika 23. oktobra radili i posle restarta njegovog telefona. Ta provera je završena i ne traži se ponavljanje bez novog problema. Automatizovani emulator test nije predstavljen kao fizički telefon.

Ovo nije tvrdnja da aplikacija nema nijednu grešku. Posebno ostaju stvarni moderatorski nalog i operativna moderacija/brisanje, provera ciljane publike i Data safety, Play nalog i stvarni Play test/postupak. Automatska moderacija je odvojeno pripremljena u PR 29; nije aktivirana ovim izdanjem. Za njene serverske funkcije potreban je vlasnikov izbor Blaze obračuna i živa provera. Ne aktivirati širi korenski Firebase preview, medije, push ili novu naplatu bez dogovora.

Pregledani su i tokovi rezervnih kopija/oporavka, lokalnih medija, navigacije/nazad, jezika, opt-in mrežnog pristupa, porodičnih prava/pozivnica, prijava/blokiranja, moderatorskih prava/evidencije i Android konfiguracije. Postojeći testovi pokrivaju te tokove; stvarna Play Console pitanja, odgovorna osoba i ponašanje svakog fizičkog uređaja nisu zamenjeni CI-jem.

U postupku objavljivanja ispravljene su i zastarele oznake 1.8.14: nazivi paketa, tag i BUILD zapis sada se izvode iz stvarne verzije aplikacije, a beleške iz odgovarajućeg dokumenta izdanja. Postojeća objavljena izdanja se ne prepisuju.

Tehnički izvori: https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem ; https://developer.android.com/develop/background-work/services/alarms
