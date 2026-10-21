# Pet Care World 1.8.6 — remove mandatory private code

Version code 17. Adult entry no longer asks users to set, repeat or enter a private code. Existing v1 code hashes/salts and session access are removed on upgrade. Local pet data is retained. The day/month/year date entry remains; the birth date is checked locally and discarded.

Unknown/child users retain the local family view. Adult access is self-declared with a birth date and is not a password-protected parental lock. It expires after 15 minutes and is not restored from backups. A new session asks for a birth date again. Switching to Family view reloads the app and closes online SDK listeners.

Supersedes the code requirements in historical 1.8.4/1.8.5 documents. Production moderator authorization, physical-phone reminder acceptance and Play submission remain pending. No paid backend service is activated.
