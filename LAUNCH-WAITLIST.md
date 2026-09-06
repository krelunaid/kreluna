# App launch notices

The homepage shows compact CityBeam and Velvet Table cards. All five languages use the same section. Launch forms live on the project pages, never in a popup.

`app_launch_waitlist` stores the selected project, normalized email, locale, consent version and registration timestamp. Unique `(project, email)` prevents duplicates and keeps the lists separate. There is no public subscriber-list endpoint and no automatic email sending.

Existing `velvet_waitlist` data and the restaurant programme are preserved. The original Italian form remains available in the expandable restaurant section. When preparing a Velvet launch, review both customer cohorts and deduplicate with the new list; do not mix restaurant or CityBeam subscriptions.

Cancellation requests go to andrea@kreluna.it and must be processed against the specified app only. Review retention at least monthly and remove records reaching 12 months, or after the launch notice has been sent. No background purge or launch-mail scheduler has been activated by this change.

At an actual launch, confirm availability and the final app URL with the owner before changing its status. Keep the existing project page URL. Replace its waitlist form with the actual try/download link, move the card to available apps, and show a New label for the first 30 days. This is an owner-approved release step, not something triggered by a normal site deployment.

Verification: SQL-backed API tests use an in-memory SQLite database; no test subscriber is added to production. Tests cover consent, invalid inputs, cross-origin requests, duplicate registrations, app isolation and all five static CityBeam forms. Production validation uses non-writing requests.
