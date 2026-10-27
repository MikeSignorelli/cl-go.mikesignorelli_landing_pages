// Stripe webhook for Inherit Your Freedom checkout orders. Stripe calls this
// directly (no Supabase auth header), so it's deployed with
// --no-verify-jwt. Deployed to project gprrntuvxyzyjbwgqwce (see ../README.md).

import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!stripeKey || !webhookSecret) {
    console.error("stripe-webhook: STRIPE_SECRET_KEY/STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook not configured", { status: 500, headers: corsHeaders });
  }
  if (!supabaseUrl || !serviceKey) {
    console.error("stripe-webhook: SUPABASE_URL/SERVICE_ROLE_KEY missing");
    return new Response("Database not configured", { status: 500, headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400, headers: corsHeaders });
  }

  const rawBody = await req.text();
  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("stripe-webhook: signature verification failed", (err as Error).message);
    return new Response("Webhook signature verification failed", { status: 400, headers: corsHeaders });
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        const paymentIntent = typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null;

        const { error } = await admin
          .from("orders")
          .upsert(
            {
              stripe_session_id: session.id,
              stripe_payment_intent: paymentIntent,
              price_id: session.metadata?.price_id || Deno.env.get("STRIPE_PRICE_ID") || "price_1TQsxLEJYM9YrDv1OPjC1nqg",
              quantity: Number(session.metadata?.quantity ?? 1),
              customer_email: session.customer_email ?? session.customer_details?.email ?? null,
              amount_total: session.amount_total,
              currency: session.currency,
              status: "paid",
              updated_at: new Date().toISOString(),
            },
            { onConflict: "stripe_session_id" },
          );
        if (error) console.error("stripe-webhook: upsert (paid) failed", error);
        break;
      }

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { error } = await admin
          .from("orders")
          .update({ status: "failed", updated_at: new Date().toISOString() })
          .eq("stripe_session_id", session.id);
        if (error) console.error("stripe-webhook: update (failed) failed", error);
        break;
      }

      default:
        // Ignore everything else - we only care about this checkout's lifecycle.
        break;
    }
  } catch (err) {
    console.error("stripe-webhook: handler error", err);
    // Still return 200: Stripe retries on non-2xx, and a DB hiccup here
    // shouldn't cause repeated retries for an event we've already seen.
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
