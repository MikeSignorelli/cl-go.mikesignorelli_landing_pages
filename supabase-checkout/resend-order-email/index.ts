// Manually re-sends the order-confirmation + admin emails for a given Stripe
// checkout session - for use when the webhook's automatic send failed.
// Bypasses the email_sent idempotency gate by design: this is an explicit,
// human-triggered action, not another automatic delivery.
// Deployed to project gprrntuvxyzyjbwgqwce (see ../README.md).

import { createClient } from "npm:@supabase/supabase-js@2";
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
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ success: false, error: "Method not allowed" }, 405);

  const adminSecret = Deno.env.get("TEST_EMAIL_SECRET");
  if (!adminSecret || req.headers.get("x-admin-secret") !== adminSecret) {
    return json({ success: false, error: "Unauthorized" }, 401);
  }

  const body = await req.json().catch(() => null);
  const sessionId = (body as Record<string, unknown> | null)?.stripe_session_id;
  if (typeof sessionId !== "string" || !sessionId) {
    return json({ success: false, error: "stripe_session_id is required" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return json({ success: false, error: "Database not configured" }, 500);
  }
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  const { data: order, error } = await admin
    .from("orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();
  if (error || !order) {
    return json({ success: false, error: "Order not found" }, 404);
  }
  if (order.status !== "paid") {
    return json(
      { success: false, error: `Order status is "${order.status}", not "paid" - refusing to send a confirmation for an unpaid order` },
      400,
    );
  }

  const data: OrderEmailData = {
    customerName: order.customer_name || `${order.first_name ?? ""} ${order.last_name ?? ""}`.trim() || "Friend",
    customerEmail: order.customer_email || "",
    customerPhone: order.customer_phone || "",
    productName: "Inherit Your Freedom",
    quantity: order.quantity,
    amountTotal: order.amount_total ?? 0,
    currency: order.currency ?? "usd",
    orderId: order.stripe_session_id,
    orderDate: new Date(order.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    shippingStreet: order.shipping_street || "",
    shippingCity: order.shipping_city || "",
    shippingState: order.shipping_state || "",
    shippingZip: order.shipping_zip || "",
    shippingCountry: order.shipping_country || "",
    supportEmail: "support@mikesignorelli.com",
  };

  let customerResult = { success: false, error: "No customer email on order" };
  if (data.customerEmail) {
    customerResult = await sendEmail({
      to: data.customerEmail,
      subject: "Your order is confirmed - Inherit Your Freedom",
      html: renderCustomerEmailHtml(data),
      text: renderCustomerEmailText(data),
    });
  }

  const adminEmail = Deno.env.get("ADMIN_EMAIL") || "support@mikesignorelli.com";
  const adminResult = await sendEmail({
    to: adminEmail,
    subject: `[RESEND] Order #${order.stripe_session_id.slice(-12).toUpperCase()} - ${data.customerName}`,
    html: renderAdminEmailHtml(data),
    text: renderAdminEmailText(data),
  });

  await Promise.all([
    admin.from("email_logs").insert({
      order_id: order.id,
      to_email: data.customerEmail || "(none)",
      type: "customer_confirmation_resend",
      status: customerResult.success ? "sent" : "failed",
      error: customerResult.success ? null : customerResult.error,
    }),
    admin.from("email_logs").insert({
      order_id: order.id,
      to_email: adminEmail,
      type: "admin_notification_resend",
      status: adminResult.success ? "sent" : "failed",
      error: adminResult.success ? null : adminResult.error,
    }),
  ]);

  const bothOk = customerResult.success && adminResult.success;
  await admin
    .from("orders")
    .update({
      email_sent: true,
      email_sent_at: new Date().toISOString(),
      email_error: bothOk
        ? null
        : [
            !customerResult.success ? `customer: ${customerResult.error}` : null,
            !adminResult.success ? `admin: ${adminResult.error}` : null,
          ].filter(Boolean).join("; "),
    })
    .eq("id", order.id);

  if (!bothOk) {
    return json({ success: false, error: "One or more emails failed to send", customer: customerResult, admin: adminResult }, 500);
  }
  return json({ success: true, messageId: customerResult.messageId });
});
