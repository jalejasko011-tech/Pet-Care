# Pet Care World — Google Play submission checklist

**Status:** Not submitted or approved by Google Play. Prepared for future Play Console registration.

## Current evidence
- Signed Android APK and AAB build: https://github.com/jalejasko011-tech/Pet-Care/actions/runs/38741678047 — successful.
- App ID: `com.petcare.companion`. Public developer display name requested: **Jale**.
- Contact: jalejasko011@gmail.com.
- Privacy page source: `www/privacy.html`. In-app footer links to `privacy.html`.
- Candidate public URL (verify in a browser before submitting): https://jalejasko011-tech.github.io/Pet-Care/privacy.html
- Data safety assessment: `docs/GOOGLE_PLAY_DATA_SAFETY_REVIEW.md`.

## Not yet verified
- Public privacy URL opens for visitors without login.
- Signed AAB installs and works on a physical Android device via Play internal testing.
- Merged Android permissions and network/SDK behavior match Data safety answers.
- Correct Play target SDK, content rating, screenshots, app icon, feature graphic and store listing.
- Whether any health-app declaration is required for pet-health features.
- All user-facing claims accurately describe currently implemented functionality.

## Play Console owner steps (cannot be performed without account)
1. Create and verify a personal or organization developer account using truthful identity information and pay Google's registration fee.
2. Create the app listing for Pet Care World and set developer display name if allowed by the account.
3. Upload the AAB to internal testing; review Play's automatic checks.
4. Complete App content, Data safety, privacy policy, target audience, content rating, ads and other applicable declarations.
5. Satisfy closed-testing rules if they apply to the account, then apply for production access and submit for review.
6. Google decides approval. No guarantee of approval or publication.

**Security:** Never commit the release keystore or passwords. Back up the keystore and its passwords securely outside the GitHub repository.

Official guidance:
- https://support.google.com/googleplay/android-developer/answer/10787469
- https://support.google.com/googleplay/android-developer/answer/10144311
