export type FormType = "Lead" | "Checkout" | "Thank-You";

/**
 * Destination for a submission. Each key maps to a server-side secret in the
 * submit-lead edge function; the real Zapier URL never reaches the browser.
 * Adding a key here means adding it to WEBHOOK_ENV in that function too.
 */
export type WebhookKey = "greece" | "psa" | "fivefold" | "all";

// Server-side proxy: posts go to our own Supabase edge function instead of
// directly to hooks.zapier.com, so ad blockers that target Zapier's domain
// can't silently drop the submission. The function holds the real Zapier
// webhook URL as a secret and forwards the request.
const LEADS_SUPABASE_URL = import.meta.env.VITE_LEADS_SUPABASE_URL as string | undefined;
const LEADS_SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_LEADS_SUPABASE_PUBLISHABLE_KEY as
  | string
  | undefined;

const UTM_STORAGE_KEY = "ms_utm";

interface UtmValues {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
}

const getUtmValues = (): UtmValues => {
  const fromUrl: Partial<UtmValues> = {};
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (params.has("utm_source")) fromUrl.utm_source = params.get("utm_source") ?? "";
    if (params.has("utm_medium")) fromUrl.utm_medium = params.get("utm_medium") ?? "";
    if (params.has("utm_campaign")) fromUrl.utm_campaign = params.get("utm_campaign") ?? "";
  }

  let stored: Partial<UtmValues> = {};
  try {
    const raw = sessionStorage.getItem(UTM_STORAGE_KEY);
    if (raw) stored = JSON.parse(raw);
  } catch {
    // malformed/unavailable sessionStorage - safe to ignore
  }

  const merged: UtmValues = {
    utm_source: fromUrl.utm_source ?? stored.utm_source ?? "",
    utm_medium: fromUrl.utm_medium ?? stored.utm_medium ?? "",
    utm_campaign: fromUrl.utm_campaign ?? stored.utm_campaign ?? "",
  };

  try {
    sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // private-mode or storage disabled - persistence is best-effort only
  }

  return merged;
};

const pad = (n: number) => String(n).padStart(2, "0");

const normalizeValue = (key: string, value: unknown): string => {
  if (value === undefined || value === null) return "";
  const str = typeof value === "string" ? value : String(value);
  const trimmed = str.trim();
  return key === "email" ? trimmed.toLowerCase() : trimmed;
};

function buildPayload(pageName: string, formType: FormType, fields: Record<string, unknown>): Record<string, string> {
  const now = new Date();
  const utm = getUtmValues();

  const raw: Record<string, unknown> = {
    submission_date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    submission_time: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
    page_name: pageName,
    page_url: typeof window !== "undefined" ? window.location.href : "",
    form_type: formType,
    ...utm,
    ...fields,
  };

  const payload: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) {
    payload[key] = normalizeValue(key, value);
  }

  const allFieldsStr = Object.entries(fields)
    .map(([k, v]) => [k, normalizeValue(k, v)] as const)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join(" | ");
  payload.all_fields = allFieldsStr;

  return payload;
}

/**
 * Posts a lead/thank-you event through our own Supabase edge function, which
 * holds the real Zapier webhook URL server-side, saves the lead to the `leads`
 * table and then forwards it.
 *
 * Every submission goes through here. The request never touches
 * hooks.zapier.com from the browser, so ad blockers that target Zapier's
 * domain can't silently drop a lead, and no webhook URL ships in the bundle.
 * Never throws - a failure must not block the caller's redirect.
 */
export async function sendToZapier(
  pageName: string,
  formType: FormType,
  fields: Record<string, unknown> = {},
  webhookKey: WebhookKey,
): Promise<void> {
  const payload = buildPayload(pageName, formType, fields);
  console.debug("[sendToZapier]", pageName, formType, webhookKey);

  if (!LEADS_SUPABASE_URL || !LEADS_SUPABASE_PUBLISHABLE_KEY) {
    console.error("[sendToZapier] missing VITE_LEADS_SUPABASE_URL/VITE_LEADS_SUPABASE_PUBLISHABLE_KEY");
    return;
  }

  try {
    await fetch(`${LEADS_SUPABASE_URL}/functions/v1/submit-lead`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LEADS_SUPABASE_PUBLISHABLE_KEY}`,
        apikey: LEADS_SUPABASE_PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ webhook: webhookKey, payload }),
    });
  } catch (err) {
    console.error("[sendToZapier] failed:", err);
  }
}
