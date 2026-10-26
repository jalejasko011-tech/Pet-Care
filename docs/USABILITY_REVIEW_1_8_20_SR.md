# Praktičnost i propusti — 1.8.20, 26. oktobar 2026.

## Pronađeno i ispravljeno

Neposredan pregled javne aplikacije pokazao je da Name/Species/Sex/Chip/Passport imaju vidljive natpise bez pravilne HTML veze sa kontrolom. To otežava imenovanje u čitaču ekrana i klik na natpis. Novi form-accessibility.js povezuje postojeće natpise sa odgovarajućim kontrolama posle rendera i dinamičkih promena, bez dodavanja obaveznih podataka ili slanja na server.

Dugmad i relevantna polja povećani su na minimum 48 CSS px visine; zupčanik je 48×48 i ostaje fizički desno. Natpis godine je kraći, tako da dan/mesec/godina stoje uredno na uskom ekranu. Kontrast sitnog pomoćnog teksta na beloj kartici povećan je sa oko 4,23:1 na 5,63:1. Ispravljene su dve zaostale srpske pet-list poruke u engleskom prikazu.

## Provereno

- Profil se može napraviti samo sa imenom i vrstom. Datum rođenja, starost, čip, pasoš, fotografija i težina ostaju opcioni.
- Sedam obrazaca ima imenovane vidljive kontrole: ljubimac, zdravlje, beleška, težina, ishrana, trošak i podsetnik.
- Dan/mesec/godina se direktno unose; neispravni/budući datumi se odbijaju. Godine/meseci ostaju alternativa. Promena jezika zadržava započeti datum i ime.
- Na širinama 320, 360, 390 i 768 px nema horizontalnog prelivanja u proveravanim obrascima; kontrole imaju proverenu minimalnu visinu.
- Prošli su browser tokovi svih postojećih sekcija, lokalno čuvanje, kopije, duplikati, puna memorija/oporavak i prikaz 24 jezika/RTL. Dodatni jezici i dalje nisu potvrda ljudske lekture.

Browser provera: CI 40367272490 / validate. Android test uključuje unos pomoću semantičke oznake Name i restart emulatora: android-smoke SUCCESS u istom CI. Potpisani build/publish 40367272553 SUCCESS; izvor d0e858f6170fcb23c00b3ad274df3911b2536b95.

Ovo nije formalna WCAG sertifikacija, test stvarnog TalkBack korisnika ili dokaz svih ponašanja fizičkih uređaja. Prvi stvarni testeri treba da provere da li bez pomoći mogu da dodaju ljubimca, zakažu podsetnik, pronađu kopiju i povežu porodicu. Uputstvo za testere navodi konkretne zadatke i privatni kanal za nalaze.

Izvori: https://developer.android.com/docs/quality-guidelines/core-app-quality ; https://developer.android.com/guide/topics/ui/accessibility/apps
