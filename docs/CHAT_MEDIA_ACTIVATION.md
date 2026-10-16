# Chat attachments: prepared, not live in 1.6

Production text chat stays enabled. `www/chat-config.js` ships `media.enabled: false` and an empty bucket. No media SDK loads and no file can be uploaded in the shipped build. The disabled attachment control explains that photos/videos are not active yet.

## Concrete activation work

1. Owner explicitly approves connecting a billing account and the pay-as-you-go Blaze plan. Firebase requires it for Cloud Storage. Do not switch plans or link a card without that decision. Review region, quotas, budgets and alerts; budget alerts are not a hard spending cap.
2. In the verified `pet-care-world` project create/verify the Storage bucket. Retain the exact returned bucket name; do not guess one. Configure Storage CORS for `https://localhost`, `http://localhost` and the actual web origin to allow authenticated GET requests; the file picker/upload uses normal Firebase SDK access.
3. Deploy repository `firestore.rules` and `storage.rules` to the correct project. Cross-service Storage rules need permission to consult Firestore; accept that service permission only for this project. Rules allow attached media only at `chatMedia/{authorId}/{messageId}` with an existing matching message, a non-banned chat profile, exact size and MIME. No public read rule, arbitrary URL, token URL or overwrite is used. The normal text-message schema remains backward-compatible.
4. Configure the bucket and enable media only after emulator tests pass and live upload/read/delete are verified between two separate identities. Test both installed Android and web CORS paths before broad release.
5. Update active privacy wording and Play Data safety for photo/video collection and public user-generated media. Review reports regularly. Moderator deletion must remove the Storage object as well as the message; deleting the document alone revokes ordinary authenticated read access but leaves a billable orphan object that the owner must clean up. No automatic moderation or orphan cleanup job exists.

## Implemented flow

JPG/PNG/WebP <=10 MiB, MP4/WebM <=25 MiB; no SVG/HTML, no autoplay. A preview can be removed before sending. Captions are optional. The transaction creates the rate-limited message; Storage accepts a single matching attachment only for that message. On upload failure the client attempts rollback and shows failure; it never reports a successful send before upload completes. Other participants tap Load attachment for an authenticated download. Files are rendered through object URLs, not persistent public download-token links. Author deletion and identity deletion remove objects first, then documents. Blocking hides attachments together with the author's messages. Lost-device/banned-profile deletions need owner handling as documented.

## Wallpaper and sound

`www/chat-pets-watercolor.webp` is a compressed derivative of built-in ImageGen artwork. Prompt: gentle watercolor varied happy pet vignettes, including dog, cat, rabbit, birds, pig, guinea pig, hamster, chinchilla, ferret, hedgehog, tortoise, ornamental fish, gecko and snake, muted mint/ivory palette, no text; low-opacity behind solid message bubbles. Original generated PNG is retained separately. No third-party stock image is used.

`www/petcare_chime.wav` is an original three-tone synthesized chime. Reproduce with `python tools/generate-notification-sound.py`. It is copied into Android res/raw during build. No recorded sound or third-party music is included.
