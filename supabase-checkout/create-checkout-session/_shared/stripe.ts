// Shared Stripe TEST/LIVE config selector. Picks the full credential set -
// secret key, webhook signing secret, price ID - for whichever mode
// STRIPE_MODE currently names, so switching modes is a single secret change
// rather than a redeploy. Duplicated verbatim into each function's own file
// tree, since this project deploys functions individually via the Supabase
// dashboard - there's no authenticated CLI session to share a workspace
// import map across functions.

import Stripe from "npm:stripe@17.7.0";

export type StripeMode = "test" | "live";

export interface StripeConfig {
  stripe: Stripe;
  mode: StripeMode;
  secretKey: string;
  priceId: string;
}

function requireEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`${name} is not configured`);
  return v;
}

export function getStripeMode(): StripeMode {
  return (Deno.env.get("STRIPE_MODE") || "").toLowerCase() === "live" ? "live" : "test";
}

// Secret key + price ID only - the webhook signing secret is fetched
// separately via getWebhookSecret() so that create-checkout-session (which
// never verifies a webhook) doesn't fail just because that secret happens
// to be unset.
export function getStripeConfig(): StripeConfig {
  const mode = getStripeMode();

  const secretKey = requireEnv(mode === "live" ? "STRIPE_SECRET_KEY_LIVE" : "STRIPE_SECRET_KEY_TEST");
  const priceId = requireEnv(mode === "live" ? "STRIPE_PRICE_ID_LIVE" : "STRIPE_PRICE_ID_TEST");

  // A key for the wrong mode must never be used even on a copy-paste mistake
  // between the two secret slots - fail fast with a clear message instead of
  // a cryptic Stripe API error surfacing later.
  if (mode === "live" && secretKey.startsWith("sk_test_")) {
    throw new Error("Stripe is misconfigured: STRIPE_SECRET_KEY_LIVE holds a test key");
  }
  if (mode === "test" && secretKey.startsWith("sk_live_")) {
    throw new Error("Stripe is misconfigured: STRIPE_SECRET_KEY_TEST holds a live key");
  }

  const stripe = new Stripe(secretKey, { apiVersion: "2024-11-20.acacia" });
  return { stripe, mode, secretKey, priceId };
}

export function getWebhookSecret(mode: StripeMode): string {
  return requireEnv(mode === "live" ? "STRIPE_WEBHOOK_SECRET_LIVE" : "STRIPE_WEBHOOK_SECRET_TEST");
}
