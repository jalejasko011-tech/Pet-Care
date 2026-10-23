## Potvrda korisnikove konzole — 23. oktobar 2026. u 19:51

Snimak `Screenshot 2026-10-23 195106.png` prikazuje aktivnu, zvezdicom označenu reviziju od danas u 19:51 po vremenu konzole. Vidljivi početak odgovara testiranom fajlu `firebase/production-no-public-chat.rules`: potvrđen email/password uslov, pet blokova `allow read, write: if false` za chatProfiles, globalMessages, chatReports, moderationAudit i moderators, pa početak familyOwner funkcije. Prethodna revizija je juče u 17:07.

**Potvrđena je objava revizije sa vidljivim zabranama javnog chata.** Snimak ne obuhvata ceo tekst: potpuno byte-exact poređenje aktivnih pravila, provera svih preklapajućih allow uslova i produkcijski test prijavljenog klijenta još nisu urađeni. Ne predstavljati ovu potvrdu kao potpunu Firebase reviziju. Testirani lokalni kandidat i svi porodični/emulatorski testovi ostaju isti. Fotografija od 19:43 prikazuje Spark plan i No cost ($0/month); nije uključena nova naplata ili plaćeni backend.

Pristup kroz zvanični dodatak i kontrolisani preglednik i dalje nije potvrđen. Istorijski podaci nisu obrisani. Izvor aplikacije, APK/AAB i prethodno provereni potpisi nisu menjani.

---

## Prethodno zabeležen nalaz

# Pet Care World 1.8.16 (27) — public chat removed

The owner chose to remove public chat at launch to avoid its operational and moderation costs. Public room UI, connection code, push registration, moderation sign-in and chat appearance controls are removed. Old public-chat URLs show a retirement and deletion-contact notice. Optional adult-authenticated family care, private local records, backups and phone alarms remain.

The new Firestore candidate denies retired chat access for ordinary, anonymous and moderator clients, preserving family rules exactly. Production publication is pending owner Firebase sign-in; until verified, older installed versions may still access the previous production chat rules. Historical server data and Auth accounts have not been deleted. Contact-based deletion remains available. No Blaze upgrade, paid backend or automatic moderation deployment is authorized or performed.

Family sharing still uses Firebase Auth/Firestore quotas and contains closed-group user content. Its reporting, blocking, owner controls, deletion and accurate audience/Data Safety review remain relevant. Removing public chat does not mean Play approval, completion of owner registration or approval for all ages. Owner already confirmed physical phone alarms after reboot on 23 October.

Validation: local syntax, record safety, startup privacy, family mode, reminder scheduling and backup tests passed. PR #31 quality run 39990823275 passed all three jobs: mobile browser/dependency audit, Android 36 WebView/native backup/closed-process and reboot alarms, and retired-chat denial/adult access/three-caregiver family rules and browser flows. Source merged as 7d75418d6e8e513784c5f1610aa0c37b4466feaf. Exact-source release quality and signed-package verification are recorded in ACTIVATION_1_8_16_SR.md.
