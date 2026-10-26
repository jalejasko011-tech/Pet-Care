## Aktuelno — 1.8.20 (31), 26. oktobar 2026.

Web, Firebase rules i Android/restart CI 40367272490 i potpisani build/publish 40367272553 su prošli. Direktan unos rođenja/starosti, imenovana polja, veće kontrole i čitljiviji tekst. Javni chat uklonjen. Direktna Firebase provera završena; stvarni porodični test i Play registracija još čekaju. Plan: docs/START_PLAY_TEST_1_8_20_SR.md; dokazi i granice: docs/RELEASE_1_8_STATUS.md.

---

# Pet Care World

Android pet-care organizer with private device records, meal reminders, Gallery, Memories and optional adult-authenticated family care. Signed releases are built by `.github/workflows/release.yml`; a public download is published only after quality checks pass at the same commit. Google Play publication is separate and has not been completed.

Current worksheets: `docs/START_PLAY_TEST_1_8_20_SR.md`, `docs/ACCEPTANCE_1_8_20_SR.md` and `docs/OWNER_ACCOUNT_DELETION_SR.md`.

## Downloads and readiness

Use the repository's [Releases page](https://github.com/jalejasko011-tech/Pet-Care/releases). The 1.8.20 update uses package `com.petcare.companion`, versionCode 31 and the existing signing key. Install an update over the prior direct APK to retain app data; do not uninstall without a backup. Each release includes APK, alternative ZIP, checksums and a Play preparation ZIP containing the signed AAB and store materials.

`docs/RELEASE_1_8_STATUS.md` record exact completion and remaining external gates. Physical-device tests, owner Play account/identity/declarations and Google review are not replaced by CI. Never bypass Play Protect.

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

Public chat, its push registration and moderator sign-in are retired. No Blaze upgrade or Functions deployment is part of this release. The family-only Firestore candidate is `firebase/production-no-public-chat.rules`; direct Console review on 26 October confirmed the entire active 23 October 19:51 revision matches the tested candidate after trailing-whitespace normalization. Spark is confirmed; password minimum 12 is enforced. Actual two-person production family acceptance remains pending. Do not deploy root preview rules or revive automatic moderation PR #29. Historical activation documents are not the current plan.

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
