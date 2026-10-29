// Sends a dummy order-confirmation email via the shared SMTP/Resend sender,
// gated by a shared admin secret - lets SMTP (or the Resend fallback) be
// verified in isolation before wiring up a real Stripe payment.
// Deployed to project gprrntuvxyzyjbwgqwce (see ../README.md).

import { sendEmail } from "./_shared/sendEmail.ts";
import { renderCustomerEmailHtml, renderCustomerEmailText, type OrderEmailData } from "./_shared/emails/orderConfirmation.ts";

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
  const to = (body as Record<string, unknown> | null)?.to;
  if (typeof to !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    return json({ success: false, error: "Valid 'to' email required" }, 400);
  }

  const dummy: OrderEmailData = {
    customerName: "Test Customer",
    customerEmail: to,
    customerPhone: "555-555-5555",
    productName: "Inherit Your Freedom",
    quantity: 1,
    amountTotal: 5399,
    currency: "usd",
    orderId: `test_${Date.now()}`,
    orderDate: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
    shippingStreet: "123 Test St",
    shippingCity: "Testville",
    shippingState: "CA",
    shippingZip: "90001",
    shippingCountry: "US",
    supportEmail: "support@mikesignorelli.com",
  };

  const result = await sendEmail({
    to,
    subject: "[TEST] Your order is confirmed - Inherit Your Freedom",
    html: renderCustomerEmailHtml(dummy),
    text: renderCustomerEmailText(dummy),
  });

  if (!result.success) {
    return json({ success: false, error: result.error }, 500);
  }
  return json({ success: true, messageId: result.messageId });
});
