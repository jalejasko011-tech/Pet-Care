# Google Play Data safety — working assessment (not submitted)

App ID: `com.petcare.companion`. App name: Pet Care World.
Source reviewed: `README.md`, `package.json`, `capacitor.config.json`, `www/index.html` and release workflow, 15 October 2026.

| Question | Preliminary answer | Verification needed |
|---|---|---|
| Pet records transmitted to developer backend? | Firebase sync exists but is disabled by an explicit release gate | Inspect all runtime network calls in final build |
| Pet records stored locally? | Yes | Check WebView storage behavior and delete/export controls |
| Photos processed? | Yes, user-selected photos may be saved locally | Check photo picker and permission usage |
| Notifications? | Local reminders | Verify Android permission and behavior on devices |
| Ads, in-app purchases, analytics? | Not integrated in reviewed version | Audit final merged manifest and dependency graph |
| External services? | Links to external shop/vet/AI websites | Check whether links open browser or embedded WebView |
| Data shared with third parties? | Not established as none | Review Capacitor plugins, WebView and any network/SDK behavior |
| Encryption in transit? | Do not claim until off-device transmissions audited | Network test |
| Account deletion? | No active account flow in reviewed Android entry point; optional Firebase code gated off | Ensure local deletion/export controls and explain device-only storage |

**Do not copy a blanket “No data collected” declaration into Play Console without validating the final signed AAB and all SDKs.** Google defines collection as data transmitted off device, including via SDKs. Local-only processing generally is not collection for the form. Even an app that collects no user data must complete the form and link a privacy policy.

## Required before submitting
1. Add actual developer name and private privacy contact to the privacy policy; publish a public, accessible, non-editable policy URL and link it inside the app.
2. Inspect final AAB's merged manifest, permissions, SDKs and network calls; verify on physical devices.
3. Complete Play Console Data safety and other App content declarations truthfully (audience, content rating, ads, health-related functionality if applicable).
4. Register and verify the Play Console developer account and complete applicable testing requirements.
5. Revisit declarations whenever new ads, affiliate SDKs, AI, accounts, purchases or cloud sync are enabled.

Official reference: https://support.google.com/googleplay/android-developer/answer/10787469

## 15 October source correction
- Firebase module must return before SDK imports unless PETCARE_CLOUD_ENABLED is explicitly true; do not enable until consent, deletion, restore and Data safety review are complete.
- Logo is bundled locally, avoiding an automatic GitHub image request at startup.
- Optional catalog fetches expose connection metadata to the configured supplier, including on subsequent launches. Review supplier behavior before answering Data safety.
- Sharing SOS/contact details, media and world drafts is user-initiated; verify payloads and the applicable user-initiated-sharing exemption.
- Local gallery media uses IndexedDB and is not included in the JSON record export.
- Final declarations remain unsubmitted pending final AAB manifest/SDK/network audit and physical-device tests. Do not infer Google approval from a passing build.
