# Pet Care World — Firebase deployment status

These files are **prepared only**, not deployed to the Firebase project.

## Before activation

1. In Firebase Console enable **Authentication** and the desired sign-in provider.
2. Verify the Firebase Android app package ID matches `com.petcare.companion` in `capacitor.config.json`. Download the matching `google-services.json` and integrate it into the generated Android project during the build. Do not put service account private keys in GitHub.
3. Enable Cloud Firestore (default database) and Cloud Storage. Storage may require a billing plan; review charges before upgrading.
4. Deploy `firestore.rules` and `storage.rules` to the **correct Firebase project** after verifying the application's actual data paths. These rules permit only `users/{uid}/...` data and `users/{uid}/...` files for the signed-in user.
5. Implement Firebase SDK initialization, sign-in, data synchronization, migration from localStorage, error handling, and tests. The existing app currently saves to localStorage and does **not** yet use Firestore or Storage.
6. Test authorization: user A cannot read or write user B's records/files; anonymous access is denied; image size/type validation works.
7. Do not deploy open/test rules or publish until end-to-end tests pass.

**Important:** Adding Firebase configuration files to GitHub does not itself enable services or connect the Android app. Firebase Console actions and the correct project configuration are still required.
