// Order confirmation email templates (customer + admin), HTML and plain-text.
// Duplicated into each function's own file tree - see _shared/stripe.ts for why.

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  quantity: number;
  amountTotal: number; // cents
  currency: string;
  orderId: string; // Stripe checkout session id
  orderDate: string; // pre-formatted, e.g. "October 28, 2026"
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  supportEmail: string;
}

function fmtAmount(cents: number, currency: string): string {
  return `$${(cents / 100).toFixed(2)} ${currency.toUpperCase()}`;
}

export function renderCustomerEmailHtml(d: OrderEmailData): string {
  const total = fmtAmount(d.amountTotal, d.currency);
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Your order is confirmed - Inherit Your Freedom</title></head>
<body style="margin:0; padding:0; background-color:#F5F1E8; font-family: Georgia, 'Times New Roman', serif; color:#2C2C2C;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F1E8; padding: 40px 20px;"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#FFFFFF; border:1px solid #E5DFD0; border-radius:4px; overflow:hidden;">
      <tr><td style="background-color:#3D4A2A; padding: 32px 40px; text-align:center;">
        <h1 style="margin:0; color:#F5F1E8; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:14px; letter-spacing:4px; text-transform:uppercase; font-weight:600;">Mike Signorelli</h1>
        <p style="margin:8px 0 0; color:#C9A961; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Inherit Your Freedom</p>
      </td></tr>
      <tr><td style="padding: 48px 40px 24px; text-align:center;">
        <p style="margin:0 0 12px; color:#C9A961; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Order Confirmed</p>
        <h2 style="margin:0 0 16px; color:#2C2C2C; font-size:30px; font-weight:400; line-height:1.3;">Thank you, ${d.customerName}.</h2>
        <p style="margin:0; color:#5C5C5C; font-size:16px; line-height:1.6;">Your copy of <em>Inherit Your Freedom</em> is on its way.</p>
      </td></tr>
      <tr><td style="padding: 24px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #E5DFD0; border-bottom:1px solid #E5DFD0; padding: 24px 0;"><tr><td style="padding: 24px 0;">
          <p style="margin:0 0 16px; color:#3D4A2A; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Order Summary</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:8px 0; color:#2C2C2C; font-size:15px;">Inherit Your Freedom &times; ${d.quantity}</td></tr>
            <tr><td style="padding:16px 0 0; border-top:1px solid #E5DFD0; color:#2C2C2C; font-family:'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:600;">Total Paid: <span style="color:#3D4A2A; font-size:18px;">${total}</span></td></tr>
          </table>
          <p style="margin:16px 0 0; color:#8A8A8A; font-size:13px;">Order #${d.orderId.slice(-12).toUpperCase()} &middot; ${d.orderDate}</p>
        </td></tr></table>
      </td></tr>
      <tr><td style="padding: 0 40px 24px;">
        <p style="margin:0 0 12px; color:#3D4A2A; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Shipping To</p>
        <p style="margin:0; color:#2C2C2C; font-size:15px; line-height:1.7;">${d.customerName}<br />${d.shippingStreet}<br />${d.shippingCity}, ${d.shippingState} ${d.shippingZip}<br />${d.shippingCountry}</p>
      </td></tr>
      <tr><td style="padding: 24px 40px; background-color:#F5F1E8;">
        <p style="margin:0 0 16px; color:#3D4A2A; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">What Happens Next</p>
        <p style="margin:0 0 12px; color:#2C2C2C; font-size:15px; line-height:1.7;"><strong>1. Processing.</strong> Your order is being prepared with care.</p>
        <p style="margin:0 0 12px; color:#2C2C2C; font-size:15px; line-height:1.7;"><strong>2. Shipping.</strong> You'll receive tracking details once your book ships.</p>
        <p style="margin:0; color:#2C2C2C; font-size:15px; line-height:1.7;"><strong>3. Delivery.</strong> Most orders arrive within 5-7 business days.</p>
      </td></tr>
      <tr><td style="padding: 32px 40px; text-align:center;">
        <p style="margin:0 0 12px; color:#5C5C5C; font-size:14px; line-height:1.6;">Questions about your order? We're here to help.</p>
        <a href="mailto:${d.supportEmail}" style="color:#C9A961; font-size:15px; font-weight:600; text-decoration:none; border-bottom:1px solid #C9A961;">${d.supportEmail}</a>
      </td></tr>
      <tr><td style="background-color:#3D4A2A; padding: 24px 40px; text-align:center;">
        <p style="margin:0; color:#F5F1E8; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px;">&copy; Mike Signorelli Ministries</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export function renderCustomerEmailText(d: OrderEmailData): string {
  const total = fmtAmount(d.amountTotal, d.currency);
  return `Thank you, ${d.customerName}.

Your order is confirmed.

ORDER SUMMARY
Inherit Your Freedom x ${d.quantity}
Total Paid: ${total}
Order #${d.orderId.slice(-12).toUpperCase()} - ${d.orderDate}

SHIPPING TO
${d.customerName}
${d.shippingStreet}
${d.shippingCity}, ${d.shippingState} ${d.shippingZip}
${d.shippingCountry}

WHAT HAPPENS NEXT
1. Processing - your order is being prepared with care.
2. Shipping - you'll receive tracking details once your book ships.
3. Delivery - most orders arrive within 5-7 business days.

Questions? Contact us at ${d.supportEmail}

Mike Signorelli Ministries`;
}

export function renderAdminEmailHtml(d: OrderEmailData): string {
  const total = fmtAmount(d.amountTotal, d.currency);
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><title>New Order Received</title></head>
<body style="margin:0; padding:0; background-color:#F5F1E8; font-family: Georgia, 'Times New Roman', serif; color:#2C2C2C;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F1E8; padding: 40px 20px;"><tr><td align="center">
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px; background-color:#FFFFFF; border:1px solid #E5DFD0; border-radius:4px; overflow:hidden;">
      <tr><td style="background-color:#3D4A2A; padding: 28px 40px;">
        <span style="color:#F5F1E8; font-family:'Helvetica Neue', Arial, sans-serif; font-size:13px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">New Order Received</span>
      </td></tr>
      <tr><td style="padding: 32px 40px;">
        <h2 style="margin:0 0 16px; color:#2C2C2C; font-size:24px;">Order #${d.orderId.slice(-12).toUpperCase()}</h2>
        <p style="margin:0 0 4px; color:#2C2C2C; font-size:15px;"><strong>Customer:</strong> ${d.customerName} (${d.customerEmail})</p>
        <p style="margin:0 0 4px; color:#2C2C2C; font-size:15px;"><strong>Phone:</strong> ${d.customerPhone}</p>
        <p style="margin:0 0 4px; color:#2C2C2C; font-size:15px;"><strong>Quantity:</strong> ${d.quantity}</p>
        <p style="margin:0 0 4px; color:#2C2C2C; font-size:15px;"><strong>Total:</strong> ${total}</p>
        <p style="margin:0 0 16px; color:#2C2C2C; font-size:15px;"><strong>Date:</strong> ${d.orderDate}</p>
        <p style="margin:0 0 4px; color:#2C2C2C; font-size:15px;"><strong>Shipping Address:</strong></p>
        <p style="margin:0; color:#2C2C2C; font-size:15px; line-height:1.6;">${d.shippingStreet}<br />${d.shippingCity}, ${d.shippingState} ${d.shippingZip}<br />${d.shippingCountry}</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export function renderAdminEmailText(d: OrderEmailData): string {
  const total = fmtAmount(d.amountTotal, d.currency);
  return `New Order #${d.orderId.slice(-12).toUpperCase()}

Customer: ${d.customerName} (${d.customerEmail})
Phone: ${d.customerPhone}
Quantity: ${d.quantity}
Total: ${total}
Date: ${d.orderDate}

Shipping Address:
${d.shippingStreet}
${d.shippingCity}, ${d.shippingState} ${d.shippingZip}
${d.shippingCountry}`;
}
