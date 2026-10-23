> Aktuelno provereno i objavljeno izdanje: 1.8.15 (26), 23. oktobar 2026. Web, potpisani APK/AAB i paket preuzimanja su provereni; sva tri CI posla za izdanje i potpisana gradnja/objava su prošli. Potvrde: ACTIVATION_1_8_15_SR.md. Vlasnik je potvrdio alarm i posle restarta telefona. Firebase pravila ostaju revizija od 22. oktobra. Automatska moderacija je pripremljena i testirana u PR 29, ali nije aktivirana: čeka Blaze odluku i stvarni moderatorski nalog. Deklaracije, registracija, stvarni Play test i Google postupak ostaju otvoreni. Starije beleške ispod su istorijske.

> Historical 1.8.0 status. For the current build use `RELEASE_1_8_10.md`, `SHARED_FAMILY_ACTIVATION_SR.md` and `PHONE_ACCEPTANCE_1_8_4_SR.md`.

# Pet Care World 1.8.0 readiness

Package `com.petcare.companion`, versionCode 11. Same existing release signing key; never uninstall just to update. No Play publication or physical-device certification is implied by a signed build.

| Requested work | Implemented | Remaining external gate |
|---|---|---|
| Complete backup | Offline ZIP includes records, Gallery, Memories, drafts and settings; merge, CRC validation, rollback journal, legacy JSON import | User keeps exports outside app storage; per-ZIP limits are shown |
| Chat media and background push | Authenticated media client/rules, optional native FCM bridge, bounded fanout functions, attachment cleanup | Owner billing/bucket/functions/rules deployment, then two-device production test; both flags remain false |
| Navigation and languages | Five primary destinations, grouped More dialog, native Back, expanded SR/EN interface copy | Other selectable languages are partial and explicitly beta; full localization is not claimed |
| Moderation | Report/block, separate role-gated SR/EN console, ban/unban, remove attachment/message, private immutable client audit | Owner verifies moderator email and grants server-side role; operating moderation requires a human |
| Tests | Automated mobile browser, rules and two-client media/moderation tests, Android emulator offline/backup/Back/notification checks | Actual phone/OEM/reboot/Play installation and live FCM delivery need physical devices |
| Play preparation | Signed APK/AAB pipeline, descriptions, store art, privacy/deletion pages, review checklist and screenshot automation | Owner Play Console account/payment/identity, declarations, testing and Google review |

Do not enable media or push just to make a checklist appear complete. Do not tell users to disable Play Protect. Background reminder success after OS process eviction is not a force-stop/reboot/OEM guarantee.
