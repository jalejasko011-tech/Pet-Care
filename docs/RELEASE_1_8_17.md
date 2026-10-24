# Pet Care World 1.8.17 (28)

The final source review found gaps in local pet deletion, account deletion discoverability and family recovery. This release removes the obsolete moderator link; adds a prominent account/data deletion resource in Settings, Family care and adult sign-in; and allows an existing family member to restore device links by family ID after password authentication. The server independently checks membership; an ID never grants a new member access.

Deleting a pet now removes its records across every local collection, Gallery, Memories and drafts. A durable local intent prevents media deletion before successful record persistence, resumes interrupted cleanup after reload and preserves other pets. Backups/imports are paused during unfinished cleanup, with an exception for validated recovery of corrupt core records. Exported/shared copies and separate server families require their own deletion controls.

Existing-account sign-in no longer applies the new-account password-length requirement. New accounts still require at least 12 characters. Public chat, paid moderation, media upload, remote push, subscriptions and advertising remain inactive. No production Firebase rule change is required; the tested family-only rules are unchanged.

The optional undeployed Functions lockfile updates body-parser 2.3.0 to 2.4.0 for GHSA-27r3-jxmh-p828; the dependency audit reports no remaining vulnerabilities. This does not deploy or activate server services.

Required checks: web syntax/record/reminder/backup/privacy tests; mobile-browser failure/reload/account-link cases; verified family recovery and outsider denial; Android 36 native/offline/reboot checks; dependency audit; signed APK/AAB package/source comparison. Final evidence is recorded in ACTIVATION_1_8_17_SR.md after completion.

This does not constitute owner Play registration, completed Console declarations, actual closed testing, a human translation review, production account-deletion handling or Google approval.
