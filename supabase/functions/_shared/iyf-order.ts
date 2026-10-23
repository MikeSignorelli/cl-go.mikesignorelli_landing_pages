// Pure, dependency-free helpers that decide whether a Stripe Checkout Session is
// a genuine Inherit Your Freedom book order and compute its receipt amounts.
// Shared by stripe-webhook (pre-filter) and notify-order (authoritative check).

export const IYF_PRODUCT_TYPE = "inherit-your-freedom";
export const IYF_PRODUCT_NAME = "Inherit Your Freedom";

// Metadata keys create-checkout has always written. Legacy sessions (created
// before product_type existed) must carry all of them.
export const LEGACY_METADATA_KEYS = [
  "first_name",
  "last_name",
  "shipping_street",
  "shipping_city",
  "shipping_zip",
  "quantity",
] as const;

export interface SessionLike {
  id?: string;
  mode?: string | null;
  subscription?: unknown;
  payment_link?: unknown;
  metadata?: Record<string, string> | null;
  amount_subtotal?: number | null;
  amount_total?: number | null;
  total_details?: {
    amount_discount?: number | null;
    amount_shipping?: number | null;
    amount_tax?: number | null;
  } | null;
  shipping_cost?: { amount_total?: number | null } | null;
}

export interface LineItemLike {
  description?: string | null;
  quantity?: number | null;
  amount_subtotal?: number | null;
  price?: { recurring?: unknown; product?: unknown } | null;
}

export type Classification =
  | { eligible: true; via: "marker" | "legacy" }
  | { eligible: false; reason: string };

/**
 * Decide if a session is an IYF book order.
 * - lineItems omitted: metadata/mode-only check (webhook pre-filter).
 * - lineItems provided: also require every line item to be the book (authoritative).
 */
export function classifySession(
  session: SessionLike | null | undefined,
  lineItems?: LineItemLike[] | null,
): Classification {
  if (!session || typeof session !== "object" || !session.id) {
    return { eligible: false, reason: "missing_session" };
  }
  if (session.mode !== "payment") {
    return { eligible: false, reason: `mode_${session.mode ?? "unknown"}` };
  }
  if (session.subscription) return { eligible: false, reason: "has_subscription" };
  if (session.payment_link) return { eligible: false, reason: "payment_link" };

  const m = session.metadata ?? {};
  let via: "marker" | "legacy";
  if (m.product_type === IYF_PRODUCT_TYPE) {
    via = "marker";
  } else if (m.product_type) {
    return { eligible: false, reason: `product_type_${m.product_type}` };
  } else if (LEGACY_METADATA_KEYS.every((k) => typeof m[k] === "string" && m[k].trim() !== "")) {
    via = "legacy";
  } else {
    return { eligible: false, reason: "no_iyf_marker_or_legacy_metadata" };
  }

  if (lineItems !== undefined) {
    if (!lineItems || lineItems.length === 0) {
      return { eligible: false, reason: "no_line_items" };
    }
    for (const li of lineItems) {
      if (li.price?.recurring) return { eligible: false, reason: "recurring_line_item" };
      if ((li.description ?? "").trim() !== IYF_PRODUCT_NAME) {
        return { eligible: false, reason: `foreign_line_item_${li.description ?? "unknown"}` };
      }
    }
  }
  return { eligible: true, via };
}

export interface Receipt {
  quantity: number;
  subtotal: number; // book line items, before discount
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  unitPrice: number;
}

const cents = (n: number | null | undefined) => (typeof n === "number" ? n : 0) / 100;

/** Receipt amounts taken from Stripe's own session totals - no hardcoded shipping. */
export function computeReceipt(session: SessionLike, lineItems: LineItemLike[]): Receipt {
  const quantity = lineItems.reduce((s, li) => s + (li.quantity ?? 0), 0) || 1;
  const itemsSubtotal = lineItems.reduce((s, li) => s + (li.amount_subtotal ?? 0), 0);
  const td = session.total_details ?? {};
  const shippingCents = td.amount_shipping ?? session.shipping_cost?.amount_total ?? 0;
  const subtotal = cents(itemsSubtotal || session.amount_subtotal);
  return {
    quantity,
    subtotal,
    shipping: cents(shippingCents),
    discount: cents(td.amount_discount),
    tax: cents(td.amount_tax),
    total: cents(session.amount_total),
    unitPrice: subtotal / quantity,
  };
}

export interface ChargeLike {
  amount?: number | null;
  amount_refunded?: number | null;
  refunded?: boolean | null;
}

export type RefundState = "none" | "partial" | "full";

export function refundState(charge: ChargeLike | null | undefined): RefundState {
  if (!charge) return "none";
  const refunded = charge.amount_refunded ?? 0;
  if (charge.refunded || (charge.amount && refunded >= charge.amount)) return "full";
  return refunded > 0 ? "partial" : "none";
}
