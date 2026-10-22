# Candidate 1.8.14 (25) — 22 October 2026

This is an implementation/review candidate, not an installed APK, deployed Firebase revision or completed Play submission.

- Local care still opens without an account, entry PIN, birthday or year.
- Optional chat/family connections require adult acknowledgement, email/password and verified email; every connection requires password entry. No new anonymous sign-in is performed. Email verification is an adult action, not proof of age or parenthood.
- Legacy anonymous users can link a NEW email credential on their original device while preserving UID. A different existing account does not inherit legacy data. Do not delete old identities to work around a linking conflict; use support.
- Leaving/closing public chat, Disconnect, backgrounding or Family view closes online subscriptions. Opening Full app does not unlock online access.
- Family diary entries can be reported privately to the owner. Owners can remove reported entries and resolve reports. Other members cannot enumerate reports. Local member blocking hides that author's name/entries; support and Leave remain available for an abusive owner.
- Removing a member revokes all current codes for that family, including codes not used by that member. Family deletion also clears reports.
- Chat-profile deletion retains the email account so it cannot accidentally orphan a family. Full account/data deletion can be requested from the app or public deletion page; the developer must verify ownership and process it.
- The moderator console also requires verified email before displaying its workspace. A server-issued role is still required and cannot be self-assigned.

## Activation order

1. Pass CI including real Auth/Firestore emulators, adult credential UI, three independent family clients, reports/blocks/removal/deletion, and moderator operations under `firebase/production-adult-access.rules`.
2. Sign in to the project owner's Firebase console. Keep the prior exact revision for rollback. Deploy ONLY the tested `firebase/production-adult-access.rules`, not broad root preview rules. This changes server access: old anonymous online clients must upgrade/link before joining. It does not delete their records.
3. Verify the full deployed text against the tested candidate and use a verified real adult account. Confirm ownership, assign a narrowly scoped moderator claim through owner credentials, then test actual report/remove/ban and review the support/deletion workflow.
4. Release the matching web/Android client together with the server change. Do not publish this client while the old rules lack family report paths.

## Pending before public Play

Production activation and a real moderator remain unconfirmed. The Firebase browser session currently requires Google sign-in. No privileged credentials are available locally. No claim was granted.
The owner's phone reported exact alarms `denied` and a reboot reminder 3–4 minutes late. Enable Alarms & reminders personally, verify `granted`, repeat the 10-minute/reboot/unlock/relock test. Do not mark the OEM test passed from an emulator.
Play identity/registration/payment, actual declarations and any required 12-tester/14-day closed test remain owner tasks. No Play approval is claimed.

Primary references reviewed: https://support.google.com/googleplay/android-developer/answer/9893335 ; https://support.google.com/googleplay/android-developer/answer/9876937 ; https://firebase.google.com/docs/auth/web/manage-users ; https://firebase.google.com/docs/auth/admin/custom-claims
