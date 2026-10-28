-- Inherit Your Freedom — Stripe Checkout orders table.
-- Run against project gprrntuvxyzyjbwgqwce (NOT the root supabase/ project).

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id text UNIQUE NOT NULL,
  stripe_payment_intent text,
  price_id text NOT NULL,
  quantity int NOT NULL,
  customer_email text,

  -- Shipping details, collected on the checkout page (physical book order).
  first_name text,
  last_name text,
  customer_phone text,
  shipping_street text,
  shipping_city text,
  shipping_state text,
  shipping_zip text,
  shipping_country text,

  amount_total int,
  currency text,
  status text NOT NULL DEFAULT 'pending',
  -- Whether this order was created against Stripe's live or test mode, so a
  -- test-mode order can never be mistaken for a real paid order downstream.
  livemode boolean,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- No public SELECT/INSERT/UPDATE policies: edge functions write with the
-- service role key, which bypasses RLS entirely. Anon/authenticated get no
-- direct table access at all - the success page reads through the RPC below
-- instead, which only ever returns one row's non-sensitive fields.
REVOKE ALL ON public.orders FROM anon, authenticated;
GRANT ALL ON public.orders TO service_role;

-- Narrow, single-row lookup for the success page: given a Stripe session id
-- (opaque, present only in the post-checkout redirect URL), return just
-- enough to render a confirmation - no email/address/payment_intent exposed.
CREATE OR REPLACE FUNCTION public.get_order_by_session(p_session_id text)
RETURNS TABLE (
  status text,
  quantity int,
  amount_total int,
  currency text,
  created_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT status, quantity, amount_total, currency, created_at
  FROM public.orders
  WHERE stripe_session_id = p_session_id
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_order_by_session(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_by_session(text) TO anon, authenticated;
