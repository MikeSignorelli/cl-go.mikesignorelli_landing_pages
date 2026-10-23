const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// One secret per page/webhook, kept server-side so the URL never reaches the
// public bundle. Add a new entry here (and matching secret) for each page
// that should route through this proxy.
const WEBHOOK_ENV: Record<string, string> = {
  fivefold: "ZAPIER_FIVEFOLD_WEBHOOK_URL",
};

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

    const webhook = typeof body.webhook === "string" ? body.webhook : "";
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

    let status = "Sent";
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
        status = "Failed";
        zapierError = `HTTP ${r.status}: ${txt.slice(0, 500)}`;
      }
    } catch (err) {
      console.error("submit-lead: zapier fetch error", err);
      status = "Failed";
      zapierError = err instanceof Error ? err.message : String(err);
    }

    return new Response(JSON.stringify({ success: status === "Sent", status, error: zapierError }), {
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
