// Generic form-field collector: walks every input/select/textarea in a <form> and
// returns a snake_case keyed dict. New inputs are picked up automatically - no
// code change needed here when a form gains a field.

const SENSITIVE_PATTERN = /card|cvv|cvc|expiry|expiration|ccnum|password/i;

// Aliases for common real-world field names -> the canonical keys the Zapier
// sheet/leads table already know about. Kept conservative on purpose: a vague
// alias (e.g. bare "status" or "title") is more likely to mis-route a future,
// unrelated field than to help, so only unambiguous variants are listed.
const SYNONYMS: Record<string, string> = {
  firstname: "first_name",
  lastname: "last_name",
  email_address: "email",
  emailaddress: "email",
  phone_number: "phone",
  phonenumber: "phone",
  contact_number: "phone",
  contactnumber: "phone",
  travelers: "num_travelers",
  traveler_count: "num_travelers",
  questions: "message",
  comments: "message",
  special_requests: "message",
  zip: "postal_code",
  zip_code: "postal_code",
  zipcode: "postal_code",
  postcode: "postal_code",
  state: "state_region",
  region: "state_region",
  church_name: "organization",
  church: "organization",
  ministry: "organization",
  role: "role_title",
  position: "role_title",
  website: "church_website",
  number_of_staff: "staff_count",
  staff: "staff_count",
  tools: "current_tools",
  challenge: "biggest_challenge",
  call_time: "preferred_call_time",
  best_time_to_call: "preferred_call_time",
  travel_date: "departure_date",
  cabin_type: "room_type",
  payment_plan: "payment_plan_interest",
  product: "product_package",
  package: "product_package",
  total: "amount",
  price: "amount",
  order_id: "transaction_id",
  session_id: "transaction_id",
  coupon: "coupon_code",
  promo_code: "coupon_code",
};

function toSnakeCase(raw: string): string {
  const withBoundaries = raw
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2");
  return withBoundaries
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeKey(raw: string): string {
  const snake = toSnakeCase(raw);
  return SYNONYMS[snake] ?? snake;
}

function labelTextFor(el: HTMLElement, form: HTMLFormElement): string {
  if (el.id) {
    const byFor = form.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(el.id)}"]`);
    if (byFor?.textContent) return byFor.textContent;
  }
  const wrapping = el.closest("label");
  if (wrapping?.textContent) return wrapping.textContent;
  return "";
}

function keyFor(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, form: HTMLFormElement): string {
  const raw = el.name || el.id || labelTextFor(el, form) || el.getAttribute("placeholder") || "";
  return normalizeKey(raw);
}

function isSensitive(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
  const haystack = `${el.name || ""} ${el.id || ""} ${labelTextFor(el, el.form as HTMLFormElement)}`;
  return SENSITIVE_PATTERN.test(haystack);
}

const SKIP_INPUT_TYPES = new Set(["password", "button", "submit", "reset", "file", "image"]);

/** Collects every usable field in a form into a flat, normalized, snake_case dict. */
export function collectFormFields(form: HTMLFormElement): Record<string, string> {
  const fields: Record<string, string> = {};
  const elements = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    "input, select, textarea",
  ));

  const radioGroups = new Map<string, HTMLInputElement[]>();
  const checkboxGroups = new Map<string, HTMLInputElement[]>();

  for (const el of elements) {
    if (el instanceof HTMLInputElement && el.type === "hidden" && !el.name) continue;
    if (el instanceof HTMLInputElement && SKIP_INPUT_TYPES.has(el.type)) continue;
    if (isSensitive(el)) continue;

    if (el instanceof HTMLInputElement && el.type === "radio" && el.name) {
      if (!radioGroups.has(el.name)) radioGroups.set(el.name, []);
      radioGroups.get(el.name)!.push(el);
      continue;
    }
    if (el instanceof HTMLInputElement && el.type === "checkbox" && el.name) {
      if (!checkboxGroups.has(el.name)) checkboxGroups.set(el.name, []);
      checkboxGroups.get(el.name)!.push(el);
      continue;
    }

    const key = keyFor(el, form);
    if (!key) continue;
    fields[key] = el.value ?? "";
  }

  for (const [name, radios] of radioGroups) {
    const checked = radios.find((r) => r.checked);
    const key = normalizeKey(name);
    if (key) fields[key] = checked?.value ?? "";
  }

  for (const [name, boxes] of checkboxGroups) {
    const key = normalizeKey(name);
    if (!key) continue;
    if (boxes.length === 1) {
      fields[key] = boxes[0].checked ? "Yes" : "No";
    } else {
      fields[key] = boxes.filter((b) => b.checked).map((b) => b.value).join(", ");
    }
  }

  const nameKey = Object.keys(fields).find((k) => k === "name" || k === "full_name");
  if (nameKey && !fields.first_name && !fields.last_name && fields[nameKey]) {
    const [first, ...rest] = fields[nameKey].trim().split(/\s+/);
    fields.first_name = first ?? "";
    fields.last_name = rest.join(" ");
  }

  return fields;
}
