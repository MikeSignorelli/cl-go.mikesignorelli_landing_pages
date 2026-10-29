# Inherit Your Freedom — Stripe Checkout (orders)

Deployed to project **`gprrntuvxyzyjbwgqwce`** — the same project the root
`supabase/` folder's functions (`create-checkout`, `notify-order`,
`stripe-webhook`, `submit-lead`) already run on (see the comment at the top
of `supabase/config.toml`: the original `dnhvlilceqasarkovoht` project became
inaccessible to the team, and everything was moved here). This folder exists
separately from `supabase/` purely to avoid a **function name collision** —
the root project already has a function called `stripe-webhook`, so this
one's webhook is named `stripe-webhook-orders` instead. Deploying a function
under an existing name overwrites it in place, and the existing
`stripe-webhook` is still live and wired to a real registered Stripe webhook
endpoint - renaming avoids silently breaking it mid-migration.

Deploy with the Supabase CLI:

```bash
supabase functions deploy create-checkout-session --project-ref gprrntuvxyzyjbwgqwce
supabase functions deploy stripe-webhook-orders --project-ref gprrntuvxyzyjbwgqwce --no-verify-jwt
```

Apply `migration.sql` via the Supabase SQL editor (the `orders` table is new;
it doesn't touch the existing `processed_orders`/`leads` tables).

## Why this replaces the old checkout, and what "replace" means here

The site's `/inherit-your-freedom/checkout` page previously posted to
`create-checkout`, which (via `stripe-webhook` + `notify-order`) emails a
receipt and logs the order to a Google Sheet via Zapier, recording dedupe
state in `processed_orders`. Per explicit instruction, this new
`orders`-table-backed flow **replaces** that integration for the live
checkout button:

- The frontend's "Continue to Payment" now calls `create-checkout-session`
  instead of `create-checkout`.
- Stripe's registered webhook endpoint needs to be switched from
  `.../functions/v1/stripe-webhook` to `.../functions/v1/stripe-webhook-orders`
  (see the setup checklist) - until that switch happens, Stripe keeps calling
  the *old* webhook, which is harmless since nothing points the checkout
  button at the old `create-checkout` anymore.
- `create-checkout`, `notify-order`, and `stripe-webhook` are left deployed
  and untouched (not deleted), so the email-receipt + Google Sheet logging
  behavior they provide can be restored quickly if anything here needs to be
  rolled back. They will simply stop receiving new invocations once the
  frontend and the Stripe webhook registration are switched.

## Required secrets (set on gprrntuvxyzyjbwgqwce, never in frontend code)

These are new secret names, separate from the existing `Stripe_Lovable_Chcckout`
secret the old `create-checkout`/`notify-order` functions read - set them
fresh rather than reusing that one, since this is the point where the project
is meant to be cut over.

### Stripe TEST/LIVE switch

Both key sets are kept as secrets at the same time; `STRIPE_MODE` picks which
one `_shared/stripe.ts`'s `getStripeConfig()`/`getWebhookSecret()` use, so
switching modes is a secret change, not a redeploy.

- `STRIPE_MODE` — `test` or `live`. Selects every `_TEST`/`_LIVE` suffixed
  secret below. While `live`, both edge functions refuse to run with a
  mismatched (`sk_test_...`) key or a non-live-mode price, and
  `stripe-webhook-orders` ignores any `event.livemode === false` deliveries
  instead of acting on them.
- `STRIPE_SECRET_KEY_TEST`, `STRIPE_SECRET_KEY_LIVE` — `sk_test_...` /
  `sk_live_...`.
- `STRIPE_WEBHOOK_SECRET_TEST`, `STRIPE_WEBHOOK_SECRET_LIVE` — the signing
  secret for the `stripe-webhook-orders` endpoint, one per Stripe webhook
  registration (test mode and live mode are registered separately in the
  Stripe dashboard, each with its own secret - do not reuse the old
  `stripe-webhook` function's secret).
- `STRIPE_PRICE_ID_TEST`, `STRIPE_PRICE_ID_LIVE` — **required**, no hardcoded
  fallback. Price IDs are mode-specific (a live price ID doesn't exist under
  a test secret key, and vice versa). `create-checkout-session` calls
  `stripe.prices.retrieve()` on the active one before every checkout and
  refuses to proceed if it's inactive, or (in live mode) not itself a
  live-mode price. The live price is `price_1TQsxLEJYM9YrDv1OPjC1nqg`.
- `SITE_URL` — e.g. `https://cl-go-mikesignorelli.vercel.app` (used to build
  Stripe's `success_url`/`cancel_url`)

### Google Sheet logging

- `ZAPIER_ORDER_WEBHOOK_URL` — the Catch Hook URL for the "inherit your
  freedom order to google sheet" Zap (Webhooks by Zapier -> Google Sheets).
  `create-checkout-session` posts a `payment_status: "pending"` row here right
  after creating the Stripe session; `stripe-webhook-orders` posts a second
  `"paid"` or `"failed"` row once Stripe confirms the result. Field names in
  the payload (`first_name`, `email_address`, `zip_code`, `purchase_date`,
  `email_status`, etc) must match that Zap's Google Sheets step mapping
  exactly, since the Catch Hook step has no schema of its own.

### Order confirmation email

`stripe-webhook-orders`, `send-test-email`, and `resend-order-email` each send
through the shared `_shared/sendEmail.ts` helper: SMTP (nodemailer, port 465
implicit TLS) first, falling back to the Resend HTTP API if SMTP isn't
configured or the send itself fails. Supabase Edge Functions block outbound
ports 25 and 587, so 465 is the only SMTP port that works at all.

- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` — the mailbox the order confirmations
  are sent from. Most providers require an app-specific password, not the
  account password. Without all three, `sendEmail()` falls straight through
  to the Resend fallback below.
- `SMTP_PORT` — defaults to `465` if unset.
- `SMTP_FROM_NAME` — display name on the From header, defaults to
  "Mike Signorelli".
- `SMTP_FROM_EMAIL` — only set this once that address is verified as a
  "Send mail as" alias on the sending account (Gmail → Settings → Accounts).
  Until then, leave it unset: it defaults to the `SMTP_USER` mailbox, which is
  the one address Gmail (and most providers) never silently rewrites the From
  header to.
- `ADMIN_EMAIL` — where the admin copy of each order notification goes.
  Recipients are unrestricted, no verification needed. Falls back to
  `support@mikesignorelli.com` if unset.
- `RESEND_API_KEY` — optional fallback HTTP email API, used only when SMTP is
  unconfigured or a send fails.
- `TEST_EMAIL_SECRET` — the `x-admin-secret` header value required by
  `send-test-email` and `resend-order-email`, so these endpoints can't be
  invoked by anyone who doesn't already have this secret.

The sending domain needs SPF and DKIM configured, or receiving servers will
reject or spam-folder the messages whichever provider relays them. Supabase's
own built-in email cannot be used here: it only delivers to members of the
Supabase organisation and is documented as not for production use, so it
would refuse to mail a customer.

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase
for every edge function — no need to set them manually.
