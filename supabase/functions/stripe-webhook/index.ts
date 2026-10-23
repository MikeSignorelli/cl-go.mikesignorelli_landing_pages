// Stripe webhook -> fires notify-order server-side on checkout.session.completed,
// so confirmation emails + Zapier/Google Sheet rows happen even if the customer
// never lands on the thank-you page (closed the Stripe tab, etc.).
//
// notify-order is idempotent (processed_orders table), so it's safe if both
// the browser thank-you call AND this webhook fire for the same session.

import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import { classifySession, type SessionLike } from "../_shared/iyf-order.ts";

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

  const stripeKey = Deno.env.get("Stripe_Lovable_Chcckout");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey) {
    console.error("stripe-webhook: Stripe key not configured");
    return new Response("Stripe key not configured", { status: 500, headers: corsHeaders });
  }
  if (!webhookSecret) {
    console.error("stripe-webhook: STRIPE_WEBHOOK_SECRET not configured");
    return new Response("Webhook secret not configured", { status: 500, headers: corsHeaders });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400, headers: corsHeaders });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("stripe-webhook: signature verification failed", (err as Error).message);
    return new Response(`Webhook signature verification failed`, { status: 400, headers: corsHeaders });
  }

  console.log("stripe-webhook: received event", event.type, event.id);

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionId = session.id;

    // Pre-filter: only Inherit Your Freedom book checkouts go to notify-order.
    // notify-order re-verifies against Stripe (incl. line items) before any side effect.
    const check = classifySession(session as unknown as SessionLike);
    if (!check.eligible) {
      console.log("stripe-webhook: ignoring non-IYF session", sessionId, {
        reason: check.reason,
        mode: session.mode,
        payment_link: session.payment_link ?? null,
        subscription: session.subscription ?? null,
      });
      return new Response(JSON.stringify({ received: true, ignored: check.reason }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL");
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (!supabaseUrl || !serviceKey) {
        throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing");
      }

      // Call notify-order server-to-server. It is idempotent via processed_orders.
      // We include the purchase date based on the event creation time.
      const purchaseDate = new Date(session.created * 1000).toISOString();

      const r = await fetch(`${supabaseUrl}/functions/v1/notify-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ 
          session_id: sessionId,
          purchase_date: purchaseDate 
        }),
      });
      const body = await r.text();
      if (!r.ok) {
        console.error("stripe-webhook: notify-order failed", r.status, body);
      } else {
        console.log("stripe-webhook: notify-order ok", sessionId, body);
      }
    } catch (err) {
      console.error("stripe-webhook: handler error", err);
      return new Response("Handler error", { status: 500, headers: corsHeaders });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
