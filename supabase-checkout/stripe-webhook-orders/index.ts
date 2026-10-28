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

const ADMIN_EMAIL = "support@mikesignorelli.com";
const FROM = "Mike Signorelli <orders@mikesignorelli.com>";

/** Renders the customer order-confirmation + admin new-order emails via Resend. Returns
 * "Sent" | "Partial" | "Failed" | "Skipped (no email service)" for the Zapier/Sheet row. */
async function sendOrderEmails(session: Stripe.Checkout.Session): Promise<string> {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    console.warn("stripe-webhook: RESEND_API_KEY not configured, skipping order emails");
    return "Skipped (no email service)";
  }

  const m = session.metadata ?? {};
  const email = session.customer_email ?? session.customer_details?.email ?? "";
  const quantity = Number(m.quantity ?? 1);
  // amount_subtotal is the book price only (shipping is a separate shipping_options
  // line, not a line_item, so it's never included in the subtotal).
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const subtotal = (session.amount_subtotal ?? 0) / 100;
  const discount = (session.total_details?.amount_discount ?? 0) / 100;
  const tax = (session.total_details?.amount_tax ?? 0) / 100;
  const total = (session.amount_total ?? 0) / 100;

  // Stripe does not always populate total_details.amount_shipping - payment links
  // and some legacy sessions report neither it nor shipping_cost - and these
  // figures are each read straight from the session, so nothing guarantees the
  // printed lines add up to the printed total. That produced receipts reading
  // "$1.00 + Free = $2.00". Attribute any unexplained remainder to shipping, the
  // component Stripe omits. A negative remainder means the items exceed what was
  // charged; leave it rather than invent a discount. Mirrors computeReceipt in
  // supabase/functions/_shared/iyf-order.ts.
  const reportedShipping =
    (session.total_details?.amount_shipping ?? session.shipping_cost?.amount_total ?? 0) / 100;
  const remainder = round2(total - (subtotal - discount + tax + reportedShipping));
  const shipping = remainder > 0 ? round2(reportedShipping + remainder) : reportedShipping;

  const unitPrice = quantity > 0 ? subtotal / quantity : subtotal;
  const currency = (session.currency ?? "usd").toUpperCase();
  const fullName = `${m.first_name ?? ""} ${m.last_name ?? ""}`.trim() || "Friend";

  // Stripe's session creation time, not now(). Using now() stamped the moment the
  // webhook ran, so a Stripe retry or a replay put the wrong date on the receipt
  // and disagreed with the purchase date written to the sheet.
  const purchasedAt = session.created ? new Date(session.created * 1000) : new Date();
  const orderDate = purchasedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const orderTime = purchasedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const orderNumber = session.id.replace(/^cs_(test|live)_/, "").slice(0, 12).toUpperCase();
  const stripeMode = session.id.startsWith("cs_test_") ? "test/" : "";
  const paymentIntentId = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id ?? "";
  const stripeDashboardUrl = `https://dashboard.stripe.com/${stripeMode}payments/${paymentIntentId}`;
  const paymentMethod = (session.payment_method_types?.[0] ?? "card").toUpperCase();

  const vars: Record<string, string> = {
    customer_name: fullName,
    customer_email: email,
    customer_phone: m.customer_phone ?? session.customer_details?.phone ?? "-",
    quantity: String(quantity),
    unit_price: unitPrice.toFixed(2),
    subtotal: subtotal.toFixed(2),
    shipping: shipping.toFixed(2),
    total: total.toFixed(2),
    currency,
    order_number: orderNumber,
    order_date: orderDate,
    order_time: orderTime,
    shipping_street: m.shipping_street ?? "",
    shipping_city: m.shipping_city ?? "",
    shipping_state: m.shipping_state ?? "",
    shipping_zip: m.shipping_zip ?? "",
    shipping_country: m.shipping_country ?? "",
    payment_method: paymentMethod,
    stripe_session_id: session.id,
    stripe_dashboard_url: stripeDashboardUrl,
  };

  const render = (tpl: string) => tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? "");

  const customerTpl = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Your Order is Confirmed - Inherit Your Freedom</title></head>
<body style="margin:0; padding:0; background-color:#F6F4EE; font-family: Georgia, 'Times New Roman', serif; color:#303B30;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F4EE; padding: 40px 20px;"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#FFFFFF; border:1px solid #DEDBD3; border-radius:4px; overflow:hidden;">
      <tr><td style="background-color:#303B30; padding: 32px 40px; text-align:center;">
        <h1 style="margin:0; color:#F6F4EE; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:14px; letter-spacing:4px; text-transform:uppercase; font-weight:600;">Mike Signorelli</h1>
        <p style="margin:8px 0 0; color:#A88A5D; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Inherit Your Freedom</p>
      </td></tr>
      <tr><td style="padding: 48px 40px 24px; text-align:center;">
        <p style="margin:0 0 12px; color:#A88A5D; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Order Confirmed</p>
        <h2 style="margin:0 0 16px; color:#303B30; font-size:32px; font-weight:400; line-height:1.3;">Thank you for your order, {{customer_name}}.</h2>
        <p style="margin:0; color:#5E6E5E; font-size:16px; line-height:1.6;">Your copy of <em>Inherit Your Freedom</em> is on its way. We're honored to be part of your journey into spiritual freedom.</p>
      </td></tr>
      <tr><td style="padding: 24px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #DEDBD3; border-bottom:1px solid #DEDBD3; padding: 24px 0;"><tr><td style="padding: 24px 0;">
          <p style="margin:0 0 16px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Order Summary</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:8px 0; color:#303B30; font-size:15px;">Inherit Your Freedom &times; {{quantity}}</td><td align="right" style="padding:8px 0; color:#303B30; font-size:15px;">\${{subtotal}}</td></tr>
            <tr><td style="padding:8px 0; color:#5E6E5E; font-size:14px;">Shipping</td><td align="right" style="padding:8px 0; color:#5E6E5E; font-size:14px;">\${{shipping}}</td></tr>
            <tr><td style="padding:16px 0 0; border-top:1px solid #DEDBD3; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:600;">Total Paid</td><td align="right" style="padding:16px 0 0; border-top:1px solid #DEDBD3; color:#303B30; font-size:22px; font-weight:600;">\${{total}}</td></tr>
          </table>
          <p style="margin:16px 0 0; color:#5E6E5E; font-size:13px;">Order #{{order_number}} &middot; {{order_date}}</p>
        </td></tr></table>
      </td></tr>
      <tr><td style="padding: 0 40px 24px;">
        <p style="margin:0 0 12px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Shipping To</p>
        <p style="margin:0; color:#303B30; font-size:15px; line-height:1.7;">{{customer_name}}<br />{{shipping_street}}<br />{{shipping_city}}, {{shipping_state}} {{shipping_zip}}<br />{{shipping_country}}</p>
      </td></tr>
      <tr><td style="padding: 24px 40px; background-color:#F6F4EE;">
        <p style="margin:0 0 16px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">What Happens Next</p>
        <p style="margin:0 0 12px; color:#303B30; font-size:15px; line-height:1.7;"><strong>1. Processing.</strong> Your order is being prepared with care.</p>
        <p style="margin:0 0 12px; color:#303B30; font-size:15px; line-height:1.7;"><strong>2. Shipping.</strong> You'll receive tracking details once your book ships.</p>
        <p style="margin:0; color:#303B30; font-size:15px; line-height:1.7;"><strong>3. Delivery.</strong> Most orders arrive within 5-7 business days.</p>
      </td></tr>
      <tr><td style="padding: 32px 40px; text-align:center;">
        <p style="margin:0 0 12px; color:#5E6E5E; font-size:14px; line-height:1.6;">Questions about your order? We're here to help.</p>
        <a href="mailto:collab@mikesignorelli.com" style="color:#A88A5D; font-size:15px; font-weight:600; text-decoration:none; border-bottom:1px solid #A88A5D;">collab@mikesignorelli.com</a>
      </td></tr>
      <tr><td style="background-color:#303B30; padding: 24px 40px; text-align:center;">
        <p style="margin:0; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px;">&copy; Mike Signorelli Ministries</p>
        <p style="margin:8px 0 0; color:#A88A5D; font-size:11px;">You're receiving this email because you placed an order at mikesignorelli.com</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

  const adminTpl = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>New Order Received - Inherit Your Freedom</title></head>
<body style="margin:0; padding:0; background-color:#F6F4EE; font-family: Georgia, 'Times New Roman', serif; color:#303B30;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F4EE; padding: 40px 20px;"><tr><td align="center">
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px; background-color:#FFFFFF; border:1px solid #DEDBD3; border-radius:4px; overflow:hidden;">
      <tr><td style="background-color:#303B30; padding: 28px 40px;"><table width="100%"><tr>
        <td style="color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:13px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Admin Notification</td>
        <td align="right" style="color:#A88A5D; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Inherit Your Freedom</td>
      </tr></table></td></tr>
      <tr><td style="padding: 40px 40px 16px;">
        <p style="margin:0 0 8px; color:#A88A5D; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase;">New Order Received</p>
        <h2 style="margin:0 0 8px; color:#303B30; font-size:28px; font-weight:400; line-height:1.3;">Order #{{order_number}}</h2>
        <p style="margin:0; color:#5E6E5E; font-size:14px;">Placed {{order_date}} &middot; {{order_time}}</p>
      </td></tr>
      <tr><td style="padding: 16px 40px 24px;"><table cellpadding="0" cellspacing="0"><tr>
        <td style="background-color:#E8F0DC; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:600; padding: 8px 14px; border-radius:20px;">Payment: paid</td>
        <td style="width:8px;"></td>
        <td style="background-color:#FAF3DD; color:#8A6914; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:600; padding: 8px 14px; border-radius:20px;">Fulfillment: Pending</td>
      </tr></table></td></tr>
      <tr><td style="padding: 0 40px 24px;">
        <p style="margin:0 0 12px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Customer</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EEEA; border:1px solid #DEDBD3; border-radius:4px;"><tr><td style="padding: 16px 20px;">
          <p style="margin:0 0 4px; color:#303B30; font-size:16px; font-weight:600;">{{customer_name}}</p>
          <p style="margin:0 0 2px; color:#5E6E5E; font-size:14px;"><a href="mailto:{{customer_email}}" style="color:#303B30; text-decoration:none;">{{customer_email}}</a></p>
          <p style="margin:0; color:#5E6E5E; font-size:14px;">{{customer_phone}}</p>
        </td></tr></table>
      </td></tr>
      <tr><td style="padding: 0 40px 24px;">
        <p style="margin:0 0 12px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Shipping Address</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EEEA; border:1px solid #DEDBD3; border-radius:4px;"><tr><td style="padding: 16px 20px; color:#303B30; font-size:14px; line-height:1.7;">
          {{shipping_street}}<br />{{shipping_city}}, {{shipping_state}} {{shipping_zip}}<br />{{shipping_country}}
        </td></tr></table>
      </td></tr>
      <tr><td style="padding: 0 40px 24px;">
        <p style="margin:0 0 12px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Order Details</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #DEDBD3; border-radius:4px;">
          <tr style="background-color:#303B30;">
            <td style="padding:10px 16px; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Item</td>
            <td align="center" style="padding:10px 16px; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Qty</td>
            <td align="right" style="padding:10px 16px; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Price</td>
          </tr>
          <tr><td style="padding:14px 16px; color:#303B30; font-size:15px; border-bottom:1px solid #DEDBD3;">Inherit Your Freedom</td>
            <td align="center" style="padding:14px 16px; color:#303B30; font-size:15px; border-bottom:1px solid #DEDBD3;">{{quantity}}</td>
            <td align="right" style="padding:14px 16px; color:#303B30; font-size:15px; border-bottom:1px solid #DEDBD3;">\${{unit_price}}</td></tr>
          <tr><td colspan="2" style="padding:10px 16px; color:#5E6E5E; font-size:13px;">Subtotal</td><td align="right" style="padding:10px 16px; color:#303B30; font-size:14px;">\${{subtotal}}</td></tr>
          <tr><td colspan="2" style="padding:6px 16px; color:#5E6E5E; font-size:13px;">Shipping</td><td align="right" style="padding:6px 16px; color:#303B30; font-size:14px;">\${{shipping}}</td></tr>
          <tr style="background-color:#F0EEEA;"><td colspan="2" style="padding:14px 16px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:600; border-top:1px solid #DEDBD3;">Total</td>
            <td align="right" style="padding:14px 16px; color:#303B30; font-size:20px; font-weight:600; border-top:1px solid #DEDBD3;">\${{total}}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding: 0 40px 32px;">
        <p style="margin:0 0 12px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Payment</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EEEA; border:1px solid #DEDBD3; border-radius:4px;"><tr><td style="padding: 14px 20px; font-size:14px; color:#303B30;">
          <table width="100%">
            <tr><td style="color:#5E6E5E;">Method</td><td align="right">{{payment_method}}</td></tr>
            <tr><td style="color:#5E6E5E; padding-top:6px;">Stripe Session</td><td align="right" style="padding-top:6px; font-family:'SF Mono', Menlo, monospace; font-size:12px;">{{stripe_session_id}}</td></tr>
            <tr><td style="color:#5E6E5E; padding-top:6px;">Amount Paid</td><td align="right" style="padding-top:6px; color:#303B30; font-weight:600;">\${{total}} {{currency}}</td></tr>
          </table>
        </td></tr></table>
      </td></tr>
      <tr><td align="center" style="padding: 0 40px 40px;">
        <a href="{{stripe_dashboard_url}}" style="display:inline-block; background-color:#303B30; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:600; padding: 14px 28px; text-decoration:none; border-radius:2px;">View in Stripe Dashboard</a>
      </td></tr>
      <tr><td style="background-color:#303B30; padding: 20px 40px; text-align:center;">
        <p style="margin:0; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px;">Action required: Process and ship this order.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

  const sendEmail = async (to: string, subject: string, html: string) => {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, to: [to], subject, html }),
    });
    const text = await r.text();
    if (!r.ok) console.error(`stripe-webhook: Resend error to ${to}`, r.status, text);
    return r.ok;
  };

  let customerOk = false;
  if (email) {
    customerOk = await sendEmail(email, "Your Inherit Your Freedom Order Confirmation", render(customerTpl));
  } else {
    console.warn("stripe-webhook: no customer email on session, skipping customer confirmation");
  }
  const adminOk = await sendEmail(
    ADMIN_EMAIL,
    `New Order #${orderNumber} - ${fullName} (${quantity}x Inherit Your Freedom)`,
    render(adminTpl),
  );

  if (customerOk && adminOk) return "Sent";
  if (customerOk || adminOk) return "Partial";
  return "Failed";
}

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

  // Belt-and-suspenders: once this deployment is declared live, a test-mode
  // event should never be acted on even if it somehow reaches this endpoint
  // (e.g. the same URL registered for both test and live webhooks).
  const stripeMode = Deno.env.get("STRIPE_MODE");
  if (stripeMode === "live" && event.livemode === false) {
    console.log("stripe-webhook: ignoring test-mode event while STRIPE_MODE=live", event.id, event.type);
    return new Response(JSON.stringify({ received: true, ignored: "test-mode event" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // Fire-and-forget: log a PAID order to the "inherit your freedom order to
  // google sheet" Zap. Only called for confirmed payments - no pending/failed
  // rows. Field names must match that Zap's Google Sheets step mapping
  // (first_name, email_address, zip_code, etc). email_status is sent under
  // three key spellings since the Zap's Catch Hook step matches on the exact
  // key it first saw and we don't know which casing it was set up with.
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

        // Idempotency guard: Stripe can redeliver the same event. Only send
        // emails/Zapier the first time this session is marked paid.
        const { data: existing } = await admin
          .from("orders")
          .select("status")
          .eq("stripe_session_id", session.id)
          .maybeSingle();
        const alreadyPaid = existing?.status === "paid";

        const { error } = await admin
          .from("orders")
          .upsert(
            {
              stripe_session_id: session.id,
              stripe_payment_intent: paymentIntent,
              price_id: session.metadata?.price_id || Deno.env.get("STRIPE_PRICE_ID"),
              quantity: Number(session.metadata?.quantity ?? 1),
              customer_email: session.customer_email ?? session.customer_details?.email ?? null,
              amount_total: session.amount_total,
              currency: session.currency,
              status: "paid",
              livemode: event.livemode,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "stripe_session_id" },
          );
        if (error) console.error("stripe-webhook: upsert (paid) failed", error);

        if (!alreadyPaid) {
          const emailStatus = await sendOrderEmails(session);
          notifyZapierOrderPaid(session, emailStatus);
        } else {
          console.log("stripe-webhook: session already marked paid, skipping duplicate emails/Zapier", session.id);
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
    // Still return 200: Stripe retries on non-2xx, and a DB hiccup here
    // shouldn't cause repeated retries for an event we've already seen.
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
