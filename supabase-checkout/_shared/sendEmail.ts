// Shared email sender. SMTP (nodemailer, port 465/implicit TLS) is primary -
// Supabase Edge Functions block outbound ports 25 and 587, so 465 is the
// only SMTP port that works at all. Falls back to the Resend HTTP API if
// SMTP isn't configured or the send itself fails, since not every SMTP
// provider offers 465. Duplicated into each function's own file tree - see
// _shared/stripe.ts for why.

import nodemailer from "npm:nodemailer@6.9.16";

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider?: "smtp" | "resend";
}

async function sendViaSmtp(input: SendEmailInput): Promise<SendEmailResult> {
  const host = Deno.env.get("SMTP_HOST");
  const port = Number(Deno.env.get("SMTP_PORT") || "465");
  const user = Deno.env.get("SMTP_USER");
  const pass = Deno.env.get("SMTP_PASS");
  const fromName = Deno.env.get("SMTP_FROM_NAME") || "Mike Signorelli";

  if (!host || !user || !pass) {
    return { success: false, error: "SMTP not configured" };
  }

  // Gmail (and most providers) rewrite the From header to the authenticated
  // mailbox unless the address is a verified "Send mail as" alias on that
  // account, so defaulting to the SMTP user is the one value that's never
  // silently rewritten. Only set SMTP_FROM_EMAIL once that address is
  // actually verified as an alias on the sending account.
  const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || user;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  const info = await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: input.to,
    subject: input.subject,
    html: input.html,
    text: input.text,
  });

  return { success: true, messageId: String(info.messageId ?? ""), provider: "smtp" };
}

async function sendViaResend(input: SendEmailInput): Promise<SendEmailResult> {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  const fromEmail = Deno.env.get("SMTP_FROM_EMAIL") || "orders@mikesignorelli.com";
  const fromName = Deno.env.get("SMTP_FROM_NAME") || "Mike Signorelli";
  if (!resendKey) {
    return { success: false, error: "Neither SMTP nor RESEND_API_KEY is configured" };
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) {
    return { success: false, error: `Resend ${r.status}: ${JSON.stringify(body)}` };
  }
  return { success: true, messageId: body?.id, provider: "resend" };
}

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const smtpConfigured = !!(Deno.env.get("SMTP_HOST") && Deno.env.get("SMTP_USER") && Deno.env.get("SMTP_PASS"));
  if (smtpConfigured) {
    try {
      const result = await sendViaSmtp(input);
      if (result.success) return result;
      console.warn("sendEmail: SMTP send failed, falling back to Resend", result.error);
    } catch (err) {
      console.warn("sendEmail: SMTP threw, falling back to Resend", (err as Error).message);
    }
  }
  return sendViaResend(input);
}
