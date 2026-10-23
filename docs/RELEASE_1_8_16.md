# Pet Care World 1.8.16 (27) — public chat removed

The owner chose to remove public chat at launch to avoid its operational and moderation costs. Public room UI, connection code, push registration, moderation sign-in and chat appearance controls are removed. Old public-chat URLs show a retirement and deletion-contact notice. Optional adult-authenticated family care, private local records, backups and phone alarms remain.

The new Firestore candidate denies retired chat access for ordinary, anonymous and moderator clients, preserving family rules exactly. Production publication is pending owner Firebase sign-in; until verified, older installed versions may still access the previous production chat rules. Historical server data and Auth accounts have not been deleted. Contact-based deletion remains available. No Blaze upgrade, paid backend or automatic moderation deployment is authorized or performed.

Family sharing still uses Firebase Auth/Firestore quotas and contains closed-group user content. Its reporting, blocking, owner controls, deletion and accurate audience/Data Safety review remain relevant. Removing public chat does not mean Play approval, completion of owner registration or approval for all ages. Owner already confirmed physical phone alarms after reboot on 23 October.

Validation: local syntax, record safety, startup privacy, family mode, reminder scheduling and backup tests; browser/Android and family/rules CI must pass before release publication.
