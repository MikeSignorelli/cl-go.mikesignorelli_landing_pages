import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  classifySession,
  computeReceipt,
  refundState,
  IYF_PRODUCT_NAME,
  type ChargeLike,
  type LineItemLike,
  type RefundState,
  type SessionLike,
} from "../_shared/iyf-order.ts";

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
    const zapierUrl = Deno.env.get("ZAPIER_ORDER_WEBHOOK_URL");
    if (!stripeKey) throw new Error("Stripe key not configured");
    if (!zapierUrl) throw new Error("Zapier webhook not configured");

    const reqBody = await req.json();
    const { session_id, payment_intent, resend, skip_zapier } = reqBody as {
      session_id?: string;
      payment_intent?: string;
      resend?: boolean;
      skip_zapier?: boolean;
    };
    if (!session_id && !payment_intent) {
      return new Response(JSON.stringify({ error: "session_id or payment_intent required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-11-20.acacia" });
    let session;
    if (session_id) {
      session = await stripe.checkout.sessions.retrieve(session_id);
    } else {
      const list = await stripe.checkout.sessions.list({ payment_intent: payment_intent!, limit: 1 });
      if (!list.data.length) {
        return new Response(JSON.stringify({ error: "No session found for payment_intent" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      session = list.data[0];
    }

    // ---- Product validation (authoritative, against Stripe - never trusts the request body).
    // Runs BEFORE dedupe insert, emails and Zapier so unrelated products leave no trace.
    const lineItemsRes = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
    const lineItems = lineItemsRes.data as LineItemLike[];
    const classification = classifySession(session as SessionLike, lineItems);
    if (!classification.eligible) {
      console.log("notify-order: ignoring non-IYF session", session.id, {
        reason: classification.reason,
        mode: session.mode,
        payment_link: session.payment_link ?? null,
        subscription: session.subscription ?? null,
        items: lineItems.map((li) => li.description),
      });
      return new Response(
        JSON.stringify({ success: true, ignored: true, reason: classification.reason }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    console.log("notify-order: IYF session verified via", classification.via, session.id);

    // ---- Refund check: never send "order confirmed" for a fully refunded payment.
    let refund: RefundState = "none";
    if (session.payment_intent) {
      const piId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent.id;
      const pi = await stripe.paymentIntents.retrieve(piId, { expand: ["latest_charge"] });
      refund = refundState(typeof pi.latest_charge === "object" ? pi.latest_charge as ChargeLike : null);
    }
    if (refund === "full") {
      console.log("notify-order: session fully refunded, skipping", session.id);
      return new Response(
        JSON.stringify({ success: true, ignored: true, reason: "refunded" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const receipt = computeReceipt(session as SessionLike, lineItems);

    // ---- Idempotency guard (bypassed when resend=true so we can re-fire emails for past orders).
    // processed_orders.session_id is a PRIMARY KEY, so concurrent deliveries race on the
    // insert and only one wins; the others get 23505 and exit before any side effect.
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!resend && supabaseUrl && serviceKey) {
      const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
      const { error: insertErr } = await admin
        .from("processed_orders")
        .insert({
          session_id: session.id,
          email: session.customer_email ?? session.customer_details?.email ?? null,
          payment_status: session.payment_status ?? null,
        });
      if (insertErr) {
        if ((insertErr as { code?: string }).code === "23505") {
          console.log("notify-order: session already processed, skipping", session.id);
          return new Response(
            JSON.stringify({ success: true, already_processed: true }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        console.error("notify-order: dedupe insert failed, continuing", insertErr);
      }
    } else if (!resend) {
      console.warn("notify-order: SUPABASE_URL/SERVICE_ROLE_KEY missing, dedup disabled");
    }

    const m = session.metadata ?? {};

    // Use Stripe's session creation timestamp so "purchase date" reflects when
    // the customer actually paid (not when this function fired).
    const purchaseDateObj = session.created
      ? new Date(session.created * 1000)
      : new Date();
    const purchaseDateFormatted = purchaseDateObj.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });

    const payload = {
      order_id: session.id,
      first_name: m.first_name ?? "",
      last_name: m.last_name ?? "",
      email_address: session.customer_email ?? session.customer_details?.email ?? "",
      phone_number: m.customer_phone ?? session.customer_details?.phone ?? "",
      address: m.shipping_street ?? "",
      state: m.shipping_state ?? "",
      city: m.shipping_city ?? "",
      zip_code: m.shipping_zip ?? "",
      product: IYF_PRODUCT_NAME,
      quantity: String(receipt.quantity),
      payment_status: refund === "partial" ? "partially_refunded" : (session.payment_status ?? "unknown"),
      amount_total: receipt.total.toFixed(2),
      currency: (session.currency ?? "usd").toUpperCase(),
      order_date: purchaseDateObj.toISOString(),
      purchase_date: purchaseDateFormatted,
    };

    // Only send confirmation emails after successful payment
    const resendKey = Deno.env.get("RESEND_API_KEY");
    const ADMIN_EMAIL = "support@mikesignorelli.com";
    const FROM = "Mike Signorelli <orders@mikesignorelli.com>";
    const emailResults: Record<string, unknown> = {};
    const isPaid = (session.payment_status ?? "") === "paid";

    if (resendKey && isPaid) {
      const fullName = `${payload.first_name} ${payload.last_name}`.trim() || "Friend";
      const qtyNum = receipt.quantity;
      const fmt = (n: number) => n.toFixed(2);
      // Stripe's session creation time, not now(). These templates used to call
      // new Date(), which stamped the moment the function ran - so a webhook
      // retry or a resend put today's date on an old order, and the email
      // disagreed with the purchase_date already sent to the sheet.
      const orderDate = purchaseDateObj.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      const orderTime = purchaseDateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const orderNumber = session.id.replace(/^cs_(test|live)_/, "").slice(0, 12).toUpperCase();
      const stripeMode = session.id.startsWith("cs_test_") ? "test/" : "";
      const stripeDashboardUrl = `https://dashboard.stripe.com/${stripeMode}payments/${session.payment_intent ?? ""}`;
      const paymentMethod = (session.payment_method_types?.[0] ?? "card").toUpperCase();

      const extraRow = (label: string, value: string) =>
        `<tr><td style="padding:8px 0; color:#5E6E5E; font-size:14px;">${label}</td><td align="right" style="padding:8px 0; color:#5E6E5E; font-size:14px;">${value}</td></tr>`;
      const extraRows =
        (receipt.discount > 0 ? extraRow("Discount", `-$${fmt(receipt.discount)}`) : "") +
        (receipt.tax > 0 ? extraRow("Tax", `$${fmt(receipt.tax)}`) : "");

      const vars: Record<string, string> = {
        customer_name: fullName,
        customer_email: payload.email_address,
        customer_phone: payload.phone_number || "-",
        quantity: String(qtyNum),
        unit_price: fmt(receipt.unitPrice),
        subtotal: fmt(receipt.subtotal),
        total: fmt(receipt.total),
        currency: payload.currency,
        order_number: orderNumber,
        order_date: orderDate,
        order_time: orderTime,
        shipping_street: payload.address,
        shipping_city: payload.city,
        shipping_state: payload.state,
        shipping_zip: payload.zip_code,
        shipping_country: (m.shipping_country as string) ?? "",
        payment_status: payload.payment_status,
        payment_method: paymentMethod,
        stripe_session_id: session.id,
        shipping: fmt(receipt.shipping),
        extra_rows: extraRows,
      };

      const render = (tpl: string) =>
        tpl.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? "");

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
            {{extra_rows}}
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
        <td style="background-color:#E8F0DC; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px; text-transform:uppercase; font-weight:600; padding: 8px 14px; border-radius:20px;">Payment: {{payment_status}}</td>
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
        const body = await r.text();
        if (!r.ok) console.error(`Resend error to ${to}`, r.status, body);
        return { ok: r.ok, status: r.status, body };
      };

      const PDF_FILENAME = "INHERIT YOUR FREEDOM PRAYER GUIDE.pdf";
      const BONUS_VIDEO_URL = "https://youtu.be/P4rWTNwCQRk";
      const BONUS_PDF_URL = "https://dnhvlilceqasarkovoht.supabase.co/storage/v1/object/public/public-assets/inherit-your-freedom%2FINHERIT%20YOUR%20FREEDOM%20PRAYER%20GUIDE.pdf";
      const firstName = payload.first_name || "Friend";

      // Resend supports attaching by URL - no need to download into memory
      const pdfAttachment = { filename: PDF_FILENAME, path: BONUS_PDF_URL };

      const bonusTpl = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Your bonus chapter + prayer companion are inside</title></head>
<body style="margin:0; padding:0; background-color:#F6F4EE; font-family: Georgia, 'Times New Roman', serif; color:#303B30;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F4EE; padding: 40px 20px;"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#FFFFFF; border:1px solid #DEDBD3; border-radius:4px; overflow:hidden;">
      <tr><td style="background-color:#303B30; padding: 32px 40px; text-align:center;">
        <h1 style="margin:0; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:14px; letter-spacing:4px; text-transform:uppercase; font-weight:600;">Mike Signorelli</h1>
        <p style="margin:8px 0 0; color:#A88A5D; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Your Free Bonuses</p>
      </td></tr>
      <tr><td style="padding: 40px 40px 8px;">
        <p style="margin:0 0 20px; color:#303B30; font-size:16px; line-height:1.7;">Hey {{first_name}},</p>
        <p style="margin:0 0 16px; color:#303B30; font-size:16px; line-height:1.7;">Thank you for getting your copy of <em>Inherit Your Freedom</em>. That decision matters more than you know - God is already moving in your life, and this book is going to help you step into what He's been preparing for you.</p>
        <p style="margin:0 0 16px; color:#303B30; font-size:16px; line-height:1.7;">Before you crack open the first page, I want to make sure you have everything you need to get the most out of this experience.</p>
        <p style="margin:0 0 8px; color:#303B30; font-size:16px; line-height:1.7;">I've put together two free bonuses just for you:</p>
      </td></tr>

      <tr><td style="padding: 24px 40px 8px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EEEA; border:1px solid #DEDBD3; border-radius:4px;"><tr><td style="padding: 24px 24px;">
          <p style="margin:0 0 8px; color:#A88A5D; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">🎬 Bonus Chapter (Video)</p>
          <p style="margin:0 0 16px; color:#303B30; font-size:15px; line-height:1.7;">This is an exclusive chapter that didn't make it into the book - but I believe it's one of the most important things I've ever taught on freedom.</p>
          <a href="{{bonus_video_url}}" style="display:inline-block; background-color:#303B30; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:600; padding: 14px 24px; text-decoration:none; border-radius:2px;">Watch Your Bonus Chapter →</a>
        </td></tr></table>
      </td></tr>

      <tr><td style="padding: 16px 40px 8px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EEEA; border:1px solid #DEDBD3; border-radius:4px;"><tr><td style="padding: 24px 24px;">
          <p style="margin:0 0 8px; color:#A88A5D; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">🙏 Guided Prayer Companion</p>
          <p style="margin:0 0 12px; color:#303B30; font-size:15px; line-height:1.7;">This is a set of seven one-page prayer guides - one for each major chapter theme of the book. These aren't prayers you just read silently. They're designed to be prayed aloud as you work through each chapter.</p>
          <p style="margin:0 0 16px; color:#303B30; font-size:15px; line-height:1.7;">There's something powerful that happens when you speak God's Word over your own life out loud. These prayers will help you move what you're reading from your head into your heart - and from your heart into your everyday life.</p>
          <a href="{{bonus_pdf_url}}" style="display:inline-block; background-color:#A88A5D; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:600; padding: 14px 24px; text-decoration:none; border-radius:2px;">Download Your Prayer Companion →</a>
        </td></tr></table>
      </td></tr>

      <tr><td style="padding: 32px 40px 8px;">
        <p style="margin:0 0 12px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Here's how I'd recommend using them</p>
        <p style="margin:0 0 10px; color:#303B30; font-size:15px; line-height:1.7;"><strong>1.</strong> Watch the bonus chapter first - it'll frame everything you're about to read.</p>
        <p style="margin:0 0 10px; color:#303B30; font-size:15px; line-height:1.7;"><strong>2.</strong> Start reading the book at your own pace.</p>
        <p style="margin:0 0 10px; color:#303B30; font-size:15px; line-height:1.7;"><strong>3.</strong> Before or after each chapter, pull out the matching prayer guide and pray it aloud - even if it feels unfamiliar at first. Especially then.</p>
      </td></tr>

      <tr><td style="padding: 16px 40px 32px;">
        <p style="margin:0 0 16px; color:#303B30; font-size:16px; line-height:1.7;">Freedom isn't just something you learn about. It's something you walk in, one step at a time. And I'm honored to be walking this road alongside you.</p>
        <p style="margin:0 0 4px; color:#303B30; font-size:16px; line-height:1.7;">Let's go,</p>
        <p style="margin:0 0 2px; color:#303B30; font-size:16px; line-height:1.7;"><strong>Mike Signorelli</strong></p>
        <p style="margin:0; color:#5E6E5E; font-size:14px; line-height:1.6; font-style:italic;">Pastor, Author, and Founder of V1 Church</p>
      </td></tr>

      <tr><td style="background-color:#303B30; padding: 24px 40px; text-align:center;">
        <p style="margin:0; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px;">© Mike Signorelli Ministries</p>
        <p style="margin:8px 0 0; color:#A88A5D; font-size:11px;">You're receiving this email because you ordered Inherit Your Freedom.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

      vars.first_name = firstName;
      vars.bonus_video_url = BONUS_VIDEO_URL;
      vars.bonus_pdf_url = BONUS_PDF_URL;

      const BONUS_FROM = "Mike Signorelli <orders@mikesignorelli.com>";
      const sendBonus = async (to: string) => {
        const body: Record<string, unknown> = {
          from: BONUS_FROM,
          to: [to],
          subject: "Your bonus chapter + prayer companion are inside",
          html: render(bonusTpl),
        };
        body.attachments = [pdfAttachment];
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        return { ok: r.ok, status: r.status, body: await r.text() };
      };

      if (payload.email_address) {
        emailResults.customer = await sendEmail(
          payload.email_address,
          `Your Inherit Your Freedom Order Confirmation`,
          render(customerTpl),
        );
        emailResults.bonus = await sendBonus(payload.email_address);
      }
      emailResults.admin = await sendEmail(
        ADMIN_EMAIL,
        `New Order #${orderNumber} - ${fullName} (${qtyNum}x Inherit Your Freedom)`,
        render(adminTpl),
      );
    } else if (!isPaid) {
      console.log("Skipping emails; payment_status:", session.payment_status);
    } else {
      console.warn("RESEND_API_KEY not configured; skipping emails");
    }

    // ---- Compute email_status string for Zapier / Google Sheet
    const customerEmailRes = emailResults.customer as { ok?: boolean } | undefined;
    const bonusEmailRes = emailResults.bonus as { ok?: boolean } | undefined;
    let email_status = "Not Sent";
    if (!isPaid) {
      email_status = "Skipped (unpaid)";
    } else if (!resendKey) {
      email_status = "Skipped (no email service)";
    } else if (customerEmailRes?.ok && bonusEmailRes?.ok) {
      email_status = "Sent";
    } else if (customerEmailRes?.ok || bonusEmailRes?.ok) {
      email_status = "Partial";
    } else if (customerEmailRes || bonusEmailRes) {
      email_status = "Failed";
    }

    const zapierPayload = {
      ...payload,
      email_status,
      emailStatus: email_status,
      "Email Status": email_status,
    };

    // Send to Zapier (skipped when caller only wants a resend)
    if (!skip_zapier) {
      const zapRes = await fetch(zapierUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zapierPayload),
      });
      if (!zapRes.ok) {
        const txt = await zapRes.text();
        console.error("Zapier error", zapRes.status, txt);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      payment_status: payload.payment_status,
      amount_total: payload.amount_total,
      currency: payload.currency,
      email_status,
      emails: emailResults,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("notify-order error", err);
    return new Response(JSON.stringify({ error: "An internal error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
