// Order confirmation email templates (customer + admin), HTML and plain-text.
// Duplicated into each function's own file tree - see _shared/stripe.ts for why.

export interface OrderEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
  subtotalCents: number;
  shippingCents: number;
  amountTotal: number; // cents
  currency: string;
  orderId: string; // Stripe checkout session id
  orderDate: string; // pre-formatted, e.g. "October 28, 2026"
  orderTime: string; // pre-formatted, e.g. "3:45 PM"
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingZip: string;
  shippingCountry: string;
  paymentMethod: string;
  stripeDashboardUrl: string;
  supportEmail: string;
}

function fmt(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function renderCustomerEmailHtml(d: OrderEmailData): string {
  const total = fmt(d.amountTotal);
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Your order is confirmed - Inherit Your Freedom</title></head>
<body style="margin:0; padding:0; background-color:#F6F4EE; font-family: Georgia, 'Times New Roman', serif; color:#303B30;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F6F4EE; padding: 40px 20px;"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#FFFFFF; border:1px solid #DEDBD3; border-radius:4px; overflow:hidden;">
      <tr><td style="background-color:#303B30; padding: 32px 40px; text-align:center;">
        <h1 style="margin:0; color:#F6F4EE; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:14px; letter-spacing:4px; text-transform:uppercase; font-weight:600;">Mike Signorelli</h1>
        <p style="margin:8px 0 0; color:#A88A5D; font-family: 'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Inherit Your Freedom</p>
      </td></tr>
      <tr><td style="padding: 48px 40px 24px; text-align:center;">
        <p style="margin:0 0 12px; color:#A88A5D; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Order Confirmed</p>
        <h2 style="margin:0 0 16px; color:#303B30; font-size:30px; font-weight:400; line-height:1.3;">Thank you, ${d.customerName}.</h2>
        <p style="margin:0; color:#5E6E5E; font-size:16px; line-height:1.6;">Your copy of <em>Inherit Your Freedom</em> is on its way.</p>
      </td></tr>
      <tr><td style="padding: 24px 40px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #DEDBD3; border-bottom:1px solid #DEDBD3; padding: 24px 0;"><tr><td style="padding: 24px 0;">
          <p style="margin:0 0 16px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Order Summary</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="padding:8px 0; color:#303B30; font-size:15px;">Inherit Your Freedom &times; ${d.quantity}</td><td align="right" style="padding:8px 0; color:#303B30; font-size:15px;">$${fmt(d.subtotalCents)}</td></tr>
            <tr><td style="padding:8px 0; color:#5E6E5E; font-size:14px;">Shipping</td><td align="right" style="padding:8px 0; color:#5E6E5E; font-size:14px;">$${fmt(d.shippingCents)}</td></tr>
            <tr><td style="padding:16px 0 0; border-top:1px solid #DEDBD3; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:600;">Total Paid</td><td align="right" style="padding:16px 0 0; border-top:1px solid #DEDBD3; color:#303B30; font-size:22px; font-weight:600;">$${total}</td></tr>
          </table>
          <p style="margin:16px 0 0; color:#5E6E5E; font-size:13px;">Order #${d.orderId.slice(-12).toUpperCase()} &middot; ${d.orderDate}</p>
        </td></tr></table>
      </td></tr>
      <tr><td style="padding: 0 40px 24px;">
        <p style="margin:0 0 12px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Shipping To</p>
        <p style="margin:0; color:#303B30; font-size:15px; line-height:1.7;">${d.customerName}<br />${d.shippingStreet}<br />${d.shippingCity}, ${d.shippingState} ${d.shippingZip}<br />${d.shippingCountry}</p>
      </td></tr>
      <tr><td style="padding: 24px 40px; background-color:#F6F4EE;">
        <p style="margin:0 0 16px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">What Happens Next</p>
        <p style="margin:0 0 12px; color:#303B30; font-size:15px; line-height:1.7;"><strong>1. Processing.</strong> Your order is being prepared with care.</p>
        <p style="margin:0 0 12px; color:#303B30; font-size:15px; line-height:1.7;"><strong>2. Shipping.</strong> You'll receive tracking details once your book ships.</p>
        <p style="margin:0; color:#303B30; font-size:15px; line-height:1.7;"><strong>3. Delivery.</strong> Most orders arrive within 5-7 business days.</p>
      </td></tr>
      <tr><td style="padding: 32px 40px; text-align:center;">
        <p style="margin:0 0 12px; color:#5E6E5E; font-size:14px; line-height:1.6;">Questions about your order? We're here to help.</p>
        <a href="mailto:${d.supportEmail}" style="color:#A88A5D; font-size:15px; font-weight:600; text-decoration:none; border-bottom:1px solid #A88A5D;">${d.supportEmail}</a>
      </td></tr>
      <tr><td style="background-color:#303B30; padding: 24px 40px; text-align:center;">
        <p style="margin:0; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px;">&copy; Mike Signorelli Ministries</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export function renderCustomerEmailText(d: OrderEmailData): string {
  const total = fmt(d.amountTotal);
  return `Thank you, ${d.customerName}.

Your order is confirmed.

ORDER SUMMARY
Inherit Your Freedom x ${d.quantity} - $${fmt(d.subtotalCents)}
Shipping - $${fmt(d.shippingCents)}
Total Paid: $${total}
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
  const total = fmt(d.amountTotal);
  return `<!DOCTYPE html>
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
        <h2 style="margin:0 0 8px; color:#303B30; font-size:28px; font-weight:400; line-height:1.3;">Order #${d.orderId.slice(-12).toUpperCase()}</h2>
        <p style="margin:0; color:#5E6E5E; font-size:14px;">Placed ${d.orderDate} &middot; ${d.orderTime}</p>
      </td></tr>
      <tr><td style="padding: 0 40px 24px;">
        <p style="margin:0 0 12px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Customer</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EEEA; border:1px solid #DEDBD3; border-radius:4px;"><tr><td style="padding: 16px 20px;">
          <p style="margin:0 0 4px; color:#303B30; font-size:16px; font-weight:600;">${d.customerName}</p>
          <p style="margin:0 0 2px; color:#5E6E5E; font-size:14px;"><a href="mailto:${d.customerEmail}" style="color:#303B30; text-decoration:none;">${d.customerEmail}</a></p>
          <p style="margin:0; color:#5E6E5E; font-size:14px;">${d.customerPhone}</p>
        </td></tr></table>
      </td></tr>
      <tr><td style="padding: 0 40px 24px;">
        <p style="margin:0 0 12px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Shipping Address</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EEEA; border:1px solid #DEDBD3; border-radius:4px;"><tr><td style="padding: 16px 20px; color:#303B30; font-size:14px; line-height:1.7;">
          ${d.shippingStreet}<br />${d.shippingCity}, ${d.shippingState} ${d.shippingZip}<br />${d.shippingCountry}
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
            <td align="center" style="padding:14px 16px; color:#303B30; font-size:15px; border-bottom:1px solid #DEDBD3;">${d.quantity}</td>
            <td align="right" style="padding:14px 16px; color:#303B30; font-size:15px; border-bottom:1px solid #DEDBD3;">$${fmt(d.unitPriceCents)}</td></tr>
          <tr><td colspan="2" style="padding:10px 16px; color:#5E6E5E; font-size:13px;">Subtotal</td><td align="right" style="padding:10px 16px; color:#303B30; font-size:14px;">$${fmt(d.subtotalCents)}</td></tr>
          <tr><td colspan="2" style="padding:6px 16px; color:#5E6E5E; font-size:13px;">Shipping</td><td align="right" style="padding:6px 16px; color:#303B30; font-size:14px;">$${fmt(d.shippingCents)}</td></tr>
          <tr style="background-color:#F0EEEA;"><td colspan="2" style="padding:14px 16px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:600; border-top:1px solid #DEDBD3;">Total</td>
            <td align="right" style="padding:14px 16px; color:#303B30; font-size:20px; font-weight:600; border-top:1px solid #DEDBD3;">$${total}</td></tr>
        </table>
      </td></tr>
      <tr><td style="padding: 0 40px 32px;">
        <p style="margin:0 0 12px; color:#303B30; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Payment</p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0EEEA; border:1px solid #DEDBD3; border-radius:4px;"><tr><td style="padding: 14px 20px; font-size:14px; color:#303B30;">
          <table width="100%">
            <tr><td style="color:#5E6E5E;">Method</td><td align="right">${d.paymentMethod}</td></tr>
            <tr><td style="color:#5E6E5E; padding-top:6px;">Stripe Session</td><td align="right" style="padding-top:6px; font-family:'SF Mono', Menlo, monospace; font-size:12px;">${d.orderId}</td></tr>
            <tr><td style="color:#5E6E5E; padding-top:6px;">Amount Paid</td><td align="right" style="padding-top:6px; color:#303B30; font-weight:600;">$${total} ${d.currency.toUpperCase()}</td></tr>
          </table>
        </td></tr></table>
      </td></tr>
      <tr><td align="center" style="padding: 0 40px 40px;">
        <a href="${d.stripeDashboardUrl}" style="display:inline-block; background-color:#303B30; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:600; padding: 14px 28px; text-decoration:none; border-radius:2px;">View in Stripe Dashboard</a>
      </td></tr>
      <tr><td style="background-color:#303B30; padding: 20px 40px; text-align:center;">
        <p style="margin:0; color:#F6F4EE; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px;">Action required: Process and ship this order.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;
}

export function renderAdminEmailText(d: OrderEmailData): string {
  const total = fmt(d.amountTotal);
  return `New Order #${d.orderId.slice(-12).toUpperCase()}

Customer: ${d.customerName} (${d.customerEmail})
Phone: ${d.customerPhone}
Quantity: ${d.quantity}
Subtotal: $${fmt(d.subtotalCents)}
Shipping: $${fmt(d.shippingCents)}
Total: $${total}
Date: ${d.orderDate} ${d.orderTime}

Shipping Address:
${d.shippingStreet}
${d.shippingCity}, ${d.shippingState} ${d.shippingZip}
${d.shippingCountry}

Payment Method: ${d.paymentMethod}
Stripe Session: ${d.orderId}
Stripe Dashboard: ${d.stripeDashboardUrl}`;
}
