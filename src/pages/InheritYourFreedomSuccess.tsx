import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, Mail, ArrowRight, AlertTriangle } from "lucide-react";
import IYFHeader from "@/components/iyf/IYFHeader";
import IYFFooter from "@/components/iyf/IYFFooter";
import { Button } from "@/components/ui/button";
import { checkoutSupabase } from "@/integrations/checkout/client";

const SUPPORT_EMAIL = "support@mikesignorelli.com";

type OrderStatus = "loading" | "pending" | "paid" | "failed" | "not_found";

interface OrderRow {
  status: string;
  quantity: number;
  amount_total: number | null;
  currency: string | null;
  created_at: string;
}

// The webhook that marks an order "paid" can land a second or two after the
// customer is redirected here, so poll briefly rather than show "failed"
// for an order that's simply still in flight.
const POLL_INTERVAL_MS = 1500;
const MAX_POLLS = 5;

const InheritYourFreedomSuccess = () => {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<OrderStatus>("loading");
  const [order, setOrder] = useState<OrderRow | null>(null);

  useEffect(() => {
    document.title = "Order Confirmed - Inherit Your Freedom | Mike Signorelli";
  }, []);

  useEffect(() => {
    if (!sessionId) {
      setStatus("not_found");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      const { data, error } = await checkoutSupabase.rpc("get_order_by_session", {
        p_session_id: sessionId,
      });
      if (cancelled) return;

      const row = Array.isArray(data) ? (data[0] as OrderRow | undefined) : undefined;
      if (error || !row) {
        attempts += 1;
        if (attempts >= MAX_POLLS) {
          setStatus("not_found");
          return;
        }
        setTimeout(poll, POLL_INTERVAL_MS);
        return;
      }

      setOrder(row);
      if (row.status === "paid") {
        setStatus("paid");
        return;
      }
      if (row.status === "failed") {
        setStatus("failed");
        return;
      }

      attempts += 1;
      if (attempts >= MAX_POLLS) {
        setStatus("pending");
        return;
      }
      setTimeout(poll, POLL_INTERVAL_MS);
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const formattedTotal =
    order?.amount_total != null
      ? `${((order.amount_total ?? 0) / 100).toFixed(2)} ${(order.currency ?? "usd").toUpperCase()}`
      : null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <IYFHeader />
      <main className="flex-1 pt-32 md:pt-36">
        <section className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24 text-center">
          {status === "loading" || status === "pending" ? (
            <>
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center">
                  <Loader2 size={42} className="text-secondary animate-spin" />
                </div>
              </div>
              <p className="subheading">Confirming Payment</p>
              <h1 className="heading-display text-foreground mb-6">
                Finishing Up Your Order
              </h1>
              <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                We're confirming your payment with Stripe - this usually takes just a few
                seconds. This page will update automatically.
              </p>
            </>
          ) : status === "paid" ? (
            <>
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center">
                  <CheckCircle2 size={42} className="text-secondary" />
                </div>
              </div>
              <p className="subheading">Order Confirmed</p>
              <h1 className="heading-display text-foreground mb-6">
                Your Order Confirmed Successfully
              </h1>
              <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-4">
                Thank you for your purchase. Your copy of{" "}
                <span className="text-foreground font-semibold">Inherit Your Freedom</span>
                {order && order.quantity > 1 ? ` (${order.quantity} copies)` : ""} will be
                delivered soon.
              </p>
              {formattedTotal && (
                <p className="font-body text-sm text-muted-foreground mb-4">
                  Total charged: <span className="text-foreground font-medium">${formattedTotal}</span>
                </p>
              )}
              <p className="font-body text-base text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
                For any enquiry please reach out to{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-secondary font-semibold hover:underline underline-offset-4"
                >
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>

              <div className="border border-border rounded-md bg-card p-6 md:p-8 shadow-[0_10px_40px_-20px_hsl(var(--olive)/0.2)] mb-10 text-left">
                <h2 className="font-heading uppercase tracking-widest text-xs text-muted-foreground mb-4">
                  What Happens Next
                </h2>
                <ul className="space-y-3 font-body text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span>You'll receive a confirmation email with your order details shortly.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span>Your book will be packed and shipped to the address you provided.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-secondary mt-1">•</span>
                    <span>Tracking information will be sent to your email once your order ships.</span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="hero" size="lg" className="gap-2">
                  <Link to="/inherit-your-freedom">
                    Back to Home
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <a href={`mailto:${SUPPORT_EMAIL}`}>
                    <Mail size={16} />
                    Contact Support
                  </a>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-center mb-8">
                <div className="w-20 h-20 rounded-full bg-destructive/10 border-2 border-destructive flex items-center justify-center">
                  <AlertTriangle size={42} className="text-destructive" />
                </div>
              </div>
              <p className="subheading">Payment Not Confirmed</p>
              <h1 className="heading-display text-foreground mb-6">
                We Couldn't Confirm This Order
              </h1>
              <p className="font-body text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto mb-10">
                {status === "failed"
                  ? "This payment didn't go through. You have not been charged - please try again, or reach out if you think this is a mistake."
                  : "We couldn't find a matching order for this link. If you just completed a payment, check your email for a receipt, or contact us below."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="hero" size="lg" className="gap-2">
                  <Link to="/inherit-your-freedom/checkout">
                    Try Again
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <a href={`mailto:${SUPPORT_EMAIL}`}>
                    <Mail size={16} />
                    Contact Support
                  </a>
                </Button>
              </div>
            </>
          )}
        </section>
      </main>
      <IYFFooter />
    </div>
  );
};

export default InheritYourFreedomSuccess;
