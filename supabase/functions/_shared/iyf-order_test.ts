import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { classifySession, computeReceipt, refundState } from "./iyf-order.ts";

const legacyMeta = {
  first_name: "Jane", last_name: "Doe", customer_phone: "1", shipping_street: "1 Main",
  shipping_city: "LA", shipping_state: "CA", shipping_zip: "90001", shipping_country: "US", quantity: "2",
};
const book = { description: "Inherit Your Freedom", quantity: 2, amount_subtotal: 9400, price: { recurring: null } };

Deno.test("1. new marked book checkout is eligible", () => {
  const s = { id: "cs_1", mode: "payment", metadata: { ...legacyMeta, product_type: "inherit-your-freedom" } };
  assertEquals(classifySession(s), { eligible: true, via: "marker" });
  assertEquals(classifySession(s, [book]), { eligible: true, via: "marker" });
});

Deno.test("2. legacy book checkout without marker is eligible", () => {
  const s = { id: "cs_2", mode: "payment", metadata: legacyMeta };
  assertEquals(classifySession(s, [book]), { eligible: true, via: "legacy" });
});

Deno.test("3. Ministry Leaders payment-link subscription is rejected", () => {
  const s = {
    id: "cs_ml", mode: "subscription", subscription: "sub_1UQ8phEJYM9YrDv1yyPsduGV",
    payment_link: "plink_1UP0maEJYM9YrDv1V10L1rYr", metadata: {},
  };
  assertEquals(classifySession(s).eligible, false);
  assertEquals(classifySession(s, [{ description: "Ministry Leaders", quantity: 1, price: { recurring: { interval: "month" } } }]).eligible, false);
});

Deno.test("4. unrelated subscription rejected even with copied metadata", () => {
  const s = { id: "cs_4", mode: "subscription", subscription: "sub_x", metadata: { ...legacyMeta, product_type: "inherit-your-freedom" } };
  assertEquals(classifySession(s).eligible, false);
});

Deno.test("5. unrelated one-time payment rejected", () => {
  assertEquals(classifySession({ id: "cs_5", mode: "payment", metadata: {} }).eligible, false);
  assertEquals(classifySession({ id: "cs_5b", mode: "payment", payment_link: "plink_x", metadata: legacyMeta }).eligible, false);
  assertEquals(classifySession({ id: "cs_5c", mode: "payment", metadata: { product_type: "other" } }).eligible, false);
  // metadata looks like a book but line items are something else
  assertEquals(classifySession({ id: "cs_5d", mode: "payment", metadata: legacyMeta }, [{ description: "Course", quantity: 1 }]).eligible, false);
  // mixed cart
  assertEquals(classifySession({ id: "cs_5e", mode: "payment", metadata: legacyMeta }, [book, { description: "Course", quantity: 1 }]).eligible, false);
});

Deno.test("6. missing / invalid session info rejected", () => {
  assertEquals(classifySession(null).eligible, false);
  assertEquals(classifySession({ mode: "payment" }).eligible, false);
  assertEquals(classifySession({ id: "cs_6", mode: "payment", metadata: { ...legacyMeta, shipping_zip: "" } }).eligible, false);
  assertEquals(classifySession({ id: "cs_6b", mode: "payment", metadata: legacyMeta }, []).eligible, false);
});

Deno.test("7. manual/thank-you call for unrelated product rejected by line-item check", () => {
  const s = { id: "cs_7", mode: "payment", metadata: { product_type: "inherit-your-freedom" } };
  assertEquals(classifySession(s, [{ description: "Unoffendable Heart", quantity: 1 }]).eligible, false);
});

Deno.test("9. receipt uses Stripe shipping, discount, tax", () => {
  const r = computeReceipt(
    { id: "cs_9", amount_subtotal: 9400, amount_total: 9300, total_details: { amount_shipping: 699, amount_discount: 1500, amount_tax: 701 } },
    [book],
  );
  assertEquals(r, { quantity: 2, subtotal: 94, shipping: 6.99, discount: 15, tax: 7.01, total: 93, unitPrice: 47 });
});

Deno.test("10. refund detection", () => {
  assertEquals(refundState(null), "none");
  assertEquals(refundState({ amount: 5399, amount_refunded: 0 }), "none");
  assertEquals(refundState({ amount: 5399, amount_refunded: 1000 }), "partial");
  assertEquals(refundState({ amount: 5399, amount_refunded: 5399 }), "full");
  assertEquals(refundState({ refunded: true }), "full");
});
