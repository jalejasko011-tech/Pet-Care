# Pet Care World 1.8.17 (28)

The final source review found gaps in local pet deletion, account deletion discoverability and family recovery. This release removes the obsolete moderator link; adds a prominent account/data deletion resource in Settings, Family care and adult sign-in; and allows an existing family member to restore device links by family ID after password authentication. The server independently checks membership; an ID never grants a new member access.

Deleting a pet now removes its records across every local collection, Gallery, Memories and drafts. A durable local intent prevents media deletion before successful record persistence, resumes interrupted cleanup after reload and preserves other pets. Backups/imports are paused during unfinished cleanup, with an exception for validated recovery of corrupt core records. Exported/shared copies and separate server families require their own deletion controls.

Existing-account sign-in no longer applies the new-account password-length requirement. New accounts still require at least 12 characters. Public chat, paid moderation, media upload, remote push, subscriptions and advertising remain inactive. No production Firebase rule change is required; the tested family-only rules are unchanged.

The optional undeployed Functions lockfile updates body-parser 2.3.0 to 2.4.0 for GHSA-27r3-jxmh-p828; the dependency audit reports no remaining vulnerabilities. This does not deploy or activate server services.

Android automatic cloud/device-transfer backup is disabled for private app data and verified against the installed package flags. Explicit app exports and family-ID recovery remain available; existing provider copies are not erased by an update.

Validation passed: PR quality 40084746436 and exact release-source quality 40085323707, all jobs; signed release/publish 40085323721 and Pages 40085323476. APK/AAB cryptographic signatures, all 41 source assets and compiled native privacy/permission settings were independently verified. Evidence and scoped SDK audit findings are in ACTIVATION_1_8_17_SR.md.

This does not constitute owner Play registration, completed Console declarations, actual closed testing, a human translation review, production account-deletion handling or Google approval.
