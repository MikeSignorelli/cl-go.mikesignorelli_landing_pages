import { describe, it, expect } from "vitest";
import { computeReceipt } from "../../supabase/functions/_shared/iyf-order";

/** Amounts arrive from Stripe in cents. */
const session = (over: Record<string, unknown> = {}) => ({
  id: "cs_test_1",
  mode: "payment",
  amount_subtotal: 4700,
  amount_total: 5399,
  total_details: { amount_shipping: 699, amount_discount: 0, amount_tax: 0 },
  ...over,
});
const items = (cents = 4700, quantity = 1) => [
  { description: "Inherit Your Freedom", quantity, amount_subtotal: cents },
];

/** What the receipt prints must add up to the total it prints. */
const reconciles = (r: ReturnType<typeof computeReceipt>) =>
  Math.abs(r.subtotal - r.discount + r.tax + r.shipping - r.total) < 0.005;

describe("computeReceipt", () => {
  it("reads a normal order straight from Stripe's own totals", () => {
    const r = computeReceipt(session(), items());
    expect(r).toMatchObject({ quantity: 1, subtotal: 47, shipping: 6.99, total: 53.99 });
    expect(reconciles(r)).toBe(true);
  });

  it("reconciles when Stripe reports no shipping breakdown at all", () => {
    // The real failure: a receipt that read "$1.00 + Free = $2.00".
    const r = computeReceipt(
      session({ amount_subtotal: 100, amount_total: 200, total_details: {} }),
      items(100),
    );
    expect(r.subtotal).toBe(1);
    expect(r.total).toBe(2);
    expect(r.shipping).toBe(1); // the unexplained dollar, attributed to shipping
    expect(reconciles(r)).toBe(true);
  });

  it("falls back to shipping_cost when total_details omits it", () => {
    const r = computeReceipt(
      session({ total_details: {}, shipping_cost: { amount_total: 699 } }),
      items(),
    );
    expect(r.shipping).toBe(6.99);
    expect(reconciles(r)).toBe(true);
  });

  it("keeps discount and tax in the reconciliation", () => {
    const r = computeReceipt(
      session({
        amount_total: 5199,
        total_details: { amount_shipping: 699, amount_discount: 500, amount_tax: 300 },
      }),
      items(),
    );
    expect(r).toMatchObject({ discount: 5, tax: 3, shipping: 6.99, total: 51.99 });
    expect(reconciles(r)).toBe(true);
  });

  it("leaves shipping alone when the line items exceed what was charged", () => {
    // A negative remainder means something else is off; do not invent a discount.
    const r = computeReceipt(
      session({ amount_total: 1000, total_details: { amount_shipping: 699 } }),
      items(),
    );
    expect(r.shipping).toBe(6.99);
    expect(r.total).toBe(10);
  });

  it("sums quantity across line items and derives a unit price", () => {
    const r = computeReceipt(
      session({ amount_subtotal: 9400, amount_total: 10099 }),
      items(9400, 2),
    );
    expect(r.quantity).toBe(2);
    expect(r.unitPrice).toBe(47);
  });
});
