# Release 1.8.14 (25) — 22 October 2026

The matching web source and Firebase rules are deployed. Signed APK/AAB 1.8.14 (25) are built and verified with the existing release certificate. This is not a completed Play submission. The owner confirmed reminder/reboot acceptance on 23 October 2026; other physical-device checks are not implied. See ACTIVATION_1_8_14_SR.md for exact evidence.

- Local care still opens without an account, entry PIN, birthday or year.
- Optional chat/family connections require adult acknowledgement, email/password and verified email; every connection requires password entry. No new anonymous sign-in is performed. Email verification is an adult action, not proof of age or parenthood.
- Legacy anonymous users can link a NEW email credential on their original device while preserving UID. A different existing account does not inherit legacy data. Replacing a legacy session requires an explicit warning confirmation and is only for users who no longer need that access; cancellation preserves the identity. Do not delete old identities to work around a linking conflict; use support.
- Leaving/closing public chat, Disconnect, backgrounding or Family view closes online subscriptions. Opening Full app does not unlock online access.
- Firestore family/document identifiers are escaped before insertion into HTML attributes, closing a stored HTML-injection path for crafted identifiers. A real-client regression seeds a hostile entry ID and verifies safe rendering and correct deletion.
- Family diary entries and members can be reported privately to the owner. Owners can remove reported entries and resolve reports. Other members cannot enumerate reports. Local member blocking hides that author's name/entries; support and Leave remain available for an abusive owner.
- Removing a member revokes all current codes for that family, including codes not used by that member. Family deletion also clears reports.
- Chat-profile deletion retains the email account so it cannot accidentally orphan a family. Full account/data deletion can be requested from the app or public deletion page; the developer must verify ownership and process it.
- The moderator console also requires verified email before displaying its workspace. A server-issued claim or a private moderators/UID record with active=true is required. Client writes to these role records are always denied; only a project administrator can assign them.

## Activation status

The complete tested `firebase/production-adult-access.rules` was published in the Firebase console on 22 October 2026 at 17:07 console time. The entire copied live text matches the candidate; no unpublished draft remains. The matching source was merged in PR 28 and deployed by GitHub Pages. APK/AAB web assets match that source and the existing release certificate was verified.

## Pending before public Play

A verified real adult Firebase moderator account, administrator assignment and live human moderation/deletion operations remain unconfirmed. Google project-owner sign-in is separate from an application moderator account. Clients cannot self-assign roles. No service-account key was created or exported.

Reminder/reboot gate closed on 23 October 2026: the owner confirmed alarms work, including after a phone reboot. This physical-phone observation supersedes the earlier delayed reminder and `denied` report as the current acceptance result. No repeat is required without a new problem; unrelated device checks remain separate.

Play identity/registration/payment, actual declarations and any required 12-tester/14-day closed test remain owner tasks. No Play approval is claimed.

Primary references reviewed: https://support.google.com/googleplay/android-developer/answer/9893335 ; https://support.google.com/googleplay/android-developer/answer/9876937 ; https://support.google.com/googleplay/android-developer/answer/13327111 ; https://firebase.google.com/docs/auth/web/manage-users
