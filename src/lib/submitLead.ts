import { supabase } from "@/integrations/supabase/client";

export type FormType = "Lead" | "Checkout" | "Thank-You";

export interface LeadFields {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  role_title?: string;
  church_website?: string;
  church_size?: string;
  staff_count?: string;
  current_tools?: string;
  biggest_challenge?: string;
  preferred_call_time?: string;
  num_travelers?: string;
  departure_date?: string;
  room_type?: string;
  payment_plan_interest?: string;
  city?: string;
  state_region?: string;
  country?: string;
  postal_code?: string;
  product_package?: string;
  amount?: string | number;
  currency?: string;
  payment_status?: string;
  transaction_id?: string;
  coupon_code?: string;
  message?: string;
}

// Keys the Zapier payload always carries, in field-mapping order, so the sheet
// mapping stays stable across pages. Any OTHER key present in `fields` (a new
// input someone adds later) still rides along automatically - see submitLead.
const AUTOFILL_KEYS = ["submission_date", "submission_time", "page_name", "page_url", "form_type"] as const;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;
const CANONICAL_KEYS: (keyof LeadFields)[] = [
  "first_name", "last_name", "email", "phone",
  "organization", "role_title", "church_website", "church_size", "staff_count",
  "current_tools", "biggest_challenge", "preferred_call_time",
  "num_travelers", "departure_date", "room_type", "payment_plan_interest",
  "city", "state_region", "country", "postal_code",
  "product_package", "amount", "currency", "payment_status", "transaction_id", "coupon_code",
  "message",
];
const BASE_KEYS: string[] = [...AUTOFILL_KEYS, ...CANONICAL_KEYS, ...UTM_KEYS];
const EXCLUDE_FROM_BLOB = new Set([...AUTOFILL_KEYS, ...UTM_KEYS, "all_fields"]);

const normalizeValue = (key: string, value: unknown): string => {
  if (value === undefined || value === null) return "";
  const str = typeof value === "string" ? value : String(value);
  const trimmed = str.trim();
  return key === "email" ? trimmed.toLowerCase() : trimmed;
};

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

/**
 * Saves a lead to Supabase and forwards it to the single Zapier "All Leads"
 * webhook, routed through the submit-lead edge function so the webhook URL
 * never reaches the browser bundle. Never throws - a Zapier/network failure
 * must not block the caller's redirect.
 *
 * `fields` is expected to be pre-normalized snake_case (collectFormFields does
 * this for real <form> elements). Any key beyond the canonical list below is
 * forwarded as-is - a new input added later shows up in Zapier automatically,
 * no code change here required. It just won't have its own `leads` DB column
 * until one is migrated in; `all_fields` below preserves it either way.
 */
export async function submitLead(
  pageName: string,
  formType: FormType,
  fields: LeadFields & Record<string, unknown> = {},
): Promise<void> {
  const now = new Date();
  const utm = getUtmValues();

  const meta: Record<string, unknown> = {
    submission_date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
    submission_time: `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`,
    page_name: pageName,
    page_url: typeof window !== "undefined" ? window.location.href : "",
    form_type: formType,
    ...utm,
  };
  const fieldsRecord = fields as Record<string, unknown>;

  const payload: Record<string, string> = {};
  for (const key of AUTOFILL_KEYS) payload[key] = normalizeValue(key, meta[key]);
  for (const key of CANONICAL_KEYS) payload[key] = normalizeValue(key, fieldsRecord[key]);
  for (const key of UTM_KEYS) payload[key] = normalizeValue(key, meta[key]);
  for (const [key, value] of Object.entries(fields)) {
    if (BASE_KEYS.includes(key)) continue;
    payload[key] = normalizeValue(key, value);
  }

  const allFieldsStr = Object.entries(payload)
    .filter(([k, v]) => !EXCLUDE_FROM_BLOB.has(k) && v !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join(" | ");
  payload.all_fields = allFieldsStr;

  console.log("Zapier payload", payload);

  try {
    await supabase.functions.invoke("submit-lead", { body: { webhook: "all", payload } });
  } catch (err) {
    console.error("[submitLead] failed:", err);
  }
}

const CONTACT_STORAGE_PREFIX = "ms_contact_";

/** Persists a page's submitted contact fields so a later thank-you page can include them. */
export function persistContact(pageKey: string, fields: Record<string, unknown>): void {
  try {
    sessionStorage.setItem(CONTACT_STORAGE_PREFIX + pageKey, JSON.stringify(fields));
  } catch {
    // private-mode or storage disabled - thank-you page will just send blanks
  }
}

export function readPersistedContact(pageKey: string): Record<string, unknown> {
  try {
    const raw = sessionStorage.getItem(CONTACT_STORAGE_PREFIX + pageKey);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const THANK_YOU_SENT_PREFIX = "ms_ty_sent_";

/** Guards a thank-you page's one-time event against StrictMode double-invoke and page refresh. */
export function hasSentThankYou(key: string): boolean {
  try {
    return sessionStorage.getItem(THANK_YOU_SENT_PREFIX + key) === "1";
  } catch {
    return false;
  }
}

export function markThankYouSent(key: string): void {
  try {
    sessionStorage.setItem(THANK_YOU_SENT_PREFIX + key, "1");
  } catch {
    // if storage is unavailable there's nothing to guard against anyway
  }
}
