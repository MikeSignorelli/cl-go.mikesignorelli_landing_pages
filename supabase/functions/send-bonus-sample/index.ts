const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Restrict to service-role callers only (internal/admin use).
  const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const authHeader = req.headers.get("Authorization") ?? "";
  const presentedToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!SERVICE_ROLE_KEY || presentedToken !== SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
  if (!RESEND_API_KEY) return new Response("no key", { status: 500 });

  const { to = "muhammed@brillmedia.co", first_name = "Muhammed" } = await req.json().catch(() => ({}));
  const BONUS_VIDEO_URL = "https://youtu.be/P4rWTNwCQRk";
  const PDF_FILENAME = "INHERIT YOUR FREEDOM PRAYER GUIDE.pdf";
  const BONUS_PDF_URL = "https://dnhvlilceqasarkovoht.supabase.co/storage/v1/object/public/public-assets/inherit-your-freedom%2FINHERIT%20YOUR%20FREEDOM%20PRAYER%20GUIDE.pdf";

  // Resend supports attaching by URL - no in-memory download needed
  const pdfAttachment = { filename: PDF_FILENAME, path: BONUS_PDF_URL };

  const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Your bonus chapter + prayer companion are inside</title></head>
<body style="margin:0; padding:0; background-color:#F5F1E8; font-family: Georgia, 'Times New Roman', serif; color:#2C2C2C;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F1E8; padding: 40px 20px;"><tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:#FFFFFF; border:1px solid #E5DFD0; border-radius:4px; overflow:hidden;">
      <tr><td style="background-color:#3D4A2A; padding: 32px 40px; text-align:center;">
        <h1 style="margin:0; color:#F5F1E8; font-family:'Helvetica Neue', Arial, sans-serif; font-size:14px; letter-spacing:4px; text-transform:uppercase; font-weight:600;">Mike Signorelli</h1>
        <p style="margin:8px 0 0; color:#C9A961; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase;">Your Free Bonuses</p>
      </td></tr>
      <tr><td style="padding: 40px 40px 8px;">
        <p style="margin:0 0 20px; color:#2C2C2C; font-size:16px; line-height:1.7;">Hey ${first_name},</p>
        <p style="margin:0 0 16px; color:#2C2C2C; font-size:16px; line-height:1.7;">Thank you for getting your copy of <em>Inherit Your Freedom</em>. That decision matters more than you know - God is already moving in your life, and this book is going to help you step into what He's been preparing for you.</p>
        <p style="margin:0 0 16px; color:#2C2C2C; font-size:16px; line-height:1.7;">Before you crack open the first page, I want to make sure you have everything you need to get the most out of this experience.</p>
        <p style="margin:0 0 8px; color:#2C2C2C; font-size:16px; line-height:1.7;">I've put together two free bonuses just for you:</p>
      </td></tr>
      <tr><td style="padding: 24px 40px 8px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF5; border:1px solid #E5DFD0; border-radius:4px;"><tr><td style="padding: 24px 24px;">
          <p style="margin:0 0 8px; color:#C9A961; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">🎬 Bonus Chapter (Video)</p>
          <p style="margin:0 0 16px; color:#2C2C2C; font-size:15px; line-height:1.7;">This is an exclusive chapter that didn't make it into the book - but I believe it's one of the most important things I've ever taught on freedom.</p>
          <a href="${BONUS_VIDEO_URL}" style="display:inline-block; background-color:#3D4A2A; color:#F5F1E8; font-family:'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:600; padding: 14px 24px; text-decoration:none; border-radius:2px;">Watch Your Bonus Chapter →</a>
        </td></tr></table>
      </td></tr>
      <tr><td style="padding: 16px 40px 8px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAFAF5; border:1px solid #E5DFD0; border-radius:4px;"><tr><td style="padding: 24px 24px;">
          <p style="margin:0 0 8px; color:#C9A961; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">🙏 Guided Prayer Companion</p>
          <p style="margin:0 0 12px; color:#2C2C2C; font-size:15px; line-height:1.7;">This is a set of seven one-page prayer guides - one for each major chapter theme of the book. These aren't prayers you just read silently. They're designed to be prayed aloud as you work through each chapter.</p>
          <p style="margin:0 0 16px; color:#2C2C2C; font-size:15px; line-height:1.7;">There's something powerful that happens when you speak God's Word over your own life out loud. These prayers will help you move what you're reading from your head into your heart - and from your heart into your everyday life.</p>
          <a href="${BONUS_PDF_URL}" style="display:inline-block; background-color:#C9A961; color:#2C2C2C; font-family:'Helvetica Neue', Arial, sans-serif; font-size:12px; letter-spacing:2px; text-transform:uppercase; font-weight:600; padding: 14px 24px; text-decoration:none; border-radius:2px;">Download Your Prayer Companion →</a>
        </td></tr></table>
      </td></tr>
      <tr><td style="padding: 32px 40px 8px;">
        <p style="margin:0 0 12px; color:#3D4A2A; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:3px; text-transform:uppercase; font-weight:600;">Here's how I'd recommend using them</p>
        <p style="margin:0 0 10px; color:#2C2C2C; font-size:15px; line-height:1.7;"><strong>1.</strong> Watch the bonus chapter first - it'll frame everything you're about to read.</p>
        <p style="margin:0 0 10px; color:#2C2C2C; font-size:15px; line-height:1.7;"><strong>2.</strong> Start reading the book at your own pace.</p>
        <p style="margin:0 0 10px; color:#2C2C2C; font-size:15px; line-height:1.7;"><strong>3.</strong> Before or after each chapter, pull out the matching prayer guide and pray it aloud - even if it feels unfamiliar at first. Especially then.</p>
      </td></tr>
      <tr><td style="padding: 16px 40px 32px;">
        <p style="margin:0 0 16px; color:#2C2C2C; font-size:16px; line-height:1.7;">Freedom isn't just something you learn about. It's something you walk in, one step at a time. And I'm honored to be walking this road alongside you.</p>
        <p style="margin:0 0 4px; color:#2C2C2C; font-size:16px; line-height:1.7;">Let's go,</p>
        <p style="margin:0 0 2px; color:#2C2C2C; font-size:16px; line-height:1.7;"><strong>Mike Signorelli</strong></p>
        <p style="margin:0; color:#5C5C5C; font-size:14px; line-height:1.6; font-style:italic;">Pastor, Author, and Founder of V1 Church</p>
      </td></tr>
      <tr><td style="background-color:#3D4A2A; padding: 24px 40px; text-align:center;">
        <p style="margin:0; color:#F5F1E8; font-family:'Helvetica Neue', Arial, sans-serif; font-size:11px; letter-spacing:2px;">© Mike Signorelli Ministries</p>
        <p style="margin:8px 0 0; color:#C9A961; font-size:11px;">You're receiving this email because you ordered Inherit Your Freedom.</p>
      </td></tr>
    </table>
  </td></tr></table>
</body></html>`;

  const emailBody: Record<string, unknown> = {
    from: "Mike Signorelli <orders@mikesignorelli.com>",
    to: [to],
    subject: "[SAMPLE] Your bonus chapter + prayer companion are inside",
    html,
    attachments: [pdfAttachment],
  };

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(emailBody),
  });
  return new Response(JSON.stringify({ status: r.status, body: await r.text(), pdf_url: BONUS_PDF_URL }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
