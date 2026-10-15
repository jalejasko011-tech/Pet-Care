# Pet Care World — Google Play Data safety preparation

Prepared 15 October 2026 for package `com.petcare.companion`, release source `869ceab2583a0e6a9b5135ce2db18ff539c08fff` (API 36). This is a submission worksheet, not a submitted declaration or Google approval.

Public policy: https://jalejasko011-tech.github.io/Pet-Care/www/privacy.html
Developer: Jale. Privacy/support contact: jalejasko011@gmail.com.

## Release behavior and form answers

| Form item | Prepared answer and evidence |
|---|---|
| User accounts | No account creation or sign-in in the Android app. Firebase cloud module is gated off before SDK imports; no user-account deletion URL applies to this release. The developer's Play Console login is separate from app users. |
| Pet records | Pet profiles, health records, weights, costs, diary and reminders stay in WebView localStorage. Local-only processing is not off-device collection for Data safety. |
| Photos and videos | User-selected media stays on device (profile photos/localStorage, gallery/IndexedDB). No automatic media upload. File selection and device notification permissions support those features. |
| Contact details and city | Optional SOS/contact/family/community data stays local. Sharing is only through a user action and the chosen recipient app. Do not describe local drafts as a public social feed. |
| Collection/sharing question | Candidate answer: **No**, only for the reviewed local-only release with cloud disabled, no supplier catalog configured, and no ads/analytics SDK. User-initiated shares and open-web navigation must meet Google's exemptions. Do not submit this answer for another build or enabled cloud/catalog integration without reassessment. |
| Optional supplier catalog | A user-configured HTTPS feed causes network requests on launch and refresh and exposes connection metadata to that endpoint. No feed is configured by this release. Supplier logging and data practices are not verified; connect no production supplier before reassessing the form and policy. |
| Analytics / ads | No analytics or advertising SDK in package.json. Contains ads: **No** for this release. Future ads require a new review. |
| Payments / Premium | No integrated billing or checkout. Premium is planned, not purchasable. External purchases are performed by external merchants. |
| AI assistant | Opens third-party services; no integrated AI model/API or automatic pet-record upload. Store description must say external AI links, not built-in AI chat. |
| Location, contacts, SMS, calls | No location/contact/SMS/call-log reader in reviewed dependencies. Searches use terms entered by the user. No automatic GPS lookup. |
| Data encryption | Do not claim end-to-end encryption or encrypted local storage. HTTPS catalog validation exists. Follow the Console's conditional questions if collection is declared; do not claim a security certification. |
| Deletion | Individual record controls and deleting a pet remove the pet's linked records, local gallery files and private world drafts. Android Settings → Apps → Pet Care World → Storage → Clear storage removes app storage. Exported/shared copies require separate deletion. |
| Backup | JSON record export works, but does not include gallery photo/video blobs. OS-level backup/restore may operate according to device settings. Do not market developer-hosted cloud backup. |

## App-content and listing preparation

- Audience: owner must confirm the truthful intended age groups; no final audience or content-rating questionnaire has been submitted.
- No public user feed, messaging system, video-chat backend, verified emergency directory, live shop checkout or live sponsored promotions is provided. These are local drafts, external links or future functions as labeled in the app.
- Veterinary records are organizational tools, not diagnosis or veterinary treatment. Answer applicable health-content questions using the final Console questionnaire; do not invent a completed rating.
- App is free; no paid download or in-app subscription is active. Future monetization needs its own billing/ad implementation and disclosures.
- Store listing wording: “Keep local pet profiles, vaccination and care records, weight, expenses, photos and reminders. Find external veterinary, shopping and AI services. Your pet records stay on your device unless you choose to share them.”

## Verified technical results

- Signed APK and AAB builds passed from `869ceab…`; APK signing and AAB signature verification passed in release workflow 38789690378.
- Static JavaScript/privacy regression checks and dependency audit passed (no reported vulnerabilities at test time).
- Mobile Chromium: 23 tabs, two-pet create/edit/delete, record entry, persistence, export, gallery and SR/EN policy access passed.
- Android 15 and 16 emulators: installation/launch, WebView create/edit/persistence, 23 tabs, policy link, native reminder schedule/query/cancel passed.
- Public policy returned HTTP 200 with the updated text and developer contact.
- Actual background reminder delivery has a separate acceptance test; record its result in the PR before treating it as verified.

## Remaining external steps (no payment taken)

1. Confirm physical-phone installation and classify the exact Play Protect message. Emulator installation is not Play Protect acceptance. Do not disable Play Protect or promise a code/signature change will remove a Google warning.
2. Complete personal developer account registration, legal terms, USD 25 fee and identity/device verification with the account owner. These are not completed.
3. Enter this worksheet in Play Console, complete audience/content rating and other applicable declarations, upload the reviewed signed AAB and run the available Google pre-launch checks/testing requirements.
4. Submit for review only after required checks are met. Google determines approval and review timing.

Official references:
- https://support.google.com/googleplay/android-developer/answer/10787469
- https://support.google.com/googleplay/android-developer/answer/10144311
- https://support.google.com/googleplay/android-developer/answer/11926878
- https://developers.google.com/android/play-protect/warning-dev-guidance
