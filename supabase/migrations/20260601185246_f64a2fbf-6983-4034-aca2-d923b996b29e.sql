
CREATE TABLE IF NOT EXISTS public.processed_orders (
  session_id text PRIMARY KEY,
  email text,
  payment_status text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.processed_orders TO service_role;

ALTER TABLE public.processed_orders ENABLE ROW LEVEL SECURITY;

-- No policies: only service_role (used by edge functions) can access.
