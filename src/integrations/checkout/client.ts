// Supabase client for the Inherit Your Freedom checkout backend
// (create-checkout-session, get_order_by_session). This is a DIFFERENT
// Supabase project (gprrntuvxyzyjbwgqwce) than the one `@/integrations/supabase/client`
// points at - see supabase-checkout/README.md for why.
//
// Reuses the existing VITE_LEADS_SUPABASE_* vars (already configured for this
// same project's submit-lead function) rather than adding redundant env vars.
import { createClient } from "@supabase/supabase-js";

const CHECKOUT_SUPABASE_URL = import.meta.env.VITE_LEADS_SUPABASE_URL || "https://placeholder.supabase.co";
const CHECKOUT_SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_LEADS_SUPABASE_PUBLISHABLE_KEY || "placeholder-key";

export const checkoutSupabase = createClient(CHECKOUT_SUPABASE_URL, CHECKOUT_SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
