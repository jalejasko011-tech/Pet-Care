# Pet Care World 1.8.20 (31)

Improve everyday form use before closed testing. Visible field captions now have native label/control associations after rendering and dynamic updates, so screen readers and label clicks identify the correct inputs. Primary buttons and form controls have a minimum 48px height; header settings/language/family controls retain their alignment. The birth-year caption is shorter so day/month/year controls align more clearly on narrow screens. Fix two Serbian fallback messages appearing in the English pet-list interface.

Creating a pet still needs only a name and species; birth date, age, chip, passport, weight and photo remain optional. Years/months and direct day/month/year entry remain available, with existing records preserved. No public chat, billing upgrade or paid backend is activated.

New mobile regression coverage checks semantic labels across seven forms, minimum-only profile creation, optional birth dates, preserved Serbian date drafts, 48px controls and overflow at 320–768px. Existing browser, family-rules and Android/reboot tests remain release gates.

Firebase production review on 26 October confirmed the full active no-chat Rules text against the tested candidate, Spark billing and Email/Password settings. The server password policy now requires 12 characters for new passwords, with Force upgrade on sign-in disabled. Actual two-device family acceptance remains pending. An isolated emulator rehearsal of associated-account deletion passed, which is not a completed production support request.

Play Console is still at developer-account signup. This release does not complete owner registration, legal identity/payment, target-audience/IARC/Data Safety submissions, real closed testing or Google approval.
