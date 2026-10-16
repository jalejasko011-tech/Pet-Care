# Google Play Data safety review — version 1.6

Draft for owner review before submission. Version 1.5 adds optional public Firebase chat; previous “no data collected” declarations are no longer appropriate. Do not submit this document as a completed Console declaration.

## Actual behavior

- Pet records, photos, local community drafts and reminders stay on device unless the user deliberately exports or shares them. Private pet cloud sync is disabled.
- Chat loads Firebase Authentication and Firestore only after explicit join consent. Anonymous authentication creates a technical user ID. The nickname, text, author ID and timestamp are stored in Firestore and visible to participating users.
- Abuse reports contain reporter ID, referenced message ID, reason and timestamp. They are private to authorized moderators/project administrators.
- Firebase processes connection information needed to provide its services. Review current Firebase SDK disclosures and project settings for diagnostic/IP processing before completing exact categories.
- No advertising SDK or Analytics initialization is included. Chat has no end-to-end encryption. Transport uses HTTPS.

## Proposed categories to evaluate in Console

| Data | Purpose | Optional | Treatment |
| --- | --- | --- | --- |
| Technical user identifier | Account management, app functionality, abuse prevention | Yes, chat is optional | Stored in Authentication and chat documents |
| Nickname and public text messages | App functionality | Yes | Public to chat participants; evaluate Messages/other user-generated content and nickname/name classification |
| Abuse report text and identifiers | Safety and abuse prevention | Yes | Stored privately for owner review |
| Provider connection/diagnostic information | Service operation/security | Verify provider behavior | Review current Firebase documentation and exact Console definitions |

Evaluate “sharing” using Google's current user-initiated public-content and service-provider definitions; public visibility must still be clearly disclosed. Do not simply claim no sharing without that review. Data is not used for advertising by this app.

## Deletion and retention

Chat supports deleting one's messages and device-bound anonymous identity. The deletion page is `www/delete-chat.html`; publish it at an accessible web URL for the Play listing. Lost-device/banned-identity requests go to jalejasko011@gmail.com and require authorship verification. Private reports can be retained for abuse investigation; establish an operational retention schedule before submission. Do not promise a fixed deletion deadline that has not been implemented.

## Remaining submission work

Verify the live privacy/deletion URLs, Console answers, Firebase provider disclosures, owner moderation process and content-rating/target-audience answers. The chat requires users to attest they are 18 or older; this is self-attestation, not verified age checking. Play account setup/payment and final submission remain pending.

## Version 1.6 additions

Meal logs and schedules are local. A three-note original chime is bundled in Android res/raw and selected through channel `petcare_care_v2`. Existing phone notification settings and DND remain in control.

Photo/video code is present but `media.enabled` remains false and the bucket is empty in the shipped config. Before activation, review Photos and videos collection/public sharing, embedded metadata, Firebase Storage processing and deletion. Publish updated declarations for the activated build. Tests use local emulators, not the paid production storage service.
