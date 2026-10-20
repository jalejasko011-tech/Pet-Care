# Pet Care World 1.8.3 — follow-up audit

Version name 1.8.3, Android version code 14. Updates the existing application.

Changes:
- Retains 456 offline suggestions across 43 pet categories. Replaces the duplicate
  Balkan Hound suggestion with English Foxhound; Serbian Hound keeps its old name
  as a Serbian alias. Existing custom or old breed values remain valid.
- Adds 16 missing phrases to all 24 dictionaries (801 source phrases total).
- Corrects navigation, action, health-record, meal and notification terminology
  in all 22 additional locales, including Close/Save and reminder status.
- Corrects backup and support-report privacy copy in those locales.
- Translates icon-prefixed sentences while retaining trailing punctuation.
- Separates translated captions from private breed, clinic, caregiver and task
  values in health records and daily routines.
- Preserves unfinished forms on return from another app, and selected photos
  while changing interface language. Meal history uses the selected locale.

Validation is recorded in the exact-commit GitHub quality workflow: web syntax,
locale compiler determinism, mobile browser flows, native Android smoke and
reminder/reboot/Doze tests, backup codecs, push policy and security-rule emulators.
A passing workflow is technical validation, not a guarantee that no defects exist.
Owner testing of this APK on the physical Honor phone remains pending.

Translation review remains limited: additional dictionaries originated from
machine translation. This audit fixes specific observed errors and core copy;
it is not certification of every sentence by native speakers. Legal policy pages
retain English/Serbian authoritative content. International breed names remain
international names; the list is not an exhaustive official breed registry.

No Firebase billing, Storage media, server push, Premium payments, shared family
records, live community feed or in-app AI is activated. Google Play registration,
identity checks, closed testing and store submission remain separate tasks.
