# Pet Care World — Android release checklist

This project currently builds a **debug** APK, not a Play Store release. Do not encourage bypassing Google Play Protect warnings.

## Before release
- [ ] Validate all pet-care flows on Android devices, including offline storage and notification permissions
- [ ] Add automated tests for pet profile creation, record editing, and reminders
- [ ] Implement data export/import or safe backup and deletion controls
- [ ] Create privacy policy, terms and accurate health disclaimer
- [ ] Review third-party dependencies and Android manifest permissions
- [ ] Create a stable release signing key, stored securely outside GitHub source; configure Play App Signing
- [ ] Configure reproducible signed AAB build with GitHub secrets (no keys in source files)
- [ ] Publish first through Google Play internal testing, confirm installation and behavior
- [ ] Complete store listing, screenshots, content rating, data safety disclosures
- [ ] Treat shop, vet directory, AI chat, Premium and ads as incomplete until real integrations are tested

Existing in-app data currently resides only on each device. Reinstalling or clearing app data may erase it.

## Release gate
Do not label debug APK as production-safe or fully finished merely because the CI build succeeds.