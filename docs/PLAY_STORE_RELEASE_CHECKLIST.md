# Play Store — izdanje 1.8.14 (25)

22. oktobar 2026. Paket `com.petcare.companion`, target API 36. Potpisani APK i AAB su pripremljeni postojećim sertifikatom. Ovo nije Play registracija, popunjen Console upitnik ili Google odobrenje.

## Završene tehničke izmene

- Direktan ulazak u lokalnu aplikaciju bez koda i korisničkog datuma rođenja; jednostavniji unos datuma/vremena podsetnika.
- Vidljiva kontrola preciznih alarma, stvarni status granted/denied i jasno obaveštenje o približnom rasporedu; bez lažnog obećanja precizne isporuke.
- Porodična briga u glavnoj navigaciji; desne kontrole prikaza i podešavanja.
- Online povezivanje odrasle osobe potvrđenim emailom i ponovnim unosom lozinke. Serverska pravila odbijaju anonimne/nepotvrđene naloge.
- Privatne porodične prijave zapisa/članova, lokalno blokiranje autora, opoziv svih tekućih pozivnica pri uklanjanju člana i brisanje prijava uz porodicu.
- Zaštita HTML atributa od oblikovanih Firestore identifikatora; regresioni test bez izvršavanja umetnutog HTML-a.
- Serverski zaštićene moderatorske uloge, neizmenjiva evidencija i testovi prijave, uklanjanja, zabrane i vraćanja pristupa u emulatoru.
- Odvojeno brisanje chat profila i zahtev za potpuno brisanje email naloga/povezanih podataka. Politika i javna stranica za brisanje ažurirane.

Tačan status aktivacije i testova je u `ACTIVATION_1_8_14_SR.md`. Aktivna produkcijska pravila određuje `firebase/ACTIVE_RULES.md`; širi korenski preview se ne objavljuje.

## Potvrda vlasnika — 23. oktobar 2026.

Vlasnik je potvrdio da alarmi rade i posle restarta telefona. Test podsetnika/restarta je prošao prema njegovoj proveri; raniji neuspešan rezultat je istorijski.

## Pre javne Play objave

1. Vlasnik lično pravi i potvrđuje pravi moderatorski Firebase nalog. Administrator dodeljuje njegovu ulogu, zatim se proveravaju stvarna prijava, uklanjanje, zabrana, podrška i obrada zahteva za brisanje. Izmišljeni emulator nalog nije ljudski moderator.
2. Vlasnik registruje Play nalog, potvrđuje identitet i prihvata ugovor/plaćanje. Jednokratna naknada je 25 USD; finansijske i ugovorne radnje ne obavlja agent.
3. Proveriti stvarnu ciljnu publiku, kontrolu društvenih funkcija, sadržaj, privatnost i Data safety prema `GOOGLE_PLAY_DATA_SAFETY_REVIEW.md`. Nema tvrdnje da potvrda emaila dokazuje uzrast ili roditeljstvo. Nema automatskog izbora svih uzrasta.
4. Pripremiti interni test. Ako se na novi lični nalog primenjuje uslov za produkcijski pristup, sprovesti zatvoreni test sa najmanje 12 stvarnih kontinuirano prijavljenih testera tokom 14 dana, pa podneti zahtev za pristup produkciji.
5. Vlasnik proverava i šalje konkretnu Console prijavu i izdanje. Google odlučuje o odobrenju. Ranija istorijska dokumenta i CI nisu dokaz ispunjenih ličnih ili vremenskih uslova.

Mediji i pozadinski chat push ostaju neaktivni u ovom izdanju. Ne unositi ih u listing kao uključene funkcije i ne uključivati naplatu/provizionisanje bez posebne odluke vlasnika.

Izvori: https://support.google.com/googleplay/android-developer/answer/6112435 ; https://support.google.com/googleplay/android-developer/answer/14151465 ; https://support.google.com/googleplay/android-developer/answer/9893335 ; https://support.google.com/googleplay/android-developer/answer/9876937 ; https://support.google.com/googleplay/android-developer/answer/13327111
