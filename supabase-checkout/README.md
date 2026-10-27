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
- `STRIPE_PRICE_ID` — optional; defaults to `price_1TQsxLEJYM9YrDv1OPjC1nqg` (the
  live price) if unset. Set this to a **test-mode** price ID while testing,
  since Stripe price IDs are mode-specific (a live price ID doesn't exist
  under a test secret key, and vice versa).
- `SITE_URL` — e.g. `https://cl-go-mikesignorelli.vercel.app` (used to build
  Stripe's `success_url`/`cancel_url`)

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are auto-injected by Supabase
for every edge function — no need to set them manually.
