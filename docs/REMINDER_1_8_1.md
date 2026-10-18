# Reminder repair 1.8.1 (12)

1.8.0 did not declare user-granted SCHEDULE_EXACT_ALARM. Capacitor therefore falls back to inexact alarms on Android 12+, which may be delayed. The owner observed delivery only after unlocking following a reboot; missing exact access is a plausible cause, not a proven device diagnosis.

1.8.1 adds the special access declaration (not USE_EXACT_ALARM), an explained user-triggered settings button, permission status in diagnostics, rescheduling on return and when the access is granted, and serialized native sync to prevent overlapping cancel/schedule calls. Saving a reminder waits for native scheduling and reports errors/denied permission. Past dates are rejected. Reminder data and signing key remain unchanged.

Capacitor restores its persisted notifications through BOOT_COMPLETED after the first unlock; reminders before the first unlock are not promised. No personal pet data is moved to device-protected storage. Force-stop and Huawei power management still affect delivery.

Validation: mock-native concurrency/permission/error tests, browser tests, and Android CI reboot + first unlock + relock/forced-Doze delivery. Physical Huawei confirmation remains required.

After installing the update, open More > Reminders > Set up precise reminders and grant Alarms & reminders. Schedule 10 minutes ahead, restart, unlock once, relock, and do not open Pet Care until the due time. Record actual delivery time and sound.
