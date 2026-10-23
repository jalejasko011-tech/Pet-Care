# Aktuelno — 1.8.16 (27), bez javnog chata

23. oktobar 2026: vlasnik je odložio javni chat kako bi izbegao njegove troškove i operativnu moderaciju. Chat, njegovi push/mediji i moderatorska prijava uklonjeni su iz ovog izdanja. Automatsku moderaciju ne aktivirati, Blaze ne uključivati. Porodična briga, potvrđen email/lozinka, prijava/blokiranje članova i kontrola vlasnika ostaju.

Serverski kandidat: `firebase/production-no-public-chat.rules`. Objavljivanje u produkciji još nije potvrđeno jer je Firebase konzola odjavljena. Do tada starije instalacije mogu imati pristup prethodnom chatu. Raniji podaci nisu obrisani; zahtevi za brisanje ostaju preko `jalejasko011@gmail.com`, uz potvrdu vlasništva. Ne slati lozinke. Brisanje Auth naloga može prekinuti pristup porodici.

Data Safety: email/identifikator za dobrovoljni porodični nalog, osnovni deljeni profil ljubimca, naziv porodice, imena/identifikatori članova, dnevnik brige i privatne prijave i dalje se obrađuju na Firebase-u. Privatna evidencija i mediji ostaju lokalni dok ih korisnik sam ne izveze/podeli. Odsustvo javnog chata ne znači odsustvo svih korisničkih sadržaja niti odobrenje za sve uzraste. Konačnu publiku i stvarne izjave vlasnik proverava u Play Console.

Ostaju: objavljivanje/provera serverskih pravila, Play nalog/identitet/ugovor i jednokratna naknada od 25 USD, interni test i uslovni zatvoreni test za novi lični nalog (12 stvarnih testera 14 neprekidnih dana), zahtev za produkciju i Google pregled. Vlasnik je već potvrdio alarme na telefonu posle restarta; ne tražiti ponavljanje bez novog problema. Detalji ovog izdanja: `docs/RELEASE_1_8_16.md`.

---
## Istorijska dokumentacija pre uklanjanja javnog chata

Sledeći tekst opisuje ranije izdanje; njegove chat funkcije i preduslovi nisu aktuelan plan.

# Play submission package — 1.8.10

This is prepared material, not an approved or published Play listing. Owner: Jale. Support: jalejasko011@gmail.com. Android ID: `com.petcare.companion`; code 21; target API 36.

Use `title.txt`, `short-en.txt`, `full-en.txt`, `short-sr.txt`, `full-sr.txt`. Descriptions explicitly reflect shipped disabled media/push flags. Category suggestion: Lifestyle; owner chooses in Console. Intended public-chat audience: adults 18+, self-attested, not verified. Do not fabricate a content rating.

Artwork: `assets/app-icon-512.png` (original supplied brand, exported to 512 square); `assets/feature-1024x500.png` (built-in ImageGen feature art, mechanically exported to exact dimensions with `tools/PrepareStoreAssets.java`). Prompt: joyful dog/cat/rabbit/budgie and globe, original wood/emerald brand, horizontal composition, exact title and One World, All Pets, no claims or store badges. Generated source retained in this conversation's image output; original generation dimensions were 1794x876. Do not replace genuine app screenshots with generated mockups.

CI `android-smoke-evidence` contains `store-home.png`, `store-feeding.png`, `store-memories.png`, `store-settings.png` captured from the actual Android WebView with fictional test records. The launch package includes these after passing checks. Owner should review crop and current UI before submission.

Public policy: https://jalejasko011-tech.github.io/Pet-Care/www/privacy.html
Public deletion: https://jalejasko011-tech.github.io/Pet-Care/www/delete-chat.html
Chat rules: https://jalejasko011-tech.github.io/Pet-Care/www/chat-privacy.html

See docs/PLAY_STORE_RELEASE_CHECKLIST.md, GOOGLE_PLAY_DATA_SAFETY_REVIEW.md, PHONE_ACCEPTANCE_TEST.md and RELEASE_1_8_STATUS.md. AAB requires a verified Play Console owner account; it is not installed like an APK. APK is for direct updates. Never remove Play Protect or promise Google approval.
