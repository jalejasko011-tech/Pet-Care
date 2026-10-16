# Global chat — version 1.5

Enabled by `www/chat-config.js` for Firebase project `pet-care-world`. Anonymous Authentication and Firestore rules were enabled by the project owner. Only public web client configuration is committed; never commit admin credentials.

The floating Chat shortcut opens an opt-in, adults-only text room. Firebase loads only after joining with nickname and explicit consent. Pet records remain local; private pet cloud sync stays disabled.

## Verification

Two separate anonymous identities successfully exchanged messages against the live project on 16 October 2026. Cross-user message deletion, access to another private chat profile and unauthenticated reads were rejected. Test messages, profiles and identities were removed. A live rate-limit timing assertion was inconclusive because intervening network requests exceeded the five-second cooldown; deterministic emulator tests cover rate limits.

CI tests Firestore authorization and two isolated browser clients, including report, block, reconnect and deletion. Check CI results before publishing.

## Owner moderation

In Firebase Console → Firestore → Data, review `chatReports` manually. Reports are private; no automatic notification or automatic moderation is implemented. Locate the referenced `globalMessages` document, review the context, delete abusive messages when warranted, and set the corresponding `chatProfiles/{authorId}.banned` to true to deny further chat access. The project owner's Console permissions allow this; no in-app moderator role has been assigned. Moderator clients would require a server-assigned `moderator: true` custom claim.

Users can delete their own messages or identity in the chat. Handle email deletion requests, especially lost-device or banned identities, manually after verifying authorship. Review reports regularly and apply the published rules consistently.

## Release

Version 1.5 uses Android versionCode 6 and the existing signing certificate so it can update version 1.4. Public release files are published only after required checks pass. Do not describe this as Google Play approval; Play signup, policy declarations and submission remain separate.
