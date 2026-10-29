-- Adds email-delivery tracking to orders + a per-send audit log.
-- Run against project gprrntuvxyzyjbwgqwce.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS email_sent boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_error text;

CREATE TABLE IF NOT EXISTS public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  to_email text,
  type text,
  status text,
  error text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Service role only (edge functions) - no public access, same posture as orders.
REVOKE ALL ON public.email_logs FROM anon, authenticated;
GRANT ALL ON public.email_logs TO service_role;
