# Physical-phone acceptance record — reminder/reboot passed; other checks incomplete

Run on at least one current Google Play Android device and the owner's Huawei/Honor device. Record manufacturer, model, Android version, app version, date, tester and each result. Do not record pet data or credentials in a public issue.

- Install the signed update over the prior version; verify existing profiles/memories remain. Do not uninstall without a complete backup.
- Add fictional dog, cat, bird and pig profiles. Create health, weight, diary, expense and feeding entries. Edit/delete, rotate, restart and go offline.
- Use phone Back from form, settings, Memories editor, More dialog, Chat and privacy page. Each closes one layer; at the root a second Back is needed to exit.
- Create Gallery and Memories entries with both photo and playable video. Export complete ZIP, save to Files, restore on a separate clean device, compare byte counts/content and retry import to verify no duplicates.
- In More → Help and checks schedule the 10-second test. Put app in background. Check selected Cheerful Greeting, silent option, vibration, denied permission, DND and battery restrictions. Schedule a real meal/reminder, reboot and record whether it arrives. Force-stop can stop reminders until reopening; never promise otherwise.
- Text chat: two identities, consent, report/block/unblock, deletion. Media and FCM tests only after approved backend activation, following CHAT_PUSH_ACTIVATION.md.
- Install through Play internal testing and check pre-launch report, Android permissions, app links, privacy/deletion URLs and Play Protect result. Do not turn off device protection.

Current result (23 October 2026): owner-reported reminder and reboot acceptance PASSED on the owner’s phone. Other physical-device checklist items and Play Console checks remain pending unless separately recorded. Automated emulator results are recorded separately in GitHub Actions, never filled in here as physical passes.

## Owner phone observations — 18 October 2026

Version 1.8.0 installed. Owner reported background/sound test and locked-screen reminder succeeded after Huawei manual App launch settings (all three options on). A later reminder after reboot/first unlock/relock arrived only when unlocked again: FAILED reboot/locked-screen acceptance. Exact-alarm access and native scheduling changes in 1.8.1 require a new physical-device test. No pass is inferred from emulator tests.

## Owner phone observations — 22 October 2026

The owner confirmed the short diagnostic notification was received. For the
separate ordinary reminder set ten minutes ahead, the owner rebooted, unlocked
once and relocked the phone. The notification arrived approximately three to
four minutes late. Result: FAILED delivery-time acceptance after reboot.
The exact installed app version, exact-alarm permission after reboot and
manufacturer battery/background settings have not been confirmed for this run.
Do not infer a cause from the delay alone or mark this case passed based on CI.

Version 1.8.12 (23) adds easier reminder date/time input and initializes it on
restored screens. That release is not a confirmed fix for this phone's delay.
Next diagnostic fact: read Exact alarms in More → Help and checks on the phone.

The owner subsequently read Exact alarms as `denied`. This is a confirmed
configuration problem, not proof of the sole cause of the delay. Grant access
through Android settings and repeat the reboot/first-unlock/relock timing test.
Version 1.8.13 improves the permission entry point and honest timing feedback;
physical timing acceptance remains failed until a new observed result.

## Owner phone observations — 23 October 2026

The owner confirmed: “alrmi su u redu proverio sam i posle restarta”.
Result: PASSED owner-reported alarms, including operation after a phone reboot.
This supersedes the earlier failed reminder/reboot acceptance as the current
status; no repeat is required without a new problem. The owner did not report
the installed version, exact permission readout, model or measured timing for
this run. No unrelated checklist item is marked passed by this observation.
