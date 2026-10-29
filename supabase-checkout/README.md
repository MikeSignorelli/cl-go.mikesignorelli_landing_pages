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

- `STRIPE_SECRET_KEY` — `sk_test_...` while testing, `sk_live_...` once verified
- `STRIPE_WEBHOOK_SECRET` — the signing secret for the `stripe-webhook-orders`
  endpoint specifically (a new value - do not reuse the old webhook's secret,
  since Stripe signs each endpoint with its own secret)
- `STRIPE_PRICE_ID` — **required**, no hardcoded fallback. Set this to a
  **test-mode** price ID while testing and the **live** price ID
  (`price_1TQsxLEJYM9YrDv1OPjC1nqg`) once live, since Stripe price IDs are
  mode-specific (a live price ID doesn't exist under a test secret key, and
  vice versa). `create-checkout-session` calls `stripe.prices.retrieve()` on
  this ID before every checkout and refuses to proceed if it's inactive, or
  (when `STRIPE_MODE=live`) not itself a live-mode price.
- `STRIPE_MODE` — set to `live` once the project has fully cut over to real
  charges. While set, both edge functions refuse to run with a `sk_test_`
  secret key or a non-live price ID, and `stripe-webhook-orders` ignores any
  `event.livemode === false` deliveries instead of acting on them. Leave
  unset (or anything other than `live`) during testing.
- `SITE_URL` — e.g. `https://cl-go-mikesignorelli.vercel.app` (used to build
  Stripe's `success_url`/`cancel_url`)
- `ZAPIER_ORDER_WEBHOOK_URL` — the Catch Hook URL for the "inherit your
  freedom order to google sheet" Zap (Webhooks by Zapier -> Google Sheets).
  `create-checkout-session` posts a `payment_status: "pending"` row here right
  after creating the Stripe session; `stripe-webhook-orders` posts a second
  `"paid"` or `"failed"` row once Stripe confirms the result. Field names in
  the payload (`first_name`, `email_address`, `zip_code`, `purchase_date`,
  `email_status`, etc) must match that Zap's Google Sheets step mapping
  exactly, since the Catch Hook step has no schema of its own.
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT` — the mailbox the order
  confirmations are sent from. `stripe-webhook-orders` talks SMTP directly
  rather than using a third-party email API, so these are the only email
  credentials involved. `SMTP_PORT` defaults to 465 (implicit TLS); set 587 if
  the provider wants STARTTLS. Most providers require an app-specific password,
  not the account password. Without all three of host/user/pass the function
  logs a warning and returns `Skipped (no email service)` — the order is still
  recorded and posted to the sheet, only the emails are skipped.

  The From address is `orders@mikesignorelli.com` and the admin copy goes to
  `support@mikesignorelli.com` (both set at the top of the function). The
  sending domain needs SPF and DKIM configured, or receiving servers will
  reject or spam-folder the messages whichever provider relays them.

  Supabase's own built-in email cannot be used here: it only delivers to members
  of the Supabase organisation and is documented as not for production use, so
  it would refuse to mail a customer.

  The From address defaults to the mailbox in `SMTP_USER`, because Gmail
  rewrites any From the authenticated account does not own. Set `SMTP_FROM`
  (e.g. `Mike Signorelli <orders@mikesignorelli.com>`) only after verifying
  that address under Gmail → Settings → Accounts → *Send mail as* on the
  sending account; otherwise the rewrite makes it pointless.
  `ORDER_ADMIN_EMAIL` overrides where the admin copy goes and needs no
  verification, since recipients are unrestricted.

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase
for every edge function — no need to set them manually.
