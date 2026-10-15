# Pet Care World — Community specification (not yet live)

## Privacy decision
Users choose a public **nickname**. Never display legal names or email addresses in public posts, comments, or profiles. Authentication credentials stay private.

## Proposed features
- Public community feed: questions, experiences, pet-care tips, pet photographs and comments.
- Private messages: one-to-one conversations, initiated by request and accepted by the recipient; never expose messages to nonparticipants.
- Profile: nickname, optional pet image, voluntary bio; no public email.
- Safety: report and block, moderation queue, spam controls, content removal and account deletion.
- Consent: explicit confirmation before making a post or pet photo public; do not publish existing local pet records automatically.
- Age/child safety and content policies need review before launch.

## Suggested infrastructure
- Firebase Authentication for account identities.
- Cloud Firestore for public posts, comments, conversation membership and messages.
- Cloud Storage for optional uploaded photos.
- Firebase Security Rules enforce: author-only edits; authenticated posts; conversation reads/writes only for accepted participants; media upload by owner; server-side moderation enforcement.
- Private messaging must never be treated as end-to-end encrypted without an actual audited E2EE design.
- Use security-rule emulator tests before deploying and update Privacy Policy and Play Data safety declarations.

## State and prerequisites
This file is a design document, **not a working chat**. No Firebase project has been connected and no real-time public or private messaging has been deployed. A Firebase project controlled by the app owner and security configuration are needed before launch.

References:
https://firebase.google.com/docs/rules/rules-and-auth
https://firebase.google.com/docs/rules/insecure-rules
