# Pet Care World 1.8.11 (22)

Unos u Podsetnicima i Pametnom dnevnom rasporedu koristi odvojena brojčana polja
za dan, godinu, sat i minut, uz izbor meseca po broju i lokalizovanom nazivu.
Godina se unosi direktno. Sat koristi 24-časovni format. Kalendar ostaje kao
opciona alternativa. Prečice Danas/Sutra menjaju datum; Za 10 min/Za 1 sat menjaju
i datum i vreme, uključujući prelaz preko ponoći, meseca i godine.

Postojeći zapisi i format čuvanja ostaju isti: YYYY-MM-DD i HH:mm, lokalno vreme.
Proveravaju se stvarni kalendarski dani (uključujući prestupne godine), sati
0–23 i minuti 0–59. Prazno opciono vreme ostaje dozvoljeno. Započeti unos ima
stabilne identifikatore za očuvanje pri promeni jezika. Kontrole su najmanje
44 px, brojčana polja 48 px, bez horizontalnog skrolovanja na 320 px.

Provere pokrivaju stvarno čuvanje i ponovno učitavanje, nevažeće datume i vreme,
opciono vreme, jezički prelaz, kalendar, prelaz lokalne ponoći/godine, SR/EN/AR
na 320–768 px i Android tok od novog obrasca do native zakazivanja.

Vlasnik je u razgovoru potvrdio uspešan kratki test obaveštenja na svom telefonu.
Rezultat testa posle ponovnog pokretanja još nije potvrđen. Preostali uslovi za
javnu Play objavu iz docs/PLAY_READINESS_2026_10_21_SR.md i dalje važe.
