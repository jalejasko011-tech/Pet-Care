# Pet Care World 1.8.8 — shared family pet care

Version code 19. The Family screen now offers optional Firebase sharing for several caregivers of the same pet. An owner explicitly shares a basic pet profile, creates a reusable code and manages members. Members share new meals, walks, treatments and notes in a live diary. Codes contain 80 random bits, last at most 24 hours and admit up to 10 new members each. Only their SHA-256 digest is stored. Ownership and roles are enforced by server rules.

The local app still opens immediately without PIN, birth date, year or account. Private existing records, health history, photos, videos, memories and local alarm schedules are not automatically uploaded or merged. Shared family identity and records are excluded from local backups. Clearing app data can lose device-bound ownership; recovery/transfer is not implemented. The privacy policy and Data Safety draft describe this and the deletion controls.

Production verification on 21 October 2026: published rules exactly match firebase/production-family-candidate.rules; Anonymous Authentication is enabled. Live run https://github.com/jalejasko011-tech/Pet-Care/actions/runs/39614002015 passed three independent identities, concurrent joins, bidirectional diary, profile changes, reconnect, isolation, member removal, invite revocation and family deletion. Fictional test records and anonymous identities were cleaned up. This is browser acceptance against production, not physical-phone certification.

Emulator suites also verify privacy, forged authors/roles, expiry, exhausted codes, simultaneous final-slot joins and resumed deletion beyond 100 entries. Existing app/browser/Android quality checks must pass before publication. Keep the existing signing certificate and install over the previous version; do not uninstall to update.

Physical-phone acceptance, an operational verified moderator, Play account/payment, final declarations and Google review remain pending. Cloud chat media and background push stay disabled. No paid backend is activated.
