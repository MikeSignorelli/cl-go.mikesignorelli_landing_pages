// Inherit Your Freedom checkout -> Stripe Checkout Session.
// Deployed to project gprrntuvxyzyjbwgqwce (see ../README.md), separate from
// the root supabase/ project. Price is always resolved server-side; the
// client only ever sends quantity + contact/shipping details.

import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const DEFAULT_PRICE_ID = "price_1TQsxLEJYM9YrDv1OPjC1nqg";
const DEFAULT_SITE_URL = "https://cl-go-mikesignorelli.vercel.app";

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
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("create-checkout-session: STRIPE_SECRET_KEY not configured");
      return json({ error: "Payment processing is not configured" }, 500);
    }

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

    // ---- Email: optional, but must look like an email if present.
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

    const priceId = Deno.env.get("STRIPE_PRICE_ID") || DEFAULT_PRICE_ID;
    const siteUrl = Deno.env.get("SITE_URL") || DEFAULT_SITE_URL;

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: typeof email === "string" && email !== "" ? email : undefined,
      line_items: [{ price: priceId, quantity }],
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU", "NZ", "IE"] },
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
      const { error: insertErr } = await admin.from("orders").insert({
        stripe_session_id: session.id,
        price_id: priceId,
        quantity,
        customer_email: typeof email === "string" ? email : null,
        first_name: shipping.firstName,
        last_name: shipping.lastName,
        customer_phone: shipping.phone,
        shipping_street: shipping.street,
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_zip: shipping.zip,
        shipping_country: shipping.country,
        status: "pending",
      });
      if (insertErr) {
        // Don't block the redirect on a logging failure - the webhook will
        // still try to upsert this session when Stripe calls back.
        console.error("create-checkout-session: orders insert failed", insertErr);
      }
    } else {
      console.warn("create-checkout-session: SUPABASE_URL/SERVICE_ROLE_KEY missing, order not recorded");
    }

    return json({ url: session.url });
  } catch (err) {
    console.error("create-checkout-session error", err);
    return json({ error: "Could not start checkout. Please try again." }, 500);
  }
});
