# Pet Care World 1.8.18 (29)

Pet profiles now accept age as separate Years and Months fields (0–11 months), with a numeric keyboard. Both fields may be left empty when age is unknown. Infants can be entered as 0 years and e.g. 5 months.

Exact date of birth remains available as an alternative and existing birthdays are retained when editing. An age estimate is stored with a reference date and advances by calendar months; it does not invent an exact birthday or birthday reminder. Editing another profile field preserves the original age anniversary.

Age appears in the overview and pet list. These are private local profile fields included in explicit backups. Existing Firebase family profile snapshots are unchanged; no Firebase rules or billing change is required. Public chat remains disabled. Removed a stale footer translation that still described public chat after changing language.

Validation includes calendar/leap-year cases, local backup validation, mobile create/edit/reload flows, unknown and infant ages, invalid months, existing exact birthdays, unrelated edits and mobile layout. The release pipeline additionally runs the existing browser, family rules and Android reminder/reboot checks.

This release does not complete Play Console registration, production family acceptance testing, account-deletion operations, target-audience decisions or Google review. The owner confirmed physical notification/reboot behavior previously and installation of 1.8.17 on 26 October 2026.
