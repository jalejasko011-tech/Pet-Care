# Pet Care World 1.8.4 — local family view

Prepared from PR #21. Version code 15. No production Firebase role, media, push backend, billing or Play submission is activated by this source change.

- Unknown/child users see local pet names and large play/rest activity controls.
- Caregivers configure adult access with an unfilled birth-date entry and a private 6–12 digit code. The date is discarded. The code is stored only as a salted PBKDF2 SHA-256 derivative (150,000 iterations). Five wrong attempts impose a 30-second cooldown.
- Adult session access expires after 15 minutes; a fresh browsing session requires the code. Family view explicitly locks and reloads the app to stop SDK listeners. Hand the device to a child only after locking.
- Public chat SDK/auth and moderator SDK loading, supplier requests, external windows, sharing and complete-backup restore/export are gated. Unknown and child users need no Firebase identity.
- Parent-control state is excluded from backups and cannot be restored as adult access. Native FCM/analytics/default Firebase collection are disabled by default in the manifest. No advertising SDK is bundled.
- Family UI is English/Serbian with English fallback for other languages. Caregiver records keep the existing language set. This is not an all-language review or a claim of Google Families/legal certification.

Validation: targeted policy tests and regression tests are included in quality CI along with mobile UI, Android emulator and chat/moderation security-rule tests. Exact-commit results must be checked before merging. Physical-phone delivery and production moderator UID/claim require separate acceptance. Local tests are not live-server proof.

Sources checked 2026-10-20:
https://support.google.com/googleplay/android-developer/answer/9893335?hl=en
https://support.google.com/googleplay/android-developer/answer/9867159?hl=en
