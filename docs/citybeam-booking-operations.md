# CityBeam booking operations — 30 September 2026

## Routes
- `/citybeam/prenota` (also `/en`, `/fr`, `/es`, `/de`): new enquiry.
- `/citybeam/pratica?lang=it#access=...`: client quote, payment, materials and status. Token is removed from the address bar and retained only in sessionStorage. Server stores only SHA-256 of the 256-bit token. Links expire after 180 days; generating another link invalidates the previous one.
- `/citybeam/gestione`: office. Every data endpoint requires Sites/ChatGPT identity and the server allowlist. Public route shell contains no personal data.

## Required activation
- Set `CITYBEAM_ADMIN_EMAILS` to the owner's verified ChatGPT sign-in email (comma separated only if multiple explicitly authorized operators).
- Set dedicated `CITYBEAM_STRIPE_SECRET_KEY` and `CITYBEAM_STRIPE_WEBHOOK_SECRET` through Sites secrets, not source. Existing Risonix configuration is deliberately untouched.
- Register Stripe endpoint `https://www.kreluna.it/api/citybeam/webhook` for `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `charge.refunded`, `charge.dispute.created`.
- `CITYBEAM_PAYMENTS_ENABLED=true` is the explicit production activation gate. It stays absent/false until authorized and commercially ready. This implementation requires live keys and never represents test payments as paid.
- Final retail amounts, tax treatment, seller, cancellation/refund/rescheduling terms, content rights and deadlines must be entered in each immutable quote. No draft retail rate is seeded. Office confirms supplier availability through quote expiry and all-inclusive total before issuing a quote.
- No credentials were created or changed, no Stripe endpoint was registered, and no charge or test submission was made during implementation.

## Workflow
1. Office reviews enquiry, checks with supplier and prepares the quote in client's language.
2. Office manually sends the generated private link to the intended client. Creating a quote does not send email.
3. Client accepts immutable terms and pays through a single Stripe Checkout session. Quote total is in integer minor units; taxes are not added at checkout.
4. Signed Stripe events or explicit server-to-server reconciliation mark paid only after amount, currency, metadata, session, live mode and paid status match. Browser redirect alone never marks paid. Payments do not auto-confirm broadcast.
5. Paid clients upload up to five files, max 25 MiB each: JPEG, PNG, WebP or MP4. MIME and signatures are checked; objects are private in R2, downloads require authorization. Files are original submissions, not guaranteed technically approved creatives. Larger files need office coordination.
6. Office downloads/reviews files and records operator approval/reference to confirm. Records a separate reference when campaign completion is known.
7. Refunds/disputes are managed in Stripe, not initiated by this UI. Signed refund/dispute events mark refunded or payment_review. A review status requires office attention; it is not automatically cleared by the app.

## Operational limitations
- One immutable quote per enquiry; no editing/repricing after issue. Expired quotes require office handling and a fresh enquiry for a revised quote.
- No automatic supplier availability feed, purchase, broadcast scheduling, proof-of-play, customer email sequence or inbox-delivery guarantee.
- Admin lists latest 200 enquiries; D1 retains older entries.
- Maximum five uploads, with no self-service deletion/replacement.
- No automated functional/payment verification was performed (not requested). Production activation should include an explicitly authorized end-to-end validation before customer charging.
