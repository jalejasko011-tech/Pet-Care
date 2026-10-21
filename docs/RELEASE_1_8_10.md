# Pet Care World 1.8.10 — right-aligned header and Play readiness

Version code 21. The Family view button has a transparent background and sits on the physical right of the header. The settings gear shares the right edge above it; language selection stays left. The layout preserves readable labels and 44px touch targets at 320–768px, including RTL languages. Family care stays directly available in the main navigation. No code, birth date or year is required for entry.

Readiness review found that the live family-only production rules deny moderationAudit while the moderator console atomically writes audit entries with ban/unban/message/report operations. The narrowly scoped firebase/production-review-current.rules candidate adds only the already prepared immutable moderator audit block. It preserves all previous family and text-chat rules and keeps media/push and unrelated collections denied. A real moderator-console emulator test checks the actual production candidate; publication and human moderator authorization are separate steps.

See PLAY_READINESS_2026_10_21_SR.md for the remaining publication gates. No public Play approval, all-ages compliance or physical-device certification is claimed.
