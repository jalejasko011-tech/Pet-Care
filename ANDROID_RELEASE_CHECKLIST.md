# Pet Care World Android release

Signed release APK and AAB are produced by `.github/workflows/release.yml`. Quality checks gate public APK publication. Release secrets already provide the existing key; no keystore/password is stored in source. Package is `com.petcare.companion`, 1.8.0 code 11, target/compile API 36.

- Automated browser, Firestore/Storage rules, chat media/moderation and Android emulator checks run on each PR.
- Complete private backup and merge restoration include Gallery and Memories.
- Native Back, offline records, Filesystem backup and scheduled notifications are covered on the emulator.
- Release APK signing certificate must remain `e8cdb78355aa5a08d5327dd07c050b92168e8afef6c4aa2d3c8c7f25c5736990` to update existing direct installs.
- Physical phone/OEM/reboot testing, Play internal installation and Play Protect results remain owner/device tests, not inferred from CI.
- Cloud media and background chat push are prepared but disabled pending owner backend activation. Other planned services are labeled honestly.

See `docs/RELEASE_1_8_STATUS.md`, `docs/PHONE_ACCEPTANCE_TEST.md`, `docs/PLAY_STORE_RELEASE_CHECKLIST.md` and `store-listing/` for concrete remaining steps. Never encourage bypassing Play Protect. Back up before clearing storage or uninstalling.
