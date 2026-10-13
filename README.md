# Pet Care — Android + iPhone source project

This is a **mobile app source project**, not an APK, IPA, published app, or connected production service. Existing pet profiles, records, expenses and diary work offline in the embedded web UI. Data is stored **on the device only**; uninstalling/clearing app data may delete it.

## Android (computer with Android Studio and SDK)

1. Install Node.js, Android Studio, Java 17+, Android SDK.
2. `npm install`
3. `npm run check:web`
4. `npx cap add android`
5. `npx cap sync android`
6. `npx cap open android` — build/test an APK in Android Studio.

## iPhone (Mac + Xcode required)

1. `npm install`
2. `npx cap add ios`
3. `npx cap sync ios`
4. `npx cap open ios` — sign and build in Xcode.

## What is implemented

- Pet profiles and photos; health records; vaccinations; parasite care; weight history; diary; food; expenses; reminders; Serbian/English UI.
- Native **local** reminder notifications using `@capacitor/local-notifications` (request permission from Reminders tab). Notification scheduling is limited to the next 64 future user-entered reminders. Test on physical devices. These are not server push notifications.
- Shopping, deals and veterinary directory sections open web searches, **not** verified partner integrations or live availability.
- Premium page is a **non-purchasable mock-up** with transparent pricing. No real billing, ads or affiliate payments are enabled.
- AI tab links to external AI services; no embedded chat is connected.

## Required before public release

- Secure sign-in, cloud database, backups, deletion/export, privacy policy and consent; currently data is local to the device.
- Apple/Google in-app purchases with server-side purchase validation, and paid entitlement checks.
- Ad network SDK and consent management; sponsored listings marked as sponsored; actual affiliate agreements.
- Curated country-by-country emergency vet contacts, verified and periodically refreshed; do not assume web search results are emergency contacts.
- AI chat through your own server-side API, abuse controls and usage limits. **Never put an AI API key in the app.**
- Accessibility, full translation coverage, legal and medical disclaimers, app store assets, device QA, signing and store accounts.

**No accounts, API keys, store publishing rights, affiliate deals or Mac/Xcode environment were provided**, so those cannot be activated automatically.
