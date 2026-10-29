// Stripe webhook for Inherit Your Freedom checkout orders. Stripe calls this
// directly (no Supabase auth header), so it's deployed with
// --no-verify-jwt. Deployed to project gprrntuvxyzyjbwgqwce (see ../README.md).

import { createClient } from "npm:@supabase/supabase-js@2";
import type Stripe from "npm:stripe@17.7.0";
import { getStripeConfig, getWebhookSecret } from "./_shared/stripe.ts";
import { sendEmail } from "./_shared/sendEmail.ts";
import {
  renderAdminEmailHtml,
  renderAdminEmailText,
  renderCustomerEmailHtml,
  renderCustomerEmailText,
  type OrderEmailData,
} from "./_shared/emails/orderConfirmation.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPPORT_EMAIL = "support@mikesignorelli.com";

function buildEmailData(session: Stripe.Checkout.Session, customerName: string): OrderEmailData {
  const m = session.metadata ?? {};
  const quantity = Number(m.quantity ?? 1);

  // amount_subtotal is the book price only (shipping is a separate
  // shipping_options line, not a line_item, so it's never included in the
  // subtotal). Stripe doesn't always populate total_details.amount_shipping -
  // payment links and some legacy sessions report neither it nor
  // shipping_cost - so nothing guarantees the printed lines add up to the
  // printed total. That produced receipts reading "$1.00 + Free = $2.00".
  // Attribute any unexplained remainder to shipping, the component Stripe
  // omits. A negative remainder means the items exceed what was charged;
  // leave it rather than invent a discount.
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const subtotal = (session.amount_subtotal ?? 0) / 100;
  const discount = (session.total_details?.amount_discount ?? 0) / 100;
  const tax = (session.total_details?.amount_tax ?? 0) / 100;
  const total = (session.amount_total ?? 0) / 100;
  const reportedShipping =
    (session.total_details?.amount_shipping ?? session.shipping_cost?.amount_total ?? 0) / 100;
  const remainder = round2(total - (subtotal - discount + tax + reportedShipping));
  const shipping = remainder > 0 ? round2(reportedShipping + remainder) : reportedShipping;

  // Stripe's session creation time, not now(). Using now() would stamp the
  // moment the webhook ran, so a Stripe retry or a replay puts the wrong
  // date on the receipt and disagrees with the purchase date written to
  // the sheet.
  const purchasedAt = session.created ? new Date(session.created * 1000) : new Date();
  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id ?? "";
  const stripeMode = session.id.startsWith("cs_test_") ? "test/" : "";

  return {
    customerName,
    customerEmail: session.customer_email ?? session.customer_details?.email ?? "",
    customerPhone: m.customer_phone ?? session.customer_details?.phone ?? "",
    productName: "Inherit Your Freedom",
    quantity,
    unitPriceCents: Math.round((quantity > 0 ? subtotal / quantity : subtotal) * 100),
    subtotalCents: Math.round(subtotal * 100),
    shippingCents: Math.round(shipping * 100),
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    orderId: session.id,
    orderDate: purchasedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    orderTime: purchasedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    shippingStreet: m.shipping_street ?? "",
    shippingCity: m.shipping_city ?? "",
    shippingState: m.shipping_state ?? "",
    shippingZip: m.shipping_zip ?? "",
    shippingCountry: m.shipping_country ?? "",
    paymentMethod: (session.payment_method_types?.[0] ?? "card").toUpperCase(),
    stripeDashboardUrl: `https://dashboard.stripe.com/${stripeMode}payments/${paymentIntentId}`,
    supportEmail: SUPPORT_EMAIL,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  let config;
  let webhookSecret: string;
  try {
    config = getStripeConfig();
    webhookSecret = getWebhookSecret(config.mode);
  } catch (err) {
    console.error("stripe-webhook: Stripe config error", (err as Error).message);
    return new Response("Webhook not configured", { status: 500, headers: corsHeaders });
  }
  const { stripe, mode, priceId } = config;

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    console.error("stripe-webhook: SUPABASE_URL/SERVICE_ROLE_KEY missing");
    return new Response("Database not configured", { status: 500, headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400, headers: corsHeaders });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    // Only the current mode's webhook secret is tried - a TEST event will
    // never verify while STRIPE_MODE=live, and vice versa.
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("stripe-webhook: signature verification failed", (err as Error).message);
    return new Response("Webhook signature verification failed", { status: 400, headers: corsHeaders });
  }

  // Belt-and-suspenders: an event whose livemode doesn't match our current
  // mode should never be acted on, even if it somehow verified (e.g. the
  // same URL briefly shared between a test and a live endpoint).
  if (event.livemode !== (mode === "live")) {
    console.log(`stripe-webhook: ignoring event.livemode=${event.livemode} while STRIPE_MODE=${mode}`, event.id, event.type);
    return new Response(JSON.stringify({ received: true, ignored: "mode mismatch" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // Sends the customer confirmation + admin notification for a paid order.
  // Idempotency: an atomic `email_sent=false -> true` update acts as the
  // send lock, so two concurrent/redelivered webhook events for the same
  // session can't both send. A failed send still leaves email_sent=true
  // (the slot was claimed) with the error recorded in orders.email_error -
  // resend-order-email is the explicit, manual way to retry it.
  async function sendOrderEmails(orderId: string, session: Stripe.Checkout.Session): Promise<string> {
    const m = session.metadata ?? {};
    const customerName = `${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() || "Friend";
    const data = buildEmailData(session, customerName);

    const { data: claimed, error: claimErr } = await admin
      .from("orders")
      .update({ email_sent: true, email_sent_at: new Date().toISOString() })
      .eq("id", orderId)
      .eq("email_sent", false)
      .select()
      .maybeSingle();

    if (claimErr) {
      console.error("stripe-webhook: email claim update failed", claimErr);
      return "Failed";
    }
    if (!claimed) {
      console.log("stripe-webhook: email already sent for this order, skipping", orderId);
      return "Already Sent";
    }

    let customerResult = { success: false, error: "No customer email on session" };
    if (data.customerEmail) {
      customerResult = await sendEmail({
        to: data.customerEmail,
        subject: "Your order is confirmed - Inherit Your Freedom",
        html: renderCustomerEmailHtml(data),
        text: renderCustomerEmailText(data),
      });
    } else {
      console.warn("stripe-webhook: no customer email on session, skipping customer confirmation", orderId);
    }

    const adminEmail = Deno.env.get("ADMIN_EMAIL") || SUPPORT_EMAIL;
    const adminResult = await sendEmail({
      to: adminEmail,
      subject: `New Order #${session.id.slice(-12).toUpperCase()} - ${customerName} (${data.quantity}x Inherit Your Freedom)`,
      html: renderAdminEmailHtml(data),
      text: renderAdminEmailText(data),
    });

    await Promise.all([
      admin.from("email_logs").insert({
        order_id: orderId,
        to_email: data.customerEmail || "(none)",
        type: "customer_confirmation",
        status: customerResult.success ? "sent" : "failed",
        error: customerResult.success ? null : customerResult.error,
      }),
      admin.from("email_logs").insert({
        order_id: orderId,
        to_email: adminEmail,
        type: "admin_notification",
        status: adminResult.success ? "sent" : "failed",
        error: adminResult.success ? null : adminResult.error,
      }),
    ]);

    if (!customerResult.success || !adminResult.success) {
      const combinedError = [
        !customerResult.success ? `customer: ${customerResult.error}` : null,
        !adminResult.success ? `admin: ${adminResult.error}` : null,
      ].filter(Boolean).join("; ");
      await admin.from("orders").update({ email_error: combinedError }).eq("id", orderId);
      console.error("stripe-webhook: order confirmation email(s) failed", orderId, combinedError);
      return customerResult.success || adminResult.success ? "Partial" : "Failed";
    }

    return "Sent";
  }

  // Fire-and-forget: log a PAID order to the "inherit your freedom order to
  // google sheet" Zap. Field names must match that Zap's Google Sheets step
  // mapping (first_name, email_address, zip_code, etc). email_status is sent
  // under three key spellings since the Zap's Catch Hook step matches on the
  // exact key it first saw and we don't know which casing it was set up with.
  const zapierOrderUrl = Deno.env.get("ZAPIER_ORDER_WEBHOOK_URL");
  function notifyZapierOrderPaid(session: Stripe.Checkout.Session, emailStatus: string) {
    if (!zapierOrderUrl) {
      console.warn("stripe-webhook: ZAPIER_ORDER_WEBHOOK_URL not configured, order not sent to Zapier");
      return;
    }
    const m = session.metadata ?? {};
    const purchaseDate = session.created ? new Date(session.created * 1000) : new Date();
    fetch(zapierOrderUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        order_id: session.id,
        first_name: m.first_name ?? "",
        last_name: m.last_name ?? "",
        email_address: session.customer_email ?? session.customer_details?.email ?? "",
        phone_number: m.customer_phone ?? session.customer_details?.phone ?? "",
        address: m.shipping_street ?? "",
        city: m.shipping_city ?? "",
        state: m.shipping_state ?? "",
        zip_code: m.shipping_zip ?? "",
        product: "Inherit Your Freedom",
        quantity: String(m.quantity ?? "1"),
        payment_status: "paid",
        amount_total: session.amount_total != null ? (session.amount_total / 100).toFixed(2) : "",
        currency: (session.currency ?? "usd").toUpperCase(),
        order_date: purchaseDate.toISOString(),
        purchase_date: purchaseDate.toLocaleString("en-US", {
          year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", timeZoneName: "short",
        }),
        email_status: emailStatus,
        emailStatus: emailStatus,
        "Email Status": emailStatus,
      }),
    }).catch((err) => console.error("stripe-webhook: zapier order webhook failed", err));
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;

        // checkout.session.completed fires for async payment methods too,
        // before they've actually settled - only treat the order as paid
        // once Stripe confirms the payment itself, not just the redirect.
        if (session.payment_status !== "paid") {
          console.log(
            "stripe-webhook: session completed but payment_status is not paid yet, skipping",
            session.id,
            session.payment_status,
          );
          break;
        }

        const paymentIntent = typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null;
        const m = session.metadata ?? {};
        const customerName = `${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() || null;

        const { data: existing } = await admin
          .from("orders")
          .select("id, status")
          .eq("stripe_session_id", session.id)
          .maybeSingle();
        const alreadyPaid = existing?.status === "paid";

        const { data: upserted, error } = await admin
          .from("orders")
          .upsert(
            {
              stripe_session_id: session.id,
              stripe_payment_intent: paymentIntent,
              price_id: session.metadata?.price_id || priceId,
              quantity: Number(session.metadata?.quantity ?? 1),
              customer_email: session.customer_email ?? session.customer_details?.email ?? null,
              customer_name: customerName,
              amount_total: session.amount_total,
              currency: session.currency,
              status: "paid",
              livemode: event.livemode,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "stripe_session_id" },
          )
          .select("id")
          .maybeSingle();
        if (error) console.error("stripe-webhook: upsert (paid) failed", error);

        const orderId = upserted?.id ?? existing?.id;
        let emailStatus = "Failed";
        if (orderId) {
          emailStatus = await sendOrderEmails(orderId, session);
        } else {
          console.error("stripe-webhook: could not resolve order id, skipping emails", session.id);
        }

        if (!alreadyPaid) {
          notifyZapierOrderPaid(session, emailStatus);
        } else {
          console.log("stripe-webhook: session already marked paid, skipping duplicate Zapier notify", session.id);
        }
        break;
      }

      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { error } = await admin
          .from("orders")
          .update({ status: "failed", livemode: event.livemode, updated_at: new Date().toISOString() })
          .eq("stripe_session_id", session.id);
        if (error) console.error("stripe-webhook: update (failed) failed", error);
        // Not sent to Zapier/Google Sheet - that sheet only tracks paid orders.
        break;
      }

      default:
        // Ignore everything else - we only care about this checkout's lifecycle.
        break;
    }
  } catch (err) {
    console.error("stripe-webhook: handler error", err);
    // Still return 200: Stripe retries on non-2xx, and a DB/email hiccup
    // here shouldn't cause repeated retries for an event we've already seen.
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
