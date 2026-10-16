# Activate optional Android chat notifications

Production flags are OFF. Text chat and local pet reminders are independent and remain available. The native Firebase client file contains public configuration only, not an administrator credential.

1. In the owner's verified Firebase project `pet-care-world`, review billing and explicitly approve Blaze if desired. Functions/Storage may incur charges. Set budgets and alerts; alerts are not a hard spending cap.
2. Confirm the actual Storage bucket exists and its location supports the chosen Functions region. The supplied Android configuration names `pet-care-world.firebasestorage.app`; a configuration name alone is not proof that the bucket is provisioned.
3. From a trusted owner environment: `npm --prefix functions ci`, then `firebase deploy --only firestore:rules,storage,functions --project pet-care-world`. The CLI needs the owner's authenticated account or a least-privilege deployment identity. Never paste credentials into chat or commit them.
4. Deploy exact tested rules, grant cross-service Firestore access for Storage rules as required, configure authorized origins, enable Email/Password for moderators and Anonymous for consumer chat. Review `CHAT_MEDIA_ACTIVATION.md`.
5. Enroll a verified owner moderator account at the separate `www/moderator.html` console. Run `node tools/grant-moderator.mjs VERIFIED_UID` from an authenticated Admin environment. Signing in or editing local storage never grants a role.
6. Test with two real Android phones on separate identities: opt-in/permission denial, text and media alert, tap opens Chat, app closed, chosen chime/silent/vibration, author block, user ban, opt-out, expired token and identity deletion. Test attachment deletion and orphan cleanup. Check Functions logs and billing. Record results; emulator/mocked bridge tests do not replace this.
7. Only after passing, make a reviewed build with `media.enabled:true`, exact bucket, and `push.enabled:true` in `www/chat-config.js`. Update privacy and Play Data safety for active photos/videos, messaging identifiers and tokens. Notify users of the separate opt-in.

Each opted-in identity has one subscription (the app's identity is device-bound), bounded pages of 100, at most 2 concurrent function instances, duplicate delivery markers, generic notification text, blocked-author filtering and invalid-token cleanup. These are operational limits, not a cost guarantee. Review completed delivery metadata/audit/report retention with the owner and delete old private service metadata on an agreed schedule. No automatic content moderation is provided.

FCM requires compatible Google Play services. A Huawei device without them is not covered by this bridge; Huawei Push Kit integration is not implemented. Verify the actual target phone before promising background chat delivery. Local pet reminders use Android LocalNotifications separately.
