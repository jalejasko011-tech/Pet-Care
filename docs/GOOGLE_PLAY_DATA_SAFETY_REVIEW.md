> Current 1.8.3 handoff: see `PLAY_CONSOLE_ANSWERS_1_8_3_SR.md`. The historical
> version notes below are not a submitted Console declaration. The owner now
> wants all ages, including preschool children; child-mode implementation and acceptance remain pending.

# Google Play Data safety review — version 1.7

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

## Version 1.7 additions

Private Memories stores per-pet stories, dates, photos and videos in local IndexedDB. No memories or appearance settings enter cloud sync or public chat. The separate user-initiated memories backup includes media, is unencrypted, and excludes the existing Gallery. Deletion of a pet removes associated memories. Standard pet-record export continues to exclude both sets of media. Local device access is not protected by a separate app account or biometric lock.

Settings offers separate app/chat wallpaper presets, text size, reminders on/off, sound and vibration choices. The selected original 1.8-second Cheerful Greeting is bundled as `petcare_cheerful.wav`; channel `petcare_cheerful_v1` is the new default. Stable alternative channels are used for explicit sound/vibration choices. Android notification permissions, volume and DND remain under device-owner control.

## Version 1.8.0 shipped configuration (supersedes earlier version notes)

- Complete ZIP export adds Gallery + Memories + records + private drafts + settings; it is user initiated, unencrypted and local until deliberately shared. Standard records-only JSON and separate Memories backup remain available with narrower coverage.
- Native FCM plugin/public client configuration are bundled with messaging auto-init and analytics collection explicitly disabled. `push.enabled:false` prevents registration before activation and user opt-in. Prepared Functions are not evidence of production deployment.
- `media.enabled:false` and empty client bucket still prevent chat photo/video uploads. Private local photos/videos do not become cloud collection merely because the media code exists.
- After push activation, evaluate the messaging registration token as a technical device/user identifier, stored subscription preferences/blocked IDs, notification delivery processing and deletion. After media activation, evaluate Photos and videos and public content sharing. Update the declaration for the activated release before distribution.
- Moderator console collects administrator email/password through Firebase Authentication only on explicit sign-in; the private queue/audit uses server-issued roles. Action records include actor/target technical IDs and action time. Decide administrative-data retention, staff access and user support before launch.
- No ads SDK, integrated purchase or pet-record cloud sync is active. The adult chat uses self-attestation; do not claim verified age screening or a child-safe public room.
- Production dependency audits reported zero known advisories for the app and the updated optional backend (Admin 14.5 / Functions 7.4) at implementation check. This is not a security certification. Re-run audits and review provider disclosures at submission.

Owner must complete Console's actual questionnaire, classification and exceptions using the exact distributed APK/AAB and live backend configuration. Do not auto-fill 'no data collected'.
