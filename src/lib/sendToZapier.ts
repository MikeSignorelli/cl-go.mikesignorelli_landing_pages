export type FormType = "Lead" | "Checkout" | "Thank-You";

const ZAPIER_WEBHOOK_URL = import.meta.env.VITE_ZAPIER_WEBHOOK_URL as string | undefined;
export const ZAPIER_WEBHOOK_URL_FIVEFOLD = import.meta.env.VITE_ZAPIER_WEBHOOK_URL_FIVEFOLD as
  | string
  | undefined;
export const ZAPIER_WEBHOOK_URL_PSA = import.meta.env.VITE_ZAPIER_WEBHOOK_URL_PSA as
  | string
  | undefined;

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
 * Posts a lead/thank-you event directly to the Zapier webhook in
 * VITE_ZAPIER_WEBHOOK_URL. Never throws - a network/webhook failure must
 * never block the caller's redirect.
 */
export async function sendToZapier(
  pageName: string,
  formType: FormType,
  fields: Record<string, unknown> = {},
  webhookUrl: string | undefined = ZAPIER_WEBHOOK_URL,
): Promise<void> {
  const payload = buildPayload(pageName, formType, fields);
  console.log("Zapier payload", payload);

  if (!webhookUrl) {
    console.error("[sendToZapier] no webhook URL configured for this call");
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("[sendToZapier] failed:", err);
  }
}

/**
 * Posts a lead/thank-you event through our own Supabase edge function, which
 * holds the real Zapier webhook URL server-side and forwards the request.
 * Unlike `sendToZapier`, the request never touches hooks.zapier.com from the
 * browser, so ad blockers that target Zapier's domain can't drop it.
 * `webhookKey` must match one of the keys the edge function's WEBHOOK_ENV
 * map recognizes (e.g. "fivefold"). Never throws.
 */
export async function sendToZapierViaEdge(
  pageName: string,
  formType: FormType,
  fields: Record<string, unknown> = {},
  webhookKey: string,
): Promise<void> {
  const payload = buildPayload(pageName, formType, fields);
  console.log("Zapier payload (via edge)", payload);

  if (!LEADS_SUPABASE_URL || !LEADS_SUPABASE_PUBLISHABLE_KEY) {
    console.error("[sendToZapierViaEdge] missing VITE_LEADS_SUPABASE_URL/VITE_LEADS_SUPABASE_PUBLISHABLE_KEY");
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
    console.error("[sendToZapierViaEdge] failed:", err);
  }
}
