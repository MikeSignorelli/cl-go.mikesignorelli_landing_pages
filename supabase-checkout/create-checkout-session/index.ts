// Inherit Your Freedom checkout -> Stripe Checkout Session.
// Deployed to project gprrntuvxyzyjbwgqwce (see ../README.md), separate from
// the root supabase/ project. Price is always resolved server-side; the
// client only ever sends quantity + contact/shipping details.

import { createClient } from "npm:@supabase/supabase-js@2";
import { getStripeConfig } from "./_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_SITE_URL = "https://cl-go-mikesignorelli.vercel.app";
// Must match the flat shipping fee shown on the checkout page (src/pages/
// InheritYourFreedomCheckout.tsx: `const shipping = 6.99;`) - that figure is
// purely cosmetic in the React state and was never actually charged, since
// the Stripe session only priced the book itself.
const SHIPPING_CENTS = 699;

interface ShippingInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim() !== "";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  try {
    let config;
    try {
      config = getStripeConfig();
    } catch (err) {
      console.error("create-checkout-session: Stripe config error", (err as Error).message);
      return json({ error: "Payment processing is not configured" }, 500);
    }
    const { stripe, mode, priceId } = config;

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return json({ error: "Invalid request body" }, 400);
    }

    // ---- Quantity: integer 1-10, never trust anything else from the client.
    const rawQty = (body as Record<string, unknown>).quantity;
    const quantity = Number(rawQty);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 10) {
      return json({ error: "Quantity must be a whole number between 1 and 10" }, 400);
    }

    // ---- Email: optional, but must look like an email if present. Passed
    // through to Stripe as customer_email so session.customer_details.email
    // is populated even if the shopper never types it into Stripe's form.
    const email = (body as Record<string, unknown>).email;
    if (email !== undefined && email !== null && email !== "") {
      if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return json({ error: "Valid email required" }, 400);
      }
    }

    // ---- Shipping: required - this ships a physical book.
    const shipping = ((body as Record<string, unknown>).shipping ?? {}) as ShippingInput;
    const requiredShippingFields: (keyof ShippingInput)[] = [
      "firstName", "lastName", "phone", "street", "city", "state", "zip", "country",
    ];
    for (const field of requiredShippingFields) {
      if (!isNonEmptyString(shipping[field])) {
        return json({ error: `Shipping ${field} is required` }, 400);
      }
    }

    const siteUrl = Deno.env.get("SITE_URL") || DEFAULT_SITE_URL;

    // ---- Verify the configured price actually exists, is active, and
    // matches the current mode - test and live prices are separate objects
    // in Stripe even when the ID format looks identical.
    const price = await stripe.prices.retrieve(priceId);
    if (!price.active) {
      console.error("create-checkout-session: configured price is not active", priceId);
      return json({ error: "Payment processing is not configured" }, 500);
    }
    if (price.livemode !== (mode === "live")) {
      console.error(`create-checkout-session: configured price does not match ${mode} mode`, priceId);
      return json({ error: `Stripe is misconfigured: price does not match ${mode} mode` }, 500);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: typeof email === "string" && email !== "" ? email : undefined,
      line_items: [{ price: priceId, quantity }],
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU", "NZ", "IE"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: SHIPPING_CENTS, currency: "usd" },
            display_name: "Shipping",
          },
        },
      ],
      metadata: {
        price_id: priceId,
        first_name: shipping.firstName ?? "",
        last_name: shipping.lastName ?? "",
        customer_phone: shipping.phone ?? "",
        shipping_street: shipping.street ?? "",
        shipping_city: shipping.city ?? "",
        shipping_state: shipping.state ?? "",
        shipping_zip: shipping.zip ?? "",
        shipping_country: shipping.country ?? "",
        quantity: String(quantity),
      },
      success_url: `${siteUrl}/inherit-your-freedom/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/inherit-your-freedom/checkout?qty=${quantity}`,
    });

    if (!session.url) {
      throw new Error("Stripe did not return a checkout URL");
    }

    // ---- Record the pending order before redirecting the customer.
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (supabaseUrl && serviceKey) {
      const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const customerName = `${shipping.firstName ?? ""} ${shipping.lastName ?? ""}`.trim() || null;
      const { error: insertErr } = await admin.from("orders").insert({
        stripe_session_id: session.id,
        price_id: priceId,
        quantity,
        customer_email: typeof email === "string" ? email : null,
        customer_name: customerName,
        first_name: shipping.firstName,
        last_name: shipping.lastName,
        customer_phone: shipping.phone,
        shipping_street: shipping.street,
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_zip: shipping.zip,
        shipping_country: shipping.country,
        status: "pending",
        livemode: session.livemode,
      });
      if (insertErr) {
        // Don't block the redirect on a logging failure - the webhook will
        // still try to upsert this session when Stripe calls back.
        console.error("create-checkout-session: orders insert failed", insertErr);
      }
    } else {
      console.warn("create-checkout-session: SUPABASE_URL/SERVICE_ROLE_KEY missing, order not recorded");
    }

    // Note: the "inherit your freedom order to google sheet" Zap is only
    // notified once Stripe confirms payment - see stripe-webhook-orders.
    // No pending/unconfirmed row is logged from here.

    return json({ url: session.url });
  } catch (err) {
    console.error("create-checkout-session error", err);
    return json({ error: "Could not start checkout. Please try again." }, 500);
  }
});
