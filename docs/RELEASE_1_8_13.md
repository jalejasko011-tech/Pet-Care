# Pet Care World 1.8.13 (24)

## Ispravljeno

- Kontrola dozvole za precizne alarme prikazuje se posle svih renderer-a, uključujući
  poseban ekran Pomoć i provera. Dostupna je i uz Podsetnike, Raspored, Obroke,
  Zdravlje i Podešavanja; na Pregledu kada postoje planirani podsetnici.
- Dugme otvara Android podešavanje samo na izričit dodir. Ne odobrava dozvolu umesto
  korisnika. Posle povratka čita stvarno stanje; odbijena ili nepoznata dozvola se
  ne prikazuje kao odobrena. Provera ne briše započeti obrazac.
- Native appStateChange dopunjuje WebView visibilitychange: pri povratku se
  proverava dozvola i ponovo zakazuju budući lokalni podsetnici.
- Potvrda čuvanja razlikuje približno zakazivanje, nepoznatu tačnost i dozvoljene
  precizne alarme. Dostignuto ograničenje od 64 zakazana obaveštenja izričito se
  prijavljuje; sačuvan zapis nije dokaz da su svi podsetnici zakazani.
- Lokalni izveštaj za podršku uključuje status preciznosti bez zapisa o ljubimcima,
  teksta chata ili identiteta. Lakši unos datuma/vremena iz 1.8.12 ostaje uključen.

## Granice provere i objave

Vlasnik je prijavio kašnjenje 3–4 minuta posle restarta, pa očitao denied za
precizne alarme. Ta dozvola nije odobrena, što je potvrđen problem konfiguracije;
to ne dokazuje da je jedini uzrok kašnjenja. Android dozvolu uključuje sam vlasnik.
Treba ponoviti fizički test posle granted; OEM ograničenja mogu zahtevati dodatnu
proveru. Emulator i mock-bridge ne potvrđuju stanje njegovog telefona.

Javna Play objava i dalje nije potvrđena. Lokalni ulaz bez koda ili datuma ostaje.
Dečja publika uz društvene funkcije zahteva odgovarajući postupak odrasle osobe,
kontrolu pristupa i istinite Console izjave. Porodični prikaz/checkbox 18+ to ne
potvrđuju. Zatvoreni porodični tekst zahteva zasebno dovršen tok prijave i blokiranja.
Stvarni odgovorni moderator i serverska uloga, prihvatanje fizičkog testa,
registracija vlasnika i potrebni Play testeri ostaju otvorene stavke. Firebase
pravila se ovim izdanjem ne menjaju; mediji i chat push ostaju neaktivirani.

Primarni izvori provereni 22. oktobra 2026:
- https://developer.android.com/about/versions/14/changes/schedule-exact-alarms
- https://support.google.com/googleplay/android-developer/answer/9893335?hl=en
- https://support.google.com/googleplay/android-developer/answer/9876937?hl=en
- https://support.google.com/googleplay/android-developer/answer/14151465?hl=en
