# Pet Care World

Android pet-care organizer with private device records, meal reminders, Gallery, Memories and optional public text chat. Signed releases are built by `.github/workflows/release.yml`; a public download is published only after quality checks pass at the same commit. Google Play publication is separate and has not been completed.

## Downloads and readiness

Use the repository's [Releases page](https://github.com/jalejasko011-tech/Pet-Care/releases). The 1.8.0 update uses package `com.petcare.companion`, versionCode 11 and the existing signing key. Install an update over the prior direct APK to retain app data; do not uninstall without a backup. Each release includes APK, alternative ZIP, checksums and a Play preparation ZIP containing the signed AAB and store materials.

`docs/RELEASE_1_8_STATUS.md` records exact completion and remaining external gates. Physical-device tests, owner Play account/identity/declarations and Google review are not replaced by CI. Never bypass Play Protect.

## Implemented

- Pet profiles, health/vaccination records, diary, weight, food, expenses and local reminders.
- Per-pet meal schedules, last-recorded-meal interval and the selected original Cheerful Greeting sound.
- Private Gallery and Memories with photos/videos, stories and per-pet filtering.
- Complete unencrypted ZIP backup/merge restore including records, both media collections, drafts and preferences; validation and a durable recovery journal protect interrupted restores. Displayed size limits apply.
- Independent app/chat backgrounds, text size, sound/vibration settings and private support diagnostics.
- Five primary navigation choices with a grouped More menu and shared Android Back/browser history.
- Public text chat after explicit adult consent, report/block, own-message and identity deletion. Separate role-gated moderator console and private action history; the owner must appoint a real moderator.
- Expanded Serbian/English UI. Other selectable languages are partial and explicitly beta.

## Prepared cloud features

Authenticated chat photo/video and optional background FCM alerts are implemented and emulator/mock tested, but both production flags remain OFF. Owner-approved Firebase billing, a provisioned bucket, deployed rules/functions and two-phone verification are required before activation. See `docs/CHAT_MEDIA_ACTIVATION.md` and `docs/CHAT_PUSH_ACTIVATION.md`. Public Firebase client configuration is not an administrator credential; no private key or password belongs in source.

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

CI covers browser records/media/backup recovery, Firestore/Storage access rules, two chat clients and moderator operations, push opt-in/revocation policy, dependency audits and Android WebView Back/offline/native backup/custom-sound/closed-process reminder checks. Emulator tests do not certify a physical phone, reboot/OEM behavior, live FCM delivery or Play approval.

Store descriptions/artwork: `store-listing/`. Owner checklist: `docs/PLAY_STORE_RELEASE_CHECKLIST.md`. Data safety worksheet: `docs/GOOGLE_PLAY_DATA_SAFETY_REVIEW.md`. Physical test record: `docs/PHONE_ACCEPTANCE_TEST.md`.

An iOS source build can be generated with Capacitor on a Mac/Xcode environment, but no signed iPhone release or iOS notification certification is provided.
