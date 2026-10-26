## Priprema 1.8.20 (31) — praktičnost i pristupačnost

Ispravlja veze između naziva polja i kontrola, povećava površine za dodir i sređuje preostale EN poruke. Završetak se potvrđuje tek odgovarajućim CI i potpisanim izdanjem. Firebase provera od 26.10 i uputstva su u docs/FIREBASE_REVIEW_2026_10_26_SR.md i docs/START_PLAY_TEST_1_8_20_SR.md. Play nalog još zahteva registraciju vlasnika.

## Aktuelno — 1.8.19 (30), 26. oktobar 2026.

Potpisano izdanje: https://github.com/jalejasko011-tech/Pet-Care/releases/tag/v1.8.19 . Aplikacija ima direktan dan/mesec/godina unos rođenja i odvojene godine/mesece. Javni chat nije uključen. Firebase cela aktivna pravila su neposredno poređena, Spark je potvrđen, nova lozinka na serveru zahteva 12 znakova uz isključen forced sign-in upgrade. Izolovana proba brisanja naloga je prošla; stvarno porodično prihvatanje i obrada zahteva ostaju posebni koraci.

Trenutni plan i Play granice: docs/RELEASE_1_8_STATUS.md, docs/PLAY_CONSOLE_ANSWERS_1_8_19_SR.md, docs/ACCEPTANCE_1_8_19_SR.md i docs/TESTER_GUIDE_1_8_19_SR.md. Play Console je još na registraciji; nema opt-in linka ili Google odobrenja.

---

# Pet Care World

Android pet-care organizer with private device records, meal reminders, Gallery, Memories and optional adult-authenticated family care. Signed releases are built by `.github/workflows/release.yml`; a public download is published only after quality checks pass at the same commit. Google Play publication is separate and has not been completed.

The 1.8.17 review also completes durable local pet/media deletion, family-ID recovery and a prominent account-deletion resource. Current owner/Play worksheets are `docs/PLAY_CONSOLE_ANSWERS_1_8_17_SR.md`, `docs/ACCEPTANCE_1_8_17_SR.md` and `docs/OWNER_ACCOUNT_DELETION_SR.md`.

## Downloads and readiness

Use the repository's [Releases page](https://github.com/jalejasko011-tech/Pet-Care/releases). The 1.8.17 update uses package `com.petcare.companion`, versionCode 28 and the existing signing key. Install an update over the prior direct APK to retain app data; do not uninstall without a backup. Each release includes APK, alternative ZIP, checksums and a Play preparation ZIP containing the signed AAB and store materials.

`docs/ACTIVATION_1_8_17_SR.md` and `docs/RELEASE_1_8_STATUS.md` record exact completion and remaining external gates. Physical-device tests, owner Play account/identity/declarations and Google review are not replaced by CI. Never bypass Play Protect.

## Implemented

- Pet profiles, health/vaccination records, diary, weight, food, expenses and local reminders.
- Per-pet meal schedules, last-recorded-meal interval and the selected original Cheerful Greeting sound.
- Private Gallery and Memories with photos/videos, stories and per-pet filtering.
- Complete unencrypted ZIP backup/merge restore including records, both media collections, drafts and preferences; validation and a durable recovery journal protect interrupted restores. Displayed size limits apply.
- App backgrounds, text size, sound/vibration settings and private support diagnostics.
- Five primary navigation choices with a grouped More menu and shared Android Back/browser history.
- Public chat has been removed since 1.8.16. Family care retains verified adult sign-in, reusable invitation codes, private reports, local blocking and owner controls. Historical chat deletion requests remain available through the privacy contact.
- Expanded Serbian/English UI. Other selectable languages are partial and explicitly beta.

## Prepared cloud features

Public chat, its push registration and moderator sign-in are retired. No Blaze upgrade or Functions deployment is part of this release. The family-only Firestore candidate is `firebase/production-no-public-chat.rules`; the owner’s Console screenshot confirms a new active revision with the expected public-chat denial blocks at 19:51 on 23 October. Full-text comparison and an authenticated production-client test remain unverified because the screenshot shows only the beginning. Do not deploy root preview rules or revive automatic moderation PR #29. Historical activation documents are not the current plan.

Pet records remain on device. Community posts and family lists are local drafts/lists, not a shared social feed or synchronized family account. Shop/vet/AI links open external services. Integrated purchases, advertising, paid Premium and embedded AI are not active; they are optional future work, not requirements to use the organizer.

## Build Android

Use Node 22, Java 21 and Android SDK 36:

```sh
npm ci
npm run check:web
npx cap add android
node tools/configure-android.mjs
npx cap sync android
npx cap open android
```

Release CI signs APK/AAB using existing GitHub signing secrets, never committed keystores. The optional backend has its own locked dependencies in `functions/` and needs a trusted owner deployment identity.

## Verification and Play handoff

CI covers browser records/media/backup recovery, retired-chat denial and adult-authenticated multi-caregiver family access rules, dependency audits and Android WebView Back/offline/native backup/custom-sound/closed-process reminder checks. Emulator tests do not certify a physical phone, reboot/OEM behavior, live FCM delivery or Play approval.

Store descriptions/artwork: `store-listing/`. Owner checklist: `docs/PLAY_STORE_RELEASE_CHECKLIST.md`. Data safety worksheet: `docs/GOOGLE_PLAY_DATA_SAFETY_REVIEW.md`. Physical test record: `docs/PHONE_ACCEPTANCE_TEST.md`.

An iOS source build can be generated with Capacitor on a Mac/Xcode environment, but no signed iPhone release or iOS notification certification is provided.
