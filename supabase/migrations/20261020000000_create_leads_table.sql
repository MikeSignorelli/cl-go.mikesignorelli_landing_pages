CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),

  submission_date text,
  submission_time text,
  page_name text,
  page_url text,
  form_type text,

  first_name text,
  last_name text,
  email text,
  phone text,

  organization text,
  role_title text,
  church_website text,
  church_size text,
  staff_count text,
  current_tools text,
  biggest_challenge text,
  preferred_call_time text,

  num_travelers text,
  departure_date text,
  room_type text,
  payment_plan_interest text,

  city text,
  state_region text,
  country text,
  postal_code text,

  product_package text,
  amount numeric,
  currency text,
  payment_status text,
  transaction_id text,
  coupon_code text,

  message text,

  utm_source text,
  utm_medium text,
  utm_campaign text,

  lead_status text NOT NULL DEFAULT 'New',
  notes text,

  zapier_status text NOT NULL DEFAULT 'pending',
  zapier_error text
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anon can insert leads directly (defensive baseline) but can never read, modify
-- or delete them. The submit-lead edge function performs the actual insert/update
-- using the service role, which bypasses RLS entirely - this policy only matters
-- if something ever writes to `leads` straight from the browser.
CREATE POLICY "Allow anon insert" ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

GRANT ALL ON public.leads TO service_role;
