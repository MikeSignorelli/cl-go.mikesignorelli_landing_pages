import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const WEBHOOK_ENV: Record<string, string> = {
  all: "ZAPIER_ALL_LEADS_WEBHOOK_URL",
};

// Every `leads` column except `amount` (numeric, handled separately) and the
// bookkeeping columns (id, created_at, lead_status, notes, zapier_status, zapier_error).
const LEAD_TEXT_COLUMNS = [
  "submission_date", "submission_time", "page_name", "page_url", "form_type",
  "first_name", "last_name", "email", "phone",
  "organization", "role_title", "church_website", "church_size", "staff_count",
  "current_tools", "biggest_challenge", "preferred_call_time",
  "num_travelers", "departure_date", "room_type", "payment_plan_interest",
  "city", "state_region", "country", "postal_code",
  "product_package", "currency", "payment_status", "transaction_id", "coupon_code",
  "message", "utm_source", "utm_medium", "utm_campaign",
];

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => null);
    if (!isPlainObject(body)) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const webhook = typeof body.webhook === "string" ? body.webhook : "all";
    const envName = WEBHOOK_ENV[webhook];
    if (!envName) {
      return new Response(JSON.stringify({ error: "Invalid webhook" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = Deno.env.get(envName);
    if (!url) {
      console.error("submit-lead: missing env", envName);
      return new Response(JSON.stringify({ error: "An internal error occurred" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate + cap payload size; only forward whitelisted primitive fields.
    const payload = isPlainObject(body.payload) ? body.payload : {};
    const safePayload: Record<string, string> = {};
    let count = 0;
    for (const [k, v] of Object.entries(payload)) {
      if (count >= 80) break;
      if (typeof k !== "string" || k.length > 100) continue;
      if (v == null) continue;
      const str = typeof v === "string" ? v : typeof v === "number" || typeof v === "boolean" ? String(v) : "";
      safePayload[k] = str.slice(0, 2000);
      count++;
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const admin = supabaseUrl && serviceKey
      ? createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })
      : null;

    // ---- Save to the `leads` table first (service role - bypasses RLS).
    let leadId: string | null = null;
    if (admin) {
      const row: Record<string, unknown> = { zapier_status: "pending" };
      for (const col of LEAD_TEXT_COLUMNS) row[col] = safePayload[col] ?? "";
      const amountNum = Number(safePayload["amount"]);
      row["amount"] = safePayload["amount"] && Number.isFinite(amountNum) ? amountNum : null;

      const { data, error: insertErr } = await admin.from("leads").insert(row).select("id").single();
      if (insertErr) {
        console.error("submit-lead: leads insert failed", insertErr);
      } else {
        leadId = data?.id ?? null;
      }
    } else {
      console.warn("submit-lead: SUPABASE_URL/SERVICE_ROLE_KEY missing, lead not saved to DB");
    }

    // ---- Forward to Zapier. A Zapier failure never fails the request - the lead is
    // already saved above, and the caller must not be blocked from its thank-you redirect.
    let emailStatus = "Sent";
    let zapierError: string | null = null;
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(safePayload),
      });
      if (!r.ok) {
        const txt = await r.text();
        console.error("submit-lead: zapier non-ok", r.status, txt);
        emailStatus = "Failed";
        zapierError = `HTTP ${r.status}: ${txt.slice(0, 500)}`;
      }
    } catch (err) {
      console.error("submit-lead: zapier fetch error", err);
      emailStatus = "Failed";
      zapierError = err instanceof Error ? err.message : String(err);
    }

    if (leadId && admin) {
      const { error: updateErr } = await admin
        .from("leads")
        .update({ zapier_status: emailStatus === "Sent" ? "sent" : "failed", zapier_error: zapierError })
        .eq("id", leadId);
      if (updateErr) console.error("submit-lead: status update failed", updateErr);
    }

    return new Response(JSON.stringify({ success: emailStatus === "Sent", email_status: emailStatus, lead_id: leadId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("submit-lead error", err);
    return new Response(JSON.stringify({ error: "An internal error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
