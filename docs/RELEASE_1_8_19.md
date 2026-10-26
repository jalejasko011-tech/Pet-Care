# Pet Care World 1.8.19 (30)

Choose **Pets → Edit → Pet age → Exact date of birth** to type a day and a birth year directly and choose a named month. No scrolling through years in a calendar is required. The optional calendar remains available and updates all three fields; manual changes also update the calendar value.

Existing birthdays are prefilled. Empty dates remain optional; incomplete dates, impossible dates (including February 29 in a non-leap year) and future birthdays cannot be saved. Age is calculated automatically from the selected date. Years-and-months age entry from 1.8.18 remains available.

Unfinished date fields survive interface-language changes. Only the canonical ISO birth date is stored, preserving existing backup and family profile compatibility; form-only day/month/year fields are not saved. No Firebase rules or billing changes are required.

Added validation for manual birth dates, leap years, future dates, calendar synchronization, language changes and native Android edit/reload persistence. This release does not complete production family acceptance testing or Play Console/Google approval steps.
