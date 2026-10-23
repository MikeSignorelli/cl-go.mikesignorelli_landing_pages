import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("Stripe_Lovable_Chcckout");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Stripe key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const qty = Math.max(1, Math.min(99, Number(body?.qty) || 1));
    const customer = body?.customer ?? {};

    if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      return new Response(JSON.stringify({ error: "Valid email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });

    const origin = req.headers.get("origin") || "https://go.mikesignorelli.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customer.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Inherit Your Freedom",
              description: "Special Ministry Edition by Pastor Mike Signorelli",
            },
            unit_amount: 4700,
          },
          quantity: qty,
        },
      ],
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU", "NZ", "IE"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 699, currency: "usd" },
            display_name: "Standard Shipping",
          },
        },
      ],
      payment_intent_data: { metadata: { product_type: "inherit-your-freedom" } },
      metadata: {
        // Server-controlled product marker (never taken from client input).
        product_type: "inherit-your-freedom",
        first_name: customer.firstName ?? "",
        last_name: customer.lastName ?? "",
        customer_phone: customer.phone ?? "",
        shipping_street: customer.street ?? "",
        shipping_city: customer.city ?? "",
        shipping_state: customer.state ?? "",
        shipping_zip: customer.zip ?? "",
        shipping_country: customer.country ?? "",
        quantity: String(qty),
      },
      success_url: `${origin}/inherit-your-freedom/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/inherit-your-freedom/checkout?status=cancelled`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-checkout error", err);
    return new Response(JSON.stringify({ error: "An internal error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
