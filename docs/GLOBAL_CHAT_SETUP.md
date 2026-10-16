# Global chat activation

The 1.4 APK includes a floating Chat shortcut and complete client code. The server is **disabled**, so this is not yet a live chat. No chat SDK or authentication request is made before activation and explicit acceptance.

## Deployment prerequisites

1. Connect the app owner's Firebase project using the official Firebase plugin. No admin login/token is available in this repository. Never paste administrative credentials into client configuration.
2. Enable anonymous Firebase Authentication and create Firestore. Use the top-level `firestore.rules` referenced by `firebase.json`; the older `firebase/firestore.rules` is not a deployment target.
3. Run the security emulator test: `npm install --no-save firebase@12.4.0 @firebase/rules-unit-testing@5 firebase-tools@14`, then `npx firebase emulators:exec --only firestore --project demo-petcare-chat 'node tools/test-chat-rules.mjs'`.
4. Deploy the tested rules to the verified production project. Assign a human moderator using the trusted server/Admin SDK custom claim `moderator: true`. Review `chatReports` daily; remove abusive `globalMessages`, set the author's `chatProfiles/{uid}.banned` to true, then delete resolved reports. Admin operations must never be exposed in the public client.
5. Configure `www/chat-config.js` with the project's public web config. Set `enabled: true` only when authentication, rules, deletion, moderation and the updated disclosures are verified. Pet-record cloud synchronization stays separately disabled.
6. Test on two independent devices/contexts: accept public-room rules; send and receive; delete one message; report; block/unblock; close/reopen; disconnect/reconnect; delete all own messages and identity. Verify only the accepted nickname/text/time/technical ID are public. No local pet records are uploaded.
7. Replace the disabled-release wording in chat privacy and update the main privacy policy and Play Data Safety review for Firebase identity, public user-generated text, technical IDs, reports, connection information and retention. Complete the Play UGC and audience declarations and a public deletion request procedure before store submission. No claim of E2EE or automatic moderation is made.

## Boundaries

Text-only public room, newest 100 messages, a 1000-character message limit, and a server-enforced minimum five-second interval between ordinary sends. Anonymous identity is device-based and is not recoverable after clearing app data. It is not durable abuse prevention: repeated identity creation can evade bans; App Check, quotas and stronger identity/anti-abuse controls must be evaluated before a broad public launch. Blocking filters the blocked author's messages locally, not their ability to read the public room. Reports are readable only by moderators. Deletion removes own public messages and auth identity; moderators handle deletion requests after device identity loss. Do not enable public launch without moderation coverage.
